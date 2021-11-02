import { combineReducers } from "redux";
import currentUserReducer from "./currentUserReducer";
import matchDetailsReducer from './matchDetailsReducer';

export default combineReducers({
  matchDetails: matchDetailsReducer,
  currentUser: currentUserReducer
})