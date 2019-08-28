import Taro, {useEffect, useState} from '@tarojs/taro'
import {View, Text, ScrollView} from '@tarojs/components'
import _updateLog from '../../../../apis/update_log.json'
import './index.scss'
import {useAsyncEffect} from '../../../../utils'
import {getProductList, getRemoteConfig, user_id} from '../../../../apis/config'

function Index() {
  const [productConfig, setProductConfig] = useState({});
  const [color, setColor] = useState('');

  // 设置color
  useEffect(() => {
    const {color} = this.$router.params;
    setColor(color);
    Taro.setNavigationBarColor({frontColor: '#ffffff', backgroundColor: color});
  }, []);

  useAsyncEffect(async () => {
    let res = await getProductList({user_id});
    const {secret, productId} = res.find((v, i, arr) => {
      return Number(v.productId) === 50005;  // 50005是该小程序的productId
    });
    let res1 = await getRemoteConfig({user_id, secret, product_id: productId});
    const productConfig = JSON.parse(res1.productConfig);
    // console.log(productConfig);
    setProductConfig(productConfig);
  }, []);

  const [updateLog, setUpdateLog] = useState([]);

  useEffect(() => {
    setUpdateLog(_updateLog);
  }, []);

  const [scrollHeight, setScrollHeight] = useState(0); // 可使用窗口高度

  useEffect(() => {
    Taro.getSystemInfo({
      success: res => {
        setScrollHeight(res.windowHeight);
      }
    })
      .then(res => {})
  }, [scrollHeight]);

  // const getUserInfo = e => {
  //   console.log(e);
  // };

  return (
    <ScrollView
      className='about'
      scrollY
      scrollWithAnimation
      style={{height: `${scrollHeight}px`}}
    >
      <View className='flex-column'>
        <Text className='pd-20 black bold'>郑重申明：</Text>
        <Text className='pd-20'>1.本小程序使用开放api（来源于github：RollToolsApi），仅供交流学习，如有恶意使用者，承担一切后果；如有侵权请联系删除。</Text>
        <Text className='pd-20'>2.本小程序使用Taro编写（主要使用react hooks），源码已经上传github：https://github.com/RobocopMao/s-tools.git。再次郑重申明，请勿非法使用。如果您喜欢，可以给个好评哦！</Text>
        <Text className='pd-20'>3.本小程序开发测试使用机型为小米5，不能保证所有机型都适配。</Text>

        <Text className='pd-20 black bold'>常见问题说明与解决：</Text>
        <Text className='pd-20'>1.万能方法：升级小程序后导致权限获取失败，请在微信-发现-小程序里面删除小程序后再添加小程序。</Text>
        <Text className='pd-20'>2.快递查询：目前发现顺丰快递不能查询，是RollToolsApi接口问题，只能待其作者修复。</Text>

        <Text className='pd-20 black bold'>使用方法与说明：</Text>
        <Text className='pd-20'>1.万年历：可以查看从本月起一年的日历，日历可以竖向滚动，下一年的日历信息需要等待接口更新。</Text>
        {productConfig.news && productConfig.girls && <Text className='pd-20'>2.其他：由于小程序限制，在小程序审核期间，新闻Lite和养眼福利图将隐藏，届时你将不能访问它们，待审核通过发布后方可正常访问。</Text>}
        <Text className='pd-20 black bold'>更新日志：</Text>
        <View className='pd-20 flex-column mg-b-20'>
          {updateLog.map((log, index) => {
            const {date, event, logs} = log;
            return (
              <View className='flex-column pd-b-20 pd-l-20 update-log' key={date}>
                <Text className='mg-b-10' style={{color}}>{date}</Text>
                {event && <Text className='mg-b-10 yellow'>事件：{event}</Text>}
                <View className='flex-row'>
                  <View className='flex-25per'>
                    <Text>更新日志：</Text>
                  </View>
                  <View className='flex-column flex-75per'>
                    {logs.map((_log, _index) => {
                      return (
                        <Text className='mg-b-10' key={_index}>{_index + 1}.{_log}。</Text>
                      )
                    })}
                  </View>
                </View>
              </View>
            )
          })}
        </View>
        <Text className='pd-20 black bold'>作者联系方式：</Text>
        <Text className='pd-20'>邮箱：410503915@qq.com</Text>
      </View>
    </ScrollView>
  )
}

Index.config = {
  navigationBarTitleText: '关于与问题'
};

export default Index;