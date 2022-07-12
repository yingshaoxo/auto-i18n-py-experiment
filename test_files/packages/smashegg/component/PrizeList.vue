<!-- // 幸運大轉盤中獎紀錄 -->
<template>
  <view class="prizepage">
    <view class="prize-wrap">
      <view class="prize-title" >幸運大轉盤中獎記錄</view>
      <view class="prize-list-wrap" >
        <ul class="item">    
         
<!-- <tony-Scroll :list='win'> </tony-scroll> -->
       
        </ul>
      </view>
    
    </view>
  </view>
</template>
<script>
import tonyScroll from "./tony-scroll" 
export default {
  data() {
    return {
    
      nowTime: null, //定時器標識
      copyHtml: null,
    
    };
  },
  
//   父組件傳的數據
   props: {
    win:{}

    
  },

 
  onload() {
   
  },
  components:{
    'tony-Scroll':tonyScroll
  },


  methods: {
 
  }
};
</script>
<style scoped>
/* .prizepage{
  position: relative;
  width: 100vw;
  height: 100vh;

} */
.prize-wrap {
  margin: 10rpx;
  background-color: #fff;
  border-radius: 20rpx;
  position: relative;
  bottom: 0;
  width: 90%;
  height: 300rpx;

}
.prize-title {
  text-align: center;
  font-size: 28rpx;
  color: #e84d2f;
  width: 100%;
  padding-top: 40rpx;
}
.prize-list-wrap {
  overflow: hidden;
 overflow-y: auto;
  padding: 12rpx 0px;
  color: #666;
  height: 178px;
}
.prize-list-wrap ul {
  position: relative;
  display: block;
  overflow: hidden;
 
}
.prize-list-wrap ul li {
  height: 36rpx;
  line-height: 36rpx;
  font-size: 26rpx;
  display: flex;
}
.prize-list-wrap ul li text {
  flex: 1;
}
.prize-list-wrap ul li text:last-child {
  text-align: right;
}
</style>

