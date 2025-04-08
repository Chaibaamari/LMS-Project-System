<?php

namespace App\Http\Requests\Plan;

use Illuminate\Foundation\Http\FormRequest;

class StorePlanRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
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
            'Matricule' => 'required|exists:employes,Matricule',
            'ID_Formation' => 'required|exists:formations,ID_Formation',
        ];
    }

    public function messages(): array
    {
        return [
            'Matricule.required' => 'Le matricule est obligatoire',
            'Matricule.exists' => 'Le matricule spécifié est introuvable dans la base de données',
            'ID_Formation.required' => 'La formation est obligatoire',
            'ID_Formation.exists' => 'La formation spécifiée est introuvable dans la base de données',
        ];
    }
}
