<?php

use App\Http\Controllers\DirectionController;
use App\Http\Controllers\EmployeController;
use App\Http\Controllers\FonctionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\JWTAuthController;
use App\Http\Middleware\JwtMiddleware;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Jwt Authentication and Autorization
Route::post('register', [JWTAuthController::class, 'register']);
Route::post('login', [JWTAuthController::class, 'login']);

Route::middleware([JwtMiddleware::class])->group(function () {
    Route::get('user', [JWTAuthController::class, 'getUser']);
    Route::post('logout', [JWTAuthController::class, 'logout']);
    Route::get('Employes', [EmployeController::class, 'getAllEmployes']);
    Route::get('Fonctions', [FonctionController::class, 'getAllFonctions']);
    Route::post('Fonctions/new', [FonctionController::class, 'CreateFonction']);
    Route::get('Directions', [DirectionController::class, 'getAllDirections']);
});
/*return response()->json([
            'message' => 'Test route received your request!',
            'data' => $request->all()
        ]);*/
