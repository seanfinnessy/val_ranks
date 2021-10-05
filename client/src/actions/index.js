import { FETCH_MATCH_DETAILS, LOADING_MATCH_DETAILS } from "./types";
import axios from 'axios';
const sample = {
  "GameMode": "deathmatch", 
  "Map": "Icebox", 
  "listViewIcon": "https://media.valorant-api.com/maps/e2ad5c54-4114-a870-9641-8ea21279579a/listviewicon.png", 
  "player_details": [
    {
      "GameName": "BabyDoll", 
      "RankInfo": {
        "CurrentRank": "Silver 1", 
        "Leaderboard": 0, 
        "RankRating": 84
      }, 
      "TagLine": "9871"
    }, 
    {
      "GameName": "Subway", 
      "RankInfo": {
        "CurrentRank": "Silver 1", 
        "Leaderboard": 0, 
        "RankRating": 95
      }, 
      "TagLine": "1378"
    }, 
    {
      "GameName": "xLightsOutx", 
      "RankInfo": {
        "CurrentRank": "Unrated", 
        "Leaderboard": 0, 
        "RankRating": 0
      }, 
      "TagLine": "NA1"
    }, 
    {
      "GameName": "botshooter11213", 
      "RankInfo": {
        "CurrentRank": "Unrated", 
        "Leaderboard": 0, 
        "RankRating": 0
      }, 
      "TagLine": "2310"
    }, 
    {
      "GameName": "Pistola", 
      "RankInfo": {
        "CurrentRank": "Diamond 1", 
        "Leaderboard": 0, 
        "RankRating": 0
      }, 
      "TagLine": "s4ke"
    }, 
    {
      "GameName": "Elliot", 
      "RankInfo": {
        "CurrentRank": "Platinum 1", 
        "Leaderboard": 0, 
        "RankRating": 87
      }, 
      "TagLine": "7279"
    }, 
    {
      "GameName": "Lightningsaint1", 
      "RankInfo": {
        "CurrentRank": "Gold 2", 
        "Leaderboard": 0, 
        "RankRating": 40
      }, 
      "TagLine": "NA1"
    }, 
    {
      "GameName": "0xSKT", 
      "RankInfo": {
        "CurrentRank": "Immortal 1", 
        "Leaderboard": 11113, 
        "RankRating": 29
      }, 
      "TagLine": "SANG"
    }, 
    {
      "GameName": "Fletch", 
      "RankInfo": {
        "CurrentRank": "Diamond 3", 
        "Leaderboard": 0, 
        "RankRating": 84
      }, 
      "TagLine": "9339"
    }, 
    {
      "GameName": "zuko", 
      "RankInfo": {
        "CurrentRank": "Platinum 2", 
        "Leaderboard": 0, 
        "RankRating": 32
      }, 
      "TagLine": "003"
    }, 
    {
      "GameName": "Fallen", 
      "RankInfo": {
        "CurrentRank": "Diamond 3", 
        "Leaderboard": 0, 
        "RankRating": 0
      }, 
      "TagLine": "1350"
    }, 
    {
      "GameName": "LK0N", 
      "RankInfo": {
        "CurrentRank": "Silver 1", 
        "Leaderboard": 0, 
        "RankRating": 54
      }, 
      "TagLine": "420"
    }, 
    {
      "GameName": "gabeveen", 
      "RankInfo": {
        "CurrentRank": "Gold 3", 
        "Leaderboard": 0, 
        "RankRating": 11
      }, 
      "TagLine": "1KOR"
    }, 
    {
      "GameName": "Mr Hacker", 
      "RankInfo": {
        "CurrentRank": "Diamond 2", 
        "Leaderboard": 0, 
        "RankRating": 66
      }, 
      "TagLine": "NA1"
    }
  ]
}


export const fetchMatchDetails = () => async dispatch => {
  dispatch({type: LOADING_MATCH_DETAILS, loading: true, inGame: true});
  try {
    const res = await axios.get("/match_details");
    dispatch({ type: FETCH_MATCH_DETAILS, payload: res.data, loading: false, redTeam: res.data.red_team_details, blueTeam: res.data.blue_team_details, error: false, inGame: true });
  }
  catch {
    dispatch({ type: FETCH_MATCH_DETAILS, payload: [], loading: false, redTeam: [], blueTeam: [], error: true, inGame: false });
  }
}