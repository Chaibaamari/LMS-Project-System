<?php

use App\Http\Controllers\DirectionController;
use App\Http\Controllers\EmployeController;
use App\Http\Controllers\FonctionController;
use App\Http\Controllers\JWTAuthController;
use App\Http\Middleware\JwtMiddleware;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('register', [JWTAuthController::class, 'register']);
Route::post('login', [JWTAuthController::class, 'login']);

// Protected routes (JWT authenticated)
Route::middleware([JwtMiddleware::class])->group(function () {
    // Authentication routes
    Route::get('user', [JWTAuthController::class, 'getUser']);
    Route::post('logout', [JWTAuthController::class, 'logout']);

    // Employee routes
    Route::prefix('employes')->group(function () {
        Route::get('/', [EmployeController::class, 'index']);
        Route::post('/new', [EmployeController::class, 'store']);
        // ->withoutMiddleware(['auth:api']); // Disables auth requirement
        Route::put('/edit/{matricule}', [EmployeController::class , 'update']);
    });

    // Function routes
    Route::prefix('functions')->group(function () {
        Route::get('/', [FonctionController::class, 'getAllFonctions']);
        Route::post('/', [FonctionController::class, 'CreateFonction']);
    });

    // Direction routes
    Route::get('directions', [DirectionController::class, 'getAllDirections']);
});

// Remove the Sanctum route if not using Sanctum
// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();

// });
