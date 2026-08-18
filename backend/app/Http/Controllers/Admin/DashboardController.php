<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\View\View;

class DashboardController extends Controller
{
    private const RANGES = ['today', 'week', 'month', 'all'];

    private const SOURCES = ['website', 'instagram', 'call', 'whatsapp', 'other'];

    private const TREND_MONTH_OPTIONS = [3, 6, 12];

    private const DEFAULT_TREND_MONTHS = 6;

    private const MAX_CUSTOM_TREND_MONTHS = 36;

    public function __invoke(Request $request): View
    {
        $range = $request->string('range', 'month')->toString();
        if (! in_array($range, self::RANGES, true)) {
            $range = 'month';
        }

        $trendMonths = (int) $request->integer('trend_months', self::DEFAULT_TREND_MONTHS);
        if (! in_array($trendMonths, self::TREND_MONTH_OPTIONS, true)) {
            $trendMonths = self::DEFAULT_TREND_MONTHS;
        }

        $trendFrom = $request->string('trend_from')->toString();
        $trendTo = $request->string('trend_to')->toString();

        [$trendMonthsList, $trendSince, $trendUntil, $isCustomTrend] = $this->resolveTrendPeriod(
            $trendFrom,
            $trendTo,
            $trendMonths
        );

        $source = $request->string('source')->toString();
        if ($source !== '' && ! in_array($source, self::SOURCES, true)) {
            $source = '';
        }

        [$start, $end] = $this->rangeToDates($range);

        // Valid orders: must be paid (advance_paid or fully_paid) or a manual order entered by admin.
        // Unpaid/abandoned website checkout attempts are excluded.
        $ordersInRange = Order::where(function ($q) {
                $q->whereIn('payment_status', ['advance_paid', 'fully_paid'])
                  ->orWhere('source', '!=', 'website');
            })
            ->when($start, fn ($q) => $q->whereBetween('created_at', [$start, $end]))
            ->when($source !== '', fn ($q) => $q->where('source', $source));

        $orderCount = (clone $ordersInRange)->count();

        $orderStatusBreakdown = (clone $ordersInRange)
            ->selectRaw('order_status, count(*) as count')
            ->groupBy('order_status')
            ->pluck('count', 'order_status');

        $totalRevenue = (clone $ordersInRange)->where('order_status', '!=', 'cancelled')->sum('total_amount');

        $deliveredOrderIds = (clone $ordersInRange)->where('order_status', 'delivered')->pluck('id');

        $profitRow = OrderItem::whereIn('order_id', $deliveredOrderIds)
            ->selectRaw('
                SUM(CASE WHEN cost_price_applied IS NOT NULL THEN (unit_price - cost_price_applied) * quantity ELSE 0 END) as gross_profit,
                SUM(CASE WHEN cost_price_applied IS NULL THEN quantity ELSE 0 END) as units_missing_cost
            ')
            ->first();

        $grossProfit = (float) ($profitRow->gross_profit ?? 0);
        $unitsMissingCost = (int) ($profitRow->units_missing_cost ?? 0);

        $expensesTotal = (float) Expense::when($start, fn ($q) => $q->whereBetween('expense_date', [$start, $end]))->sum('amount');

        $netProfit = $grossProfit - $expensesTotal;

        return view('admin.dashboard', [
            'range' => $range,
            'source' => $source,
            'sourceOptions' => self::SOURCES,
            'trendMonths' => $trendMonths,
            'trendMonthOptions' => self::TREND_MONTH_OPTIONS,
            'trendFrom' => $trendFrom,
            'trendTo' => $trendTo,
            'isCustomTrend' => $isCustomTrend,
            'productCount' => Product::count(),
            'pendingOrderCount' => Order::where('order_status', 'pending')
                ->where(function ($q) {
                    $q->whereIn('payment_status', ['advance_paid', 'fully_paid'])
                      ->orWhere('source', '!=', 'website');
                })->count(),
            'pendingReviewCount' => Review::where('status', 'pending')->count(),
            'newLeadsCount' => \App\Models\Lead::count() + \App\Models\Enquiry::count(),
            'lowStockCount' => Product::where('stock', '<', 5)->count(),
            'lowStockProducts' => Product::where('stock', '>', 0)->where('stock', '<', 5)->orderBy('stock')->get(),
            'outOfStockProducts' => Product::where('stock', 0)->get(),
            'orderCount' => $orderCount,
            'orderStatusBreakdown' => $orderStatusBreakdown,
            'totalRevenue' => (float) $totalRevenue,
            'grossProfit' => $grossProfit,
            'unitsMissingCost' => $unitsMissingCost,
            'expensesTotal' => $expensesTotal,
            'netProfit' => $netProfit,
            'salesTrend' => $this->salesTrendData($trendMonthsList, $trendSince, $trendUntil, $source),
            'profitExpenseTrend' => $this->profitExpenseTrendData($trendMonthsList, $trendSince, $trendUntil, $source),
            'categorySales' => $this->categorySalesData($start, $end, $source),
            'topProducts' => $this->topProductsData($start, $end, $source),
            'inventory' => $this->inventoryValuationData(),
        ]);
    }

    private function resolveTrendPeriod(string $trendFrom, string $trendTo, int $presetMonths): array
    {
        if ($trendFrom !== '' && $trendTo !== '') {
            try {
                $since = Carbon::createFromFormat('Y-m', $trendFrom)->startOfMonth();
                $until = Carbon::createFromFormat('Y-m', $trendTo)->endOfMonth();
            } catch (\Exception) {
                $since = null;
                $until = null;
            }

            if ($since && $until && $since->lte($until)) {
                if ($since->diffInMonths($until) + 1 > self::MAX_CUSTOM_TREND_MONTHS) {
                    $since = (clone $until)->subMonths(self::MAX_CUSTOM_TREND_MONTHS - 1)->startOfMonth();
                }

                return [$this->monthsBetween($since, $until), $since, $until, true];
            }
        }

        $until = now()->endOfMonth();
        $since = now()->subMonths($presetMonths - 1)->startOfMonth();

        return [$this->monthsBetween($since, $until), $since, $until, false];
    }

    private function monthsBetween(Carbon $since, Carbon $until): array
    {
        $months = [];
        $cursor = $since->copy()->startOfMonth();
        $end = $until->copy()->startOfMonth();

        while ($cursor->lte($end)) {
            $months[] = $cursor->format('Y-m');
            $cursor->addMonth();
        }

        return $months;
    }

    private function inventoryValuationData(): array
    {
        $row = Product::where('status', 'active')
            ->selectRaw('
                SUM(stock) as total_units,
                SUM(CASE WHEN cost_price IS NOT NULL THEN stock * cost_price ELSE 0 END) as total_cost_value,
                SUM(stock * price) as total_retail_value,
                SUM(CASE WHEN cost_price IS NULL THEN stock ELSE 0 END) as units_missing_cost
            ')
            ->first();

        return [
            'totalUnits' => (int) ($row->total_units ?? 0),
            'totalCostValue' => (float) ($row->total_cost_value ?? 0),
            'totalRetailValue' => (float) ($row->total_retail_value ?? 0),
            'unitsMissingCost' => (int) ($row->units_missing_cost ?? 0),
        ];
    }

    private function rangeToDates(string $range): array
    {
        return match ($range) {
            'today' => [now()->startOfDay(), now()->endOfDay()],
            'week' => [now()->startOfWeek(), now()->endOfWeek()],
            'month' => [now()->startOfMonth(), now()->endOfMonth()],
            default => [null, null],
        };
    }

    private function monthFormatSql(string $column): string
    {
        return DB::connection()->getDriverName() === 'sqlite'
            ? "strftime('%Y-%m', {$column})"
            : "DATE_FORMAT({$column}, '%Y-%m')";
    }

    private function salesTrendData(array $months, Carbon $since, Carbon $until, string $source = ''): array
    {
        $monthExpr = $this->monthFormatSql('created_at');
        $rows = Order::where('order_status', '!=', 'cancelled')
            ->where(function ($q) {
                $q->whereIn('payment_status', ['advance_paid', 'fully_paid'])
                  ->orWhere('source', '!=', 'website');
            })
            ->whereBetween('created_at', [$since, $until])
            ->when($source !== '', fn ($q) => $q->where('source', $source))
            ->selectRaw("{$monthExpr} as month, SUM(total_amount) as revenue")
            ->groupBy('month')
            ->pluck('revenue', 'month');

        return [
            'labels' => array_map(fn ($m) => Carbon::createFromFormat('Y-m', $m)->format('M Y'), $months),
            'revenue' => collect($months)->map(fn ($m) => (float) ($rows[$m] ?? 0))->all(),
        ];
    }

    private function profitExpenseTrendData(array $months, Carbon $since, Carbon $until, string $source = ''): array
    {
        $orderMonthExpr = $this->monthFormatSql('orders.created_at');
        $expenseMonthExpr = $this->monthFormatSql('expense_date');

        $profitRows = OrderItem::join('orders', 'orders.id', '=', 'order_items.order_id')
            ->where('orders.order_status', 'delivered')
            ->where(function ($q) {
                $q->whereIn('orders.payment_status', ['advance_paid', 'fully_paid'])
                  ->orWhere('orders.source', '!=', 'website');
            })
            ->whereBetween('orders.created_at', [$since, $until])
            ->when($source !== '', fn ($q) => $q->where('orders.source', $source))
            ->selectRaw("
                {$orderMonthExpr} as month,
                SUM(CASE WHEN order_items.cost_price_applied IS NOT NULL THEN (order_items.unit_price - order_items.cost_price_applied) * order_items.quantity ELSE 0 END) as gross_profit
            ")
            ->groupBy('month')
            ->pluck('gross_profit', 'month');

        $expenseRows = Expense::whereBetween('expense_date', [$since, $until])
            ->selectRaw("{$expenseMonthExpr} as month, SUM(amount) as total")
            ->groupBy('month')
            ->pluck('total', 'month');

        return [
            'labels' => array_map(fn ($m) => Carbon::createFromFormat('Y-m', $m)->format('M Y'), $months),
            'grossProfit' => collect($months)->map(fn ($m) => (float) ($profitRows[$m] ?? 0))->all(),
            'expenses' => collect($months)->map(fn ($m) => (float) ($expenseRows[$m] ?? 0))->all(),
        ];
    }

    private function categorySalesData(?Carbon $start, ?Carbon $end, string $source = ''): array
    {
        $rows = OrderItem::join('orders', 'orders.id', '=', 'order_items.order_id')
            ->join('products', 'products.id', '=', 'order_items.product_id')
            ->join('categories', 'categories.id', '=', 'products.category_id')
            ->where('orders.order_status', '!=', 'cancelled')
            ->where(function ($q) {
                $q->whereIn('orders.payment_status', ['advance_paid', 'fully_paid'])
                  ->orWhere('orders.source', '!=', 'website');
            })
            ->when($start, fn ($q) => $q->whereBetween('orders.created_at', [$start, $end]))
            ->when($source !== '', fn ($q) => $q->where('orders.source', $source))
            ->selectRaw('categories.name as category, SUM(order_items.subtotal) as revenue')
            ->groupBy('categories.id', 'categories.name')
            ->orderByDesc('revenue')
            ->get();

        return [
            'labels' => $rows->pluck('category')->all(),
            'revenue' => $rows->pluck('revenue')->map(fn ($v) => (float) $v)->all(),
        ];
    }

    private function topProductsData(?Carbon $start, ?Carbon $end, string $source = ''): array
    {
        $rows = OrderItem::join('orders', 'orders.id', '=', 'order_items.order_id')
            ->where('orders.order_status', '!=', 'cancelled')
            ->where(function ($q) {
                $q->whereIn('orders.payment_status', ['advance_paid', 'fully_paid'])
                  ->orWhere('orders.source', '!=', 'website');
            })
            ->when($start, fn ($q) => $q->whereBetween('orders.created_at', [$start, $end]))
            ->when($source !== '', fn ($q) => $q->where('orders.source', $source))
            ->selectRaw('order_items.product_title as product, SUM(order_items.quantity) as units, SUM(order_items.subtotal) as revenue')
            ->groupBy('order_items.product_title')
            ->orderByDesc('revenue')
            ->limit(8)
            ->get();

        return [
            'labels' => $rows->pluck('product')->all(),
            'revenue' => $rows->pluck('revenue')->map(fn ($v) => (float) $v)->all(),
            'units' => $rows->pluck('units')->map(fn ($v) => (int) $v)->all(),
        ];
    }
}
