<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>How is your RevvMotiv Upgrade? — Order #{{ $order->id }}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0b0d10;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #f1f5f9;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #0b0d10;
      padding: 40px 15px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #12151a;
      border: 1px solid #1e2530;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
    }
    .header {
      background: linear-gradient(135deg, #181c24 0%, #0d1015 100%);
      padding: 35px 30px;
      text-align: center;
      border-bottom: 1px solid #1e2530;
    }
    .brand-logo {
      font-size: 24px;
      font-weight: 900;
      letter-spacing: 2px;
      color: #ffffff;
      text-transform: uppercase;
      text-decoration: none;
    }
    .brand-red {
      color: #ef4444;
    }
    .content {
      padding: 35px 30px;
      text-align: center;
    }
    .badge {
      display: inline-block;
      background: rgba(239, 68, 68, 0.12);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #ef4444;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      padding: 5px 14px;
      border-radius: 20px;
      margin-bottom: 18px;
    }
    .title {
      font-size: 22px;
      font-weight: 800;
      color: #ffffff;
      margin: 0 0 12px 0;
      line-height: 1.3;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .lead {
      font-size: 14px;
      line-height: 1.6;
      color: #94a3b8;
      margin: 0 0 25px 0;
    }
    .product-box {
      background: #181d26;
      border: 1px solid #283243;
      border-radius: 12px;
      padding: 16px;
      margin: 25px 0;
      text-align: left;
      display: table;
      width: 100%;
      box-sizing: border-box;
    }
    .rating-container {
      margin: 30px 0;
      padding: 20px;
      background: #151a22;
      border-radius: 12px;
      border: 1px dashed #2d3748;
    }
    .rating-label {
      font-size: 12px;
      font-weight: 700;
      color: #cbd5e1;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 15px;
      display: block;
    }
    .star-btn {
      display: inline-block;
      padding: 10px 14px;
      margin: 4px 3px;
      background: #1e2532;
      border: 1px solid #334155;
      border-radius: 8px;
      text-decoration: none;
      color: #fbbf24;
      font-size: 18px;
      font-weight: 700;
      transition: all 0.2s ease;
    }
    .btn-main {
      display: inline-block;
      background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
      color: #ffffff !important;
      font-size: 13px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding: 16px 36px;
      border-radius: 10px;
      text-decoration: none;
      box-shadow: 0 10px 25px rgba(220, 38, 38, 0.4);
      margin-top: 10px;
    }
    .perks-row {
      margin-top: 35px;
      padding-top: 25px;
      border-top: 1px solid #1e2530;
      text-align: left;
    }
    .perk-item {
      font-size: 12px;
      color: #94a3b8;
      line-height: 1.5;
      margin-bottom: 8px;
    }
    .footer {
      background: #0d1015;
      padding: 25px;
      text-align: center;
      font-size: 11px;
      color: #64748b;
      border-top: 1px solid #1e2530;
    }
    .footer a {
      color: #94a3b8;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      
      <!-- Header -->
      <div class="header">
        <a href="https://revvmotiv.com" class="brand-logo">
          REVV<span class="brand-red">MOTIV</span>
        </a>
      </div>

      <!-- Main Content -->
      <div class="content">
        <div class="badge">Verified Delivery</div>
        
        <h1 class="title">How Did The Install Turn Out?</h1>
        <p class="lead">
          Hey <strong>{{ $order->customer_name }}</strong>, your package (Order #{{ $order->id }}) has been delivered! We’d love to see how it looks on your machine.
        </p>

        @if($product)
          <div class="product-box">
            <span style="font-size: 10px; font-weight: 800; color: #ef4444; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">Delivered Upgrade</span>
            <span style="font-size: 14px; font-weight: 700; color: #ffffff; display: block;">{{ $product->title }}</span>
          </div>
        @endif

        <!-- 1-Tap Star Ratings -->
        <div class="rating-container">
          <span class="rating-label">Tap to Rate Your Experience:</span>
          <div>
            @for ($i = 5; $i >= 1; $i--)
              <a href="{{ $reviewLinkBase }}&rating={{ $i }}" class="star-btn" title="{{ $i }} Stars">
                {{ $i }} ★
              </a>
            @endfor
          </div>
        </div>

        <!-- Direct Action CTA -->
        <div>
          <a href="{{ $reviewLinkBase }}" class="btn-main">
            Leave Feedback & Upload Build Photo
          </a>
        </div>

        <!-- Community Showcase Highlights -->
        <div class="perks-row">
          <div class="perk-item">• <strong>Build Showcase:</strong> Approved photos are featured on our website gallery and official @revvmotiv Instagram page.</div>
          <div class="perk-item">• <strong>Verified Badge:</strong> Your review receives an official <em>Verified Purchase</em> badge.</div>
          <div class="perk-item">• <strong>Community Impact:</strong> Helps fellow enthusiasts dial in their fitment and stance.</div>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p style="margin: 0 0 6px 0;">RevvMotiv Performance & Styling Studio • Delhi NCR, India</p>
        <p style="margin: 0;">Need fitment assistance? Reach us directly on <a href="https://wa.me/918368343232?text=Hi%20RevvMotiv%2C%20I%20need%20assistance%20with%20my%20order." style="color: #22c55e;">WhatsApp Support</a> or <a href="mailto:support@revvmotiv.com">support@revvmotiv.com</a></p>
      </div>

    </div>
  </div>
</body>
</html>
