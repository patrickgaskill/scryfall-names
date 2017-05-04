import React, { Component } from "react";
import {
  Grid,
  Container,
  Header,
  Form,
  Input,
  Segment,
  Message,
  Loader
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

class App extends Component {
  state = {
    query: "",
    loading: false,
    results: []
  };

  fetchFromScryfall = url => {
    fetch(url)
      .then(response => response.json())
      .then(json => {
        this.setState(
          prevState => ({
            loading: json.has_more,
            results: prevState.results.concat(json.data.map(c => c.name)),
            totalCards: json.total_cards,
            hasMore: json.has_more,
            warnings: json.warnings
          }),
          () => {
            if (json.has_more) {
              window.setTimeout(() => {
                this.fetchFromScryfall(json.next_page);
              }, 50);
            }
          }
        );
      })
      .catch(error => {
        this.setState({ loading: false });
        console.error(error);
      });
  };

  handleChange = event => {
    this.setState({ query: event.target.value });
  };

  handleSearchSubmit = event => {
    event.preventDefault();
    const { query } = this.state;
    this.setState(
      {
        loading: true,
        results: []
      },
      () => {
        this
          .fetchFromScryfall(`https://api.scryfall.com/cards/search?q=${query}`);
      }
    );
  };

  renderSearchResults = () => {
    const { results, totalCards, hasMore, loading } = this.state;
    return (
      <Grid.Row>
        <Grid.Column>
          <Container>
            <Message attached>{totalCards} card{totalCards > 1 && "s"}</Message>
            <Segment attached>
              {results.map((r, i) => <span key={i}>{r}<br /></span>)}
              {loading && hasMore && <Loader active inline="centered" />}
            </Segment>
          </Container>
        </Grid.Column>
      </Grid.Row>
    );
  };

  render() {
    const { loading, results, warnings } = this.state;
    return (
      <Grid padded>
        <Grid.Row>
          <Grid.Column>
            <Container>
              <Header as="h1">Fetch some card names from Scryfall</Header>
              <Form
                warning={warnings && warnings.length}
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
