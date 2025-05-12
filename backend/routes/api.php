<?php

use App\Http\Controllers\DirectionController;
use App\Http\Controllers\EmployeController;
use App\Http\Controllers\FonctionController;
use App\Http\Controllers\FormationController;
use App\Http\Controllers\ImportContoller;
use App\Http\Controllers\JWTAuthController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\StatistiqueController;
use App\Http\Middleware\JwtMiddleware;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('register', [JWTAuthController::class, 'register']);
Route::post('login', [JWTAuthController::class, 'login']);

// Protected routes (JWT authenticated)
Route::middleware([JwtMiddleware::class . ':responsable|gestionnaire|consultant'])->group(function () {
    // Authentication routes
    Route::get('user', [JWTAuthController::class, 'getUser']);
    Route::get('usercount', [JWTAuthController::class, 'usercount']);
    Route::get('allUsers', [JWTAuthController::class, 'getAllUsers']);
    Route::post('logout', [JWTAuthController::class, 'logout']);
    Route::middleware([JwtMiddleware::class . ':responsable'])->group(function () {
        Route::post('createUser', [JWTAuthController::class, 'createUser']);
        Route::get('activateUser/{id}', [JWTAuthController::class, 'activateUser']);
        Route::get('deactivateUser/{id}', [JWTAuthController::class, 'deactivateUser']);
    });
    Route::get('/records', [PlanController::class, 'testyear']);
    Route::middleware('role:responsable')->group(function () {
        Route::post('createUser', [JWTAuthController::class, 'createUser']);
        Route::get('users', [JWTAuthController::class, 'getUsersByRole']);
        Route::put('users/{id}/role', [JWTAuthController::class, 'updateUserRole']);
    });

    // Employee routes partie de chaiba
    Route::prefix('employes')->group(function () {
        Route::get('/', [EmployeController::class, 'index']);
        Route::middleware([JwtMiddleware::class . ':responsable|gestionnaire'])->group(function () {
            Route::post('/new', [EmployeController::class, 'store']);
            Route::get('/edit/{matricule}', [EmployeController::class, 'getEmployee']);
            Route::put('/edit/{matricule}', [EmployeController::class, 'update']);
            Route::delete('/delete/{matricule}', [EmployeController::class, 'destroy']);
            Route::delete('/delete-multiple', [EmployeController::class, 'destroyMultiple']);
        });
    });
    // Function routes
    Route::prefix('functions')->group(function () {
        Route::get('/', [FonctionController::class, 'getAllFonctions']);

        Route::middleware([JwtMiddleware::class . ':responsable|gestionnaire'])->group(function () {
            Route::post('/', [FonctionController::class, 'CreateFonction']); // asque appliqué ca
        });
    });

    Route::prefix('Formation')->group(function () {
        Route::get('/', [FormationController::class, 'getAllFormation']);
        Route::get('/ListeFormation', [FormationController::class, 'getAllIntituleActions']);
    });

    // Direction routes
    Route::prefix('directions')->group(function () {
        Route::get('/', [DirectionController::class, 'getAllDirections']);
        Route::middleware([JwtMiddleware::class . ':responsable|gestionnaire'])->group(function () {
            Route::get('/{id}', [DirectionController::class, 'getDirectionById']);
            Route::post('/{id}/responsable', [DirectionController::class, 'updateResponsable']); // ma5dmnach bihe
        });
    });

    Route::prefix('previsions')->group(function () {
        Route::get('/export', [ImportContoller::class, 'prevexport']);
        Route::get('/', [PlanController::class, 'consultprev']);
        Route::middleware([JwtMiddleware::class . ':responsable|gestionnaire'])->group(function () {
            Route::post('/import', [ImportContoller::class, 'previmport']);
            Route::post('/add', [PlanController::class, 'prevadd']);
            Route::get('/modify/{ID_N}', [PlanController::class, 'getPlanPV']);
            Route::put('/modify/{ID_N}', [PlanController::class, 'prevmodify']);
            Route::delete('/delete/{id}', [PlanController::class, 'destroy']);
            Route::delete('/delete-multiple', [PlanController::class, 'destroyMultiple']);
        });
    });

    Route::prefix('plannotifie')->group(function () {
        Route::get('/export', [ImportContoller::class, 'notifieexport']);
        Route::get('/', [PlanController::class, 'consultnotifie']);
        Route::middleware([JwtMiddleware::class . ':responsable|gestionnaire'])->group(function () {
            Route::post('/import', [ImportContoller::class, 'notifieimport']);
            Route::post('/add', [PlanController::class, 'notifieadd']);
            Route::put('/modify', [PlanController::class, 'notifiemodify']);
        });
    });

    Route::post('createBC', [PlanController::class, 'createBC']);
    Route::get('BC/{month}', [PlanController::class, 'consultBCMonth']);
    Route::get('bonCommand', [PlanController::class, 'consultBC']);
    Route::get('formation-employees/{id}', [PlanController::class, 'getEmployeesByFormation']);
    Route::delete('delete/bondCommand/{matricule}', [PlanController::class, 'DeleteBondCommand']);
    Route::get('TBF', [PlanController::class, 'consultTBF']);
    Route::post('Bilan', [PlanController::class, 'consultBilan']);
    Route::post('createBC', [PlanController::class, 'createBC']);
    Route::post('createDC', [ImportContoller::class, 'createDC']);
    Route::post('bonCommand', [PlanController::class, 'consultBC']);
    Route::get('TBF/{month}', [PlanController::class, 'consultTBF']);
});
Route::get('formation-etat', [FormationController::class, 'getPlansEnCours']);


// statistique
Route::get('Role', [StatistiqueController::class, 'StRole']);
Route::get('PrévisionsTotal', [StatistiqueController::class, 'StPrvtotal']);
Route::get('Prévisions', [StatistiqueController::class, 'StPrv']);
Route::get('Bilan', [PlanController::class, 'consultBilan']); // asque appliqué ca

