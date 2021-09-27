import React from 'react'
import { Container } from '@mui/material'
import { BrowserRouter, Route } from 'react-router-dom'
import { connect } from 'react-redux';

import Landing from './Landing'

const App = () => {
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

export default connect(null, {})(App);