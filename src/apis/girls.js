import Request from './request';

const request = new Request();

// 查询福利图列表，分页
export const getGirlsImgList = async (data) => {
  return await request.get({
    url: '/image/girl/list',
    data,
    loading: false
  });
};

// 查询福利图列表随机
export const getGirlsImgListRandom = async (data) => {
  return await request.get({
    url: '/image/girl/list/random',
    data,
    loading: false
  });
};