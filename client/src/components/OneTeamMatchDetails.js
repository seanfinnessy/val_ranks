import React from 'react'
import { Typography, List, ListItem, ListItemText, Grid, Paper, ListItemIcon, ListItemAvatar, Avatar, CircularProgress } from '@mui/material'
import { connect } from 'react-redux';
import { flexbox } from '@mui/system';

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
            <List sx={{display: flexbox, textAlign: 'center', justifyContent: 'center'}}>
                  {
                    matchDetails.blueTeam.length === 0 ?
                    matchDetails.redTeam.map((player, index) => {
                      return (
                        <ListItem alignItems="flex-start" color="primary" divider key={index}>
                          <ListItemAvatar>
                            <Avatar alt={player.AgentName} src={player.AgentIcon} />
                          </ListItemAvatar>
                          <ListItemText primary={`${player.GameName} #${player.TagLine}`} />
                          <ListItemText primary={"W L L"} />
                          <ListItemAvatar>
                            <Avatar alt={player.RankInfo.CurrentRank} src={player.RankInfo.RankIcon} />
                            <ListItemText primary={`${player.RankInfo.RankRating} RR`} />
                          </ListItemAvatar>
                        </ListItem>
                      )
                    }) : matchDetails.blueTeam.map((player, index) => {
                      return (
                        <ListItem alignItems="flex-start" color="primary" divider key={index}>
                          <ListItemAvatar>
                            <Avatar alt={player.AgentName} src={player.AgentIcon} />
                          </ListItemAvatar>
                          <ListItemText  primary={`${player.GameName} #${player.TagLine}`} />
                          <ListItemText primary={"W L L"} />
                          <ListItemAvatar>
                            <Avatar alt={player.RankInfo.CurrentRank} src={player.RankInfo.RankIcon} />
                            <ListItemText primary={`${player.RankInfo.RankRating} RR`} />
                          </ListItemAvatar>
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