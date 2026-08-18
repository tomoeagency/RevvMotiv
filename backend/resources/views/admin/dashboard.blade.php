<x-admin.layout title="Dashboard">
    <!-- Executive Dynamic Welcome Command Hero -->
    <div class="mb-8 relative overflow-hidden rounded-2xl p-6 sm:p-7 shadow-lg bg-gradient-to-br from-[#0f1c2e] via-[#162a42] to-[#0b1420] border border-slate-700/80 text-white">
        <!-- Subtle Ambient Background Glow -->
        <div class="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-red-600/15 blur-3xl"></div>
        <div class="pointer-events-none absolute -bottom-16 left-1/3 h-56 w-56 rounded-full bg-sky-500/10 blur-3xl"></div>

        <div class="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <!-- Left: Welcome & Brand Greeting -->
            <div class="space-y-2">
                <div class="flex items-center gap-2">
                    <span class="text-xs font-semibold font-mono text-slate-400" id="liveClock">{{ now()->format('l, d F Y · H:i') }} IST</span>
                </div>

                <div>
                    @php
                        $hour = (int) now()->format('H');
                        $greeting = $hour < 12 ? 'Good morning' : ($hour < 17 ? 'Good afternoon' : 'Good evening');
                        $userName = auth()->user()->name ?? 'Administrator';
                    @endphp
                    <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                        {{ $greeting }}, <span class="text-slate-100">{{ $userName }}</span>
                    </h1>
                    <p class="mt-1 text-xs sm:text-sm font-medium text-slate-400">
                        RevvMotiv Operations & Inventory Management Suite
                    </p>
                </div>
            </div>

            <!-- Right: Quick Executive Action Deck -->
            <div class="flex flex-wrap items-center gap-3">
                <a href="{{ route('admin.orders.index') }}?status=pending" 
                   class="group flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-3 shadow-md backdrop-blur-sm transition-all hover:scale-105">
                    <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400">
                        <x-admin.icon name="orders" class="h-4.5 w-4.5" />
                    </span>
                    <div>
                        <span class="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Order Queue</span>
                        <span class="block text-lg font-extrabold tabular-nums text-white">{{ $pendingOrderCount }} <span class="text-xs font-normal text-amber-400">pending</span></span>
                    </div>
                </a>

                <a href="{{ route('admin.reviews.index') }}?status=pending" 
                   class="group flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-3 shadow-md backdrop-blur-sm transition-all hover:scale-105">
                    <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-500/15 text-sky-400">
                        <x-admin.icon name="reviews" class="h-4.5 w-4.5" />
                    </span>
                    <div>
                        <span class="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Review Moderation</span>
                        <span class="block text-lg font-extrabold tabular-nums text-white">{{ $pendingReviewCount }} <span class="text-xs font-normal text-sky-400">new</span></span>
                    </div>
                </a>

                <a href="https://www.revvmotiv.com" target="_blank" rel="noopener noreferrer"
                   class="group flex items-center gap-2 rounded-xl border border-red-500/50 bg-red-600/20 px-4 py-3 text-xs font-bold text-red-200 shadow-md backdrop-blur-sm transition-all hover:scale-105">
                    <span>Live Store</span>
                    <svg class="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </a>
            </div>
        </div>
    </div>

    <!-- Section 1: Business Overview Header & Date Filters -->
    <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
            <h2 class="text-sm font-bold uppercase tracking-wider text-slate-800">Business Overview</h2>
            <p class="text-xs text-slate-500">Sales channel metrics, profit, and revenue telemetry.</p>
        </div>
        <div class="flex flex-wrap items-center gap-2.5">
            <div class="flex gap-1 rounded-lg border border-slate-200 bg-slate-100/90 p-1 text-xs font-semibold shadow-2xs">
                @foreach (['today' => 'Today', 'week' => 'This week', 'month' => 'This month', 'all' => 'All time'] as $value => $label)
                    <a href="{{ route('admin.dashboard', array_filter(['range' => $value, 'source' => $source])) }}"
                       class="rounded-md px-3 py-1.5 transition-all {{ $range === $value ? 'bg-[#1e3a5f] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900 hover:bg-white/60' }}">
                        {{ $label }}
                    </a>
                @endforeach
            </div>
            <form method="GET" action="{{ route('admin.dashboard') }}">
                <input type="hidden" name="range" value="{{ $range }}">
                <select name="source" onchange="this.form.submit()"
                        class="rounded-lg border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
                    <option value="">All sales channels</option>
                    @foreach ($sourceOptions as $option)
                        <option value="{{ $option }}" @selected($source === $option)>{{ ucfirst($option) }}</option>
                    @endforeach
                </select>
            </form>
        </div>
    </div>

    <!-- Metrics Stat Deck -->
    <div class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Total Revenue</span>
            <p class="mt-2 text-2xl font-bold tabular-nums text-slate-900">₹{{ number_format($totalRevenue, 2) }}</p>
            <p class="mt-1.5 text-xs text-slate-500">{{ $orderCount }} confirmed order{{ $orderCount === 1 ? '' : 's' }}</p>
        </div>
        <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Gross Profit</span>
            <p class="mt-2 text-2xl font-bold tabular-nums {{ $grossProfit < 0 ? 'text-rose-600' : 'text-emerald-600' }}">₹{{ number_format($grossProfit, 2) }}</p>
            <p class="mt-1.5 text-xs text-slate-500">
                Delivered orders
                @if ($unitsMissingCost > 0)
                    · {{ $unitsMissingCost }} unit{{ $unitsMissingCost === 1 ? '' : 's' }} excluded (no cost)
                @endif
            </p>
        </div>
        <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Recorded Expenses</span>
            <p class="mt-2 text-2xl font-bold tabular-nums text-slate-900">₹{{ number_format($expensesTotal, 2) }}</p>
            <p class="mt-1.5 text-xs text-slate-500">Operational & marketing costs</p>
        </div>
        <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Net Estimated Profit</span>
            <p class="mt-2 text-2xl font-bold tabular-nums {{ $netProfit < 0 ? 'text-rose-600' : 'text-emerald-600' }}">₹{{ number_format($netProfit, 2) }}</p>
            <p class="mt-1.5 text-xs text-slate-500">Gross profit minus recorded expenses</p>
        </div>
    </div>

    <!-- Section 2: Inventory Snapshot -->
    <div class="mb-4">
        <h2 class="text-sm font-bold uppercase tracking-wider text-slate-800">Live Inventory Snapshot</h2>
        <p class="text-xs text-slate-500">Current warehouse stock levels and stock valuation.</p>
    </div>
    <div class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Total Units On Hand</span>
            <p class="mt-2 text-2xl font-bold tabular-nums text-slate-900">{{ number_format($inventory['totalUnits']) }} <span class="text-xs font-normal text-slate-400">units</span></p>
            <p class="mt-1.5 text-xs text-slate-500">Physical stock across all catalog items</p>
        </div>
        <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Inventory Cost Value</span>
            <p class="mt-2 text-2xl font-bold tabular-nums text-slate-900">₹{{ number_format($inventory['totalCostValue'], 2) }}</p>
            <p class="mt-1.5 text-xs text-slate-500">
                Acquisition cost of stock on hand
                @if ($inventory['unitsMissingCost'] > 0)
                    · {{ $inventory['unitsMissingCost'] }} unit{{ $inventory['unitsMissingCost'] === 1 ? '' : 's' }} excluded
                @endif
            </p>
        </div>
        <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Retail Sales Valuation</span>
            <p class="mt-2 text-2xl font-bold tabular-nums text-emerald-600">₹{{ number_format($inventory['totalRetailValue'], 2) }}</p>
            <p class="mt-1.5 text-xs text-slate-500">Estimated value at listed storefront prices</p>
        </div>
    </div>

    @php
        $trendPeriodLabel = $isCustomTrend
            ? \Illuminate\Support\Carbon::createFromFormat('Y-m', $trendFrom)->format('M Y').' – '.\Illuminate\Support\Carbon::createFromFormat('Y-m', $trendTo)->format('M Y')
            : 'last '.$trendMonths.' months';
    @endphp

    <!-- Section 3: Performance Trends & Charts -->
    <div class="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
            <h2 class="text-sm font-bold uppercase tracking-wider text-slate-800">Performance Trends</h2>
            <p class="text-xs text-slate-500">Monthly revenue velocity and profit margins ({{ $trendPeriodLabel }}).</p>
        </div>
        <div class="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <div class="flex gap-1 rounded-lg border border-slate-200 bg-slate-100/90 p-1 shadow-2xs">
                @foreach ($trendMonthOptions as $months)
                    <a href="{{ route('admin.dashboard', array_filter(['range' => $range, 'trend_months' => $months])) }}"
                       class="rounded-md px-3 py-1.5 transition-all {{ ! $isCustomTrend && $trendMonths === $months ? 'bg-[#1e3a5f] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900 hover:bg-white/60' }}">
                        {{ $months }} months
                    </a>
                @endforeach
                <button type="button" data-custom-trend-toggle
                        class="rounded-md px-3 py-1.5 transition-all {{ $isCustomTrend ? 'bg-[#1e3a5f] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900 hover:bg-white/60' }}">
                    Custom
                </button>
            </div>
            <form method="GET" action="{{ route('admin.dashboard') }}"
                  data-custom-trend-form
                  class="{{ $isCustomTrend ? 'flex' : 'hidden' }} items-center gap-2 rounded-lg border border-slate-200 bg-white p-1 shadow-2xs">
                <input type="hidden" name="range" value="{{ $range }}">
                <input type="month" name="trend_from" value="{{ $trendFrom }}" required
                       class="rounded border border-slate-300 px-2 py-1 text-xs text-slate-700">
                <span class="text-slate-400">to</span>
                <input type="month" name="trend_to" value="{{ $trendTo }}" required
                       class="rounded border border-slate-300 px-2 py-1 text-xs text-slate-700">
                <button type="submit" class="rounded bg-[#1e3a5f] px-3 py-1 text-white hover:bg-[#16304d]">Apply</button>
            </form>
        </div>
    </div>

    <!-- Chart Containers -->
    <div class="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 class="mb-4 text-xs font-bold uppercase tracking-wider text-slate-700">Sales Trend</h3>
            <div class="h-64">
                <canvas id="chart-sales-trend"></canvas>
            </div>
        </div>

        <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 class="mb-4 text-xs font-bold uppercase tracking-wider text-slate-700">Gross Profit vs. Expenses</h3>
            <div class="h-64">
                <canvas id="chart-profit-expense"></canvas>
            </div>
        </div>
    </div>

    <!-- Stock Status & Category Breakdown Deck -->
    <div class="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- Order Status Breakdown -->
        <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 class="mb-4 text-xs font-bold uppercase tracking-wider text-slate-700">Order Status Breakdown</h3>
            @if ($orderStatusBreakdown->isEmpty())
                <div class="flex flex-col items-center justify-center gap-2 py-12 text-center">
                    <x-admin.icon name="inbox" class="h-7 w-7 text-slate-300" />
                    <p class="text-sm text-slate-500">No orders recorded in this date range.</p>
                </div>
            @else
                <div class="h-56">
                    <canvas id="chart-order-status"></canvas>
                </div>
            @endif
        </div>

        <!-- Stock Health Alert Deck -->
        <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
            <div>
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xs font-bold uppercase tracking-wider text-slate-700">Catalog Stock Health</h3>
                    <div class="flex items-center gap-3 text-xs font-bold">
                        <span class="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-amber-700 border border-amber-200">
                            {{ $lowStockProducts->count() }} low stock
                        </span>
                        <span class="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-rose-700 border border-rose-200">
                            {{ $outOfStockProducts->count() }} out of stock
                        </span>
                    </div>
                </div>

                @if ($lowStockProducts->isEmpty() && $outOfStockProducts->isEmpty())
                    <div class="flex flex-col items-center justify-center gap-2 py-12 text-center">
                        <div class="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                            <x-admin.icon name="check" class="h-5 w-5" />
                        </div>
                        <p class="text-sm font-medium text-slate-600">All catalog products are adequately stocked.</p>
                    </div>
                @else
                    <ul class="divide-y divide-slate-100 space-y-2 max-h-56 overflow-y-auto pr-1">
                        @foreach ($outOfStockProducts->concat($lowStockProducts) as $product)
                            <li class="flex items-center justify-between pt-2">
                                <a href="{{ route('admin.products.edit', $product->id) }}" class="text-xs font-semibold text-slate-800 hover:text-red-600 transition-colors truncate max-w-[220px]">
                                    {{ $product->title }}
                                </a>
                                <span class="font-bold font-mono text-xs tabular-nums {{ $product->stock === 0 ? 'text-rose-600' : 'text-amber-600' }}">
                                    {{ $product->stock === 0 ? '0 Units' : $product->stock . ' Units Left' }}
                                </span>
                            </li>
                        @endforeach
                    </ul>
                @endif
            </div>
        </div>
    </div>

    <!-- Category Sales & Top Sellers Grid -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 class="mb-4 text-xs font-bold uppercase tracking-wider text-slate-700">Revenue by Category</h3>
            @if (empty($categorySales['labels']))
                <div class="flex flex-col items-center justify-center gap-2 py-12 text-center">
                    <x-admin.icon name="inbox" class="h-7 w-7 text-slate-300" />
                    <p class="text-sm text-slate-500">No category sales recorded in this range.</p>
                </div>
            @else
                <div class="h-64">
                    <canvas id="chart-category-sales"></canvas>
                </div>
            @endif
        </div>

        <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 class="mb-4 text-xs font-bold uppercase tracking-wider text-slate-700">Top-Selling Products</h3>
            @if (empty($topProducts['labels']))
                <div class="flex flex-col items-center justify-center gap-2 py-12 text-center">
                    <x-admin.icon name="inbox" class="h-7 w-7 text-slate-300" />
                    <p class="text-sm text-slate-500">No product sales in this range.</p>
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
