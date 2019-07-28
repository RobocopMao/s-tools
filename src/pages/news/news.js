import Taro, {useEffect, useState} from '@tarojs/taro'
import { View, Text, ScrollView, Image, Video } from '@tarojs/components'
import { useAsyncEffect } from '../../utils'
import { getNewsTypes, getNewsList } from '../../apis/news'
import {getProductList, getRemoteConfig, user_id} from '../../apis/config';
import playBtnImg from '../../assets/images/play.png'
import './news.scss'

function News() {
  const [productConfig, setProductConfig] = useState({});

  useAsyncEffect(async () => {
    let res = await getProductList({user_id});
    const {secret, productId} = res.find((v, i, arr) => {
      return Number(v.productId) === 50005;  // 50005是该小程序的productId
    });
    let res1 = await getRemoteConfig({user_id, secret, product_id: productId});
    const productConfig = JSON.parse(res1.productConfig);
    // console.log(productConfig);
    // setProductConfig(productConfig);
    setProductConfig(productConfig);
    if (!productConfig.news) {
      Taro.reLaunch({url: '../../pages/index/index'});
    }
  }, []);

  const [scrollHeight, setScrollHeight] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    Taro.getSystemInfo({
      success: res => {
        const query = Taro.createSelectorQuery();
        query
          .select('#newsTypes')
          .boundingClientRect(rect => {
            // console.log(rect);
            let height = rect ? rect.height : 36;
            const scrollHeight = res.windowHeight - height;
            setScrollHeight(scrollHeight);
          })
          .exec()
      }
    })
      .then(res => {})
  }, [scrollHeight, productConfig]);

  const [newsTypes, setNewsTypes] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [typeId, setTypeId] = useState(0);
  const [page, setPage] = useState(1);

  useAsyncEffect(async () => {
    let res = await getNewsTypes();
    let arr1 = [];
    let arr2 = [];
    for (let [, v] of res.entries()) {
      if (v.typeName === '要闻' || v.typeName === '头条' || v.typeName === '热点') {
        arr1.push(v);
      } else {
        arr2.push(v);
      }
    }
    let newArr = arr1.concat(arr2);  // 事实内容占时去掉
    // let newArr = arr2;
    for (let [i, v] of newArr.entries()) {
      v.active = i === 0;
    }
    setNewsTypes(newArr);
    setTypeId(newArr[0].typeId);
    _getNewsList(newArr[0].typeId, 1);
  }, []);

  const _getNewsList = async (typeId, page) => {
    const res = await getNewsList({typeId, page});
    setNewsList([...newsList, ...res]);
    setPage(prevPage => prevPage + 1);
  };

  const changeTypes = (typeId) => {
    setNewsList([]);
    setPage(1);
    setScrollTop(scrollTop ? 0 : 0.1);
    let types = newsTypes;
    for (let [i, v] of types.entries()) {
      v.active = v.typeId === typeId;
    }
    setNewsTypes(types);
    setTypeId(typeId);
    newsList.splice(0, newsList.length);
    // console.log(newsList);
    _getNewsList(typeId, 1);
  };

  const scrollToLower = () => {
    _getNewsList(typeId, page);
  };

  const goNewsDetails = ({newsId, videoList, imgList, title, source, postTime}) => {
    if (newsId !== '此类型无详情id') {
      const _newsId = newsId.split('_')[0];
      Taro.navigateTo({url: `../../pages/news_details/news_details?newsId=${_newsId}`});
    } else {
      if (typeId === 522 && !videoList) {
        Taro.showToast({title: '视频资源未找到', icon: 'none'});
      } else {
        Taro.navigateTo({url: `../../pages/video/video?&video=${videoList[0]}&poster=${imgList[0]}&title=${title}&source=${source}&postTime=${postTime}`});
      }
    }
  };

  return (
    <View className='news'>
      {productConfig.news && <ScrollView
        className='news-types flex-row flex-col-center bg-white font32'
        scrollX
        scrollWithAnimation
        style={{height: '36px'}}
        id='newsTypes'
      >
        {newsTypes.map((type) => {
          const {typeId, typeName, active} = type;
          return (
            <View key={typeId} className={`inline-block pd-t-16 pd-b-16 pd-r-20 pd-l-20 ${active ? 'type-active' : ''}`} onClick={() => changeTypes(typeId)}>{typeName}</View>
          )
        })}
      </ScrollView>}
      {productConfig.news && <ScrollView
        className='news-list bg-white'
        scrollY
        scrollWithAnimation
        style={{height: `${scrollHeight}px`}}
        enableBackToTop={true}
        lowerThreshold={30}
        scrollTop={scrollTop}
        onScrollToLower={() => scrollToLower()}
      >
        {newsList.map((list, index) => {
          const {title, newsId, imgList, source, digest, postTime, videoList} = list;
          return (
            <View className='flex-column mg-l-20 mg-r-20 pd-t-20' key={newsId + index}
                  onClick={() => goNewsDetails({newsId, videoList, imgList, title, source, postTime})}>
              <View className={`${videoList ? 'flex-column' : 'flex-row'} space-between mg-b-10`}>
                <View className={`black font36 lh-42 ${videoList ? '' : 'mg-r-20'}`}>{title}</View>
                {imgList && !videoList && <View>
                  {imgList.map((img) => {
                    return (
                      <Image className='bd-radius' src={img} key={img} style={{width: '100px', height: '60px'}} />
                    )
                  })}
                </View>}
                {videoList && <View className='mg-t-20 mg-b-10 relative w100-per'>
                  <View className='video-mask flex-row flex-row-center'>
                    {typeId === 522 && <Image className='w100-per h100-per' src={imgList[0]} />}
                    {typeId === 526 && <Image className='w30-per h100-per' src={imgList[0]} />}
                    <Image className='play-btn w60 h60' src={playBtnImg} />
                  </View>
                  <Video
                    className='w100-per'
                    src=''
                    poster=''
                  />
                </View>}
              </View>
              <View className='flex-row font24 pd-b-20 '>
                <Text className='mg-r-20'>{source}</Text>
                {postTime && <Text>{postTime}</Text>}
              </View>
              <View className='line' />
            </View>
          )
        })}
      </ScrollView>}
    </View>
  )
}

News.config = {
  navigationBarTitleText: '新闻Lite'
};

export default News;
