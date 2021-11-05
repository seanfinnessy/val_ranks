import React, {useEffect, useState} from 'react'
import { sockUpdateLobby } from '../actions';
import { connect } from 'react-redux';
import MatchDetails from './MatchDetails';
import OneTeamMatchDetails from './OneTeamMatchDetails';
import { Typography, Grid, Container, Box, Paper } from '@mui/material';

const Landing = ({ matchDetails, sockUpdateLobby }) => {
  useEffect(() => {
    // init websocket
    const socket = new WebSocket('ws://localhost:5000/lobby');

    // listen for changes
    socket.addEventListener('message', (e) => {
      let data = JSON.parse(e.data);
      console.log(data);
      setGameState(data.game_state);
      sockUpdateLobby(data);
      setPlayer(prevState => ({
        ...prevState,
        name: data.game_name,
        tag: data.game_tag
      }))
    })

    // Close socket on unmount
    return () => socket.close();
  }, [])

  const [gameState, setGameState] = useState("MENUS")
  const [player, setPlayer] = useState({
    name: "N/A",
    tag: "N/A"
  })

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
      <Grid>
        <Grid item lg={12} align="center">
          <Typography variant='h1' align='center' color="textPrimary">VALORANT SPY</Typography>
          <Typography variant='h6' align='center' color="textPrimary">{gameState}</Typography>
          <Typography gutterBottom variant='h6' align='center' color="textPrimary">Nab the ranks of everyone in your lobby and see through streamer mode</Typography>
        </Grid>
        <Grid item lg={12}>
          <Typography sx={{paddingLeft: '24px'}} variant='body2' align='left' color="textPrimary">
            Logged in as: <b>
            {
            player.name + ' #' + player.tag
            }
            </b>
          </Typography>
          <Container scrollable="true" maxWidth="xl">
            <Box p={1} sx={{ bgcolor: '#ff4655', height: '100vh', borderRadius: "5px" }}>
              <Paper sx={{ height: '100vh', overflow: 'auto' }}>
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
    matchDetails: state.matchDetails,
    currentUser: state.currentUser
  }
}

export default connect(mapStateToProps, {sockUpdateLobby})(Landing);