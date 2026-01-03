<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Bills', 'color' => '#EF4444', 'order' => 1],
            ['name' => 'Subscriptions', 'color' => '#F97316', 'order' => 2],
            ['name' => 'Entertainment', 'color' => '#F59E0B', 'order' => 3],
            ['name' => 'Food & Drink', 'color' => '#10B981', 'order' => 4],
            ['name' => 'Groceries', 'color' => '#14B8A6', 'order' => 5],
            ['name' => 'Health & Wellbeing', 'color' => '#06B6D4', 'order' => 6],
            ['name' => 'Gifts', 'color' => '#8B5CF6', 'order' => 7],
            ['name' => 'Shopping', 'color' => '#A855F7', 'order' => 8],
            ['name' => 'Transport', 'color' => '#EC4899', 'order' => 9],
            ['name' => 'Travel', 'color' => '#F43F5E', 'order' => 10],
            ['name' => 'Business', 'color' => '#6366F1', 'order' => 11],
            ['name' => 'Other', 'color' => '#64748B', 'order' => 12],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
