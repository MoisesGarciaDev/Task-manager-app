<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'is_completed' => (bool) $this->is_completed,
            'is_private' => (bool) $this->is_private,
            'share_token' => $this->share_token,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'), 
        ];
    }
}