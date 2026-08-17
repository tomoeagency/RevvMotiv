# RevvMotiv — Performance & Custom Automotive Garages

RevvMotiv is a high-performance, full-stack automotive e-commerce and showcase platform built for custom body kits, performance exhausts, interior trims, and bespoke automotive engineering.

---

## 🏗️ Architecture Overview

The project is structured as a decoupled full-stack architecture:

- **Frontend (`/frontend`)**: Built with **Next.js 16 (React 19)**, **Tailwind CSS v4**, and **Framer Motion**. Deployed seamlessly on **Vercel** with edge routing, fast SSR/ISR rendering, and responsive automotive UI/UX.
- **Backend (`/backend`)**: Built with **Laravel 12 (PHP 8.2+)**, providing RESTful APIs, Admin dashboard, Order processing, Tax invoice PDF generation, Database migrations/seeders, and **Razorpay** payment gateway integration.
- **Database**: **MySQL** for storing products, categories, orders, reviews, inquiries, and site configuration.

---

## 📁 Repository Structure

```tree
revvmotiv/
├── frontend/                     # Next.js 16 Storefront Application
│   ├── app/                      # App router pages (shop, cart, checkout, gallery, etc.)
│   │   ├── components/           # Reusable UI components (Hero, Navbar, Footer, etc.)
│   │   ├── shop/                 # Product catalog & category filtering
│   │   ├── checkout/             # Razorpay payment & advance booking checkout
│   │   ├── gallery/              # High-res media gallery & transformation showcases
│   │   └── policies/             # Legal, refund, privacy, and shipping policies
│   ├── lib/                      # Central API client, types & utility helpers
│   ├── public/                   # Static assets, logos, and icons
│   ├── package.json              # Frontend dependencies and build scripts
│   └── next.config.ts            # Next.js configuration
│
├── backend/                      # Laravel 12 REST API & Admin Engine
│   ├── app/
│   │   ├── Http/Controllers/    # API & Admin Controllers (Orders, Products, Dashboard)
│   │   ├── Models/               # Eloquent Models (Product, Order, Review, Category, etc.)
│   │   └── Mail/                 # Order invoice email templates
│   ├── database/
│   │   ├── migrations/           # Database schema migrations
│   │   └── seeders/              # Demo seeders for products, reviews, and garage projects
│   ├── routes/
│   │   ├── api.php               # RESTful API endpoints (/api/v1/...)
│   │   └── web.php               # Admin & invoice routes
│   ├── resources/views/          # Blade templates (e.g. Tax invoice print/email)
│   └── composer.json             # PHP dependencies
│
├── DEPLOYMENT_GUIDE.md           # 🚀 Comprehensive Step-by-Step Production Hosting Guide
└── README.md                     # Project overview and development setup
```

---

## ⚡ Quick Start (Local Development)

### Prerequisites
- Node.js (v20+) & npm
- PHP (v8.2+) & Composer
- MySQL Database

### 1. Backend Setup (Laravel)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate

# Configure your DB_DATABASE, DB_USERNAME, DB_PASSWORD in .env
php artisan migrate --seed
php artisan storage:link
php artisan serve --port=8000
```

### 2. Frontend Setup (Next.js)
```bash
cd frontend
npm install

# Create .env.local
echo NEXT_PUBLIC_API_URL=http://localhost:8000 > .env.local

npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Production Deployment

For complete instructions on deploying:
- **Frontend** to **Vercel** (`revvmotiv.com`)
- **Backend & Database** to **GoDaddy cPanel** (`api.revvmotiv.com`)
- **DNS Records, Mailboxes & SSL Configuration**

👉 Read the detailed **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)**.
