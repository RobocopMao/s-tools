import Request from './request';

const request = new Request();

// 根据快递单号识别出所属快递公司编号
export const getLogisticsTypeId = async (data) => {
  return await request.get({
    url: '/logistics/discern',
    data: data,
  });
};

// 根据快递单号以及物流公司id查询物流信息
export const getLogisticsDetails = async (data) => {
  return await request.get({
    url: '/logistics/details/search',
    data: data,
    needCode: true,
  });
};