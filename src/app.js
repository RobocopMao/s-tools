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
      'pages/calculator/calculator',
      'pages/about/about',
      'pages/ip_search/ip_search',
      'pages/calendar/calendar',
      'pages/news/news',
      'pages/news_details/news_details',
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
  };

  componentWillMount() {
    const updateManager = Taro.getUpdateManager();
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      //   console.log(res.hasUpdate)
    });
    updateManager.onUpdateReady(function () {
      Taro.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate();
          }
        }
      })

    });
    updateManager.onUpdateFailed(function () {
      Taro.showToast({
        title: '有新的版本存在,但下载失败,请将小程序从列表中删除再重新搜索该小程序进入',
        icon: 'loading'
      })
    });
  }

  componentDidMount () {
    // 显示转发按钮
    Taro.showShareMenu({
      withShareTicket: true
    });
  }

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
