@props(['name'])
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
     stroke-linecap="round" stroke-linejoin="round" {{ $attributes->merge(['class' => 'h-5 w-5']) }}>
    @switch($name)
        @case('dashboard')
            <rect x="3" y="3" width="7.5" height="7.5" rx="1.2"/>
            <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.2"/>
            <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.2"/>
            <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.2"/>
            @break
        @case('products')
            <path d="M21 8L12 3 3 8v8l9 5 9-5V8z"/>
            <path d="M3 8l9 5 9-5"/>
            <path d="M12 13v8"/>
            @break
        @case('categories')
            <path d="M3 3h8l10 10-8 8L3 11V3z"/>
            <circle cx="7.5" cy="7.5" r="1.4"/>
            @break
        @case('orders')
            <path d="M6 8h12l1 12H5L6 8z"/>
            <path d="M9 8V6a3 3 0 016 0v2"/>
            @break
        @case('projects')
            <rect x="3" y="4" width="18" height="14" rx="1.5"/>
            <circle cx="8.5" cy="9.5" r="1.5"/>
            <path d="M3 15l5-5 4 4 3-3 6 6"/>
            @break
        @case('gallery')
            <rect x="2.5" y="2.5" width="8" height="8" rx="1.2"/>
            <rect x="13.5" y="2.5" width="8" height="8" rx="1.2"/>
            <rect x="2.5" y="13.5" width="8" height="8" rx="1.2"/>
            <rect x="13.5" y="13.5" width="8" height="8" rx="1.2"/>
            @break
        @case('reviews')
            <path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5-4.7-4.6 6.5-.9z"/>
            @break
        @case('coupons')
            <path d="M4 8a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 000 4v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2a2 2 0 000-4V8z"/>
            <line x1="12" y1="6" x2="12" y2="18" stroke-dasharray="1.5 2"/>
            @break
        @case('expenses')
            <rect x="2" y="6" width="20" height="12" rx="2"/>
            <circle cx="12" cy="12" r="3"/>
            @break
        @case('leads')
            <circle cx="9" cy="8" r="3"/>
            <path d="M3 20c0-3 3-5 6-5s6 2 6 5"/>
            <circle cx="17.5" cy="7.5" r="2"/>
            <path d="M15.5 20c0-2.2 1-3.8 3-4.3"/>
            @break
        @case('announcements')
            <path d="M3 10v4h4l6 4V6l-6 4H3z"/>
            <path d="M17 9a4 4 0 010 6"/>
            @break
        @case('policies')
            <path d="M6 2h9l5 5v15H6V2z"/>
            <path d="M14 2v6h6"/>
            <line x1="9" y1="13" x2="15" y2="13"/>
            <line x1="9" y1="17" x2="15" y2="17"/>
            @break
        @case('settings')
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>
            @break
        @case('account')
            <circle cx="12" cy="12" r="9"/>
            <circle cx="12" cy="10" r="3"/>
            <path d="M6.5 18a5.5 5.5 0 0111 0"/>
            @break
        @case('logout')
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
            <path d="M16 17l5-5-5-5"/>
            <path d="M21 12H9"/>
            @break
        @case('edit')
            <path d="M12 20h9"/>
            <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z"/>
            @break
        @case('trash')
            <path d="M3 6h18"/>
            <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
            @break
        @case('plus')
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
            @break
        @case('search')
            <circle cx="11" cy="11" r="7"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            @break
        @case('check')
            <polyline points="4 12 9 17 20 6"/>
            @break
        @case('chevron-down')
            <polyline points="6 9 12 15 18 9"/>
            @break
        @case('trend-up')
            <polyline points="3 17 9 11 13 15 21 6"/>
            <polyline points="15 6 21 6 21 12"/>
            @break
        @case('trend-down')
            <polyline points="3 7 9 13 13 9 21 18"/>
            <polyline points="15 18 21 18 21 12"/>
            @break
        @case('inbox')
            <path d="M3 8l3-5h12l3 5"/>
            <path d="M3 8v10a2 2 0 002 2h14a2 2 0 002-2V8"/>
            <path d="M3 8h18"/>
            <path d="M9 12a3 3 0 006 0"/>
            @break
        @case('alert')
            <circle cx="12" cy="12" r="9"/>
            <line x1="12" y1="8" x2="12" y2="13"/>
            <circle cx="12" cy="16.3" r="0.4" fill="currentColor" stroke="none"/>
            @break
    @endswitch
</svg>
