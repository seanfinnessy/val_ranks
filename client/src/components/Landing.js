import React, {useEffect} from 'react'
import { fetchMatchDetails } from '../actions';
import { connect } from 'react-redux';
import MatchDetails from './MatchDetails';
import { Typography, Grid, Container, Box, Paper } from '@mui/material';

const Landing = ({ matchDetails, fetchMatchDetails }) => {
  useEffect(() => {
    fetchMatchDetails();
    console.log(matchDetails);
  }, [])

  const renderMatchDetails = () => {
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
        <Grid item lg={12}>
          <Typography variant='h1' align='center' color="textPrimary">RANK NABBER</Typography>
          <Typography gutterBottom variant='h6' align='center' color="textPrimary">Nab the ranks of everyone in your lobby and see through streamer mode</Typography>
        </Grid>
        <Grid item lg={12}>
        <Container fixed>
          <Box p={1} sx={{ bgcolor: '#ff4655', height: '100vh', borderRadius: "5px" }}>
            <Paper sx={{ height: '100vh' }}>
              <Box p={3}>
                <Typography variant='h3' align='center'>Match Details</Typography>
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