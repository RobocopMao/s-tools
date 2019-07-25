import Taro, {useEffect, useState} from '@tarojs/taro'
import {View, Text, ScrollView, Navigator, Button, Input} from '@tarojs/components'
import scanCodeImg from '../../assets/images/scancode.png'
import './express.scss'
import {getLogisticsDetails, getLogisticsTypeId} from "../../apis/express";
import moment from "moment";

function Express() {
  const [expressNo, setExpressNo] = useState(''); // 快递编号
  const [expressComId, setExpressComId] = useState(''); // 物流公司编号
  const [expressComName, setExpressComName] = useState('');  // 物流公司名称
  const [expressDetails, setExpressDetails] = useState([]);  // 物流信息详情
  const [expressStatus, setExpressStatus] = useState('未知');  // 物流状态

  const [scrollTop, setScrollTop] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(0); // 可使用窗口高度

  // 设置scrollView的高度
  useEffect(() => {
    Taro.getSystemInfo({
      success: res => {
        const query = Taro.createSelectorQuery();
        query
          .select('#expressSearch')
          .boundingClientRect(rect => {
            const scrollHeight = res.windowHeight - rect.height;
            setScrollHeight(scrollHeight);
          })
          .exec()
      }
    })
      .then(res => {})
  }, [scrollHeight]);

  const onScanCode = () => {
    Taro.scanCode({
      success: res => {
        console.log(res);
        setExpressNo(res.result);
      }
    });
  };

  // 地区输入框事件
  const onInput = (e) => {
    setExpressNo(e.detail.value);
  };

  const onSubmit = () => {
    getLogisticsComId(expressNo);
  };

  const onReset = () => {
    setExpressNo('');
    setExpressComId('');
    setExpressComName('');
    setExpressDetails([]);
    setExpressStatus('未知');
  };

  // 获取物流公司id
  const getLogisticsComId = async (logistics_no) => {
    if (logistics_no.replace(/\s+/g, '').length === 0) {
      Taro.showToast({title: '请输入快递单号', icon: 'none'});
      return;
    }

    const res = await getLogisticsTypeId({logistics_no});
    const {searchList} = res;
    if (searchList.length) {
      const {logisticsTypeId, logisticsTypeName} = searchList[0];
      setExpressComId(logisticsTypeId);
      setExpressComName(logisticsTypeName);
      getExpressDetails({logistics_id: logisticsTypeId, logistics_no});
    } else {
      Taro.showToast({title: '没有查到当前单号所对应的物流公司', icon: 'none'});
    }
  };

  // 获取物流详情
  const getExpressDetails = async ({logistics_no, logistics_id}) => {
    const res = getLogisticsDetails({logistics_no, logistics_id});
    setExpressDetails(res.data);
    setExpressComName(res.logisticsType);
    setExpressStatus(res.status);
  };

  return (
    <View className='express'>
      <View className='flex-column' id='expressSearch'>
        <View className='flex-row pd-20'>
          <View className='relative input-box'>
            <Image className='w40 h40 scan-code-img' src={scanCodeImg} onClick={() => onScanCode()} />
            <Input className='bd-1 bd-radius pd-l-60 pd-r-20 pd-t-2 pd-b-2 mg-r-20 h60 lh-60 bd-box w360' type='number'
                 placeholder='请输入快递编号' value={expressNo}
                 onInput={(e) => onInput(e)} />
          </View>
          <Button className='btn pd-l-40 pd-r-40 mg-r-20' hoverClass='btn-hover' onClick={() => onSubmit()}>查询</Button>
          <Button className='btn plain pd-l-40 pd-r-40' hoverClass='plain-btn-hover' onClick={() => onReset()}>重置</Button>
        </View>
        <View className='line' />
        {expressStatus && expressComName && expressNo && <View className='flex-column'>
          <View className='flex-column pd-20'>
            <View className='black font32'>{expressStatus}</View>
            <View>{expressComName}</View>
            <View>{expressNo}：233028626054</View>
          </View>
          <View className='line' />
        </View>}
      </View>
      <ScrollView
        className=''
        scrollY
        scrollWithAnimation
        style={{height: `${scrollHeight}px`}}
        enableBackToTop={true}
        scrollTop={scrollTop}
      >
        <View className='pd-20'>
          {expressDetails.map((detail, index) => {
            return (
              <View className='flex-row' key={String(index)}>
                <View className='flex-column w140'>
                  <Text>{moment(detail.time).format('MM-DD')}</Text>
                  <Text>{moment(detail.time).format('HH:mm')}</Text>
                </View>
                <View className='express-desc pd-l-40'>
                  <View className='pd-b-30'>{detail.desc}</View>
                </View>
              </View>
            )
          })}
          {!expressDetails.length && expressComId && <View className='text-center color9'>暂时没有物流信息</View>}
        </View>
      </ScrollView>
    </View>
  )
}

Express.config = {
  navigationBarTitleText: '快递查询'
};

export default Express;
