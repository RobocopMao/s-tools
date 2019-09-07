import Taro, {useEffect, useState} from '@tarojs/taro'
import {View, ScrollView, Image} from '@tarojs/components'
import { useSelector, useDispatch } from '@tarojs/redux'
import { aiAccessToken, aiImageAdvancedGeneral, aiImageAnimal, aiImagePlant, aiImageIngredient, aiImageDish, aiImageLandmark, aiImageCurrency, aiImageLogo } from '../../../../apis/baidu_ai'
import {useAsyncEffect} from '../../../../utils';
import {setAiToken} from '../../../../redux/user/action';
import './index.scss'

function ObjRecognition() {
  const pConfig = useSelector(state => state.pConfig);
  const user = useSelector(state => state.user);
  const {aiAK, aiSK} = pConfig.config;
  const {access_token} = user.aiToken;
  const {windowHeight} = user.systemInfo;
  const dispatch = useDispatch();
  const [imageUrl, setImageUrl] = useState('');
  const [result, setResult] = useState(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [animationData1, setAnimationData1] = useState({});
  const [animationData2, setAnimationData2] = useState({});
  const [animationData3, setAnimationData3] = useState({});
  const [animationData4, setAnimationData4] = useState({});
  const [animationData5, setAnimationData5] = useState({});
  const [animationData6, setAnimationData6] = useState({});
  const [animationData7, setAnimationData7] = useState({});
  const [animationData8, setAnimationData8] = useState({});
  const [showAnimation, setShowAnimation] = useState(false);
  const [type, setType] = useState(0);
  const [color, setColor] = useState('');

  // 设置color
  useEffect(() => {
    const {color} = this.$router.params;
    setColor(color);
    Taro.setNavigationBarColor({frontColor: '#ffffff', backgroundColor: color});
  }, []);

  // 获取token
  useAsyncEffect(async () => {
    if (typeof access_token === 'undefined') {
      const token = await aiAccessToken({grant_type: 'client_credentials', client_id: aiAK, client_secret: aiSK});
      dispatch(setAiToken(token));
    }
  }, []);

  // 点击添加按钮展示动画
  const createAnimation = () => {
    let maxDelay = 350;
    let animation1 = Taro.createAnimation({
      duration: 500,
      timingFunction: 'ease',
      delay: !showAnimation ? 0 : maxDelay,
    });

    let animation2 = Taro.createAnimation({
      duration: 500,
      timingFunction: 'ease',
      delay: !showAnimation ? 50 : maxDelay - 50,
    });

    let animation3 = Taro.createAnimation({
      duration: 500,
      timingFunction: 'ease',
      delay: !showAnimation ? 100 : maxDelay - 100,
    });

    let animation4 = Taro.createAnimation({
      duration: 500,
      timingFunction: 'ease',
      delay: !showAnimation ? 150 : maxDelay - 150,
    });

    let animation5 = Taro.createAnimation({
      duration: 500,
      timingFunction: 'ease',
      delay: !showAnimation ? 200 : 100,
    });

    let animation6 = Taro.createAnimation({
      duration: 500,
      timingFunction: 'ease',
      delay: !showAnimation ? 250 : maxDelay - 250,
    });

    let animation7 = Taro.createAnimation({
      duration: 500,
      timingFunction: 'ease',
      delay: !showAnimation ? 300 : maxDelay - 300,
    });

    let animation8 = Taro.createAnimation({
      duration: 500,
      timingFunction: 'ease',
      delay: !showAnimation ? 350 : 0,
    });

    if (!showAnimation) {
      animation1.right(0).step();
      animation2.right(0).step();
      animation3.right(0).step();
      animation4.right(0).step();
      animation5.right(0).step();
      animation6.right(0).step();
      animation7.right(0).step();
      animation8.right(0).step();
    } else {
      animation1.right(-100).step();
      animation2.right(-100).step();
      animation3.right(-100).step();
      animation4.right(-100).step();
      animation5.right(-100).step();
      animation6.right(-100).step();
      animation7.right(-100).step();
      animation8.right(-100).step();
    }
    setAnimationData1(animation1);
    setAnimationData2(animation2);
    setAnimationData3(animation3);
    setAnimationData4(animation4);
    setAnimationData5(animation5);
    setAnimationData6(animation6);
    setAnimationData7(animation7);
    setAnimationData8(animation8);
    setShowAnimation(prev => !prev);
  };

  // 选择类型
  const chooseImage = (type) => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      async success(res) {
        const {tempFilePaths} = res;
        setImageUrl(tempFilePaths[0]); // 本地展示
        // 清空上次识别结果
        setResult(null);
        createAnimation();

        setType(type);
        // 识别图片
        if (type === 1) {
          RecognizeObj(tempFilePaths[0], aiImageAdvancedGeneral, {baike_num: 5});
        } else if (type === 2) {
          RecognizeObj(tempFilePaths[0], aiImageAnimal, {baike_num: 5, top_num: 5});
        } else if (type === 3) {
          RecognizeObj(tempFilePaths[0], aiImagePlant, {baike_num: 5});
        }else if (type === 4) {
          RecognizeObj(tempFilePaths[0], aiImageIngredient, {top_num: 5});
        } else if (type === 5) {
          RecognizeObj(tempFilePaths[0], aiImageDish, {baike_num: 5, filter_threshold: 0.95, top_num: 5});
        } else if (type === 6) {
          RecognizeObj(tempFilePaths[0], aiImageLandmark);
        } else if (type === 7) {
          RecognizeObj(tempFilePaths[0], aiImageCurrency);
        } else if (type === 8) {
          RecognizeObj(tempFilePaths[0], aiImageLogo);
        }
      }
    })
  };

  // 通用物体和场景识别高级版
  const RecognizeObj = (path, fun, extraParam = {}) => {
    Taro.getFileSystemManager().readFile({
      filePath: path,
      encoding: 'base64', // base64格式的图片
      async success(res) {
        const res1 = await fun({image: encodeURI(res.data), access_token, ...extraParam});
        const {result} = res1;
        setResult(result);
        setScrollTop(prev => prev === 0 ? 0.1 : 0);
      },
      fail(res) {
        Taro.showToast({title: res.errMsg, icon: 'none'});
      }
    });
  };

  // 预览图片
  const previewImage = () => {
    Taro.previewImage({urls: [imageUrl]});
  };

  return (
    <View className='obj-recognition'>
      <View className='flex-column flex-col-center flex-row-center w100-per' style={{height: `${windowHeight / 2}px`, backgroundColor: color}}>
        {imageUrl && <Image className='h100-per w100-per pd-b-2 pd-r-2 pd-l-2 bd-box' mode='aspectFit' src={imageUrl} onClick={() => previewImage()} />}
        {!imageUrl && <View className='flex-column text-center white'>
          <View className='iconfont font70 mg-b-10'>&#xe6b4;</View>
          <View>图片展示区</View>
        </View>}
      </View>
      <ScrollView
        className='flex-column pd-20 bd-box'
        scrollY
        scrollWithAnimation
        style={{height: `${windowHeight / 2}px`}}
        scrollTop={scrollTop}
      >
        {!result && <View className='w100-per h100-per flex-column flex-row-center flex-col-center text-center'>
          <View className='iconfont font70 mg-b-10'>&#xe6b0;</View>
          <View>结果展示区</View>
        </View>}
        {/*通用*/}
        {type === 1 && result && <View className='mg-b-120'>
          {result.map((res, index) => {
            const {keyword, score, root, baike_info} = res;
            return (
              <View className='pd-t-10 pd-b-10 flex-row' key={String(index)}>
                <View className='mg-r-10'>{index + 1}.</View>
                <View className='flex-column'>
                  <View className='mg-b-10'>关键词：{keyword}</View>
                  <View className='mg-b-10'>置信度：{Number(score).toFixed(4)}</View>
                  <View className='mg-b-10'>上层标签： {root}</View>
                  {typeof baike_info !== 'undefined' && JSON.stringify(baike_info) !== '{}' && <View>
                    {(baike_info.image_url || baike_info.description) && <View className='mg-b-10'>百度百科：</View>}
                    {/.jpg|.png|.jpeg/.test(baike_info.image_url) && <Image className='mg-b-10' src={baike_info.image_url} />}
                    <View className='mg-b-10'>{baike_info.description}</View>
                  </View>}
                </View>
              </View>
            )
          })}
        </View>}
        {/*动物*/}
        {type === 2 && result && <View className='mg-b-120'>
          {result.map((res, index) => {
            const {name, score, baike_info} = res;
            return (
              <View className='pd-t-10 pd-b-10 flex-row' key={String(index)}>
                <View className='mg-r-10'>{index + 1}.</View>
                <View className='flex-column'>
                  <View className='mg-b-10'>动物名称：{name}</View>
                  <View className='mg-b-10'>置信度：{Number(score).toFixed(4)}</View>
                  {typeof baike_info !== 'undefined' && JSON.stringify(baike_info) !== '{}' && <View>
                    {(baike_info.image_url || baike_info.description) && <View className='mg-b-10'>百度百科：</View>}
                    {/.jpg|.png|.jpeg/.test(baike_info.image_url) && <Image className='mg-b-10' src={baike_info.image_url} />}
                    <View className='mg-b-10'>{baike_info.description}</View>
                  </View>}
                </View>
              </View>
            )
          })}
        </View>}
        {/*植物*/}
        {type === 3 && result && <View className='mg-b-120'>
          {result.map((res, index) => {
            const {name, score, baike_info} = res;
            return (
              <View className='pd-t-10 pd-b-10 flex-row' key={String(index)}>
                <View className='mg-r-10'>{index + 1}.</View>
                <View className='flex-column'>
                  <View className='mg-b-10'>植物名称：{name}</View>
                  <View className='mg-b-10'>置信度：{Number(score).toFixed(4)}</View>
                  {typeof baike_info !== 'undefined' && JSON.stringify(baike_info) !== '{}' && <View>
                    {(baike_info.image_url || baike_info.description) && <View className='mg-b-10'>百度百科：</View>}
                    {/.jpg|.png|.jpeg/.test(baike_info.image_url) && <Image className='mg-b-10' src={baike_info.image_url} />}
                    <View className='mg-b-10'>{baike_info.description}</View>
                  </View>}
                </View>
              </View>
            )
          })}
        </View>}
        {/*果蔬*/}
        {type === 4 && result && <View className='mg-b-120'>
          {result.map((res, index) => {
            const {name, score} = res;
            return (
              <View className='pd-t-10 pd-b-10 flex-row' key={String(index)}>
                <View className='mg-r-10'>{index + 1}.</View>
                <View className='flex-column'>
                  <View className='mg-b-10'>果蔬食材名称：{name}</View>
                  <View className='mg-b-10'>置信度：{Number(score).toFixed(4)}</View>
                </View>
              </View>
            )
          })}
        </View>}
        {/*菜品*/}
        {type === 5 && result && <View className='mg-b-120'>
          {result.map((res, index) => {
            const {name, calorie, probability, has_calorie, baike_info} = res;
            return (
              <View className='pd-t-10 pd-b-10 flex-row' key={String(index)}>
                <View className='mg-r-10'>{index + 1}.</View>
                <View className='flex-column'>
                  <View className='mg-b-10'>菜名：{name}</View>
                  {has_calorie && <View className='mg-b-10'>卡路里：{calorie}/100g</View>}
                  <View className='mg-b-10'>置信度：{Number(probability).toFixed(4)}</View>
                  {typeof baike_info !== 'undefined' && JSON.stringify(baike_info) !== '{}' && <View>
                    {(baike_info.image_url || baike_info.description) && <View className='mg-b-10'>百度百科：</View>}
                    {/.jpg|.png|.jpeg/.test(baike_info.image_url) && <Image className='mg-b-10' src={baike_info.image_url} />}
                    <View className='mg-b-10'>{baike_info.description}</View>
                  </View>}
                </View>
              </View>
            )
          })}
        </View>}
        {/*地标*/}
        {type === 6 && result && <View className='mg-b-120'>
          <View className='pd-t-10 pd-b-10 flex-row'>
            <View className='flex-column'>
              <View className='mg-b-10'>地标名称：{result.landmark ? result.landmark : '无法识别'}</View>
            </View>
          </View>
        </View>}
        {/*货币*/}
        {type === 7 && result && <View className='mg-b-120'>
          <View className='pd-t-10 pd-b-10 flex-row'>
            <View className='flex-column'>
              <View className='mg-b-10'>货币名称：{result.currencyName ? result.currencyName : '无法识别'}</View>
              {result.hasdetail && <View>
                <View className='mg-b-10'>货币代码：{result.currencyCode}</View>
                <View className='mg-b-10'>货币面值：{result.currencyDenomination}</View>
                <View className='mg-b-10'>货币年份：{result.year}</View>
              </View>}
            </View>
          </View>
        </View>}
        {/*商标*/}
        {type === 8 && result && <View className='mg-b-120'>
          {result.map((res, index) => {
            const {name, probability} = res;
            return (
              <View className='pd-t-10 pd-b-10 flex-row' key={String(index)}>
                <View className='mg-r-10'>{index + 1}.</View>
                <View className='flex-column'>
                  <View className='mg-b-10'>商标名称：{name ? name : '无法识别'}</View>
                  <View className='mg-b-10'>置信度：{Number(probability).toFixed(4)}</View>
                  {res.type === 0 && <View className='mg-b-10'>来源于：1千种高优商标识别结果</View>}
                  {res.type === 1 && <View className='mg-b-10'>来源于：2万类logo库的结果</View>}
                  {res.type !== 0 && res.type !== 1 && <View className='mg-b-10'>来源于：自定义logo库结果</View>}
                </View>
              </View>
            )
          })}
        </View>}
      </ScrollView>

      <View className='flex-column choose-type of-hidden text-center w100'>
        <View className='bd-radius-30 bg-black white w100 h60 lh-60' animation={animationData8} onClick={() => chooseImage(8)}>商标</View>
        <View className='bd-radius-30 bg-black white mg-t-10 w100 h60 lh-60' animation={animationData7} onClick={() => chooseImage(7)}>货币</View>
        <View className='bd-radius-30 bg-black white mg-t-10 w100 h60 lh-60' animation={animationData6} onClick={() => chooseImage(6)}>地标</View>
        <View className='bd-radius-30 bg-black white mg-t-10 w100 h60 lh-60' animation={animationData5} onClick={() => chooseImage(5)}>菜品</View>
        <View className='bd-radius-30 bg-black white mg-t-10 w100 h60 lh-60' animation={animationData4} onClick={() => chooseImage(4)}>果蔬</View>
        <View className='bd-radius-30 bg-black white mg-t-10 w100 h60 lh-60' animation={animationData3} onClick={() => chooseImage(3)}>植物</View>
        <View className='bd-radius-30 bg-black white mg-t-10 w100 h60 lh-60' animation={animationData2} onClick={() => chooseImage(2)}>动物</View>
        <View className='bd-radius-30 bg-black white mg-t-10 w100 h60 lh-60' animation={animationData1} onClick={() => chooseImage(1)}>通用</View>
      </View>
      <View className='iconfont font50 text-center w100 h100 lh-100 white bd-radius-50 choose-img' style={{backgroundColor: color}} onClick={() => createAnimation()}>&#xe644;</View>
    </View>
  )
}

ObjRecognition.config = {
  navigationBarTitleText: '图片识物'
};

export default ObjRecognition;
