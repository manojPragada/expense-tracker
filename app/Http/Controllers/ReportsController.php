<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Income;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ReportsController extends Controller
{
    public function index(Request $request): Response
    {
        $activeTab = $request->input('tab', 'monthly');
        
        if ($activeTab === 'weekly') {
            return $this->weeklyReports();
        }
        
        return $this->monthlyReports();
    }

    protected function monthlyReports(): Response
    {
        $driver = DB::connection()->getDriverName();
        
        // Get current month and previous month
        $currentMonth = Carbon::now()->startOfMonth();
        $previousMonth = $currentMonth->copy()->subMonth();
        
        // Get current month income
        if ($driver === 'sqlite') {
            $currentMonthIncome = Income::whereRaw("strftime('%Y-%m', date) = ?", [$currentMonth->format('Y-m')])
                ->sum('amount');
            
            $previousMonthIncome = Income::whereRaw("strftime('%Y-%m', date) = ?", [$previousMonth->format('Y-m')])
                ->sum('amount');
        } else {
            $currentMonthIncome = Income::whereYear('date', $currentMonth->year)
                ->whereMonth('date', $currentMonth->month)
                ->sum('amount');
            
            $previousMonthIncome = Income::whereYear('date', $previousMonth->year)
                ->whereMonth('date', $previousMonth->month)
                ->sum('amount');
        }
        
        // Calculate percentage change
        $incomeChange = $this->calculatePercentageChange($previousMonthIncome, $currentMonthIncome);
        
        // Get monthly data for the last 12 months
        $monthlyData = $this->getMonthlyData(12);
        
        return Inertia::render('Reports', [
            'activeTab' => 'monthly',
            'currentMonth' => $currentMonth->format('F Y'),
            'previousMonth' => $previousMonth->format('F Y'),
            'currentMonthIncome' => (float) $currentMonthIncome,
            'previousMonthIncome' => (float) $previousMonthIncome,
            'incomeChange' => $incomeChange,
            'monthlyData' => $monthlyData,
        ]);
    }

    protected function weeklyReports(): Response
    {
        $driver = DB::connection()->getDriverName();
        
        // Get current week and previous week
        $currentWeekStart = Carbon::now()->startOfWeek();
        $currentWeekEnd = Carbon::now()->endOfWeek();
        $previousWeekStart = $currentWeekStart->copy()->subWeek();
        $previousWeekEnd = $previousWeekStart->copy()->endOfWeek();
        
        // Get current week income
        if ($driver === 'sqlite') {
            $currentWeekIncome = Income::whereBetween('date', [$currentWeekStart->toDateString(), $currentWeekEnd->toDateString()])
                ->sum('amount');
            
            $previousWeekIncome = Income::whereBetween('date', [$previousWeekStart->toDateString(), $previousWeekEnd->toDateString()])
                ->sum('amount');
        } else {
            $currentWeekIncome = Income::whereBetween('date', [$currentWeekStart, $currentWeekEnd])
                ->sum('amount');
            
            $previousWeekIncome = Income::whereBetween('date', [$previousWeekStart, $previousWeekEnd])
                ->sum('amount');
        }
        
        // Calculate percentage change
        $incomeChange = $this->calculatePercentageChange($previousWeekIncome, $currentWeekIncome);
        
        // Get weekly data for the last 12 weeks
        $weeklyData = $this->getWeeklyData(12);
        
        return Inertia::render('Reports', [
            'activeTab' => 'weekly',
            'currentWeek' => $currentWeekStart->format('M d') . ' - ' . $currentWeekEnd->format('M d, Y'),
            'previousWeek' => $previousWeekStart->format('M d') . ' - ' . $previousWeekEnd->format('M d, Y'),
            'currentWeekIncome' => (float) $currentWeekIncome,
            'previousWeekIncome' => (float) $previousWeekIncome,
            'incomeChange' => $incomeChange,
            'weeklyData' => $weeklyData,
        ]);
    }

    protected function calculatePercentageChange($previous, $current): array
    {
        if ($previous == 0) {
            if ($current > 0) {
                return [
                    'percentage' => 100,
                    'isPositive' => true,
                    'isZero' => false,
                ];
            }
            return [
                'percentage' => 0,
                'isPositive' => false,
                'isZero' => true,
            ];
        }
        
        $percentage = (($current - $previous) / $previous) * 100;
        
        return [
            'percentage' => round(abs($percentage), 2),
            'isPositive' => $percentage >= 0,
            'isZero' => false,
        ];
    }

    protected function getMonthlyData($months = 12): array
    {
        $driver = DB::connection()->getDriverName();
        $data = [];
        $today = Carbon::now();
        
        for ($i = 0; $i < $months; $i++) {
            $month = $today->copy()->subMonths($i)->startOfMonth();
            $previousMonth = $month->copy()->subMonth();
            
            if ($driver === 'sqlite') {
                $monthIncome = Income::whereRaw("strftime('%Y-%m', date) = ?", [$month->format('Y-m')])
                    ->sum('amount');
                
                $prevMonthIncome = Income::whereRaw("strftime('%Y-%m', date) = ?", [$previousMonth->format('Y-m')])
                    ->sum('amount');
            } else {
                $monthIncome = Income::whereYear('date', $month->year)
                    ->whereMonth('date', $month->month)
                    ->sum('amount');
                
                $prevMonthIncome = Income::whereYear('date', $previousMonth->year)
                    ->whereMonth('date', $previousMonth->month)
                    ->sum('amount');
            }
            
            $change = $this->calculatePercentageChange($prevMonthIncome, $monthIncome);
            
            $data[] = [
                'month' => $month->format('F Y'),
                'income' => (float) $monthIncome,
                'previousIncome' => (float) $prevMonthIncome,
                'change' => $change,
            ];
        }
        
        return array_reverse($data);
    }

    protected function getWeeklyData($weeks = 12): array
    {
        $driver = DB::connection()->getDriverName();
        $data = [];
        $today = Carbon::now();
        
        for ($i = 0; $i < $weeks; $i++) {
            $weekStart = $today->copy()->subWeeks($i)->startOfWeek();
            $weekEnd = $weekStart->copy()->endOfWeek();
            $previousWeekStart = $weekStart->copy()->subWeek();
            $previousWeekEnd = $previousWeekStart->copy()->endOfWeek();
            
            if ($driver === 'sqlite') {
                $weekIncome = Income::whereBetween('date', [$weekStart->toDateString(), $weekEnd->toDateString()])
                    ->sum('amount');
                
                $prevWeekIncome = Income::whereBetween('date', [$previousWeekStart->toDateString(), $previousWeekEnd->toDateString()])
                    ->sum('amount');
            } else {
                $weekIncome = Income::whereBetween('date', [$weekStart, $weekEnd])
                    ->sum('amount');
                
                $prevWeekIncome = Income::whereBetween('date', [$previousWeekStart, $previousWeekEnd])
                    ->sum('amount');
            }
            
            $change = $this->calculatePercentageChange($prevWeekIncome, $weekIncome);
            
            $data[] = [
                'week' => $weekStart->format('M d') . ' - ' . $weekEnd->format('M d, Y'),
                'income' => (float) $weekIncome,
                'previousIncome' => (float) $prevWeekIncome,
                'change' => $change,
            ];
        }
        
        return array_reverse($data);
    }
}
