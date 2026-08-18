@props(['title' => 'Admin'])
<!DOCTYPE html>
<html lang="en" class="h-full">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ $title }} · RevvMotiv Admin</title>
    <link rel="icon" type="image/png" href="{{ asset('favicon.png') }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <style>
        *::-webkit-scrollbar, html::-webkit-scrollbar, body::-webkit-scrollbar, nav::-webkit-scrollbar, aside::-webkit-scrollbar, div::-webkit-scrollbar {
            display: none !important;
            width: 0 !important;
            height: 0 !important;
            background: transparent !important;
        }
        * {
            -ms-overflow-style: none !important;
            scrollbar-width: none !important;
        }
    </style>
</head>
<body class="bg-slate-50 text-slate-900 antialiased font-sans flex flex-col min-h-full">
    <div class="flex flex-1 min-h-screen">
        <!-- Sidebar Navigation -->
        <aside class="admin-sidebar sticky top-0 z-30 flex h-screen w-64 shrink-0 flex-col bg-[#0f1c2e] text-slate-200 border-r border-slate-800/80">
            <!-- Brand Logo Area -->
            <div class="flex items-center justify-center bg-white px-5 py-4 border-b border-slate-200">
                <img src="{{ asset('images/logo.png') }}" alt="RevvMotiv" class="block w-[180px] max-w-full h-auto">
            </div>

            <!-- Navigation Links -->
            <nav class="flex-1 space-y-6 overflow-y-auto px-3.5 py-5 text-sm">
                @php
                    $navGroups = [
                        [null, [['admin.dashboard', 'Dashboard', 'dashboard']]],
                        ['Catalog', [
                            ['admin.products.index', 'Products', 'products'],
                            ['admin.categories.index', 'Categories', 'categories'],
                        ]],
                        ['Sales', [
                            ['admin.orders.index', 'Orders', 'orders'],
                            ['admin.coupons.index', 'Coupons', 'coupons'],
                        ]],
                        ['Content', [
                            ['admin.reviews.index', 'Reviews', 'reviews'],
                            ['admin.projects.index', 'Our Work', 'projects'],
                            ['admin.gallery.index', 'Gallery', 'gallery'],
                            ['admin.announcements.index', 'Announcements', 'announcements'],
                            ['admin.policies.index', 'Policies', 'policies'],
                        ]],
                        ['Operations', [
                            ['admin.expenses.index', 'Expenses', 'expenses'],
                            ['admin.leads-enquiries.index', 'Leads & Enquiries', 'leads'],
                        ]],
                        [null, [['admin.settings.edit', 'Settings', 'settings']]],
                    ];
                @endphp
                @foreach ($navGroups as [$label, $items])
                    <div>
                        @if ($label)
                            <p class="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400/90">{{ $label }}</p>
                        @endif
                        <div class="space-y-1">
                            @foreach ($items as [$route, $itemLabel, $icon])
                                @php
                                    $isActive = request()->routeIs($route.'*');
                                @endphp
                                <a href="{{ route($route) }}"
                                   class="group flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-150 {{ $isActive ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-sm shadow-red-600/30' : 'text-slate-300 hover:bg-white/10 hover:text-white' }}">
                                    <x-admin.icon :name="$icon" class="h-4 w-4 shrink-0 transition-transform group-hover:scale-110 {{ $isActive ? 'text-white' : 'text-slate-400 group-hover:text-white' }}" />
                                    <span class="truncate">{{ $itemLabel }}</span>
                                </a>
                            @endforeach
                        </div>
                    </div>
                @endforeach
            </nav>

            <!-- Sidebar Footer -->
            <div class="p-3 border-t border-slate-800 bg-[#0b1523]/80">
                <a href="https://www.revvmotiv.com" target="_blank" rel="noopener noreferrer"
                   class="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-colors">
                    <span class="flex items-center gap-2">
                        <svg class="h-3.5 w-3.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span>Live Storefront</span>
                    </span>
                    <span class="text-[10px] text-slate-500">↗</span>
                </a>
            </div>
        </aside>

        <!-- Main Content Area -->
        <div class="flex flex-1 flex-col min-w-0 bg-slate-50">
            <!-- Top Navbar Header -->
            <header class="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 backdrop-blur-md px-6 sm:px-8 shadow-2xs">
                <div class="flex items-center gap-3">
                    <h1 class="text-lg sm:text-xl font-bold tracking-tight text-slate-900">{{ $title }}</h1>
                </div>

                <div class="flex items-center gap-4 sm:gap-6">
                    <!-- User Profile Button -->
                    <a href="{{ route('admin.account.edit') }}"
                       class="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-xs font-semibold text-slate-800 hover:border-slate-300 hover:bg-slate-100 transition-all shadow-2xs">
                        @if (auth()->user()?->avatar_url)
                            <img src="{{ auth()->user()->avatar_url }}" alt="{{ auth()->user()->name }}" class="h-6 w-6 rounded-full object-cover border border-slate-300 shadow-xs">
                        @else
                            <span class="flex h-6 w-6 items-center justify-center rounded-full bg-[#1e3a5f] text-white font-bold text-[10px]">
                                {{ strtoupper(substr(auth()->user()?->name ?? 'A', 0, 1)) }}
                            </span>
                        @endif
                        <span>{{ auth()->user()?->name }}</span>
                    </a>

                    <!-- Logout Button -->
                    <form method="POST" action="{{ route('admin.logout') }}">
                        @csrf
                        <button type="submit"
                                class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors cursor-pointer py-1.5 px-2 rounded-md hover:bg-rose-50">
                            <x-admin.icon name="logout" class="h-4 w-4" />
                            <span>Log out</span>
                        </button>
                    </form>
                </div>
            </header>

            <!-- Main Page Viewport -->
            <main class="flex-1 p-6 sm:p-8 max-w-7xl w-full">
                <!-- Flash Notification Banner -->
                @if (session('status'))
                    <div class="mb-6 flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-sm font-medium text-emerald-900 shadow-2xs">
                        <div class="flex items-center gap-2.5">
                            <div class="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-200/80 text-emerald-800">
                                <x-admin.icon name="check" class="h-3.5 w-3.5" />
                            </div>
                            <span>{{ session('status') }}</span>
                        </div>
                    </div>
                @endif

                {{ $slot }}
            </main>
        </div>
    </div>
</body>
</html>
