<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AccountUpdateRequest;
use App\Services\CloudinaryUploadService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\View\View;
use RuntimeException;

class AccountController extends Controller
{
    public function edit(): View
    {
        return view('admin.account.edit', ['admin' => Auth::user()]);
    }

    public function update(AccountUpdateRequest $request, CloudinaryUploadService $uploader): RedirectResponse
    {
        $admin = Auth::user();
        $validated = $request->validated();

        $data = [
            'name' => $validated['name'],
            'email' => $validated['email'],
        ];

        if (! empty($validated['password'])) {
            $data['password'] = Hash::make($validated['password']);
        }

        if ($request->hasFile('avatar')) {
            try {
                $data['avatar_url'] = $uploader->upload($request->file('avatar'), 'revvmotiv/admin-avatars')['secure_url'];
            } catch (RuntimeException $e) {
                return back()->withInput()->withErrors(['avatar' => 'Avatar upload failed: '.$e->getMessage()]);
            }
        }

        $admin->update($data);

        return redirect()->route('admin.account.edit')->with('status', 'Account updated.');
    }
}
