import Taro, {useEffect, useState} from '@tarojs/taro'
import {View, Text, ScrollView, Button, Checkbox} from '@tarojs/components'
import moment from 'moment'
import groupBy from 'lodash/groupBy'
import forEach from 'lodash/forEach'
import './index.scss'

function ExpressNote() {
  const [noteList, setNoteList] = useState([]);
  const [showCheckbox, setShowCheckbox] = useState(false);
  const [checkboxValue, setCheckboxValue] = useState([]);
  const [scrollHeight, setScrollHeight] = useState(0); // 可使用窗口高度
  const [color, setColor] = useState('');

  // 设置color
  useEffect(() => {
    const {color} = this.$router.params;
    setColor(color);
    Taro.setNavigationBarColor({frontColor: '#ffffff', backgroundColor: color});
  }, []);

  // 设置scrollView的高度
  useEffect(() => {
    Taro.getSystemInfo({
      success: res => {
        const query = Taro.createSelectorQuery();
        query
          .select('#btmBtn')
          .boundingClientRect(rect => {
            const scrollHeight = res.windowHeight - rect.height;
            setScrollHeight(scrollHeight);
          })
          .exec()
      }
    })
      .then(res => {})
  }, [scrollHeight]);

  useEffect(() => {
    formatNoteList();
    onShow();
  }, []);

  const onShow = () => {
    this.$scope.onShow = () => {
      if (Taro.getStorageSync('expressNoteUpdate')) {
        formatNoteList();
        Taro.setStorageSync('expressNoteUpdate', false);
      }
    };
  };

  // 格式化数据
  const formatNoteList = () => {
    const localExpressNotes = Taro.getStorageSync('localExpressNotes');

    if (localExpressNotes) {
      let groupByObj = groupBy(localExpressNotes, 'date');  // 以date分组，得对象

      let noteList = [];
      forEach(groupByObj, (value, key) => { // 得数组
        let obj = {};
        obj[key] = value;
        noteList.push(obj);
      });

      setNoteList(noteList);
    }
  };

  // 去详细页
  const goDetails = (expressNo = '', expressComId = '', expressComName = '') => {
    if (showCheckbox) {return;}
    Taro.navigateTo({url: `/pages/search/pages/express/index?&expressNo=${expressNo}&expressComId=${expressComId}&expressComName=${expressComName}&color=${color}`});
  };

  // 选中/未选中checkbox事件
  const checkboxChange = (e) => {
    // console.log(e);
    const value = e.detail.value;
    setCheckboxValue(value);
  };

  // 长按进去编辑状态
  const edit = () => {
    setShowCheckbox(true);
  };

  // 取消编辑
  const cancelEdit = () => {
    setShowCheckbox(false);
    setCheckboxValue([]);  // 可以不用设置
  };

  // 删除选中的记录
  const delNotes = () => {
    let localExpressNotes = Taro.getStorageSync('localExpressNotes');
    forEach(checkboxValue, (value, key) => {
      let arr = value.split('_');
      let expressNo = arr[0];
      let expressComId = Number(arr[1]);

      forEach(localExpressNotes, (_value, _key) => {
        if (_value.expressNo === expressNo && _value.expressComId === expressComId) {
          localExpressNotes.splice(_key, 1);
          return false;
        }
      });

      // console.log(localExpressNotes);
      Taro.setStorageSync('localExpressNotes', localExpressNotes);
      setShowCheckbox(false);
      setCheckboxValue([]);

      formatNoteList();
    });
  };

  return (
    <View className='express-note relative h100-per'>
      <ScrollView
        className=''
        scrollY
        scrollWithAnimation
        style={{height: `${scrollHeight}px`}}
        // enableBackToTop={true}
        // scrollTop={scrollTop}
      >
        <CheckboxGroup className='pd-20 font26' onChange={(e) => checkboxChange(e)}>
          {noteList.map((list, index) => {
            return (
              <View className='pd-b-30' key={String(index)}>
                <View style={{color}}>{moment(Object.keys(list)[0]).format('M月D日')}</View>
                <View className='line mg-t-16 mg-b-16' />
                {list[Object.keys(list)[0]].map((detail, index1) => {
                  return (
                    <View className='flex-row mg-b-24' key={String(index1) + '_1'}>
                      {showCheckbox && <View className='flex-grow-1 flex-row flex-col-center flex-row-center edit-checkbox' >
                        <Checkbox name={`${detail.expressNo}_${detail.expressComId}`} value={`${detail.expressNo}_${detail.expressComId}`} />
                      </View>}
                      <View className='flex-row space-between flex-grow-5'
                            onClick={() => goDetails(detail.expressNo, detail.expressComId, detail.expressComName)}
                            onLongPress={() => edit()}
                      >
                        <View className='flex-column'>
                          <Text className='font30 black'>{detail.expressComName}</Text>
                          <Text>{detail.expressNo}</Text>
                        </View>
                        <View className='flex-row flex-col-center'>
                          <Text>{detail.status ? detail.status : '暂无信息'}</Text>
                          <View className='iconfont w34 h34 lh-34 black'>&#xe65b;</View>
                        </View>
                      </View>
                    </View>
                  )
                })}
              </View>
            )
          })}

          {!noteList.length && <View className='text-center color9'>暂无查询记录</View>}
        </CheckboxGroup>
      </ScrollView>
      <View className='btm-btn' id='btmBtn'>
        {!showCheckbox && <Button className='btn search-btn' style={{backgroundColor: color}} hoverClass='btn-hover' onClick={() => goDetails()}>手动查询</Button>}
        {showCheckbox && <View className='flex-row edit-btn'>
          <Button className='btn flex-grow-1 cancel-btn relative' hoverClass='cancel-btn-hover' onClick={() => cancelEdit()}>取消</Button>
          <Button className='btn flex-grow-1' style={{backgroundColor: color}} hoverClass='btn-hover' onClick={() => delNotes()}>删除</Button>
        </View>}
      </View>
    </View>
  )
}

ExpressNote.config = {
  navigationBarTitleText: '查询记录'
};

export default ExpressNote;
