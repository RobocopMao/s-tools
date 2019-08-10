import Taro, { useState } from '@tarojs/taro'
import {View, Text, Input} from '@tarojs/components'
import { useAsyncEffect } from '../../utils'
import './ip_search.scss'
import {getAimIp, getSelfIp} from '../../apis/ip';

function IpSearch() {
  // const [selfIpInfo, setSelfIpInfo] = useState({});
  const [aimIp, setAimIp] = useState('');
  const [aimIpInfo, setAimIpInfo] = useState({});

  // useAsyncEffect(async () => {
  //   //   const res = await getSelfIp();
  //   //   setSelfIpInfo(res);
  //   // },[]);

  // ip地址输入事件
  const onInput = (e) => {
    setAimIp(e.detail.value);
  };

  // 查询
  const onSubmit = async () => {
    if (!/((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/g.test(aimIp)) {
      Taro.showToast({title: 'ip地址格式不正确', icon: 'none'});
      return;
    }
    const res = await getAimIp({ip: aimIp});
    setAimIpInfo(res);
  };

  // 重置
  const onReset = () => {
    setAimIp('');
    setAimIpInfo({});
  };

  return (
    <View className='ip-search flex-column'>
      <View className='flex-column'>
        {/*<View className='flex-column'>*/}
          {/*<Text className='mg-b-10 bold'>当前用户的IP信息：</Text>*/}
          {/*<Text className='mg-b-10'>IP地址：<Text className='blue'>{selfIpInfo.ip}</Text></Text>*/}
          {/*<Text className='mg-b-10'>省份：{selfIpInfo.province}</Text>*/}
          {/*<Text className='mg-b-10'>城市：{selfIpInfo.city}</Text>*/}
          {/*<Text>网络服务商：{selfIpInfo.isp}</Text>*/}
        {/*</View>*/}
        {/*<View className='line mg-t-20' />*/}
        <View className='flex-row pd-20'>
          <Input className='bd-1 bd-radius pd-l-20 pd-r-20 pd-t-2 pd-b-2 mg-r-20 h60 lh-60 bd-box' type='text'
                 placeholder='请输入ip地址' value={aimIp}
                 onInput={(e) => onInput(e)} />
          <Button className='btn pd-l-40 pd-r-40 mg-r-20' hoverClass='btn-hover' onClick={() => onSubmit()}>查询</Button>
          <Button className='btn plain pd-l-40 pd-r-40' hoverClass='plain-btn-hover' onClick={() => onReset()}>重置</Button>
        </View>
        <View className='line' />
      </View>
        <View className='flex-column pd-20'>
          <Text className='mg-b-10 bold'>当前查询的IP信息：</Text>
          <Text className='mg-b-10'>IP地址：<Text className='blue'>{aimIpInfo.ip}</Text></Text>
          <Text className='mg-b-10'>省份：{aimIpInfo.province}</Text>
          <Text className='mg-b-10'>城市：{aimIpInfo.city}</Text>
          <Text className='mg-b-10'>网络服务商：{aimIpInfo.isp}</Text>
        </View>
      {/*</View>*/}

    </View>
  )
}

IpSearch.config = {
  navigationBarTitleText: 'IP查询'
};

export default IpSearch;
