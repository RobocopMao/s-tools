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
          let data = res.data;
          Taro.hideLoading();
          if (data.code === 1) {
            resolve(data.data);
          } else {
            Taro.showToast({title: data.msg, icon: 'none'});
          }
        })
        .catch(err => {
          Taro.hideLoading();
          reject(err);
        })
    })
  };
}

export default Request;
