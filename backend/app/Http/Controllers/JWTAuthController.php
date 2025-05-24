<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\StoreUserRequest;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class JWTAuthController extends Controller
{
    // User registration
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'role' => 'sometimes|in:responsable,gestionnaire,consultant' // Add role validation
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => ["msg" => $validator->errors()->toJson()]], 400);
        }

        $user = User::create([
            'name' => $request->get('name'),
            'email' => $request->get('email'),
            'password' => Hash::make($request->get('password')),
            'role' => $request->get('role', 'consultant'), // Default to consultant
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json(compact('user', 'token'), 201);
    }

    // User login
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        $user = User::where('email', $credentials['email'])->first();

        try {
            if ($user->active == 0) {
                return response()->json(['error' => ['msg' => 'Votre compte n’a pas encore été activé. Veuillez contacter l’administrateur.']], 422);
            }
            if (! $token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => ["msg" => 'Adresse e-mail ou mot de passe incorrect. Veuillez réessayer.']], 401);
            }

            $user = auth()->user();

            $customClaims = [
                'exp' => now()->addHours(2)->timestamp,
                'role' => $user->role,
                'active' => $user->active
            ];
            $token = JWTAuth::claims($customClaims)->attempt($credentials);

            $token = JWTAuth::claims($customClaims)->attempt($credentials);

            return response()->json(compact('token'));
        } catch (JWTException $e) {
            return response()->json(['error' => ["msg" => 'Could not create token']], 500);
        }
    }

    // Get authenticated user
    public function getUser()
    {
        try {
            if (! $user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['error' => ["msg" => 'User not found']], 404);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => ["msg" => 'Invalid token']], 400);
        }

        return response()->json(compact('user'));
    }

    // User logout
    public function logout()
    {
        JWTAuth::invalidate(JWTAuth::getToken());

        return response()->json(['message' => 'Successfully logged out']);
    }

    public function usercount()
    {
        $user = User::count();
        return response()->json(compact('user'));
    }

    public function createUser(StoreUserRequest $request)
    {
        $validated = $request->validated();
        $validated['password'] = Hash::make($validated['password']);
        $user = User::create($validated);
        $token = JWTAuth::fromUser($user);

        return response()->json(compact('user', 'token'), 201);
    }

    public function activateUser($id)
    {
        $user = User::find($id)->update([
            'active' => True
        ]);
        return response()->json(['message' => 'User Activated Successfully']);
    }

    public function deactivateUser($id)
    {
        $user = User::find($id)->update([
            'active' => False
        ]);
        return response()->json(['message' => 'User Dectivated Successfully']);
    }
    // JWTAuthController.php
    public function getUsersByRole($role)
    {
        if (!in_array($role, ['responsable', 'gestionnaire', 'consultant'])) {
            return response()->json(['error' => 'Invalid role'], 400);
        }

        $users = User::where('role', $role)->where('active', true)->get();
        return response()->json(compact('users'));
    }
    public function getAllUsers()
    {
        $users = User::select('id', 'name', 'email', 'role', 'active')
            ->whereIn('role', ['consultant', 'gestionnaire', 'responsable'])
            ->get();

        return response()->json([
            'users' => $users,
        ]);
    }

    public function getUserById(Request $request, string $id)
    {
        try {

            $employe = User::select(['id', 'name', 'email', 'role', 'active', 'password'])
                ->where('id', $id)
                ->first();

            DB::commit();

            return response()->json([
                'message' => 'Employé mis à jour avec succès.',
                'Employe' => $employe,
                'success' => true
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Échec de la mise à jour de l\'employé  ',
                'success' => false
            ], 500);
        }
    }
    public function updatePassword(Request $request, $id)
    {
        User::where('id', $id)->update([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'password' => Hash::make($request->input('password')),
            'role' => $request->input('role'),
            'active' => $request->input('active'),

        ]);

        return response()->json([
            'message' => 'Utilisateur mis à jour avec succès',
        ]);
    }
}
