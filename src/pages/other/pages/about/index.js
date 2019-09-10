import Taro, {useEffect, useState} from '@tarojs/taro'
import {View, Text} from '@tarojs/components'
import { useSelector } from '@tarojs/redux'
import _updateLog from '../../assets/json/update_log.json'
import './index.scss'

function About() {
  const pConfig = useSelector(state => state.pConfig);
  const {news, girls} = pConfig.config;
  const [color, setColor] = useState('');

  // 设置color
  useEffect(() => {
    const {color} = this.$router.params;
    setColor(color);
    Taro.setNavigationBarColor({frontColor: '#ffffff', backgroundColor: color});
  }, []);

  const [updateLog, setUpdateLog] = useState([]);

  useEffect(() => {
    setUpdateLog(_updateLog);
  }, []);

  return (
    <View className='about h100-per'>
      <View className='flex-column'>
        <Text className='pd-20 black bold'>郑重申明：</Text>
        <Text className='pd-20'>1. 本小程序使用开放api（来源于github：RollToolsApi），仅供交流学习，如有恶意使用者，承担一切后果；如有侵权请联系删除。</Text>
        <Text className='pd-20'>2. 本小程序使用Taro编写（主要使用react hooks），源码已经上传github：https://github.com/RobocopMao/s-tools.git。再次郑重申明，请勿非法使用。如果您喜欢，可以给个好评哦！</Text>
        <Text className='pd-20'>3. 本小程序开发测试使用机型为小米5，不能保证所有机型都适配。</Text>

        <Text className='pd-20 black bold'>常见问题说明与解决：</Text>
        <Text className='pd-20'>1. 万能方法：如果使用有什么问题，请在微信-发现-小程序里面删除小程序后再添加小程序。如果还不能解决，可以在首页直接联系作者客服
          （目前官方客服小程序有bug，用户收不到客服回复的消息，在未修复之前我可能不能及时联系你）或去反馈里面反馈问题。</Text>
        <Text className='pd-20'>2. 快递查询：由于顺丰对用户数据安全比较重视，目前顺丰快递不能查询。</Text>

        <Text className='pd-20 black bold'>使用方法与说明：</Text>
        <Text className='pd-20'>1. 万年历：可以查看从本月起一年的日历，日历可以竖向滚动，下一年的日历信息需要等待接口更新。</Text>
        {news && girls && <Text className='pd-20'>2. 其他：由于小程序限制，在小程序审核期间，新闻Lite、新闻里的视频、养眼福利图、ip查询将隐藏，届时你将不能访问它们，待审核通过发布后方可正常访问。</Text>}
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
                        <Text className='mg-b-10' key={_index}>{_index + 1}. {_log}。</Text>
                      )
                    })}
                  </View>
                </View>
              </View>
            )
          })}
        </View>
      </View>
    </View>
  )
}

About.config = {
  navigationBarTitleText: '关于与问题'
};

export default About;
