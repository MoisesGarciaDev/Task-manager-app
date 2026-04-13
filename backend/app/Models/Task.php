<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 
        'description', 
        'is_completed', 
        'user_id', 
        'is_private', 
        'share_token'
    ];

    protected static function booted()
    {
        static::creating(function ($task) {
            $task->share_token = bin2hex(random_bytes(16)); 
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    
}
