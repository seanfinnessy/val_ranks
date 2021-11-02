import React from 'react'
import { Typography, List, ListItem, ListItemText, Grid, Paper, ListItemIcon, ListItemAvatar, Avatar, CircularProgress } from '@mui/material'
import { connect } from 'react-redux';

const MatchDetails = ({ matchDetails }) => {

  return (
    <>
      <Grid 
      container
      justify="center"
      >
        <Grid item md={12} align="center">
          <Typography variant='h6' align='center'>{matchDetails.data.Map}</Typography>
          {matchDetails.loading ? <CircularProgress style={{justifyContent: 'center'}} /> : null}
        </Grid>
        <Grid item xs={12} md={6} align="center">
          {
            matchDetails.loading 
            ? null
            : typeof matchDetails.redTeam !== 'undefined' ?
            <Paper>
              <List>
                {
                  matchDetails.redTeam.map((player, index) => {
                    return (
                      <ListItem color="secondary" divider key={index}>
                        <ListItemAvatar>
                          <Avatar alt={player.AgentName} src={player.AgentIcon} />
                        </ListItemAvatar>
                        <ListItemText inset='true' primary={`${player.GameName} #${player.TagLine}`} />
                        <ListItemAvatar>
                            <Avatar alt={player.RankInfo.CurrentRank} src={player.RankInfo.RankIcon} />
                          </ListItemAvatar>
                        <ListItemText inset='true' primary={`${player.RankInfo.RankRating} RR`} />
                      </ListItem>
                    )
                  })
                }
              </List>
            </Paper> : <Typography variant='h6' align='center'>Not in a game.</Typography>
          }
        </Grid>
        <Grid item xs={12} md={6} align="center">
          {
            matchDetails.loading 
            ? null
            : typeof matchDetails.redTeam !== 'undefined' ?
            <Paper>
            <List>
                  {
                    matchDetails.blueTeam.map((player, index) => {
                      return (
                        <ListItem color="primary" divider key={index}>
                          <ListItemAvatar>
                            <Avatar alt={player.AgentName} src={player.AgentIcon} />
                          </ListItemAvatar>
                          <ListItemText inset='true' primary={`${player.GameName} #${player.TagLine}`} />
                          <ListItemAvatar>
                            <Avatar alt={player.RankInfo.CurrentRank} src={player.RankInfo.RankIcon} />
                          </ListItemAvatar>
                          <ListItemText inset='true' primary={`${player.RankInfo.RankRating} RR`} />
                        </ListItem>
                      )
                    })
                  }
                </List>
            </Paper> : <Typography variant='h6' align='center'>Not in a game.</Typography>
          }
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

export default connect(mapStateToProps, {})(MatchDetails);