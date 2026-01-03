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
        $expenses = Expense::with(['user', 'category'])->orderBy('date', 'desc')->get();
        $incomes = Income::with('user')->orderBy('date', 'desc')->get();
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
