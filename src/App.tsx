import React, { Fragment, useState, useReducer, useEffect } from "react";
import {
  Container,
  Grid,
  Segment,
  Header,
  Form,
  Message,
  Popup,
  Icon,
  Progress,
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import { Card, ScryfallResponse } from "./types";

type State = {
  loading: boolean;
  warnings: string[];
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
  warnings: [],
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

function App() {
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [
    { loading, warnings, error, cards, totalCards },
    dispatch,
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
      await fetchScryfall(`https://api.scryfall.com/cards/search?q=${query}`);
    } catch (e) {
      dispatch({ type: "error", error: e.message });
    }
  }

  async function handleCopyClick() {
    await navigator.clipboard.writeText(cards.join("\n"));
    setCopied(true);
  }

  useEffect(() => {
    setCopied(false);
  }, [cards]);

  return (
    <Container text>
      <Grid padded>
        <Grid.Row>
          <Grid.Column>
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
                  onChange={(event) => setQuery(event.target.value)}
                />
              </Form.Field>
            </Form>
            {error && <Message error content={error} />}
            {warnings.length > 0 && <Message warning list={warnings} />}
          </Grid.Column>
        </Grid.Row>
        {totalCards && (
          <Grid.Row>
            <Grid.Column>
              <Message attached>
                <Grid columns="equal">
                  <Grid.Row style={{ padding: 0 }}>
                    <Grid.Column>
                      {totalCards} {totalCards > 1 ? "cards" : "card"} found.
                    </Grid.Column>
                    <Grid.Column textAlign="right">
                      <Popup
                        content={copied ? "Copied!" : "Copy to clipboard"}
                        position="top center"
                        size="mini"
                        inverted
                        trigger={
                          <Icon
                            link
                            name={copied ? "clipboard check" : "clipboard list"}
                            onClick={() => handleCopyClick()}
                          />
                        }
                      />
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
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
                {cards.map((card) => (
                  <Fragment key={card.id}>
                    <span>{card.name}</span>
                    <br />
                  </Fragment>
                ))}
              </Segment>
            </Grid.Column>
          </Grid.Row>
        )}
      </Grid>
    </Container>
  );
}

export default App;
