import Taro, {useEffect, useRouter, useState} from '@tarojs/taro'
import { useSelector } from '@tarojs/redux'
import moment from 'moment';
import {View} from '@tarojs/components'
import {fanyiTranslate} from '../../../../apis/baidu_fanyi';
import './index.scss'

function Translate() {
  const router = useRouter();
  const pConfig = useSelector(state => state.pConfig);
  const user = useSelector(state => state.user);
  const {windowHeight} = user.systemInfo;
  const {bdFanyiAppID, bdFanyiAppKey} = pConfig.config;
  const [q, setQ] = useState('');
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(1);
  const [transResult, setTransResult] = useState([]);
  const [isFocus, setIsFocus] = useState(false);
  const [color, setColor] = useState('');

  const langArr = [
    {en: 'auto', zh: '自动检测'},
    {en: 'zh', zh: '中文'},
    {en: 'en', zh: '英文'},
    {en: 'yue', zh: '粤语'},
    {en: 'wyw', zh: '文言文'},
    {en: 'jp', zh: '日语'},
    {en: 'kor', zh: '韩语'},
    {en: 'fra', zh: '法语'},
    {en: 'spa', zh: '西班牙语'},
    {en: 'th', zh: '泰语'},
    {en: 'ara', zh: '阿拉伯语'},
    {en: 'ru', zh: '俄语'},
    {en: 'pt', zh: '葡萄牙语'},
    {en: 'de', zh: '德语'},
    {en: 'it', zh: '意大利语'},
    {en: 'el', zh: '希腊语'},
    {en: 'nl', zh: '荷兰语'},
    {en: 'pl', zh: '波兰语'},
    {en: 'bul', zh: '保加利亚语'},
    {en: 'est', zh: '爱沙尼亚语'},
    {en: 'dan', zh: '丹麦语'},
    {en: 'fin', zh: '芬兰语'},
    {en: 'cs', zh: '捷克语'},
    {en: 'rom', zh: '罗马尼亚语'},
    {en: 'slo', zh: '斯洛文尼亚语'},
    {en: 'swe', zh: '瑞典语'},
    {en: 'hu', zh: '匈牙利语'},
    {en: 'cht', zh: '繁体中文'},
    {en: 'vie', zh: '越南语'}
  ];

  // 设置color
  useEffect(() => {
    const {color} = router.params;
    setColor(color);
    Taro.setNavigationBarColor({frontColor: '#ffffff', backgroundColor: color});
  }, []);

  // 翻译
  const translate = async () => {
    const salt = moment().unix();
    const res = await fanyiTranslate({salt, q, from: langArr[from].en, to: langArr[to].en, key: bdFanyiAppKey, appid: bdFanyiAppID});
    setTransResult(res.trans_result);
  };

  // 输入翻译的内容
  const onQueryInput = (e) => {
    setQ(e.detail.value.replace(/^\s+|\s+$/g, ''));
  };

  // 获取焦点时清空结果
  const onQueryFocus = () => {
    setTransResult([]);
    setIsFocus(true);
  };

  // 获取焦点时清空结果
  const onQueryBlur = () => {
    setIsFocus(false);
  };

  // 清空内容和结果
  const clearQuery = () => {
    setQ('');
    setTransResult([]);
  };

  // 源语言
  const fromChange = (e) => {
    const {value} = e.detail;
    setFrom(Number(value));
  };

  // 目标语言
  const toChange = (e) => {
    const {value} = e.detail;
    setTo(Number(value));
  };

  // 源语言和目标语言交换
  const exchange = () => {
    let _from = from;
    let _to = to;
    setFrom(_to);
    setTo(_from);
  };

  // 赋值所有
  const copyAll = () => {
    let str = '';
    for (let [, item] of transResult.entries()) {
      str += item.dst + '\n'
    }
    Taro.setClipboardData({data: str});
  };

  return (
    <View className='translate'>
      <View className='flex-row flex-row-center flex-col-center relative' id='changeBox'>
        <Picker className='flex-40per' mode='selector' range={langArr} rangeKey='zh' value={from} onChange={(e) => fromChange(e)}>
          <View className='flex-row flex-end flex-col-center pd-20 w100-per'>
            <View className='font32'>{langArr[from].zh}</View>
            <View className='iconfont font40'>&#xe698;</View>
          </View>
        </Picker>
        <View className='w200 pd-20 pd text-center flex-20per' onClick={() => exchange()}><View className='iconfont font50'>&#xe70a;</View></View>
        <Picker className='flex-40per' mode='selector' range={langArr} rangeKey='zh' value={to} onChange={(e) => toChange(e)}>
          <View className='flex-row flex-col-center pd-20 w100-per'>
            <View className='font32'>{langArr[to].zh}</View>
            <View className='iconfont font40'>&#xe698;</View>
          </View>
        </Picker>
      </View>
      <View className='pd-20 pd-t-0 bd-box relative' style={{height: `${windowHeight / 3}px`}}>
        <Textarea className={`h100-per w100-per bd-radius pd-20 pd-r-60 bd-box ${isFocus ? 'box-shadow-dark' : 'box-shadow-light'}`}
                  maxlength={2000}
                  placeholder='请输入需要翻译的内容'
                  value={q}
                  onFocus={() => onQueryFocus()}
                  onBlur={() => onQueryBlur()}
                  onInput={(e) => onQueryInput(e)} />
        {q && <View className='iconfont font46 pd-10 clear-btn' onClick={() => clearQuery()}>&#xe6b1;</View>}
      </View>
      <View className='pd-l-20 pd-t-10 pd-b-10 color-a1 font24'>Tips：输入的内容可通过键盘enter键换行，让译文层次更清晰</View>
      <View className='pd-20'>
        <Button className='iconfont text-center pd-0 mg-0 h80 lh-80 white bd-radius-50 ' disabled={!q} onClick={() => translate()} style={{backgroundColor: color}}>翻 译</Button>
      </View>
      {transResult.length && <View className='pd-t-0 pd-b-80 bd-box relative'>
        <View className='black pd-20 pd-t-10 pd-b-0'>
          <View className='mg-b-20'>翻译结果:</View>
          <View className='line' />
        </View>
        {transResult.map((result, index) => {
          return (
            <View className='pd-20 bd-box' key={String(index)} onLongPress={() => Taro.setClipboardData({data: result.dst})}>{result.dst}</View>
          )
        })}
        <View className='iconfont font46 pd-10 copy-btn' onClick={() => copyAll()}>&#xe643;</View>
        <View className='pd-20 color-a1 font24'>Tips: 点击右下角图标可复制全部内容，长按单条内容可复制单条内容。</View>
      </View>}
    </View>
  )
}

Translate.config = {
  navigationBarTitleText: '小翻译'
};

export default Translate;
