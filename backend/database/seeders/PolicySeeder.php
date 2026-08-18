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
                    ## Processing time

                    Orders are dispatched within 48-72 hours of order confirmation. If you place your order over a weekend or on a public holiday, it will be processed on the next business day.

                    ## Delivery time

                    Once dispatched, most orders arrive within 5-9 business days, depending on your location and the courier partner handling the delivery.

                    ## Tracking

                    As soon as your order ships, we'll send you a shipping confirmation along with a tracking number so you can follow its progress.

                    ## Delays outside our control

                    While we do our best to get every order to you on time, RevvMotiv is not responsible for delays caused by courier partners, natural disasters, government restrictions, or an incorrect shipping address provided at checkout. Please double-check your address before placing your order.
                    MD,
            ],
            [
                'slug' => 'contact-information',
                'title' => 'Contact Us',
                'content' => <<<'MD'
                    We are here to help with anything related to your order, fitment advice, or styling consultation.

                    **Email:** support@revvmotiv.com
                    **WhatsApp:** +91 83683 43232
                    **Instagram:** @revvmotiv

                    **Support Hours:** Monday to Saturday, 10:00 AM – 7:00 PM IST  
                    We typically respond within 24–48 business hours.

                    ## What we can help with

                    - Vehicle fitment and compatibility verification
                    - Order status and live courier tracking
                    - Product finish and material details
                    - Installation and mounting guidance
                    - Safe unboxing, claims, and warranty assistance

                    Feel free to reach out — our team is glad to help.
                    MD,
            ],
            [
                'slug' => 'terms-of-service',
                'title' => 'Terms of Service',
                'content' => <<<'MD'
                    Welcome to RevvMotiv. By using our website and placing an order, you agree to the following terms.

                    ## Eligibility

                    You must be at least 18 years old to place an order on our site. If you are under 18, please use this site only with the involvement and supervision of a parent or guardian.

                    ## Product Information & Pricing

                    We work hard to keep product descriptions, images, and prices accurate, but errors can occasionally occur. If we discover a pricing or listing error on an order you've placed, we reserve the right to correct it and will contact you before proceeding.

                    ## Order Acceptance

                    Placing an order is an offer to purchase, not a guaranteed sale. We reserve the right to accept, reject, or cancel any order at our discretion — including in cases of suspected fraud, pricing errors, or insufficient stock. If we cancel an order after payment, we'll issue a full refund.

                    ## Payment

                    Orders are processed and dispatched only after payment is successfully received.

                    ## Shipping & Delivery

                    Orders are dispatched within 48-72 hours of confirmation, with delivery typically taking 5-9 business days depending on location and courier. See our Shipping Policy for full details.

                    ## Returns, Refunds & Replacements

                    We do not accept returns for personal preference. Refunds or replacements are offered only for products that are the wrong item or arrive defective or damaged, and only when reported within 48 hours of delivery with a complete unboxing video. See our Refund Policy for full details.

                    ## Installation

                    Some of our products require professional installation for correct fitment and performance. RevvMotiv is not responsible for damage resulting from improper or amateur installation.

                    ## Limitation of Liability

                    To the extent permitted by law, RevvMotiv is not liable for any indirect, incidental, or consequential damages arising from the use of our products or website.

                    ## Intellectual Property

                    All content on this website — including text, images, logos, and design — is the property of RevvMotiv and may not be used or reproduced without our permission.

                    ## Governing Law

                    These terms are governed by the laws of India, and any disputes will be subject to the jurisdiction of Indian courts.
                    MD,
            ],
            [
                'slug' => 'legal-notice',
                'title' => 'Legal Notice',
                'content' => <<<'MD'
                    This website is owned and operated by RevvMotiv.

                    ## Intellectual Property

                    All content on this site, including product images, descriptions, branding, and design, is the intellectual property of RevvMotiv. Unauthorized use, reproduction, or distribution of this content is prohibited.

                    ## Accuracy of Information

                    We make every effort to ensure product information on this site is accurate and up to date. However, we do not guarantee that all details are error-free at all times.

                    ## Vehicle Compatibility

                    Our products are designed to fit specific vehicle makes, models, and body styles. It is the customer's responsibility to verify compatibility with their vehicle before placing an order.

                    ## Third-Party Links

                    Our website may contain links to third-party websites. RevvMotiv is not responsible for the content, policies, or practices of any external sites.

                    ## Limitation of Liability

                    RevvMotiv shall not be held liable for any loss or damage arising from the use of this website or our products, to the extent permitted by applicable law.

                    ## Governing Law

                    This notice is governed by the laws of India.
                    MD,
            ],
            [
                'slug' => 'privacy-policy',
                'title' => 'Privacy Policy',
                'content' => <<<'MD'
                    Your privacy matters to us. This policy explains what information we collect, how we use it, and the choices you have.

                    ## Information We Collect

                    When you shop with us, we collect:

                    - **Contact and shipping details** — your name, email, phone number, and delivery address
                    - **Payment information** — processed securely through our payment partner, Razorpay; we do not store your card or bank details ourselves
                    - **Order history** — details of products you've purchased and your order status
                    - **Device and usage information** — such as your browser type, IP address, and how you interact with our website, which helps us improve your experience

                    ## How We Use Your Information

                    We use your information to:

                    - Process and fulfill your orders, including shipping and delivery
                    - Respond to your questions and provide customer support
                    - Detect and prevent fraud and unauthorized transactions
                    - Send you marketing updates about new products and offers, which you can opt out of at any time

                    ## Sharing Your Information

                    We do not sell your personal information. We share it only where necessary to run our business, including with:

                    - **Razorpay**, our payment processor, to securely handle transactions
                    - **Courier and shipping partners**, to deliver your order to you

                    ## Data Security

                    We take reasonable technical and organizational measures to protect your personal information from unauthorized access, loss, or misuse.

                    ## Your Rights

                    You have the right to access, correct, or request deletion of your personal information. To exercise any of these rights, contact us at support@revvmotiv.com.

                    ## Contact Us

                    If you have any questions about this privacy policy or how we handle your data, reach out to us at support@revvmotiv.com.
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
