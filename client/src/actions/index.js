import { FETCH_CURRENT_USER, FETCH_MATCH_DETAILS, LOADING_CURRENT_USER, LOADING_MATCH_DETAILS } from "./types";
import axios from 'axios';
// const sample = {
//   "GameMode": "SPIKERUSH", 
//   "Map": "Ascent", 
//   "blue_team_details": [
//     {
//       "AgentIcon": "https://media.valorant-api.com/agents/8e253930-4c05-31dd-1b6c-968525494517/displayicon.png", 
//       "AgentName": "Omen", 
//       "GameName": "\u30bb\u30f3\u30aa\u30aa\u30ab\u30df", 
//       "PhantomType": "https://media.valorant-api.com/weaponskinchromas/98850230-4ab7-8a9a-b9c9-4da19b5bd33f/fullrender.png", 
//       "RankInfo": {
//         "CurrentRank": "Unrated", 
//         "Leaderboard": 0, 
//         "RankIcon": "https://media.valorant-api.com/competitivetiers/564d8e28-c226-3180-6285-e48a390db8b1/0/smallicon.png", 
//         "RankRating": 0, 
//         "WinLossRatio": 0
//       }, 
//       "TagLine": "simp", 
//       "Team": "Blue", 
//       "VandalType": "https://media.valorant-api.com/weaponskinchromas/6f337971-40b7-c94d-0f24-36869af654c6/fullrender.png"
//     }, 
//     {
//       "AgentIcon": "https://media.valorant-api.com/agents/320b2a48-4d9b-a075-30f1-1f93a9b638fa/displayicon.png", 
//       "AgentName": "Sova", 
//       "GameName": "heavymetalpillow", 
//       "PhantomType": "https://media.valorant-api.com/weaponskinchromas/b9c9eb56-4cbd-04b7-06a8-329dc6f1e73a/fullrender.png", 
//       "RankInfo": {
//         "CurrentRank": "Unrated", 
//         "Leaderboard": 0, 
//         "RankIcon": "https://media.valorant-api.com/competitivetiers/564d8e28-c226-3180-6285-e48a390db8b1/0/smallicon.png", 
//         "RankRating": 0, 
//         "WinLossRatio": 0
//       }, 
//       "TagLine": "NA1", 
//       "Team": "Blue", 
//       "VandalType": "https://media.valorant-api.com/weaponskinchromas/a26e0d1d-4886-7d62-6b4f-1996e706463d/fullrender.png"
//     }, 
//     {
//       "AgentIcon": "https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/displayicon.png", 
//       "AgentName": "Jett", 
//       "GameName": "Appa", 
//       "PhantomType": "https://media.valorant-api.com/weaponskinchromas/98850230-4ab7-8a9a-b9c9-4da19b5bd33f/fullrender.png", 
//       "RankInfo": {
//         "CurrentRank": "Unrated", 
//         "Leaderboard": 0, 
//         "RankIcon": "https://media.valorant-api.com/competitivetiers/564d8e28-c226-3180-6285-e48a390db8b1/0/smallicon.png", 
//         "RankRating": 0, 
//         "WinLossRatio": 0
//       }, 
//       "TagLine": "AAA", 
//       "Team": "Blue", 
//       "VandalType": "https://media.valorant-api.com/weaponskinchromas/b3e54738-4198-5491-2e1c-fcbaa85b307d/fullrender.png"
//     }, 
//     {
//       "AgentIcon": "https://media.valorant-api.com/agents/a3bfb853-43b2-7238-a4f1-ad90e9e46bcc/displayicon.png", 
//       "AgentName": "Reyna", 
//       "GameName": "Determination", 
//       "PhantomType": "https://media.valorant-api.com/weaponskinchromas/6096a66f-43d2-d4ad-6421-84aee3386921/fullrender.png", 
//       "RankInfo": {
//         "CurrentRank": "Unrated", 
//         "Leaderboard": 0, 
//         "RankIcon": "https://media.valorant-api.com/competitivetiers/564d8e28-c226-3180-6285-e48a390db8b1/0/smallicon.png", 
//         "RankRating": 0, 
//         "WinLossRatio": 0
//       }, 
//       "TagLine": "5733", 
//       "Team": "Blue", 
//       "VandalType": "https://media.valorant-api.com/weaponskinchromas/2bd28382-48c6-8579-83e8-e9b64b783de3/fullrender.png"
//     }, 
//     {
//       "AgentIcon": "https://media.valorant-api.com/agents/1e58de9c-4950-5125-93e9-a0aee9f98746/displayicon.png", 
//       "AgentName": "Killjoy", 
//       "GameName": "Hype", 
//       "PhantomType": "https://media.valorant-api.com/weaponskinchromas/52221ba2-4e4c-ec76-8c81-3483506d5242/fullrender.png", 
//       "RankInfo": {
//         "CurrentRank": "Unrated", 
//         "Leaderboard": 0, 
//         "RankIcon": "https://media.valorant-api.com/competitivetiers/564d8e28-c226-3180-6285-e48a390db8b1/0/smallicon.png", 
//         "RankRating": 0, 
//         "WinLossRatio": 0
//       }, 
//       "TagLine": "4507", 
//       "Team": "Blue", 
//       "VandalType": "https://media.valorant-api.com/weaponskinchromas/19629ae1-4996-ae98-7742-24a240d41f99/fullrender.png"
//     }
//   ], 
//   "listViewIcon": "https://media.valorant-api.com/maps/7eaecc1b-4337-bbf6-6ab9-04b8f06b3319/listviewicon.png", 
//   "red_team_details": [
//     {
//       "AgentIcon": "https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/displayicon.png", 
//       "AgentName": "Jett", 
//       "GameName": "2FACED", 
//       "PhantomType": "https://media.valorant-api.com/weaponskinchromas/98850230-4ab7-8a9a-b9c9-4da19b5bd33f/fullrender.png", 
//       "RankInfo": {
//         "CurrentRank": "Unrated", 
//         "Leaderboard": 0, 
//         "RankIcon": "https://media.valorant-api.com/competitivetiers/564d8e28-c226-3180-6285-e48a390db8b1/0/smallicon.png", 
//         "RankRating": 0, 
//         "WinLossRatio": 0
//       }, 
//       "TagLine": "s4ke", 
//       "Team": "Red", 
//       "VandalType": "https://media.valorant-api.com/weaponskinchromas/b3e54738-4198-5491-2e1c-fcbaa85b307d/fullrender.png"
//     }, 
//     {
//       "AgentIcon": "https://media.valorant-api.com/agents/eb93336a-449b-9c1b-0a54-a891f7921d69/displayicon.png", 
//       "AgentName": "Phoenix", 
//       "GameName": "XeLander4", 
//       "PhantomType": "https://media.valorant-api.com/weaponskinchromas/0bddb2dc-44c0-a476-ca06-629b1f110515/fullrender.png", 
//       "RankInfo": {
//         "CurrentRank": "Unrated", 
//         "Leaderboard": 0, 
//         "RankIcon": "https://media.valorant-api.com/competitivetiers/564d8e28-c226-3180-6285-e48a390db8b1/0/smallicon.png", 
//         "RankRating": 0, 
//         "WinLossRatio": 0
//       }, 
//       "TagLine": "smile", 
//       "Team": "Red", 
//       "VandalType": "https://media.valorant-api.com/weaponskinchromas/a26e0d1d-4886-7d62-6b4f-1996e706463d/fullrender.png"
//     }, 
//     {
//       "AgentIcon": "https://media.valorant-api.com/agents/707eab51-4836-f488-046a-cda6bf494859/displayicon.png", 
//       "AgentName": "Viper", 
//       "GameName": "Kanidae", 
//       "PhantomType": "https://media.valorant-api.com/weaponskinchromas/52221ba2-4e4c-ec76-8c81-3483506d5242/fullrender.png", 
//       "RankInfo": {
//         "CurrentRank": "Unrated", 
//         "Leaderboard": 0, 
//         "RankIcon": "https://media.valorant-api.com/competitivetiers/564d8e28-c226-3180-6285-e48a390db8b1/0/smallicon.png", 
//         "RankRating": 0, 
//         "WinLossRatio": 0
//       }, 
//       "TagLine": "Sami", 
//       "Team": "Red", 
//       "VandalType": "https://media.valorant-api.com/weaponskinchromas/b3e54738-4198-5491-2e1c-fcbaa85b307d/fullrender.png"
//     }, 
//     {
//       "AgentIcon": "https://media.valorant-api.com/agents/a3bfb853-43b2-7238-a4f1-ad90e9e46bcc/displayicon.png", 
//       "AgentName": "Reyna", 
//       "GameName": "charlie", 
//       "PhantomType": "https://media.valorant-api.com/weaponskinchromas/6096a66f-43d2-d4ad-6421-84aee3386921/fullrender.png", 
//       "RankInfo": {
//         "CurrentRank": "Unrated", 
//         "Leaderboard": 0, 
//         "RankIcon": "https://media.valorant-api.com/competitivetiers/564d8e28-c226-3180-6285-e48a390db8b1/0/smallicon.png", 
//         "RankRating": 0, 
//         "WinLossRatio": 0
//       }, 
//       "TagLine": "cabt", 
//       "Team": "Red", 
//       "VandalType": "https://media.valorant-api.com/weaponskinchromas/2bd28382-48c6-8579-83e8-e9b64b783de3/fullrender.png"
//     }, 
//     {
//       "AgentIcon": "https://media.valorant-api.com/agents/8e253930-4c05-31dd-1b6c-968525494517/displayicon.png", 
//       "AgentName": "Omen", 
//       "GameName": "I Flash For Fun", 
//       "PhantomType": "https://media.valorant-api.com/weaponskinchromas/98850230-4ab7-8a9a-b9c9-4da19b5bd33f/fullrender.png", 
//       "RankInfo": {
//         "CurrentRank": "Unrated", 
//         "Leaderboard": 0, 
//         "RankIcon": "https://media.valorant-api.com/competitivetiers/564d8e28-c226-3180-6285-e48a390db8b1/0/smallicon.png", 
//         "RankRating": 0, 
//         "WinLossRatio": 0
//       }, 
//       "TagLine": "FUN", 
//       "Team": "Red", 
//       "VandalType": "https://media.valorant-api.com/weaponskinchromas/6f337971-40b7-c94d-0f24-36869af654c6/fullrender.png"
//     }
//   ]
// }

export const fetchMatchDetails = () => async dispatch => {
  dispatch({type: LOADING_MATCH_DETAILS, loading: true, inGame: true});
  try {
    const res = await axios.get("/match_details");
    if (res.data.message === "Could not create credentials, are you in an active game?" || res.data.message === "Cannot set up lobby if you are not in an active game.") {
      dispatch({ type: FETCH_MATCH_DETAILS, payload: [], loading: false, redTeam: [], blueTeam: [], error: true, inGame: false });
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

export const sockUpdateLobby = (data) => async dispatch => {
  dispatch({ type: LOADING_CURRENT_USER, loading: true })
  if (data.game_state === "INGAME") {
    console.log("INGAME");
    dispatch({ type: FETCH_MATCH_DETAILS, payload: data.match_details, loading: false, redTeam: data.match_details.red_team_details, blueTeam: data.match_details.blue_team_details, error: false, inGame: true });
  }
  else if (data.game_state === "MENUS") {
    console.log(data);
    dispatch({ type: FETCH_MATCH_DETAILS, payload: [], loading: false, redTeam: [], blueTeam: [], error: false, inGame: false });
    console.log('MENUS');
  }
}