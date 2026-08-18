@props(['title' => 'Admin'])
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ $title }} · RevvMotiv Admin</title>
    <link rel="icon" type="image/png" href="{{ asset('favicon.png') }}">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-slate-50 text-slate-900 antialiased">
    <div class="flex min-h-screen">
        <aside class="admin-sidebar sticky top-0 z-10 flex h-screen w-60 shrink-0 flex-col bg-[#1e3a5f] text-slate-200">
            <div class="flex items-center justify-center bg-white px-4 py-4">
                <img src="{{ asset('images/logo.png') }}" alt="RevvMotiv" class="block w-[190px] max-w-full">
            </div>
            <nav class="flex-1 space-y-4 overflow-y-auto px-3 py-4 text-sm">
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
                            <p class="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">{{ $label }}</p>
                        @endif
                        <div class="space-y-0.5">
                            @foreach ($items as [$route, $itemLabel, $icon])
                                <a href="{{ route($route) }}"
                                   class="flex items-center gap-2.5 rounded-md px-3 py-2 transition-colors {{ request()->routeIs($route.'*') ? 'bg-white/10 text-white font-medium' : 'text-slate-300 hover:bg-white/5 hover:text-white' }}">
                                    <x-admin.icon :name="$icon" class="h-4 w-4 shrink-0" />
                                    <span class="truncate">{{ $itemLabel }}</span>
                                </a>
                            @endforeach
                        </div>
                    </div>
                @endforeach
            </nav>
        </aside>

        <div class="flex flex-1 flex-col">
            <header class="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
                <h1 class="text-lg font-semibold text-slate-900">{{ $title }}</h1>
                <div class="flex items-center gap-4">
                    <a href="{{ route('admin.account.edit') }}" class="flex items-center gap-2.5 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">
                        @if (auth()->user()?->avatar_url)
                            <img src="{{ auth()->user()->avatar_url }}" alt="{{ auth()->user()->name }}" class="h-7 w-7 rounded-full object-cover border border-slate-300 shadow-sm">
                        @else
                            <span class="flex h-7 w-7 items-center justify-center rounded-full bg-[#1e3a5f]/10 text-[#1e3a5f] font-bold text-xs">
                                {{ strtoupper(substr(auth()->user()?->name ?? 'A', 0, 1)) }}
                            </span>
                        @endif
                        <span>{{ auth()->user()?->name }}</span>
                    </a>
                    <form method="POST" action="{{ route('admin.logout') }}">
                        @csrf
                        <button type="submit" class="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 cursor-pointer">
                            <x-admin.icon name="logout" class="h-4 w-4" />
                            Log out
                        </button>
                    </form>
                </div>
            </header>

            <main class="flex-1 p-6">
                @if (session('status'))
                    <div class="mb-4 flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                        <x-admin.icon name="check" class="h-4 w-4 shrink-0" />
                        {{ session('status') }}
                    </div>
                @endif
                {{-- Field-level validation errors are shown inline via x-admin.form-field. --}}

                {{ $slot }}
            </main>
        </div>
    </div>
</body>
</html>
