import { FETCH_MATCH_DETAILS, LOADING_MATCH_DETAILS } from '../actions/types';
const initialState = {
  loading: false,
  data: [],
  blueTeam: [],
  redTeam: [],
  error: false,
  inGame: false
}
export default function(state = initialState, action) {
  switch (action.type) {
    case LOADING_MATCH_DETAILS:
      return {...state, loading: action.loading, inGame: action.inGame}
    case FETCH_MATCH_DETAILS:
      console.log(state);
      return {...state, data: action.payload, blueTeam: action.blueTeam, redTeam: action.redTeam, loading: action.loading, error: action.error, inGame: action.inGame};
    default:
      return state;
  }
}