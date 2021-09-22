import { FETCH_PLAYERS } from "./types";
import axios from 'axios';

export const fetchPlayers = () => async dispatch => {
  const res = await axios.get("/rank");
  dispatch({ type: FETCH_PLAYERS, payload: res.data });
}