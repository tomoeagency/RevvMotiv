<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            AdminSettingSeeder::class,
            AdminSeeder::class,
            CategorySeeder::class,
            CatalogDemoSeeder::class,
            PolicySeeder::class,
            ProjectDemoSeeder::class,
            ReviewDemoSeeder::class,
        ]);
    }
}
