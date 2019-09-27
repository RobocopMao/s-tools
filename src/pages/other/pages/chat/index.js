import Taro, {useEffect, useRouter, useState} from '@tarojs/taro'
import {View} from '@tarojs/components'
import qrCodeImg from '../../assets/images/qrcode.jpg'
import screenShoot1Img from '../../assets/images/screen_shot1.jpg'
import screenShoot2Img from '../../assets/images/screen_shot2.jpg'
import {ComponentCommonBannerAd} from '../../../../components/common/banner_ad'
import './index.scss'

function Chat() {
  const router = useRouter();
  const [color, setColor] = useState('');

  // 设置color
  useEffect(() => {
    const {color} = router.params;
    setColor(color);
    Taro.setNavigationBarColor({frontColor: '#ffffff', backgroundColor: color});
  }, []);

  // 图片预览
  const previewImage = (current) => {
    Taro.previewImage({
      current,
      urls: [screenShoot1Img, screenShoot2Img]
    })
  };

  return (
    <View className='chat text-center'>
      <View className='flex-row flex-row-center mg-t-40'>
        <Image className='qr-code' src={qrCodeImg} showMenuByLongpress />
      </View>
      <View className='text-center mg-t-20'>
        <View>长按上方二维码保存图片</View>
        <View>然后识别二维码进入公众号</View>
        <View>即可开始闲聊</View>
      </View>
      <View className='mg-t-40 mg-b-20'>下方为部分聊天截图</View>
      <View className='flex-row flex-row-center'>
        <Image className='w100 h200 mg-r-20' src={screenShoot1Img} onClick={() => previewImage(screenShoot1Img)} />
        <Image className='w100 h200' src={screenShoot2Img}  onClick={() => previewImage(screenShoot2Img)}/>
      </View>
      <View className='text-center mg-t-40'>
        <View>本功能来自腾讯AI开放平台</View>
        <View>如果你有闲置公众号也可以一键接入哦</View>
      </View>
      <View className='mg-t-40 mg-b-40 pd-l-20 pd-r-20'>
        <ComponentCommonBannerAd />
      </View>
    </View>
  )
}

Chat.config = {
  navigationBarTitleText: '闲聊'
};

export default Chat;
