import Taro, { useState, useEffect } from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'
import { getPhoneCode } from '../../../../apis/phone'
import {useAsyncEffect} from '../../../../utils'
import './index.scss'

function PhoneCode() {
  const [area, setArea] = useState('');
  const [phoneCodeList, setPhoneCodeList] = useState([]);
  const [phoneCodeFilterList, setPhoneCodeFilterList] = useState([]);
  const [color, setColor] = useState('');

  // 设置color
  useEffect(() => {
    const {color} = this.$router.params;
    setColor(color);
    Taro.setNavigationBarColor({frontColor: '#ffffff', backgroundColor: color});
  }, []);

  // 查询所有区号数据
  useAsyncEffect(async () => {
    const res = await getPhoneCode();
    setPhoneCodeList(res);
    setPhoneCodeFilterList(res);
  }, []);

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
    // setScrollTop(scrollTop ? 0 : 0.1);
    let tId = setTimeout(() => {
      Taro.pageScrollTo({
        scrollTop: 0,
        duration: 500
      });
      clearTimeout(tId);
    }, 500)
  };

  // 重置事件
  const onReset = () => {
    setArea('');
    setPhoneCodeFilterList(phoneCodeList);
    // setScrollTop(scrollTop ? 0 : 0.1);
    let tId = setTimeout(() => {
      Taro.pageScrollTo({
        scrollTop: 0,
        duration: 500
      });
      clearTimeout(tId);
    }, 500)

  };

  return (
    <View className='phone-code'>
      <View className='flex-column pos-sticky pd-t-10 pd-b-20' style={{backgroundColor: color}}>
        <View className='flex-row bd-radius-50 mg-l-20 mg-r-20 of-hidden'>
          <Input className='flex-grow-1 pd-l-30 pd-r-20 pd-t-2 pd-b-2 h80 lh-80 bd-box bg-white' type='text'
                 placeholder='请输入地区名称' value={area}
                 onInput={(e) => onInput(e)} />
          {area && <Button className='iconfont pd-0 h80 w80 lh-80 bd-radius-no bg-white font40' hoverClass='' onClick={() => onReset()}>&#xe87b;</Button>}
          <Button className='iconfont pd-0 h80 w80 lh-80 bd-radius-no bg-white font40' hoverClass='' onClick={() => onSubmit()}>&#xe87c;</Button>
        </View>
        {/*<View className='line' />*/}
      </View>
      <View className='pd-20 pd-t-0'>
        {phoneCodeFilterList.map((code, index) => {
          return (
            <View className='flex-column pd-t-20' key={String(code.zhCn)}>
              <Text className='mg-b-10'>地区名称：<Text style={{color}}>{code.zhCn}</Text> - {code.enUs}</Text>
              <Text>区号：<Text style={{color}}>{code.phoneCode}</Text></Text>
              {index !== phoneCodeFilterList.length - 1 && <View className='line mg-t-20' />}
            </View>
          )
        })}
      </View>
    </View>
  )
}

PhoneCode.config = {
  navigationBarTitleText: '世界电话区号'
};

export default PhoneCode;
