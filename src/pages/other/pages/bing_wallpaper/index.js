import Taro, {useEffect, useState, useShareAppMessage, useRouter} from '@tarojs/taro'
import {View, Text, Button, Image} from '@tarojs/components'
import {useSelector} from '@tarojs/redux'
import moment from 'moment'
import { getBingWallpaper } from '../../../../apis/showapi'
import {useAsyncEffect} from '../../../../utils';
import {ComponentCommonBannerAd} from '../../../../components/common/banner_ad'
import './index.scss'

function BingWallpaper() {
  const router = useRouter();
  const pConfig = useSelector(state => state.pConfig);
  const {showApiAppID, showApiSecret} = pConfig.config;
  const [wallpaper, setWallpaper] = useState({});
  const [color, setColor] = useState('');
  const [active, setActive] = useState(0);

  // 设置color
  useEffect(() => {
    const {color} =router.params;
    setColor(color);
    Taro.setNavigationBarColor({frontColor: '#ffffff', backgroundColor: color});
  }, []);

  useAsyncEffect(async () => {
    const res = await getBingWallpaper({showapi_appid: showApiAppID, showapi_sign: showApiSecret});
    const {ret_code, data, ret_message} = res;
    if (ret_code === 0) {
      setWallpaper(data);
    } else {
      Taro.showToast({title: ret_message, icon: 'none', duration: 2000});
    }
  }, []);

  // 预览图片
  const previewImg = (url) => {
    Taro.previewImage({
      current: url,
      urls: [url]
    });
  };

  // 图片尺寸选择
  const handleSelectWidth = active => {
    setActive(active)
  };

  return (
    <View className='bing-wallpaper'>
      <View className='pd-20 bd-box' onClick={() => previewImg(active === 0 ? wallpaper.img_1366 : wallpaper.img_1920)}>
        <Image className='img w100-per' src={active === 0 ? wallpaper.img_1366 : wallpaper.img_1920} />
      </View>
      {wallpaper.title && <View className='pd-l-20 pd-r-20 pd-b-20 bold font36'>{wallpaper.title}</View>}
      {wallpaper.subtitle && <View className='pd-l-20 pd-r-20 pd-b-20'>{wallpaper.subtitle}</View>}
      {wallpaper.date && <View className='pd-l-20 pd-r-20 pd-b-20'>拍摄日期：{moment(wallpaper.date).format('YYYY-MM-DD')}</View>}
      {wallpaper.description && <View className='pd-l-20 pd-r-20 pd-b-20'>图片描述：{wallpaper.description}</View>}
      {wallpaper.copyright && <View className='pd-l-20 pd-r-20'>版权出处：{wallpaper.copyright}</View>}
      <View className='pd-20 flex-row flex-col-center'>
        <Text>图片尺寸：</Text>
        <Button className={`btn bd-radius-50 mg-r-20 pd-l-20 pd-r-20 ${active === 0 ? '' : 'plain'}`}
                style={{backgroundColor: active === 0 ? color : '#fffff', borderColor: color, color: active === 0 ? '#fffff' : color}}
                onClick={() => handleSelectWidth(0)}>1366*768</Button>
        <Button className={`btn bd-radius-50 pd-l-20 pd-r-20 ${active === 1 ? '' : 'plain'}`}
                style={{backgroundColor: active === 1 ? color : '#fffff', borderColor: color, color: active === 1 ? '#fffff' : color}}
                onClick={() => handleSelectWidth(1)}>1920*1080</Button>
      </View>
      <View className='pd-l-20 pd-r-20 pd-b-20 color-a1 font24'>Tips: 选择对应图片尺寸后点击图片预览，长按可以保存图片</View>
      {/*广告位*/}
      <View className='pd-20'>
        <ComponentCommonBannerAd />
      </View>
    </View>
  )
}

BingWallpaper.config = {
  navigationBarTitleText: 'Bing每日壁纸',
};

export default BingWallpaper;
