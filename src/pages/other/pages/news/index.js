import Taro, {useEffect, useRouter, useState} from '@tarojs/taro'
import { View, Text, ScrollView, Image, Video } from '@tarojs/components'
import {useSelector} from '@tarojs/redux'
import moment from 'moment'
import { getNewsTypes, getNewsList } from '../../../../apis/news'
import {useAsyncEffect} from '../../../../utils'
import './index.scss'

function News() {
  const router = useRouter();
  const pConfig = useSelector(state => state.pConfig);
  const user = useSelector(state => state.user);
  const {showing} = pConfig.config;
  const {windowHeight} = user.systemInfo;
  const [newsTypes, setNewsTypes] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [typeId, setTypeId] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingErr, setLoadingErr] = useState(false);
  const [color, setColor] = useState('');

  // 设置color
  useEffect(() => {
    const {color} = router.params;
    setColor(color);
    Taro.setNavigationBarColor({frontColor: '#ffffff', backgroundColor: color});
  }, []);

  useAsyncEffect(() => {
    if (typeof showing === 'undefined') {  // 等待showing更新
      return;
    }
    if (!showing) {
      Taro.reLaunch({url: '/pages/home/index/index'});
    } else {
      initNews();
    }
  }, [showing]);

  const [scrollHeight, setScrollHeight] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    const query = Taro.createSelectorQuery();
    query
      .select('#newsTypes')
      .boundingClientRect(rect => {
        // console.log(rect);
        let height = rect ? rect.height : 36;
        const scrollHeight = windowHeight - height;
        setScrollHeight(scrollHeight);
      })
      .exec()
  }, [scrollHeight, showing]);

  // 初始化数据
  const initNews = async () => {
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
  };

  const _getNewsList = async (typeId, page) => {
    setIsLoading(true);
    setLoadingErr(false);

    let count = 0;
    let tId = setInterval(() => {
      // console.log(count);
      if (count > 10) {
        setLoadingErr(true);
        setIsLoading(false);
        clearInterval(tId);
      }
      count++;
    }, 1000);

    const res = await getNewsList({typeId, page});
    setNewsList([...newsList, ...res]);
    setPage(prevPage => prevPage + 1);
    setIsLoading(false);
    clearInterval(tId);
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
    if (!isLoading) {
      _getNewsList(typeId, page);
    }

  };

  const goNewsDetails = ({newsId, videoList, imgList, title, source, postTime}) => {
    if (newsId !== '此类型无详情id') {
      const _newsId = newsId.split('_')[0];
      Taro.navigateTo({url: `/pages/other/pages/news_details/index?newsId=${_newsId}&color=${color}`});
    } else {
      if (typeId === 522 && !videoList) {
        Taro.showToast({title: '视频资源未找到', icon: 'none'});
      } else {
        Taro.navigateTo({url: `/pages/other/pages/video/index?&video=${videoList[0]}&poster=${imgList[0]}&title=${title}&source=${source}&postTime=${postTime}&color=${color}`});
      }
    }
  };

  return (
    <View className='news'>
      {showing && <ScrollView
        className='news-types flex-row flex-col-center bg-white font32'
        scrollX
        scrollWithAnimation
        style={{height: '36px'}}
        id='newsTypes'
      >
        {newsTypes.map((type) => {
          const {typeId, typeName, active} = type;
          return (
            <View key={typeId} className={`inline-block pd-t-16 pd-b-16 pd-r-20 pd-l-20 relative ${active ? 'type-active' : ''}`} onClick={() => changeTypes(typeId)}>
              <Text>{typeName}</Text>
              {active && <View className='w30 h6 type-btn-line' style={{backgroundColor: color}} />}
            </View>
          )
        })}
      </ScrollView>}
      {showing && <ScrollView
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
                    <Button className='iconfont play-btn w80 h80 lh-80 bg-no white font80 pd-0'>&#xe660;</Button>
                  </View>
                  <Video
                    className='w100-per'
                    src=''
                    poster=''
                  />
                </View>}
              </View>
              <View className='flex-row font24 pd-b-20'>
                <Text className='mg-r-20'>{source}</Text>
                {postTime && <Text>{moment(Number(postTime) ? Number(postTime) : postTime).format('YYYY-MM-DD HH:mm')}</Text>}
              </View>
              <View className='line' />
            </View>
          )
        })}
        {isLoading && <View className='pd-20 text-center'>正在加载中……</View>}
        {loadingErr && <View className='pd-20 text-center' onClick={() => _getNewsList(typeId, page)}>加载失败，请重试</View>}
      </ScrollView>}
    </View>
  )
}

News.config = {
  navigationBarTitleText: '新闻Lite'
};

export default News;
