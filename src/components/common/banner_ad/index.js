import Taro from '@tarojs/taro'
import { Ad } from '@tarojs/components'
import './index.scss'
import random from 'lodash/random'

function ComponentCommonBannerAd(props) {
  const adunits = ['00b421f9be16a7b2', 'db1d8dee31cb4130', 'f3ebe4f152d3ced4', 'ddd864cf21eb4bc6', '02ef3885cb28d8c7', 'ff62717b0bd6dc9d', '0bf4dec12faf714b', '429935b541df255b'];
  const randomUnitId = `adunit-${adunits[random(0, 7)]}`;
  const unitId = props.unitId || randomUnitId;
  const adIntervals = props.adIntervals || 30;
  return (
    <Ad unitId={unitId} adIntervals={adIntervals} />
  );
}

export default ComponentCommonBannerAd;