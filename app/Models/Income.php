<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Income extends Model
{
    protected $fillable = [
        'user_id',
        'date',
        'income_source',
        'amount',
        'description',
    ];

    protected $casts = [
        'date' => 'date',
        'amount' => 'decimal:2',
    ];

    public const INCOME_SOURCES = [
        'Work',
        'Any Other',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
