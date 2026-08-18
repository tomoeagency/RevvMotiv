<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Headers;
use Illuminate\Queue\SerializesModels;

class OrderInvoiceMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Order $order)
    {
        $this->order->loadMissing('items.product');
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Your RevvMotiv Order Confirmation — #{$this->order->id} (Verified)",
        );
    }

    public function headers(): Headers
    {
        $uniqueId = 'RM-' . $this->order->id . '-' . time() . '@revvmotiv.com';
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
        return new Content(
            view: 'emails.order_invoice',
            with: [
                'order' => $this->order,
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
