<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tax Invoice — Order #{{ $order->id }} — RevvMotiv</title>
  <style>
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    @page {
      size: A4 portrait;
      margin: 8mm;
    }
    @media print {
      html, body {
        background: #ffffff !important;
        padding: 0 !important;
        margin: 0 !important;
        width: 100% !important;
        font-size: 10pt !important;
      }
      .invoice-container {
        box-shadow: none !important;
        border: none !important;
        padding: 12mm 14mm !important;
        margin: 0 auto !important;
        max-width: 100% !important;
        width: 100% !important;
        box-sizing: border-box !important;
      }
      .no-print {
        display: none !important;
      }
      .items-table tr {
        page-break-inside: avoid !important;
      }
      .summary-table {
        page-break-inside: avoid !important;
      }
    }
    body {
      margin: 0;
      padding: 30px 15px;
      background-color: #f1f5f9;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      -webkit-font-smoothing: antialiased;
    }
    .invoice-container {
      max-width: 740px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      padding: 32px 36px;
      box-sizing: border-box;
    }
    .header-table {
      width: 100%;
      table-layout: fixed;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    .logo-cell {
      width: 52%;
      vertical-align: top;
      padding-right: 12px;
    }
    .logo-title {
      font-size: 22px;
      font-weight: 900;
      letter-spacing: 1.5px;
      color: #0f172a;
      margin: 0;
      text-transform: uppercase;
    }
    .logo-title span {
      color: #dc2626;
    }
    .company-info {
      font-size: 11px;
      color: #64748b;
      line-height: 1.5;
      margin-top: 4px;
    }
    .invoice-title-cell {
      width: 45%;
      text-align: right;
      vertical-align: top;
    }
    .invoice-heading {
      font-size: 18px;
      font-weight: 900;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 0 0 4px 0;
    }
    .invoice-meta {
      font-size: 11px;
      color: #475569;
      line-height: 1.5;
    }
    .divider {
      height: 2px;
      background-color: #0f172a;
      margin: 14px 0 20px 0;
    }
    .parties-table {
      width: 100%;
      table-layout: fixed;
      border-collapse: collapse;
      margin-bottom: 22px;
    }
    .party-box {
      width: 48%;
      vertical-align: top;
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      padding: 12px 14px;
    }
    .party-spacer {
      width: 4%;
    }
    .party-heading {
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #64748b;
      margin-bottom: 6px;
    }
    .party-name {
      font-size: 13px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 3px;
    }
    .party-details {
      font-size: 11px;
      color: #334155;
      line-height: 1.5;
    }
    .items-table {
      width: 100%;
      table-layout: fixed;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    .items-table th {
      background-color: #0f172a !important;
      color: #ffffff !important;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 8px 10px;
      text-align: left;
    }
    .items-table td {
      padding: 10px;
      font-size: 11px;
      color: #1e293b;
      border-bottom: 1px solid #e2e8f0;
      word-wrap: break-word;
    }
    .items-table tr:nth-child(even) td {
      background-color: #f8fafc !important;
    }
    .summary-table {
      width: 100%;
      table-layout: fixed;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    .terms-cell {
      width: 48%;
      vertical-align: top;
      padding-right: 15px;
    }
    .calc-cell {
      width: 52%;
      vertical-align: top;
    }
    .calc-table {
      width: 100%;
      table-layout: fixed;
      border-collapse: collapse;
    }
    .calc-table td {
      padding: 5px 6px;
      font-size: 11px;
      color: #334155;
    }
    .calc-label {
      width: 60%;
      text-align: right;
      color: #64748b;
      font-weight: 600;
      padding-right: 8px;
    }
    .calc-val {
      width: 40%;
      text-align: right;
      font-weight: 700;
      color: #0f172a;
      white-space: nowrap;
    }
    .grand-total-row td {
      border-top: 2px solid #0f172a;
      border-bottom: 2px solid #0f172a;
      padding: 7px 6px;
      font-size: 13px;
      font-weight: 900;
      color: #0f172a;
    }
    .advance-paid-row td {
      background-color: #ecfdf5 !important;
      color: #047857 !important;
      font-weight: 700;
    }
    .balance-due-row td {
      background-color: #fff1f2 !important;
      color: #be123c !important;
      font-weight: 800;
      font-size: 12px;
    }
    .badge {
      display: inline-block;
      padding: 3px 6px;
      font-size: 9px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-radius: 3px;
    }
    .badge-paid {
      background-color: #d1fae5 !important;
      color: #065f46 !important;
      border: 1px solid #34d399;
    }
    .badge-advance {
      background-color: #e0e7ff !important;
      color: #3730a3 !important;
      border: 1px solid #818cf8;
    }
    .terms-box {
      border: 1px dashed #cbd5e1;
      background-color: #f8fafc !important;
      padding: 10px 12px;
      border-radius: 4px;
      font-size: 10px;
      color: #475569;
      line-height: 1.45;
    }
    .terms-title {
      font-weight: 800;
      text-transform: uppercase;
      font-size: 9.5px;
      color: #0f172a;
      margin-bottom: 3px;
    }
    .footer-note {
      text-align: center;
      font-size: 9.5px;
      color: #94a3b8;
      margin-top: 24px;
      border-top: 1px solid #e2e8f0;
      padding-top: 12px;
    }
    .print-bar {
      max-width: 760px;
      margin: 0 auto 15px auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .print-btn {
      background-color: #0f172a;
      color: #ffffff;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .print-btn:hover {
      background-color: #1e293b;
    }
  </style>
</head>
<body>
  <div class="print-bar no-print">
    <span style="font-size: 12px; color: #64748b;">Tax Invoice</span>
    <button onclick="window.print()" class="print-btn">
      🖨️ Print / Save as PDF
    </button>
  </div>

  <div class="invoice-container">
    <!-- Header -->
    <table class="header-table">
      <tr>
        <td class="logo-cell">
          <h1 class="logo-title">REVV<span>MOTIV</span></h1>
          <div class="company-info">
            <strong>RevvMotiv</strong><br>
            Site-5, Kasna, Greater Noida, Uttar Pradesh, India<br>
            Email: support@revvmotiv.com | Tel: +91 83683 43232
          </div>
        </td>
        <td class="invoice-title-cell">
          <div class="invoice-heading">TAX INVOICE</div>
          <div class="invoice-meta">
            <strong>Invoice No:</strong> RM-{{ str_pad($order->id, 5, '0', STR_PAD_LEFT) }}<br>
            <strong>Order ID:</strong> #{{ $order->id }}<br>
            <strong>Date:</strong> {{ $order->created_at ? $order->created_at->format('d/m/Y, h:i A') : now()->format('d/m/Y') }}<br>
            <strong>Payment Status:</strong> 
            @if($order->payment_status === 'fully_paid')
              <span class="badge badge-paid">FULLY PAID</span>
            @elseif($order->payment_status === 'advance_paid')
              <span class="badge badge-advance">ADVANCE PAID</span>
            @else
              <span class="badge" style="background:#fee2e2; color:#991b1b;">{{ strtoupper(str_replace('_', ' ', $order->payment_status)) }}</span>
            @endif
          </div>
        </td>
      </tr>
    </table>

    <div class="divider"></div>

    <!-- Billed To & Shipped To -->
    <table class="parties-table">
      <tr>
        <td class="party-box">
          <div class="party-heading">Billed & Shipped To:</div>
          <div class="party-name">{{ $order->customer_name }}</div>
          <div class="party-details">
            <strong>Phone:</strong> {{ $order->customer_phone }}<br>
            <strong>Email:</strong> {{ $order->customer_email ?? 'N/A' }}<br>
            <strong>Address:</strong> {{ $order->shipping_address ?? 'Standard Delivery' }}
          </div>
        </td>
        <td class="party-spacer"></td>
        <td class="party-box">
          <div class="party-heading">Payment & Gateway Details:</div>
          <div class="party-details">
            <strong>Payment Gateway:</strong> Razorpay Secure Gateway<br>
            <strong>Transaction / Ref ID:</strong> {{ $order->razorpay_payment_id ?? ($order->razorpay_order_id ?? 'Pending Verification') }}<br>
            <strong>Order Source:</strong> {{ ucfirst($order->source ?? 'Website') }}<br>
            <strong>Payment Terms:</strong> {{ $order->advance_percent_applied >= 100 ? '100% Prepaid Online' : $order->advance_percent_applied . '% Advance Online + Balance COD' }}
          </div>
        </td>
      </tr>
    </table>

    <!-- Items Table -->
    <table class="items-table">
      <thead>
        <tr>
          <th style="width: 5%;">#</th>
          <th style="width: 55%;">Item Description</th>
          <th style="width: 15%; text-align: center;">HSN/SAC</th>
          <th style="width: 10%; text-align: center;">Qty</th>
          <th style="width: 15%; text-align: right;">Amount (INR)</th>
        </tr>
      </thead>
      <tbody>
        @foreach($order->items as $index => $item)
        <tr>
          <td style="color: #64748b;">{{ $index + 1 }}</td>
          <td>
            <strong>{{ $item->product ? $item->product->title : 'Performance Component #' . $item->product_id }}</strong>
            <div style="font-size: 10px; color: #64748b;">Precision 1:1 OEM Fitment / Quality Inspected</div>
          </td>
          <td style="text-align: center; color: #64748b; font-size: 11px;">87082900</td>
          <td style="text-align: center; font-weight: 700;">{{ $item->quantity }}</td>
          <td style="text-align: right; font-weight: 700;">₹{{ number_format($item->unit_price * $item->quantity, 2) }}</td>
        </tr>
        @endforeach
      </tbody>
    </table>

    <!-- Calculation & Terms -->
    <table class="summary-table">
      <tr>
        <td class="terms-cell">
          <div class="terms-box">
            <div class="terms-title">Terms & Guarantee</div>
            • 100% Vehicle-Specific Test Fitment Guarantee.<br>
            • Inspect parcel condition upon delivery before balance handover.<br>
            • For tracking or fitment support, contact WhatsApp: <strong>+91 83683 43232</strong>.
          </div>
        </td>
        <td class="calc-cell">
          <table class="calc-table">
            <tr>
              <td class="calc-label">Subtotal:</td>
              <td class="calc-val">₹{{ number_format($order->total_amount + $order->discount_amount, 2) }}</td>
            </tr>
            @if($order->discount_amount > 0)
            <tr>
              <td class="calc-label">Discount ({{ $order->coupon_code }}):</td>
              <td class="calc-val" style="color: #dc2626;">−₹{{ number_format($order->discount_amount, 2) }}</td>
            </tr>
            @endif
            <tr class="grand-total-row">
              <td class="calc-label" style="color: #0f172a;">Total Invoice Value:</td>
              <td class="calc-val">₹{{ number_format($order->total_amount, 2) }}</td>
            </tr>
            <tr class="advance-paid-row">
              <td class="calc-label" style="color: #047857;">Advance Paid Online ({{ $order->advance_percent_applied }}%):</td>
              <td class="calc-val" style="color: #047857;">₹{{ number_format($order->advance_amount, 2) }}</td>
            </tr>
            <tr class="balance-due-row">
              <td class="calc-label" style="color: #be123c;">Balance Due on Delivery (COD):</td>
              <td class="calc-val" style="color: #be123c;">₹{{ number_format($order->remaining_amount, 2) }}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <div class="footer-note">
      This is a digitally generated invoice issued by RevvMotiv. Valid for all warranty and customer records.
    </div>
  </div>
</body>
</html>