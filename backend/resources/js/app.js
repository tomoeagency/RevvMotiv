import './bootstrap';
import { Chart } from 'chart.js/auto';

// Mac/iPhone photos are usually saved as HEIC/HEIF — a format most browsers
// can't display and this server can't decode (no Imagick/libheif on this
// host), which is why uploads that work fine from Windows (JPEG/PNG) fail
// from Mac. Converting client-side, the moment a HEIC file is picked, means
// every upload form in the admin panel just works regardless of source
// device — no per-form changes needed since this is delegated on document.
document.addEventListener('change', async (event) => {
    const input = event.target;
    if (! (input instanceof HTMLInputElement) || input.type !== 'file' || ! input.files?.length) return;

    const isHeic = (file) => file.type === 'image/heic' || file.type === 'image/heif' || /\.(heic|heif)$/i.test(file.name);
    const files = Array.from(input.files);
    if (! files.some(isHeic)) return;

    input.disabled = true;

    try {
        const { default: heic2any } = await import('heic2any');

        const converted = await Promise.all(files.map(async (file) => {
            if (! isHeic(file)) return file;
            const result = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.9 });
            const jpegBlob = Array.isArray(result) ? result[0] : result;
            const newName = file.name.replace(/\.(heic|heif)$/i, '.jpg');
            return new File([jpegBlob], newName, { type: 'image/jpeg' });
        }));

        const dataTransfer = new DataTransfer();
        converted.forEach((file) => dataTransfer.items.add(file));
        input.files = dataTransfer.files;
    } catch (error) {
        console.error('HEIC conversion failed:', error);
        alert("This photo is in Apple's HEIC format and couldn't be converted automatically. In Photos, use Share → Export → JPEG, then upload that file instead.");
        input.value = '';
    } finally {
        input.disabled = false;
    }
});

// Admin panel: show/hide toggle for any <x-admin.password-input>. Delegated
// on document so it works regardless of how many toggles are on a page.
document.addEventListener('click', (event) => {
    const toggle = event.target.closest('[data-password-toggle]');
    if (! toggle) return;

    const input = document.getElementById(toggle.dataset.passwordToggle);
    if (! input) return;

    const showing = input.type === 'text';
    input.type = showing ? 'password' : 'text';
    toggle.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
    toggle.querySelector('[data-icon-show]')?.classList.toggle('hidden', showing);
    toggle.querySelector('[data-icon-hide]')?.classList.toggle('hidden', ! showing);
});

// Dashboard "Trends" period control: reveal the custom from/to form instead
// of navigating, so picking "Custom" doesn't immediately submit an empty
// range — the Apply button inside the form does that once both months are set.
document.addEventListener('click', (event) => {
    const toggle = event.target.closest('[data-custom-trend-toggle]');
    if (! toggle) return;

    document.querySelector('[data-custom-trend-form]')?.classList.remove('hidden');
    toggle.classList.add('bg-[#1e3a5f]', 'text-white');
    toggle.classList.remove('text-slate-600', 'hover:bg-slate-100');
});

// Dashboard charts — no-op on any page that doesn't set window.__dashboardCharts
// (this bundle is loaded on every admin page, not just the dashboard).
const palette = {
    primary: '#1e3a5f',
    accent: '#2563eb',
    profit: '#16a34a',
    loss: '#dc2626',
    warning: '#d97706',
    slate: '#94a3b8',
    gridline: '#e2e8f0',
};

Chart.defaults.font.family = "'Fira Sans', ui-sans-serif, system-ui, sans-serif";
Chart.defaults.color = '#475569';
Chart.defaults.plugins.legend.labels.usePointStyle = true;

function money(value) {
    return '₹' + Number(value).toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

function initDashboardCharts() {
    const data = window.__dashboardCharts;
    if (! data) return;

    const salesTrendEl = document.getElementById('chart-sales-trend');
    if (salesTrendEl && data.salesTrend) {
        new Chart(salesTrendEl, {
            type: 'line',
            data: {
                labels: data.salesTrend.labels,
                datasets: [{
                    label: 'Revenue',
                    data: data.salesTrend.revenue,
                    borderColor: palette.primary,
                    backgroundColor: palette.primary + '1a',
                    fill: true,
                    tension: 0.3,
                    pointRadius: 3,
                }],
            },
            options: {
                plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => money(ctx.parsed.y) } } },
                scales: {
                    y: { beginAtZero: true, grid: { color: palette.gridline }, ticks: { callback: money } },
                    x: { grid: { display: false } },
                },
            },
        });
    }

    const statusEl = document.getElementById('chart-order-status');
    if (statusEl && data.orderStatusBreakdown && data.orderStatusBreakdown.labels.length) {
        const statusColors = {
            pending: palette.slate,
            confirmed: palette.accent,
            shipped: palette.accent,
            delivered: palette.profit,
            cancelled: palette.loss,
        };
        new Chart(statusEl, {
            type: 'doughnut',
            data: {
                labels: data.orderStatusBreakdown.labels,
                datasets: [{
                    data: data.orderStatusBreakdown.counts,
                    backgroundColor: data.orderStatusBreakdown.labels.map((s) => statusColors[s] || palette.slate),
                    borderWidth: 2,
                    borderColor: '#ffffff',
                }],
            },
            options: {
                plugins: { legend: { position: 'right' } },
                cutout: '60%',
            },
        });
    }

    const categoryEl = document.getElementById('chart-category-sales');
    if (categoryEl && data.categorySales && data.categorySales.labels.length) {
        new Chart(categoryEl, {
            type: 'bar',
            data: {
                labels: data.categorySales.labels,
                datasets: [{ label: 'Revenue', data: data.categorySales.revenue, backgroundColor: palette.accent, borderRadius: 4 }],
            },
            options: {
                plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => money(ctx.parsed.y) } } },
                scales: {
                    y: { beginAtZero: true, grid: { color: palette.gridline }, ticks: { callback: money } },
                    x: { grid: { display: false } },
                },
            },
        });
    }

    const profitExpenseEl = document.getElementById('chart-profit-expense');
    if (profitExpenseEl && data.profitExpenseTrend) {
        new Chart(profitExpenseEl, {
            type: 'bar',
            data: {
                labels: data.profitExpenseTrend.labels,
                datasets: [
                    { label: 'Gross profit', data: data.profitExpenseTrend.grossProfit, backgroundColor: palette.profit, borderRadius: 4 },
                    { label: 'Expenses', data: data.profitExpenseTrend.expenses, backgroundColor: palette.warning, borderRadius: 4 },
                ],
            },
            options: {
                plugins: { tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ${money(ctx.parsed.y)}` } } },
                scales: {
                    y: { beginAtZero: true, grid: { color: palette.gridline }, ticks: { callback: money } },
                    x: { grid: { display: false } },
                },
            },
        });
    }

    const topProductsEl = document.getElementById('chart-top-products');
    if (topProductsEl && data.topProducts && data.topProducts.labels.length) {
        new Chart(topProductsEl, {
            type: 'bar',
            data: {
                labels: data.topProducts.labels,
                datasets: [{ label: 'Revenue', data: data.topProducts.revenue, backgroundColor: palette.primary, borderRadius: 4 }],
            },
            options: {
                indexAxis: 'y',
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => `${money(ctx.parsed.x)} (${data.topProducts.units[ctx.dataIndex]} units)`,
                        },
                    },
                },
                scales: {
                    x: { beginAtZero: true, grid: { color: palette.gridline }, ticks: { callback: money } },
                    y: { grid: { display: false } },
                },
            },
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDashboardCharts);
} else {
    initDashboardCharts();
}

// Manual order form — no-op on any page that doesn't render #item-rows
// (this bundle is loaded on every admin page, not just order creation).
function initManualOrderForm() {
    const tbody = document.getElementById('item-rows');
    if (! tbody) return;

    const products = window.__manualOrderProducts || [];
    const oldItems = window.__manualOrderOldItems || [];
    const totalEl = document.getElementById('order-total');
    let rowIndex = 0;

    function money(value) {
        return '₹' + (Number(value) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function recalcTotal() {
        let total = 0;
        tbody.querySelectorAll('tr').forEach((row) => {
            const qty = Number(row.querySelector('.item-qty')?.value) || 0;
            const price = Number(row.querySelector('.item-price')?.value) || 0;
            const subtotal = qty * price;
            row.querySelector('.item-subtotal').textContent = money(subtotal);
            total += subtotal;
        });
        if (totalEl) totalEl.textContent = money(total);
    }

    function addRow(prefill) {
        const index = rowIndex++;
        const row = document.createElement('tr');

        const options = ['<option value="">Select a product</option>']
            .concat(products.map((p) => `<option value="${p.id}" data-price="${p.price}" data-stock="${p.stock}" ${prefill && String(prefill.product_id) === String(p.id) ? 'selected' : ''}>${p.title}</option>`))
            .join('');

        row.innerHTML = `
            <td class="px-3 py-2">
                <select name="items[${index}][product_id]" required
                        class="item-product block w-full rounded-md border-slate-300 text-sm shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f]">
                    ${options}
                </select>
            </td>
            <td class="item-stock px-3 py-2 text-slate-500">—</td>
            <td class="px-3 py-2">
                <input type="number" name="items[${index}][quantity]" min="1" max="99" value="${prefill?.quantity ?? 1}" required
                       class="item-qty block w-full rounded-md border-slate-300 text-sm shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f]">
            </td>
            <td class="px-3 py-2">
                <input type="number" step="0.01" min="0" name="items[${index}][price_at_order]" value="${prefill?.price_at_order ?? ''}" placeholder="Catalog price"
                       class="item-price block w-full rounded-md border-slate-300 text-sm shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f]">
            </td>
            <td class="item-subtotal px-3 py-2 text-right tabular-nums text-slate-700">₹0.00</td>
            <td class="px-3 py-2 text-right">
                <button type="button" class="remove-row text-red-500 hover:text-red-700" aria-label="Remove item">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-4 w-4"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
                </button>
            </td>
        `;

        tbody.appendChild(row);

        const select = row.querySelector('.item-product');
        const priceInput = row.querySelector('.item-price');
        const qtyInput = row.querySelector('.item-qty');
        const stockCell = row.querySelector('.item-stock');

        function syncProductInfo() {
            const opt = select.selectedOptions[0];
            if (! opt || ! opt.value) {
                stockCell.textContent = '—';
                return;
            }
            stockCell.textContent = `${opt.dataset.stock} unit${opt.dataset.stock === '1' ? '' : 's'}`;
            // Only default the price when the admin hasn't already typed a
            // negotiated override — switching products shouldn't clobber
            // a deliberately-entered custom price.
            if (! priceInput.dataset.userEdited) {
                priceInput.value = Number(opt.dataset.price).toFixed(2);
            }
            recalcTotal();
        }

        select.addEventListener('change', syncProductInfo);
        priceInput.addEventListener('input', () => { priceInput.dataset.userEdited = '1'; recalcTotal(); });
        qtyInput.addEventListener('input', recalcTotal);
        row.querySelector('.remove-row').addEventListener('click', () => {
            // Always keep at least one row — an empty item table can't submit.
            if (tbody.querySelectorAll('tr').length > 1) {
                row.remove();
                recalcTotal();
            }
        });

        if (prefill) {
            priceInput.dataset.userEdited = prefill.price_at_order ? '1' : '';
        }
        syncProductInfo();
    }

    document.getElementById('add-item-row')?.addEventListener('click', () => addRow());

    if (oldItems.length) {
        oldItems.forEach((item) => addRow(item));
    } else {
        addRow();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initManualOrderForm);
} else {
    initManualOrderForm();
}
