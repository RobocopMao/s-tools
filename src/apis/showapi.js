import Request from './request';

const request = new Request();
const FROM = 'SHOW_API';
const HOST = 'https://route.showapi.com';

// 根据成语查注释
export const getIdiom = async (data) => {
  return await request.post({
    host: HOST,
    url: '/1196-2',
    data,
    from: FROM,
  });
};

//