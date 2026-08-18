<?php

namespace Database\Seeders;

use App\Models\Policy;
use Illuminate\Database\Seeder;

// Real, publication-ready policy content — original wording written from
// the client's own policy points, not copied from any external source.
class PolicySeeder extends Seeder
{
    public function run(): void
    {
        $policies = [
            [
                'slug' => 'refund-policy',
                'title' => 'Refund & Replacement Policy',
                'content' => <<<'MD'
                    At RevvMotiv, we carefully package and inspect every order before dispatch. Because our products are precision-fit car accessories, we do not accept returns on delivered products for reasons of personal preference.

                    ## When a refund or replacement applies

                    We will offer a refund or replacement only when:

                    - You received the wrong product, or
                    - The product arrived defective or damaged.

                    ## How to raise a claim

                    Contact us within 48 hours of delivery. To process your claim, you must provide a complete, uninterrupted unboxing video of the package, along with photos of the issue if we request them. Claims raised without this video cannot be processed.

                    ## What isn't covered

                    We're unable to offer a refund or replacement for:

                    - A change of mind after purchase
                    - An incorrect size, model, or variant selected by the customer at checkout
                    - Minor variations in color or finish, which can occur naturally with dyed or finished materials
                    - Damage caused by improper installation, misuse, modification, or normal wear and tear
                    - Any claim submitted without the required unboxing video
                    - Any claim raised more than 48 hours after delivery

                    If your claim qualifies, we'll work with you to arrange a replacement or refund as quickly as possible.
                    MD,
            ],
            [
                'slug' => 'shipping-policy',
                'title' => 'Shipping Policy',
                'content' => <<<'MD'
                    ## Processing & Dispatch Time

                    Orders are inspected and dispatched within 48–72 hours of order confirmation. If you place your order over a weekend or on a public holiday, it will be processed on the next business day.

                    ## Delivery Timeline

                    Once dispatched, orders are delivered via Standard Tracked Courier within 5–7 business days across India, depending on your pin code and courier logistics.

                    ## Courier Tracking

                    As soon as your package ships from our workshop, we will send you a shipping confirmation via email and WhatsApp along with a live tracking link.

                    ## Delays Outside Our Control

                    While we make every effort to deliver on time, RevvMotiv is not liable for logistics delays caused by courier partner routes, weather events, or incomplete delivery addresses provided at checkout. Please verify your address and phone number before completing your order.
                    MD,
            ],
            [
                'slug' => 'contact-information',
                'title' => 'Contact Us',
                'content' => <<<'MD'
                    We are here to help with vehicle fitment guidance, styling advice, and order tracking.

                    **Business Name:** RevvMotiv  
                    **Registered Office:** Site-5, Kasna, Greater Noida, Uttar Pradesh, India  
                    **Email:** support@revvmotiv.com  
                    **WhatsApp / Call:** +91 83683 43232  
                    **Follow Builds:** [@revv.nation__](https://www.instagram.com/revv.nation__/) | [@sonet.4100__](https://www.instagram.com/sonet.4100__/)  

                    **Support Hours:** Monday to Saturday, 10:00 AM – 7:00 PM IST  
                    We typically respond within 24–48 business hours.

                    ## What We Can Help With

                    - Vehicle fitment and compatibility checks
                    - Order status and live courier tracking
                    - Product finish, weave, and mounting guidance
                    - Safe unboxing and claims assistance
                    MD,
            ],
            [
                'slug' => 'terms-of-service',
                'title' => 'Terms of Service',
                'content' => <<<'MD'
                    Welcome to RevvMotiv. By using our website and placing an order, you agree to the following terms.

                    ## Eligibility

                    You must be at least 18 years old to place an order on our site. If you are under 18, please use this site only under parental or guardian supervision.

                    ## Pricing & Product Information

                    All prices displayed on the website are final. While we work hard to keep product descriptions, images, and prices accurate, errors can occasionally occur. If we discover a pricing error on an order you have placed, we reserve the right to correct it and will contact you before proceeding.

                    ## Order Acceptance & Cancellation

                    Placing an order is an offer to purchase. We reserve the right to accept, reject, or cancel any order at our discretion in cases of suspected fraud, pricing errors, or insufficient stock. Orders may be cancelled prior to workshop dispatch for a full refund by contacting support.

                    ## Payment

                    Orders are processed and dispatched only after advance or full payment is verified via our secure payment gateway (Razorpay).

                    ## Returns, Refunds & Replacements

                    We do not accept returns for personal preference. Refunds or replacements apply only for wrong items delivered or items arriving damaged, reported within 48 hours with a continuous unboxing video. See our Refund Policy for complete instructions.

                    ## Professional Installation

                    Certain aerodynamic components (splitters, diffusers, spoiler wings) require professional workshop installation. RevvMotiv is not responsible for damage resulting from improper or amateur mounting.

                    ## Statutory Grievance Redressal & Registered Office

                    Under the Consumer Protection (E-Commerce) Rules, 2020 and DPDP Act 2023:

                    **Entity:** RevvMotiv  
                    **Registered Office:** Site-5, Kasna, Greater Noida, Uttar Pradesh, India  
                    **Support & Grievances:** support@revvmotiv.com  
                    **Telephone / WhatsApp:** +91 83683 43232  
                    **Governing Law:** Laws of India, subject to the jurisdiction of competent courts.
                    MD,
            ],
            [
                'slug' => 'legal-notice',
                'title' => 'Legal Notice',
                'content' => <<<'MD'
                    This website is owned and operated by RevvMotiv.

                    **Registered Office:** Site-5, Kasna, Greater Noida, Uttar Pradesh, India  
                    **Contact:** support@revvmotiv.com | +91 83683 43232

                    ## Intellectual Property

                    All content on this site, including product designs, imagery, branding, and text, is the intellectual property of RevvMotiv. Unauthorized reproduction is prohibited.

                    ## Vehicle Compatibility

                    Our products are engineered for specific vehicle models and variants. Customers are advised to verify vehicle compatibility before placing an order.

                    ## Governing Law

                    This notice and all platform operations are governed by the laws of India.
                    MD,
            ],
            [
                'slug' => 'privacy-policy',
                'title' => 'Privacy Policy',
                'content' => <<<'MD'
                    Your privacy matters to us. This policy explains what information we collect, how we use it, and your rights under applicable data protection laws including the Digital Personal Data Protection (DPDP) Act, 2023.

                    ## Information We Collect

                    When you interact with RevvMotiv, we collect:

                    - **Contact and delivery details** — your name, email address, phone number, and delivery address.
                    - **Transaction references** — order details and transaction identifiers processed securely by Razorpay. We never store credit card numbers or UPI MPINs.
                    - **Communications** — messages sent via WhatsApp, email, or our contact forms.

                    ## How We Use Your Information

                    - Fulfill and dispatch your orders.
                    - Provide fitment advice and customer support.
                    - Comply with statutory tax, invoicing, and regulatory obligations.

                    ## Data Sharing

                    We do not sell your personal data. Data is shared strictly with necessary operational partners:
                    - **Razorpay** (Payment Gateway) for secure transaction processing.
                    - **Courier Logistics Partners** for delivery of physical packages.

                    ## Grievance Contact & Data Rights

                    You may request access, correction, or deletion of your personal data by writing to:  
                    **RevvMotiv Grievance Desk**  
                    Site-5, Kasna, Greater Noida, Uttar Pradesh, India  
                    Email: support@revvmotiv.com | Tel: +91 83683 43232
                    MD,
            ],
        ];

        foreach ($policies as $policy) {
            Policy::updateOrCreate(['slug' => $policy['slug']], [
                'title' => $policy['title'],
                'content' => $policy['content'],
            ]);
        }
    }
}
