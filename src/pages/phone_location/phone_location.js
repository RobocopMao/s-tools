import Taro, { useState } from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'
import { getPhoneLocation } from '../../apis/phone'
import './phone_location.scss'

function PhoneLocation() {
  const [mobile, setMobile] = useState('');
  const [province, setProvince] = useState('');
  const [carrier, setCarrier] = useState('');

  // 输入手机号
  const onInput = (e) => {
    setMobile(e.detail.value);
  };

  // 查询手机号
  const onSubmit = async () => {
    if (!/^1[3456789]\d{9}$/.test(mobile)) {
      Taro.showToast({title: '请输入正确的手机号', icon: 'none'});
      setMobile('');
      setProvince('');
      setCarrier('');
      return;
    }
    const res = await getPhoneLocation({mobile});
    setProvince(res.province);
    setCarrier(res.carrier);
  };

  // 重置手机号
  const onReset = () => {
    setMobile('');
    setProvince('');
    setCarrier('');
  };

  return (
    <View className='phone-location bd-box'>
      <View className='flex-column'>
        <View className='flex-row pd-20'>
          <Input className='bd-1 bd-radius pd-l-20 pd-r-20 pd-t-2 pd-b-2 mg-r-20 h60 lh-60 bd-box' type='number'
                 placeholder='请输入11位手机号码' maxLength={11} value={mobile}
                  onInput={(e) => onInput(e)} />
          <Button className='btn pd-l-40 pd-r-40 mg-r-20' hoverClass='btn-hover' onClick={() => onSubmit()}>查询</Button>
          <Button className='btn plain pd-l-40 pd-r-40' hoverClass='plain-btn-hover' onClick={() => onReset()}>重置</Button>
        </View>
        <View className='line' />
      </View>
      { province && carrier && <View className='flex-column pd-20'>
        <Text>归属地：{province}</Text>
        <Text className='mg-t-10'>运营商：{carrier}</Text>
      </View>}
    </View>
  )
}

PhoneLocation.config = {
  navigationBarTitleText: '手机号码归属地'
};

export default PhoneLocation;
