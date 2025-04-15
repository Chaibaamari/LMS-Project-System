<?php

namespace App\Http\Requests\User;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            //
            'name' => ['required','string',Rule::unique('users', 'name')],
            'email' => [ 'required', 'string', Rule::unique('users', 'email') ],
            'password' => [ 'required', 'string'],
            'role' => [ 'required', 'string', Rule::in(['responsable', 'gestionnaire', 'consultant']) ],
            ];
    }

    public function messages()
{
    return [
        'name.required' => 'Le nom est obligatoire.',
        'name.string' => 'Le nom doit être une chaîne de caractères.',
        'name.unique' => 'Ce nom est déjà utilisé.',

        'email.required' => 'L\'adresse e-mail est obligatoire.',
        'email.string' => 'L\'adresse e-mail doit être une chaîne de caractères.',
        'email.unique' => 'Cette adresse e-mail est déjà utilisée.',

        'password.required' => 'Le mot de passe est obligatoire.',
        'password.string' => 'Le mot de passe doit être une chaîne de caractères.',

        'role.required' => 'Le rôle est obligatoire.',
        'role.string' => 'Le rôle doit être une chaîne de caractères.',
        'role.in' => 'Le rôle doit être responsable, gestionnaire ou consultant.',
    ];
}
}
