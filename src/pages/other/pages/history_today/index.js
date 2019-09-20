import Taro, {useEffect, useRouter, useState} from '@tarojs/taro'
import {View, Text, Image} from '@tarojs/components'
import moment from 'moment'
import './index.scss'

function HistoryToday() {
  const router = useRouter();
  const [historyToday, setHistoryToday] = useState([]);
  const [color, setColor] = useState('');

  // 设置color
  useEffect(() => {
    const {color} = router.params;
    setColor(color);
    Taro.setNavigationBarColor({frontColor: '#ffffff', backgroundColor: color});
  }, []);

  useEffect(() => {
    const HISTORY_TODAY = Taro.getStorageSync('HISTORY_TODAY');
    setHistoryToday(HISTORY_TODAY);
  }, []);

  const goDetails = (index) => {
    Taro.navigateTo({
      url: `/pages/other/pages/history_today_details/index?color=${color}&number=${index}`
    });
  };

  return (
    <View className='history-today'>
      <View className='bold pd-t-20 pd-b-20 pd-l-20 font36' style={{color}}>历史上{moment().format('M月D日都发生了什么')}</View>
      <View>
        <View className='iconfont font100 pd-l-32 bd-box' style={{color}}>&#xe6b8;</View>
        <View className='h100-per pd-l-20 pd-r-20 bd-box item-container' style={{borderLeftColor: color}}>
          {historyToday.map((res, index) => {
            const {year, title, details, picUrl} = res;
            return (
              <View className='flex-row flex-col-center mg-b-40 item' key={String(index)}>
                <View className='bd-radius white pd-t-4 pd-b-4 bd-box text-center year' style={{backgroundColor: color}}>{year}</View>
                <View className='bold text-center h38 lh-38 line-dot' style={{color}}>—— ·</View>
                {picUrl && <View className='relative flex-grow-1 of-hidden bd-radius img-box' onClick={() => goDetails(index)}>
                  <Image mode='widthFix' className='w100-per h100-per' src={picUrl} />
                  <View className='white pd-6 pd-l-10 bd-box item-img-title'>{title}</View>
                </View>}
                {!picUrl && <View className='flex-grow-1 relative text-box' onClick={() => goDetails(index)}>
                  <View className='black font32 mg-b-10'>{title}</View>
                  <Text className='ellipsis'>{details.replace(/^\s*/, '')}</Text>
                </View>}
              </View>
            )
          })}
        </View>
      </View>
    </View>
  )
}

HistoryToday.config = {
  navigationBarTitleText: '历史上的今天'
};

export default HistoryToday;
