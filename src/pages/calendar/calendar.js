import Taro, {useEffect, useState} from '@tarojs/taro'
import { View, Text, Swiper, SwiperItem } from '@tarojs/components'
import moment from 'moment'
import { useAsyncEffect } from '../../utils'
import { getHolidaySingle } from '../../apis/calendar';
import './calendar.scss'

// 自定义星期
moment.updateLocale('en', {
  weekdays : [
    '周日', '周一', '周二', '周三', '周四', '周五', '周六'
  ]
});

function Calendar() {
  const [day, setDay] = useState(Number(moment().format('D')));  // 选中的日期
  const [week, setWeek] = useState(moment().format('dddd'));  // 选中的星期
  const [month, setMonth] = useState(Number(moment().format('M'))); // 选中日期月份
  const [year, setYear] = useState(Number(moment().format('YYYY')));  // 选中日期的年份
  const [date, setDate] = useState(moment().format('YYYYMMDD'));  // 请求日期格式
  const [dateInfo, setDateInfo] = useState({}); // 请求回来的数据
  const [calendarData, setCalendarData] = useState([]);
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollType, setScrollType] = useState('TOUCH');

  useAsyncEffect(async () => {
    // const date = moment().format('YYYYMMDD');
    const res = await getHolidaySingle({date});
    setDateInfo(res);
  }, [date]);

  useEffect(() => {
    // 初始化一年数据
    let today = moment().format('YYYY-MM-DD');
    let month = Number(moment().format('M'));
    let year = Number(moment().format('YYYY'));
    let dates = [today];
    for (let i = 1; i < 12; i++) {
      let date = '';
      if (month + i <= 12) {
        date = `${year}-${month + i < 10 ? '0' + String(month + i) : String(month + i)}-01`
      } else {
        date = `${year + 1}-${'0' + String(month + i - 12)}-01`
      }
      dates.push(date);
    }

    let days = [];
    for (let [i, v] of dates.entries()) {
      let _days = getMonthDate(v);
      days.push(_days);
    }
    setCalendarData(days);

  }, []);

  const getMonthDate = (date) => {
    let startDate = moment(date).startOf('month').format('YYYY-MM-DD');  // 本月第一天
    let endDate = moment(date).endOf('month').format('YYYY-MM-DD'); // 本月最后一天
    let prevMonthEndDate = moment(startDate).subtract(1, 'day').format('YYYY-MM-DD');  // 上月最后一天
    let nextMonthStartDate = moment(endDate).add(1, 'day').format('YYYY-MM-DD'); // 下月第一天

    // 本月
    let endDateDay = Number(moment(endDate).format('D'));  // 最后一天
    let endDateMonth = Number(moment(endDate).format('M'));  // 本月月份
    let endDateYear = Number(moment(endDate).format('YYYY'));  // 本月年份
    let today = Number(moment().format('DD'));
    let days = [];
    // 当月
    for (let i = 0; i < endDateDay; i++) {
      let obj = {};
      obj._day = i + 1;
      obj._month = endDateMonth;
      obj._year = endDateYear;
      obj.color = today === i + 1 && date === moment().format('YYYY-MM-DD') ? 'white' : 'black';
      obj.bgColor = today === i + 1 && date === moment().format('YYYY-MM-DD') ? 'bg-blue' : 'bg-no';
      obj.type = 'CURRENT';
      days.push(obj);
    }

    // 上月
    let startDateWeek = Number(moment(startDate).format('d'));
    let prevMonthEndDateDay = Number(moment(prevMonthEndDate).format('DD'));
    for (let i = 0; i < startDateWeek; i++) {
      if (startDateWeek === 0) {
        break;
      }

      let obj = {};
      obj._day = prevMonthEndDateDay - i;
      obj._month = endDateMonth === 1 ? 12 : endDateMonth - 1;
      obj._year = endDateMonth === 1 ? endDateYear - 1 : endDateYear;
      obj.color = 'color-c';
      obj.type = 'PREV';
      days.unshift(obj);
    }

    // 下月
    let endDateWeek = Number(moment(endDate).format('d'));
    // let nextMonthEndDateDay = Number(moment(nextMonthStartDate).format('DD'));
    for (let i = 0; i < 6 - endDateWeek; i++) {
      let obj = {};
      obj._day = i + 1;
      obj._month = endDateMonth === 12 ? 1 : endDateMonth + 1;
      obj._year = endDateMonth === 12 ? endDateYear + 1 : endDateYear;
      obj.color = 'color-c';
      obj.type = 'NEXT';
      days.push(obj);
    }

    return days;
  };

  const onClickDay = (day, index) => {
    const {_day, _month, _year, type} = day;
    if (type === 'CURRENT') {
      setYear(_year);
      setMonth(_month);
      setDay(_day);
      let date = `${_year}-${_month < 10 ? '0' + String(_month) : String(_month)}-${_day < 10 ? '0' + String(_day) : String(_day)}`;
      setDate(moment(date).format('YYYYMMDD'));
      setWeek(moment(date).format('dddd'));
    }
  };

  // 整体滚动
  const onScroll = e => {
    // if (scrollType === 'CLICK') {
    //   return;
    // }
    // console.log(e);
    const {scrollTop, deltaY, scrollHeight} = e.detail;
    let _scrollTop = 0;
    let date = `${year}-${month < 10 ? '0' + String(month) : String(month)}-${day < 10 ? '0' + String(day) : String(day)}`;
    if (deltaY >= 0) { // 往下滑
      _scrollTop = Math.floor(scrollTop / 240) * 240;
      if (scrollTop % 240 === 0) {
        let _date = moment(date).subtract(1, 'month').format('YYYY-MM-DD');
        let _day = Number(moment(_date).format('D'));
        let _month = Number(moment(_date).format('M'));
        let _year = Number(moment(_date).format('YYYY'));
        setDay(_day);
        setMonth(_month);
        setYear(_year);

        let __date = `${_year}-${_month < 10 ? '0' + String(_month) : String(_month)}-${_day < 10 ? '0' + String(_day) : String(_day)}`;
        setDate(moment(__date).format('YYYYMMDD'));
        setWeek(moment(__date).format('dddd'));
      }
    } else { // 往上滑
      _scrollTop = Math.ceil(scrollTop / 240) * 240;
      if (scrollTop % 240 === 0) {
        let _date = moment(date).add(1, 'month').format('YYYY-MM-DD');
        let _day = Number(moment(_date).format('D'));
        let _month = Number(moment(_date).format('M'));
        let _year = Number(moment(_date).format('YYYY'));
        setDay(_day);
        setMonth(_month);
        setYear(_year);

        let __date = `${_year}-${_month < 10 ? '0' + String(_month) : String(_month)}-${_day < 10 ? '0' + String(_day) : String(_day)}`;
        setDate(moment(__date).format('YYYYMMDD'));
        setWeek(moment(__date).format('dddd'));
      }
    }
    setScrollTop(_scrollTop);
  };

  const goToday = () => {
    let _day = Number(moment().format('D'));
    let _month = Number(moment().format('M'));
    let _year = Number(moment().format('YYYY'));
    let _week = moment().format('dddd');
    let _date = moment().format('YYYYMMDD');
    if (scrollTop === 0) {
      setMonth(_month);
    } else {
      setScrollTop(0);
      setMonth(_month + 1);
    }
    setDay(_day);
    setYear(_year);
    setWeek(_week);
    setDate(_date);
  };

  return (
    <View className='calendar'>
      <View className='flex-column mg-20'>
        <View className='flex-row flex-col-center space-between mg-b-10'>
          <View className='flex-row flex-col-center'>
            <View className='font80 mg-r-20 blue'>{month}月</View>
            <View className='flex-column'>
              <Text>{week}{year <= Number(moment().format('YYYY')) && <Text><Text> · </Text><Text className='yellow'>{dateInfo.typeDes}</Text></Text>}</Text>
              <Text>{year}年</Text>
            </View>
          </View>
          {moment(date).format('YYYY-MM-DD') !== moment().format('YYYY-MM-DD') && <View className='circle white bg-blue text-center w80 h80' onClick={() => goToday()}>
            <Text className='lh-80'>今</Text>
          </View>}
        </View>
        {year <= Number(moment().format('YYYY')) && <View className='mg-b-20'>这是今年第 <Text className='black'>{dateInfo.dayOfYear}</Text> 天，第 <Text className='black'>{dateInfo.weekOfYear}</Text> 周</View>}
        <View className='line' />
        <View className='flex-column'>
          <View className='flex-row space-around pd-t-20 pd-b-20'>
            <Text>日</Text>
            <Text>一</Text>
            <Text>二</Text>
            <Text>三</Text>
            <Text>四</Text>
            <Text>五</Text>
            <Text>六</Text>
          </View>
          <View className='line' />
          <ScrollView
            className=''
            scrollY
            enableFlex
            style={{height: '240px'}}
            scrollWithAnimation
            scrollTop={scrollTop + 'px'}
            onScroll={(e) => onScroll(e)}
          >
            {calendarData.map((months, index) => {
              return (
                <View className='flex-row flex-wrap space-around' style={{height: '240px'}} key={String(index)}>
                  {months.map((days, index1) => {
                    return (
                      <View className='flex-row space-around flex-col-center pd-t-10 pd-b-10 flex-1-7per' key={String(index1)}>
                        <View className={`w60 h60 text-center circle ${days.bgColor} ${days._day === day && days._month === month && days._year === year
                        && days.type === 'CURRENT' && days.bgColor !== 'bg-blue' ? 'bd-1' : ''}`} onClick={() => onClickDay(days, index)}>
                          <Text className={`lh-60 ${days.color}`}>{days._day}</Text>
                        </View>
                      </View>
                    )
                  })}
                </View>
              )
            })}
          </ScrollView>
        </View>
        <View className='line' />
        {year <= Number(moment().format('YYYY')) && <View>
          <View className='pd-t-20 black font32'>农历{dateInfo.yearTips}{dateInfo.chineseZodiac}年 {dateInfo.lunarCalendar} {dateInfo.solarTerms}</View>
          <View className='mg-t-10 mg-b-10'>
            <Text className='green'>宜：</Text>
            <Text>{dateInfo.suit}</Text>
          </View>
          <View className='mg-b-20'>
            <Text className='orange'>忌：</Text>
            <Text>{dateInfo.avoid}</Text>
          </View>
          <View className='line' />
          <View className='pd-t-20'>星座：{dateInfo.constellation}</View>
        </View>}
      </View>
    </View>
  )
}

Calendar.config = {
  navigationBarTitleText: '万年历'
};

export default Calendar;
