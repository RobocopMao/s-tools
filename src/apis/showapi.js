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

// 随机返回1-10条英文语录
export const getQuotations = async (data) => {
  return await request.post({
    host: HOST,
    url: '/1211-1',
    data,
    from: FROM,
    loading: false,
  });
};

// 生僻字查询
export const getRareWords = async (data) => {
  return await request.post({
    host: HOST,
    url: '/905-1',
    data,
    from: FROM
  });
};

// 提供微软必应(Bing)搜索首页每日的壁纸大图及相关介绍
export const getBingWallpaper = async (data) => {
  return await request.post({
    host: HOST,
    url: '/1287-1',
    data,
    from: FROM
  });
};