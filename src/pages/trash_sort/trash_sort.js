import Taro, {useEffect, useState} from '@tarojs/taro'
import {View, Text, Input, ScrollView} from '@tarojs/components'
import { getRubbishType } from '../../apis/trash'
import './trash_sort.scss'

function TrashSort() {
  const [trashName, setTrashName] = useState('');
  const [goodsName, setGoodsName] = useState('');
  const [goodsType, setGoodsType] = useState('');
  const [recommend, setRecommend] = useState([]);
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(0); // 可使用窗口高度

  // 设置scrollView的高度
  useEffect(() => {
    Taro.getSystemInfo({
      success: res => {
        const query = Taro.createSelectorQuery();
        query
          .select('#trashSortSearch')
          .boundingClientRect(rect => {
            const scrollHeight = res.windowHeight - rect.height;
            setScrollHeight(scrollHeight);
          })
          .exec()
      }
    })
      .then(res => {})
  }, [scrollHeight]);

  // 显示转发按钮
  useEffect(() => {
    Taro.showShareMenu({
      withShareTicket: true
    });
  }, []);

  // 地区输入框事件
  const onInput = (e) => {
    setTrashName(e.detail.value);
  };

  // 查询事件
  const onSubmit = async () => {
    if (trashName.replace(/\s+/g, '').length === 0) {
      Taro.showToast({title:'请输入垃圾名称', icon: 'none'});
      return;
    }
    setGoodsType('');
    setRecommend([]);
    const res = await getRubbishType({name: trashName});
    const {goodsName, goodsType} = res.aim;
    const recommend = res.recommendList;
    setGoodsName(goodsName);
    setGoodsType(goodsType);
    setRecommend(recommend);
    setScrollTop(scrollTop ? 0 : 0.1);
  };

  // 重置事件
  const onReset = () => {
    setTrashName('');
    setGoodsName('');
    setGoodsType('');
    setRecommend([]);
    setScrollTop(scrollTop ? 0 : 0.1);
  };

  return (
    <View className='trash-sort'>
      <View className='flex-row pd-20' id='trashSortSearch'>
        <Input className='bd-1 bd-radius pd-l-20 pd-r-20 pd-t-2 pd-b-2 mg-r-20 h60 lh-60 bd-box' type='text'
               placeholder='请输入垃圾名称' value={trashName}
               onInput={(e) => onInput(e)} />
        <Button className='btn pd-l-40 pd-r-40 mg-r-20' hoverClass='btn-hover' onClick={() => onSubmit()}>查询</Button>
        <Button className='btn plain pd-l-40 pd-r-40' hoverClass='plain-btn-hover' onClick={() => onReset()}>重置</Button>
      </View>
      <ScrollView
        className=''
        scrollY
        scrollWithAnimation
        style={{height: `${scrollHeight}px`}}
        enableBackToTop={true}
        scrollTop={scrollTop}
      >
        <View className='pd-20 pd-t-0'>
          {goodsType && <View className='flex-column'>
            <Text className='black mg-b-10'>查询结果：</Text>
            <View className='table flex-column'>
              <View className='th flex-row'>
                <View className='flex-50per text-center pd-12 bold black'>垃圾名称</View>
                <View className='flex-50per text-center pd-12 bold black'>垃圾类型</View>
              </View>
              <View className='tr flex-row'>
                <View className='flex-50per text-center pd-12'>{goodsName}</View>
                {goodsType === '有害垃圾' && <View className='flex-50per text-center pd-12 orange'>{goodsType}</View>}
                {goodsType === '可回收物' && <View className='flex-50per text-center pd-12 green'>{goodsType}</View>}
                {goodsType !== '可回收物' && goodsType !== '有害垃圾' && <View className='flex-50per text-center pd-12'>{goodsType}</View>}
              </View>
            </View>
          </View>}
          {recommend.length && <View>
            <View className='black mg-b-10 mg-t-20'>其他相关推荐：</View>
            <View className='table flex-column'>
              <View className='th flex-row'>
                <View className='flex-50per text-center pd-12 bold black'>垃圾名称</View>
                <View className='flex-50per text-center pd-12 bold black'>垃圾类型</View>
              </View>
              {recommend.map((list, index) => {
                return (
                  <View className='tr flex-row' key={String(index)}>
                    <View className='flex-50per text-center pd-12'>{list.goodsName}</View>
                    {list.goodsType === '有害垃圾' && <View className='flex-50per text-center pd-12 orange'>{list.goodsType}</View>}
                    {list.goodsType === '可回收物' && <View className='flex-50per text-center pd-12 green'>{list.goodsType}</View>}
                    {list.goodsType !== '可回收物' && list.goodsType !== '有害垃圾' && <View className='flex-50per text-center pd-12'>{list.goodsType}</View>}
                  </View>
                )
              })}
            </View>
          </View>}
        </View>
      </ScrollView>
    </View>
  )
}

TrashSort.config = {
  navigationBarTitleText: '垃圾分类'
};

export default TrashSort;
