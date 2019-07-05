import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './about.scss'

function About() {
  return (
    <View className='about flex-column'>
      <View className='pd-20'>郑重申明：</View>
      <Text className='pd-20'>本小程序使用开放api（来源于github：RollToolsApi），不做任何商业用途，仅供交流学习，如有恶意使用者，承担一切后果。</Text>
    </View>
  )
}

About.config = {
  navigationBarTitleText: '关于'
};

export default About;
