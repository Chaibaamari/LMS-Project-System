<?php

use App\Http\Controllers\DirectionController;
use App\Http\Controllers\EmployeController;
use App\Http\Controllers\FonctionController;
use App\Http\Controllers\ImportContoller;
use App\Http\Controllers\JWTAuthController;
use App\Http\Controllers\PlanController;
use App\Http\Middleware\JwtMiddleware;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('register', [JWTAuthController::class, 'register']);
Route::post('login', [JWTAuthController::class, 'login']);

// Protected routes (JWT authenticated)
//Route::middleware([JwtMiddleware::class])->group(function () {
    // Authentication routes
    Route::get('user', [JWTAuthController::class, 'getUser']);
    Route::post('logout', [JWTAuthController::class, 'logout']);

    // Employee routes partie de chaiba
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
    Route::get('directions/{id}', [DirectionController::class, 'getDirectionById']); 
    Route::post('directions/{id}/responsable', [DirectionController::class, 'updateResponsable']);
#});

    Route::prefix('previsions')->group(function () {
        Route::post('/import', [ImportContoller::class, 'previmport']);
        Route::get('/export', [ImportContoller::class, 'prevexport']);
        Route::get('/', [PlanController::class, 'consultprev']);
        Route::post('/add', [PlanController::class, 'prevadd']);
        Route::post('/modify', [PlanController::class, 'prevmodify']);
        Route::post('/delete', [PlanController::class, 'prevdelete']);
    });

    Route::prefix('plannotifie')->group(function () {
        Route::post('/import', [ImportContoller::class, 'notifieimport']);
        Route::get('/export', [ImportContoller::class, 'notifieexport']);
        Route::get('/', [PlanController::class, 'consultnotifie']);
        Route::post('/add', [PlanController::class, 'notifieadd']);
        Route::post('/modify', [PlanController::class, 'notifiemodify']);
        Route::post('/delete', [PlanController::class, 'notifiedelete']);
    });

    Route::post('createBC', [PlanController::class, 'createBC']);
    
    Route::post('bonCommand', [PlanController::class,'consultBC']);

    Route::post('TBF', [PlanController::class,'consultTBF']);
    
    Route::post('Bilan', [PlanController::class,'consultBilan']);

    
//});

// Remove the Sanctum route if not using Sanctum
// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();

// });
