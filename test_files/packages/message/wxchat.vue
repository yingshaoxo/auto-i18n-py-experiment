<template>
  <view>
    <view class="list" @touchstart="touchstart">
      <view v-if="isLoading" class="msg-loading">
        <lk-loading><text class="text">加載中</text></lk-loading>
      </view>
      <view v-if="!isLoading && !isLoaded" @click="more" class="msg-end" style="color: #3388ff;">查看更多...</view>
      <view v-if="isLoaded" class="msg-end">沒有更多消息了</view>
      <view class="item" v-for="(item, index) in list" :key="index" :id="`msg-${item.id}`">
        <chat-item :info="item" @send-goods="onSend" @send-question="onSendQuestion"></chat-item>
      </view>
    </view>
    <action-bar :wxMessage="true" @send="onSend" />
  </view>
</template>
<script>
import actionBar from "./component/action-bar";
import chatItem from "./component/wxchat-item";
import { MESSAGEDETAIL, SENDMESSAGE } from "@/common/interface/message";
import { mapState } from "vuex";
import { throttle } from "@/common/utils";
export default {
  name: '',
  data () {
    return {
      params: {
        messsge_no: "",
        wx_id: "",
        id: "",
        type: "1",
        page_index: "1",
        page_size: "10",
        mes_type: ''  // up新数据 next旧数据
      },
      sendParams: {
        wx_id: "",
        to_uid: "",
        goods_id: "",
        goods_name: "",
        content: ""
      },
      goods: {},
      isLoading: false,
      reachTopNum: 20,
      isLoaded: false,
      list: [],
      count: 0,
      times: null,

    };
  },
  components: { actionBar, chatItem },
  props: {},
  computed: {
    ...mapState({
      info: ({ member }) => member.info
    })
  },
  onLoad (query) {
    const { messsge_no, to_uid, wx_id, goods } = query
    if (messsge_no) {
      this.params.messsge_no = messsge_no
      this.sendParams.to_uid = to_uid

    } else if (wx_id) {
      this.params.wx_id = wx_id
      this.sendParams.wx_id = wx_id
      this.goods = query.goods ? JSON.parse(query.goods) : "";
      this.list.push({
        type: "goods",
        goods: {
          ...this.goods
        },
        log_id: "goods-" + new Date().getTime()
      });
    }
    this.getList()
    this.times = setInterval(() => {
      this.params.id = this.list[this.list.length - 1].id
      this.getList('up')
    }, 2000);
  },
  onHide () {
    if (this.times) {
      clearInterval(this.times)
    }
  },
  onUnload () {
    if (this.times) {
      clearInterval(this.times)
    }
  },
  // onPageScroll: throttle(function ({ scrollTop }) {
  //   console.log('onPageScroll', scrollTop)
  //   if (
  //     scrollTop < this.reachTopNum &&
  //     !this.isLoaded &&
  //     !this.isLoading &&
  //     !this.isReachTop
  //   ) {
  //     this.isReachTop = true;
  //     this.params.id = this.list[0].id
  //     this.getList('next');
  //   } else if (scrollTop >= this.reachTopNum) {
  //     this.isReachTop = false;
  //   }
  // }, 250),
  methods: {
    getList (mes_type) {
      this.params.mes_type = mes_type ? mes_type : 'up'
      if (mes_type == 'next') {
        this.isLoading = true
      }

      MESSAGEDETAIL(this.params).then(({ data }) => {
        if (!mes_type) {
          this.count = data.count
        }
        this.isLoading = false
        let newData = []
        if (mes_type == 'next') {
          newData = data.data;
        } else {
          newData = data.data.reverse();
        }
        newData.forEach(item => {
          console.log(mes_type)
          if (mes_type == 'next') {
            console.log(mes_type)
            this.list.unshift(item)
          } else {
            console.log(mes_type)
            this.list.push(item)
          }

        })
        if (this.count == this.list.length) {
          this.isLoaded = true
        }
        if (!mes_type) {
          this.wordBottom();
        }
      })
    },
    more () {
      this.params.id = this.list[0].id
      this.getList('next')
    },
    onSend (e) {
      let _params = {
        wx_id: this.sendParams.wx_id,
        to_uid: this.sendParams.to_uid,
        goods_id: "",
        goods_name: "",
        content: ""
      }
      if (typeof e == 'string') {
        _params.content = e
      } else {
        _params.goods_id = e.id
        _params.goods_name = e.name
        _params.goods_img = e.img
        _params.price = e.price
      }
      SENDMESSAGE(_params).then(({ data }) => {
        this.list.push(Object.assign({ type: "mine" }, data));
        this.wordBottom();
        uni.hideKeyboard();
      })
    },
    //点击列表关闭键盘
    touchstart () {
      uni.hideKeyboard();
    },
    // 滾動底部
    wordBottom () {
      setTimeout(() => {
        uni.pageScrollTo({
          scrollTop: 99999999,
          duration: 300
        });
      }, 100);
    },
  },
}
</script>
<style scoped lang='scss'>
.list {
  padding-bottom: 100rpx;
  box-sizing: content-box;
  padding-bottom: calc(100rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
}

.msg-end {
  padding: 40rpx;
  text-align: center;
  color: $text-light;
  font-size: $font-size-sm;
}

.msg-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100rpx;

  .text {
    padding: 0 20rpx;
  }
}
</style>