<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation & Invoice — Order #{{ $order->id }} — RevvMotiv</title>
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
      .email-wrapper {
        padding: 0 !important;
        background: #ffffff !important;
      }
      .invoice-container {
        box-shadow: none !important;
        border: none !important;
        padding: 0 !important;
        max-width: 100% !important;
        width: 100% !important;
      }
      .no-print {
        display: none !important;
      }
    }
    body {
      margin: 0;
      padding: 0;
      background-color: #0b0d10;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      -webkit-font-smoothing: antialiased;
    }
    .email-wrapper {
      width: 100%;
      background-color: #0b0d10;
      padding: 30px 15px;
    }
    .invoice-container {
      max-width: 680px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
    }
    .email-brand-header {
      background: #000000;
      background: linear-gradient(135deg, #111418 0%, #000000 100%);
      padding: 24px 32px;
      border-bottom: 3px solid #dc2626;
    }
    .brand-logo {
      font-size: 24px;
      font-weight: 900;
      letter-spacing: 2px;
      color: #ffffff;
      margin: 0;
      text-transform: uppercase;
    }
    .brand-logo span {
      color: #dc2626;
    }
    .brand-tagline {
      font-size: 11px;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 4px;
    }
    .content-body {
      padding: 30px 32px;
    }
    .status-banner {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 4px solid #dc2626;
      padding: 16px 20px;
      border-radius: 4px;
      margin-bottom: 24px;
    }
    .status-title {
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 4px;
    }
    .status-desc {
      font-size: 13px;
      color: #475569;
      line-height: 1.5;
      margin: 0;
    }
    .meta-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    .meta-box {
      width: 48%;
      vertical-align: top;
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 14px 16px;
    }
    .meta-spacer {
      width: 4%;
    }
    .meta-heading {
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #dc2626;
      margin-bottom: 6px;
    }
    .meta-title {
      font-size: 14px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 4px;
    }
    .meta-details {
      font-size: 12px;
      color: #334155;
      line-height: 1.5;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    .items-table th {
      background-color: #0f172a;
      color: #ffffff;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      padding: 10px 12px;
      text-align: left;
    }
    .items-table td {
      padding: 12px;
      font-size: 12px;
      color: #1e293b;
      border-bottom: 1px solid #e2e8f0;
    }
    .items-table tr:nth-child(even) td {
      background-color: #f8fafc;
    }
    .calc-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    .calc-table td {
      padding: 6px 8px;
      font-size: 12px;
    }
    .calc-label {
      text-align: right;
      color: #64748b;
      font-weight: 600;
      width: 65%;
    }
    .calc-val {
      text-align: right;
      font-weight: 700;
      color: #0f172a;
      width: 35%;
    }
    .grand-total-row td {
      border-top: 2px solid #0f172a;
      border-bottom: 2px solid #0f172a;
      padding: 8px;
      font-size: 14px;
      font-weight: 900;
      color: #0f172a;
    }
    .advance-paid-row td {
      background-color: #f8fafc;
      color: #0f172a;
      font-weight: 700;
    }
    .balance-due-row td {
      background-color: #fff1f2;
      color: #be123c;
      font-weight: 800;
      font-size: 13px;
    }
    .cta-container {
      text-align: center;
      margin: 28px 0 10px 0;
    }
    .cta-button {
      display: inline-block;
      background-color: #dc2626;
      color: #ffffff !important;
      text-decoration: none;
      font-weight: 800;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      padding: 12px 28px;
      border-radius: 4px;
      box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
    }
    .whatsapp-card {
      background-color: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 6px;
      padding: 14px 18px;
      margin-top: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .whatsapp-text {
      font-size: 12px;
      color: #166534;
      line-height: 1.4;
    }
    .email-footer {
      background-color: #0b0d10;
      color: #64748b;
      padding: 24px 32px;
      text-align: center;
      font-size: 11px;
      line-height: 1.6;
    }
    .email-footer a {
      color: #94a3b8;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <!-- Anti-Trimming Preheader -->
  <div style="display: none; font-size: 1px; color: #0b0d10; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all;">
    RevvMotiv Performance Parts Order #{{ $order->id }} Verified. Thank you for your purchase! &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
  </div>
  <div class="email-wrapper">
    <div class="invoice-container">
      
      <!-- Brand Header -->
      <div class="email-brand-header" style="background: #000000; padding: 24px 32px; border-bottom: 3px solid #dc2626;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="vertical-align: middle;">
              @php
                  $logoPath = public_path('images/logo-white.png');
                  $logoSrc = (isset($message) && file_exists($logoPath)) 
                      ? $message->embed($logoPath) 
                      : 'https://revvmotiv.com/logo-white.png';
              @endphp
              <a href="https://revvmotiv.com" target="_blank" style="text-decoration: none; display: inline-block;">
                <img src="{{ $logoSrc }}" alt="RevvMotiv" height="30" style="height: 30px; max-height: 30px; width: auto; max-width: 200px; display: block; border: 0;" />
              </a>
              <div style="font-size: 10px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 6px; font-weight: 700;">
                Custom Car Styling &amp; Aero Parts
              </div>
            </td>
            <td style="text-align: right; vertical-align: middle;">
              <span style="font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; color: #ffffff; background-color: #dc2626; padding: 6px 14px; border-radius: 4px; display: inline-block;">
                Order #{{ $order->id }}
              </span>
            </td>
          </tr>
        </table>
      </div>

      <!-- Main Body -->
      <div class="content-body">
        
        <!-- Status Banner -->
        <div class="status-banner">
          <div class="status-title">Order Confirmed &amp; In Fabrication / Queue!</div>
          <p class="status-desc">
            Thank you for ordering with RevvMotiv, <strong>{{ $order->customer_name }}</strong>. Your performance build order has been received and our technicians are preparing your components with 1:1 fitment inspection.
          </p>
        </div>

        <!-- Meta Grid -->
        <table class="meta-table">
          <tr>
            <td class="meta-box">
              <div class="meta-heading">Delivery Address</div>
              <div class="meta-title">{{ $order->customer_name }}</div>
              <div class="meta-details">
                <strong>Phone:</strong> {{ $order->customer_phone }}<br>
                <strong>Address:</strong> {{ $order->shipping_address ?? 'Standard Express Delivery' }}
              </div>
            </td>
            <td class="meta-spacer"></td>
            <td class="meta-box">
              <div class="meta-heading">Payment Breakdown</div>
              <div class="meta-title">
                @if($order->payment_status === 'fully_paid')
                  Prepaid in Full
                @elseif($order->payment_status === 'advance_paid')
                  {{ $order->advance_percent_applied }}% Advance Paid (COD Balance)
                @else
                  {{ ucfirst($order->payment_status) }}
                @endif
              </div>
              <div class="meta-details">
                <strong>Gateway Ref:</strong> {{ $order->razorpay_payment_id ?? ($order->razorpay_order_id ?? 'Razorpay Verified') }}<br>
                <strong>Date:</strong> {{ $order->created_at ? $order->created_at->format('d M Y, h:i A') : now()->format('d M Y') }}
              </div>
            </td>
          </tr>
        </table>

        <!-- Products Table -->
        <table class="items-table">
          <thead>
            <tr>
              <th style="width: 60%;">Item Description</th>
              <th style="width: 15%; text-align: center;">Qty</th>
              <th style="width: 25%; text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            @foreach($order->items as $item)
            <tr>
              <td>
                <strong>{{ $item->product ? $item->product->title : 'Custom Component #' . $item->product_id }}</strong>
                <div style="font-size: 10px; color: #64748b; margin-top: 2px;">
                  1:1 3D Laser Fitment Inspected
                </div>
              </td>
              <td style="text-align: center; font-weight: 700;">{{ $item->quantity }}</td>
              <td style="text-align: right; font-weight: 700;">₹{{ number_format($item->unit_price * $item->quantity, 2) }}</td>
            </tr>
            @endforeach
          </tbody>
        </table>

        <!-- Calculations Table -->
        <table class="calc-table">
          <tr>
            <td class="calc-label">Subtotal:</td>
            <td class="calc-val">₹{{ number_format($order->total_amount + $order->discount_amount, 2) }}</td>
          </tr>
          @if($order->discount_amount > 0)
          <tr>
            <td class="calc-label">Coupon Discount ({{ $order->coupon_code }}):</td>
            <td class="calc-val" style="color: #dc2626;">−₹{{ number_format($order->discount_amount, 2) }}</td>
          </tr>
          @endif
          <tr class="grand-total-row">
            <td class="calc-label" style="color: #0f172a;">Total Order Value:</td>
            <td class="calc-val">₹{{ number_format($order->total_amount, 2) }}</td>
          </tr>
          <tr class="advance-paid-row">
            <td class="calc-label" style="color: #0f172a;">Advance Paid Online ({{ $order->advance_percent_applied }}%):</td>
            <td class="calc-val" style="color: #0f172a;">₹{{ number_format($order->advance_amount, 2) }}</td>
          </tr>
          <tr class="balance-due-row">
            <td class="calc-label" style="color: #be123c;">Balance Due on Delivery (COD):</td>
            <td class="calc-val" style="color: #be123c;">₹{{ number_format($order->remaining_amount, 2) }}</td>
          </tr>
        </table>

        <!-- WhatsApp Support Card -->
        <div class="whatsapp-card">
          <div class="whatsapp-text">
            <strong>Need Fitment Assistance or Urgent Tracking?</strong><br>
            Our build technicians are available on WhatsApp: <strong>+91 83683 43232</strong> (Mon–Sat 10 AM – 7 PM IST).
          </div>
        </div>

        <!-- Tracking Button -->
        <div class="cta-container no-print">
          <a href="https://revvmotiv.com/order-confirmation/{{ $order->id }}?token={{ $order->access_token }}" class="cta-button" target="_blank">
            View Live Order Status &amp; Invoice →
          </a>
        </div>

      </div>

      <!-- Footer -->
      <div class="email-footer">
        <strong>RevvMotiv</strong> — Automotive Aero &amp; Styling Studio<br>
        Registered Facility: Site-5, Kasna, Greater Noida, Uttar Pradesh 201306, India<br>
        Support: <a href="mailto:support@revvmotiv.com">support@revvmotiv.com</a> | WhatsApp: +91 83683 43232
      </div>

    </div>
  </div>
</body>
</html>