"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
// import { Button } from "./ui/button";
import { Search } from "lucide-react";

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
            <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder="Search Employee..."
                value={searchTerm}
                className="pl-8 w-full border-none outline-none shadow-none"
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleSearch();
                    }
                }}
            />
            </div>
            {/* <Button onClick={handleSearch} variant="outline" >Search</Button> */}
        </div>
    );
}
{/* <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search memes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-full"
          />
        </div> */}