import Request from './request';

const request = new Request();

// 查询福利图列表
export const getGirlsImgList = async (data) => {
  return await request.get({
    url: '/image/girl/list',
    data,
    loading: false
  });
};