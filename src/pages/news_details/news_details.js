import Taro, {useState} from '@tarojs/taro'
import { View, Text, RichText } from '@tarojs/components'
import { useAsyncEffect } from '../../utils'
import { getNewsDetails } from '../../apis/news'
import './news_details.scss'

function NewsDetails() {
  // const [newsId, setNewsId] = useState('');
  const [newsDetails, setNewsDetails] = useState({});
  const [newsContent, setNewsContent] = useState('');

  useAsyncEffect(async () => {
    const {newsId} = this.$router.params;
    const res = await getNewsDetails({newsId});
    setNewsDetails(res);
    let content = res.content;
    for (let [i, v] of res.images.entries()) {
      let reg = new RegExp(v.position);
      content = content.replace(reg, '<p><img src="' + v.imgSrc + '" style="width: 100%;margin-top: 10px;margin-bottom: 10px;"></p>');
    }
    console.log(content);
    setNewsContent(content);

  }, []);

  return (
    <View className='news-details flex-column bg-white h100-per'>
      <View className='pd-20 font36 black bold'>{newsDetails.title}</View>
      <View className='pd-l-20 pd-r-20 pd-b-20 font24'>{newsDetails.source} {newsDetails.ptime}</View>
      <View className='pd-l-20 pd-r-20 pd-b-20 bg-white'>
        <RichText nodes={newsContent} />
      </View>
    </View>
  )
}

NewsDetails.config = {
  navigationBarTitleText: ''
};

export default NewsDetails;
