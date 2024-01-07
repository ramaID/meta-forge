<?php

use App\Models\Category;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

use function Pest\Laravel\artisan;
use function Pest\Laravel\deleteJson;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;
use function Pest\Laravel\putJson;

it('can create a category', function () {
    $postEndpoint = '/api/v1/categories';
    $user = User::factory()->create();

    Auth::login($user);

    $name = fake()->name();
    $postRequest = postJson($postEndpoint, compact('name'));
    $category = $postRequest->json();

    expect($postRequest->getStatusCode())->toBe(201);
    expect($category)->name->toBe($name);

    $name = fake()->name();
    $postRequest = postJson($postEndpoint, compact('name'));
    $json = $postRequest->json();

    expect($postRequest->getStatusCode())->toBe(201);
    expect($json)->name->toBe($name);

    $name = null;
    $postRequest = postJson($postEndpoint, compact('name'));

    expect($postRequest->getStatusCode())->toBe(422);

    expect(Category::all()->count())->toBe(2);
});

it('can get categories with pagination', function () {
    artisan('db:seed');

    $getRequest = getJson('api/v1/categories');

    expect($getRequest->getStatusCode())->toBe(200);

    $data = $getRequest->json('data');

    expect($data)->toHaveCount(10);

    $meta = $getRequest->json('meta');

    expect($meta)
        ->current_page->toBe(1)
        ->from->toBe(1)
        ->last_page->toBe(1)
        ->next_page_url->toBe(null)
        ->per_page->toBe(15)
        ->prev_page_url->toBe(null)
        ->to->toBe(10)
        ->total->toBe(10);
});

it('can get category', function () {
    artisan('db:seed');

    $category = Category::query()->first();

    $getRequest = getJson('api/v1/categories/wrong_id' . $category->id);

    expect($getRequest->getStatusCode())->toBe(404);

    $getRequest = getJson('api/v1/categories/' . $category->id);

    expect($getRequest->getStatusCode())
        ->toBe(200)
        ->and($getRequest->json())
        ->id->toBe($category->id)
        ->title->toBe($category->title)
        ->parent_id->toBe($category->parent_id);
});

it('can update a category', function () {
    artisan('db:seed');

    $user = User::factory()->create();

    Auth::login($user);

    $category = Category::query()->first();

    $putRequest = putJson('/api/v1/categories/wrong_id' . $category->id);

    expect($putRequest->getStatusCode())->toBe(404);

    $putRequest = putJson('/api/v1/categories/' . $category->id);

    expect($putRequest->getStatusCode())
        ->toBe(422)
        ->and($putRequest->json())
        ->toBeArray()
        ->and($putRequest->json('errors'))->name->toBeArray();

    $putRequest = putJson('/api/v1/categories/' . $category->id, [
        'name' => 'Updated name',
    ]);

    expect($putRequest->getStatusCode())->toBe(204);
});

it('can delete a category', function () {
    artisan('db:seed');

    $user = User::factory()->create();

    Auth::login($user);

    $category = Category::query()->first();

    $putRequest = deleteJson('/api/v1/categories/wrong_id' . $category->id);

    expect($putRequest->getStatusCode())->toBe(404);

    $putRequest = deleteJson('/api/v1/categories/' . $category->id);

    expect($putRequest->getStatusCode())->toBe(204);
});
