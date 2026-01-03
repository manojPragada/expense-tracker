<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed categories first
        $this->call(CategorySeeder::class);
        
        User::factory()->create([
            'name' => 'Sai Manoj',
            'email' => 'pragadasaimanoj@gmail.com',
            'password' => Hash::make('Sai@4137*'),
        ]);

        User::factory()->create([
            'name' => 'Sneha Shaji',
            'email' => 'snehashaji@gmail.com',
            'password' => Hash::make('Sneha@4137*'),
        ]);
    }
}
