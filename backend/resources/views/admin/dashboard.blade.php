<x-admin.layout title="Dashboard">
    <!-- Executive Dynamic Welcome Command Hero -->
    <div class="mb-8 relative overflow-hidden rounded-2xl p-6 sm:p-7 shadow-xl" 
         style="background: linear-gradient(135deg, #0f1c2e 0%, #162a42 50%, #0b1420 100%); border: 1.5px solid rgba(51, 65, 85, 0.8); color: #ffffff;">
        <!-- Subtle Ambient Background Light -->
        <div class="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full blur-3xl" style="background: rgba(201, 24, 43, 0.15);"></div>
        <div class="pointer-events-none absolute -bottom-16 left-1/3 h-56 w-56 rounded-full blur-3xl" style="background: rgba(14, 165, 233, 0.12);"></div>

        <div class="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <!-- Left: Welcome & Brand Greeting -->
            <div class="space-y-3">
                <div class="flex flex-wrap items-center gap-2.5">
                    <!-- Tomoe Emblem Badge -->
                    <div class="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold"
                         style="background: rgba(14, 165, 233, 0.18); border: 1px solid rgba(56, 189, 248, 0.4); color: #7dd3fc;">
                        <svg class="h-3.5 w-3.5" viewBox="0 0 100 100" fill="currentColor">
                            <rect x="32" y="31" width="7" height="7" rx="1.5" />
                            <rect x="50" y="28" width="9" height="9" rx="1.5" />
                        </svg>
                        <span>Tomoe Engine</span>
                    </div>

                    <!-- System Status Live Pulse -->
                    <div class="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold"
                         style="background: rgba(16, 185, 129, 0.18); border: 1px solid rgba(52, 211, 153, 0.4); color: #6ee7b7;">
                        <span class="relative flex h-2 w-2">
                            <span class="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style="background: #34d399;"></span>
                            <span class="relative inline-flex h-2 w-2 rounded-full" style="background: #10b981;"></span>
                        </span>
                        <span>Console Active</span>
                    </div>

                    <span style="color: #64748b;">·</span>
                    <span class="text-xs font-semibold font-mono" id="liveClock" style="color: #94a3b8;">{{ now()->format('D, d M Y · H:i') }} IST</span>
                </div>

                <div>
                    @php
                        $hour = (int) now()->format('H');
                        $greeting = $hour < 12 ? 'Good morning' : ($hour < 17 ? 'Good afternoon' : 'Good evening');
                        $userName = auth()->user()->name ?? 'Administrator';
                    @endphp
                    <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight" style="color: #ffffff;">
                        {{ $greeting }}, <span style="color: #f1f5f9;">{{ $userName }}</span>
                    </h1>
                    <p class="mt-1 text-xs sm:text-sm font-medium" style="color: #94a3b8;">
                        RevvMotiv Operations & Inventory Management Suite
                    </p>
                </div>
            </div>

            <!-- Right: Quick Executive Action Deck -->
            <div class="flex flex-wrap items-center gap-3">
                <a href="{{ route('admin.orders.index') }}?status=pending" 
                   class="group flex items-center gap-3 rounded-xl px-4 py-3 shadow-md backdrop-blur-sm transition-all hover:scale-105"
                   style="background: rgba(15, 23, 42, 0.85); border: 1px solid rgba(51, 65, 85, 0.7); text-decoration: none;">
                    <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style="background: rgba(245, 158, 11, 0.15); color: #fbbf24;">
                        <x-admin.icon name="orders" class="h-4.5 w-4.5" />
                    </span>
                    <div>
                        <span class="block text-[11px] font-bold uppercase tracking-wider" style="color: #94a3b8;">Order Queue</span>
                        <span class="block text-lg font-extrabold tabular-nums" style="color: #ffffff;">{{ $pendingOrderCount }} <span class="text-xs font-normal" style="color: #fbbf24;">pending</span></span>
                    </div>
                </a>

                <a href="{{ route('admin.reviews.index') }}?status=pending" 
                   class="group flex items-center gap-3 rounded-xl px-4 py-3 shadow-md backdrop-blur-sm transition-all hover:scale-105"
                   style="background: rgba(15, 23, 42, 0.85); border: 1px solid rgba(51, 65, 85, 0.7); text-decoration: none;">
                    <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style="background: rgba(14, 165, 233, 0.15); color: #38bdf8;">
                        <x-admin.icon name="reviews" class="h-4.5 w-4.5" />
                    </span>
                    <div>
                        <span class="block text-[11px] font-bold uppercase tracking-wider" style="color: #94a3b8;">Review Moderation</span>
                        <span class="block text-lg font-extrabold tabular-nums" style="color: #ffffff;">{{ $pendingReviewCount }} <span class="text-xs font-normal" style="color: #38bdf8;">new</span></span>
                    </div>
                </a>

                <a href="https://www.revvmotiv.com" target="_blank" rel="noopener noreferrer"
                   class="group flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-bold shadow-md backdrop-blur-sm transition-all hover:scale-105"
                   style="background: rgba(201, 24, 43, 0.25); border: 1.5px solid rgba(201, 24, 43, 0.6); color: #fecaca; text-decoration: none;">
                    <span>Live Store</span>
                    <svg class="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </a>
            </div>
        </div>
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
