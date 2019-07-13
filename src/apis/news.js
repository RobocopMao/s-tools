import Request from './request';

const request = new Request();

// 获取新闻类型列表
export const getNewsTypes = async (data) => {
  return await request.get({
    url: '/news/types',
    data,
  });
};

// 根据新闻类型获取新闻列表
export const getNewsList = async (data) => {
  return await request.get({
    url: '/news/list',
    data,
    loading: false
  });
};

// 根据新闻类型获取新闻列表
export const getNewsDetails = async (data) => {
  return await request.get({
    url: '/news/details',
    data,
  });
};

