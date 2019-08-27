import Taro, {useEffect, useState} from '@tarojs/taro'
import { View } from '@tarojs/components'
import rpn from '../../utils/rpn'
import './calculator.scss'

function Calculator() {
  const [result, setResult] = useState(0);
  const [formula, setFormula] = useState('');
  // const [color, setColor] = useState('');

  // 设置color
  useEffect(() => {
    const {color} = this.$router.params;
    // setColor(color);
    Taro.setNavigationBarColor({frontColor: '#ffffff', backgroundColor: color});
  }, []);

  const onClick = (e) => {
    // console.log(e);
    let val = e.currentTarget.dataset.num;

    // 清空计算表达式
    if (val === 'C') {
      setResult(0);
      setFormula('');
      return;
    }

    // 退格
    if (val === 'Del') {
      if (formula.slice(-1) === ' ') {
        setFormula(formula.slice(0, -3));
        return;
      }

      setFormula(formula.slice(0, -1));
      return;
    }

    // 等号
    if (val === '=') {
      // console.log(this.data.formula)
      // 空直接赋值为0
      if (formula === '') {
        setResult(0);
        return;
      }

      // 计算结果
      // console.log(formula.replace(/\s+/g, ''));
      let result = rpn.calCommonExp(formula.replace(/\s+/g, ''));
      // console.log(result);
      if (Number.isNaN(result)) {
        Taro.showToast({title: '公式错误', icon: 'none'});
      }
      setResult(result);
      return;
    }

    // 设置表达式的值
    let _val;
    if (Number.isNaN(Number(val))) {
      if (val === '(' || val === ')' || val === '.') {
        _val = val;
      } else {
        _val = ' ' + val + ' ';
      }
      // console.log(_val)
    } else {
      _val = val;
    }

    let _formula = formula + _val;
    setFormula(_formula);
  };

  return (
    <View className='calculator flex-column h100-per'>
      <View className='flex-column flex-grow-5'>
        <View className='flex-column pd-20 bd-box'>
          <Textarea className='h140 text-right font36 black' style={{width: '100%'}} value={result} disabled />
        </View>
        <View className='flex-column flex-grow-5 pd-20 bd-box'>
          <Textarea className='h200 text-right font28' style={{width: '100%'}} value={formula} disabled />
        </View>
      </View>
      <View className='flex-row flex-wrap flex-grow-1 bd-t-1'>
        <View className='flex-25per bd-r-1 bd-b-1'>
          <Button className='bd-no bd-radius-no' type='default' dataNum='C' style={{height: '100%'}} onClick={(e) => onClick(e)}>C</Button>
        </View>
        <View className='flex-25per bd-r-1 bd-b-1'>
          <Button className='bd-no bd-radius-no' type='default' dataNum='(' style={{height: '100%'}} onClick={(e) => onClick(e)}>(</Button>
        </View>
        <View className='flex-25per bd-r-1 bd-b-1'>
          <Button className='bd-no bd-radius-no' type='default' dataNum=')' style={{height: '100%'}} onClick={(e) => onClick(e)}>)</Button>
        </View>
        <View className='flex-25per bd-b-1'>
          <Button className='bd-no bd-radius-no' type='default' dataNum='/' style={{height: '100%'}} onClick={(e) => onClick(e)}>➗</Button>
        </View>
        <View className='flex-25per bd-r-1 bd-b-1'>
          <Button className='bd-no bd-radius-no' type='default' dataNum='9' style={{height: '100%'}} onClick={(e) => onClick(e)}>9</Button>
        </View>
        <View className='flex-25per bd-r-1 bd-b-1'>
          <Button className='bd-no bd-radius-no' type='default' dataNum='8' style={{height: '100%'}} onClick={(e) => onClick(e)}>8</Button>
        </View>
        <View className='flex-25per bd-r-1 bd-b-1'>
          <Button className='bd-no bd-radius-no' type='default' dataNum='7' style={{height: '100%'}} onClick={(e) => onClick(e)}>7</Button>
        </View>
        <View className='flex-25per bd-b-1'>
          <Button className='bd-no bd-radius-no' type='default' dataNum='*' style={{height: '100%'}} onClick={(e) => onClick(e)}>✖</Button>
        </View>
        <View className='flex-25per bd-r-1 bd-b-1'>
          <Button className='bd-no bd-radius-no' type='default' dataNum='6' style={{height: '100%'}} onClick={(e) => onClick(e)}>6</Button>
        </View>
        <View className='flex-25per bd-r-1 bd-b-1'>
          <Button className='bd-no bd-radius-no' type='default' dataNum='5' style={{height: '100%'}} onClick={(e) => onClick(e)}>5</Button>
        </View>
        <View className='flex-25per bd-r-1 bd-b-1'>
          <Button className='bd-no bd-radius-no' type='default' dataNum='4' style={{height: '100%'}} onClick={(e) => onClick(e)}>4</Button>
        </View>
        <View className='flex-25per bd-b-1'>
          <Button className='bd-no bd-radius-no' type='default' dataNum='+' style={{height: '100%'}} onClick={(e) => onClick(e)}>➕</Button>
        </View>
        <View className='flex-25per bd-r-1 bd-b-1'>
          <Button className='bd-no bd-radius-no' type='default' dataNum='3' style={{height: '100%'}} onClick={(e) => onClick(e)}>3</Button>
        </View>
        <View className='flex-25per bd-r-1 bd-b-1'>
          <Button className='bd-no bd-radius-no' type='default' dataNum='2' style={{height: '100%'}} onClick={(e) => onClick(e)}>2</Button>
        </View>
        <View className='flex-25per bd-r-1 bd-b-1'>
          <Button className='bd-no bd-radius-no' type='default' dataNum='1' style={{height: '100%'}} onClick={(e) => onClick(e)}>1</Button>
        </View>
        <View className='flex-25per bd-b-1'>
          <Button className='bd-no bd-radius-no' type='default' dataNum='-' style={{height: '100%'}} onClick={(e) => onClick(e)}>➖</Button>
        </View>
        <View className='flex-25per bd-r-1'>
          <Button className='bd-no bd-radius-no' type='default' dataNum='Del' style={{height: '100%'}} onClick={(e) => onClick(e)}>Del</Button>
        </View>
        <View className='flex-25per bd-r-1'>
          <Button className='bd-no bd-radius-no' type='default' dataNum='0' style={{height: '100%'}} onClick={(e) => onClick(e)}>0</Button>
        </View>
        <View className='flex-25per bd-r-1'>
          <Button className='bd-no bd-radius-no' type='default' dataNum='.' style={{height: '100%'}} onClick={(e) => onClick(e)}>·</Button>
        </View>
        <View className='flex-25per'>
          <Button className='bold bd-no bd-radius-no' type='default' dataNum='=' style={{height: '100%'}} onClick={(e) => onClick(e)}>=</Button>
        </View>
      </View>
    </View>
  )
}

Calculator.config = {
  navigationBarTitleText: '简易计算器'
};

export default Calculator;
