# 🚀 RevvMotiv Complete Deployment & Hosting Guide

Is document me **RevvMotiv** project ko live server (**GoDaddy cPanel Backend + Vercel Frontend + DNS Configuration**) par deploy karne ka step-by-step complete process documented hai.

---

## 📐 Architecture Overview

| Component | Technology | Hosting Platform | Domain / URL |
| :--- | :--- | :--- | :--- |
| **Frontend** | Next.js 16 (React 19) | **Vercel** (Global Edge CDN) | `https://revvmotiv.com` & `https://www.revvmotiv.com` |
| **Backend** | Laravel 12 (PHP 8.2+) | **GoDaddy cPanel (Linux)** | `https://api.revvmotiv.com` |
| **Database** | MySQL | **GoDaddy cPanel MySQL** | Localhost (Internal to cPanel) |
| **Emails** | GoDaddy Professional Email / SMTP | GoDaddy Mail | `orders@revvmotiv.com` / `support@revvmotiv.com` |
| **Payments** | Razorpay Payment Gateway | Razorpay API & Webhooks | Integrated in Checkout |

---

## 🛠️ PART 1: Backend Deployment (GoDaddy cPanel)

### Step 1.1: PHP Version Check
1. GoDaddy cPanel me login karein.
2. Search bar me **"Select PHP Version"** ya **"MultiPHP Manager"** open karein.
3. PHP version **8.2** ya **8.3** select karke save karein.
4. Required extensions enable karein: `pdo_mysql`, `curl`, `fileinfo`, `mbstring`, `openssl`, `tokenizer`, `xml`, `zip`, `bcmath`.

---

### Step 1.2: MySQL Database Create Karna
1. cPanel me **"MySQL Database Wizard"** open karein.
2. Step 1: Database name dalein (e.g. `cpaneluser_revvmotiv`).
3. Step 2: Database user name aur strong password create karein (e.g. `cpaneluser_dbadmin`).
4. Step 3: **"ALL PRIVILEGES"** tick karke Save karein.
5. In credentials ko save rakhein:
   - `DB_DATABASE` = `cpaneluser_revvmotiv`
   - `DB_USERNAME` = `cpaneluser_dbadmin`
   - `DB_PASSWORD` = `AapkaPassword`

---

### Step 1.3: Subdomain Banana (`api.revvmotiv.com`)
1. cPanel me **"Domains"** ya **"Subdomains"** section me jayein.
2. **Create A New Domain / Subdomain**:
   - Domain: `api.revvmotiv.com`
   - Document Root: `public_html/api` (ya `laravel/public` jaha backend ka public folder point hoga).

---

### Step 1.4: Laravel Code Upload & Directory Structure
Laravel ka security best practice hai ki core code `public_html` se bahar rahe:

1. Local machine par backend folder me jayein aur `.env`, `vendor`, `node_modules` ko chhodkar baki files ki zip banayein:
   - Ya pura `backend/` folder zip karein (`vendor` ke sath ya bina `vendor` ke).
2. cPanel **File Manager** me:
   - Ek folder banayein: `/home/yourusername/revvmotiv-backend`
   - Is folder me Laravel ka saara code extract karein.
   - Subdomain ka document root (`public_html/api`) me Laravel ke `public/` folder ki files copy ya symlink karein.
   - Ya phir cPanel Domains me `api.revvmotiv.com` ka Document Root seedha `/home/yourusername/revvmotiv-backend/public` set kar dein (Sabse Best & Clean).

---

### Step 1.5: Production `.env` File Configuration
Backend folder me `.env` file create/edit karein:

```env
APP_NAME=RevvMotiv
APP_ENV=production
APP_KEY=base64:YOUR_GENERATED_APP_KEY_HERE
APP_DEBUG=false
APP_URL=https://api.revvmotiv.com

FRONTEND_URL=https://revvmotiv.com
SANCTUM_STATEFUL_DOMAINS=revvmotiv.com,www.revvmotiv.com

LOG_CHANNEL=daily
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=cpaneluser_revvmotiv
DB_USERNAME=cpaneluser_dbadmin
DB_PASSWORD=AapkaPassword

# Razorpay Credentials
RAZORPAY_KEY_ID=rzp_live_xxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxxxxxxxxxxxxx

# Mail SMTP (GoDaddy Professional Email)
MAIL_MAILER=smtp
MAIL_HOST=smtpout.secureserver.net
MAIL_PORT=465
MAIL_USERNAME=orders@revvmotiv.com
MAIL_PASSWORD=AapkaEmailPassword
MAIL_ENCRYPTION=ssl
MAIL_FROM_ADDRESS="orders@revvmotiv.com"
MAIL_FROM_NAME="RevvMotiv"

SESSION_DRIVER=database
QUEUE_CONNECTION=database
FILESYSTEM_DISK=public
```

---

### Step 1.6: Database Migrations & Seeds Run Karna
cPanel me Terminal open karein (ya phpMyAdmin me SQL export/import karein):
```bash
cd /home/yourusername/revvmotiv-backend
composer install --no-dev --optimize-autoloader
php artisan key:generate --force
php artisan migrate --force
php artisan db:seed --force
php artisan storage:link
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## ⚡ PART 2: Frontend Deployment (Vercel)

### Step 2.1: GitHub Repository Connect Karna
1. Project ko GitHub repo (`https://github.com/tomoeagency/RevvMotiv.git`) par push karein.
2. [Vercel.com](https://vercel.com/) par login karein.
3. **"Add New..."** -> **"Project"** par click karein aur `RevvMotiv` repository select karein.

### Step 2.2: Build Settings Configure Karna
- **Framework Preset:** Next.js
- **Root Directory:** `frontend` *(Click Edit and select `frontend`)*
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

### Step 2.3: Environment Variables
Vercel dashboard me **Environment Variables** add karein:

| Key | Value | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `https://api.revvmotiv.com` | Live Laravel Backend API URL |

Deploy button click karein. 1-2 minutes me frontend live ho jayega!

---

## 🌐 PART 3: GoDaddy DNS Configuration (Domain Pointing)

GoDaddy me **Domain Portfolio** -> **revvmotiv.com** -> **Manage DNS** me jayein aur ye records set karein:

### 1. Main Domain & WWW (Points to Vercel)
| Type | Name | Value | TTL |
| :--- | :--- | :--- | :--- |
| **A** | `@` | `76.76.21.21` (Vercel IP) | 1 Hour / Automatic |
| **CNAME** | `www` | `cname.vercel-dns.com` | 1 Hour / Automatic |

### 2. Backend Subdomain (Points to GoDaddy cPanel Hosting)
| Type | Name | Value | TTL |
| :--- | :--- | :--- | :--- |
| **A** | `api` | `[Aapki GoDaddy Hosting ka IP]` | 1 Hour / Automatic |

*(Note: GoDaddy Hosting IP cPanel ke right sidebar me "Shared IP Address" ke naam se dikhta hai).*

---

### Step 2.4: Vercel me Custom Domain Add Karna
1. Vercel Project Dashboard -> **Settings** -> **Domains** me jayein.
2. Add karein:
   - `revvmotiv.com`
   - `www.revvmotiv.com` (Redirect to `revvmotiv.com`)
3. Vercel automatically SSL Certificate issue karega (Let's Encrypt).

---

## 🔒 PART 4: SSL (HTTPS) Activation

1. **Frontend (Vercel):** Vercel automatic 100% free SSL handle karta hai.
2. **Backend (cPanel):** 
   - cPanel me **"SSL/TLS Status"** me jayein.
   - `api.revvmotiv.com` select karke **"Run AutoSSL"** click karein.
   - Free SSL activate ho jayega.

---

## 💳 PART 5: Razorpay Webhook Configuration

1. Razorpay Dashboard me login karein -> **Settings** -> **Webhooks**.
2. **Add New Webhook**:
   - **Webhook URL:** `https://api.revvmotiv.com/api/v1/orders/webhook`
   - **Secret:** Jo secret `.env` me `RAZORPAY_WEBHOOK_SECRET` diya hai.
   - **Active Events:**
     - `order.paid`
     - `payment.captured`
     - `payment.failed`

---

## 🧪 PART 6: Verification & Health Checklist

- [ ] `https://revvmotiv.com` open ho rahi hai aur fast load ho rahi hai.
- [ ] `https://api.revvmotiv.com/api/v1/products` JSON data return kar raha hai.
- [ ] Shop page par products and categories dikh rahe hain.
- [ ] Cart aur Checkout flow open ho raha hai aur Razorpay popup trigger ho raha hai.
- [ ] Order place karne par customer email (`orders@revvmotiv.com`) se invoice PDF receive ho rahi hai.
- [ ] Contact form submission successful ho raha hai.

---

## 🆘 Troubleshooting Quick Reference

| Issue | Solution |
| :--- | :--- |
| **CORS Error in Browser Console** | Backend `config/cors.php` me `allowed_origins` me `https://revvmotiv.com` add karein aur `php artisan config:clear` karein. |
| **500 Internal Server Error on API** | `storage/logs/laravel.log` check karein. Storage & bootstrap/cache folder permissions `775` ya `755` set karein. |
| **Images Not Showing (404)** | Run `php artisan storage:link` inside backend directory. |
| **Mixed Content Warning** | Ensure all API URLs in frontend `.env` start with `https://` (not `http://`). |
