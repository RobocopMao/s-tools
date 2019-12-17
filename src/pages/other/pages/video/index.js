import Taro, {useEffect, useRouter, useShareAppMessage, useState} from '@tarojs/taro'
import {View, Text, Button, Video} from '@tarojs/components'
import {useSelector} from '@tarojs/redux'
import moment from 'moment'
import './index.scss'

function VideoBox() {
  const router = useRouter();
  const pConfig = useSelector(state => state.pConfig);
  const user = useSelector(state => state.user);
  const {windowWidth} = user.systemInfo;
  const {showing} = pConfig.config;
  const [videoUrl, setVideoUrl] = useState('');
  const [poster, setPoster] = useState('');
  const [title, setTitle] = useState('');
  const [source, setSource] = useState('');
  const [postTime, setPostTime] = useState('');

  useEffect(() => {
    if (typeof showing === 'undefined') {  // 等待showing更新
      return;
    }
    if (!showing) {
      Taro.reLaunch({url: '/pages/home/index/index'});
    }
  }, [showing]);

  useEffect(() => {
    const {poster, title, source, postTime} = router.params;
    setVideoUrl(router.params.video);
    setPoster(poster);
    setTitle(title);
    setSource(source);
    setPostTime(postTime);

    // 设置导航栏title
    if (title) {
      Taro.setNavigationBarTitle({title: title});
    }

    // 全屏播放视频
    let videoContext = Taro.createVideoContext('videoPlayer');
    // videoContext.requestFullScreen();
    videoContext.play();

    return () => {
      videoContext = null; // 组件卸载时销毁videoContext
    }
  }, []);

  // 显示转发按钮
  useEffect(() => {
    Taro.showShareMenu({
      withShareTicket: true
    });
  }, []);

  // 转发
  useShareAppMessage(res => {
    return {
      title,
      path: `/pages/other/pages/video/index?video=${videoUrl}&poster=${poster}&title=${title}&source=${source}&postTime=${postTime}&from=SHARE`,
    }
  });

  const playError = () => {
    Taro.showToast({title: '很抱歉！视频播放错误', icon: 'none'});
  };

  const goHome = () => {
    Taro.reLaunch({url: '/pages/home/index/index'});
  };

  return (
    <View className='video h100-per white'>
      {showing && <View className='w100-per'>
        <Video
          className='w100-per'
          style={{height: `${windowWidth / 300 * 225}px`}}
          id='videoPlayer'
          src={videoUrl}
          poster={poster}
          showMuteBtn={true}
          enablePlayGesture
          title={title}
          onError={() => playError()}
        />
        <View className='font24 mg-20'>
          <Text className='mg-r-20'>{source}</Text>
          <Text>{moment(Number(postTime) ? Number(postTime) : postTime).format('YYYY-MM-DD HH:mm')}</Text>
        </View>
        <View className='font36 mg-l-20 mg-r-20'>{title}</View>
      </View>}
      <View className='flex-column bg-no fixed-btn'>
        <Button className='iconfont w64 h64 lh-64 circle bd-white pd-0 font44 black' openType='share'>&#xe649;</Button>
        {router.params.from === 'SHARE' && <Button className='iconfont w64 h64 lh-64 circle bd-white pd-0 font50 black mg-t-20' onClick={() => goHome()}>&#xe6b7;</Button>}
      </View>
    </View>
  )
}

VideoBox.config = {
  navigationBarTitleText: '视频详情',
  backgroundColor: '#000000',
  navigationBarBackgroundColor: '#000000',
  navigationBarTextStyle: 'white'
};

export default VideoBox;
