<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Category;
use Inertia\Inertia;
use Inertia\Response;

class SubmitController extends Controller
{
    public function index(): Response
    {
        $users = User::all();
        $categories = Category::orderBy('order')->get();
        
        return Inertia::render('SubmitForm', [
            'users' => $users,
            'categories' => $categories,
        ]);
    }
}
