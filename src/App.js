import React, { Component } from "react";
import {
  Container,
  Header,
  Form,
  Input,
  Segment,
  Message,
  Loader,
  Progress
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

class App extends Component {
  state = {
    query: "",
    loading: false,
    results: [],
    warnings: [],
    errors: [],
    totalCards: 0
  };

  fetchFromScryfall = async url => {
    try {
      const response = await fetch(url);
      const json = await response.json();

      this.setState(
        prevState => ({
          loading: json.has_more,
          results: [
            ...prevState.results,
            ...(json.data ? json.data.map(card => card.name) : [])
          ],
          totalCards: json.total_cards,
          hasMore: json.has_more,
          warnings: json.warnings || []
        }),
        () => {
          if (json.has_more) {
            // Using a 50 ms delay as requested in the docs
            // https://scryfall.com/docs/api-overview
            window.setTimeout(() => {
              this.fetchFromScryfall(json.next_page);
            }, 50);
          }
        }
      );
    } catch (e) {
      this.setState({ loading: false, errors: [e.message] });
      console.error(e);
    }
  };

  handleQueryChange = event => {
    this.setState({ query: event.target.value });
  };

  handleSearchSubmit = event => {
    event.preventDefault();
    this.setState(
      {
        loading: true,
        results: []
      },
      () => {
        this.fetchFromScryfall(
          `https://api.scryfall.com/cards/search?q=${this.state.query}`
        );
      }
    );
  };

  renderSearchResults = () => {
    const { results, totalCards, hasMore, loading } = this.state;
    return (
      <div>
        <Message attached>
          {`Found ${totalCards} card${totalCards > 1 ? "s" : ""}.`}
        </Message>
        <Segment attached>
          {loading && (
            <Progress
              indicating
              percent={Math.floor(results.length / totalCards * 100)}
              attached="top"
            />
          )}
          {results.map((r, i) => (
            <span key={i}>
              {r}
              <br />
            </span>
          ))}
          {loading && hasMore && <Loader active inline="centered" />}
        </Segment>
      </div>
    );
  };

  render() {
    const { loading, results, errors, warnings } = this.state;
    return (
      <Container text>
        <Segment basic>
          <Header as="h1">Fetch some card names from Scryfall</Header>
          <Form
            warning={warnings.length > 0}
            error={errors.length > 0}
            onSubmit={this.handleSearchSubmit}
          >
            <Input
              fluid
              value={this.state.query}
              icon="search"
              iconPosition="left"
              placeholder="Enter a Scryfall search..."
              onChange={this.handleQueryChange}
              action={{
                primary: true,
                content: "Search",
                onClick: this.handleSearchSubmit,
                loading
              }}
            />
            <Message error header="There were some errors." list={errors} />
            <Message
              warning
              header="Scryfall had some warnings for you."
              list={warnings}
            />
          </Form>
        </Segment>
        {results.length > 0 && this.renderSearchResults()}
      </Container>
    );
  }
}

export default App;
