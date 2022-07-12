<template>
  <view class="pages">
    <lk-load-list ref="load" @init="loadInit" :down="downOption" @down="downCallback" :up="upOption" @up="upCallback">
      <view v-for="(item, index) in list" :key="index">
        <lk-cell :to='"/packages/message/wxchat?messsge_no=" + item.messsge_no + "&to_uid=" + item.uid'>
          <view class="info">
            <view class="left">
              <lk-avatar :size="80" :src="item.user_headimg" />
              <view>
                <view class="title">{{ item.nick_name }}</view>
                <view class="time">{{ item.create_time }}</view>
              </view>
            </view>
            <view class="">
              <view class="unread-num">{{ item.unread_num }}</view>
              <view class="time">{{ item.content }}</view>
            </view>
          </view>

        </lk-cell>
      </view>
    </lk-load-list>
  </view>
</template>

<script>
import { MESSAGELIST } from "@/common/interface/message";
import loadMixin from "@/mixins/load-list";
import { formatDate } from "@/common/utils";
export default {
  name: "packages-message-wxnotice",
  data () {
    return {
      params: {
        page_index: 1,
        page_size: 20
      },
      upOption: {
        empty: {
          tip: "暫無消息通知"
        }
      }
    };
  },
  mixins: [loadMixin],
  onLoad () { },
  methods: {
    upCallback (page) {
      this.params.page_index = page.num;
      MESSAGELIST(this.params)
        .then(({ data }) => {
          let list = data.data || [];
          this.concatList(list, data.total_count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.time {
  font-size: $font-size-sm;
  color: $text-light;
  text-align: center;
}

.info {
  line-height: 40rpx;
  background-color: #ffffff;
  padding: $cell-padding;
  display: flex;
  justify-content: space-between;

  .left {
    display: flex;
  }

  .title {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: $text-color;
  }

  .content {
    width: 45%;
    color: $text-gray;
    line-height: 40rpx;
    margin-top: 12rpx;
    font-size: $font-size-sm;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .unread-num {
    height: 50rpx;
    width: 50rpx;
    border-radius: 25rpx;
    background: #e20026;
    color: #fff;
    text-align: center;
    line-height: 50rpx;
  }
}
</style>
