export type State = {
  loading: boolean;
  cards: Scryfall.Card[];
  totalCards?: number;
  warnings: string[];
  error?: string;
};

export type Action =
  | { type: "submitted" }
  | { type: "pageFetched"; cards: Scryfall.Card[]; totalCards: number }
  | { type: "hadWarnings"; warnings: string[] }
  | { type: "failed"; error: string }
  | { type: "completed" };

export const initialState: State = {
  loading: false,
  cards: [],
  totalCards: undefined,
  warnings: [],
  error: undefined,
};

export function reducer(state: State, action: Action) {
  switch (action.type) {
    case "submitted": {
      return { ...initialState, loading: true };
    }

    case "pageFetched": {
      return {
        ...state,
        cards: [...state.cards, ...action.cards],
        totalCards: action.totalCards,
      };
    }

    case "hadWarnings": {
      return {
        ...state,
        warnings: action.warnings,
      };
    }

    case "failed": {
      return {
        ...state,
        error: action.error,
        loading: false,
      };
    }

    case "completed": {
      return { ...state, loading: false };
    }

    default: {
      return state;
    }
  }
}
