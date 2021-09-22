import React, { useEffect } from 'react'
import { Container } from '@mui/material'
import { BrowserRouter, Route } from 'react-router-dom'
import { connect } from 'react-redux';
import * as actions from '../actions/';

import Landing from './Landing'

const App = ({ fetchPlayers }) => {
  useEffect(() => {
    fetchPlayers();
  })

  return (
    <Container maxWidth="lg">
        <BrowserRouter>
          <div>
            <Route exact path="/" component={Landing} />
          </div>
        </BrowserRouter>
      </Container>
  )
}

export default connect(null, actions)(App);