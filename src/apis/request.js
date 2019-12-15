/**封装的网络请求**/
// import qs from 'qs';
import Taro from '@tarojs/taro';
import HOST, {APP_ID, APP_SECRET} from './config';

class Request {
  get(options) {
    if (typeof options !== 'object') {
      return;
    }
    options.method = 'GET';
    return this.requestEvent(options);
  }

  post(options) {
    if (typeof options !== 'object') {
      return;
    }
    options.method = 'POST';
    return this.requestEvent(options);
  }

  requestEvent(options) {
    if (!options) {
      return;
    }
    // console.log(options)
    let url = `${options.host || HOST + '/api'}${options.url}`;
    let data = options.data || {};
    let method = options.method || 'GET';
    let dataType = 'json';
    let header = {app_id: APP_ID, app_secret: APP_SECRET};
    let loading = typeof options.loading !== 'undefined' ? options.loading : true;
    let needCode = typeof options.needCode !== 'undefined' ? options.needCode : false;
    let from = options.from;
    // let header = {'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'};
    if (method === 'GET') {
      header['content-type'] = 'application/json;charset=UTF-8' // 默认值
    } else if (method === 'POST') {
      header['content-type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
    }
    let params = {
      url,
      data,
      header,
      method,
      dataType,
    };
    // console.log(params)
    if (loading) {
      Taro.showLoading({title: '加载中...', mask: true});
    }

    return new Promise((resolve, reject) => {
      if (process.env.NODE_ENV !== 'production')  {
        Taro.addInterceptor(Taro.interceptors.logInterceptor);
        Taro.addInterceptor(Taro.interceptors.timeoutInterceptor);
      }
      Taro.request(params)
        .then(res => {
          Taro.hideLoading();
          if (needCode) { // 需要返回code
            resolve(res.data);
          } else {
            let data = res.data;
            if (from === 'BAIDU_AI') { // 来自百度AI，数据返回和基本错误码提示
              judgeBaiduAIErrCode(data, resolve);
            } else if (from === 'BAIDU_FANYI') { // 来自百度翻译，数据返回和基本错误码提示
              judgeBaiduFanyiErrCode(data, resolve);
            } else {  // RollToolsApi的数据返回和错误提示
              if (data.code === 1) {
                resolve(data.data);
              } else {
                Taro.showToast({title: data.msg, icon: 'none'});
              }
            }
          }
        })
        .catch(err => {
          // console.log(err);
          Taro.hideLoading();
          const {errMsg} = err;
          if (/timeout/.test(errMsg)) {
            Taro.showToast({title: '请求超时，请稍后重试', icon: 'none',duration: 2000});
          } else {
            Taro.showToast({title: errMsg, icon: 'none'});
          }
          reject(err);
        })
    })
  };
}

// 判断百度Ai的错误码
const judgeBaiduAIErrCode = (data, resolve) => {
  const {error_code} = data;
  switch (error_code) {
    case 1:
      Taro.showToast({title: '服务器内部错误，请再次请求', icon: 'none', duration: 2000});
      break;
    case 500:
      Taro.showToast({title: '服务器内部错误，请再次请求', icon: 'none', duration: 2000});
      break;
    case 2:
      Taro.showToast({title: '服务暂不可用，请再次请求', icon: 'none', duration: 2000});
      break;
    case 3:
      Taro.showToast({title: '调用的API不存在，请检查后重新尝试', icon: 'none', duration: 2000});
      break;
    case 4:
      Taro.showToast({title: '集群超限额', icon: 'none', duration: 2000});
      break;
    case 6:
      Taro.showToast({title: '无权限访问该用户数据', icon: 'none', duration: 2000});
      break;
    case 13:
      Taro.showToast({title: '获取token失败', icon: 'none', duration: 2000});
      break;
    case 14:
      Taro.showToast({title: 'IAM鉴权失败', icon: 'none', duration: 2000});
      break;
    case 15:
      Taro.showToast({title: '应用不存在或者创建失败', icon: 'none', duration: 2000});
      break;
    case 17:
      Taro.showToast({title: '今日API调用次数已达上限，请明日再来', icon: 'none', duration: 2000});
      break;
    case 18:
      Taro.showToast({title: 'QPS超限额,请再次请求', icon: 'none', duration: 2000});
      break;
    case 19:
      Taro.showToast({title: '应用不存在或者创建失败', icon: 'none', duration: 2000});
      break;
    case 100:
      Taro.showToast({title: '无效的access_token参数', icon: 'none', duration: 2000});
      break;
    case 110:
      Taro.showToast({title: 'access_token无效', icon: 'none', duration: 2000});
      break;
    case 111:
      Taro.showToast({title: 'access token过期', icon: 'none', duration: 2000});
      break;
    case 216201:
      Taro.showToast({title: '上传的图片格式错误，目前仅支持PNG、JPG、JPEG、BMP格式', icon: 'none', duration: 2000});
      break;
    case 216202:
      Taro.showToast({title: '上传的图片大小错误，base64编码后图片小于4M，分辨率不高于4096*4096', icon: 'none', duration: 2000});
      break;
    case 216203:
      Taro.showToast({title: '上传的图片base64编码有误，请重新上传', icon: 'none', duration: 2000});
      break;
    default:
      resolve(data);
  }
};

// 判断百度翻译的错误码
const judgeBaiduFanyiErrCode = (data, resolve) => {
  const {error_code} = data;
  switch (error_code) {
    case 52001:
      Taro.showToast({title: '请求超时，请重试', icon: 'none', duration: 2000});
      break;
    case 52002:
      Taro.showToast({title: '系统错误，请重试', icon: 'none', duration: 2000});
      break;
    case 52003:
      Taro.showToast({title: '未授权用户', icon: 'none', duration: 2000});
      break;
    case 54000:
      Taro.showToast({title: '必填参数为空', icon: 'none', duration: 2000});
      break;
    case 54001:
      Taro.showToast({title: '签名错误', icon: 'none', duration: 2000});
      break;
    case 54003:
      Taro.showToast({title: '访问频率受限', icon: 'none', duration: 2000});
      break;
    case 54004:
      Taro.showToast({title: '账户余额不足', icon: 'none', duration: 2000});
      break;
    case 54005:
      Taro.showToast({title: '长query请求频繁， 请3s后再试', icon: 'none', duration: 2000});
      break;
    case 58000:
      Taro.showToast({title: '客户端IP非法', icon: 'none', duration: 2000});
      break;
    case 58001:
      Taro.showToast({title: '译文语言方向不支持', icon: 'none', duration: 2000});
      break;
    case 58002:
      Taro.showToast({title: '服务当前已关闭', icon: 'none', duration: 2000});
      break;
    case 90107:
      Taro.showToast({title: '认证未通过或未生效', icon: 'none', duration: 2000});
      break;
    default:
      resolve(data);
  }
};

export default Request;
