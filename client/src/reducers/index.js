import { combineReducers } from "redux";
import matchDetailsReducer from './matchDetailsReducer';

export default combineReducers({
  matchDetails: matchDetailsReducer
})