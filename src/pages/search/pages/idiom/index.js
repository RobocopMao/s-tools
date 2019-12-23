import Taro, {useState, useEffect, useRouter} from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'
import {useSelector} from '@tarojs/redux'
import {ComponentCommonBannerAd} from '../../../../components/common/banner_ad'
import { getIdiom } from '../../../../apis/showapi'
import './index.scss'

function Idiom() {
  const router = useRouter();
  const pConfig = useSelector(state => state.pConfig);
  const {showApiAppID, showApiSecret} = pConfig.config;
  const [keyword, setKeyword] = useState('');
  const [idiomInfo, setIdiomInfo] = useState(null);
  const [color, setColor] = useState('');

  // 设置color
  useEffect(() => {
    const {color} = router.params;
    setColor(color);
    Taro.setNavigationBarColor({frontColor: '#ffffff', backgroundColor: color});
  }, []);

  // 输入成语
  const onInput = (e) => {
    setKeyword(e.detail.value);
  };

  // 查询
  const onSubmit = async () => {
    if (keyword.replace(/\s+/g, '').length === 0) {
      Taro.showToast({title:'请输入要查询的成语', icon: 'none'});
      setKeyword('');
      return;
    }
    const res = await getIdiom({keyword, showapi_appid: showApiAppID, showapi_sign: showApiSecret});
    const {ret_code, data, ret_message} = res;
    if (Number(ret_code) === 0) {
      setIdiomInfo(data);
    } else {
      Taro.showToast({title: ret_message, icon: 'none', duration: 2000});
      setKeyword('');
      setIdiomInfo(null);
    }
  };

  // 重置
  const onReset = () => {
    setKeyword('');
    setIdiomInfo(null);
  };

  return (
    <View className='idiom'>
      <View className='flex-column pos-sticky pd-t-10 pd-b-20' style={{backgroundColor: color}}>
        <View className='flex-row bd-radius-50 mg-l-20 mg-r-20 of-hidden'>
          <Input className='flex-grow-1 pd-l-30 pd-r-20 pd-t-2 pd-b-2 h80 lh-80 bd-box bg-white'
                 placeholder='请输入成语' value={keyword} onInput={(e) => onInput(e)} />
          {keyword && <Button className='iconfont pd-0 h80 w80 lh-80 bd-radius-no bg-white font46 color-6e' hoverClass='' onClick={() => onReset()}>&#xe6b1;</Button>}
          <Button className='iconfont pd-0 h80 w80 lh-80 bd-radius-no bg-white font50 color-6e' hoverClass='' onClick={() => onSubmit()}>&#xe683;</Button>
        </View>
      </View>
      { idiomInfo && <View className='flex-column pd-20'>
        <Text>[{idiomInfo.spell}]</Text>
        <Text className='font40 black bold mg-b-20'>{idiomInfo.title}</Text>
        <View className='line' />
        <Text className='mg-t-20 font36 black'>词义解释</Text>
        <Text className='mg-t-10'>{idiomInfo.content}</Text>
        {idiomInfo.derivation && <Text className='mg-t-30 font36 black'>出自典故</Text>}
        {idiomInfo.derivation && <Text className='mg-t-10'>{idiomInfo.derivation}</Text>}
        {idiomInfo.samples && <Text className='mg-t-30 font36 black'>示例用法</Text>}
        {idiomInfo.samples && <Text className='mg-t-10'>{idiomInfo.samples}</Text>}
        {/*广告位*/}
        <View className='mg-t-40'>
          <ComponentCommonBannerAd />
        </View>
      </View>}
    </View>
  )
}

Idiom.config = {
  navigationBarTitleText: '成语释义'
};

export default Idiom;
