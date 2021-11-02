import { FETCH_CURRENT_USER, FETCH_MATCH_DETAILS, LOADING_CURRENT_USER, LOADING_MATCH_DETAILS } from "./types";
import axios from 'axios';
const sample = {
  "GameMode": "DEATHMATCH", 
  "Map": "Haven", 
  "blue_team_details": [
    {
      "AgentIcon": "https://media.valorant-api.com/agents/320b2a48-4d9b-a075-30f1-1f93a9b638fa/displayicon.png", 
      "AgentName": "Sova", 
      "GameName": "guard", 
      "RankInfo": {
        "CurrentRank": "Unrated", 
        "Leaderboard": 0, 
        "RankIcon": "https://media.valorant-api.com/competitivetiers/564d8e28-c226-3180-6285-e48a390db8b1/0/smallicon.png", 
        "RankRating": 0, 
        "WinLossRatio": 0
      }, 
      "TagLine": "12345", 
      "Team": "Blue"
    }, 
    {
      "AgentIcon": "https://media.valorant-api.com/agents/eb93336a-449b-9c1b-0a54-a891f7921d69/displayicon.png", 
      "AgentName": "Phoenix", 
      "GameName": "aaronstain", 
      "RankInfo": {
        "CurrentRank": "Unrated", 
        "Leaderboard": 0, 
        "RankIcon": "https://media.valorant-api.com/competitivetiers/564d8e28-c226-3180-6285-e48a390db8b1/0/smallicon.png", 
        "RankRating": 0, 
        "WinLossRatio": 0
      }, 
      "TagLine": "3917", 
      "Team": "Blue"
    }, 
    {
      "AgentIcon": "https://media.valorant-api.com/agents/8e253930-4c05-31dd-1b6c-968525494517/displayicon.png", 
      "AgentName": "Omen", 
      "GameName": "salandito", 
      "RankInfo": {
        "CurrentRank": "Unrated", 
        "Leaderboard": 0, 
        "RankIcon": "https://media.valorant-api.com/competitivetiers/564d8e28-c226-3180-6285-e48a390db8b1/0/smallicon.png", 
        "RankRating": 0, 
        "WinLossRatio": 0
      }, 
      "TagLine": "9360", 
      "Team": "Blue"
    }, 
    {
      "AgentIcon": "https://media.valorant-api.com/agents/7f94d92c-4234-0a36-9646-3a87eb8b5c89/displayicon.png", 
      "AgentName": "Yoru", 
      "GameName": "StacksBTW", 
      "RankInfo": {
        "CurrentRank": "Unrated", 
        "Leaderboard": 0, 
        "RankIcon": "https://media.valorant-api.com/competitivetiers/564d8e28-c226-3180-6285-e48a390db8b1/0/smallicon.png", 
        "RankRating": 0, 
        "WinLossRatio": 0
      }, 
      "TagLine": "2054", 
      "Team": "Blue"
    }, 
    {
      "AgentIcon": "https://media.valorant-api.com/agents/601dbbe7-43ce-be57-2a40-4abd24953621/displayicon.png", 
      "AgentName": "KAY/O", 
      "GameName": "0W1LL", 
      "RankInfo": {
        "CurrentRank": "Unrated", 
        "Leaderboard": 0, 
        "RankIcon": "https://media.valorant-api.com/competitivetiers/564d8e28-c226-3180-6285-e48a390db8b1/0/smallicon.png", 
        "RankRating": 0, 
        "WinLossRatio": 0
      }, 
      "TagLine": "sleep", 
      "Team": "Blue"
    }, 
    {
      "AgentIcon": "https://media.valorant-api.com/agents/41fb69c1-4189-7b37-f117-bcaf1e96f1bf/displayicon.png", 
      "AgentName": "Astra", 
      "GameName": "DragonWarrior", 
      "RankInfo": {
        "CurrentRank": "Unrated", 
        "Leaderboard": 0, 
        "RankIcon": "https://media.valorant-api.com/competitivetiers/564d8e28-c226-3180-6285-e48a390db8b1/0/smallicon.png", 
        "RankRating": 0, 
        "WinLossRatio": 0
      }, 
      "TagLine": "7936", 
      "Team": "Blue"
    }, 
    {
      "AgentIcon": "https://media.valorant-api.com/agents/6f2a04ca-43e0-be17-7f36-b3908627744d/displayicon.png", 
      "AgentName": "Skye", 
      "GameName": "colemagragh", 
      "RankInfo": {
        "CurrentRank": "Unrated", 
        "Leaderboard": 0, 
        "RankIcon": "https://media.valorant-api.com/competitivetiers/564d8e28-c226-3180-6285-e48a390db8b1/0/smallicon.png", 
        "RankRating": 0, 
        "WinLossRatio": 0
      }, 
      "TagLine": "4324", 
      "Team": "Blue"
    }, 
    {
      "AgentIcon": "https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/displayicon.png", 
      "AgentName": "Jett", 
      "GameName": "pika", 
      "RankInfo": {
        "CurrentRank": "Unrated", 
        "Leaderboard": 0, 
        "RankIcon": "https://media.valorant-api.com/competitivetiers/564d8e28-c226-3180-6285-e48a390db8b1/0/smallicon.png", 
        "RankRating": 0, 
        "WinLossRatio": 0
      }, 
      "TagLine": "cha", 
      "Team": "Blue"
    }, 
    {
      "AgentIcon": "https://media.valorant-api.com/agents/a3bfb853-43b2-7238-a4f1-ad90e9e46bcc/displayicon.png", 
      "AgentName": "Reyna", 
      "GameName": "Adnanklink", 
      "RankInfo": {
        "CurrentRank": "Unrated", 
        "Leaderboard": 0, 
        "RankIcon": "https://media.valorant-api.com/competitivetiers/564d8e28-c226-3180-6285-e48a390db8b1/0/smallicon.png", 
        "RankRating": 0, 
        "WinLossRatio": 0
      }, 
      "TagLine": "NA1", 
      "Team": "Blue"
    }, 
    {
      "AgentIcon": "https://media.valorant-api.com/agents/1e58de9c-4950-5125-93e9-a0aee9f98746/displayicon.png", 
      "AgentName": "Killjoy", 
      "GameName": "Winter", 
      "RankInfo": {
        "CurrentRank": "Unrated", 
        "Leaderboard": 0, 
        "RankIcon": "https://media.valorant-api.com/competitivetiers/564d8e28-c226-3180-6285-e48a390db8b1/0/smallicon.png", 
        "RankRating": 0, 
        "WinLossRatio": 0
      }, 
      "TagLine": "4892", 
      "Team": "Blue"
    }, 
    {
      "AgentIcon": "https://media.valorant-api.com/agents/569fdd95-4d10-43ab-ca70-79becc718b46/displayicon.png", 
      "AgentName": "Sage", 
      "GameName": "InfernoQ", 
      "RankInfo": {
        "CurrentRank": "Unrated", 
        "Leaderboard": 0, 
        "RankIcon": "https://media.valorant-api.com/competitivetiers/564d8e28-c226-3180-6285-e48a390db8b1/0/smallicon.png", 
        "RankRating": 0, 
        "WinLossRatio": 0
      }, 
      "TagLine": "8636", 
      "Team": "Blue"
    }, 
    {
      "AgentIcon": "https://media.valorant-api.com/agents/707eab51-4836-f488-046a-cda6bf494859/displayicon.png", 
      "AgentName": "Viper", 
      "GameName": "marylee3re", 
      "RankInfo": {
        "CurrentRank": "Unrated", 
        "Leaderboard": 0, 
        "RankIcon": "https://media.valorant-api.com/competitivetiers/564d8e28-c226-3180-6285-e48a390db8b1/0/smallicon.png", 
        "RankRating": 0, 
        "WinLossRatio": 0
      }, 
      "TagLine": "love", 
      "Team": "Blue"
    }, 
    {
      "AgentIcon": "https://media.valorant-api.com/agents/9f0d8ba9-4140-b941-57d3-a7ad57c6b417/displayicon.png", 
      "AgentName": "Brimstone", 
      "GameName": "Omen", 
      "RankInfo": {
        "CurrentRank": "Unrated", 
        "Leaderboard": 0, 
        "RankIcon": "https://media.valorant-api.com/competitivetiers/564d8e28-c226-3180-6285-e48a390db8b1/0/smallicon.png", 
        "RankRating": 0, 
        "WinLossRatio": 0
      }, 
      "TagLine": "Daddy", 
      "Team": "Blue"
    }, 
    {
      "AgentIcon": "https://media.valorant-api.com/agents/117ed9e3-49f3-6512-3ccf-0cada7e3823b/displayicon.png", 
      "AgentName": "Cypher", 
      "GameName": "ValesKyyy", 
      "RankInfo": {
        "CurrentRank": "Unrated", 
        "Leaderboard": 0, 
        "RankIcon": "https://media.valorant-api.com/competitivetiers/564d8e28-c226-3180-6285-e48a390db8b1/0/smallicon.png", 
        "RankRating": 0, 
        "WinLossRatio": 0
      }, 
      "TagLine": "0909", 
      "Team": "Blue"
    }
  ], 
  "listViewIcon": "https://media.valorant-api.com/maps/2bee0dc9-4ffe-519b-1cbd-7fbe763a6047/listviewicon.png", 
  "red_team_details": []
}



export const fetchMatchDetails = () => async dispatch => {
  dispatch({type: LOADING_MATCH_DETAILS, loading: true, inGame: true});
  try {
    const res = await axios.get("/match_details");
    if (res.data.message === "Could not create credentials, are you in an active game?") {
      dispatch({ type: FETCH_MATCH_DETAILS, payload: sample, loading: false, redTeam: sample.red_team_details, blueTeam: sample.blue_team_details, error: false, inGame: true });
    } else {
        dispatch({ type: FETCH_MATCH_DETAILS, payload: res.data, loading: false, redTeam: res.data.red_team_details, blueTeam: res.data.blue_team_details, error: false, inGame: true });
    }
  }
  catch {
    dispatch({ type: FETCH_MATCH_DETAILS, payload: [], loading: false, redTeam: [], blueTeam: [], error: true, inGame: false });
  }
}

export const fetchCurrentUser = () => async dispatch => {
  dispatch({ type: LOADING_CURRENT_USER, loading: true })
  try {
    const res = await axios.get("/current_user");
    dispatch({ type: FETCH_CURRENT_USER, loading: false, currentUserName: res.data.current_user_name, currentUserTag: res.data.current_user_tag })
  } catch {
    dispatch({ type: FETCH_CURRENT_USER , loading: false, currentUserName: "N/A", currentUserTag: "N/A"})
  }
}