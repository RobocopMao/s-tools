import Taro, {useEffect, useState} from '@tarojs/taro'
import {View, Text, ScrollView, Button} from '@tarojs/components'
import arrowRightImg from '../../assets/images/arrow_right.png'
import './express_note.scss'
import moment from 'moment'
import groupBy from 'lodash/groupBy'
import forEach from 'lodash/forEach'

function ExpressNote() {
  const [noteList, setNoteList] = useState([]);

  const [scrollHeight, setScrollHeight] = useState(0); // 可使用窗口高度

  // 设置scrollView的高度
  useEffect(() => {
    Taro.getSystemInfo({
      success: res => {
        const query = Taro.createSelectorQuery();
        query
          .select('#searchBtn')
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

  const goDetails = (expressNo = '', expressComId = '', expressComName = '') => {
    Taro.navigateTo({url: `../../pages/express/express?&expressNo=${expressNo}&expressComId=${expressComId}&expressComName=${expressComName}`});
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
        <View className='pd-20 font26'>
          {noteList.map((list, index) => {
            return (
              <View className='pd-b-20' key={String(index)}>
                <View>{moment(Object.keys(list)[0]).format('M月D日')}</View>
                <View className='line mg-t-16 mg-b-16' />
                {list[Object.keys(list)[0]].map((detail, index1) => {
                  return (
                    <View className='flex-row space-between mg-b-20' key={String(index1) + '_1'} onClick={() => goDetails(detail.expressNo, detail.expressComId, detail.expressComName)}>
                      <View className='flex-column'>
                        <Text className='font30 black'>{detail.expressComName}</Text>
                        <Text>{detail.expressNo}</Text>
                      </View>
                      <View className='flex-row flex-col-center'>
                        <Text>{detail.status ? detail.status : '暂无信息'}</Text>
                        <Image className='w34 h34' src={arrowRightImg} />
                      </View>
                    </View>
                  )
                })}
              </View>
            )
          })}

          {!noteList.length && <View className='text-center color9'>暂无查询记录</View>}
        </View>
      </ScrollView>
      <View className='search-btn' id='searchBtn'>
        <Button className='btn' hoverClass='btn-hover' onClick={() => goDetails()}>手动查询</Button>
      </View>
    </View>
  )
}

ExpressNote.config = {
  navigationBarTitleText: '查询记录'
};

export default ExpressNote;
