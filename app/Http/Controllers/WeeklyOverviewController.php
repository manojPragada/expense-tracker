<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Income;
use App\Models\Category;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WeeklyOverviewController extends Controller
{
    public function index(Request $request): Response
    {
        // Get all years that have expense or income data
        $expenseYears = Expense::selectRaw("DISTINCT CAST(strftime('%Y', date) AS INTEGER) as year")
            ->orderBy('year', 'desc')
            ->pluck('year')
            ->toArray();
        
        $incomeYears = Income::selectRaw("DISTINCT CAST(strftime('%Y', date) AS INTEGER) as year")
            ->orderBy('year', 'desc')
            ->pluck('year')
            ->toArray();
        
        // Merge and get unique years
        $availableYears = array_unique(array_merge($expenseYears, $incomeYears));
        rsort($availableYears);
        
        // If no data exists, use current year
        if (empty($availableYears)) {
            $availableYears = [Carbon::now()->year];
        }
        
        // Get selected year from request or use current year
        $selectedYear = $request->input('year', Carbon::now()->year);
        
        // Get the start of the selected year
        $yearStart = Carbon::create($selectedYear, 1, 1)->startOfYear()->startOfWeek(Carbon::MONDAY);
        
        // Get the end of the selected year
        $yearEnd = Carbon::create($selectedYear, 12, 31)->endOfYear();
        
        // Calculate number of weeks from start of year to end of year
        $weeksToShow = $yearStart->diffInWeeks($yearEnd) + 1;
        
        // Get all expenses and incomes for the selected year with category relationship
        $expenses = Expense::with('category')->whereYear('date', $selectedYear)->whereNotNull('category_id')->get();
        $incomes = Income::whereYear('date', $selectedYear)->get();
        
        // Get all categories
        $categories = Category::orderBy('order')->get();
        
        // Group expenses by week
        $expensesByWeek = [];
        foreach ($expenses as $expense) {
            $expenseDate = Carbon::parse($expense->date);
            $weekStartDate = $expenseDate->copy()->startOfWeek(Carbon::MONDAY);
            $weekKey = $weekStartDate->format('Y-m-d'); // Use date as key for consistency
            
            if (!isset($expensesByWeek[$weekKey])) {
                $expensesByWeek[$weekKey] = [
                    'week_start' => $weekStartDate,
                    'expenses' => [],
                ];
            }
            
            $expensesByWeek[$weekKey]['expenses'][] = $expense;
        }
        
        // Group incomes by week
        $incomesByWeek = [];
        foreach ($incomes as $income) {
            $incomeDate = Carbon::parse($income->date);
            $weekStartDate = $incomeDate->copy()->startOfWeek(Carbon::MONDAY);
            $weekKey = $weekStartDate->format('Y-m-d'); // Use date as key for consistency
            
            if (!isset($incomesByWeek[$weekKey])) {
                $incomesByWeek[$weekKey] = [
                    'week_start' => $weekStartDate,
                    'incomes' => [],
                ];
            }
            
            $incomesByWeek[$weekKey]['incomes'][] = $income;
        }
        
        // Build weekly data
        $weeklyData = [];
        
        for ($weekNum = 1; $weekNum <= $weeksToShow; $weekNum++) {
            $currentWeekStart = $yearStart->copy()->addWeeks($weekNum - 1);
            $weekKey = $currentWeekStart->format('Y-m-d'); // Use date as key for consistency
            
            $weekData = [
                'week' => $weekNum,
                'week_start' => $currentWeekStart->format('d-M-Y'),
                'week_start_date' => $currentWeekStart->format('Y-m-d'),
                'categories' => [],
                'total_expenditure' => 0,
                'income' => 0,
                'gross_savings' => 0,
            ];
            
            // Calculate category totals for this week
            $weekExpenses = isset($expensesByWeek[$weekKey]) ? $expensesByWeek[$weekKey]['expenses'] : [];
            foreach ($categories as $category) {
                $categoryTotal = collect($weekExpenses)
                    ->where('category_id', $category->id)
                    ->sum('amount');
                $weekData['categories'][$category->name] = (float) $categoryTotal;
                $weekData['total_expenditure'] += $categoryTotal;
            }
            
            // Calculate income for this week
            $weekIncomes = isset($incomesByWeek[$weekKey]) ? $incomesByWeek[$weekKey]['incomes'] : [];
            $weekData['income'] = (float) collect($weekIncomes)->sum('amount');
            
            // Calculate gross savings
            $weekData['gross_savings'] = $weekData['income'] - $weekData['total_expenditure'];
            
            $weeklyData[] = $weekData;
        }
        
        return Inertia::render('WeeklyOverview', [
            'weeklyData' => $weeklyData,
            'categories' => $categories->pluck('name')->toArray(),
            'availableYears' => $availableYears,
            'selectedYear' => (int) $selectedYear,
        ]);
    }
}
