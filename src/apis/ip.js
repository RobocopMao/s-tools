import Request from './request';

const request = new Request();

// 查询自己的ip
export const getSelfIp = async (data) => {
  return await request.get({
    url: '/ip/self',
    data,
  });
};

// 查询指定ip
export const getAimIp = async (data) => {
  return await request.get({
    url: '/ip/aim_ip',
    data,
  });
};