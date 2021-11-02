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
                        <ListItemText 
                          inset='true' 
                          primary={
                          <div>
                            <img src={player.VandalType} style={{width: '200px', height: '50px'}} />
                            <br/>
                            <img src={player.PhantomType} style={{width: '200px', height: '50px'}} />
                            </div> 
                          } />
                        <ListItemAvatar>
                            <Avatar alt={player.RankInfo.CurrentRank} src={player.RankInfo.RankIcon} />
                            <Typography variant='body2'>{`${player.RankInfo.RankRating} RR`}</Typography>
                            <Typography variant='body2'>{`${player.RankInfo.WinLossRatio}% Win Rate`}</Typography>
                        </ListItemAvatar>
                      </ListItem>
                    )
                  })
                }
              </List>
            </Paper> : null
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
                          <ListItemText 
                          inset='true' 
                          primary={
                          <div>
                            <img src={player.VandalType} style={{width: '200px', height: '50px'}} />
                            <br/>
                            <img src={player.PhantomType} style={{width: '200px', height: '50px'}} />
                            </div> 
                          } />
                          <ListItemAvatar>
                            <Avatar alt={player.RankInfo.CurrentRank} src={player.RankInfo.RankIcon} />
                            <Typography variant='body2'>{`${player.RankInfo.RankRating} RR`}</Typography>
                            <Typography variant='body2'>{`${player.RankInfo.WinLossRatio}% Win Rate`}</Typography>
                        </ListItemAvatar>
                        </ListItem>
                      )
                    })
                  }
                </List>
            </Paper> : null
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