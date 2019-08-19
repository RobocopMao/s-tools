import Taro, { useState, useEffect } from '@tarojs/taro'
import { View, Text, ScrollView, RichText } from '@tarojs/components'
import { getJokesRandom } from '../../apis/jokes'
import { useAsyncEffect } from '../../utils'
import './jokes.scss'

function Jokes() {
  // const [page, setPage] = useState(1);  // 分页
  // const [totalPage, setTotalPage] = useState(1); // 总页数
  const [jokes, setJokes] = useState([]);  // 笑话数组
  const [isLoading, setIsLoading] = useState(false); // 加载提示

  useAsyncEffect(() => {
    getJokes();
  }, []);

  const [scrollHeight, setScrollHeight] = useState(0); // 可使用窗口高度

  useEffect(() => {
    Taro.getSystemInfo({
      success: res => {
        setScrollHeight(res.windowHeight);
      }
    })
      .then(res => {})
  }, [scrollHeight]);

  // 滑动到底部的事件处理函数
  const scrollToLower = () => {
    // 设置page
    // setPage(prevPage => (prevPage === totalPage ? totalPage : prevPage + 1));
    getJokes();
  };

  // 随机获取笑话
  const getJokes = async () => {
    setIsLoading(true);
    const res = await getJokesRandom();
    const newJokes = jokes.concat(res);
    setJokes(newJokes);
    // setTotalPage(res.totalPage);
    setIsLoading(false);
  };

  return (
    <ScrollView
      className='jokes'
      scrollY
      scrollWithAnimation
      style={{height: `${scrollHeight}px`}}
      lowerThreshold={30}
      onScrollToLower={() => scrollToLower()}
    >
      <View className='mg-l-20 mg-r-20'>
        {jokes.map((joke, index) => {
          return (
            <View key={String(index)} className={`${joke.content.length > 20 ? 'pd-t-20' : ''}`}>
              {joke.content.length > 20 && <RichText nodes={joke.content.replace(/\s{2,}/g, '<p></p>')} className='font32 lh-50 black' />}
              {joke.content.length > 20 && <View className='mg-t-30 font24'>
                {/*<Text className='mg-r-20 blue'>{index + 1}</Text>*/}
                <Text>于 {joke.updateTime} 加入</Text>
              </View>}
              {jokes.length !== index + 1 && joke.content.length > 20 && <View className='line mg-t-40 mg-b-20' />}
            </View>
          )
        })}
      </View>
      <View className='flex-row flex-row-center font26 pd-t-20 pd-b-20'>
        {isLoading && <Text>努力加载中...</Text>}
      </View>
    </ScrollView>
  )
}

Jokes.config = {
  navigationBarTitleText: '笑话段子'
};

export default Jokes;
