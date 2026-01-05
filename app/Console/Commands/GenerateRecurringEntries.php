<?php

namespace App\Console\Commands;

use App\Models\Expense;
use App\Models\Income;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class GenerateRecurringEntries extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'recurring:generate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate recurring expense and income entries that are due';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting recurring entries generation...');

        $expensesGenerated = $this->generateRecurringExpenses();
        $incomesGenerated = $this->generateRecurringIncomes();

        $this->info("Generated {$expensesGenerated} recurring expense(s)");
        $this->info("Generated {$incomesGenerated} recurring income(s)");
        $this->info('Recurring entries generation completed!');

        return 0;
    }

    /**
     * Generate recurring expenses
     */
    protected function generateRecurringExpenses(): int
    {
        $count = 0;
        $recurringExpenses = Expense::recurringParents()->get();

        $this->info("Found " . $recurringExpenses->count() . " active recurring expense(s)");

        foreach ($recurringExpenses as $parent) {
            $this->info("Checking expense #{$parent->id} - Date: {$parent->date}, Frequency: {$parent->recurring_frequency}, Last Generated: " . ($parent->last_generated_at ?? 'never'));
            
            if ($parent->shouldGenerateNext()) {
                $this->info("Expense #{$parent->id} is due for generation");
                $count += $this->generateExpenseChildren($parent);
            } else {
                $this->info("Expense #{$parent->id} is not due yet");
            }
        }

        return $count;
    }

    /**
     * Generate recurring incomes
     */
    protected function generateRecurringIncomes(): int
    {
        $count = 0;
        $recurringIncomes = Income::recurringParents()->get();

        foreach ($recurringIncomes as $parent) {
            if ($parent->shouldGenerateNext()) {
                $count += $this->generateIncomeChildren($parent);
            }
        }

        return $count;
    }

    /**
     * Generate child expense entries for a parent
     */
    protected function generateExpenseChildren(Expense $parent): int
    {
        $count = 0;
        $lastGenerated = $parent->last_generated_at 
            ? Carbon::parse($parent->last_generated_at) 
            : Carbon::parse($parent->date);
        $today = Carbon::today();

        // Generate all missed entries up to today
        while (true) {
            $nextDate = $parent->calculateNextDate($lastGenerated);

            // Stop if next date is in the future
            if ($nextDate->isAfter($today)) {
                break;
            }

            // Stop if past end date
            if ($parent->recurring_end_date && $nextDate->isAfter($parent->recurring_end_date)) {
                // Deactivate the recurring entry
                $parent->update(['is_recurring_active' => false]);
                Log::info("Recurring expense #{$parent->id} reached end date and was deactivated");
                break;
            }

            // Create child entry
            $childData = $parent->only([
                'user_id',
                'item',
                'amount',
                'category_id',
                'description',
            ]);

            $childData['date'] = $nextDate->toDateString();
            $childData['parent_id'] = $parent->id;
            $childData['is_recurring'] = false;
            $childData['recurring_frequency'] = null;
            $childData['recurring_end_date'] = null;
            $childData['is_recurring_active'] = false;
            $childData['last_generated_at'] = null;

            Expense::create($childData);
            $count++;

            Log::info("Generated child expense for parent #{$parent->id} with date {$nextDate->toDateString()}");

            $lastGenerated = $nextDate;
        }

        // Update parent's last_generated_at
        if ($count > 0) {
            $parent->update(['last_generated_at' => $lastGenerated->toDateString()]);
        }

        return $count;
    }

    /**
     * Generate child income entries for a parent
     */
    protected function generateIncomeChildren(Income $parent): int
    {
        $count = 0;
        $lastGenerated = $parent->last_generated_at 
            ? Carbon::parse($parent->last_generated_at) 
            : Carbon::parse($parent->date);
        $today = Carbon::today();

        // Generate all missed entries up to today
        while (true) {
            $nextDate = $parent->calculateNextDate($lastGenerated);

            // Stop if next date is in the future
            if ($nextDate->isAfter($today)) {
                break;
            }

            // Stop if past end date
            if ($parent->recurring_end_date && $nextDate->isAfter($parent->recurring_end_date)) {
                // Deactivate the recurring entry
                $parent->update(['is_recurring_active' => false]);
                Log::info("Recurring income #{$parent->id} reached end date and was deactivated");
                break;
            }

            // Create child entry
            $childData = $parent->only([
                'user_id',
                'income_source',
                'amount',
                'description',
            ]);

            $childData['date'] = $nextDate->toDateString();
            $childData['parent_id'] = $parent->id;
            $childData['is_recurring'] = false;
            $childData['recurring_frequency'] = null;
            $childData['recurring_end_date'] = null;
            $childData['is_recurring_active'] = false;
            $childData['last_generated_at'] = null;

            Income::create($childData);
            $count++;

            Log::info("Generated child income for parent #{$parent->id} with date {$nextDate->toDateString()}");

            $lastGenerated = $nextDate;
        }

        // Update parent's last_generated_at
        if ($count > 0) {
            $parent->update(['last_generated_at' => $lastGenerated->toDateString()]);
        }

        return $count;
    }
}
