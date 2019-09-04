import Taro, {useEffect, useState} from '@tarojs/taro'
import {View, Text, ScrollView, Image} from '@tarojs/components'
import {useSelector} from '@tarojs/redux'
import moment from 'moment'
import { getGirlsImgListRandom } from '../../../../apis/girls'
import {useAsyncEffect} from '../../../../utils';
import './index.scss'

function Girls() {
  const pConfig = useSelector(state => state.pConfig);
  const user = useSelector(state => state.user);
  const {girls} = pConfig.config;
  const {windowHeight} = user.systemInfo;
  const [isLoading, setIsLoading] = useState(false); // 加载提示
  const [col1, setCol1] = useState([]);
  const [col2, setCol2] = useState([]);
  // const [scrollHeight, setScrollHeight] = useState(0); // 可使用窗口高度
  const [color, setColor] = useState('');

  // 设置color
  useEffect(() => {
    const {color} = this.$router.params;
    setColor(color);
    Taro.setNavigationBarColor({frontColor: '#ffffff', backgroundColor: color});
  }, []);

  useAsyncEffect(() => {
    if (typeof girls === 'undefined') {  // 等待girls更新
      return;
    }
    if (!girls) {
      Taro.reLaunch({url: '/pages/home/index/index'});
    } else {
      getImgList();
    }
  }, [girls]);

  useEffect(() => {
    // 显示转发按钮
    Taro.showShareMenu({
      withShareTicket: true
    });

    onShareAppMessage();
  }, [color]);

  const onShareAppMessage = () => {
    this.$scope.onShareAppMessage = (res) => {
      return {
        title: '对面的男孩看过来',
        path: `/pages/other/pages/girls/index?color=${color}&from=SHARE`,
      }
    };

  };

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

  // 预览图片
  const previewImg = (url) => {
    Taro.previewImage({
      current: url,
      urls: [url]
    });
  };

  return (
    <View className='girls'>
      {girls && <ScrollView
        className=''
        scrollY
        scrollWithAnimation
        style={{height: `${windowHeight}px`, backgroundColor: color}}
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
                </View>
              )
            })}
          </View>
        </View>
        <View className='flex-row flex-row-center font26 pd-t-40 pd-b-40'>
          {isLoading && <Text className='white'>一大波美女正向你扑来...</Text>}
        </View>
      </ScrollView>}
    </View>
  )
}

Girls.config = {
  navigationBarTitleText: '福利养眼图',
};

export default Girls;
