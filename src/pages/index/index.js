import Taro, {useState} from '@tarojs/taro'
import { View, Text, Image, Navigator } from '@tarojs/components'
import { getRemoteConfig, getProductList, user_id, S_WEATHER_APPID} from '../../apis/config';
import { useAsyncEffect } from '../../utils';
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
import expressImg from '../../assets/images/express.png'
import './index.scss'

function Index() {
  const [productConfig, setProductConfig] = useState({});

  useAsyncEffect(async () => {
    let res = await getProductList({user_id});
    const {secret, productId} = res[0];
    let res1 = await getRemoteConfig({user_id, secret, product_id: productId});
    const productConfig = JSON.parse(res1.productConfig);
    // console.log(productConfig);
    setProductConfig(productConfig);
  }, []);

  // 去天气情报小程序
  const goSWeatherMiniProgram = () => {
    Taro.navigateToMiniProgram({appId: S_WEATHER_APPID});
  };

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
      <View className='flex-column flex-col-center flex-33per pd-20 bg-white bd-box' onClick={() => goSWeatherMiniProgram()}>
        <Image src={weatherImg} className='w140 h140 mg-b-20' />
        <Text>天气预报</Text>
      </View>
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
      <Navigator className='flex-column flex-col-center flex-33per pd-20 bg-white bd-box' url='/pages/express_note/express_note'>
        <Image src={expressImg} className='w140 h140 mg-b-20' />
        <Text>快递查询</Text>
      </Navigator>
      {productConfig.news && <Navigator className='flex-column flex-col-center flex-33per pd-20 bg-white bd-box' url='/pages/news/news'>
        <Image src={newsImg} className='w140 h140 mg-b-20' />
        <Text>新闻Lite</Text>
      </Navigator>}
      {productConfig.girls && <Navigator className='flex-column flex-col-center flex-33per pd-20 bg-white bd-box' url='/pages/girls/girls'>
        <Image src={girlsImg} className='w140 h140 mg-b-20' />
        <Text>养眼福利图</Text>
      </Navigator>}
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
