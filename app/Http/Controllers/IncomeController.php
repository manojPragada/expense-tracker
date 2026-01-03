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
        ]);

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
        ]);

        $income->update($validated);

        return redirect()->route('submissions', ['type' => 'incomes'])->with('success', 'Income updated successfully.');
    }

    public function destroy(Income $income)
    {
        $income->delete();

        return redirect()->route('submissions', ['type' => 'incomes'])->with('success', 'Income deleted successfully.');
    }
}
