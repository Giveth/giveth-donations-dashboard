import React, { Component } from 'react';
import ApolloClient, { gql, InMemoryCache } from 'apollo-boost';
import { ApolloProvider, Query } from 'react-apollo';
import {
  LinearProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button
} from '@material-ui/core';
import styled from 'styled-components';
import Header from './components/Header';
import Error from './components/Error';
// import Filter from './components/Filter';
import GivethDonators from './components/Visualisation/GivethDonators';

const Body = styled.div`
  background: rgba(60, 49, 62, 0.1);
`;
const VisualisationContainer = styled.div`
  margin: 0px;
  padding: 0px;
`;

if (!process.env.REACT_APP_GRAPHQL_ENDPOINT) {
  throw new Error(
    'REACT_APP_GRAPHQL_ENDPOINT environment variable not defined'
  );
}

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  cache: new InMemoryCache()
});

const DONATION_QUERY = gql`
  query givethdonations {
    donates(first: 1000) {
      id
      giverId
      receiverId
      token
      amount
    }
  }
`;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      withImage: false,
      withName: false,
      orderBy: 'displayName',
      showHelpDialog: false
    };
  }

  toggleHelpDialog = () => {
    this.setState(state => ({
      ...state,
      showHelpDialog: !state.showHelpDialog
    }));
  };

  gotoQuickStartGuide = () => {
    window.location.href = 'https://beta.giveth.io';
  };

  render() {
    const { showHelpDialog } = this.state;

    return (
      <ApolloProvider client={client}>
        <Body className="App">
          <VisualisationContainer>
            <Header onHelp={this.toggleHelpDialog} />
            <Query
              query={DONATION_QUERY}
              // variables={{
              //   where: {
              //     ...(withImage ? { imageUrl_starts_with: 'http' } : {}),
              //     ...(withName ? { displayName_not: '' } : {}),
              //   },
              //   orderBy: orderBy,
              // }}
            >
              {({ data, error, loading }) => {
                return loading ? (
                  <LinearProgress variant="query" style={{ width: '100vw' }} />
                ) : error ? (
                  <Error error={error} />
                ) : (
                  <GivethDonators donationData={data.donates} />
                );
              }}
            </Query>
          </VisualisationContainer>
          <Dialog
            fullScreen={false}
            open={showHelpDialog}
            onClose={this.toggleHelpDialog}
            aria-labelledby="help-dialog"
          >
            <DialogTitle id="help-dialog">{'About this App'}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                This App shows donations made through https://beta.giveth.io
                using The Graph to get the data from the Ethereum blockchain. Do
                you want to visit Giveth and see the future of giving yourself?
                =)
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.toggleHelpDialog} color="primary">
                Nah, I'm good
              </Button>
              <Button
                onClick={this.gotoQuickStartGuide}
                color="primary"
                autoFocus
              >
                Yes, please
              </Button>
            </DialogActions>
          </Dialog>
        </Body>
      </ApolloProvider>
    );
  }
}

export default App;
