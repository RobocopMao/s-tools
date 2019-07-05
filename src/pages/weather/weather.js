import Taro, { useState } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { getWeatherForecast, getWeatherCurrent } from '../../apis/weather'
import './weather.scss'
import { useAsyncEffect } from '../../utils'
const QQMapWX = require('../../utils/qqmap-wx-jssdk');

function Weather() {
  const qqmapsdk = new QQMapWX({key: 'WATBZ-IBNR4-4VHU2-D2LSO-PBQBQ-G3BKJ'});
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [forecasts, setForecasts] = useState([]);
  const [weatherCurrent, setWeatherCurrent] = useState({});

  useAsyncEffect(() => {
    Taro.getLocation({
      success: res => {
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: async (_res) => {
            // console.log(JSON.stringify(res));
            let _city = _res.result.address_component.city;
            let _province = _res.result.address_component.province;
            setCity(_city);
            setProvince(_province);

            if (city === '') {
              return;
            }

            let result = await getWeatherForecast({city});
            setForecasts(result.forecasts);

            let result1 = await getWeatherCurrent({city});
            setWeatherCurrent(result1);
          },
          fail: _res => {
            // console.log(_res);
          },
          complete: _res => {
            // console.log(res);
          }
        });
      }
    })
      .then(res => {});
  }, [city, province]);

  return (
    <View className='weather flex-column'>
      <View className='pd-20 flex-column'>
        <Text className='font80'>{weatherCurrent.temp}</Text>
        <Text className='mg-b-10'>{weatherCurrent.weather} </Text>
        <Text className='mg-b-10'>风向：{weatherCurrent.windDirection}风 / 风力：{weatherCurrent.windPower}</Text>
        <Text className='mg-b-10'>相对湿度：{weatherCurrent.humidity}</Text>
        <Text className='mg-b-10'>当前位置：{province} {city}</Text>
        <Text>更新时间：{weatherCurrent.reportTime}</Text>
      </View>
      <View className='bd-radius bg-blue white pd-l-30 pd-r-30 mg-20 bd-box'>
        {forecasts.map((forecast, index) => {
          return (
              <View className='flex-row space-between bd-b-1 pd-t-24 pd-b-24 last-no-bd' key={forecast.date}>
                {index === 0 && <Text>今天 · {forecast.dayWeather}{forecast.dayWeather !== forecast.nightWeather ? `转${forecast.nightWeather}` : ''}</Text>}
                {index === 1 && <Text>明天 · {forecast.dayWeather}{forecast.dayWeather !== forecast.nightWeather ? `转${forecast.nightWeather}` : ''}</Text>}
                {index === 2 && <Text>后天 · {forecast.dayWeather}{forecast.dayWeather !== forecast.nightWeather ? `转${forecast.nightWeather}` : ''}</Text>}
                {index > 2 && <Text>{forecast.date.slice(5)} · {forecast.dayWeather}{forecast.dayWeather !== forecast.nightWeather ? `转${forecast.nightWeather}` : ''}</Text>}
                <Text>{forecast.dayTemp.replace(/℃/, '')}/{forecast.nightTemp}</Text>
              </View>
            )
        })}
      </View>
    </View>
  )
}

Weather.config = {
  navigationBarTitleText: '天气预报'
};

export default Weather;
