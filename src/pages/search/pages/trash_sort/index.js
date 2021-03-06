import Taro, {useEffect, useRouter, useState} from '@tarojs/taro'
import {View, Text, Input} from '@tarojs/components'
import { getRubbishType } from '../../../../apis/trash'
import {ComponentCommonBannerAd} from '../../../../components/common/banner_ad'
import './index.scss'

function TrashSort() {
  const router = useRouter();
  const [trashName, setTrashName] = useState('');
  const [goodsName, setGoodsName] = useState('');
  const [goodsType, setGoodsType] = useState('');
  const [recommend, setRecommend] = useState([]);
  const [color, setColor] = useState('');

  // 设置color
  useEffect(() => {
    const {color} = router.params;
    setColor(color);
    Taro.setNavigationBarColor({frontColor: '#ffffff', backgroundColor: color});
  }, []);

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
    let tId = setTimeout(() => {
      Taro.pageScrollTo({
        scrollTop: 0,
        duration: 500
      });
      clearTimeout(tId);
    }, 500)
  };

  // 重置事件
  const onReset = () => {
    setTrashName('');
    setGoodsName('');
    setGoodsType('');
    setRecommend([]);
    let tId = setTimeout(() => {
      Taro.pageScrollTo({
        scrollTop: 0,
        duration: 500
      });
      clearTimeout(tId);
    }, 500)
  };

  return (
    <View className='trash-sort'>
      <View className='flex-column pos-sticky pd-t-10 pd-b-20' style={{backgroundColor: color}}>
        <View className='flex-row bd-radius-50 mg-l-20 mg-r-20 of-hidden'>
          <Input className='flex-grow-1 pd-l-30 pd-r-20 pd-t-2 pd-b-2 h80 lh-80 bd-box bg-white' type='text'
                 placeholder='请输入垃圾名称' value={trashName}
                 onInput={(e) => onInput(e)} />
          {trashName && <Button className='iconfont pd-0 h80 w80 lh-80 bd-radius-no bg-white font46 color-6e' hoverClass='' onClick={() => onReset()}>&#xe6b1;</Button>}
          <Button className='iconfont pd-0 h80 w80 lh-80 bd-radius-no bg-white font50 color-6e' hoverClass='' onClick={() => onSubmit()}>&#xe683;</Button>
        </View>
      </View>
      <View className='pd-20'>
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
          {/*广告位*/}
          <View className='mg-t-40 mg-b-40'>
            <ComponentCommonBannerAd />
          </View>
        </View>}
      </View>
    </View>
  )
}

TrashSort.config = {
  navigationBarTitleText: '垃圾分类'
};

export default TrashSort;
