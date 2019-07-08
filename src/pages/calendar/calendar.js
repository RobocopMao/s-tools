import Taro, { useState } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import moment from 'moment'
import { useAsyncEffect } from '../../utils'
import { getHolidaySingle } from '../../apis/calendar';
import './calendar.scss'

moment.locale('en', {
  weekdays : [
    '周日', '周一', '周二', '周三', '周四', '周五', '周六'
  ]
});

function Calendar() {
  const [dateInfo, setDateInfo] = useState({});

  useAsyncEffect(async () => {
    const date = moment().format('YYYYMMDD');
    const res = await getHolidaySingle({date});
    setDateInfo(res);
  }, []);

  return (
    <View className='calendar'>
      <View className='flex-column mg-20'>
        <View className='flex-row flex-col-center mg-b-10'>
          <View className='font80 mg-r-20 blue'>{moment(dateInfo.date).format('M')}月{moment(dateInfo.date).format('D')}日</View>
          <View className='flex-column'>
            <Text>{moment(dateInfo.date).format('dddd')} · <Text className='yellow'>{dateInfo.typeDes}</Text></Text>
            <Text>{moment(dateInfo.date).format('YYYY')}年</Text>
          </View>
        </View>
        <View className='mg-b-20'>这是今年第 <Text className='black'>{dateInfo.dayOfYear}</Text> 天，第 <Text className='black'>{dateInfo.weekOfYear}</Text> 周</View>
        <View className='pd-t-20 bd-t-1 black font32'>农历{dateInfo.yearTips}{dateInfo.chineseZodiac}年 {dateInfo.lunarCalendar} {dateInfo.solarTerms}</View>
        <View className='mg-t-10 mg-b-10'>
          <Text className='green'>宜：</Text>
          <Text>{dateInfo.suit}</Text>
        </View>
        <View className='mg-b-20'>
          <Text className='orange'>忌：</Text>
          <Text>{dateInfo.avoid}</Text>
        </View>
        <View className='pd-t-20 bd-t-1'>星座：{dateInfo.constellation}</View>
      </View>
    </View>
  )
}

Calendar.config = {
  navigationBarTitleText: '今日万年历'
};

export default Calendar;
