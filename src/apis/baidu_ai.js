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

/*******************文字识别********************/
// 通用文字识别:用户向服务请求识别某张图中的所有文字。
export const aiOcrGeneralBasic = async (data) => {
  return await request.post({
    host: HOST,
    url: '/rest/2.0/ocr/v1/general_basic',
    data,
    from: FROM,
  });
};

// 高精度文字识别:用户向服务请求识别某张图中的所有文字。
export const aiOcrAccurateBasic = async (data) => {
  return await request.post({
    host: HOST,
    url: '/rest/2.0/ocr/v1/accurate_basic',
    data,
    from: FROM,
  });
};

/*******************图像识别********************/
// 通用物体和场景识别高级版
export const aiImageAdvancedGeneral = async (data) => {
  return await request.post({
    host: HOST,
    url: '/rest/2.0/image-classify/v2/advanced_general',
    data,
    from: FROM,
  });
};

// 动物识别
export const aiImageAnimal = async (data) => {
  return await request.post({
    host: HOST,
    url: '/rest/2.0/image-classify/v1/animal',
    data,
    from: FROM,
  });
};

// 植物识别
export const aiImagePlant = async (data) => {
  return await request.post({
    host: HOST,
    url: '/rest/2.0/image-classify/v1/plant',
    data,
    from: FROM,
  });
};

// 果蔬类食材识别
export const aiImageIngredient = async (data) => {
  return await request.post({
    host: HOST,
    url: '/rest/2.0/image-classify/v1/classify/ingredient',
    data,
    from: FROM,
  });
};

// 菜品识别
export const aiImageDish = async (data) => {
  return await request.post({
    host: HOST,
    url: '/rest/2.0/image-classify/v2/dish',
    data,
    from: FROM,
  });
};

// 地标识别
export const aiImageLandmark = async (data) => {
  return await request.post({
    host: HOST,
    url: '/rest/2.0/image-classify/v1/landmark',
    data,
    from: FROM,
  });
};

// 货币识别
export const aiImageCurrency = async (data) => {
  return await request.post({
    host: HOST,
    url: '/rest/2.0/image-classify/v1/currency',
    data,
    from: FROM,
  });
};

// 商标识别
export const aiImageLogo = async (data) => {
  return await request.post({
    host: HOST,
    url: '/rest/2.0/image-classify/v2/logo',
    data,
    from: FROM,
  });
};

// 人像分割
export const aiBodySeg = async (data) => {
  return await request.post({
    host: HOST,
    url: '/rest/2.0/image-classify/v1/body_seg',
    data,
    from: FROM,
  });
};