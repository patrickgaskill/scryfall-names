import { Action } from "@/lib/reducer";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function fetchFromScryfall(
  url: string,
  dispatch: (action: Action) => void,
  signal: AbortSignal,
) {
  let response: Scryfall.Response;

  try {
    response = await fetch(url, { signal }).then((response) => response.json());
  } catch (e) {
    const error = e as Error;
    if (error.name !== "AbortError") {
      dispatch({ type: "failed", error: error.message });
    }
    return;
  }

  if (response.warnings) {
    dispatch({ type: "hadWarnings", warnings: response.warnings });
  }

  if (response.object === "error") {
    dispatch({
      type: "failed",
      error: response.details,
    });
  }

  if (response.object === "list") {
    if (response.total_cards) {
      dispatch({
        type: "pageFetched",
        cards: response.data,
        totalCards: response.total_cards,
      });
    }

    if (response.has_more) {
      setTimeout(() => {
        if (response.next_page) {
          fetchFromScryfall(response.next_page, dispatch, signal);
        }
      }, 50);
    } else {
      dispatch({ type: "completed" });
    }
  }
}
