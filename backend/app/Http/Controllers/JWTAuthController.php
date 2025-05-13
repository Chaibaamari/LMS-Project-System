<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\StoreUserRequest;
use Illuminate\Http\Request;
use App\Models\User;
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
            return response()->json(['error' => [ "msg" => $validator->errors()->toJson() ] ], 400);
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
        if($user){
            if(!$user->active){
                return response()->json(['error' => ['msg' => 'Account not activated']], 403);
            }
        }

        try {
            if (! $token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => ["msg" => 'Invalid credentials' ] ], 401);
            }

            $user = auth()->user();

            $customClaims = [
                'exp' => now()->addHours(1)->timestamp,
                'role' => $user->role,
                'active' => $user->active
            ];
            $token = JWTAuth::claims($customClaims)->attempt($credentials);

            $token = JWTAuth::claims($customClaims)->attempt($credentials);

            return response()->json(compact('token'));
        } catch (JWTException $e) {
            return response()->json(['error' => ["msg" => 'Could not create token' ] ], 500);
        }
    }

    // Get authenticated user
    public function getUser()
    {
        try {
            if (! $user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['error' => ["msg" => 'User not found' ] ], 404);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => ["msg" => 'Invalid token' ] ], 400);
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
            'active' => True]);
        return response()->json(['message' => 'User Activated Successfully']);
    }

    public function deactivateUser($id)
    {
        $user = User::find($id)->update([
            'active' => False]);
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
    public function getAllUsers(){
        $users = User::select('name', 'email', 'role', 'active')
            ->whereIn('role', ['consultant', 'gestionnaire'])
            ->get();

        return response()->json([
            'users' => $users,
        ]);
    }
}
