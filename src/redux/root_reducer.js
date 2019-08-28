import { combineReducers } from 'redux'
import pConfig from './p_config/reducer'
import user from './user/reducer'

export default combineReducers({
  pConfig,
  user,
})
