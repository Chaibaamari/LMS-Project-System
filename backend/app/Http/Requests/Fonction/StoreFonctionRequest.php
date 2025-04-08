<?php

namespace App\Http\Requests\Fonction;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;


class StoreFonctionRequest extends FormRequest
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
            'CodeFonction' => ['required','string',Rule::unique('fonctions', 'CodeFonction')],
            'TypeFonction' => [ 'required', 'string', Rule::in(['FST', 'FSP', 'FCM']) ],
            'IntituleFonction' => 'required|string'
        ];
    }

    public function messages(): array
    {
        return [
            'CodeFonction.required' => 'Le code fonction est obligatoire',
            'CodeFonction.unique' => 'Ce code fonction existe déjà',
            'TypeFonction.required' => 'Le type de fonction est obligatoire',
            'TypeFonction.in' => 'Le type doit être FST, FSP ou FCM',
            'IntituleFonction.required' => 'L\'intitulé de fonction est obligatoire'
        ];
    }
}
