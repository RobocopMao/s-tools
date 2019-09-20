import Taro, {useState, useEffect, useShareAppMessage} from '@tarojs/taro'
import { View, RichText, Button } from '@tarojs/components'
import moment from 'moment'
import { useAsyncEffect } from '../../../../utils'
import { getNewsDetails } from '../../../../apis/news'
import './index.scss'

function NewsDetails() {
  const [newsId, setNewsId] = useState('');
  const [newsDetails, setNewsDetails] = useState({});
  const [newsContent, setNewsContent] = useState('');
  const [color, setColor] = useState('');

  // 设置color
  useEffect(() => {
    const {color} = this.$router.params;
    setColor(color);
    Taro.setNavigationBarColor({frontColor: '#ffffff', backgroundColor: color});
  }, []);

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

  // 设置导航栏title
  useEffect(() => {
    if (newsDetails.title) {
      Taro.setNavigationBarTitle({title: newsDetails.title});
    }
  }, [newsDetails]);

  // 显示转发按钮
  useEffect(() => {
    Taro.showShareMenu({
      withShareTicket: true
    });
  }, []);

  // 转发
  useShareAppMessage(res => {
    return {
      title: newsDetails.title,
      path: `/pages/other/pages/news_details/index?newsId=${newsId}&color=${color}&from=SHARE`,
    }
  });

  const goHome = () => {
    Taro.reLaunch({url: '/pages/home/index/index'});
  };

  return (
    <View className='news-details flex-column bg-white h100-per'>
      <View className='pd-20 font36 black bold'>{newsDetails.title}</View>
      <View className='pd-l-20 pd-r-20 pd-b-20 font24'>{newsDetails.source} {moment(newsDetails.ptime).format('YYYY-MM-DD HH:mm')}</View>
      <View className='pd-l-20 pd-r-20 pd-b-20 bg-white'>
        <RichText className='font32 lh-50' nodes={newsContent.replace(/原标题：(\S|\s)*/, '')} />
      </View>
      <View className='flex-column bg-no fixed-btn'>
        <Button className='iconfont w64 h64 lh-64 circle bd-no pd-0 font44' style={{color}} openType='share'>&#xe649;</Button>
        {this.$router.params.from === 'SHARE' && <Button className='iconfont w64 h64 lh-64 circle bd-no pd-0 font50 mg-t-20' style={{color}} onClick={() => goHome()}>&#xe6b7;</Button>}
      </View>
    </View>
  )
}

NewsDetails.config = {
  navigationBarTitleText: ''
};

export default NewsDetails;
