import Taro, { useEffect, DependencyList } from '@tarojs/taro'

export function useAsyncEffect (effect, deps = DependencyList) {
  useEffect(() => {
    effect()
  }, deps)
}

/*
 * 获取单个node的 rect
 */
export const getNodeRect = (selector) => {
  return new Promise((resolve, reject) => {
    Taro.createSelectorQuery().select(selector).boundingClientRect(function(rect) {
      // console.log(rect);
      resolve(rect);
    }).exec();
  });
};

// 获取系统信息
export const getSystemInfo = () => {
  return new Promise((resolve, reject) => {
    Taro.getSystemInfo({
      success: res => {
        resolve(res);
      }
    });
  });
};
