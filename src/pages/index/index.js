import Taro, { useState } from '@tarojs/taro'
import { View, Text, Image, Navigator } from '@tarojs/components'
import jokeImg from '../../assets/images/joke.png'
import phoneCodeImg from '../../assets/images/phone_code.png'
import phoneLocationImg from '../../assets/images/phone_location.png'
import aboutImg from '../../assets/images/about.png'
import './index.scss'

function Index() {
  return (
    <View className='index flex-row flex-wrap font26'>
      <Navigator className='flex-column flex-col-center flex-33per pd-20 bg-white bd-box' url='/pages/jokes/jokes'>
        <Image src={jokeImg} className='w140 h140 mg-b-20' />
        <Text>笑话段子</Text>
      </Navigator>
      <Navigator className='flex-column flex-col-center flex-33per pd-20 bg-white bd-box' url='/pages/phone_location/phone_location'>
        <Image src={phoneLocationImg} className='w140 h140 mg-b-20' />
        <Text>手机号码归属地</Text>
      </Navigator>
      <Navigator className='flex-column flex-col-center flex-33per pd-20 bg-white bd-box' url='/pages/phone_code/phone_code'>
        <Image src={phoneCodeImg} className='w140 h140 mg-b-20' />
        <Text>世界电话区号</Text>
      </Navigator>
      <Navigator className='flex-column flex-col-center flex-33per pd-20 bg-white bd-box' url='/pages/about/about'>
        <Image src={aboutImg} className='w140 h140 mg-b-20' />
        <Text>关于</Text>
      </Navigator>
    </View>
  )
}

Index.config = {
  navigationBarTitleText: '小工具S'
};

export default Index;
