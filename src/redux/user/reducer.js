import {SET_SYSTEM_INFO, SET_BD_AI_TOKEN, SET_DARK_MODEL} from './constant'

const INITIAL_STATE = {
  systemInfo: {},
  bdAiToken: {},
  useDarkModel: false,
};

export default function reducer (state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_SYSTEM_INFO:
      return {
        ...state,
        systemInfo: Object.assign({}, state.systemInfo, action.systemInfo)
      };
    case SET_BD_AI_TOKEN:
      return {
        ...state,
        bdAiToken: Object.assign({}, state.bdAiToken, action.bdAiToken)
      };
    case SET_DARK_MODEL:
      return {
        ...state,
        useDarkModel: action.useDarkModel
      }
    default:
       return state
  }
}
