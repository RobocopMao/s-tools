// 插屏广告hook
import Taro, {useEffect, useState} from '@tarojs/taro'

export const useInterstitialAd = () => {
  const [interstitialAd, setInterstitialAd] = useState(null);

  useEffect(() => {
    if (Taro.createInterstitialAd) {
      let _interstitialAd = Taro.createInterstitialAd({
        adUnitId: 'adunit-9803947eeb1dda76'
      });
      _interstitialAd.onLoad(() => {
        console.log('插屏广告加载成功');
      });
      _interstitialAd.onError((err) => {
        console.log('插屏广告加载失败', err);
      });
      _interstitialAd.onClose((res) => {
        console.log('插屏广告已关闭', res);
      });

      setInterstitialAd(_interstitialAd);
    }

    return () => {
      setInterstitialAd(null);
    }
  }, []);

  return interstitialAd;
};

export default useInterstitialAd;