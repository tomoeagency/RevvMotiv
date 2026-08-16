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

    // Guards the custom range against something like 2015-01 to now — the
    // chart and query both degrade past this many points.
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

        // Empty/blank = "All" — every order counts by default, manual
        // (Instagram/call/WhatsApp) included alongside website, since
        // they're all real sales. Picking one channel here narrows every
        // figure and chart below to just that source.
        $source = $request->string('source')->toString();
        if ($source !== '' && ! in_array($source, self::SOURCES, true)) {
            $source = '';
        }

        [$start, $end] = $this->rangeToDates($range);

        $ordersInRange = Order::when($start, fn ($q) => $q->whereBetween('created_at', [$start, $end]))
            ->when($source !== '', fn ($q) => $q->where('source', $source));

        $orderCount = (clone $ordersInRange)->count();

        $orderStatusBreakdown = (clone $ordersInRange)
            ->selectRaw('order_status, count(*) as count')
            ->groupBy('order_status')
            ->pluck('count', 'order_status');

        // Revenue: total_amount is already post-discount (see coupon logic in
        // OrderController@store) — this is what was actually charged.
        $totalRevenue = (clone $ordersInRange)->where('order_status', '!=', 'cancelled')->sum('total_amount');

        // Gross profit only counts `delivered` orders — the strongest signal
        // in this flow that a sale is real and won't be reversed (cancelled
        // orders never reach this status, and COD-remainder timing means
        // requiring payment_status = fully_paid too would under-count valid
        // deliveries where the COD leg hasn't been reconciled yet).
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
            'pendingOrderCount' => Order::where('order_status', 'pending')->count(),
            'pendingReviewCount' => Review::where('status', 'pending')->count(),
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

    // Resolves the Trends section's period to a concrete [months, since,
    // until] triple. A valid trend_from/trend_to pair (both "Y-m", from <=
    // to) wins over the 3/6/12-month preset; anything invalid or partial
    // falls back to the preset silently rather than erroring, since this
    // only ever comes from the dashboard's own date inputs.
    /** @return array{0: array<int, string>, 1: Carbon, 2: Carbon, 3: bool} */
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

    /** @return array<int, string> "Y-m" strings, oldest first, inclusive of both ends. */
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

    // Current inventory snapshot — not time-range filtered, unlike the sales
    // figures above, since "how much stock is on hand right now" has no
    // meaningful "this week vs this month" dimension. `price` is whatever
    // the admin currently has listed (already reflects any active sale via
    // compare_at_price), so the retail-value figure is automatically
    // sale/discount-aware without any extra logic here.
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

    /** @return array{0: ?Carbon, 1: ?Carbon} */
    private function rangeToDates(string $range): array
    {
        return match ($range) {
            'today' => [now()->startOfDay(), now()->endOfDay()],
            'week' => [now()->startOfWeek(), now()->endOfWeek()],
            'month' => [now()->startOfMonth(), now()->endOfMonth()],
            default => [null, null], // all-time — no filter
        };
    }

    private function monthFormatSql(string $column): string
    {
        return DB::connection()->getDriverName() === 'sqlite'
            ? "strftime('%Y-%m', {$column})"
            : "DATE_FORMAT({$column}, '%Y-%m')";
    }

    // Monthly revenue, one grouped query, no N+1. $months/$since/$until come
    // from resolveTrendPeriod() — either the 3/6/12-month preset or a custom
    // range, the query logic doesn't care which.
    private function salesTrendData(array $months, Carbon $since, Carbon $until, string $source = ''): array
    {
        $monthExpr = $this->monthFormatSql('created_at');
        $rows = Order::where('order_status', '!=', 'cancelled')
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

    // Monthly gross profit (delivered orders, cost-aware) vs monthly expenses.
    // Two separate grouped queries (orders+items, expenses) merged by month in PHP.
    private function profitExpenseTrendData(array $months, Carbon $since, Carbon $until, string $source = ''): array
    {
        $orderMonthExpr = $this->monthFormatSql('orders.created_at');
        $expenseMonthExpr = $this->monthFormatSql('expense_date');

        $profitRows = OrderItem::join('orders', 'orders.id', '=', 'order_items.order_id')
            ->where('orders.order_status', 'delivered')
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

    // Revenue per category for the current range filter — one grouped join query.
    private function categorySalesData(?Carbon $start, ?Carbon $end, string $source = ''): array
    {
        $rows = OrderItem::join('orders', 'orders.id', '=', 'order_items.order_id')
            ->join('products', 'products.id', '=', 'order_items.product_id')
            ->join('categories', 'categories.id', '=', 'products.category_id')
            ->where('orders.order_status', '!=', 'cancelled')
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

    // Top products by revenue for the current range filter — one grouped join query.
    private function topProductsData(?Carbon $start, ?Carbon $end, string $source = ''): array
    {
        $rows = OrderItem::join('orders', 'orders.id', '=', 'order_items.order_id')
            ->where('orders.order_status', '!=', 'cancelled')
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
