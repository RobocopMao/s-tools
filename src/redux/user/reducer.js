import {SET_SYSTEM_INFO, SET_OCR_TOKEN} from './constant'

const INITIAL_STATE = {
  systemInfo: {},
  ocrToken: {}
};

export default function reducer (state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_SYSTEM_INFO:
      return {
        ...state,
        systemInfo: Object.assign({}, state.systemInfo, action.systemInfo)
      };
    case SET_OCR_TOKEN:
      return {
        ...state,
        ocrToken: Object.assign({}, state.ocrToken, action.ocrToken)
      };
    default:
       return state
  }
}
