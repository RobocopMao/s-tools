import Request from './request';

const request = new Request();

/**
 * 归属地查询
 * @param data： {mobile: 11位手机号}
 * @returns {Promise<void>}
 */
export const getPhoneLocation = async (data) => {
  return await request.get({
    url: '/mobile_location/aim_mobile',
    data,
  });
};

// 世界电话区号查询
export const getPhoneCode = async (data) => {
  return await request.get({
    url: '/phone_code/list',
    data,
  });
};
