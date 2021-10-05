import { FETCH_MATCH_DETAILS, LOADING_MATCH_DETAILS } from '../actions/types';
const initialState = {
  loading: true,
  data: [],
  blueTeam: [],
  redTeam: []
}
export default function(state = initialState, action) {
  switch (action.type) {
    case LOADING_MATCH_DETAILS:
      return {...state, loading: action.loading}
    case FETCH_MATCH_DETAILS:
      return {...state, data: action.payload, blueTeam: action.blueTeam, redTeam: action.redTeam, loading: action.loading};
    default:
      return state;
  }
}