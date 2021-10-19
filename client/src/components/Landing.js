import React, {useEffect} from 'react'
import { fetchMatchDetails } from '../actions';
import { connect } from 'react-redux';
import MatchDetails from './MatchDetails';
import OneTeamMatchDetails from './OneTeamMatchDetails';
import { Typography, Grid, Container, Box, Paper, Button } from '@mui/material';

const Landing = ({ matchDetails, fetchMatchDetails }) => {
  useEffect(() => {
    fetchMatchDetails();
    console.log(matchDetails);
  }, [])

  const renderMatchDetails = () => {
    if (typeof matchDetails.data.blue_team_details === 'undefined' || typeof matchDetails.data.red_team_details === 'undefined') {
      return <MatchDetails />
    }
    if (matchDetails.data.blue_team_details.length === 0 || matchDetails.data.red_team_details.length === 0) {
      return <OneTeamMatchDetails />
    }
    return <MatchDetails />;
  }

  const renderDefaultScreen = () => {
    return (
      <Typography variant="body1" align="center" color="textPrimary">
        Currently not in a match.
      </Typography>
    )
  }
  return (
    <>
      <Grid container>
        <Grid item lg={12} align="center">
          <Typography variant='h1' align='center' color="textPrimary">RANK NABBER</Typography>
          <Typography gutterBottom variant='h6' align='center' color="textPrimary">Nab the ranks of everyone in your lobby and see through streamer mode</Typography>
          <Button sx={{ marginBottom: "0.35em" }} variant="contained" onClick={fetchMatchDetails}>Refresh</Button>
        </Grid>
        <Grid item lg={12}>
        <Container fixed>
          <Box p={1} sx={{ bgcolor: '#ff4655', height: '100vh', borderRadius: "5px" }}>
            <Paper sx={{ height: '100vh' }}>
              <Box p={3}>
                <Typography variant='h3' align='center'>{matchDetails.data.GameMode}</Typography>
                {matchDetails.inGame ? renderMatchDetails() : renderDefaultScreen()}
              </Box>
            </Paper>
          </Box>
        </Container>
        </Grid>
      </Grid>
    </>
  )
}

const mapStateToProps = (state) => {
  return {
    matchDetails: state.matchDetails
  }
}

export default connect(mapStateToProps, {fetchMatchDetails})(Landing);