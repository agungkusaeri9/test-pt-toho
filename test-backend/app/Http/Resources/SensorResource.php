<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SensorResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'suhu' => $this->suhu,
            'temperature' => $this->temperature,
            'status_a' => $this->status_a,
            'status_b' => $this->status_b,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
