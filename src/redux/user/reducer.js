import {SET_SYSTEM_INFO, SET_AI_TOKEN} from './constant'

const INITIAL_STATE = {
  systemInfo: {},
  aiToken: {}
};

export default function reducer (state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_SYSTEM_INFO:
      return {
        ...state,
        systemInfo: Object.assign({}, state.systemInfo, action.systemInfo)
      };
    case SET_AI_TOKEN:
      return {
        ...state,
        aiToken: Object.assign({}, state.aiToken, action.aiToken)
      };
    default:
       return state
  }
}
