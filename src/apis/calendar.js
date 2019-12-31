import Request from './request';

const request = new Request();

// 查询指定日期节日和万年历
export const getHolidaySingle = async (data) => {
  return await request.get({
    url: '/holiday/single/' + data.date,
    data: null,
    needCode: true,
  });
};

// 获取历史上的今天数据
// 参数说明： type：是否需要详情，0：不需要详情 1：需要详情 默认值 0 可不传
export const getHistoryToday = async (data) => {
  return await request.get({
    url: '/history/today' ,
    data: data,
  });
};