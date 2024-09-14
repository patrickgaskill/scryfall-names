import Head from "next/head";
import { useEffect, useReducer, useState } from "react";

import ClipboardCheckIcon from "../components/ClipboardCheckIcon";
import ClipboardCopyIcon from "../components/ClipboardCopyIcon";
import ErrorAlert from "../components/ErrorAlert";
import ProgressBar from "../components/ProgressBar";
import SearchIcon from "../components/SearchIcon";
import Spinner from "../components/Spinner";
import WarningsAlert from "../components/WarningsAlert";
import { Card, ScryfallResponse } from "../types";

type State = {
  loading: boolean;
  warnings: string[] | null;
  error: string | null;
  cards: Card[];
  totalCards: number | null;
};

type Action =
  | { type: "submit" }
  | { type: "success"; cards: Card[]; totalCards: number }
  | { type: "warning"; warnings: string[] }
  | { type: "finished" }
  | { type: "error"; error: string };

const initialState: State = {
  loading: false,
  warnings: null,
  error: null,
  cards: [],
  totalCards: null,
};

function reducer(state: State, action: Action) {
  switch (action.type) {
    case "submit": {
      return { ...initialState, loading: true };
    }
    case "success": {
      const { cards, totalCards } = action;
      return {
        ...state,
        cards: [...state.cards, ...cards],
        totalCards,
      };
    }
    case "warning": {
      return { ...state, warnings: [...state.warnings, ...action.warnings] };
    }
    case "finished": {
      return { ...state, loading: false };
    }
    case "error": {
      const { error } = action;
      return { ...state, loading: false, error };
    }
    default: {
      throw new Error();
    }
  }
}

export default function Home(): JSX.Element {
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [{ loading, warnings, error, cards, totalCards }, dispatch] =
    useReducer(reducer, initialState);

  async function fetchScryfall(url: string) {
    const response = await fetch(url);
    const {
      object,
      details,
      data,
      has_more,
      next_page,
      total_cards,
      warnings,
    }: ScryfallResponse = await response.json();

    if (object === "error") {
      dispatch({ type: "error", error: details });
      return;
    }

    dispatch({
      type: "success",
      cards: data,
      totalCards: total_cards,
    });

    if (warnings) {
      dispatch({ type: "warning", warnings });
    }

    if (has_more) {
      setTimeout(() => fetchScryfall(next_page), 50);
    } else {
      dispatch({ type: "finished" });
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    dispatch({ type: "submit" });
    try {
      await fetchScryfall(
        `https://api.scryfall.com/cards/search?q=${encodeURIComponent(query)}`
      );
    } catch (e) {
      dispatch({ type: "error", error: e.message });
    }
  }

  async function handleCopyClick() {
    if (!navigator.clipboard) return;
    const names = cards.map((card) => card.name).join("\n");
    await navigator.clipboard.writeText(names);
    setCopied(true);
  }

  useEffect(() => {
    setCopied(false);
  }, [cards]);

  return (
    <div className="grid gap-8 p-4 max-w-sm auto-rows-min md:mx-auto md:p-8 md:max-w-prose">
      <Head>
        <title>Scryfall Names Fetcher</title>
      </Head>

      <header>
        <h1 className="mb-2 text-gray-900 text-xl font-semibold md:text-2xl">
          Fetch card names from Scryfall
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="relative text-gray-400">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
              <button type="submit" className="focus:outline-none">
                <SearchIcon />
              </button>
            </span>
            <input
              type="search"
              spellCheck="false"
              autoComplete="none"
              autoCapitalize="none"
              disabled={loading}
              placeholder="Enter a Scryfall query, like t:goblin"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="p-2 pl-10 w-full text-gray-700 border border-gray-300 rounded focus:outline-none appearance-none"
            />
          </div>
        </form>
      </header>

      {error && <ErrorAlert error={error} />}

      {warnings && <WarningsAlert warnings={warnings} />}

      {loading && !totalCards && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}

      {totalCards && (
        <main className="text-gray-900 border border-gray-300 rounded">
          <div className="flex items-center justify-between px-4 py-2 text-sm bg-gray-100 border-b border-gray-300">
            {totalCards} {totalCards !== 1 ? "cards" : "card"}
            {navigator.clipboard && (
              <div className="cursor-pointer" onClick={handleCopyClick}>
                {copied ? <ClipboardCheckIcon /> : <ClipboardCopyIcon />}
              </div>
            )}
          </div>
          <div className="relative">
            {loading && (
              <div className="absolute -top-1 w-full">
                <ProgressBar value={cards.length} total={totalCards} />
              </div>
            )}
            <ul className="p-4 font-mono text-xs leading-relaxed">
              {cards.map((card) => (
                <li className="list-none" key={card.id}>
                  {card.name}
                </li>
              ))}
            </ul>
          </div>
        </main>
      )}
    </div>
  );
}
