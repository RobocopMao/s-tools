import Request from './request';

const request = new Request();
const FROM = 'BAIDU_AI';
const HOST = 'https://aip.baidubce.com';

// 获取access_token。
export const aiAccessToken = async (data) => {
  return await request.post({
    host: HOST,
    url: '/oauth/2.0/token',
    data,
    from: FROM,
  });
};

// 通用文字识别:用户向服务请求识别某张图中的所有文字。
export const aiGeneralBasic = async (data) => {
  return await request.post({
    host: HOST,
    url: '/rest/2.0/ocr/v1/general_basic',
    data,
    from: FROM,
  });
};

// 高精度文字识别:用户向服务请求识别某张图中的所有文字。
export const aiAccurateBasic = async (data) => {
  return await request.post({
    host: HOST,
    url: '/rest/2.0/ocr/v1/accurate_basic',
    data,
    from: FROM,
  });
};