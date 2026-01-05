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
        // Add recurring columns to expenses table
        Schema::table('expenses', function (Blueprint $table) {
            $table->boolean('is_recurring')->default(false)->after('description');
            $table->enum('recurring_frequency', ['daily', 'weekly', 'bi-weekly', 'monthly', 'yearly'])->nullable()->after('is_recurring');
            $table->date('recurring_end_date')->nullable()->after('recurring_frequency');
            $table->foreignId('parent_id')->nullable()->after('recurring_end_date')->constrained('expenses')->onDelete('cascade');
            $table->boolean('is_recurring_active')->default(true)->after('parent_id');
            $table->date('last_generated_at')->nullable()->after('is_recurring_active');
            
            // Add indexes for better query performance
            $table->index('parent_id');
            $table->index('is_recurring');
            $table->index('is_recurring_active');
        });

        // Add recurring columns to incomes table
        Schema::table('incomes', function (Blueprint $table) {
            $table->boolean('is_recurring')->default(false)->after('description');
            $table->enum('recurring_frequency', ['daily', 'weekly', 'bi-weekly', 'monthly', 'yearly'])->nullable()->after('is_recurring');
            $table->date('recurring_end_date')->nullable()->after('recurring_frequency');
            $table->foreignId('parent_id')->nullable()->after('recurring_end_date')->constrained('incomes')->onDelete('cascade');
            $table->boolean('is_recurring_active')->default(true)->after('parent_id');
            $table->date('last_generated_at')->nullable()->after('is_recurring_active');
            
            // Add indexes for better query performance
            $table->index('parent_id');
            $table->index('is_recurring');
            $table->index('is_recurring_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('expenses', function (Blueprint $table) {
            $table->dropForeign(['parent_id']);
            $table->dropIndex(['parent_id']);
            $table->dropIndex(['is_recurring']);
            $table->dropIndex(['is_recurring_active']);
            $table->dropColumn([
                'is_recurring',
                'recurring_frequency',
                'recurring_end_date',
                'parent_id',
                'is_recurring_active',
                'last_generated_at'
            ]);
        });

        Schema::table('incomes', function (Blueprint $table) {
            $table->dropForeign(['parent_id']);
            $table->dropIndex(['parent_id']);
            $table->dropIndex(['is_recurring']);
            $table->dropIndex(['is_recurring_active']);
            $table->dropColumn([
                'is_recurring',
                'recurring_frequency',
                'recurring_end_date',
                'parent_id',
                'is_recurring_active',
                'last_generated_at'
            ]);
        });
    }
};
