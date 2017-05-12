import React, { Component } from "react";
import {
  Grid,
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
    totalCards: 0
  };

  fetchFromScryfall = async url => {
    try {
      const response = await fetch(url);
      const json = await response.json();

      this.setState(
        prevState => ({
          loading: json.has_more,
          results: [...prevState.results, ...json.data.map(card => card.name)],
          totalCards: json.total_cards,
          hasMore: json.has_more,
          warnings: json.warnings
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

  handleChange = event => {
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
      <Grid.Row>
        <Grid.Column>
          <Container text>
            <Message attached>{totalCards} card{totalCards > 1 && "s"}</Message>
            <Segment attached>
              {loading && <Progress indicating percent={Math.floor(results.length / totalCards * 100)} attached="top" />}
              {results.map((r, i) => <span key={i}>{r}<br /></span>)}
              {loading && hasMore && <Loader active inline="centered" />}
            </Segment>
          </Container>
        </Grid.Column>
      </Grid.Row>
    );
  };

  render() {
    const { loading, results, errors, warnings } = this.state;
    return (
      <Grid padded>
        <Grid.Row>
          <Grid.Column>
            <Container text>
              <Header as="h1">Fetch some card names from Scryfall</Header>
              <Form
                warning={warnings && warnings.length > 0}
                error={errors && errors.length > 0}
                onSubmit={this.handleSearchSubmit}
              >
                <Input
                  fluid
                  value={this.state.query}
                  icon="search"
                  iconPosition="left"
                  placeholder="Enter a Scryfall search..."
                  onChange={this.handleChange}
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
            </Container>
          </Grid.Column>
        </Grid.Row>
        {results.length > 0 && this.renderSearchResults()}
      </Grid>
    );
  }
}

export default App;
