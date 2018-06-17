import { combineReducers } from 'redux'
import {
    JEWELS_CREATED,
    JEWEL_CLICK,
    SEQUENCE_FOUND,
    INTRO_COMPLETE,
  } from '../actions';

import {
  NEUTRAL, 
  INTRO_ANIMATION, 
  JEWEL_CLICK_IN,
  HIGHLIGHT_SEQUENCES,
  CHECK_FOR_SEQUENCES
} from '../constants'



  function appData(state = {jewels: [], selectedJewel: [], score: 0, time: 0, animationPhase: NEUTRAL}, action) {
    switch (action.type) {
      case INTRO_COMPLETE:
        const jewels = state.jewels.map(j=>{
          return {...j, animate: {direction: "static"}}
        });
        return {...state, jewels, animationPhase: CHECK_FOR_SEQUENCES}
      case SEQUENCE_FOUND:
        const highlightJewels = action.sequences.map(j=>({...j, highLighted: true}))
        const normalJewels = state.jewels.filter(j=>{
          return action.sequences.reduce((acc,curr)=>{
            if(curr.row===j.row&&curr.column===j.column) return false;
            return acc;
          } , true)
        }) ;
        //console.log(t)
        //const otherJewels = state.appData.jewels.filter(j=>j.row!==&&j.column!==)
        return {...state, jewels: [...highlightJewels, ...normalJewels],  sequences: action.sequences, animationPhase: HIGHLIGHT_SEQUENCES};
      case JEWELS_CREATED:
        return {...state, jewels: action.jewels, animationPhase: INTRO_ANIMATION};
      case JEWEL_CLICK:
        return {...state, selectedJewel: action.jewel, animationPhase: JEWEL_CLICK_IN}
      default:
        return state;
    }
  }

  const rootReducer = combineReducers({
    appData
  })
  
  export default rootReducer;