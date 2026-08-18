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
                   class="group flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-3 shadow-md backdrop-blur-sm transition-all hover:scale-105 hover:border-amber-500/50">
                    <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400 group-hover:bg-amber-500/25">
                        <x-admin.icon name="orders" class="h-4.5 w-4.5" />
                    </span>
                    <div>
                        <span class="block text-[11px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-300">Order Queue</span>
                        <span class="block text-lg font-extrabold tabular-nums text-white">{{ $pendingOrderCount }} <span class="text-xs font-normal text-amber-400">pending</span></span>
                    </div>
                </a>

                <a href="{{ route('admin.reviews.index') }}?status=pending" 
                   class="group flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-3 shadow-md backdrop-blur-sm transition-all hover:scale-105 hover:border-sky-500/50">
                    <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-500/15 text-sky-400 group-hover:bg-sky-500/25">
                        <x-admin.icon name="reviews" class="h-4.5 w-4.5" />
                    </span>
                    <div>
                        <span class="block text-[11px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-300">Review Moderation</span>
                        <span class="block text-lg font-extrabold tabular-nums text-white">{{ $pendingReviewCount }} <span class="text-xs font-normal text-sky-400">new</span></span>
                    </div>
                </a>

                <a href="{{ route('admin.leads-enquiries.index') }}" 
                   class="group flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-3 shadow-md backdrop-blur-sm transition-all hover:scale-105 hover:border-emerald-500/50">
                    <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400 group-hover:bg-emerald-500/25">
                        <svg class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </span>
                    <div>
                        <span class="block text-[11px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-300">Leads &amp; Enquiries</span>
                        <span class="block text-lg font-extrabold tabular-nums text-white">{{ $newLeadsCount }} <span class="text-xs font-normal text-emerald-400">total</span></span>
                    </div>
                </a>

                <a href="{{ route('admin.orders.create') }}" 
                   class="group flex items-center gap-2 rounded-xl border border-red-500 bg-gradient-to-r from-red-600 to-red-700 px-4 py-3 text-xs font-bold text-white shadow-lg backdrop-blur-sm transition-all hover:scale-105 hover:from-red-500 hover:to-red-600">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>+ New Order</span>
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

    <!-- Metrics Stat Deck (Clickable Links) -->
    <div class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <a href="{{ route('admin.orders.index') }}" 
           class="group rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-slate-400 hover:shadow-md flex flex-col justify-between cursor-pointer">
            <div class="flex items-center justify-between">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-900">Total Revenue</span>
                <span class="text-slate-400 group-hover:text-slate-700 transition-transform group-hover:translate-x-0.5">→</span>
            </div>
            <p class="mt-2 text-2xl font-bold tabular-nums text-slate-900">₹{{ number_format($totalRevenue, 2) }}</p>
            <p class="mt-1.5 text-xs text-slate-500">{{ $orderCount }} confirmed order{{ $orderCount === 1 ? '' : 's' }}</p>
        </a>

        <a href="{{ route('admin.orders.index') }}" 
           class="group rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-slate-400 hover:shadow-md flex flex-col justify-between cursor-pointer">
            <div class="flex items-center justify-between">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-900">Gross Profit</span>
                <span class="text-slate-400 group-hover:text-slate-700 transition-transform group-hover:translate-x-0.5">→</span>
            </div>
            <p class="mt-2 text-2xl font-bold tabular-nums {{ $grossProfit < 0 ? 'text-rose-600' : 'text-emerald-600' }}">₹{{ number_format($grossProfit, 2) }}</p>
            <p class="mt-1.5 text-xs text-slate-500">
                Delivered orders
                @if ($unitsMissingCost > 0)
                    · {{ $unitsMissingCost }} unit{{ $unitsMissingCost === 1 ? '' : 's' }} excluded
                @endif
            </p>
        </a>

        <a href="{{ route('admin.expenses.index') }}" 
           class="group rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-slate-400 hover:shadow-md flex flex-col justify-between cursor-pointer">
            <div class="flex items-center justify-between">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-900">Recorded Expenses</span>
                <span class="text-slate-400 group-hover:text-slate-700 transition-transform group-hover:translate-x-0.5">→</span>
            </div>
            <p class="mt-2 text-2xl font-bold tabular-nums text-slate-900">₹{{ number_format($expensesTotal, 2) }}</p>
            <p class="mt-1.5 text-xs text-slate-500">Operational &amp; marketing costs</p>
        </a>

        <a href="{{ route('admin.expenses.index') }}" 
           class="group rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-slate-400 hover:shadow-md flex flex-col justify-between cursor-pointer">
            <div class="flex items-center justify-between">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-900">Net Estimated Profit</span>
                <span class="text-slate-400 group-hover:text-slate-700 transition-transform group-hover:translate-x-0.5">→</span>
            </div>
            <p class="mt-2 text-2xl font-bold tabular-nums {{ $netProfit < 0 ? 'text-rose-600' : 'text-emerald-600' }}">₹{{ number_format($netProfit, 2) }}</p>
            <p class="mt-1.5 text-xs text-slate-500">Gross profit minus recorded expenses</p>
        </a>
    </div>

    <!-- Section 2: Inventory Snapshot (Clickable Links) -->
    <div class="mb-4">
        <h2 class="text-sm font-bold uppercase tracking-wider text-slate-800">Live Inventory Snapshot</h2>
        <p class="text-xs text-slate-500">Current warehouse stock levels and stock valuation.</p>
    </div>
    <div class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <a href="{{ route('admin.products.index') }}" 
           class="group rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-slate-400 hover:shadow-md cursor-pointer block">
            <div class="flex items-center justify-between">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-900">Total Units On Hand</span>
                <span class="text-slate-400 group-hover:text-slate-700 transition-transform group-hover:translate-x-0.5">→</span>
            </div>
            <p class="mt-2 text-2xl font-bold tabular-nums text-slate-900">{{ number_format($inventory['totalUnits']) }} <span class="text-xs font-normal text-slate-400">units</span></p>
            <p class="mt-1.5 text-xs text-slate-500">Physical stock across all catalog items</p>
        </a>

        <a href="{{ route('admin.products.index') }}" 
           class="group rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-slate-400 hover:shadow-md cursor-pointer block">
            <div class="flex items-center justify-between">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-900">Inventory Cost Value</span>
                <span class="text-slate-400 group-hover:text-slate-700 transition-transform group-hover:translate-x-0.5">→</span>
            </div>
            <p class="mt-2 text-2xl font-bold tabular-nums text-slate-900">₹{{ number_format($inventory['totalCostValue'], 2) }}</p>
            <p class="mt-1.5 text-xs text-slate-500">
                Acquisition cost of stock on hand
                @if ($inventory['unitsMissingCost'] > 0)
                    · {{ $inventory['unitsMissingCost'] }} unit{{ $inventory['unitsMissingCost'] === 1 ? '' : 's' }} excluded
                @endif
            </p>
        </a>

        <a href="{{ route('admin.products.index') }}" 
           class="group rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-slate-400 hover:shadow-md cursor-pointer block">
            <div class="flex items-center justify-between">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-900">Retail Sales Valuation</span>
                <span class="text-slate-400 group-hover:text-slate-700 transition-transform group-hover:translate-x-0.5">→</span>
            </div>
            <p class="mt-2 text-2xl font-bold tabular-nums text-emerald-600">₹{{ number_format($inventory['totalRetailValue'], 2) }}</p>
            <p class="mt-1.5 text-xs text-slate-500">Estimated value at listed storefront prices</p>
        </a>
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

        // Real-time IST Clock
        function updateLiveClock() {
            const clockEl = document.getElementById('liveClock');
            if (!clockEl) return;
            const now = new Date();
            const formatted = now.toLocaleDateString('en-IN', {
                timeZone: 'Asia/Kolkata',
                weekday: 'long',
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
            clockEl.textContent = formatted.replace(',', '') + ' IST';
        }
        setInterval(updateLiveClock, 1000);
    </script>
</x-admin.layout>
