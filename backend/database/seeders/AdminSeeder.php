<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        // Dev-only default admin login. Change this password before any
        // real deploy — see hostinger-deploy skill for go-live checklist.
        Admin::updateOrCreate(
            ['email' => 'admin@revvmotiv.test'],
            ['name' => 'RevvMotiv Admin', 'password' => 'password']
        );
    }
}
