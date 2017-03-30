import React, { Component } from 'react';
import { Grid, Container, Header, Form, Input, Segment, Message } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

class App extends Component {
  state = {
    loading: false,
    results: null,
    totalCards: null,
    hasMore: null,
    nextPage: null,
    warnings: null,
  };

  fetchScryfallResults = (query) => {
    fetch(`https://api.scryfall.com/cards/search?q=${query}`)
      .then(response => response.json())
      .then(json => {
        this.setState({
          loading: false,
          results: json.data.map(c => c.name),
          totalCards: json.total_cards,
          hasMore: json.has_more,
          nextPage: json.next_page,
          warnings: json.warnings,
        });
      })
      .catch(error => {
        this.setState({ loading: false });
        console.error(error)
      });
  }

  handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = this.searchInput.inputRef.value;
    this.setState({ loading: true}, () => {
      this.fetchScryfallResults(query);
    });
  }

  renderSearchResults = () => {
    const { results, totalCards } = this.state;
    return (
      <Grid.Row>
        <Grid.Column>
          <Container>
            <Message attached='top'>{totalCards} card{totalCards > 1 && 's'}</Message>
            <Segment attached>
              {results.map((r, i) => <span key={i}>{r}<br /></span>)}
            </Segment>
          </Container>
        </Grid.Column>
      </Grid.Row>
      );
   }

  render() {
    const { loading, results } = this.state;
    return (
      <Grid padded>
        <Grid.Row>
          <Grid.Column>
            <Container>
              <Header as='h1'>Export a list</Header>
              <Form onSubmit={this.handleSearchSubmit}>
                <Input fluid
                  ref={node => {this.searchInput = node}}
                  icon='search' 
                  iconPosition='left' 
                  placeholder='Enter a Scryfall search...'
                  action={{
                    primary: true,
                    content: 'Search',
                    onClick: this.handleSearchSubmit,
                    loading,
                  }}
                />
              </Form>
            </Container>
          </Grid.Column>
        </Grid.Row>
        {results && this.renderSearchResults()}
      </Grid>
    );
  }
}

export default App;
