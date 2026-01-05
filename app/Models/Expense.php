<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

class Expense extends Model
{
    protected $fillable = [
        'user_id',
        'date',
        'item',
        'amount',
        'category_id',
        'description',
        'is_recurring',
        'recurring_frequency',
        'recurring_end_date',
        'parent_id',
        'is_recurring_active',
        'last_generated_at',
    ];

    protected $casts = [
        'date' => 'date',
        'amount' => 'decimal:2',
        'is_recurring' => 'boolean',
        'is_recurring_active' => 'boolean',
        'recurring_end_date' => 'date',
        'last_generated_at' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Expense::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Expense::class, 'parent_id');
    }

    /**
     * Scope to find active recurring parent entries
     */
    public function scopeRecurringParents(Builder $query): Builder
    {
        return $query->where('is_recurring', true)
                     ->where('is_recurring_active', true)
                     ->whereNull('parent_id');
    }

    /**
     * Check if the next recurring entry is due
     */
    public function shouldGenerateNext(): bool
    {
        if (!$this->is_recurring || !$this->is_recurring_active || $this->parent_id !== null) {
            return false;
        }

        // Check if past end date
        if ($this->recurring_end_date && Carbon::today()->isAfter($this->recurring_end_date)) {
            return false;
        }

        // Get the last generated date or use the original date
        $lastGenerated = $this->last_generated_at 
            ? Carbon::parse($this->last_generated_at)->startOfDay() 
            : Carbon::parse($this->date)->startOfDay();
        
        $nextDueDate = $this->calculateNextDate($lastGenerated)->startOfDay();

        // Generate if today is greater than or equal to the next due date
        return Carbon::today()->startOfDay()->greaterThanOrEqualTo($nextDueDate);
    }

    /**
     * Calculate the next due date based on frequency
     */
    public function calculateNextDate(Carbon $fromDate): Carbon
    {
        return match($this->recurring_frequency) {
            'daily' => $fromDate->copy()->addDay(),
            'weekly' => $fromDate->copy()->addWeek(),
            'bi-weekly' => $fromDate->copy()->addWeeks(2),
            'monthly' => $fromDate->copy()->addMonth(),
            'yearly' => $fromDate->copy()->addYear(),
            default => $fromDate->copy(),
        };
    }
}
