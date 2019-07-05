import Request from './request';

const request = new Request();

export const getJokes = async (data) => {
  return await request.get({
    url: '/jokes/list',
    data,
  });
};
