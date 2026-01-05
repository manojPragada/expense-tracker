<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'date' => 'required|date',
            'item' => 'required|string|max:255',
            'amount' => 'required|numeric|min:1',
            'category_id' => 'required|exists:categories,id',
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

        Expense::create($validated);

        return redirect()->route('submissions', ['type' => 'expenses'])->with('success', 'Expense created successfully.');
    }

    public function update(Request $request, Expense $expense)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'date' => 'required|date',
            'item' => 'required|string|max:255',
            'amount' => 'required|numeric|min:1',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'is_recurring' => 'boolean',
            'recurring_frequency' => 'nullable|in:daily,weekly,bi-weekly,monthly,yearly',
            'recurring_end_date' => 'nullable|date|after_or_equal:date',
        ]);

        // Ensure recurring fields are properly set
        if (!empty($validated['is_recurring'])) {
            // If this is being changed to recurring, set initial values
            if (!$expense->is_recurring) {
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

        $expense->update($validated);

        return redirect()->route('submissions', ['type' => 'expenses'])->with('success', 'Expense updated successfully.');
    }

    public function destroy(Expense $expense)
    {
        $expense->delete();

        return redirect()->route('submissions', ['type' => 'expenses'])->with('success', 'Expense deleted successfully.');
    }

    public function cancelRecurring(Expense $expense)
    {
        // If this is a child, find the parent
        $parent = $expense->parent_id ? $expense->parent : $expense;

        // Only parent recurring entries can be cancelled
        if (!$parent->is_recurring || $parent->parent_id !== null) {
            return redirect()->route('submissions', ['type' => 'expenses'])->with('error', 'This is not a recurring expense.');
        }

        // Deactivate the recurring entry
        $parent->update(['is_recurring_active' => false]);

        return redirect()->route('submissions', ['type' => 'expenses'])->with('success', 'Recurring expense subscription cancelled successfully.');
    }
}
