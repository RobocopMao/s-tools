import Taro, { useState, useEffect } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { getJokes } from '../../apis/jokes'
import { useAsyncEffect } from '../../utils'
import './jokes.scss'

function Jokes() {
  const [page, setPage] = useState(1);  // 分页
  const [totalPage, setTotalPage] = useState(1); // 总页数
  const [jokes, setJokes] = useState([]);  // 笑话数组
  const [isLoading, setIsLoading] = useState(false); // 加载提示

  useAsyncEffect(async () => {
    setIsLoading(true);
    const res = await getJokes({page});
    const newJokes = jokes.concat(res.list);
    setJokes(newJokes);
    setTotalPage(res.totalPage);
    setIsLoading(false);
  }, [page]);

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
    setPage(prevPage => (prevPage === totalPage ? totalPage : prevPage + 1));
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
            <View key={joke.updateTime} className='pd-t-20 pd-b-20 bd-b-1'>
              <View className='mg-b-20 font24'>
                <Text className='mg-r-20 blue'>{index + 1}</Text>
                <Text>更新于 {joke.updateTime}</Text>
              </View>
              <Text>{joke.content}</Text>
            </View>
          )
        })}
      </View>
      <View className='flex-row flex-row-center font26 pd-t-20 pd-b-20'>
        {isLoading && page !== totalPage && <Text>努力加载中...</Text>}
        {page === totalPage && <Text>您已经看完所有笑话</Text>}
      </View>
    </ScrollView>
  )
}

Jokes.config = {
  navigationBarTitleText: '笑话段子'
};

export default Jokes;
