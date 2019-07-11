import Taro, {useState, useEffect} from '@tarojs/taro'
import { View, RichText, Button, Image } from '@tarojs/components'
import { useAsyncEffect } from '../../utils'
import { getNewsDetails } from '../../apis/news'
import shareImg from '../../assets/images/share.png'
import './news_details.scss'

function NewsDetails() {
  const [newsId, setNewsId] = useState('');
  const [newsDetails, setNewsDetails] = useState({});
  const [newsContent, setNewsContent] = useState('');

  useAsyncEffect(async () => {
    const {newsId} = this.$router.params;
    setNewsId(newsId);
    const res = await getNewsDetails({newsId});
    setNewsDetails(res);
    let content = res.content;
    for (let [i, v] of res.images.entries()) {
      let reg = new RegExp(v.position);
      content = content.replace(reg, '<p><img src="' + v.imgSrc + '" style="width: 100%;margin-top: 10px;margin-bottom: 10px;"></p>');
    }
    setNewsContent(content);
  }, []);

  useEffect(() => {
    if (newsDetails.title) {
      Taro.setNavigationBarTitle({title: newsDetails.title});
    }
  }, [newsDetails]);

  const onShareAppMessage = () => {
    return {
      title: newsDetails.title,  // 不生效,title还是undefined
      path: `pages/news_details/news_details?newsId=${newsId}`,
    }
  };

  return (
    <View className='news-details flex-column bg-white h100-per'>
      <View className='pd-20 font36 black bold'>{newsDetails.title}</View>
      <View className='pd-l-20 pd-r-20 pd-b-20 font24'>{newsDetails.source} {newsDetails.ptime}</View>
      <View className='pd-l-20 pd-r-20 pd-b-20 bg-white'>
        <RichText nodes={newsContent} />
      </View>
      <Button className='w68 h68 circle bd-no pd-0 flex-row flex-col-center flex-row-center share-btn' openType='share'>
        <Image className='w60 h60' src={shareImg} />
      </Button>
    </View>
  )
}

NewsDetails.config = {
  navigationBarTitleText: ''
};

export default NewsDetails;
