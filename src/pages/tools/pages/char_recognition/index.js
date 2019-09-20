import Taro, {useEffect, useRouter, useState} from '@tarojs/taro'
import {View, ScrollView} from '@tarojs/components'
import { useSelector, useDispatch } from '@tarojs/redux'
import { aiAccessToken, aiOcrGeneralBasic, aiOcrAccurateBasic } from '../../../../apis/baidu_ai'
import {useAsyncEffect} from '../../../../utils'
import {setBdAiToken} from '../../../../redux/user/action'
import './index.scss'

function CharRecognition() {
  const router = useRouter();
  const pConfig = useSelector(state => state.pConfig);
  const user = useSelector(state => state.user);
  const {bdAiAK, bdAiSK} = pConfig.config;
  const {access_token} = user.bdAiToken;
  const {windowHeight} = user.systemInfo;
  const dispatch = useDispatch();
  const [imageUrl, setImageUrl] = useState('');
  const [wordsResult, setWordsResult] = useState([]);
  const [scrollTop, setScrollTop] = useState(0);
  const [color, setColor] = useState('');

  // 设置color
  useEffect(() => {
    const {color} = router.params;
    setColor(color);
    Taro.setNavigationBarColor({frontColor: '#ffffff', backgroundColor: color});
  }, []);

  // 获取token
  useAsyncEffect(async () => {
    if (typeof access_token === 'undefined') {
      const token = await aiAccessToken({grant_type: 'client_credentials', client_id: bdAiAK, client_secret: bdAiSK});
      dispatch(setBdAiToken(token));
    }
  }, []);

  // // 获取图片识别信息
  // useAsyncEffect(async () => {
  //
  // }, [imageUrl]);

  const chooseImage = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      async success(res) {
        const {tempFilePaths} = res;
        setImageUrl(tempFilePaths[0]); // 本地展示
        // 清空上次识别结果
        setWordsResult([]);

        // 识别图片
        generalRecognizeChar(tempFilePaths[0]);
      }
    })
  };

  // 通用识别图片文字
  const generalRecognizeChar = (path) => {
    Taro.getFileSystemManager().readFile({
      filePath: path,
      encoding: 'base64', // base64格式的图片
      async success(res) {
        const res1 = await aiOcrGeneralBasic({image: encodeURI(res.data), access_token});
        const {words_result} = res1;
        setWordsResult(words_result);
        setScrollTop(prev => prev === 0 ? 0.1 : 0);
      },
      fail(res) {
        Taro.showToast({title: res.errMsg, icon: 'none'});
      }
    });
  };

  // 高精度识别图片文字
  const accurateRecognizeChar = async () => {
    Taro.getFileSystemManager().readFile({
      filePath: imageUrl,
      encoding: 'base64', // base64格式的图片
      async success(res) {
        const res1 = await aiOcrAccurateBasic({image: encodeURI(res.data), access_token});
        const {words_result} = res1;
        setWordsResult(words_result);
        setScrollTop(prev => prev === 0 ? 0.1 : 0);
      },
      fail(res) {
        Taro.showToast({title: res.errMsg, icon: 'none'});
      }
    });
  };

  const previewImage = () => {
    Taro.previewImage({urls: [imageUrl]});
  };

  const copyWords = (data) => {
    Taro.setClipboardData({data});
  };

  return (
    <View className='char-recognition'>
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
        {!wordsResult.length && <View className='w100-per h100-per flex-column flex-row-center flex-col-center text-center'>
          <View className='iconfont font70 mg-b-10'>&#xe6b0;</View>
          <View>结果展示区</View>
        </View>}
        {wordsResult.map((words, index) => {
          return (
            <View className='pd-t-10 pd-b-10 flex-row' key={String(index)} onLongPress={() => copyWords(words.words)}>
              <View className='mg-r-10'>{index + 1}.</View>
              <View>{words.words}</View>
            </View>
          )
        })}
        {wordsResult.length && <View className='flex-column mg-t-30'>
          <View className='color-96'>Tips: 长按识别结果可以复制内容哦!</View>
          <View className='flex-row mg-t-10 mg-b-20'>
            <View className='mg-r-20 black'>识别不准确？</View>
            <View style={{color, textDecoration: 'underline'}} onClick={() => accurateRecognizeChar()}>点我试试高精度识别</View>
          </View>
        </View>}
      </ScrollView>
      <View className='iconfont font50 text-center w100 h100 lh-100 white bd-radius-50 choose-img' style={{backgroundColor: color}} onClick={() => chooseImage()}>&#xe644;</View>
    </View>
  )
}

CharRecognition.config = {
  navigationBarTitleText: '通用文字识别'
};

export default CharRecognition;
