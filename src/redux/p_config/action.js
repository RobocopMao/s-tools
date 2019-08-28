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
    dispatch(setConfig(productConfig));
  }
};
