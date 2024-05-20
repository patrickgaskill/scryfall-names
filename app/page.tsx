"use client";
import { SearchForm } from "@/components/search-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { initialState, reducer } from "@/lib/reducer";
import { fetchFromScryfall } from "@/lib/utils";
import { ClipboardCopy, OctagonX, TriangleAlert } from "lucide-react";
import { useReducer } from "react";

export default function Home() {
  const [{ cards, totalCards, warnings, error, loading }, dispatch] =
    useReducer(reducer, initialState);

  function handleSubmit(query: string) {
    dispatch({ type: "submitted" });
    fetchFromScryfall(
      `https://api.scryfall.com/cards/search?q=${encodeURIComponent(query)}`,
      dispatch,
    );
  }

  async function handleCopyClick() {
    if (!navigator.clipboard) return;
    const names = cards.map((card) => card.name).join("\n");
    await navigator.clipboard.writeText(names);
  }
  // `max` prop in Progress is not working:
  // https://github.com/shadcn-ui/ui/pull/3471
  const progressValue = totalCards
    ? Math.round((cards.length / totalCards) * 100)
    : null;

  return (
    <main className="mx-auto flex max-w-xl flex-col space-y-8 p-4">
      <header>
        <h1 className="mb-2 text-xl font-semibold">
          Fetch card names from Scryfall
        </h1>
        <SearchForm onSubmit={handleSubmit} />
      </header>

      {warnings.length > 0 && (
        <Alert>
          <TriangleAlert className="size-4" />
          <AlertTitle>Warnings</AlertTitle>
          <AlertDescription>
            <ul>
              {warnings.map((warning) => (
                <li>{warning}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <OctagonX className="size-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && (
        <div className="flex justify-center pt-8">
          <Progress value={progressValue} className="w-1/2" />
        </div>
      )}

      {!loading && totalCards && (
        <section className="flex-grow rounded border">
          <div className="flex items-center justify-between border-b px-4 py-2 text-sm">
            <span>
              {totalCards} {totalCards === 1 ? "card" : "cards"} found.
            </span>
            <button
              className="flex items-center p-2 hover:bg-accent"
              onClick={handleCopyClick}
            >
              <ClipboardCopy className="size-6 md:size-4" />
              <span className="ml-2 hidden md:inline">Copy to clipboard</span>
            </button>
          </div>
          <ul className="p-4 font-mono text-sm leading-relaxed">
            {cards.map((card) => (
              <li key={card.id}>{card.name}</li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
