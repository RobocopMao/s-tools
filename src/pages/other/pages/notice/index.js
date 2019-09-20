import Taro, {useEffect, useRouter, useState} from '@tarojs/taro'
import {View, Text} from '@tarojs/components'
import moment from 'moment'
// import { useSelector } from '@tarojs/redux'
import './index.scss'

function Notice() {
  // const pConfig = useSelector(state => state.pConfig);
  // const {notice, noticeTime} = pConfig.config;
  const router = useRouter();
  const [notice, setNotice] = useState(null);
  const [showNotice, setShowNotice] = useState(true);
  const [color, setColor] = useState('');

  // 设置color
  useEffect(() => {
    const {color} = router.params;
    setColor(color);
    Taro.setNavigationBarColor({frontColor: '#ffffff', backgroundColor: color});
  }, []);

  useEffect(() => {
    return () => {
      const eventChannel = this.$scope.getOpenerEventChannel();
      eventChannel.emit('acceptDataFromNotice', {read: true});  // 触发事件
    };
  }, []);

  // 通知大于7天不显示了
  useEffect(() => {
    const NOTICE = Taro.getStorageSync('NOTICE');
    const {time} = NOTICE;
    const _showNotice = moment(time).add(7, "days") > moment();
    setShowNotice(_showNotice);
    setNotice(NOTICE);
  }, []);

  return (
    <View className='notice pd-l-20 pd-r-20 h100-per'>
      {/*有通知*/}
      {notice && (showNotice || !notice.read) && notice.notice.length && <View className='mg-t-20 mg-b-20'>
        <View>通知发布于：{notice.time}</View>
        <View className='line mg-t-20 mg-b-20' />
        <RichText className='font32' nodes={notice.notice} />
      </View>}
      {/*无通知*/}
      {!(notice && (showNotice || !notice.read) && notice.notice.length) && <View className='h100-per flex-column flex-col-center flex-row-center color9'>
        <View className='iconfont font100 mg-b-20'>&#xe657;</View>
        <View>最近7天暂无通知</View>
      </View>}
    </View>
  )
}

Notice.config = {
  navigationBarTitleText: '通知'
};

export default Notice;
