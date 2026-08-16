<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

// Edits customer/fulfillment details on an existing order — deliberately
// does NOT touch line items (product/quantity). Changing items after
// creation means reversing stock, re-pricing, and recomputing totals,
// which OrderService::create() already does correctly for a NEW order;
// doing that safely for an EXISTING one is a separate, more careful piece
// of work. For now: cancel the order and create a new manual order if the
// items themselves are wrong.
class UpdateOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_phone' => ['required', 'string', 'max:20'],
            'customer_email' => ['nullable', 'email', 'max:255'],
            'customer_address' => ['nullable', 'string', 'max:1000'],
            'source' => ['required', 'string', 'in:website,instagram,call,whatsapp,other'],
            // Only meaningful for manual orders — leave blank for
            // website/Razorpay orders, matching how they're created.
            'payment_mode' => ['nullable', 'string', 'in:cod,upi,cash,bank_transfer'],
            'payment_status' => ['required', 'string', 'in:pending,advance_paid,fully_paid,failed,refunded'],
            'order_status' => ['required', 'string', 'in:pending,confirmed,shipped,delivered,cancelled'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
