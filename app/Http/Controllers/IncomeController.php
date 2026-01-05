<?php

namespace App\Http\Controllers;

use App\Models\Income;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IncomeController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'date' => 'required|date',
            'income_source' => 'required|in:Work,Any Other',
            'amount' => 'required|numeric|min:1',
            'description' => 'nullable|string',
            'is_recurring' => 'nullable|boolean',
            'recurring_frequency' => 'nullable|in:daily,weekly,bi-weekly,monthly,yearly',
            'recurring_end_date' => 'nullable|date|after_or_equal:date',
        ]);

        // Convert checkbox value to boolean
        $validated['is_recurring'] = filter_var($validated['is_recurring'] ?? false, FILTER_VALIDATE_BOOLEAN);

        // Ensure recurring fields are properly set
        if ($validated['is_recurring']) {
            $validated['last_generated_at'] = $validated['date'];
            $validated['is_recurring_active'] = true;
            $validated['parent_id'] = null;
        } else {
            // Clear recurring fields if not recurring
            $validated['is_recurring'] = false;
            $validated['recurring_frequency'] = null;
            $validated['recurring_end_date'] = null;
            $validated['is_recurring_active'] = false;
            $validated['last_generated_at'] = null;
        }

        Income::create($validated);

        return redirect()->route('submissions', ['type' => 'incomes'])->with('success', 'Income created successfully.');
    }

    public function update(Request $request, Income $income)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'date' => 'required|date',
            'income_source' => 'required|in:Work,Any Other',
            'amount' => 'required|numeric|min:1',
            'description' => 'nullable|string',
            'is_recurring' => 'boolean',
            'recurring_frequency' => 'nullable|in:daily,weekly,bi-weekly,monthly,yearly',
            'recurring_end_date' => 'nullable|date|after_or_equal:date',
        ]);

        // Ensure recurring fields are properly set
        if (!empty($validated['is_recurring'])) {
            // If this is being changed to recurring, set initial values
            if (!$income->is_recurring) {
                $validated['last_generated_at'] = $validated['date'];
                $validated['is_recurring_active'] = true;
            }
            $validated['parent_id'] = null;
        } else {
            // Clear recurring fields if not recurring
            $validated['is_recurring'] = false;
            $validated['recurring_frequency'] = null;
            $validated['recurring_end_date'] = null;
            $validated['is_recurring_active'] = false;
            $validated['last_generated_at'] = null;
        }

        $income->update($validated);

        return redirect()->route('submissions', ['type' => 'incomes'])->with('success', 'Income updated successfully.');
    }

    public function destroy(Income $income)
    {
        $income->delete();

        return redirect()->route('submissions', ['type' => 'incomes'])->with('success', 'Income deleted successfully.');
    }

    public function cancelRecurring(Income $income)
    {
        // If this is a child, find the parent
        $parent = $income->parent_id ? $income->parent : $income;

        // Only parent recurring entries can be cancelled
        if (!$parent->is_recurring || $parent->parent_id !== null) {
            return redirect()->route('submissions', ['type' => 'incomes'])->with('error', 'This is not a recurring income.');
        }

        // Deactivate the recurring entry
        $parent->update(['is_recurring_active' => false]);

        return redirect()->route('submissions', ['type' => 'incomes'])->with('success', 'Recurring income subscription cancelled successfully.');
    }
}
