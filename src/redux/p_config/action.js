import {SET_CONFIG, SET_P_ID, SET_SECRET} from './constant'
import {getProductList, getRemoteConfig, user_id} from '../../apis/config'

export const setConfig = (config) => {
  return {
    type: SET_CONFIG,
    config
  }
};

export const setPId = (pId) => {
  return {
    type: SET_P_ID,
    pId
  }
};

export const setSecret = (secret) => {
  return {
    type: SET_SECRET,
    secret
  }
};

export const setPConfigAsync = () => {
  return async (dispatch) => {
    let res = await getProductList({user_id});
    const {secret, productId} = res[0];
    dispatch(setPId(Number(productId)));
    dispatch(setSecret(secret));

    let res1 = await getRemoteConfig({user_id, secret, product_id: productId});
    const productConfig = JSON.parse(res1.productConfig);

    // 最初返回的1和0是number类型，后来为了方便，配置App改了输入结构，返回string类型，所以1和0的字符串需要转换成数字
    for (let key in productConfig) {
      let val = productConfig[key];
      if (/(0|1){1}/.test(val) && val.length === 1) {
        productConfig[key] = Number(val);
      }
    }

    dispatch(setConfig(productConfig));
  }
};
