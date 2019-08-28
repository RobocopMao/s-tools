import Taro, {useEffect, useState} from '@tarojs/taro'
import { View, Text, Image, Navigator } from '@tarojs/components'
import { getRemoteConfig, getProductList, user_id, S_WEATHER_APPID} from '../../../apis/config';
import {getNodeRect, useAsyncEffect} from '../../../utils';
import bannerImg from '../../../assets/images/banner.jpg'
import './index.scss'

function Index() {
  const [productConfig, setProductConfig] = useState({});
  const [shareNode, setShareNode] = useState({});
  const [shareImgPath, setShareImgPath] = useState('');
  const [itemNode, setItemNode] = useState({});
  const [itemImgPath, setItemImgPath] = useState('');
  const colors = {
    jokes: '#AA00FF',
    phone_code: '#00B8D4',
    calculator: '#00BFA5',
    phone_location: '#FF6D00',
    ip_search: '#4E342E',
    calendar: '#9E9D24',
    trash_sort: '#00C853',
    express_note: '#6200EA',
    news: '#FF5252',
    girls: '#FFB837',
    about: '#000000',
    color_setting: '#000000'
  };

  useAsyncEffect(async () => {
    let res = await getProductList({user_id});
    const {secret, productId} = res[0];
    let res1 = await getRemoteConfig({user_id, secret, product_id: productId});
    const productConfig = JSON.parse(res1.productConfig);
    // console.log(productConfig);
    setProductConfig(productConfig);
  }, []);

  // 获取shareImg宽高
  useEffect(async () => {
    const node = await getNodeRect('#shareImg');
    const {width, height} = node;
    setShareNode({height, width});
  }, []);

  // 获取itemNode宽高
  useEffect(async () => {
    const node = await getNodeRect('#itemLine');
    const {width, height} = node;
    setItemNode({width, height});
  }, []);

  // draw 背景
  useEffect(() => {
    drawShareCanvas();
  }, [shareNode]);

  // draw item line
  useEffect(() => {
    drawItemLine();
  }, [itemNode]);

  // 转发
  useEffect(() => {
    // 显示转发按钮
    Taro.showShareMenu({
      withShareTicket: true
    });

    onShareAppMessage();
  }, [shareImgPath]);

  const onShareAppMessage = () => {
    this.$scope.onShareAppMessage = (res) => {
      return {
        title: '超级好看又耐用的小工具集合',
        path: `/pages/home/index/index`,
        imageUrl: shareImgPath
      }
    };
  };

  // 去天气情报小程序
  const goSWeatherMiniProgram = () => {
    Taro.navigateToMiniProgram({appId: S_WEATHER_APPID});
  };

  const drawShareCanvas = async () => {
    if (JSON.stringify(itemNode) === '{}') { return; }
    const {width, height} = shareNode;

    const ctx = Taro.createCanvasContext('shareImg');
    ctx.drawImage(bannerImg, 128, 0, 487.5, 390, 0, 0, width, height);
    ctx.draw(true, () => {
      shareCanvasToImg();
    });
  };

  const shareCanvasToImg = async () => {
    // const {width, height} = window;
    Taro.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 487.5,
      height: 390,
      // destWidth: width * pixelRatio * 2,
      // destHeight: height * pixelRatio * 2,
      canvasId: 'shareImg',
    }).then(res => {
      // console.log(res);
      // console.log('canvasToImg end');
      setShareImgPath(res.tempFilePath);
    }).catch(err => {
      // console.log('canvasToImg err');
      console.log(err);
    })
  };

  // 初始化bg canvas
  const drawItemLine = () => {
    if (JSON.stringify(itemNode) === '{}') { return; }
    const {width, height} = itemNode;

    const ctx = Taro.createCanvasContext('itemLine');
    ctx.save();
    ctx.beginPath();
    ctx.setGlobalAlpha(0.3);
    ctx.arc(0, 0, 15, 0, Math.PI);
    ctx.setStrokeStyle('#ffffff');
    ctx.stroke();
    ctx.restore();

    ctx.beginPath();
    ctx.setGlobalAlpha(0.3);
    ctx.moveTo(0, height - 5);
    ctx.bezierCurveTo(50, height - 20, 100, height + 30, width, height - 10);
    ctx.setStrokeStyle('#ffffff');
    ctx.stroke();
    ctx.restore();

    ctx.beginPath();
    ctx.setGlobalAlpha(0.4);
    ctx.moveTo(0, height - 5);
    ctx.bezierCurveTo(50, height - 10, 80, height + 50, width, height - 30);
    ctx.setStrokeStyle('#ffffff');
    ctx.stroke();

    ctx.draw(true,() => {
      itemCanvasToImg();
    });
  };

  const itemCanvasToImg = () => {
    const {width, height} = itemNode;
    Taro.canvasToTempFilePath({
      x: 0,
      y: 0,
      width,
      height,
      // destWidth: width * pixelRatio * 2,
      // destHeight: height * pixelRatio * 2,
      canvasId: 'itemLine',
    }).then(res => {
      // console.log(res);
      // console.log('canvasToImg end');
      setItemImgPath(res.tempFilePath);
    }).catch(err => {
      // console.log('canvasToImg err');
      console.log(err);
    })
  };

  return (
    <View className='font26 h100-per white index'>
      <Image className='w100-per banner-img' style={{height: '200px'}} src={bannerImg} />
      <View className='flex-row flex-wrap pd-40 bd-box' style={{backgroundColor: '#1E154D'}}>
        <View className='flex-50per bd-box' onClick={() => goSWeatherMiniProgram()}>
          <View className='flex-column bg-indigo-A700 bd-radius pd-20 pd-b-30 mg-20 relative'>
            <View className='flex-row space-between'>
              <View className='lh-64'><Text className='font40'>天</Text>气预报</View>
              <View className='iconfont w64 h64 lh-64 text-center'>&#xe632;</View>
            </View>
            <View className='font24'>查询天气早知道</View>
            <View className='btm-shadow bg-indigo-A700' />
            <Image className='item-line-img h100-per w100-per' src={itemImgPath} />
          </View>
        </View>
        <View className='flex-50per bd-box'>
          <Navigator className='flex-column bg-purple-A700 bd-radius pd-20 pd-b-30 mg-20 relative' url={`/pages/other/pages/jokes/index?color=${colors.jokes}`}>
            <View className='flex-row space-between'>
              <View className='lh-64'><Text className='font40'>开</Text>心一刻</View>
              <View className='iconfont w64 h64 lh-64 text-center font40'>&#xe63d;</View>
            </View>
            <View className='font24'>笑话段子</View>
            <View className='btm-shadow bg-purple-A700' />
            {!itemImgPath && <Canvas className='item-line-canvas h100-per w100-per' canvasId='itemLine' id='itemLine' />}
            <Image className='item-line-img h100-per w100-per' src={itemImgPath} />
          </Navigator>
        </View>
        <View className='flex-50per bd-box'>
          <Navigator className='flex-column bg-cyan-A700 bd-radius pd-20 pd-b-30 mg-20 relative' url={`/pages/search/pages/phone_code/index?color=${colors.phone_code}`}>
            <View className='flex-row space-between'>
              <View className='lh-64'><Text className='font40'>世</Text>界电话区号</View>
              <View className='iconfont w64 h64 lh-64 text-center font46'>&#xe64f;</View>
            </View>
            <View className='font24'>世界各地电话区号</View>
            <View className='btm-shadow bg-cyan-A700' />
            <Image className='item-line-img h100-per w100-per' src={itemImgPath} />
          </Navigator>
        </View>
        <View className='flex-50per bd-box'>
          <Navigator className='flex-column bg-teal-A700 bd-radius pd-20 pd-b-30 mg-20 relative' url={`/pages/tools/pages/calculator/index?color=${colors.calculator}`}>
            <View className='flex-row space-between'>
              <View className='lh-64'><Text className='font40'>简</Text>易计算器</View>
              <View className='iconfont w64 h64 lh-64 text-center font46'>&#xe7b8;</View>
            </View>
            <View className='font24'>计算器</View>
            <View className='btm-shadow bg-teal-A700' />
            <Image className='item-line-img h100-per w100-per' src={itemImgPath} />
          </Navigator>
        </View>
        <View className='flex-50per bd-box'>
          <Navigator className='flex-column bg-orange-A700 bd-radius pd-20 pd-b-30 mg-20 relative' url={`/pages/search/pages/phone_location/index?color=${colors.phone_location}`}>
            <View className='flex-row space-between'>
              <View className='lh-64'><Text className='font40'>手</Text>机号归属地</View>
              <View className='iconfont w64 h64 lh-64 text-center font40'>&#xe784;</View>
            </View>
            <View className='font24'>查询手机归属地</View>
            <View className='btm-shadow bg-orange-A700' />
            <Image className='item-line-img h100-per w100-per' src={itemImgPath} />
          </Navigator>
        </View>
        <View className='flex-50per bd-box'>
          <Navigator className='flex-column bg-brown-800 bd-radius pd-20 pd-b-30 mg-20 relative' url={`/pages/search/pages/ip_search/index?color=${colors.ip_search}`}>
            <View className='flex-row space-between'>
              <View className='lh-64'><Text className='font40'>IP</Text>查询</View>
              <View className='iconfont w64 h64 lh-64 text-center font50'>&#xe7c5;</View>
            </View>
            <View className='font24'>查询IP地址</View>
            <View className='btm-shadow bg-brown-800' />
            <Image className='item-line-img h100-per w100-per' src={itemImgPath} />
          </Navigator>
        </View>
        <View className='flex-50per bd-box'>
          <Navigator className='flex-column bg-lime-800 bd-radius pd-20 pd-b-30 mg-20 relative' url={`/pages/tools/pages/calendar/index?color=${colors.calendar}`}>
            <View className='flex-row space-between'>
              <View className='lh-64'><Text className='font40'>万</Text>年历</View>
              <View className='iconfont w64 h64 lh-64 text-center font46'>&#xe878;</View>
            </View>
            <View className='font24'>日期/节日/星座/宜忌</View>
            <View className='btm-shadow bg-lime-800' />
            <Image className='item-line-img h100-per w100-per' src={itemImgPath} />
          </Navigator>
        </View>
        <View className='flex-50per bd-box'>
          <Navigator className='flex-column bg-green-A700 bd-radius pd-20 pd-b-30 mg-20 relative' url={`/pages/search/pages/trash_sort/index?color=${colors.trash_sort}`}>
            <View className='flex-row space-between'>
              <View className='lh-64'><Text className='font40'>垃</Text>圾分类</View>
              <View className='iconfont w64 h64 lh-64 text-center font50'>&#xe607;</View>
            </View>
            <View className='font24'>垃圾分类查询</View>
            <View className='btm-shadow bg-green-A700' />
            <Image className='item-line-img h100-per w100-per' src={itemImgPath} />
          </Navigator>
        </View>
        <View className='flex-50per bd-box'>
          <Navigator className='flex-column bg-deep-purple-A700 bd-radius pd-20 pd-b-30 mg-20 relative' url={`/pages/search/pages/express_note/index?color=${colors.express_note}`}>
            <View className='flex-row space-between'>
              <View className='lh-64'><Text className='font40'>快</Text>递查询</View>
              <View className='iconfont w64 h64 lh-64 text-center font50'>&#xe600;</View>
            </View>
            <View className='font24'>快递查询/记录</View>
            <View className='btm-shadow bg-deep-purple-A700' />
            <Image className='item-line-img h100-per w100-per' src={itemImgPath} />
          </Navigator>
        </View>
        {productConfig.news && <View className='flex-50per bd-box'>
          <Navigator className='flex-column bg-red-A200 bd-radius pd-20 pd-b-30 mg-20 relative' url={`/pages/other/pages/news/index?color=${colors.news}`}>
            <View className='flex-row space-between'>
              <View className='lh-64'><Text className='font40'>新</Text>闻Lite</View>
              <View className='iconfont w64 h64 lh-64 text-center font36'>&#xe603;</View>
            </View>
            <View className='font24'>新闻/视频</View>
            <View className='btm-shadow bg-red-A200' />
            <Image className='item-line-img h100-per w100-per' src={itemImgPath} />
          </Navigator>
        </View>}
        {productConfig.girls && <View className='flex-50per bd-box'>
          <Navigator className='flex-column bg-yellow bd-radius pd-20 pd-b-30 mg-20 relative' url={`/pages/other/pages/girls/index?color=${colors.girls}`}>
            <View className='flex-row space-between'>
              <View className='lh-64'><Text className='font40'>养</Text>眼福利图</View>
              <View className='iconfont w64 h64 lh-64 text-center font44'>&#xe87d;</View>
            </View>
            <View className='font24'>美女图</View>
            <View className='btm-shadow bg-yellow' />
            <Image className='item-line-img h100-per w100-per' src={itemImgPath} />
          </Navigator>
        </View>}
      </View>
      <View className='flex-column w64 fixed-btn'>
        <Button className='iconfont w64 h64 lh-64 text-center font40 circle share white pd-0 bg-black mg-t-20' openType='share'>&#xe874;</Button>
        {/*<Navigator className='bd-box circle w64 h64 bg-black mg-t-20' url={`/pages/home/color_setting/index?color=${colors.color_setting}`}>*/}
          {/*<View className='iconfont w64 h64 lh-64 text-center font44'>&#xe63f;</View>*/}
        {/*</Navigator>*/}
        <Navigator className='bd-box circle w64 h64 bg-black mg-t-20' url={`/pages/other/pages/about/index?color=${colors.about}`}>
          <View className='iconfont w64 h64 lh-64 text-center font44'>&#xe654;</View>
        </Navigator>
      </View>
      {!shareImgPath && <Canvas className='share-img-canvas' canvasId='shareImg' id='shareImg' />}
    </View>
  )
}

Index.config = {
  navigationBarTitleText: '小工具S',
  navigationStyle: 'custom'
};

export default Index;
