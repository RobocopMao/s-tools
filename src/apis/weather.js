import Request from './request';

const request = new Request();

export const getWeatherForecast = async (data) => {
  return await request.get({
    url: '/weather/forecast/' + data.city,
    data: null,
  });
};
