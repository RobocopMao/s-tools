import Request from './request';

const request = new Request();

// 获取特定城市今天及未来天气
export const getWeatherForecast = async (data) => {
  return await request.get({
    url: '/weather/forecast/' + data.city,
    data: null,
  });
};

// 获取特定城市今日天气
export const getWeatherCurrent = async (data) => {
  return await request.get({
    url: '/weather/current/' + data.city,
    data: null,
  });
};
