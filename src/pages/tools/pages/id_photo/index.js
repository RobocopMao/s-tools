import Taro, {useEffect, useRouter, useState} from '@tarojs/taro'
import { useSelector, useDispatch } from '@tarojs/redux'
import {View} from '@tarojs/components'
import {aiAccessToken, aiBodySeg} from '../../../../apis/baidu_ai'
import {useAsyncEffect} from '../../../../utils'
import {setBdAiToken} from '../../../../redux/user/action'
import base64src from '../../../../utils/base64src'
import './index.scss'

function IDPhoto() {
  const router = useRouter();
  const pConfig = useSelector(state => state.pConfig);
  const user = useSelector(state => state.user);
  const {bdAiAK, bdAiSK} = pConfig.config;
  const {access_token} = user.bdAiToken;
  const dispatch = useDispatch();
  const [imageUrl, setImageUrl] = useState('');
  const [foregroundUrl, setForegroundUrl] = useState('');
  const [foreground, setForeground] = useState(null);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [inch, setInch] = useState(1);
  const [color, setColor] = useState('');

  const imgInch = {
    1: {w: 295, h: 413},
    2: {w: 413, h: 626}
  };

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

  // 获取canvas的宽高
  useEffect(() => {
    Taro.getImageInfo({
      src: imageUrl,
      success(res) {
        // console.log(res);
        const {width, height} = res;
        setForeground({width, height});
      }
    });
  }, [imageUrl]);

  // 获取前景图
  const getForeground = async (path) => {
    Taro.getFileSystemManager().readFile({
      filePath: path,
      encoding: 'base64', // base64格式的图片
      async success(res) {
        const res1 = await aiBodySeg({image: encodeURI(res.data), access_token, type: 'foreground'});
        const {foreground} = res1;
        const base64Data = `data:image/png;base64,${foreground}`;
        const _base64src = await base64src(base64Data);  // 将base64转成二进制保存在本地，因为base64图片真机在canvas上不显示
        setForegroundUrl(_base64src);
      },
      fail(res) {
        Taro.showToast({title: res.errMsg, icon: 'none'});
      }
    });
  };

  // 选择图片
  const chooseImage = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      async success(res) {
        const {tempFilePaths} = res;
        setImageUrl(tempFilePaths[0]); // 本地展示
        // 识别图片
        getForeground(tempFilePaths[0]);
      }
    })
  };

  // 保存证件照
  const saveImg = () => {
    if (!foregroundUrl) {
      Taro.showToast({title: '请上传证件照', icon: 'none'});
      return;
    }
    Taro.showToast({
      title: '正在保存',
      icon: 'none',
      duration: 6000
    });

    const ctx = Taro.createCanvasContext('IDPhoto');
    const {w, h} = imgInch[inch];
    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();

    ctx.save();
    const {width, height} = foreground;
    ctx.drawImage(foregroundUrl, 0, 0, width, height, 0, 0, w, h);
    ctx.draw(true, () => {
      IDPhotoCanvasToImg();
    });

  };

  // canvas 转图片
  const IDPhotoCanvasToImg = async () => {
    const {w, h} = imgInch[inch];
    Taro.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: w,
      height: h,
      // destWidth: width * pixelRatio * 2,
      // destHeight: height * pixelRatio * 2,
      canvasId: 'IDPhoto',
    }).then(res => {
      // console.log(res);
      // console.log('canvasToImg end');
      saveImgToPhotosAlbum(res.tempFilePath);

    }).catch(err => {
      // console.log('canvasToImg err');
      console.log(err);
    })
  };

  // 保存到相册
  const saveImgToPhotosAlbum = (path) => {
    //保存到系统相册
    //裁剪后图片的临时路径：e.detail
    Taro.saveImageToPhotosAlbum({
      filePath: path,
      success(res) {
        Taro.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail(err) {
        Taro.hideToast();
        Taro.showModal({
          title: '提示',
          content: '图片保存失败,请尝试重新保存'
        })
      }
    });
  };

  const setImgInch = (type) => {
    setInch(type);
  };

  return (
    <View className='id-photo flex-column flex-col-center'>
      <View className='id-photo-img mg-t-30 relative of-hidden'>
        {foregroundUrl && <Image className='id-photo-img' src={foregroundUrl} style={{backgroundColor: bgColor}} />}
        {!foregroundUrl && <View className='iconfont text-center'>&#xe60c;</View>}
      </View>
      <View className='flex-row mg-t-30 w295'>
        <View className='h60 lh-60'>选择背景颜色：</View>
        <View className={`mg-l-30 circle h60 w60 bg-white bg-select ${bgColor === '#ffffff' ? 'bg-selected' : ''}`} onClick={() => setBgColor('#ffffff')} />
        <View className={`mg-l-30 circle h60 w60 bg-red bg-select ${bgColor === '#F44336' ? 'bg-selected' : ''}`} onClick={() => setBgColor('#F44336')} />
        <View className={`mg-l-30 circle h60 w60 bg-blue bg-select ${bgColor === '#4481EB' ? 'bg-selected' : ''}`} onClick={() => setBgColor('#4481EB')} />
      </View>
      <View className='flex-row mg-t-30 w295'>
        <View className='h60 lh-60'>选择尺寸：</View>
        <View className={`mg-l-30 h60 w120 bd-radius bg-white text-center lh-60 bg-select ${inch === 1 ? 'bg-selected' : ''}`} onClick={() => setImgInch(1)}>1寸</View>
        <View className={`mg-l-30 h60 w120 bd-radius bg-white text-center lh-60 bg-select ${inch === 2 ? 'bg-selected' : ''}`} onClick={() => setImgInch(2)}>2寸</View>
      </View>
      <View className='flex-row mg-t-30 w295 color-a1 font24'>
        <View>Tips：</View>
        <View className='flex-grow-1'>
          <View>本功能只提供简单快速的更换背景</View>
          <View>但还是建议使用专业的作图工具</View>
        </View>
      </View>
      <View className='iconfont font50 text-center w100 h100 lh-100 white bd-radius-50 choose-img' style={{backgroundColor: color}} onClick={() => chooseImage()}>&#xe644;</View>
      <View className='iconfont font50 text-center w100 h100 lh-100 white bd-radius-50 save-img' style={{backgroundColor: color}} onClick={() => saveImg()}>&#xe6bc;</View>
      <View className='h0 of-hidden relative' style={{alignSelf: 'flex-start'}}>
        <Canvas className='id-photo-canvas'  canvasId='IDPhoto' id='IDPhoto' style={{width: `${imgInch[inch].w}Px`, height: `${imgInch[inch].h}Px`}} />
      </View>
    </View>
  )
}

IDPhoto.config = {
  navigationBarTitleText: '证件照换背景'
};

export default IDPhoto;
