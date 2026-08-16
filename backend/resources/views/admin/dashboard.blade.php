<x-admin.layout title="Dashboard">
    <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <a href="{{ route('admin.products.index') }}" class="admin-card flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600">
                <x-admin.icon name="products" class="h-4.5 w-4.5" />
            </span>
            <span>
                <span class="block text-xs text-slate-500">Products</span>
                <span class="block text-xl font-semibold tabular-nums">{{ $productCount }}</span>
            </span>
        </a>
        <a href="{{ route('admin.orders.index') }}?status=pending" class="admin-card flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600">
                <x-admin.icon name="orders" class="h-4.5 w-4.5" />
            </span>
            <span>
                <span class="block text-xs text-slate-500">Pending orders</span>
                <span class="block text-xl font-semibold tabular-nums">{{ $pendingOrderCount }}</span>
            </span>
        </a>
        <a href="{{ route('admin.reviews.index') }}?status=pending" class="admin-card flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600">
                <x-admin.icon name="reviews" class="h-4.5 w-4.5" />
            </span>
            <span>
                <span class="block text-xs text-slate-500">Reviews awaiting moderation</span>
                <span class="block text-xl font-semibold tabular-nums">{{ $pendingReviewCount }}</span>
            </span>
        </a>
    </div>

    <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 class="text-base font-semibold text-slate-900">Business overview <span class="text-sm font-normal text-slate-400">— channel filter applies to every figure and chart below except Inventory</span></h2>
        <div class="flex flex-wrap items-center gap-2">
            <div class="flex gap-1 rounded-md border border-slate-200 bg-white p-1 text-sm">
                @foreach (['today' => 'Today', 'week' => 'This week', 'month' => 'This month', 'all' => 'All time'] as $value => $label)
                    <a href="{{ route('admin.dashboard', array_filter(['range' => $value, 'source' => $source])) }}"
                       class="rounded px-3 py-1 transition-colors {{ $range === $value ? 'bg-[#1e3a5f] text-white' : 'text-slate-600 hover:bg-slate-100' }}">
                        {{ $label }}
                    </a>
                @endforeach
            </div>
            <form method="GET" action="{{ route('admin.dashboard') }}">
                <input type="hidden" name="range" value="{{ $range }}">
                <select name="source" onchange="this.form.submit()"
                        class="rounded-md border-slate-300 text-sm shadow-sm focus:border-slate-500 focus:ring-slate-500">
                    <option value="">All sources</option>
                    @foreach ($sourceOptions as $option)
                        <option value="{{ $option }}" @selected($source === $option)>{{ ucfirst($option) }}</option>
                    @endforeach
                </select>
            </form>
        </div>
    </div>

    <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="admin-card rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p class="text-xs font-medium uppercase tracking-wide text-slate-500">Revenue</p>
            <p class="mt-1 text-2xl font-semibold tabular-nums text-slate-900">₹{{ number_format($totalRevenue, 2) }}</p>
            <p class="mt-1 text-xs text-slate-400">{{ $orderCount }} order{{ $orderCount === 1 ? '' : 's' }}, excludes cancelled</p>
        </div>
        <div class="admin-card rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p class="text-xs font-medium uppercase tracking-wide text-slate-500">Gross profit</p>
            <p class="mt-1 text-2xl font-semibold tabular-nums {{ $grossProfit < 0 ? 'text-red-600' : 'text-emerald-600' }}">₹{{ number_format($grossProfit, 2) }}</p>
            <p class="mt-1 text-xs text-slate-400">
                Delivered orders only
                @if ($unitsMissingCost > 0)
                    · {{ $unitsMissingCost }} unit{{ $unitsMissingCost === 1 ? '' : 's' }} skipped (no cost price)
                @endif
            </p>
        </div>
        <div class="admin-card rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p class="text-xs font-medium uppercase tracking-wide text-slate-500">Expenses</p>
            <p class="mt-1 text-2xl font-semibold tabular-nums text-slate-900">₹{{ number_format($expensesTotal, 2) }}</p>
        </div>
        <div class="admin-card rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p class="text-xs font-medium uppercase tracking-wide text-slate-500">Net profit <span class="normal-case text-slate-400">(estimate)</span></p>
            <p class="mt-1 text-2xl font-semibold tabular-nums {{ $netProfit < 0 ? 'text-red-600' : 'text-emerald-600' }}">₹{{ number_format($netProfit, 2) }}</p>
            <p class="mt-1 text-xs text-slate-400">Gross profit minus expenses</p>
        </div>
    </div>

    <h2 class="mb-4 text-base font-semibold text-slate-900">Inventory <span class="text-sm font-normal text-slate-400">— current snapshot, not affected by the date range above</span></h2>
    <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div class="admin-card rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p class="text-xs font-medium uppercase tracking-wide text-slate-500">Total stock on hand</p>
            <p class="mt-1 text-2xl font-semibold tabular-nums text-slate-900">{{ number_format($inventory['totalUnits']) }} <span class="text-sm font-normal text-slate-400">units</span></p>
        </div>
        <div class="admin-card rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p class="text-xs font-medium uppercase tracking-wide text-slate-500">Inventory cost value</p>
            <p class="mt-1 text-2xl font-semibold tabular-nums text-slate-900">₹{{ number_format($inventory['totalCostValue'], 2) }}</p>
            <p class="mt-1 text-xs text-slate-400">
                What's on hand cost to buy
                @if ($inventory['unitsMissingCost'] > 0)
                    · {{ $inventory['unitsMissingCost'] }} unit{{ $inventory['unitsMissingCost'] === 1 ? '' : 's' }} excluded (no cost price)
                @endif
            </p>
        </div>
        <div class="admin-card rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p class="text-xs font-medium uppercase tracking-wide text-slate-500">Inventory value at selling price</p>
            <p class="mt-1 text-2xl font-semibold tabular-nums text-emerald-600">₹{{ number_format($inventory['totalRetailValue'], 2) }}</p>
            <p class="mt-1 text-xs text-slate-400">If everything on hand sold at today's listed prices</p>
        </div>
    </div>

    @php
        $trendPeriodLabel = $isCustomTrend
            ? \Illuminate\Support\Carbon::createFromFormat('Y-m', $trendFrom)->format('M Y').' – '.\Illuminate\Support\Carbon::createFromFormat('Y-m', $trendTo)->format('M Y')
            : 'last '.$trendMonths.' months';
    @endphp

    <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 class="text-base font-semibold text-slate-900">Trends <span class="text-sm font-normal text-slate-400">— own period control, independent of the filter above</span></h2>
        <div class="flex flex-wrap items-center gap-2 text-sm">
            <div class="flex gap-1 rounded-md border border-slate-200 bg-white p-1">
                @foreach ($trendMonthOptions as $months)
                    <a href="{{ route('admin.dashboard', array_filter(['range' => $range, 'trend_months' => $months])) }}"
                       class="rounded px-3 py-1 transition-colors {{ ! $isCustomTrend && $trendMonths === $months ? 'bg-[#1e3a5f] text-white' : 'text-slate-600 hover:bg-slate-100' }}">
                        {{ $months }} months
                    </a>
                @endforeach
                <button type="button" data-custom-trend-toggle
                        class="rounded px-3 py-1 transition-colors {{ $isCustomTrend ? 'bg-[#1e3a5f] text-white' : 'text-slate-600 hover:bg-slate-100' }}">
                    Custom
                </button>
            </div>
            <form method="GET" action="{{ route('admin.dashboard') }}"
                  data-custom-trend-form
                  class="{{ $isCustomTrend ? 'flex' : 'hidden' }} items-center gap-2 rounded-md border border-slate-200 bg-white p-1">
                <input type="hidden" name="range" value="{{ $range }}">
                <input type="month" name="trend_from" value="{{ $trendFrom }}" required
                       class="rounded border border-slate-200 px-2 py-1 text-sm text-slate-700">
                <span class="text-slate-400">to</span>
                <input type="month" name="trend_to" value="{{ $trendTo }}" required
                       class="rounded border border-slate-200 px-2 py-1 text-sm text-slate-700">
                <button type="submit" class="rounded bg-[#1e3a5f] px-3 py-1 text-white hover:bg-[#16304d]">Apply</button>
            </form>
        </div>
    </div>

    <div class="admin-card mb-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h3 class="mb-3 text-sm font-semibold text-slate-700">Sales trend <span class="font-normal text-slate-400">— {{ $trendPeriodLabel }}</span></h3>
        <div class="h-64">
            <canvas id="chart-sales-trend"></canvas>
        </div>
    </div>

    <div class="admin-card mb-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h3 class="mb-3 text-sm font-semibold text-slate-700">Gross profit vs. expenses <span class="font-normal text-slate-400">— {{ $trendPeriodLabel }}</span></h3>
        <div class="h-64">
            <canvas id="chart-profit-expense"></canvas>
        </div>
    </div>

    <div class="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div class="admin-card rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h3 class="mb-3 text-sm font-semibold text-slate-700">Order status breakdown</h3>
            @if ($orderStatusBreakdown->isEmpty())
                <div class="flex flex-col items-center gap-2 py-6 text-center">
                    <x-admin.icon name="inbox" class="h-7 w-7 text-slate-300" />
                    <p class="text-sm text-slate-500">No orders in this range.</p>
                </div>
            @else
                <div class="h-56">
                    <canvas id="chart-order-status"></canvas>
                </div>
            @endif
        </div>

        <div class="admin-card rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h3 class="mb-3 text-sm font-semibold text-slate-700">Stock</h3>
            <div class="mb-3 flex gap-4 text-sm">
                <span class="flex items-center gap-1"><span class="font-semibold tabular-nums text-amber-600">{{ $lowStockProducts->count() }}</span> low stock</span>
                <span class="flex items-center gap-1"><span class="font-semibold tabular-nums text-red-600">{{ $outOfStockProducts->count() }}</span> out of stock</span>
            </div>
            @if ($lowStockProducts->isEmpty() && $outOfStockProducts->isEmpty())
                <div class="flex flex-col items-center gap-2 py-6 text-center">
                    <x-admin.icon name="check" class="h-7 w-7 text-emerald-400" />
                    <p class="text-sm text-slate-500">All products adequately stocked.</p>
                </div>
            @else
                <ul class="space-y-1.5 text-sm">
                    @foreach ($outOfStockProducts->concat($lowStockProducts) as $product)
                        <li class="flex items-center justify-between">
                            <a href="{{ route('admin.products.edit', $product->id) }}" class="text-slate-700 hover:underline">{{ $product->title }}</a>
                            <span class="font-medium tabular-nums {{ $product->stock === 0 ? 'text-red-600' : 'text-amber-600' }}">
                                {{ $product->stock === 0 ? 'Out of stock' : $product->stock.' left' }}
                            </span>
                        </li>
                    @endforeach
                </ul>
            @endif
        </div>
    </div>

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div class="admin-card rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h3 class="mb-3 text-sm font-semibold text-slate-700">Revenue by category</h3>
            @if (empty($categorySales['labels']))
                <div class="flex flex-col items-center gap-2 py-6 text-center">
                    <x-admin.icon name="inbox" class="h-7 w-7 text-slate-300" />
                    <p class="text-sm text-slate-500">No sales in this range.</p>
                </div>
            @else
                <div class="h-64">
                    <canvas id="chart-category-sales"></canvas>
                </div>
            @endif
        </div>

        <div class="admin-card rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h3 class="mb-3 text-sm font-semibold text-slate-700">Top-selling products</h3>
            @if (empty($topProducts['labels']))
                <div class="flex flex-col items-center gap-2 py-6 text-center">
                    <x-admin.icon name="inbox" class="h-7 w-7 text-slate-300" />
                    <p class="text-sm text-slate-500">No sales in this range.</p>
                </div>
            @else
                <div class="h-64">
                    <canvas id="chart-top-products"></canvas>
                </div>
            @endif
        </div>
    </div>

    @php
        $dashboardChartsPayload = [
            'salesTrend' => $salesTrend,
            'profitExpenseTrend' => $profitExpenseTrend,
            'orderStatusBreakdown' => [
                'labels' => $orderStatusBreakdown->keys(),
                'counts' => $orderStatusBreakdown->values(),
            ],
            'categorySales' => $categorySales,
            'topProducts' => $topProducts,
        ];
    @endphp
    <script>
        window.__dashboardCharts = @json($dashboardChartsPayload);
    </script>
</x-admin.layout>
