import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './about.scss'

function About() {
  return (
    <View className='about flex-column'>
      <Text className='pd-20'>郑重申明：</Text>
      <Text className='pd-20'>本小程序使用开放api（来源于github：RollToolsApi），仅供交流学习，如有恶意使用者，承担一切后果。</Text>
      <Text className='pd-20'>本小程序使用Taro编写（主要使用react hooks），源码已经上传github：https://github.com/RobocopMao/s-tools.git。再次郑重申明，请勿非法使用。如果您喜欢，可以给个好评哦！</Text>
      <Text className='pd-20'>本小程序开发测试使用机型为小米5，不能保证所有机型都适配。</Text>
    </View>
  )
}

About.config = {
  navigationBarTitleText: '关于'
};

export default About;
