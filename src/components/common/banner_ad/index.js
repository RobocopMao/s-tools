import Taro from '@tarojs/taro'
import { Ad } from '@tarojs/components'
import './index.scss'

function ComponentCommonBannerAd(props) {
  const unitId = props.unitId || 'adunit-00b421f9be16a7b2';
  const adIntervals = props.adIntervals || 30;
  return (
    <Ad unitId={unitId} adIntervals={adIntervals} />
  );
}

export default ComponentCommonBannerAd;