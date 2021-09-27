import React, {useEffect} from 'react'
import { Button, Typography, List, ListItem, ListItemText, Grid, Paper } from '@mui/material'
import { fetchMatchDetails } from '../actions';
import { connect } from 'react-redux';

const Landing = ({ matchDetails, fetchMatchDetails }) => {
  useEffect(() => {
    fetchMatchDetails();
  }, [])

  return (
    <>
      <Grid container>
        <Grid item xs={12} md={4}>
          <Paper>
            1
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper>
            2
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper>
            3
          </Paper>
        </Grid>
      </Grid>
      <Typography variant='h3' align='center'>Match Details</Typography>
      <Typography variant='h5' align='center'>{matchDetails.data.Map}</Typography>
      {
        matchDetails.loading 
        ? <div>Loading</div>
        : <List>
          {
            matchDetails.data.player_details.map((player, index) => {
              return (
                <ListItem divider key={index}>
                  <ListItemText inset='true' primary={`${player.GameName} #${player.TagLine}`} />
                  <ListItemText inset='true' primary={`${player.RankInfo.CurrentRank} - ${player.RankInfo.RankRating} RR`} />
                </ListItem>
              )
            })
          }
        </List>
      }
      <Button style={{alignContent: 'center'}} variant="contained" onClick={() => console.log(matchDetails)}>Hello World</Button>
    </>
  )
}

const mapStateToProps = (state) => {
  return {
    matchDetails: state.matchDetails
  }
}

export default connect(mapStateToProps, {fetchMatchDetails})(Landing);