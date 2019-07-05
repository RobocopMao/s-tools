import Taro, { Component } from '@tarojs/taro'
import '@tarojs/async-await'
import Index from './pages/index'
import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {

  config = {
    pages: [
      'pages/index/index',
      'pages/jokes/jokes',
      'pages/phone_location/phone_location',
      'pages/phone_code/phone_code',
      'pages/weather/weather',
      'pages/about/about'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#4481EB',
      navigationBarTitleText: '小工具S',
      navigationBarTextStyle: 'white'
    },
    permission: {
      'scope.userLocation': {
        'desc': "你的位置信息将用于小程序查询天气"
      }
    }
  }

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
