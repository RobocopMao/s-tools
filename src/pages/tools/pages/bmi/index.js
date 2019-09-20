import Taro, {useEffect, useRouter, useState} from '@tarojs/taro'
import { useSelector } from '@tarojs/redux'
import {View, PickerView, PickerViewColumn, Button, ScrollView} from '@tarojs/components'
import {getNodeRect} from '../../../../utils'
import './index.scss'

function BMI() {
  // 初始化kg整数
  let kgs = [];
  for (let i = 1; i <= 200; i++) {
    kgs.push(i);
  }

  const router = useRouter();
  const user = useSelector(state => state.user);
  const {windowHeight} = user.systemInfo;
  const [color, setColor] = useState('');
  const [m, setM] = useState([0, 1, 2]);
  const [dm, setDm] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const [cm, setCm] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const [heightVal, setHeightVal] = useState([1,7,0]);
  const [height, setHeight] = useState(1.70);
  const [animationData1, setAnimationData1] = useState({});
  const [showHeightPicker, setShowHeightPicker] = useState(false);
  const [kgInt, setKgInt] = useState(kgs);
  const [kgFloat, setKgFloat] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const [weightVal, setWeightVal] = useState([62,5]);
  const [weight, setWeight] = useState(63.5);
  const [animationData2, setAnimationData2] = useState({});
  const [showWeightPicker, setShowWeightPicker] = useState(false);
  const [showMask, setShowMask] = useState(false);
  const [triggerPickerHeight, setTriggerPickerHeight] = useState(165);

  // 设置color
  useEffect(() => {
    const {color} = router.params;
    setColor(color);
    Taro.setNavigationBarColor({frontColor: '#ffffff', backgroundColor: color});
  }, []);

  useEffect(async () => {
    const node = await getNodeRect('#triggerPickerBox');
    const {height} = node;
    setTriggerPickerHeight(height);
  }, []);

  // 选择身高
  const heightChange = (e) => {
    const {value} = e.detail;
    setHeightVal(value);
    setHeight(Number(`${m[value[0]]}.${dm[value[1]]}${cm[value[2]]}`));
  };

  // 身高picker
  const heightPickerAnimate = () => {
    let animation1 = Taro.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    });

    if (!showHeightPicker) {
      setShowMask(true);
      animation1.bottom(0).step();
    } else {
      setShowMask(false);
      animation1.bottom(-windowHeight / 2).step();
    }
    setAnimationData1(animation1);
    setShowHeightPicker(prev => !prev);
  };

  // 选择体重
  const weightChange = (e) => {
    const {value} = e.detail;
    setWeightVal(value);
    setWeight(Number(`${kgInt[value[0]]}.${kgFloat[value[1]]}`));
  };

  // 体重picker
  const weightPickerAnimate = () => {
    let animation2 = Taro.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    });

    if (!showWeightPicker) {
      setShowMask(true);
      animation2.bottom(0).step();
    } else {
      setShowMask(false);
      animation2.bottom(-windowHeight / 2).step();
    }
    setAnimationData2(animation2);
    setShowWeightPicker(prev => !prev);
  };

  // 点击mask隐藏picker
  const hideMask = () => {
    showHeightPicker ? heightPickerAnimate() : weightPickerAnimate();
  };

  return (
    <View className='bmi of-hidden'>
      <View className='' id='triggerPickerBox'>
        <View className='pd-t-10 pd-b-20 pd-l-20 pd-r-20' style={{backgroundColor: color}} onClick={() => heightPickerAnimate()}>
          <View className='flex-row bd-radius-50 of-hidden'>
            <View className='pd-l-20 h80 w140 lh-80 bd-radius-no bg-white color-6e'>身高/m</View>
            <View className='flex-grow-1 pd-r-20 pd-t-2 pd-b-2 h80 lh-80 bd-box bg-white text-center'>{height.toFixed(2)}</View>
            <Button className='iconfont pd-0 h80 w80 lh-80 bd-radius-no bg-white font46 color-6e' hoverClass=''>&#xe6a1;</Button>
          </View>
        </View>
        <View className='pd-t-10 pd-b-20 pd-l-20 pd-r-20' style={{backgroundColor: color}} onClick={() => weightPickerAnimate()}>
          <View className='flex-row bd-radius-50 of-hidden'>
            <View className='pd-l-20 h80 w140 lh-80 bd-radius-no bg-white color-6e'>体重/kg</View>
            <View className='flex-grow-1 pd-r-20 pd-t-2 pd-b-2 h80 lh-80 bd-box bg-white text-center'>{weight.toFixed(1)}</View>
            <Button className='iconfont pd-0 h80 w80 lh-80 bd-radius-no bg-white font46 color-6e' hoverClass=''>&#xe6a1;</Button>
          </View>
        </View>
        <View className='pd-t-10 pd-b-20 pd-l-20 pd-r-20' style={{backgroundColor: color}}>
          <View className='flex-row bd-radius-50 of-hidden'>
            <View className='pd-l-20 h80 w140 lh-80 bd-radius-no bg-white color-6e'>BMI</View>
            <View className='flex-grow-1 pd-r-20 pd-t-2 pd-b-2 h80 lh-80 bd-box bg-white text-center'>{Number.isFinite((weight / (height * height))) ? (weight / (height * height)).toFixed(1) : '你胖得我已经无法形容了'}</View>
            <Button className='iconfont pd-0 h80 w80 lh-80 bd-radius-no bg-white font46 color-6e' hoverClass='' />
          </View>
        </View>
      </View>
      {/*tips*/}
      <ScrollView
        className='pd-20 bd-box'
        scrollY
        scrollWithAnimation
        style={{height: `${windowHeight - triggerPickerHeight}px`}}
      >
        <View className='mg-b-20'>说明：</View>
        <View className='mg-b-20'>1. 体质指数 (Body Mass Index，简称BMI)，是目前国际最常用来量度体重与身高比例的工具。它利用身高和体重之间的比例去衡量一个人是否过瘦或过肥。</View>
        <View className='mg-b-20'>2. 计算公式：BMI = 体重(kg) / (身高(m) * 身高(m))，示例：63.5 / (1.70 * 1.70) = 22.0。</View>
        <View className='mg-b-20'>3. 范围参考</View>
        <View className='text-center mg-b-20'>
          <View className='line' />
          <View className='flex-row bg-fa'>
            <View className='flex-50per lh-60 black'>分类</View>
            <View className='flex-50per lh-60 black'>BMI范围</View>
          </View>
          <View className='line' />
          <View className='flex-row'>
            <View className='flex-50per lh-60'>偏瘦</View>
            <View className='flex-50per lh-60'>{`<= 18.4`}</View>
          </View>
          <View className='line' />
          <View className='flex-row'>
            <View className='flex-50per lh-60' style={{color: '#00C853'}}>正常</View>
            <View className='flex-50per lh-60' style={{color: '#00C853'}}>18.5 ~ 23.9</View>
          </View>
          <View className='line' />
          <View className='flex-row'>
            <View className='flex-50per lh-60' style={{color: '#FFB837'}}>过重</View>
            <View className='flex-50per lh-60' style={{color: '#FFB837'}}>24.0 ~ 27.9</View>
          </View>
          <View className='line' />
          <View className='flex-row'>
            <View className='flex-50per lh-60' style={{color: '#FF6D00'}}>肥胖</View>
            <View className='flex-50per lh-60' style={{color: '#FF6D00'}}>{`>= 28.0`}</View>
          </View>
          <View className='line' />
        </View>
        <View className='mg-b-20'>4. 有人认为最好看的体形BMI指数值为：女士BMI=19，男士BMI=22。</View>
      </ScrollView>
      {/*蒙层*/}
      {showMask && <View className='mask' style={{backgroundColor: color, opacity: 0.6}} onClick={() => hideMask()} />}
      {/*身高picker*/}
      <View className='bg-white picker' style={{height: `${windowHeight / 2}px`, bottom: `${-windowHeight / 2}px`}} animation={animationData1}>
        <View className='line' />
        <View className='flex-row space-between'>
          <View className='text-center pd-l-20 pd-r-20 h70 lh-70 bd-box'>当前选择：{height.toFixed(2)}米(m)</View>
          <View className='iconfont pd-l-20 pd-r-20 h70 lh-70 font46' onClick={() => heightPickerAnimate()}>&#xe6a1;</View>
        </View>
        <View className='line' />
        <View className='flex-row text-center pd-10 bd-box'>
          <View className='flex-33per'>米</View>
          <View className='flex-33per'>分米</View>
          <View className='flex-33per'>厘米</View>
        </View>
        <View className='line' />
        <PickerView className='h100-per text-center' indicatorClass='h70' value={heightVal} onChange={(e) => heightChange(e)}>
          <PickerViewColumn>
            {m.map((_m, index) => {
              return (
                <View className='lh-70' key={String(index)}>{_m}</View>
              )
            })}
          </PickerViewColumn>
          <PickerViewColumn>
            {dm.map((_dm, index) => {
              return (
                <View className='lh-70' key={String(index)}>{_dm}</View>
              )
            })}
          </PickerViewColumn>
          <PickerViewColumn>
            {cm.map((_cm, index) => {
              return (
                <View className='lh-70' key={String(index)}>{_cm}</View>
              )
            })}
          </PickerViewColumn>
        </PickerView>
      </View>
      {/*身高picker*/}
      <View className='bg-white picker' style={{height: `${windowHeight / 2}px`, bottom: `${-windowHeight / 2}px`}} animation={animationData2}>
        <View className='line' />
        <View className='flex-row space-between'>
          <View className='text-center pd-l-20 pd-r-20 h70 lh-70 bd-box'>当前选择：{weight.toFixed(1)}千克(kg)</View>
          <View className='iconfont pd-l-20 pd-r-20 h70 lh-70 font46' onClick={() => weightPickerAnimate()}>&#xe6a1;</View>
        </View>
        <View className='line' />
        <View className='flex-row text-center pd-10 bd-box'>
          <View className='flex-50per'>千克(整数)</View>
          <View className='flex-50per'>千克(小数)</View>
        </View>
        <View className='line' />
        <PickerView className='h100-per text-center' indicatorClass='h70' value={weightVal} onChange={(e) => weightChange(e)}>
          <PickerViewColumn>
            {kgInt.map((_kgInt, index) => {
              return (
                <View className='lh-70' key={String(_kgInt)}>{_kgInt}</View>
              )
            })}
          </PickerViewColumn>
          <PickerViewColumn>
            {kgFloat.map((_kgFloat, index) => {
              return (
                <View className='lh-70' key={String(index)}>{_kgFloat}</View>
              )
            })}
          </PickerViewColumn>
        </PickerView>
      </View>
    </View>
  )
}

BMI.config = {
  navigationBarTitleText: 'BMI指数'
};

export default BMI;
