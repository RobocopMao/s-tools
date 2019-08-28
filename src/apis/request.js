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
            if (data.code === 1) {
              resolve(data.data);
            } else {
              Taro.showToast({title: data.msg, icon: 'none'});
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
