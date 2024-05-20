namespace Scryfall {
  // https://scryfall.com/docs/api/errors
  export type Error = {
    object: "error";
    status: number;
    code: string;
    details: string;
    type?: string;
    warnings?: string[];
  };

  // https://scryfall.com/docs/api/lists
  export type List<T> = {
    object: "list";
    data: T[];
    has_more: boolean;
    next_page?: string;
    total_cards?: number;
    warnings?: string[];
  };

  // https://scryfall.com/docs/api/cards
  export type Card = {
    object: "card";
    id: string;
    name: string;
  };

  export type Response = Error | List<Card>;
}
