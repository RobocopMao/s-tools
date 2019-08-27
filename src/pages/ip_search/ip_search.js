import Taro, {useEffect, useState} from '@tarojs/taro'
import {View, Text, Input} from '@tarojs/components'
import { useAsyncEffect } from '../../utils'
import './ip_search.scss'
import {getAimIp, getSelfIp} from '../../apis/ip';

function IpSearch() {
  // const [selfIpInfo, setSelfIpInfo] = useState({});
  const [aimIp, setAimIp] = useState('');
  const [aimIpInfo, setAimIpInfo] = useState({});
  const [color, setColor] = useState('');

  // 设置color
  useEffect(() => {
    const {color} = this.$router.params;
    setColor(color);
    Taro.setNavigationBarColor({frontColor: '#ffffff', backgroundColor: color});
  }, []);

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

  const onChange = () => {
    if (!/((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/g.test(aimIp)) {
      Taro.showToast({title: 'ip地址格式不正确', icon: 'none'});
      onReset();
    }
  };

  return (
    <View className='ip-search'>
      <View className='flex-column pos-sticky pd-t-10 pd-b-20' style={{backgroundColor: color}}>
        {/*<View className='flex-column'>*/}
          {/*<Text className='mg-b-10 bold'>当前用户的IP信息：</Text>*/}
          {/*<Text className='mg-b-10'>IP地址：<Text className='blue'>{selfIpInfo.ip}</Text></Text>*/}
          {/*<Text className='mg-b-10'>省份：{selfIpInfo.province}</Text>*/}
          {/*<Text className='mg-b-10'>城市：{selfIpInfo.city}</Text>*/}
          {/*<Text>网络服务商：{selfIpInfo.isp}</Text>*/}
        {/*</View>*/}
        {/*<View className='line mg-t-20' />*/}
        <View className='flex-row bd-radius-50 mg-l-20 mg-r-20 of-hidden'>
          <Input className='flex-grow-1 pd-l-30 pd-r-20 pd-t-2 pd-b-2 h80 lh-80 bd-box bg-white' type='text'
                 placeholder='请输入ip地址' value={aimIp} onChange={() => onChange()}
                 onInput={(e) => onInput(e)} />
          {aimIp && <Button className='iconfont pd-0 h80 w80 lh-80 bd-radius-no bg-white font40' hoverClass='' onClick={() => onReset()}>&#xe87b;</Button>}
          <Button className='iconfont pd-0 h80 w80 lh-80 bd-radius-no bg-white font40' hoverClass='' onClick={() => onSubmit()}>&#xe87c;</Button>
        </View>
      </View>
      {JSON.stringify(aimIpInfo) !== '{}' && <View className='flex-column pd-20'>
          <Text className='mg-b-10 bold'>当前查询的IP信息：</Text>
          <Text className='mg-b-10'>IP地址：<Text style={{color}}>{aimIpInfo.ip}</Text></Text>
          <Text className='mg-b-10'>省份：{aimIpInfo.province}</Text>
          <Text className='mg-b-10'>城市：{aimIpInfo.city}</Text>
          <Text className='mg-b-10'>网络服务商：{aimIpInfo.isp}</Text>
        </View>}
      {/*</View>*/}

    </View>
  )
}

IpSearch.config = {
  navigationBarTitleText: 'IP查询'
};

export default IpSearch;
