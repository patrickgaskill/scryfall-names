import React, { Fragment, useState, useReducer } from "react";
import {
  Container,
  Segment,
  Header,
  Form,
  Message,
  Progress
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import { Response } from "./types";

type State = {
  loading: boolean;
  warnings: string[];
  error: string | null;
  cards: string[];
  totalCards: number | null;
};

type Action =
  | { type: "submit" }
  | { type: "success"; cards: string[]; totalCards: number; warnings: string[] }
  | { type: "warning"; warnings: string[] }
  | { type: "finished" }
  | { type: "error"; error: string };

const initialState: State = {
  loading: false,
  warnings: [],
  error: null,
  cards: [],
  totalCards: null
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
        totalCards
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

function App() {
  const [query, setQuery] = useState("");
  const [
    { loading, warnings, error, cards, totalCards },
    dispatch
  ] = useReducer(reducer, initialState);

  async function fetchScryfall(url: string) {
    const response = await fetch(url);
    const {
      object,
      details,
      data,
      has_more,
      next_page,
      total_cards,
      warnings
    }: Response = await response.json();

    if (object === "error") {
      dispatch({ type: "error", error: details });
      return;
    }

    dispatch({
      type: "success",
      cards: data.map(card => card.name),
      totalCards: total_cards,
      warnings
    });

    if (warnings) {
      dispatch({ type: "warning", warnings });
    }

    if (has_more) {
      window.setTimeout(() => fetchScryfall(next_page), 50);
    } else {
      dispatch({ type: "finished" });
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    dispatch({ type: "submit" });
    try {
      await fetchScryfall(`https://api.scryfall.com/cards/search?q=${query}`);
    } catch (e) {
      dispatch({ type: "error", error: e.message });
    }
  }

  return (
    <Container text>
      <Segment basic>
        <Header>Fetch a list of card names from Scryfall</Header>
        <Form
          onSubmit={handleSubmit}
          warning={warnings.length > 0}
          error={!!error}
        >
          <Form.Field>
            <Form.Input
              loading={loading}
              icon="search"
              placeholder="Enter a Scryfall query, like t:goblin"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </Form.Field>
        </Form>
        {error && <Message error content={error} />}
        {warnings.length > 0 && <Message warning list={warnings} />}
      </Segment>
      {totalCards && (
        <div>
          <Message attached>
            {totalCards} {totalCards > 1 ? "cards" : "card"} found.
          </Message>
          <Segment attached>
            {loading && (
              <Progress
                indicating
                total={totalCards}
                value={cards.length}
                attached="top"
              />
            )}
            {cards.map(name => (
              <Fragment key={name}>
                <span>{name}</span>
                <br />
              </Fragment>
            ))}
          </Segment>
        </div>
      )}
    </Container>
  );
}

export default App;
