import Request from './request';

const request = new Request();

export const getJokes = async (data) => {
  return await request.get({
    url: '/jokes/list',
    data,
    loading: false
  });
};

// 随机获取
export const getJokesRandom = async (data) => {
  return await request.get({
    url: '/jokes/list/random ',
    data,
    loading: false
  });
};
