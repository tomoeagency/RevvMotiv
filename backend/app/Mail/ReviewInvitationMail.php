<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Headers;
use Illuminate\Queue\SerializesModels;

class ReviewInvitationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Order $order)
    {
        $this->order->loadMissing('items.product');
    }

    public function envelope(): Envelope
    {
        $firstItem = $this->order->items->first();
        $productTitle = $firstItem?->product?->title ?? 'Your Upgrade';

        return new Envelope(
            subject: "Your Build Has Landed! 🏁 How's the {$productTitle}?",
        );
    }

    public function headers(): Headers
    {
        $uniqueId = 'RM-REVIEW-' . $this->order->id . '-' . time() . '@revvmotiv.com';
        return new Headers(
            messageId: $uniqueId,
            text: [
                'X-Entity-Ref-ID' => $uniqueId,
                'X-Auto-Response-Suppress' => 'All',
            ],
        );
    }

    public function content(): Content
    {
        $firstItem = $this->order->items->first();
        $product = $firstItem?->product;
        $primarySlug = $product?->slug ?? '';
        $customerName = $this->order->customer_name;
        $customerEmail = $this->order->customer_email;

        // Build direct 1-click rating URLs
        $baseUrl = config('app.frontend_url', 'https://revvmotiv.com');
        $reviewLinkBase = $primarySlug
            ? "{$baseUrl}/products/{$primarySlug}?review=true&order_id={$this->order->id}&name=" . urlencode($customerName) . "&email=" . urlencode($customerEmail)
            : "{$baseUrl}/review?order_id={$this->order->id}&name=" . urlencode($customerName) . "&email=" . urlencode($customerEmail);

        return new Content(
            view: 'emails.review_invitation',
            with: [
                'order' => $this->order,
                'product' => $product,
                'reviewLinkBase' => $reviewLinkBase,
            ],
        );
    }
}
