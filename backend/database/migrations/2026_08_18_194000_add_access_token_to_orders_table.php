<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('access_token', 64)->nullable()->unique()->after('notes');
        });

        // Backfill existing orders with a random access_token
        $orders = DB::table('orders')->whereNull('access_token')->get();
        foreach ($orders as $order) {
            DB::table('orders')
                ->where('id', $order->id)
                ->update(['access_token' => Str::random(40)]);
        }
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('access_token');
        });
    }
};
