<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;

class OverviewController extends Controller
{
    public function index(Request $request): Response
    {
        // Get all years that have expense data
        $availableYears = Expense::select(DB::raw("DISTINCT CAST(strftime('%Y', date) AS INTEGER) as year"))
            ->orderBy('year', 'desc')
            ->pluck('year')
            ->toArray();
        
        // If no data exists, use current year
        if (empty($availableYears)) {
            $availableYears = [now()->year];
        }
        
        // Get selected year from request or use current year
        $selectedYear = $request->input('year', now()->year);
        
        // Get all categories
        $categories = Category::orderBy('order')->get();
        
        // Get monthly expenses by category for the selected year
        $monthlyData = Expense::select(
            DB::raw("CAST(strftime('%m', date) AS INTEGER) as month"),
            'category_id',
            DB::raw('SUM(amount) as total')
        )
        ->whereRaw("strftime('%Y', date) = ?", [(string) $selectedYear])
        ->whereNotNull('category_id') // Only expenses with valid categories
        ->groupBy('month', 'category_id')
        ->orderBy('month')
        ->get()
        ->groupBy('month');

        // Get monthly income data
        $monthlyIncome = \App\Models\Income::select(
            DB::raw("CAST(strftime('%m', date) AS INTEGER) as month"),
            DB::raw('SUM(amount) as total')
        )
        ->whereRaw("strftime('%Y', date) = ?", [(string) $selectedYear])
        ->groupBy('month')
        ->get()
        ->pluck('total', 'month');

        // Format data for chart
        $yearlyBreakdown = [];
        
        for ($month = 1; $month <= 12; $month++) {
            $monthName = \Carbon\Carbon::create($selectedYear, $month, 1)->format('F');
            $monthData = [
                'month' => $monthName,
                'categories' => [],
                'income' => $monthlyIncome->get($month, 0)
            ];
            
            $monthExpenses = $monthlyData->get($month, collect());
            
            foreach ($categories as $category) {
                $categoryTotal = $monthExpenses
                    ->where('category_id', $category->id)
                    ->first();
                $monthData['categories'][$category->name] = $categoryTotal ? (float) $categoryTotal->total : 0;
            }
            
            $yearlyBreakdown[] = $monthData;
        }

        // Get category totals and percentages
        $categoryTotals = Expense::select(
            'category_id',
            DB::raw('SUM(amount) as total')
        )
        ->with('category')
        ->whereRaw("strftime('%Y', date) = ?", [(string) $selectedYear])
        ->whereNotNull('category_id') // Only get expenses with categories
        ->groupBy('category_id')
        ->get();

        $totalExpenses = $categoryTotals->sum('total');
        
        $categoryData = $categoryTotals
            ->filter(function ($item) {
                return $item->category !== null; // Filter out null categories
            })
            ->map(function ($item) use ($totalExpenses) {
                return [
                    'category' => $item->category->name,
                    'amount' => (float) $item->total,
                    'percentage' => $totalExpenses > 0 ? round((($item->total / $totalExpenses) * 100), 1) : 0,
                ];
            })->sortByDesc('amount')->values();

        return Inertia::render('Overview', [
            'yearlyBreakdown' => $yearlyBreakdown,
            'categoryData' => $categoryData,
            'availableYears' => $availableYears,
            'selectedYear' => (int) $selectedYear,
            'categories' => $categories, // Pass categories with colors
        ]);
    }
}
