import Taro, {useEffect, useRouter, useState} from '@tarojs/taro'
import {View} from '@tarojs/components'
import {useSelector} from '@tarojs/redux'
import {ComponentCommonBannerAd} from '../../../../components/common/banner_ad'
import './index.scss'

function PhoneInfo() {
  const router = useRouter();
  const user = useSelector(state => state.user);
  const {brand, model, pixelRatio, screenWidth, screenHeight, statusBarHeight, language, version, system, platform, fontSizeSetting, SDKVersion,
    cameraAuthorized, locationAuthorized, microphoneAuthorized, notificationAuthorized, bluetoothEnabled, locationEnabled, wifiEnabled,
    albumAuthorized, notificationAlertAuthorized, notificationBadgeAuthorized, notificationSoundAuthorized} = user.systemInfo;
  const [color, setColor] = useState('');

  // 设置color
  useEffect(() => {
    const {color} = router.params;
    setColor(color);
    Taro.setNavigationBarColor({frontColor: '#ffffff', backgroundColor: color});
  }, []);

  return (
    <View className={`phone-info ${user.useDarkModel ? 'dark-model' : ''}`}>
      <View className='bd-radius mg-20 bg-white dm-bg-09'>
        <View className='flex-row space-between pd-26'>
          <View>设备品牌</View>
          <View>{brand}</View>
        </View>
        <View className='line' />
        <View className='flex-row space-between pd-26'>
          <View>设备型号</View>
          <View>{model}</View>
        </View>
        <View className='line' />
        <View className='flex-row space-between pd-26'>
          <View>设备像素比</View>
          <View>{pixelRatio}</View>
        </View>
        <View className='line' />
        <View className='flex-row space-between pd-26'>
          <View>屏幕宽度（px）</View>
          <View>{screenWidth}</View>
        </View>
        <View className='line' />
        <View className='flex-row space-between pd-26'>
          <View>屏幕高度（px）</View>
          <View>{screenHeight}</View>
        </View>
        <View className='line' />
        <View className='flex-row space-between pd-26'>
          <View>状态栏的高度（px）</View>
          <View>{statusBarHeight}</View>
        </View>
        <View className='line' />
        <View className='flex-row space-between pd-26'>
          <View>用户字体大小（px）</View>
          <View>{fontSizeSetting}</View>
        </View>
        <View className='line' />
        <View className='flex-row space-between pd-26'>
          <View>微信设置的语言</View>
          <View>{language}</View>
        </View>
        <View className='line' />
        <View className='flex-row space-between pd-26'>
          <View>微信版本号</View>
          <View>{version}</View>
        </View>
        <View className='line' />
        <View className='flex-row space-between pd-26'>
          <View>操作系统及版本</View>
          <View>{system}</View>
        </View>
        <View className='line' />
        <View className='flex-row space-between pd-26'>
          <View>客户端平台</View>
          <View>{platform}</View>
        </View>
        <View className='line' />
        <View className='flex-row space-between pd-26'>
          <View>客户端基础库版本</View>
          <View>{SDKVersion}</View>
        </View>
        <View className='line' />
        <View className='flex-row space-between pd-26'>
          <View>蓝牙系统开关</View>
          <View>{bluetoothEnabled ? `开` : `关` }</View>
        </View>
        <View className='line' />
        <View className='flex-row space-between pd-26'>
          <View>地理位置系统开关</View>
          <View>{locationEnabled ? `开` : `关` }</View>
        </View>
        <View className='line' />
        <View className='flex-row space-between pd-26'>
          <View>Wi-Fi系统开关</View>
          <View>{wifiEnabled ? `开` : `关` }</View>
        </View>
        <View className='line' />
        <View className='flex-row space-between pd-26'>
          <View>允许微信使用摄像头</View>
          <View>{cameraAuthorized ? `是` : `否` }</View>
        </View>
        <View className='line' />
        <View className='flex-row space-between pd-26'>
          <View>允许微信使用定位</View>
          <View>{locationAuthorized ? `是` : `否` }</View>
        </View>
        <View className='line' />
        <View className='flex-row space-between pd-26'>
          <View>允许微信使用麦克风</View>
          <View>{microphoneAuthorized ? `是` : `否` }</View>
        </View>
        <View className='line' />
        <View className='flex-row space-between pd-26'>
          <View>允许微信通知</View>
          <View>{notificationAuthorized ? `是` : `否` }</View>
        </View>
        {/*以下开关仅 iOS 有效*/}
        {albumAuthorized && <View className='line' />}
        {albumAuthorized && <View className='flex-row space-between pd-26'>
          <View>允许微信使用相册</View>
          <View>{albumAuthorized ? `是` : `否` }</View>
        </View>}
        {notificationAlertAuthorized && <View className='line' />}
        {notificationAlertAuthorized && <View className='flex-row space-between pd-26'>
          <View>允许微信通知带有提醒</View>
          <View>{notificationAlertAuthorized ? `是` : `否` }</View>
        </View>}
        {notificationBadgeAuthorized && <View className='line' />}
        {notificationBadgeAuthorized && <View className='flex-row space-between pd-26'>
          <View>允许微信通知带有标记</View>
          <View>{notificationBadgeAuthorized ? `是` : `否` }</View>
        </View>}
        {notificationSoundAuthorized && <View className='line' />}
        {notificationSoundAuthorized && <View className='flex-row space-between pd-26'>
          <View>允许微信通知带有声音</View>
          <View>{notificationSoundAuthorized ? `是` : `否` }</View>
        </View>}
      </View>
      <View className='pd-20 color-a1 font24 dm-color-c6'>Tips: 以上信息均在小程序初始化时获取，动态修改不会刷新数据</View>
      {/*广告位*/}
      <View className='pd-20'>
        <ComponentCommonBannerAd />
      </View>
    </View>
  )
}

PhoneInfo.config = {
  navigationBarTitleText: '手机信息助手',
};

export default PhoneInfo;
