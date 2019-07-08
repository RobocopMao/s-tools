import Request from './request';

const request = new Request();

// 查询指定日期节日和万年历
export const getHolidaySingle = async (data) => {
  return await request.get({
    url: '/holiday/single/' + data.date,
    data: null,
  });
};