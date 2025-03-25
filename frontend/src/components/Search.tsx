"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Button } from "./ui/button";

interface DynamicSearchProps<T extends string> {
  fields: { name: string; label: string }[]; // Fields to search on
  onSearch: (searchTerm: string, searchField: T) => void; // Callback to handle search
}

export function DynamicSearch<T extends string>({ fields, onSearch }: DynamicSearchProps<T>) {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchField, setSearchField] = useState(fields[0].name); // Default to the first field

    const handleSearch = () => {
        onSearch(searchTerm, searchField as T);
    };

    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
                <Select value={searchField} onValueChange={setSearchField}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                        {fields.map((field) => (
                            <SelectItem key={field.name} value={field.name}>
                                {field.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleSearch();
                    }
                }}
            />
            <Button onClick={handleSearch} variant="outline" >Search</Button>
        </div>
    );
}