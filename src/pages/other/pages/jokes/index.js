import Taro, {useState, useEffect, useRouter} from '@tarojs/taro'
import { View, Text, ScrollView, RichText} from '@tarojs/components'
import {useSelector} from '@tarojs/redux'
import moment from 'moment'
import { getJokesRandom } from '../../../../apis/jokes'
import { useAsyncEffect } from '../../../../utils'
import {ComponentCommonBannerAd} from '../../../../components/common/banner_ad'
import './index.scss'

function Jokes() {
  const router = useRouter();
  const user = useSelector(state => state.user);
  const {windowHeight} = user.systemInfo;
  // const [page, setPage] = useState(1);  // 分页
  // const [totalPage, setTotalPage] = useState(1); // 总页数
  const [jokes, setJokes] = useState([]);  // 笑话数组
  const [isLoading, setIsLoading] = useState(false); // 加载提示
  // const [color, setColor] = useState('');

  // 设置color
  useEffect(() => {
    const {color} = router.params;
    // setColor(color);
    Taro.setNavigationBarColor({frontColor: '#ffffff', backgroundColor: color});
  }, []);

  useAsyncEffect(() => {
    getJokes();
  }, []);

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
      className={`jokes ${user.useDarkModel ? 'dark-model' : ''}`}
      scrollY
      scrollWithAnimation
      style={{height: `${windowHeight}px`}}
      lowerThreshold={30}
      onScrollToLower={() => scrollToLower()}
    >
      <View className='mg-l-20 mg-r-20'>
        {jokes.map((joke, index) => {
          return (
            <View key={String(index)} className={`${joke.content.length > 50 ? 'pd-t-20' : ''}`}>
              {joke.content.length > 50 && <RichText nodes={joke.content.replace(/\s{2,}/g, '<p></p>')} className='font32 lh-50 black dm-color-e6' />}
              {joke.content.length > 50 && <View className='mg-t-30 font24'>
                {/*<Text className='mg-r-20 blue'>{index + 1}</Text>*/}
                <Text>于 {moment(joke.updateTime).format('YYYY-MM-DD HH:mm')} 加入</Text>
              </View>}
              {jokes.length !== index + 1 && joke.content.length > 50 && <View className='line mg-t-40 mg-b-20' />}
              {/*广告位*/}
              {(index === 9 || (index && index % 50 === 0)) && <View className='mg-b-20'>
                <ComponentCommonBannerAd />
                <View className='line mg-t-20' />
              </View>}
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
