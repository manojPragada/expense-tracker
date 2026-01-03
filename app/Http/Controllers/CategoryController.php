<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
        $categories = Category::orderBy('order')->get();
        
        return Inertia::render('Categories', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
            'color' => 'required|string|regex:/^#[0-9A-F]{6}$/i',
        ]);

        $lastOrder = Category::max('order') ?? 0;
        $validated['order'] = $lastOrder + 1;

        Category::create($validated);

        return redirect()->route('categories')->with('success', 'Category created successfully.');
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
            'color' => 'required|string|regex:/^#[0-9A-F]{6}$/i',
        ]);

        $category->update($validated);

        return redirect()->route('categories')->with('success', 'Category updated successfully.');
    }

    public function destroy(Category $category)
    {
        // Check if category has expenses
        if ($category->expenses()->count() > 0) {
            return redirect()->route('categories')->with('error', 'Cannot delete category with existing expenses.');
        }

        $category->delete();

        return redirect()->route('categories')->with('success', 'Category deleted successfully.');
    }
}
