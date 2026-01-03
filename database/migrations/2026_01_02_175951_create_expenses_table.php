<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->string('item');
            $table->decimal('amount', 10, 2);
            $table->enum('category', [
                'Bills',
                'Subscriptions',
                'Entertainment',
                'Food & Drink',
                'Groceries',
                'Health & Wellbeing',
                'Gifts',
                'Shopping',
                'Transport',
                'Travel',
                'Business',
                'Other'
            ]);
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('expenses');
    }
};
