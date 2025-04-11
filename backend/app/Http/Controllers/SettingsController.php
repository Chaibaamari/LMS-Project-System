<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\StoreSettingsRequest;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class SettingsController extends Controller
{
    
    public function index()
    {
        $user = user::with('Fonction')->get();

        return response()->json(['employes' => $user]);
    }

    public function store(StoreSettingsRequest $request)
    {
        $validated = $request->validated();
        user::create($validated);
        return response()->json($validated, 201);
    }



    public function updateSettings(StoreSettingsRequest $request, string $id)
    {
        $id = $request->input('id');

        if (!$id) {
            return response()->json([
                'message' => 'ID is required',
                'success' => false
            ], 400);
        }

        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'User not found',
                'success' => false
            ], 404);
        }
        $user->update($request->validated());
        return response()->json([
            'message' => 'User updated successfully',
            'data' => $user,
            'success' => true
        ]);
    }

    public function getSettings(string $id)
    {
        $user = User::where('Matricule', $id)->first();

        if (!$user) {
            return response()->json([
                'message' => 'User not found',
                'success' => false
            ], 404);
        }

        return response()->json([
            'message' => 'User retrieved successfully',
            'data' => $user,
            'success' => true
        ]);
    }

}
    

