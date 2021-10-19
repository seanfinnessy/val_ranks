import React from 'react'
import { Typography, List, ListItem, ListItemText, Grid, Paper, ListItemIcon, ListItemAvatar, Avatar, CircularProgress } from '@mui/material'
import { connect } from 'react-redux';

const OneTeamMatchDetails = ({ matchDetails }) => {

  return (
    <>
      <Grid 
      container
      justify="center"
      >
        <Grid item xs={12} align="center" 
        sx={{
          backgroundImage: `url(${matchDetails.data.listViewIcon})`, 
          height: '5rem', 
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
          }}>
          <Typography variant='h2' align='center' sx={{color: 'white', textShadow: '2px 2px black' }}>
            {matchDetails.data.Map}
          </Typography>
          {matchDetails.loading ? <CircularProgress style={{justifyContent: 'center'}} /> : null}
        </Grid>
        <Grid item md={12} align="center">
          {
            matchDetails.loading 
            ? null
            : 
            <Paper>
            <List>
                  {
                    matchDetails.blueTeam.length === 0 ?
                    matchDetails.redTeam.map((player, index) => {
                      return (
                        <ListItem color="primary" divider key={index}>
                          <ListItemAvatar>
                            <Avatar alt={player.AgentName} src={player.AgentIcon} />
                          </ListItemAvatar>
                          <ListItemText inset='true' primary={`${player.GameName} #${player.TagLine}`} />
                          <ListItemText inset='true' primary={`${player.RankInfo.CurrentRank} - ${player.RankInfo.RankRating} RR`} />
                        </ListItem>
                      )
                    }) : matchDetails.blueTeam.map((player, index) => {
                      return (
                        <ListItem color="primary" divider key={index}>
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

export default connect(mapStateToProps, {})(OneTeamMatchDetails);