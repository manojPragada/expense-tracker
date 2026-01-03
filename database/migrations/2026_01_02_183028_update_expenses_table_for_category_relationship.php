<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('expenses', function (Blueprint $table) {
            // Drop the old enum column
            $table->dropColumn('category');
        });
        
        Schema::table('expenses', function (Blueprint $table) {
            // Add foreign key to categories
            $table->foreignId('category_id')->after('amount')->constrained()->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::table('expenses', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
            $table->dropColumn('category_id');
        });
        
        Schema::table('expenses', function (Blueprint $table) {
            $table->enum('category', [
                'Bills', 'Subscriptions', 'Entertainment', 'Food & Drink', 'Groceries',
                'Health & Wellbeing', 'Gifts', 'Shopping', 'Transport', 'Travel',
                'Business', 'Other'
            ])->after('amount');
        });
    }
};
