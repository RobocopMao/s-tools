import Taro, {useEffect, useState} from '@tarojs/taro'
import { View, Text, ScrollView, Image, Video } from '@tarojs/components'
import { useAsyncEffect } from '../../utils'
import { getNewsTypes, getNewsList } from '../../apis/news'
import './news.scss'

function News() {
  const [scrollHeight, setScrollHeight] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    Taro.getSystemInfo({
      success: res => {
        const query = Taro.createSelectorQuery();
        query
          .select('#newsTypes')
          .boundingClientRect(rect => {
            const scrollHeight = res.windowHeight - rect.height;
            setScrollHeight(scrollHeight);
          })
          .exec()
      }
    })
      .then(res => {})
  }, [scrollHeight]);

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
    let newArr = arr1.concat(arr2);
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
    console.log(newsList);
    _getNewsList(typeId, 1);
  };

  const scrollToLower = () => {
    _getNewsList(typeId, page);
  };

  const goNewsDetails = (newsId, videoList) => {
    if (newsId !== '此类型无详情id') {
      const _newsId = newsId.split('_')[0];
      Taro.navigateTo({url: `../../pages/news_details/news_details?newsId=${_newsId}`});
    } else {
      if (typeId === 522 && !videoList) {
        Taro.showToast({title: '视频资源未找到', icon: 'none'});
      }}
  };

  return (
    <View className='news'>
      <ScrollView
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
      </ScrollView>
      <ScrollView
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
            <View className='flex-column mg-l-20 mg-r-20 pd-t-20' key={newsId + index} onClick={() => goNewsDetails(newsId, videoList)}>
              <View className={`${videoList ? 'flex-column' : 'flex-row'} space-between mg-b-10`}>
                <View className={`black font36 lh-42 ${videoList ? '' : 'mg-r-20'}`}>{title}</View>
                {imgList && !videoList && <View>
                  {imgList.map((img) => {
                    return (
                      <Image className='bd-radius' src={img} key={img} style={{width: '100px', height: '60px'}} />
                    )
                  })}
                </View>}
                {videoList && <Video
                  className='mg-t-20 mg-b-10 w100-per'
                  src={videoList[0]}
                  poster={imgList[0]}
                />}
              </View>
              <View className='flex-row font24 pd-b-20 '>
                <Text className='mg-r-20'>{source}</Text>
                {postTime && <Text>{postTime}</Text>}
              </View>
              <View className='line' />
            </View>
          )
        })}
      </ScrollView>
    </View>
  )
}

News.config = {
  navigationBarTitleText: '新闻Lite'
};

export default News;
