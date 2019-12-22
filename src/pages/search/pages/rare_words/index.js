import Taro, {useState, useEffect, useRouter} from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'
import {useSelector} from '@tarojs/redux'
import {ComponentCommonBannerAd} from '../../../../components/common/banner_ad'
import { getRareWords } from '../../../../apis/showapi'
import './index.scss'

function RareWords() {
  const router = useRouter();
  const pConfig = useSelector(state => state.pConfig);
  const {showApiAppID, showApiSecret} = pConfig.config;
  const [parts, setParts] = useState('');
  const [rareWords, setRareWords] = useState([]);
  const [color, setColor] = useState('');

  // 设置color
  useEffect(() => {
    const {color} = router.params;
    setColor(color);
    Taro.setNavigationBarColor({frontColor: '#ffffff', backgroundColor: color});
  }, []);

  // 输入成语
  const onInput = (e) => {
    setParts(e.detail.value);
  };

  // 查询
  const onSubmit = async () => {
    if (parts.replace(/\s+/g, '').length === 0) {
      Taro.showToast({title:'请输入要查询信息', icon: 'none'});
      setParts('');
      return;
    }
    let parts1 = parts.replace(/[^\u4e00-\u9fa5]+/g, ''); // 去掉非中文字符
    let parts2 = parts1.split('').join('+'); // 中文用+号拼接
    const res = await getRareWords({parts: parts2, showapi_appid: showApiAppID, showapi_sign: showApiSecret});
    const {ret_code, words} = res;
    if (Number(ret_code) === 0) {
      if (words.length) {
        setRareWords(words);
      } else {
        Taro.showToast({title: '未找到你要的生僻字', icon: 'none', duration: 2000});
        setRareWords([]);
      }
    } else {
      Taro.showToast({title: '未找到你要的生僻字', icon: 'none', duration: 2000});
      setRareWords([]);
    }
  };

  // 重置
  const onReset = () => {
    setParts('');
    setRareWords([]);
  };

  return (
    <View className='rare-words'>
      <View className='flex-column pos-sticky pd-t-10 pd-b-20' style={{backgroundColor: color}}>
        <View className='flex-row bd-radius-50 mg-l-20 mg-r-20 of-hidden'>
          <Input className='flex-grow-1 pd-l-30 pd-r-20 pd-t-2 pd-b-2 h80 lh-80 bd-box bg-white'
                 placeholder='请输入拆字,例如:月月鸟' value={parts} onInput={(e) => onInput(e)} />
          {parts && <Button className='iconfont pd-0 h80 w80 lh-80 bd-radius-no bg-white font46 color-6e' hoverClass='' onClick={() => onReset()}>&#xe6b1;</Button>}
          <Button className='iconfont pd-0 h80 w80 lh-80 bd-radius-no bg-white font50 color-6e' hoverClass='' onClick={() => onSubmit()}>&#xe683;</Button>
        </View>
      </View>
      {rareWords.length && <View className='pd-20'>你可能在找下面的生僻字：</View>}
      {rareWords.length && <View className='flex-column pd-20'>
        {rareWords.map((words, index) => {
          const {pinyin, word} = words;
          return (
            <View className='pd-b-20' key={index}>
              <Text className='mg-r-20 font36 black bold'>{word}</Text>
              <Text className='font36'>[{pinyin}]</Text>
            </View>
          )
        })}
        {/*广告位*/}
        <View className='mg-t-40'>
          <ComponentCommonBannerAd />
        </View>
      </View>}
    </View>
  )
}

RareWords.config = {
  navigationBarTitleText: '生僻字'
};

export default RareWords;
