import Request from './request';
const request = new Request();

const HOST = 'https://www.mxnzp.com';

export const app_id = '';

export const app_secret = '';

export const S_WEATHER_APPID = '';

// 查询远程配置
export const getRemoteConfig = async (data) => {
  return await request.get({
    url: '/remote_config/get',
    data,
    loading: false
  });
};

export const getProductList = async (data) => {
  return await request.get({
    url: '/admin/user/product/list',
    data,
    loading: false
  });
};

export default HOST;
