<?php

namespace App\Data;

use Illuminate\Support\Carbon;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class CategoryData extends Data
{
    public function __construct(
        public ?string $id,
        public string $name,
        public ?Carbon $created_at,
        public ?Carbon $updated_at,
        public ?Carbon $deleted_at,
    ) {
    }
}
