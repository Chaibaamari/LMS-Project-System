<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;

use Illuminate\Foundation\Http\FormRequest;

class StoreSettingsRequest extends FormRequest
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
            'id' => 'required|max:50',
            'name' => 'required|max:50',
            'email' => 'required|email',
            'password' => 'required',
            'role' => ['required', Rule::in(['responsable', 'gestionnaire', 'consultant'])],
            'active' => ['required', Rule::in(['1', '0'])],
            'created_at' => 'required|max:50',
            'updated_at' => 'required|max:50',
        ];
    }
}
