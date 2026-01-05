<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Income;
use App\Models\User;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SubmissionsController extends Controller
{
    public function index(): Response
    {
        $expenses = Expense::with(['user', 'category', 'parent'])->orderBy('date', 'desc')->get()->map(function ($expense) {
            $expense->date = $expense->date ? $expense->date->format('Y-m-d') : null;
            $expense->recurring_end_date = $expense->recurring_end_date ? $expense->recurring_end_date->format('Y-m-d') : null;
            return $expense;
        });
        
        $incomes = Income::with(['user', 'parent'])->orderBy('date', 'desc')->get()->map(function ($income) {
            $income->date = $income->date ? $income->date->format('Y-m-d') : null;
            $income->recurring_end_date = $income->recurring_end_date ? $income->recurring_end_date->format('Y-m-d') : null;
            return $income;
        });
        
        $users = User::all();
        $categories = Category::orderBy('order')->get();
        
        return Inertia::render('ViewSubmissions', [
            'expenses' => $expenses,
            'incomes' => $incomes,
            'users' => $users,
            'categories' => $categories,
        ]);
    }
}
