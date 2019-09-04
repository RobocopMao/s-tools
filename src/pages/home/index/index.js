import Taro, {useEffect, useState} from '@tarojs/taro'
import { View, Text, Image, Navigator } from '@tarojs/components'
import { useSelector } from '@tarojs/redux'
import shuffle from 'lodash/shuffle'
import random from 'lodash/random'
import { S_WEATHER_APPID} from '../../../apis/config'
import {getNodeRect} from '../../../utils';
import bannerImg1 from '../../../assets/images/banner1.jpg'
import bannerImg2 from '../../../assets/images/banner2.jpg'
import bannerImg3 from '../../../assets/images/banner3.jpg'
import bannerImg4 from '../../../assets/images/banner4.jpg'
import bannerImg5 from '../../../assets/images/banner5.jpg'
import bannerImg6 from '../../../assets/images/banner6.jpg'
import bannerImg7 from '../../../assets/images/banner7.jpg'
import bannerImg8 from '../../../assets/images/banner8.jpg'
import './index.scss'

// 随机卡片的颜色,写在外面防止卡片闪色
const colorsArr = ['#304FFE', '#0091EA', '#00B8D4', '#00BFA5', '#1B5E20', '#00C853', '#9E9D24', '#FFB837', '#FF6D00', '#FF5252', '#FF4081', '#AA00FF', '#6200EA', '#4E342E'];
const shuffleColors = shuffle(colorsArr);

// banner
const banners = [
  {img: bannerImg1, color: '#1E154D'},
  {img: bannerImg2, color: '#FFC103'},
  {img: bannerImg3, color: '#504dbe'},
  {img: bannerImg4, color: '#844DF6'},
  {img: bannerImg5, color: '#fefdfe'},
  {img: bannerImg6, color: '#8DB224'},
  {img: bannerImg7, color: '#01479d'},
  {img: bannerImg8, color: '#FFA6B6'}];
const BANNER_NO = Taro.getStorageSync('BANNER_NO');

function Index() {
  const pConfig = useSelector(state => state.pConfig);
  const {news, girls, ip} = pConfig.config;
  const [shareNode, setShareNode] = useState({});
  const [shareImgPath, setShareImgPath] = useState('');
  const [itemNode, setItemNode] = useState({});
  const [funcBtnNode, setFuncBtnNode] = useState({});
  const [itemImgPath, setItemImgPath] = useState('');
  const [bannerNo, setBannerNo] = useState(BANNER_NO ? BANNER_NO : 0);
  const [animationData, setAnimationData] = useState({});
  const [showFixedBtn, setShowFixedBtn] = useState(false);

  const colors = {
    weather: shuffleColors[0],
    jokes: shuffleColors[1],
    phone_code: shuffleColors[2],
    calculator: shuffleColors[3],
    phone_location: shuffleColors[4],
    calendar: shuffleColors[5],
    trash_sort: shuffleColors[6],
    express_note: shuffleColors[7],
    char_recognition: shuffleColors[8],
    obj_recognition: shuffleColors[9],
    bmi: shuffleColors[10],
    ip_search: shuffleColors[11],
    news: shuffleColors[12],
    girls: shuffleColors[13],
    about: '#000'
  };

  useEffect(() => {
    const {from, bannerNo} = this.$router.params;
    if (from === 'SHARE') {
      setBannerNo(Number(bannerNo));
      Taro.setStorageSync('BANNER_NO', Number(bannerNo));
    }
  }, []);

  // 获取itemNode宽高
  useEffect(async () => {
    const node = await getNodeRect('#itemLine');
    const {width, height} = node;
    setItemNode({width, height});
  }, []);

  // draw item line
  useEffect(() => {
    drawItemLine();
  }, [itemNode]);

  // 获取底部功能按钮box Node宽高
  useEffect(async () => {
    const node = await getNodeRect('#funcBtn');
    const {width, height} = node;
    setFuncBtnNode({width, height});
  }, []);

  // 获取shareImg宽高
  useEffect(async () => {
    const node = await getNodeRect('#shareImg');
    const {width, height} = node;
    setShareNode({height, width});
  }, []);

  // draw 背景
  useEffect(() => {
    drawShareImg(bannerNo);
  }, [shareNode]);

  // 转发
  useEffect(() => {
    // 显示转发按钮
    Taro.showShareMenu({
      withShareTicket: true
    });

    onShareAppMessage();
  }, [shareImgPath, bannerNo]);

  const onShareAppMessage = () => {
    this.$scope.onShareAppMessage = (res) => {
      return {
        title: '超级好看又耐用的小工具集合',
        path: `/pages/home/index/index?from=SHARE&bannerNo=${bannerNo}`,
        imageUrl: shareImgPath
      }
    };
  };

  // 去天气情报小程序
  const goSWeatherMiniProgram = () => {
    Taro.navigateToMiniProgram({appId: S_WEATHER_APPID});
  };

  /*************************item的背景线条*************************/
  // 初始化item bg canvas
  const drawItemLine = () => {
    if (JSON.stringify(itemNode) === '{}') { return; }
    const {width, height} = itemNode;

    const ctx = Taro.createCanvasContext('itemLine');
    ctx.save();
    ctx.beginPath();
    ctx.setGlobalAlpha(0.1);
    ctx.arc(0, 0, 15, 0, Math.PI / 2);  // 画左上1/4圆
    ctx.setStrokeStyle('#ffffff');
    ctx.stroke();
    ctx.restore();

    ctx.beginPath();
    ctx.setGlobalAlpha(0.3);
    ctx.moveTo(0, height - 5);
    // ctx.bezierCurveTo(50, height - 20, 100, height + 30, width, height - 10);  // 左边开始的上面一条曲线，右边下面一条
    ctx.bezierCurveTo(50, height - random(20, 25), 100, height + random(25, 30), width, height - random(10, 15));  // 左边开始的上面一条曲线，右边下面一条
    ctx.setStrokeStyle('#ffffff');
    ctx.stroke();
    ctx.restore();

    ctx.beginPath();
    ctx.setGlobalAlpha(0.2);
    ctx.moveTo(0, height - 5);
    // ctx.bezierCurveTo(50, height - 10, 80, height + 50, width, height - 30);  // 左边开始的下面一条曲线，右边上面一条
    ctx.bezierCurveTo(50, height - random(10, 15), 80, height + random(45, 50), width, height - random(30, 35));  // 左边开始的下面一条曲线，右边上面一条
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

  // 绘制分享图片
  const drawShareImg = (bannerNo) => {
    const color = banners[bannerNo]['color'];
    drawShareCanvas(bannerNo, color);
  };

  // 绘制分享canvas
  const drawShareCanvas = (bannerNo, color) => {
    if (JSON.stringify(itemNode) === '{}') { return; }
    const {width, height} = shareNode;
    const ctx = Taro.createCanvasContext('shareImg');
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();

    ctx.save();
    ctx.drawImage(banners[bannerNo]['img'], 0, 0, 750, 450, 0, 0, width, height);
    ctx.draw(true, () => {
      shareCanvasToImg();
    });
  };

  // canvas 转图片
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

  // 切换banner
  const switchBanner = () => {
    let len = banners.length;
    if (bannerNo < len - 1) {
      setBannerNo(prev => prev + 1);
      Taro.setStorageSync('BANNER_NO', bannerNo + 1);
      drawShareImg(bannerNo + 1);
    } else {
      setBannerNo(0);
      Taro.setStorageSync('BANNER_NO', 0);
      drawShareImg(0);
    }
  };

  // 显示/隐藏底部按钮
  const animateFixedBtn = () => {
    // 身高picker
    let animation = Taro.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    });

    if (!showFixedBtn) {
      animation.right(0).step();
    } else {
      const {width} = funcBtnNode;
      animation.right(-width).step();
    }
    setAnimationData(animation);
    setShowFixedBtn(prev => !prev);
  };

  return (
    <View className='font26 white relative index' style={{backgroundColor: banners[bannerNo]['color']}}>
      <Image className='w100-per banner-img' style={{height: '200px'}} src={banners[bannerNo]['img']} />
      <View className='flex-row flex-wrap pd-40 bd-box pd-t-0' style={{backgroundColor: banners[bannerNo]['color']}}>
        <View className='flex-50per bd-box' onClick={() => goSWeatherMiniProgram()}>
          <View className='flex-column bd-radius pd-20 pd-b-30 mg-20 relative' style={{backgroundColor: colors.weather}}>
            <View className='flex-row space-between'>
              <View className='lh-64'><Text className='font40'>天</Text>气预报</View>
              <View className='iconfont w64 h64 lh-64 text-center font46'>&#xe6b3;</View>
            </View>
            <View className='font24'>查询天气早知道</View>
            <View className='btm-shadow' style={{backgroundColor: colors.weather}} />
            {!itemImgPath && <Canvas className='item-line-canvas h100-per w100-per' canvasId='itemLine' id='itemLine' />}
            <Image className='item-line-img h100-per w100-per' src={itemImgPath} />
          </View>
        </View>
        <View className='flex-50per bd-box'>
          <Navigator className='flex-column bd-radius pd-20 pd-b-30 mg-20 relative' style={{backgroundColor: colors.jokes}} url={`/pages/other/pages/jokes/index?color=${colors.jokes}`}>
            <View className='flex-row space-between'>
              <View className='lh-64'><Text className='font40'>开</Text>心一刻</View>
              <View className='iconfont w64 h64 lh-64 text-center font48'>&#xe6c5;</View>
            </View>
            <View className='font24'>笑话段子</View>
            <View className='btm-shadow' style={{backgroundColor: colors.jokes}} />
            <Image className='item-line-img h100-per w100-per' src={itemImgPath} />
          </Navigator>
        </View>
        <View className='flex-50per bd-box'>
          <Navigator className='flex-column bd-radius pd-20 pd-b-30 mg-20 relative' style={{backgroundColor: colors.phone_code}} url={`/pages/search/pages/phone_code/index?color=${colors.phone_code}`}>
            <View className='flex-row space-between'>
              <View className='lh-64'><Text className='font40'>世</Text>界电话区号</View>
              <View className='iconfont w64 h64 lh-64 text-center font46'>&#xe668;</View>
            </View>
            <View className='font24'>世界各地电话区号</View>
            <View className='btm-shadow' style={{backgroundColor: colors.phone_code}} />
            <Image className='item-line-img h100-per w100-per' src={itemImgPath} />
          </Navigator>
        </View>
        <View className='flex-50per bd-box'>
          <Navigator className='flex-column bd-radius pd-20 pd-b-30 mg-20 relative' style={{backgroundColor: colors.trash_sort}} url={`/pages/search/pages/trash_sort/index?color=${colors.trash_sort}`}>
            <View className='flex-row space-between'>
              <View className='lh-64'><Text className='font40'>垃</Text>圾分类</View>
              <View className='iconfont w64 h64 lh-64 text-center font50'>&#xe6c4;</View>
            </View>
            <View className='font24'>垃圾分类查询</View>
            <View className='btm-shadow' style={{backgroundColor: colors.trash_sort}} />
            <Image className='item-line-img h100-per w100-per' src={itemImgPath} />
          </Navigator>
        </View>
        <View className='flex-50per bd-box'>
          <Navigator className='flex-column bd-radius pd-20 pd-b-30 mg-20 relative' style={{backgroundColor: colors.phone_location}} url={`/pages/search/pages/phone_location/index?color=${colors.phone_location}`}>
            <View className='flex-row space-between'>
              <View className='lh-64'><Text className='font40'>手</Text>机号归属地</View>
              <View className='iconfont w64 h64 lh-64 text-center font50'>&#xe6b8;</View>
            </View>
            <View className='font24'>查询手机归属地</View>
            <View className='btm-shadow' style={{backgroundColor: colors.phone_location}} />
            <Image className='item-line-img h100-per w100-per' src={itemImgPath} />
          </Navigator>
        </View>
        <View className='flex-50per bd-box'>
          <Navigator className='flex-column bd-radius pd-20 pd-b-30 mg-20 relative' style={{backgroundColor: colors.express_note}} url={`/pages/search/pages/express_note/index?color=${colors.express_note}`}>
            <View className='flex-row space-between'>
              <View className='lh-64'><Text className='font40'>快</Text>递查询</View>
              <View className='iconfont w64 h64 lh-64 text-center font50'>&#xe6b5;</View>
            </View>
            <View className='font24'>快递查询/记录</View>
            <View className='btm-shadow' style={{backgroundColor: colors.express_note}} />
            <Image className='item-line-img h100-per w100-per' src={itemImgPath} />
          </Navigator>
        </View>
        <View className='flex-50per bd-box'>
          <Navigator className='flex-column bd-radius pd-20 pd-b-30 mg-20 relative' style={{backgroundColor: colors.calendar}} url={`/pages/tools/pages/calendar/index?color=${colors.calendar}`}>
            <View className='flex-row space-between'>
              <View className='lh-64'><Text className='font40'>万</Text>年历</View>
              <View className='iconfont w64 h64 lh-64 text-center font46'>&#xe62e;</View>
            </View>
            <View className='font24'>日期/节日/星座/宜忌</View>
            <View className='btm-shadow' style={{backgroundColor: colors.calendar}} />
            <Image className='item-line-img h100-per w100-per' src={itemImgPath} />
          </Navigator>
        </View>
        <View className='flex-50per bd-box'>
          <Navigator className='flex-column bd-radius pd-20 pd-b-30 mg-20 relative' style={{backgroundColor: colors.calculator}} url={`/pages/tools/pages/calculator/index?color=${colors.calculator}`}>
            <View className='flex-row space-between'>
              <View className='lh-64'><Text className='font40'>简</Text>易计算器</View>
              <View className='iconfont w64 h64 lh-64 text-center font46'>&#xe6b2;</View>
            </View>
            <View className='font24'>计算器</View>
            <View className='btm-shadow' style={{backgroundColor: colors.calculator}} />
            <Image className='item-line-img h100-per w100-per' src={itemImgPath} />
          </Navigator>
        </View>
        <View className='flex-50per bd-box'>
          <Navigator className='flex-column bd-radius pd-20 pd-b-30 mg-20 relative' style={{backgroundColor: colors.char_recognition}} url={`/pages/tools/pages/char_recognition/index?color=${colors.char_recognition}`}>
            <View className='flex-row space-between'>
              <View className='lh-64'><Text className='font40'>通</Text>用文字识别</View>
              <View className='iconfont w64 h64 lh-64 text-center font40'>&#xe6cb;</View>
            </View>
            <View className='font24'>识别图片里的文字信息</View>
            <View className='btm-shadow' style={{backgroundColor: colors.char_recognition}} />
            <Image className='item-line-img h100-per w100-per' src={itemImgPath} />
          </Navigator>
        </View>
        <View className='flex-50per bd-box'>
          <Navigator className='flex-column bd-radius pd-20 pd-b-30 mg-20 relative' style={{backgroundColor: colors.obj_recognition}} url={`/pages/tools/pages/obj_recognition/index?color=${colors.obj_recognition}`}>
            <View className='flex-row space-between'>
              <View className='lh-64'><Text className='font40'>图</Text>片识物</View>
              <View className='iconfont w64 h64 lh-64 text-center font46'>&#xe709;</View>
            </View>
            <View className='font24'>识别图片里的物体信息</View>
            <View className='btm-shadow' style={{backgroundColor: colors.obj_recognition}} />
            <Image className='item-line-img h100-per w100-per' src={itemImgPath} />
          </Navigator>
        </View>
        <View className='flex-50per bd-box'>
          <Navigator className='flex-column bd-radius pd-20 pd-b-30 mg-20 relative' style={{backgroundColor: colors.bmi}} url={`/pages/tools/pages/bmi/index?color=${colors.bmi}`}>
            <View className='flex-row space-between'>
              <View className='lh-64'><Text className='font40'>B</Text>MI指数</View>
              <View className='iconfont w64 h64 lh-64 text-center font46'>&#xe648;</View>
            </View>
            <View className='font24'>体质指数计算</View>
            <View className='btm-shadow' style={{backgroundColor: colors.bmi}} />
            <Image className='item-line-img h100-per w100-per' src={itemImgPath} />
          </Navigator>
        </View>
        {ip && <View className='flex-50per bd-box'>
          <Navigator className='flex-column bd-radius pd-20 pd-b-30 mg-20 relative' style={{backgroundColor: colors.ip_search}} url={`/pages/search/pages/ip_search/index?color=${colors.ip_search}`}>
            <View className='flex-row space-between'>
              <View className='lh-64'><Text className='font40'>IP</Text>查询</View>
              <View className='iconfont w64 h64 lh-64 text-center font44'>&#xe609;</View>
            </View>
            <View className='font24'>查询IP地址</View>
            <View className='btm-shadow' style={{backgroundColor: colors.ip_search}} />
            <Image className='item-line-img h100-per w100-per' src={itemImgPath} />
          </Navigator>
        </View>}
        {news && <View className='flex-50per bd-box'>
          <Navigator className='flex-column bd-radius pd-20 pd-b-30 mg-20 relative' style={{backgroundColor: colors.news}} url={`/pages/other/pages/news/index?color=${colors.news}`}>
            <View className='flex-row space-between'>
              <View className='lh-64'><Text className='font40'>新</Text>闻Lite</View>
              <View className='iconfont w64 h64 lh-64 text-center font46'>&#xe6b6;</View>
            </View>
            <View className='font24'>新闻/视频</View>
            <View className='btm-shadow' style={{backgroundColor: colors.news}} />
            <Image className='item-line-img h100-per w100-per' src={itemImgPath} />
          </Navigator>
        </View>}
        {girls && <View className='flex-50per bd-box'>
          <Navigator className='flex-column bd-radius pd-20 pd-b-30 mg-20 relative' style={{backgroundColor: colors.girls}} url={`/pages/other/pages/girls/index?color=${colors.girls}`}>
            <View className='flex-row space-between'>
              <View className='lh-64'><Text className='font40'>养</Text>眼福利图</View>
              <View className='iconfont w64 h64 lh-64 text-center font46'>&#xe6b4;</View>
            </View>
            <View className='font24'>美女图</View>
            <View className='btm-shadow' style={{backgroundColor: colors.girls}} />
            <Image className='item-line-img h100-per w100-per' src={itemImgPath} />
          </Navigator>
        </View>}
      </View>
      <View className='flex-row flex-col-center h80 bg-black fixed-btn' animation={animationData}>
        <Button className='iconfont w80 h80 lh-80 text-center font40 circle white pd-0 bg-black' onClick={() => animateFixedBtn()}>
          {showFixedBtn && <View className='iconfont w80 h80 lh-80 text-center font44 white'>&#xe6aa;</View>}
          {!showFixedBtn && <View className='iconfont w80 h80 lh-80 text-center font44 white'>&#xe69b;</View>}
        </Button>
        <View className='flex-row flex-col-center func-btn' id='funcBtn'>
          <Button className='iconfont w64 h64 lh-64 text-center font40 circle share white pd-0 bg-black mg-r-20' openType='share'>&#xe649;</Button>
          <Button className='iconfont w64 h64 lh-64 text-center font40 circle white pd-0 bg-black font48 mg-r-20' onClick={() => switchBanner()}>&#xe6ba;</Button>
          {/*<Navigator className='bd-box circle w64 h64 bg-black mg-t-20' url={`/pages/home/color_setting/index?color=${colors.color_setting}`}>*/}
          {/*<View className='iconfont w64 h64 lh-64 text-center font44'>&#xe63f;</View>*/}
          {/*</Navigator>*/}
          <Button className='iconfont w64 h64 lh-64 text-center font40 circle share white pd-0 bg-black mg-r-20' openType='contact'>&#xe6bb;</Button>
          <Navigator className='bd-box circle w64 h64 bg-black mg-r-20' url={`/pages/other/pages/about/index?color=${colors.about}`}>
            <View className='iconfont w64 h64 lh-64 text-center font44 white'>&#xe626;</View>
          </Navigator>
        </View>
      </View>
      <View className='h0 of-hidden relative'>
        <Canvas className='share-img-canvas' canvasId='shareImg' id='shareImg' />
      </View>
    </View>
  )
}

Index.config = {
  navigationBarTitleText: '小工具S',
  navigationStyle: 'custom'
};

export default Index;
