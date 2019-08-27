import Taro, {useEffect, useState} from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'
import { getPhoneLocation } from '../../apis/phone'
import './phone_location.scss'

function PhoneLocation() {
  const [mobile, setMobile] = useState('');
  const [province, setProvince] = useState('');
  const [carrier, setCarrier] = useState('');
  const [color, setColor] = useState('');

  // 设置color
  useEffect(() => {
    const {color} = this.$router.params;
    setColor(color);
    Taro.setNavigationBarColor({frontColor: '#ffffff', backgroundColor: color});
  }, []);

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
    <View className='phone-location'>
      <View className='flex-column pos-sticky pd-t-10 pd-b-20' style={{backgroundColor: color}}>
        <View className='flex-row bd-radius-50 mg-l-20 mg-r-20 of-hidden'>
          <Input className='flex-grow-1 pd-l-30 pd-r-20 pd-t-2 pd-b-2 h80 lh-80 bd-box bg-white' type='number'
                 placeholder='请输入11位手机号码' maxLength={11} value={mobile}
                 onInput={(e) => onInput(e)} />
          {mobile && <Button className='iconfont pd-0 h80 w80 lh-80 bd-radius-no bg-white font40' hoverClass='' onClick={() => onReset()}>&#xe87b;</Button>}
          <Button className='iconfont pd-0 h80 w80 lh-80 bd-radius-no bg-white font40' hoverClass='' onClick={() => onSubmit()}>&#xe87c;</Button>
        </View>
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
