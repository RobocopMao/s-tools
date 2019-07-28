import Taro, {useEffect, useState} from '@tarojs/taro'
import {View, Text, ScrollView, Navigator, Button, Video} from '@tarojs/components'
import './video.scss'

function VideoBox() {
  const [video, setVideo] = useState('');
  const [poster, setPoster] = useState('');
  const [title, setTitle] = useState('');
  const [source, setSource] = useState('');
  const [postTime, setPostTime] = useState('');

  useEffect(() => {
    const {video, poster, title, source, postTime} = this.$router.params;
    setVideo(video);
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

    onShareAppMessage();
  }, [video, poster, postTime, source, title]);

  const onShareAppMessage = () => {
    this.$scope.onShareAppMessage = (res) => {
      return {
        title,
        path: `/pages/video/video?video=${video}&poster=${poster}&title=${title}&source=${source}&postTime=${postTime}`,
      }
    };
  };

  const playError = () => {
    Taro.showToast({title: '很抱歉！视频播放错误', icon: 'none'});
  };

  return (
    <View className='video h100-per white'>
      <View className='w100-per'>
        <View className='font36 mg-20'>{title}</View>
        <View className='font24 mg-l-20 mg-r-20 mg-b-20'>
          <Text className='mg-r-20'>{source}</Text>
          <Text>{postTime}</Text>
        </View>
        <Video
          className='w100-per'
          id='videoPlayer'
          src={video}
          poster={poster}
          showMuteBtn={true}
          title={title}
          onError={() => playError()}
        />
      </View>
    </View>
  )
}

VideoBox.config = {
  navigationBarTitleText: '视频',
  backgroundColor: '#000',
  navigationBarBackgroundColor: '000',
  navigationBarTextStyle: 'white'
};

export default VideoBox;
