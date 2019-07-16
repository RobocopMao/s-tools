import Taro from '@tarojs/taro'
import { View, Text, Image, Navigator } from '@tarojs/components'
import newsImg from '../../assets/images/news.png'
import jokeImg from '../../assets/images/joke.png'
import phoneCodeImg from '../../assets/images/phone_code.png'
import phoneLocationImg from '../../assets/images/phone_location.png'
import weatherImg from '../../assets/images/weather.png'
import aboutImg from '../../assets/images/about.png'
import calculatorImg from '../../assets/images/calculator.png'
import ipImg from '../../assets/images/ip.png'
import calendarImg from '../../assets/images/calendar.png'
import garbageImg from '../../assets/images/garbage.png'
import girlsImg from '../../assets/images/girl.png'
import './index.scss'

function Index() {
  return (
    <View className='index flex-row flex-wrap font26'>
      <Navigator className='flex-column flex-col-center flex-33per pd-20 bg-white bd-box' url='/pages/news/news'>
        <Image src={newsImg} className='w140 h140 mg-b-20' />
        <Text>新闻Lite</Text>
      </Navigator>
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
      <Navigator className='flex-column flex-col-center flex-33per pd-20 bg-white bd-box' url='/pages/weather/weather'>
        <Image src={weatherImg} className='w140 h140 mg-b-20' />
        <Text>天气预报</Text>
      </Navigator>
      <Navigator className='flex-column flex-col-center flex-33per pd-20 bg-white bd-box' url='/pages/calculator/calculator'>
        <Image src={calculatorImg} className='w140 h140 mg-b-20' />
        <Text>简易计算器</Text>
      </Navigator>
      <Navigator className='flex-column flex-col-center flex-33per pd-20 bg-white bd-box' url='/pages/ip_search/ip_search'>
        <Image src={ipImg} className='w140 h140 mg-b-20' />
        <Text>IP查询</Text>
      </Navigator>
      <Navigator className='flex-column flex-col-center flex-33per pd-20 bg-white bd-box' url='/pages/calendar/calendar'>
        <Image src={calendarImg} className='w140 h140 mg-b-20' />
        <Text>万年历</Text>
      </Navigator>
      <Navigator className='flex-column flex-col-center flex-33per pd-20 bg-white bd-box' url='/pages/trash_sort/trash_sort'>
        <Image src={garbageImg} className='w140 h140 mg-b-20' />
        <Text>垃圾分类</Text>
      </Navigator>
      {/*<Navigator className='flex-column flex-col-center flex-33per pd-20 bg-white bd-box' url='/pages/girls/girls'>*/}
        {/*<Image src={girlsImg} className='w140 h140 mg-b-20' />*/}
        {/*<Text>养眼福利图</Text>*/}
      {/*</Navigator>*/}
      <Navigator className='flex-column flex-col-center flex-33per pd-20 bg-white bd-box' url='/pages/about/about'>
        <Image src={aboutImg} className='w140 h140 mg-b-20' />
        <Text>关于与问题</Text>
      </Navigator>
    </View>
  )
}

Index.config = {
  navigationBarTitleText: '小工具S'
};

export default Index;
