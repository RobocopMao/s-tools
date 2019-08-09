import Taro, {useEffect, useState} from '@tarojs/taro'
import {View, Text, ScrollView, Image} from '@tarojs/components'
import moment from 'moment'
import { getGirlsImgListRandom } from '../../apis/girls'
import { useAsyncEffect } from '../../utils';
// import downloadImg from '../../assets/images/download.png';
import './girls.scss'
import {getProductList, getRemoteConfig, user_id} from '../../apis/config';

function Girls() {
  const [productConfig, setProductConfig] = useState({});
  const [isLoading, setIsLoading] = useState(false); // 加载提示
  const [col1, setCol1] = useState([]);
  const [col2, setCol2] = useState([]);
  const [scrollHeight, setScrollHeight] = useState(0); // 可使用窗口高度

  useAsyncEffect(async () => {
    let res = await getProductList({user_id});
    const {secret, productId} = res.find((v, i, arr) => {
      return Number(v.productId) === 50005;  // 50005是该小程序的productId
    });
    let res1 = await getRemoteConfig({user_id, secret, product_id: productId});
    const productConfig = JSON.parse(res1.productConfig);
    // console.log(productConfig);
    setProductConfig(productConfig);
    if (!productConfig.girls) {
      Taro.reLaunch({url: '../../pages/index/index'});
    } else {
      getImgList();
    }
  }, []);

  useEffect(() => {
    Taro.getSystemInfo({
      success: res => {
        setScrollHeight(res.windowHeight);
      }
    })
      .then(res => {})
  }, [scrollHeight]);

  useEffect(() => {
    // 显示转发按钮
    Taro.showShareMenu({
      withShareTicket: true
    });
  }, []);

  // 随机获取图片
  const getImgList = async () => {
    setIsLoading(true);
    let res = await getGirlsImgListRandom();
    let _col1 = [];
    let _col2 = [];
    for (let [i, v] of res.entries()) {
      if ((i + 1) % 2 !== 0) { // 奇数
        _col1.push(v);
      } else {
        _col2.push(v);
      }
    }
    let _col11 = col1.concat(_col1);
    let _col21 = col2.concat(_col2);
    setCol1(_col11);
    setCol2(_col21);
    // setTotalPage(res.totalPage);
    setIsLoading(false);
  };

  // 滑动到底部的事件处理函数
  const scrollToLower = () => {
    // 设置page
    // setPage(prevPage => (prevPage === totalPage ? totalPage : prevPage + 1));
    getImgList();
  };

  // const saveImageToPhotosAlbum = (url) => {
  //   Taro.getSetting({ // 获取设置
  //     success(res) {
  //       if (!res.authSetting['scope.writePhotosAlbum']) {
  //         Taro.authorize({ // 相册授权
  //           scope: 'scope.writePhotosAlbum',
  //           success() {
  //             saveImage(url);
  //           },
  //           fail() {
  //             Taro.showToast({title: '相册授权失败，请在设置里面开启', icon: 'none'});
  //           }
  //         })
  //       } else {
  //         saveImage(url);
  //       }
  //     }
  //   })
  // };

  // 保存图片
  // const saveImage = (url) => {
  //   Taro.getImageInfo({  // 获取图片信息
  //     src: url,
  //     success (res1) {
  //       console.log(res1);
  //       Taro.saveImageToPhotosAlbum({  // 保存图片到相册
  //         filePath: res1.path,
  //         success(res2) {
  //           Taro.showToast({title: '保存图片成功', icon: 'none'});
  //         },
  //         fail() {
  //           Taro.showToast({title: '保存图片失败', icon: 'none'});
  //         }
  //       })
  //     },
  //     fail() {
  //       Taro.showToast({title: '获取网络图片数据失败', icon: 'none'});
  //     }
  //   })
  // };

  // 预览图片
  const previewImg = (url) => {
    Taro.previewImage({
      current: url,
      urls: [url]
    });
  };

  return (
    <View className='girls'>
      {productConfig.girls && <ScrollView
        className=''
        scrollY
        scrollWithAnimation
        style={{height: `${scrollHeight}px`}}
        onScrollToLower={() => scrollToLower()}
      >
        <View className='flex-row'>
          <View className='flex-column col1'>
            {col1.map((img, index) => {
              return (
                <View className='bd-box of-hidden img-box relative' key={img.imageUrl + '_col1_' + index + '_' + moment().format('x')}>
                  <View className='mg-t-10 mg-l-10 of-hidden' onClick={() => previewImg(img.imageUrl)}>
                    <Image className='img' src={img.imageUrl} />
                  </View>
                  {/*<View className='w68 h68 dl-btn'>*/}
                    {/*<Button className='w68 h68 circle bd-no pd-0  flex-row flex-col-center flex-row-center bg-no' onClick={() => saveImageToPhotosAlbum(img.imageUrl)}>*/}
                      {/*<Image className='w60 h60' src={downloadImg} />*/}
                    {/*</Button>*/}
                  {/*</View>*/}
                </View>
              )
            })}
          </View>
          <View className='flex-column col2'>
            {col2.map((img, index) => {
              return (
                <View className='bd-box of-hidden img-box relative' key={img.imageUrl + '_col2_' + index + '_' + moment().format('x')}>
                  <View className='mg-t-10 mg-l-10 mg-r-10 of-hidden' onClick={() => previewImg(img.imageUrl)}>
                    <Image className='img' src={img.imageUrl} />
                  </View>
                  {/*<View className='w68 h68 dl-btn'>*/}
                    {/*<Button className='w68 h68 circle bd-no pd-0  flex-row flex-col-center flex-row-center bg-no' onClick={() => saveImageToPhotosAlbum(img.imageUrl)}>*/}
                      {/*<Image className='w60 h60' src={downloadImg} />*/}
                    {/*</Button>*/}
                  {/*</View>*/}
                </View>
              )
            })}
          </View>
        </View>
        <View className='flex-row flex-row-center font26 pd-t-40 pd-b-40'>
          {isLoading && <Text>一大波美女正向你扑来...</Text>}
          {/*{page === totalPage && <Text>哇！美女被你看光了</Text>}*/}
        </View>
      </ScrollView>}
    </View>
  )
}

Girls.config = {
  navigationBarTitleText: '福利养眼图',
};

export default Girls;
