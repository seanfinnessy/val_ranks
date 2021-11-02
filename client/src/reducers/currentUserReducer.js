import { FETCH_CURRENT_USER, LOADING_CURRENT_USER } from '../actions/types';
const initialState = {
  loading: false,
  currentUserName: "",
  currentUserTag: ""
}
export default function(state = initialState, action) {
  switch (action.type) {
    case LOADING_CURRENT_USER:
      return {...state, loading: action.loading}
    case FETCH_CURRENT_USER:
      return {...state, loading: action.loading, currentUserName: action.currentUserName, currentUserTag: action.currentUserTag};
    default:
      return state;
  }
}