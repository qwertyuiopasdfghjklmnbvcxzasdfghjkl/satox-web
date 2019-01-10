<template>
    <div class="dialog">
        <div class="dialog-title">{{$t('vote_mining.mine_pool')}}<!--我的矿池--></div>
        <a class="icon-close" href="javascript:;" @click="closeDialog"></a>
        <div class="dialog-form">
              <p class="fs24">{{$t('vote_mining.pool_numbers')}}： {{record.userCount}}</p>
              <div class="records">
                <div class="item header">
                  <span>{{$t('vote_mining.nick_name')}}<!-- 昵称 --></span>
                  <span>{{$t('otc_exchange.otc_exchange_phone')}}<!-- 手机号 --></span>
                  <span>{{$t('vote_mining.vote_time')}}<!-- 投票时间 --></span>
                </div>
                <div class="item" v-for="(item,index) in record.list" :key="index">
                  <span>{{item.nickname}}</span>
                  <span>{{item.mobile}}</span>
                  <span>{{item.createdAt}}</span>
                </div>
              </div>
              <page v-if="!record.loading && record.list.length > 0" :pageIndex="record.page" :pageSize="record.size" :total="record.total" @changePageIndex="pageChange"/>
              <div v-if="!record.loading && record.list.length === 0" class="nodata">
                <div class="nodata-icon icon-no-order"></div>
                <div class="nodata-text">{{$t('public0.public50')}}<!--暂无相关数据--></div>
              </div>
              <loading v-if="record.loading"/>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import voteMiningApi from '@/api/voteMining'
import page from '@/components/page'
import loading from '@/components/loading'

export default {
  components: {
    page,
    loading
  },
  data () {
    return {
      record:{
        loading:false,
        userCount:0,
        total:0,
        page:1,
        size:10,
        list:[]
      }
    }
  },
  computed:{
    
  },
  created(){
    this.getMiningPool()
  },
  methods: {
    pageChange(page){
      this.record.page = page
      this.getMiningPool()
    },
    closeDialog () {
      this.$emit('removeDialog')
    },
    getMiningPool () {
      this.record.loading = true
      voteMiningApi.getMiningPool({page:this.record.page, size:this.record.size}, data=>{
        this.record.loading = false
        this.record.userCount = data.userCount
        this.record.total = data.total
        this.record.list = data.list
      })
    },
  }
}
</script>

<style scoped>
.c-blue {color: #2c78ec;}
.pointer {cursor: pointer;}
.ml20 {margin-left: 20px;}
.fs24 {font-size: 24px;}
.dialog{width: 890px;background-color: #fff; border-top-left-radius: 10px; border-top-right-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px #5d5d5d; position: relative;}
.dialog-title{height: 50px;line-height: 50px;color: #fff;font-size: 22px;  text-align: center;background-color: #0D66EF;}
.icon-close{position:absolute;text-decoration:none;font-size:16px;color:#fff;top:17px;right:15px; opacity: 0.8;}
.icon-close:hover{opacity: 1;}
.dialog-form{padding: 30px 30px 60px; position: relative; font-size: 16px;}

.records {padding-bottom: 50px; margin-top: 30px;}
.records .item{display: flex; justify-content: space-between; line-height: 55px; border-bottom: 1px solid #ccc; font-size: 16px; color: #666; line-height: 55px; margin-left: 55px; margin-right: 55px;}
.records .item.header {margin-left: 0; margin-right: 0; box-shadow: 0 0 5px rgba(0,0,0,.2); padding: 0 55px; border-bottom: none; color: #333; font-size: 18px;}
.records .item span {width: 300px;}
.records .item span:last-of-type {width: 200px;}

.nodata{text-align: center;}
.nodata .nodata-icon{height: 80px;line-height: 80px;font-size: 40px;color: #A1A1A1;}
.nodata .nodata-text{height: 40px;line-height: 20px;color: #A1A1A1;}
</style>
