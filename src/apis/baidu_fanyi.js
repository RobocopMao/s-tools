import Request from './request'
import MD5 from '../utils/md5'

const request = new Request();
const FROM = 'BAIDU_FANYI';
const HOST = 'https://fanyi-api.baidu.com';

//获取翻译结果。
export const fanyiTranslate = async (data) => {
  const sign = creatSign(data);
  let _data = Object.assign({}, data, sign); // 合并参数
  delete _data.key;
  return await request.post({
    host: HOST,
    url: '/api/trans/vip/translate',
    data: _data,
    from: FROM,
  });
};

// 生成签名
const creatSign = (data) => {
  const {appid, q, key, salt} = data;
  const signStr = appid + q + salt +key;
  const sign = MD5(signStr);
  return {sign};
};