"use client";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

export interface SearchFormProps {
  onSubmit(query: string): void;
}

export function SearchForm({ onSubmit }: SearchFormProps) {
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit(query);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="relative">
        <Search className="pointer-events-none absolute inset-y-0 left-2 h-full w-4" />
        <Input
          className="pl-8"
          id="query"
          type="search"
          autoFocus
          autoComplete="none"
          autoCapitalize="none"
          spellCheck="false"
          placeholder="Enter a Scryfall query, like t:goblin"
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
    </form>
  );
}
