import Taro from '@tarojs/taro'
import { Ad } from '@tarojs/components'
import './index.scss'

function ComponentCommonVideoAd(props) {
  const unitId = props.unitId || 'adunit-1f57a7fe2bb7f25f';
  const adIntervals = props.adIntervals || 30;
  return (
    <Ad unitId={unitId} adIntervals={adIntervals} adType='video' adTheme='white' />
  );
}

export default ComponentCommonVideoAd;