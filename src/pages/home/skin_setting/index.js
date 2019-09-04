import Taro, {useEffect, useState} from '@tarojs/taro'
import {View, Text, Swiper, SwiperItem} from '@tarojs/components'
import bannerImg1 from '../../../assets/images/banner1.jpg'
import bannerImg2 from '../../../assets/images/banner2.jpg'
import bannerImg3 from '../../../assets/images/banner3.jpg'
import bannerImg4 from '../../../assets/images/banner4.jpg'
import bannerImg5 from '../../../assets/images/banner5.jpg'
import bannerImg6 from '../../../assets/images/banner6.jpg'
import bannerImg7 from '../../../assets/images/banner7.jpg'
import bannerImg8 from '../../../assets/images/banner8.jpg'
import './index.scss'
import {getNodeRect} from "../../../utils";

// banner
const banners = [
  {img: bannerImg1, color: '#1E154D'},
  {img: bannerImg2, color: '#FFC103'},
  {img: bannerImg3, color: '#504dbe'},
  {img: bannerImg4, color: '#844DF6'},
  {img: bannerImg5, color: '#fefdfe'},
  {img: bannerImg6, color: '#8DB224'},
  {img: bannerImg7, color: '#01479d'},
  {img: bannerImg8, color: '#FFA6B6'}];

function SkinSetting() {
  const BANNER_NO = Taro.getStorageSync('BANNER_NO');
  const [color, setColor] = useState('');
  const [swiperHeight, setSwiperHeight] = useState(0);
  const [current, setCurrent] = useState(BANNER_NO);

  // 设置color
  useEffect(() => {
    const {color} = this.$router.params;
    setColor(color);
    Taro.setNavigationBarColor({frontColor: '#ffffff', backgroundColor: color});
  }, []);

  useEffect(async () => {
    const node = await getNodeRect('#swiperBox');
    const {height} = node;
    setSwiperHeight(height);
  }, []);

  const swiperChange = (e) => {
    console.log(e);
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
      <View className='flex-column flex-grow-1 bd-radius of-hidden swiper-box' id='swiperBox'>
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
                <Image className='w100-per' style={{height: `200px`}} src={banner.img} />
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
