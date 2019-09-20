import Taro, {useEffect, useRouter, useState} from '@tarojs/taro'
import {View, Swiper, SwiperItem} from '@tarojs/components'
import banners from '../../../utils/banners'
import {getNodeRect} from '../../../utils';
import './index.scss'

function SkinSetting() {
  const router = useRouter();
  const BANNER_NO = Taro.getStorageSync('BANNER_NO');
  const [color, setColor] = useState('');
  const [swiperHeight, setSwiperHeight] = useState(0);
  const [current, setCurrent] = useState(BANNER_NO);

  // 设置color
  useEffect(() => {
    const {color} = router.params;
    setColor(color);
    Taro.setNavigationBarColor({frontColor: '#ffffff', backgroundColor: color});
  }, []);

  useEffect(async () => {
    const node = await getNodeRect('#swiperBox');
    const {height} = node;
    setSwiperHeight(height);
  }, []);

  const swiperChange = (e) => {
    // console.log(e);
    const {current} = e.detail;
    setCurrent(current);
  };

  const saveSkinSetting = () => {
    const eventChannel = this.$scope.getOpenerEventChannel();
    eventChannel.emit('acceptDataFromSkinSetting', {bannerNo: current});  // 触发事件
    Taro.navigateBack(1);
  };

  return (
    <View className='skin-switching pd-40 bd-box h100-per flex-column'>
      <View className='flex-column flex-grow-1 bd-radius-50 of-hidden swiper-box' id='swiperBox'>
        <Swiper
          className='h100-per flex-grow-1 flex-column'
          circular
          current={BANNER_NO}
          indicatorDots
          indicatorActiveColor={color}
          style={{height: `${swiperHeight}px`}}
          onChange={(e) => swiperChange(e)}
        >
          {banners.map((banner, index) => {
            return (
              <SwiperItem className='flex-column flex-grow-1 h100-per' key={String(index)}>
                <Image className='w100-per' style={{height: `170px`}} src={banner.img} />
                <View className='flex-grow-1' style={{backgroundColor: banner.color}} />
              </SwiperItem>
            )
          })}
        </Swiper>
      </View>
      <View className='mg-t-40'>
        <Button className='white bd-radius-50' style={{backgroundColor: color}} onClick={() => saveSkinSetting()}>保存设置</Button>
      </View>
    </View>
  )
}

SkinSetting.config = {
  navigationBarTitleText: '皮肤设置'
};

export default SkinSetting;
