import Request from './request';

const request = new Request();

// 获取access_token。
export const aiAccessToken = async (data) => {
  return await request.post({
    host: 'https://aip.baidubce.com',
    url: '/oauth/2.0/token',
    data: data,
    needCode: true,
  });
};

// 通用文字识别:用户向服务请求识别某张图中的所有文字。
export const aiGeneralBasic = async (data) => {
  return await request.post({
    host: 'https://aip.baidubce.com',
    url: '/rest/2.0/ocr/v1/general_basic',
    data: data,
    needCode: true,
  });
};

// 高精度文字识别:用户向服务请求识别某张图中的所有文字。
export const aiAccurateBasic = async (data) => {
  return await request.post({
    host: 'https://aip.baidubce.com',
    url: '/rest/2.0/ocr/v1/accurate_basic',
    data: data,
    needCode: true,
  });
};