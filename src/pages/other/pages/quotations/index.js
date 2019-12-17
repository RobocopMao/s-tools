import Taro, {useState, useEffect, useRouter} from '@tarojs/taro'
import { View, Swiper, SwiperItem} from '@tarojs/components'
import {useSelector} from '@tarojs/redux'
import random from 'lodash/random'
import { getQuotations } from '../../../../apis/showapi'
import { useAsyncEffect } from '../../../../utils'
import {useInterstitialAd} from '../../../../hooks'
import './index.scss'

const colorsArr = ['#304FFE', '#0091EA', '#00B8D4', '#00BFA5', '#1B5E20', '#00C853', '#9E9D24', '#AEEA00', '#FFB837',
  '#FF6D00', '#FF3D00', '#FF5252', '#FF4081', '#AA00FF', '#7C4DFF', '#6200EA', '#4E342E', '#607D8B', '#00E5FF', '#616161', '#000000'];

function Quotations() {
  const router = useRouter();
  const pConfig = useSelector(state => state.pConfig);
  const interstitialAd = useInterstitialAd();
  const {showApiAppID, showApiSecret} = pConfig.config;
  const [count, setCount] = useState(10); // 返回的条数
  const [quotations, setQuotations] = useState([]); // 查询的结果
  const [showAdNumber, setShowAdNumber] = useState([10, 50, 100, 200]); // 当滑块滑动到这些位置时展示广告

  // 设置color
  useEffect(() => {
    const {color} = router.params;
    // setColor(color);
    Taro.setNavigationBarColor({frontColor: '#ffffff', backgroundColor: color});
  }, []);

  useAsyncEffect(() => {
    fetchQuotations();
  }, []);

  // 随机获取笑话
  const fetchQuotations = async () => {
    const res = await getQuotations({count, showapi_appid: showApiAppID, showapi_sign: showApiSecret});
    const {ret_code, data, ret_message} = res;
    if (ret_code === 0) {
      let newQuotations = quotations.concat(data);
      setQuotations(newQuotations);
    } else {
      Taro.showToast({title: ret_message, icon: 'none', duration: 2000});
    }
  };

  // swiper 切换
  const handleSwiperChange = e => {
    const {current} = e.detail;
    if (current === quotations.length - 1) {
      fetchQuotations();
    }
    if (interstitialAd && showAdNumber.includes(current)) {
      interstitialAd.show().catch((err) => {
        console.error(err);
      });
      // 展示过广告的位置就不展示了
      showAdNumber.splice(0, 1);
      setShowAdNumber(showAdNumber);
    }
  };

  return (
    <View className='quotations h100-per'>
      <Swiper
        className='h100-per'
        onChange={(e) => handleSwiperChange(e)}
      >
        {quotations.map((quotation, index) => {
          const {english, chinese} = quotation;
          return (
            <SwiperItem className='flex flex-column flex-col-center flex-row-center relative' key={index}>
              <View className='pd-l-20 pd-r-20 text-center'>
                <View className='font48 black bold mg-b-40' style={{color: colorsArr[random(0, 20)]}} onLongPress={() => Taro.setClipboardData({data: english})}>{english}</View>
                <View className='font48 black bold' style={{color: colorsArr[random(0, 20)]}} onLongPress={() => Taro.setClipboardData({data: chinese})}>{chinese}</View>
              </View>
              <View className='text-center pd-20 quotation-no'>— {index + 1} —</View>
            </SwiperItem>
          )
        })}
      </Swiper>
    </View>
  )
}

Quotations.config = {
  navigationBarTitleText: '英语励志语录'
};

export default Quotations;
