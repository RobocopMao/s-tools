import Taro, {useEffect, useState, usePageScroll, useShareAppMessage, useRouter} from '@tarojs/taro'
import {View, Text, Image, Navigator, ScrollView, /**Swiper, SwiperItem**/} from '@tarojs/components'
import { useSelector } from '@tarojs/redux'
import shuffle from 'lodash/shuffle'
import random from 'lodash/random'
import { S_WEATHER_APPID} from '../../../apis/config'
import {getNodeRect} from '../../../utils'
import bannersConfig from '../../../utils/banners'
import {useInterstitialAd} from '../../../hooks'
import {ComponentCommonVideoAd} from '../../../components/common/video_ad'
import cardsConfig from '../assets/json/cards_config.json'
import './index.scss'

// 随机卡片的颜色,写在外面防止卡片闪色
const colorsArr = ['#304FFE', '#0091EA', '#00B8D4', '#00BFA5', '#1B5E20', '#00C853', '#9E9D24', '#AEEA00', '#FFB837',
  '#FF6D00', '#FF3D00', '#FF5252', '#FF4081', '#AA00FF', '#7C4DFF', '#6200EA', '#4E342E', '#607D8B'];
const shuffleColors = shuffle(colorsArr);

// bannerNo
const BANNER_NO = Taro.getStorageSync('BANNER_NO');

// tabs 类型
const tabTypes = [
  {name: '全部分类', id: 0},
  {name: '工具类', id: 1},
  {name: '查询类', id: 2},
  {name: '其他', id: 3}
];

function Index() {
  const router = useRouter();
  const pConfig = useSelector(state => state.pConfig);
  const user = useSelector(state => state.user);
  const interstitialAd = useInterstitialAd();
  const {showing, noticeTime, notice, showingBanners, enableSkinSetting, version} = pConfig.config;
  const {statusBarHeight, navSafeHeight} = user.systemInfo;
  const [shareNode, setShareNode] = useState({});
  const [shareImgPath, setShareImgPath] = useState('');
  const [itemNode, setItemNode] = useState({});
  const [funcBtnNode, setFuncBtnNode] = useState({});
  const [itemImgPath, setItemImgPath] = useState('');
  const [bannerNo, setBannerNo] = useState(BANNER_NO ? BANNER_NO : 0);
  const [animationData, setAnimationData] = useState({});
  const [showFixedBtn, setShowFixedBtn] = useState(false);
  const [noticeRead, setNoticeRead] = useState(true);
  const [selectedTabId, setSelectedTabId] = useState(0);
  const [animationData1, setAnimationData1] = useState({});
  const [banners, setBanners] = useState(bannersConfig);
  const [shakingCard, setShakingCard] = useState('');

  const colors = {
    weather: shuffleColors[0],
    jokes: shuffleColors[1],
    char_recognition: shuffleColors[2],
    obj_recognition: shuffleColors[3],
    id_photo: shuffleColors[4],
    phone_code: shuffleColors[5],
    calculator: shuffleColors[6],
    phone_location: shuffleColors[7],
    calendar: shuffleColors[8],
    trash_sort: shuffleColors[9],
    express_note: shuffleColors[10],
    bmi: shuffleColors[11],
    ip_search: shuffleColors[12],
    news: shuffleColors[13],
    girls: shuffleColors[14],
    translate: shuffleColors[15],
    chat: shuffleColors[16],
    phone_info: shuffleColors[17],
    about: '#000',
    colorRandom: shuffleColors[random(0, 13)]
  };

  // 根据配置更新banners
  useEffect(() => {
    if (typeof showingBanners === 'undefined') {  // 等待showingBanners更新
      return;
    }
    let _banners = getBanners();
    setBanners(_banners);
  }, [showingBanners]);

  // 来自分享的设置
  useEffect(() => {
    const {from, bannerNo} = router.params;
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
    drawShareCanvas(bannerNo);
  }, [shareNode]);

  // 通知
  useEffect(() => {
    if (noticeTime) {
      const NOTICE = Taro.getStorageSync('NOTICE');
      if (NOTICE) { // 本地有通知缓存
        if (NOTICE.time === noticeTime && notice.replace(/^\s*/,'').length) {  // 本地通知时间和网络相等,且有通知
          setNoticeRead(NOTICE.read);
        } else {  // 本地通知时间和网络不相等
          setNewNotice();
        }
      } else {
        setNewNotice();
      }
    }
  }, [noticeTime, notice]);

  // 显示转发按钮
  useEffect(() => {
    // 显示转发按钮
    Taro.showShareMenu({
      withShareTicket: true
    });
  }, []);

  // 转发
  useShareAppMessage(res => {
    return {
      title: '超级好看又耐用的小工具集合',
      path: `/pages/home/index/index?from=SHARE&bannerNo=${Taro.getStorageSync('BANNER_NO')}`,
      imageUrl: shareImgPath
    }
  });

  // 页面滚动,触发title显示/隐藏动画
  usePageScroll(res => {
    const {scrollTop} = res;
    animationTitle(scrollTop);
  });

  // 卡片长按抖动
  const shakingCards = (cardName = '') => {
    setShakingCard(cardName);
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

  // 绘制分享canvas
  const drawShareCanvas = (bannerNo) => {
    if (JSON.stringify(itemNode) === '{}') { return; }
    const {width, height} = shareNode;
    const color = banners[bannerNo]['color'];
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

  // 去设置皮肤
  const goSettingSkin = () => {
    // 节日期间不允许换肤
    if (!enableSkinSetting) {
      Taro.showToast({title: '当前时间段不支持换肤哦', icon: 'none'});
      animateFixedBtn();
      return;
    }

    // 延迟大发好
    let tId = setTimeout(() => {
      animateFixedBtn();
      clearTimeout(tId);
    }, 1000);

    Taro.navigateTo({
      url: `/pages/home/skin_setting/index?color=${colors.colorRandom}`,
      events: {
        acceptDataFromSkinSetting(data) {  // 监听事件
          // console.log('acceptDataFromLocationSearch');
          // console.log(data);

          // switchBanner(data.bannerNo);
          const {bannerNo} = data;
          setBannerNo(bannerNo);
          Taro.setStorageSync('BANNER_NO', bannerNo);
          let tId = setTimeout(() => {  // 需要延迟，不然banner图片画不出来
            drawShareCanvas(bannerNo);
            // 设置皮肤成功加载插屏广告
            if (interstitialAd) {
              interstitialAd.show().catch((err) => {
                console.error(err);
              });
            }
            clearTimeout(tId);
          }, 1000);
        }
      }
    });
  };

  // 去通知
  const goNotice = () => {
    // 延迟隐藏防止向左的箭头提前出现显示红点
    let tId = setTimeout(() => {
      animateFixedBtn();
      clearTimeout(tId);
    }, 1000);

    Taro.navigateTo({
      url: `/pages/other/pages/notice/index?color=${colors.colorRandom}`,
      events: {
        acceptDataFromNotice(data) {  // 监听事件
          // console.log('acceptDataFromLocationSearch');
          // console.log(data);

          // switchBanner(data.bannerNo);
          const {read} = data;
          const NOTICE = Taro.getStorageSync('NOTICE');
          NOTICE.read = read;
          Taro.setStorageSync('NOTICE', NOTICE); // 更新notice缓存
          setNoticeRead(read);
        }
      }
    });
  };

  // 去关于
  const goAbout = () => {
    // 延迟大发好
    let tId = setTimeout(() => {
      animateFixedBtn();
      clearTimeout(tId);
    }, 1000);

    Taro.navigateTo({
      url: `/pages/other/pages/about/index?color=${colors.about}`,
    });
  };

  // 设置新通知
  const setNewNotice = () => {
    const newNotice = {
      notice: notice.replace(/^\s*/, ''),
      time: noticeTime,
      read: false,
    };
    Taro.setStorageSync('NOTICE', newNotice);
    if (!notice.replace(/^\s*/, '').length) {  // 没有通知，配置用的空格（因为目前配置必须填写东西）
      setNoticeRead(true);
    } else {
      setNoticeRead(false);
    }
  };

  // 显示/隐藏底部按钮
  const animateFixedBtn = () => {
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

  // 切换选中的tab Id
  const changeTabId = (id) => {
    if (id !== selectedTabId) {
      setSelectedTabId(Number(id));
      Taro.pageScrollTo({
        scrollTop: 0,
        duration: 500
      });
    }
  };

  // 显示/隐藏title的动画
  const animationTitle = (scrollTop) => {
    let animation = Taro.createAnimation({
      duration: 500,
      timingFunction: 'ease',
      transformOrigin: 'bottom center 0'
    });

    if (scrollTop > 110) {
      animation.opacity(1).height(navSafeHeight + statusBarHeight).step();
    } else {
      animation.opacity(0).height(0).step();
    }

    setAnimationData1(animation);
  };

  // 通过配置获取初始化banner
  const getBanners = () => {
    let banners = [];
    let showingBannersArr = [...new Set(showingBanners.split(','))];  // 去重
    if (Number(showingBannersArr[0]) > Number(showingBannersArr[1])) {   // 判断是不是需要特别显示，比如11代表国庆节，显示在第一个
      setBannerNo(0);
      // Taro.setStorageSync('BANNER_NO', 0);
    } else {
      // let _bannerNo = BANNER_NO > 0 ? BANNER_NO - 1 : 0;
      // setBannerNo(_bannerNo);
      // Taro.setStorageSync('BANNER_NO', _bannerNo);
    }
    if (showingBannersArr.length > bannersConfig.length) { // 后台配置的显示个数不能大于实际该有的个数
      showingBannersArr = showingBannersArr.splice(0, bannersConfig.length);
    }
    // console.log(showingBannersArr);
    for (let [, item] of showingBannersArr.entries()) {
      banners.push(bannersConfig[Number(item) - 1]);
    }
    return banners;
  };

  return (
    <View className='font26 white relative flex-grow-1 index' style={{backgroundColor: banners[bannerNo]['color']}}>
      {/*头部*/}
      <View className='header'>
        {/*banner*/}
        {/*<Swiper*/}
        {/*  autoplay*/}
        {/*  circular*/}
        {/*  interval={10000}*/}
        {/*  style={{height: '200px'}}*/}
        {/*>*/}
        {/*  <SwiperItem>*/}
            <Image className='w100-per banner-img' style={{height: '200px'}} src={banners[bannerNo]['img']} />
          {/*</SwiperItem>*/}
          {/*<SwiperItem style={{height: '200px'}}>*/}
          {/*  广告位*/}
          {/*  <ComponentCommonVideoAd />*/}
          {/*</SwiperItem>*/}
        {/*</Swiper>*/}
        <View className={`tabs pd-l-40 pd-r-40 mg-r-20 mg-l-20 pd-b-20 ${banners[bannerNo]['colorType'] === 'dark' ? 'text-light' : 'text-dark'}`}
              style={{backgroundColor: banners[bannerNo]['color'], opacity: `0.95`}}>
          {/*title*/}
          <View className='flex-row of-hidden' style={{height: `0Px`, opacity: 0}} animation={animationData1}>
            <View className='bold font40' style={{alignSelf: `flex-end`, marginTop: `${statusBarHeight}px`, lineHeight: `${navSafeHeight}px`}}>小工具S</View>
          </View>
          {/*tabs*/}
          <ScrollView
            className='tabs flex-row flex-col-center font30'
            scrollX
            scrollWithAnimation
            style={{height: '36px'}}
            id='newsTypes'
          >
            {tabTypes.map((type, index) => {
              const {name, id} = type;
              return (
                <View key={id} className={`inline-block mg-t-10 mg-b-10 mg-r-20 pd-t-6 pd-b-6 pd-r-20 relative ${selectedTabId === index ? 'tab-active' : ''}`} onClick={() => changeTabId(id)}>
                  <Text className='tab-text'>{name}</Text>
                  {/*{selectedTabId === index && <View className='w100-per h2 bg-white mg-t-10 bd-radius-50 type-btn-line' />}*/}
                </View>
              )
            })}
          </ScrollView>
        </View>
      </View>
      {/*内容列表*/}
      <View className='flex-row flex-wrap pd-40 bd-box pd-t-0' style={{backgroundColor: banners.length ? banners[bannerNo]['color'] : ''}}>
        {(selectedTabId === 0 || selectedTabId === 2) && <View className={`flex-50per bd-box ${shakingCard === 'weather' ? 'shake' : ''}`}
                                                               onClick={() => goSWeatherMiniProgram()}
                                                               onTouchStart={() => shakingCards('weather')}
                                                               onTouchEnd={() => shakingCards()}
        >
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
        </View>}
        {cardsConfig.map((card, index) => {
          const {pageName, upperTxt, lowerTxt, introTxt, icon, iconClass, url, extraTabId, useShowing} = card;
          return (
            (useShowing ? showing : true) && (selectedTabId === 0 || selectedTabId === extraTabId) && <View key={pageName} className={`flex-50per bd-box ${shakingCard === pageName ? 'shake' : ''}`} onTouchStart={() => shakingCards(pageName)} onTouchEnd={() => shakingCards()}>
              <Navigator className='flex-column bd-radius pd-20 pd-b-30 mg-20 relative' style={{backgroundColor: colors[pageName]}} url={`${url}?color=${colors[pageName]}`}>
                <View className='flex-row space-between'>
                  <View className='lh-64'><Text className='font40'>{upperTxt}</Text>{lowerTxt}</View>
                  <View className={`iconfont w64 h64 lh-64 text-center font46 ${iconClass}`} />
                </View>
                <View className='font24'>{introTxt}</View>
                <View className='btm-shadow' style={{backgroundColor: colors[pageName]}} />
                <Image className='item-line-img h100-per w100-per' src={itemImgPath} />
              </Navigator>
            </View>
          )
        })}
        {selectedTabId === 0 && version && <View className={`flex-100per version text-center pd-t-24 lh-40 ${banners[bannerNo]['colorType'] === 'dark' ? 'text-light' : 'text-dark'}`}>版本号：{version || '2.4.6'}</View>}
      </View>
      <View className='flex-row flex-col-center h80 bg-black fixed-btn' animation={animationData}>
        <Button className='iconfont flex-row flex-col-center flex-row-center w80 h80 text-center font40 white pd-0 bg-black' onClick={() => animateFixedBtn()}>
          {showFixedBtn && <View className='iconfont w64 h64 lh-64 text-center font44 white'>&#xe6aa;</View>}
          {!showFixedBtn && <View className={`iconfont w64 h64 lh-64 text-center font44 white relative ${noticeRead ? '' : 'badge'}`}>&#xe69b;</View>}
        </Button>
        <View className='flex-row flex-col-center func-btn' id='funcBtn'>
          <Button className={`iconfont w64 h64 lh-64 text-center font44 white pd-0 bg-black mg-r-20 relative ${noticeRead ? '' : 'badge'}`} onClick={() => goNotice()}>&#xe6ab;</Button>
          <Button className='iconfont w64 h64 lh-64 text-center font40 share white pd-0 bg-black mg-r-20' openType='share'>&#xe649;</Button>
          <Button className='iconfont w64 h64 lh-64 text-center font48 white pd-0 bg-black mg-r-20' onClick={() => goSettingSkin()}>&#xe6ba;</Button>
          {/*<Navigator className='bd-box circle w64 h64 bg-black mg-t-20' url={`/pages/home/color_setting/index?color=${colors.color_setting}`}>*/}
          {/*<View className='iconfont w64 h64 lh-64 text-center font44'>&#xe63f;</View>*/}
          {/*</Navigator>*/}
          <Button className='iconfont w64 h64 lh-64 text-center font40 share white pd-0 bg-black mg-r-20' openType='contact'>&#xe6bb;</Button>
          <Button className='iconfont w64 h64 lh-64 text-center font44 white pd-0 bg-black mg-r-20' onClick={() => goAbout()}>&#xe626;</Button>
          {/*<Navigator className='bd-box circle w64 h64 bg-black mg-r-20' url={`/pages/other/pages/about/index?color=${colors.about}`}>*/}
            {/*<View className='iconfont w64 h64 lh-64 text-center font44 white'>&#xe626;</View>*/}
          {/*</Navigator>*/}
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
