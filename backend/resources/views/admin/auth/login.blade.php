<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login · RevvMotiv</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="flex min-h-screen items-center justify-center bg-slate-100">
    <div class="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <div class="mb-6 flex justify-center">
            <img src="{{ asset('images/logo.png') }}" alt="RevvMotiv" class="h-8 w-auto">
        </div>

        @if ($errors->any())
            <div class="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {{ $errors->first() }}
            </div>
        @endif

        <form method="POST" action="{{ route('admin.login.attempt') }}" class="space-y-4">
            @csrf
            <div>
                <label for="email" class="mb-1 block text-sm font-medium text-slate-700">Email</label>
                <input type="email" name="email" id="email" value="{{ old('email') }}" required autofocus
                       class="block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm">
            </div>
            <div>
                <label for="password" class="mb-1 block text-sm font-medium text-slate-700">Password</label>
                <x-admin.password-input name="password" required autocomplete="current-password" />
            </div>
            <label class="flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" name="remember" class="rounded border-slate-300">
                Remember me
            </label>
            <button type="submit" class="w-full cursor-pointer rounded-md bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white hover:bg-[#16304d]">
                Log in
            </button>
        </form>
    </div>
</body>
</html>
