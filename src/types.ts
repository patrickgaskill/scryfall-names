// https://scryfall.com/docs/api/errors
export interface Error {
  status: number;
  code: string;
  details: string;
  type: string;
  warnings: string[];
}

// https://scryfall.com/docs/api/lists
export interface List<T> {
  data: T[];
  has_more: boolean;
  next_page: string; // URI
  total_cards: number;
  warnings: string[];
}

// https://scryfall.com/docs/api/cards
export interface Card {
  id: string; // UUID
  name: string;
}

export interface ScryfallResponse extends Error, List<Card> {
  object: "error" | "list";
}
