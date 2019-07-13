import Request from './request';

const request = new Request();

export const getRubbishType = async (data) => {
  return await request.get({
    url: '/rubbish/type',
    data,
  });
};