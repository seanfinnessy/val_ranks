import React, {useEffect} from 'react'
import { Button, Typography, List, ListItem, ListItemText, Grid, Paper, ListItemIcon, ListItemAvatar, Avatar } from '@mui/material'
import { fetchMatchDetails } from '../actions';
import { connect } from 'react-redux';

const Landing = ({ matchDetails, fetchMatchDetails }) => {
  useEffect(() => {
    fetchMatchDetails();
    console.log(matchDetails);
  }, [])

  return (
    <>
      <Typography variant='h3' align='center'>Match Details</Typography>
      <Typography variant='h6' align='center'>{matchDetails.data.Map}</Typography>
      <Grid container>
        <Grid item xs={12} md={6}>
          <Paper>
            {
              matchDetails.loading 
              ? <div>Loading</div>
              : 
              <List>
                {
                  matchDetails.blueTeam.map((player, index) => {
                    return (
                      <ListItem divider key={index}>
                        <ListItemAvatar>
                          <Avatar alt={player.AgentName} src={player.AgentIcon} />
                        </ListItemAvatar>
                        <ListItemText inset='true' primary={`${player.GameName} #${player.TagLine}`} />
                        <ListItemText inset='true' primary={`${player.RankInfo.CurrentRank} - ${player.RankInfo.RankRating} RR`} />
                      </ListItem>
                    )
                  })
                }
              </List>
            }
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper>
          <List>
                {
                  matchDetails.redTeam.map((player, index) => {
                    return (
                      <ListItem divider key={index}>
                        <ListItemAvatar>
                          <Avatar alt={player.AgentName} src={player.AgentIcon} />
                        </ListItemAvatar>
                        <ListItemText inset='true' primary={`${player.GameName} #${player.TagLine}`} />
                        <ListItemText inset='true' primary={`${player.RankInfo.CurrentRank} - ${player.RankInfo.RankRating} RR`} />
                      </ListItem>
                    )
                  })
                }
              </List>
          </Paper>
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