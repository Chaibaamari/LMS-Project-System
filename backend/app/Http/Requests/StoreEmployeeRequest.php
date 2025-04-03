<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

use Illuminate\Validation\Rule;

class StoreEmployeeRequest extends FormRequest
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
            'Matricule' => 'required | max:50',
            'prenomnom' => 'required|max:50',
            'Date_Naissance' => 'required |date_format:Y-m-d',
            'Date_Recrutement' => 'required ',
            'Sexe' => ['required ', Rule::in(['M', 'F'])],
            'CSP' => ['required ', Rule::in(['Exécution', 'Maîtrise', 'Cadre'])],
            'CodeFonction' =>  ' required | integer  ',
            'Id_direction' => 'required | max:50',
            'Echelle' => 'required | max:50',
        ];
    }
}
