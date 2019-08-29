/**封装的网络请求**/
// import qs from 'qs';
import Taro from '@tarojs/taro';
import HOST from './config';

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
    let header = {};
    let loading = typeof options.loading !== 'undefined' ? options.loading : true;
    let needCode = typeof options.needCode !== 'undefined' ? options.needCode : false;
    let from = options.from;
    // let header = {'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'};
    if (method === 'GET') {
      header = {
        'content-type': 'application/json;charset=UTF-8', // 默认值
      }
    } else if (method === 'POST') {
      header = {
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
      }
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
      Taro.request(params)
        .then(res => {
          Taro.hideLoading();
          if (needCode) { // 需要返回code
            resolve(res.data);
          } else {
            let data = res.data;
            if (from === 'BAIDU_AI') { // 来自百度AI，数据返回和基本错误码提示
              if (data.error_code === 1) {
                Taro.showToast({title: '服务器内部错误，请再次请求', icon: 'none', duration: 2000});
              } else if (data.error_code === 2) {
                Taro.showToast({title: '服务暂不可用，请再次请求', icon: 'none', duration: 2000});
              } else if (data.error_code === 3) {
                Taro.showToast({title: '调用的API不存在，请检查后重新尝试', icon: 'none', duration: 2000});
              } else if (data.error_code === 4) {
                Taro.showToast({title: '集群超限额', icon: 'none', duration: 2000});
              } else if (data.error_code === 6) {
                Taro.showToast({title: '无权限访问该用户数据', icon: 'none', duration: 2000});
              } else if (data.error_code === 13) {
                Taro.showToast({title: '获取token失败', icon: 'none', duration: 2000});
              } else if (data.error_code === 14) {
                Taro.showToast({title: 'IAM鉴权失败', icon: 'none', duration: 2000});
              } else if (data.error_code === 15) {
                Taro.showToast({title: '应用不存在或者创建失败', icon: 'none', duration: 2000});
              } else if (data.error_code === 17) {
                Taro.showToast({title: '今日API调用次数已达上限，请明日再来', icon: 'none', duration: 2000});
              } else if (data.error_code === 18) {
                Taro.showToast({title: 'QPS超限额,请再次请求', icon: 'none', duration: 2000});
              } else if (data.error_code === 19) {
                Taro.showToast({title: '应用不存在或者创建失败', icon: 'none', duration: 2000});
              } else if (data.error_code === 100) {
                Taro.showToast({title: '无效的access_token参数', icon: 'none', duration: 2000});
              } else if (data.error_code === 110) {
                Taro.showToast({title: 'access_token无效', icon: 'none', duration: 2000});
              } else if (data.error_code === 111) {
                Taro.showToast({title: 'access token过期', icon: 'none', duration: 2000});
              } else {
                resolve(res.data);
              }
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

export default Request;
