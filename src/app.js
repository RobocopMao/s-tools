import Taro, { Component } from '@tarojs/taro'
import '@tarojs/async-await'
import { Provider, connect } from '@tarojs/redux'
import moment from 'moment'
import Index from './pages/home/index'
import configStore from './redux/store'
import {setPConfigAsync} from './redux/p_config/action'
import {setSystemInfoAsync} from './redux/user/action'
import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

// 自定义星期
moment.updateLocale('en', {
  weekdays : [
    '周日', '周一', '周二', '周三', '周四', '周五', '周六'
  ]
});

const store = configStore();

@connect(({ config, pId, secret }) => ({
  config, pId, secret
}), (dispatch) => ({
  setPConfigAsync () {
    dispatch(setPConfigAsync())
  },
  setSystemInfoAsync() {
    dispatch(setSystemInfoAsync())
  }
}))
class App extends Component {

  config = {
    pages: [
      'pages/home/index/index'
    ],
    subpackages: [  // 分包配置
      {
        root: 'pages/search/',
        name: 'search',  // 查询
        pages: [
          'pages/phone_location/index',
          'pages/phone_code/index',
          'pages/ip_search/index',
          'pages/trash_sort/index',
          'pages/express/index',
          'pages/express_note/index'
        ],
      },
      {
        root: 'pages/tools/',
        name: 'tools',  // 工具
        pages: [
          'pages/calendar/index',
          'pages/calculator/index',
          'pages/char_recognition/index',
          'pages/obj_recognition/index',
          'pages/bmi/index'
        ],
      },
      {
        root: 'pages/other/',
        name: 'other',  // 其他
        pages: [
          'pages/jokes/index',
          'pages/about/index',
          'pages/news/index',
          'pages/news_details/index',
          'pages/girls/index',
          'pages/video/index',
        ],
      }
    ],
    preloadRule: {
      'pages/home/index/index': {
        network: 'wifi',
        packages: ['search', 'tools']
      }
    },
    networkTimeout: {
      request: 10000,
      connectSocket: 10000,
      uploadFile: 10000,
      downloadFile: 10000
    },
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#4481EB',
      navigationBarTitleText: '小工具S',
      navigationBarTextStyle: 'white'
    },
    navigateToMiniProgramAppIdList: ['wx892bebdc63488ab2'],
    permission: {
      'scope.userLocation': {
        'desc': '你的位置信息将用于小程序查询天气'
      }
    }
  };

  async componentWillMount() {
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
    this.props.setPConfigAsync();  // 获取项目配置
    this.props.setSystemInfoAsync();  // 获取系统信息
  }

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
