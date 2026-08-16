<?php

namespace App\Http\Requests\Admin;

use App\Models\ExpenseCategory;
use Illuminate\Foundation\Http\FormRequest;

class ExpenseStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // '__new__' is the sentinel the form submits when the admin picks
            // "+ Add new category" — resolved into a real ExpenseCategory in
            // the controller, using new_category_name below. Otherwise it
            // must be a real existing category id.
            'category_id' => ['required', 'string', function ($attribute, $value, $fail) {
                if ($value === '__new__') {
                    return;
                }
                if (! ExpenseCategory::whereKey($value)->exists()) {
                    $fail('The selected category is invalid.');
                }
            }],
            'new_category_name' => ['required_if:category_id,__new__', 'nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'min:0'],
            'expense_date' => ['required', 'date'],
        ];
    }
}
