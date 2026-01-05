<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\IncomeController;
use App\Http\Controllers\OverviewController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportsController;
use App\Http\Controllers\SubmitController;
use App\Http\Controllers\SubmissionsController;
use App\Http\Controllers\WeeklyOverviewController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('overview');
    }
    return redirect()->route('login');
});

Route::middleware('auth')->group(function () {
    Route::get('/submit', [SubmitController::class, 'index'])->name('submit');
    Route::get('/submissions', [SubmissionsController::class, 'index'])->name('submissions');
    Route::get('/overview', [OverviewController::class, 'index'])->name('overview');
    Route::get('/weekly-overview', [WeeklyOverviewController::class, 'index'])->name('weekly-overview');
    Route::get('/reports', [ReportsController::class, 'index'])->name('reports');
    Route::get('/categories', [CategoryController::class, 'index'])->name('categories');
    
    Route::post('/expenses', [ExpenseController::class, 'store'])->name('expenses.store');
    Route::put('/expenses/{expense}', [ExpenseController::class, 'update'])->name('expenses.update');
    Route::delete('/expenses/{expense}', [ExpenseController::class, 'destroy'])->name('expenses.destroy');
    Route::post('/expenses/{expense}/cancel-recurring', [ExpenseController::class, 'cancelRecurring'])->name('expenses.cancel-recurring');
    
    Route::post('/incomes', [IncomeController::class, 'store'])->name('incomes.store');
    Route::put('/incomes/{income}', [IncomeController::class, 'update'])->name('incomes.update');
    Route::delete('/incomes/{income}', [IncomeController::class, 'destroy'])->name('incomes.destroy');
    Route::post('/incomes/{income}/cancel-recurring', [IncomeController::class, 'cancelRecurring'])->name('incomes.cancel-recurring');
    
    Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::put('/categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');
    
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
