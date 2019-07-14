import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './about.scss'

function About() {
  return (
    <View className='about flex-column'>
      <Text className='pd-20 black'>郑重申明：</Text>
      <Text className='pd-20'>1.本小程序使用开放api（来源于github：RollToolsApi），仅供交流学习，如有恶意使用者，承担一切后果；如有侵权请联系删除。</Text>
      <Text className='pd-20'>2.本小程序使用Taro编写（主要使用react hooks），源码已经上传github：https://github.com/RobocopMao/s-tools.git。再次郑重申明，请勿非法使用。如果您喜欢，可以给个好评哦！</Text>
      <Text className='pd-20'>3.本小程序开发测试使用机型为小米5，不能保证所有机型都适配。</Text>
      <Text className='pd-20 black'>常见问题解决：</Text>
      <Text className='pd-20'>1.查询天气需要获取用户位置信息，请确保微信和小程序有使用定位的权限。</Text>
      <Text className='pd-20'>2.万能方法：升级小程序后导致权限获取失败，请在微信-发现-小程序里面删除小程序后再添加小程序。</Text>
      <Text className='pd-20 black'>使用方法：</Text>
      <Text className='pd-20'>1.养眼福利图：可以在预览界面长按后转发、保存、收藏。</Text>
    </View>
  )
}

About.config = {
  navigationBarTitleText: '关于与问题'
};

export default About;
