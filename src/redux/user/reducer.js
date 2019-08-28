import {SET_SYSTEM_INFO, SET_TOKEN} from './constant'

const INITIAL_STATE = {
  systemInfo: {},
  token: {}
};

export default function reducer (state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_SYSTEM_INFO:
      return {
        ...state,
        systemInfo: Object.assign({}, state.systemInfo, action.systemInfo)
      };
    case SET_TOKEN:
      return {
        ...state,
        token: Object.assign({}, state.token, action.token)
      };
    default:
       return state
  }
}
