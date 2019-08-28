import {SET_CONFIG, SET_P_ID, SET_SECRET} from './constant'

const INITIAL_STATE = {
  config: {},
  pId: 50005, // 默认是这么多
  secret: ''
};

export default function reducer (state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_CONFIG:
      return {
        ...state,
        config: Object.assign({}, state.config, action.config)
      };
    case SET_P_ID:
      return {
        ...state,
        pId: action.pId
      };
    case SET_SECRET:
      return {
        ...state,
        secret: action.secret
      };
    default:
       return state
  }
}
