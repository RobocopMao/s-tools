import Taro from '@tarojs/taro'
import {SET_SYSTEM_INFO, SET_BD_AI_TOKEN} from './constant'
import {getSystemInfo} from '../../utils';

export const setSystemInfo = (systemInfo) => {
  return {
    type: SET_SYSTEM_INFO,
    systemInfo
  }
};

export const setSystemInfoAsync = () => {
  return async (dispatch) => {
    const menuButton =  Taro.getMenuButtonBoundingClientRect(); // 胶囊
    const {bottom, height} = menuButton;
    let res = await getSystemInfo();
    const {windowHeight, screenHeight, statusBarHeight} = res;
    let _windowHeight = {
      customWindowHeight: windowHeight,
      windowHeight: screenHeight - ((bottom - height - statusBarHeight) * 2 + height + statusBarHeight)  // 屏幕高度 - [（胶囊上下距离:上不含状态栏高）* 2 + 胶囊高 + 状态栏高度]
    };
    let systemInfo = Object.assign({}, res,{menuButton}, _windowHeight);
    dispatch(setSystemInfo(systemInfo));
  }
};

// 设置AI token
export const setBdAiToken = (bdAiToken) => {
  return {
    type: SET_BD_AI_TOKEN,
    bdAiToken
  }
};
