import Taro, {useState, useEffect, useRouter} from '@tarojs/taro'
import { View, Text, Input, RichText } from '@tarojs/components'
import {ComponentCommonBannerAd} from '../../../../components/common/banner_ad'
import { getDictionaryContent } from '../../../../apis/dictionary'
import './index.scss'

function Dictionary() {
  const router = useRouter();
  const [word, setWord] = useState('');
  const [wordContentList, setWordContentList] = useState([]);
  const [color, setColor] = useState('');

  // 设置color
  useEffect(() => {
    const {color} = router.params;
    setColor(color);
    Taro.setNavigationBarColor({frontColor: '#ffffff', backgroundColor: color});
  }, []);

  // 输入成语
  const onInput = (e) => {
    setWord(e.detail.value);
  };

  // 查询
  const onSubmit = async () => {
    if (word.replace(/\s+/g, '').length === 0) {
      Taro.showToast({title:'请输入要查询信息', icon: 'none'});
      setWord('');
      return;
    }
    const res = await getDictionaryContent({content: word});
    setWordContentList(res);
  };

  // 重置
  const onReset = () => {
    setWord('');
    setWordContentList([]);
  };

  return (
    <View className='dictionary'>
      <View className='flex-column pos-sticky pd-t-10 pd-b-20' style={{backgroundColor: color}}>
        <View className='flex-row bd-radius-50 mg-l-20 mg-r-20 of-hidden'>
          <Input className='flex-grow-1 pd-l-30 pd-r-20 pd-t-2 pd-b-2 h80 lh-80 bd-box bg-white'
                 placeholder='请输入要查询的汉字，例如：穆' value={word} onInput={(e) => onInput(e)} />
          {word && <Button className='iconfont pd-0 h80 w80 lh-80 bd-radius-no bg-white font46 color-6e' hoverClass='' onClick={() => onReset()}>&#xe6b1;</Button>}
          <Button className='iconfont pd-0 h80 w80 lh-80 bd-radius-no bg-white font50 color-6e' hoverClass='' onClick={() => onSubmit()}>&#xe683;</Button>
        </View>
      </View>
      {wordContentList.length && <View className='flex-column pd-20'>
        {wordContentList.map((words, index) => {
          const {traditional, pinyin, radicals, explanation, strokes} = words;
          return (
            <View className='pd-b-20' key={index}>
              <Text className='mg-r-20 font36 black bold'>{words.word}</Text>
              <Text className='font36'>[{pinyin}]</Text>
              <View className='mg-t-10'><Text className='black'>繁体：</Text>{traditional}</View>
              <View className='mg-t-10'><Text className='black'>偏旁：</Text>{radicals}</View>
              <View className='mg-t-10'><Text className='black'>笔画：</Text>{strokes}</View>
              <view className='mg-t-10'><Text className='black'>汉字释义：</Text></view>
              <RichText className='mg-t-10' nodes={explanation.replace(/\s{2}/g, '<p></p>')} />
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

Dictionary.config = {
  navigationBarTitleText: '汉字字典'
};

export default Dictionary;
