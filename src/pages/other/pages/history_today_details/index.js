import Taro, {useEffect, useRouter, useShareAppMessage, useState} from '@tarojs/taro'
import {View, Text, Image} from '@tarojs/components'
import './index.scss'
import moment from "moment";
import {getHistoryToday} from "../../../../apis/calendar";
import {useAsyncEffect} from "../../../../utils";

function HistoryTodayDetails() {
  const router = useRouter();
  const [historyToday, setHistoryToday] = useState(null);
  const [number, setNumber] = useState(0);
  const [color, setColor] = useState('');

  // 设置color
  useEffect(() => {
    const {color} = router.params;
    setColor(color);
    Taro.setNavigationBarColor({frontColor: '#ffffff', backgroundColor: color});
  }, []);

  // 初始化数据
  useAsyncEffect(async () => {
    const {number} = router.params;
    setNumber(number);
    const HISTORY_TODAY_DATE = Taro.getStorageSync('HISTORY_TODAY_DATE');  //缓存日期
    if (moment().format('YYYY-MM-DD') === HISTORY_TODAY_DATE) {
      const HISTORY_TODAY = Taro.getStorageSync('HISTORY_TODAY');
      setHistoryToday(HISTORY_TODAY[Number(number)]);
    } else {
      const res = await getHistoryToday({type: 1});
      setHistoryToday(res[Number(number)]);
      Taro.setStorageSync('HISTORY_TODAY', res);
      Taro.setStorageSync('HISTORY_TODAY_DATE', moment().format('YYYY-MM-DD'));
    }
  }, []);

  // 设置nav title
  useEffect(() => {
    if (historyToday) {
      Taro.setNavigationBarTitle({title: historyToday.title});
    }
  }, [historyToday]);

  // 显示转发按钮
  useEffect(() => {
    Taro.showShareMenu({
      withShareTicket: true
    });
  }, []);

  // 转发
  useShareAppMessage(res => {
    return {
      title: historyToday.title,
      path: `/pages/other/pages/history_today_details/index?color=${color}&number=${number}&from=SHARE`,
    }
  });

  return (
    <View className='history-today-details'>
      {historyToday && <View className='pd-20 bd-box'>
        <View className='font36 bold black mg-b-20'>{historyToday.year}-{historyToday.month}-{historyToday.day}：{historyToday.title}</View>
        {historyToday.picUrl && <Image className='w100-per mg-b-20' mode='aspectFit' src={historyToday.picUrl} />}
        <Text className='font32 lh-50'>{historyToday.details}</Text>
      </View>}
    </View>
  )
}

HistoryTodayDetails.config = {
  navigationBarTitleText: ''
};

export default HistoryTodayDetails;
