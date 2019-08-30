import Taro, {useEffect, useState} from '@tarojs/taro'
import {View, Text, Button, Input} from '@tarojs/components'
import {getLogisticsDetails, getLogisticsTypeId} from '../../../../apis/express'
import moment from 'moment';
import './index.scss'

function Index() {
  const [expressNo, setExpressNo] = useState(''); // 快递编号
  const [expressComId, setExpressComId] = useState(''); // 物流公司编号
  const [expressComName, setExpressComName] = useState('');  // 物流公司名称
  const [expressDetails, setExpressDetails] = useState([]);  // 物流信息详情
  const [expressStatus, setExpressStatus] = useState('');  // 物流状态
  const [color, setColor] = useState('');

  // 设置color
  useEffect(() => {
    const {color} = this.$router.params;
    setColor(color);
    Taro.setNavigationBarColor({frontColor: '#ffffff', backgroundColor: color});
  }, []);

  // 从快递记录过来
  useEffect(() => {
    const {expressNo, expressComId, expressComName} = this.$router.params;
    // console.log(expressComId, expressNo);
    if (expressNo && expressComId) {
      // console.log('not undefined');
      setExpressNo(expressNo);
      setExpressComId(Number(expressComId));
      setExpressComName(expressComName);
      getExpressDetails({logistics_id: Number(expressComId), logistics_no: expressNo, expressComName});
    }
  }, []);

  const onScanCode = () => {
    Taro.scanCode({
      success: res => {
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
    setExpressStatus('');
  };

  // 获取物流公司id
  const getLogisticsComId = async (logistics_no) => {
    if (logistics_no.replace(/\s+/g, '').length === 0) {
      Taro.showToast({title: '请输入快递单号', icon: 'none'});
      return;
    }

    const res = await getLogisticsTypeId({logistics_no});
    let {searchList} = res;
    if (searchList.length === 1) {
      const {logisticsTypeId, logisticsTypeName} = searchList[0];
      setExpressComId(logisticsTypeId);
      setExpressComName(logisticsTypeName);
      getExpressDetails({logistics_id: logisticsTypeId, logistics_no, expressComName: logisticsTypeName});
    } else if (searchList.length === 0) {
      Taro.showToast({title: '没有查到当前单号所对应的物流公司', icon: 'none'});
      // onReset();
      setExpressDetails([]);
      setExpressStatus('');
      setExpressComId('');
    } else {
      let itemList = [];
      for (let i = 0; i < searchList.length; i++) {
        itemList.push(searchList[i].logisticsTypeName);
      }
      // console.log(itemList);

      Taro.showActionSheet({
        itemList: itemList,
        success: res => {
          const {logisticsTypeId, logisticsTypeName} = searchList[res.tapIndex];
          setExpressComId(logisticsTypeId);
          setExpressComName(logisticsTypeName);
          getExpressDetails({logistics_id: logisticsTypeId, logistics_no, expressComName: logisticsTypeName});
        }
      });
    }
  };

  // 获取物流详情
  const getExpressDetails = async ({logistics_no, logistics_id, expressComName}) => {
    const res = await getLogisticsDetails({logistics_no, logistics_id});
    if (!res.code) {  // 返回code = 0
      Taro.showToast({title: res.msg, icon: 'none'});
      setExpressDetails([]);
      setExpressStatus('');
      saveExpressNotes({expressComName, expressComId: logistics_id, expressNo: logistics_no, status: ''});
    } else {
      const {data, logisticsType, status} = res.data;
      setExpressDetails(data.reverse());
      setExpressComName(logisticsType);
      setExpressStatus(status);
      saveExpressNotes({expressComName, expressComId: logistics_id, expressNo: logistics_no, status});
    }
  };

  const saveExpressNotes = ({expressComName, expressComId, expressNo, status}) => {
    // 存入本地
    let localExpressNotes = Taro.getStorageSync('localExpressNotes') ? Taro.getStorageSync('localExpressNotes') : [];
    // console.log(localExpressNotes);

    let index = 0;
    let isExist = localExpressNotes.find((v, i, arr) => {
      index = i;
      return v.expressComId === expressComId && v.expressNo === expressNo;
    });
    // console.log(index);
    if (isExist) { // 已经查询过，存在
      isExist.status = status;
      localExpressNotes.splice(index, 1, isExist);
    } else {  // 不存在，就创建一个
      let obj = {};
      obj.date = moment().format('YYYY-MM-DD');
      obj.expressComName = expressComName;
      obj.expressComId = expressComId;
      obj.expressNo = expressNo;
      obj.status = status;
      localExpressNotes.unshift(obj);
    }

    Taro.setStorageSync('localExpressNotes', localExpressNotes);
    Taro.setStorageSync('expressNoteUpdate', true);
  };

  return (
    <View className='express'>
      <View className='flex-column pos-sticky'>
        <View className='pd-t-10 pd-b-20 pd-l-20 pd-r-20' style={{backgroundColor: color}}>
          <View className='flex-row bd-radius-50 of-hidden'>
            <Button className='iconfont pd-0 h80 w80 lh-80 bd-radius-no bg-white font46 color-6e' hoverClass='' onClick={() => onScanCode()}>&#xe697;</Button>
            <Input className='flex-grow-1 pd-r-20 pd-t-2 pd-b-2 h80 lh-80 bd-box bg-white' type='text'
                   placeholder='请输入快递编号' value={expressNo}
                   onInput={(e) => onInput(e)} />
            {expressNo && <Button className='iconfont pd-0 h80 w80 lh-80 bd-radius-no bg-white font46 color-6e' hoverClass='' onClick={() => onReset()}>&#xe6b1;</Button>}
            <Button className='iconfont pd-0 h80 w80 lh-80 bd-radius-no bg-white font50 color-6e' hoverClass='' onClick={() => onSubmit()}>&#xe683;</Button>
          </View>
        </View>
        {expressComName && expressNo && <View className='flex-column bg-white'>
          <View className='flex-column pd-20'>
            {expressStatus && <View className='black font32'>{expressStatus}</View>}
            <View>{expressComName}</View>
            <View>快递单号：{expressNo}</View>
          </View>
          <View className='line' />
        </View>}
      </View>
      <View className='pd-20 font26'>
        {expressDetails.map((detail, index) => {
          return (
            <View className={`flex-row ${index === 0 ? 'black' : ''}`} key={String(index)}>
              <View className='flex-column express-time'>
                <Text>{moment(detail.time).format('MM-DD')}</Text>
                <Text className='font24 mg-l-10'>{moment(detail.time).format('HH:mm')}</Text>
              </View>
              <View className='express-desc pd-l-40'>
                <View className='pd-b-40 font26'>{detail.desc}</View>
              </View>
            </View>
          )
        })}
        {!expressDetails.length && expressComId && <View className='text-center color9'>暂时没有物流信息</View>}
      </View>
    </View>
  )
}

Index.config = {
  navigationBarTitleText: '快递查询'
};

export default Index;
