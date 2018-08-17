<template>
  <div class="message">
    <h3 class="message-title">
      <span>{{$t('message.my_message')}}<!--我的站内消息--></span>
      <select v-model="formData.timeRange">
        <option v-for="(item, index) in timeRangeList" :value="item.value" :key="index">{{$t(item.text)}}</option>
      </select>
      <a :class="{disabled: unReadLength === 0}" href="javascript:;" @click="markAllRead">{{$t('message.all_read')}}<!--全部标记为已读--></a>
    </h3>
    <div class="message-cont">
      <ul class="message-list" v-if="!show && datas.length > 0">
        <li class="message-item" :class="{markread: item.messageState === 1}" v-for="(item, index) in datas" :key="index">
          <p class="message-item-title" @click="markItemRead(item)">
            <span class="main">{{formatSystemMessage(item.title, item.msgType !== 5)}}</span>
            <span class="time">{{item.msgTime}}</span>
          </p>
          <div class="message-item-cont" v-show="item.show">
            <div class="inner">{{formatSystemMessage(item.body, item.msgType !== 5)}}</div>
          </div>
        </li>
      </ul>
      <page v-if="!show && datas.length > 0" :pageIndex="formData.currentPage" :pageSize="formData.showItem" :total="formData.totalItem" @changePageIndex="pageChange"/>
      <div class="message-nodata" v-if="!show && datas.length === 0">
        <div class="message-nodata-icon icon-no-order"></div>
        <div class="message-nodata-text">{{$t('message.no_message')}}<!--暂无站内消息--></div>
      </div>
      <loading v-if="show"/>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import msgApi from '@/api/individual'
import loading from '@/components/loading'
import page from '@/components/page'
import utils from '@/assets/js/utils'
export default {
  components: {
    loading,
    page
  },
  data () {
    return {
      show: true,
      formData: {
        timeRange: '1h',
        showItem: 6,
        currentPage: 1,
        totalItem: 0,
        totalPage: 1
      },
      datas: [],
      unReadLength: 0
    }
  },
  computed: {
    paramsChange () {
      return {
        period: this.formData.timeRange,
        show: this.formData.showItem,
        page: this.formData.currentPage
      }
    },
    timeRangeList () {
      return [
        {id: 1, value: '1h', text: 'message.last_1h', name: '最近一小时'},
        {id: 2, value: '1d', text: 'message.last_1d', name: '最近一天'},
        {id: 3, value: '1m', text: 'message.last_1m', name: '最近一个月'}
      ]
    }
  },
  watch: {
    paramsChange (newVal, oldVal) {
      this.getList()
      if (newVal.period !== oldVal.period) {
        this.formData.currentPage = 1
      }
    }
  },
  created () {
    this.getList()
    this.getUnReadLength()
  },
  methods: {
    formatSystemMessage: utils.formatSystemMessage,
    getList () {
      this.datas = []
      this.show = true
      msgApi.getMessages(this.paramsChange, (res) => {
        this.formData.totalItem = res.total
        this.formData.totalPage = Math.max(1, Math.ceil(res.total / this.formData.showItem))
        res.data.forEach((item) => {
          item.show = false
        })
        this.datas = res.data
        this.show = false
      }, (msg) => {
        if (msg === 'NOT_FIND_MESSAGE') {
          this.show = false
        } else {
          console.error(msg)
        }
      })
    },
    getUnReadLength () {
      // 参数为空时获取所有未读消息
      msgApi.getMessages({}, (res) => {
        this.unReadLength = res.data.length
      })
    },
    pageChange (currentIndex) {
      this.formData.currentPage = currentIndex
    },
    markItemRead (item) {
      item.show = item.show === false
      if (item.messageState === 0) {
        msgApi.markItemRead({
          messageId: item.messageId
        }, (msg) => {
          item.messageState = 1
          this.unReadLength--
        })
      }
    },
    markAllRead () {
      if (this.unReadLength) {
        msgApi.markAllRead((msg) => {
          this.datas.forEach((item) => {
            item.messageState = 1
          })
          this.unReadLength = 0
          Vue.$koallTipBox({icon: 'success', message: this.$t(`error_code.${msg}`)})
        }, (msg) => {
          Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
        })
      }
    }
  }
}
</script>

<style scoped>
.message{background-color: #181b2a;}
.message-title{display: flex;justify-content: space-between;align-items: center;height: 24px;padding-left: 8px;padding-right: 8px;background-color: #1e2233;}
.message-title span{font-weight: bold;font-size: 14px;color: #becbe8;}
.message-title select{height: 18px;padding-left: 12px;padding-right: 20px;margin-left: 20px;margin-right: auto;font: 12px/normal "Microsoft YaHei";color: #8b94a9;background-position: right 4px center;border: 1px solid #8b94a9;cursor: pointer;}
.message-title a{font-weight: normal;font-size: 12px;color: #11a8fe;}
.message-title a:hover{color: #15c9ff;}
.message-title a.disabled{color: #999;cursor: not-allowed;}
.message-title a.disabled:hover{color: #999;}
.message-list{padding-left: 8px;padding-right: 8px;}
.message-item{padding-top: 20px;}
.message-item-title{display: flex;justify-content: space-between;align-items: center;height: 28px;border-bottom: 1px solid #404b69;cursor: pointer;}
.message-item-title .main{max-width: 800px;height: 28px;line-height: 28px;font-weight: bold;color: #becbe8;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
.message-item-title .main::before{content: "";float: left;width: 8px;height: 8px;margin: 10px 12px 10px 2px;background-color: #becbe8;border-radius: 50%;}
.message-item.markread .message-item-title .main{font-weight: normal;color: #8b94a9;}
.message-item.markread .message-item-title .main::before{background-color: #8b94a9;}
.message-item-title .main em{padding-left: 4px; padding-right: 4px;}
.message-item-title .time{font-size: 12px;color: #8b94a9;}
.message-item-cont{padding: 8px 6px 0 6px;}
.message-item-cont .inner{padding: 12px 16px;line-height: 20px;font-size: 12px;color: #becbe8;word-wrap: break-word;background-color: #404b69;}
.message-nodata{text-align: center;}
.message-nodata-icon{height: 80px;line-height: 80px;font-size: 40px;color: #8b94a9;}
.message-nodata-text{height: 40px;line-height: 20px;color: #8b94a9;}
</style>
