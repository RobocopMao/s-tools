import Taro, { useState, useEffect } from '@tarojs/taro'
import { View, Text, Input, ScrollView } from '@tarojs/components'
import { getPhoneCode } from '../../apis/phone'
import {useAsyncEffect} from '../../utils';
import './phone_code.scss'

function PhoneCode() {
  const [area, setArea] = useState('');
  const [phoneCodeList, setPhoneCodeList] = useState([]);
  const [phoneCodeFilterList, setPhoneCodeFilterList] = useState([]);

  // 查询所有区号数据
  useAsyncEffect(async () => {
    const res = await getPhoneCode();
    setPhoneCodeList(res);
    setPhoneCodeFilterList(res);
  }, []);

  const [scrollTop, setScrollTop] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(0); // 可使用窗口高度

  // 设置scrollView的高度
  useEffect(() => {
    Taro.getSystemInfo({
      success: res => {
        const query = Taro.createSelectorQuery();
        query
          .select('#phoneCodeSearch')
          .boundingClientRect(rect => {
            const scrollHeight = res.windowHeight - rect.height;
            setScrollHeight(scrollHeight);
          })
          .exec()
      }
    })
    .then(res => {})
  }, [scrollHeight]);

  // 地区输入框事件
  const onInput = (e) => {
    setArea(e.detail.value);
  };

  // 查询事件
  const onSubmit = () => {
    if (area.replace(/\s+/g, '').length === 0) {  // 排除空字符串
      setPhoneCodeFilterList(phoneCodeList);
      Taro.showToast({title: '请输入地区名称', icon: 'none'});
      return;
    }

    const filterList = phoneCodeFilterList.filter((value, index, arr) => {
      const _area = area.replace(/\s+/g, '');
      const reg = new RegExp(_area);
      return reg.test(value.zhCn);
    });
    setPhoneCodeFilterList(filterList);
    setScrollTop(scrollTop ? 0 : 0.1);
  };

  // 重置事件
  const onReset = () => {
    setArea('');
    setPhoneCodeFilterList(phoneCodeList);
    setScrollTop(scrollTop ? 0 : 0.1);
  };

  return (
    <View className='phone-code'>
      <View className='flex-column' id='phoneCodeSearch'>
        <View className='flex-row pd-20'>
          <Input className='bd-1 bd-radius pd-l-20 pd-r-20 pd-t-2 pd-b-2 mg-r-20 h60 lh-60 bd-box' type='text'
                 placeholder='请输入地区名称' value={area}
                 onInput={(e) => onInput(e)} />
          <Button className='btn pd-l-40 pd-r-40 mg-r-20' hoverClass='btn-hover' onClick={() => onSubmit()}>查询</Button>
          <Button className='btn plain pd-l-40 pd-r-40' hoverClass='plain-btn-hover' onClick={() => onReset()}>重置</Button>
        </View>
        <View className='line' />
      </View>
      <ScrollView
        className=''
        scrollY
        scrollWithAnimation
        style={{height: `${scrollHeight}px`}}
        enableBackToTop={true}
        scrollTop={scrollTop}
      >
        <View className='pd-20 pd-t-0'>
          {phoneCodeFilterList.map((code, index) => {
            return (
              <View className='flex-column pd-t-20' key={String(code.zhCn)}>
                <Text className='mg-b-10'>地区名称：<Text className='blue'>{code.zhCn}</Text> - {code.enUs}</Text>
                <Text>区号：<Text className='yellow'>{code.phoneCode}</Text></Text>
                {index !== phoneCodeFilterList.length - 1 && <View className='line mg-t-20' />}
              </View>
            )
          })}
        </View>
      </ScrollView>
    </View>
  )
}

PhoneCode.config = {
  navigationBarTitleText: '世界电话区号'
};

export default PhoneCode;
