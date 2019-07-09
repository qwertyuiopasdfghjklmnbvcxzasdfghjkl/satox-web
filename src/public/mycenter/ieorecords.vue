<template>
  <div class="safety">
    <h3>我的IEO<!--我的IEO--></h3>
    <ul class="join-list">
      <li class="header">
        <span>{{$t('ieo.subscribed_time')}}<!-- 认购时间 --></span>
        <span>{{$t('ieo.project_name')}}<!-- 项目名称 --></span>
        <span>{{$t('ieo.number_of_copies')}}<!-- 获得份数 --></span>
        <span>{{$t('ieo.gain_quantity')}}<!-- 获得数量 --></span>
        <span>{{$t('ieo.payment_symbol')}}<!-- 付款币种 --></span>
        <span>{{$t('ieo.payment_amount')}}<!-- 付款金额 --></span>
        <span>{{$t('ieo.status')}}<!-- 状态 --></span>
      </li>
      <li v-for="item in list">
        <span>{{new Date(item.createdAt).format('yyyy-MM-dd')}}</span>
        <span>{{item[`projectName${lang}`]}}</span>
        <span>{{item.gainQuantity}}</span>
        <span>{{item.gainAmount}}</span>
        <span>{{item.subscriptionSymbol}}</span>
        <span>{{item.subscriptionAmount}} {{item.subscriptionSymbol}}</span>
        <span>{{getStatus(item.state).text}}</span>
      </li>
    </ul>
    <page v-if="!listLoading && list.length > 0" :pageIndex="page" :pageSize="size" :total="total" @changePageIndex="pageChange"/>
    <div class="nodata" v-if="!listLoading && list.length === 0">
      <div class="nodata-icon icon-no-order"></div>
      <div class="nodata-text">{{$t('public0.public50')}}<!--暂无数据--></div>
    </div>
    <loading v-if="listLoading"/>
  </div>
</template>
<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import ieoApi from '@/api/ieo'
import page from '@/components/page'
import loading from '@/components/loading'
export default {
  components: {
    page,
    loading
  },
  name:'ieorecords',
  data () {
    return {
      list:[],
      page:1,
      size:20,
      listLoading: true,
      total:0
    }
  },
  computed:{
    ...mapGetters(['getLang']),
    lang(){
      if(this.getLang==='zh-CN' || this.getLang==='cht'){
        return ''
      } else {
        return 'En'
      }
    },
  },
  created(){
    this.getUserIEOProjectsList()
  },
  methods: {
    pageChange (currentIndex) {
      this.page = currentIndex
      this.getUserIEOProjectsList()
    },
    getStatus(status){
      let rst = {type:'danger', text:''}
      switch(status){
        case 1: rst.type = 'warning';  rst.text = this.$t('ieo.confirmed'); break; //已确认
        case 2: rst.type = 'danger';  rst.text = this.$t('ieo.debit_unsuccessful'); break; //扣款不成功
        case 3: rst.type = 'success';  rst.text = this.$t('ieo.debit_success'); break; //扣款成功
        case 4: rst.type = 'danger';  rst.text = this.$t('ieo.unsuccessfully_distribution'); break; //发放不成功
        case 5: rst.type = 'success';  rst.text = this.$t('ieo.successfully_distribution'); break; //发放成功
        case 6: rst.type = 'danger';  rst.text = this.$t('ieo.subscription_failed'); break; //认购失败
        case 7: rst.type = 'success';  rst.text = this.$t('ieo.successful_subscription'); break; //认购成功
      }
      return rst
    },
    getUserIEOProjectsList(){
      this.listLoading = true
      ieoApi.getUserIEOProjectsList({page:this.page, size:this.size}, (res,total)=>{
        this.listLoading = false
        this.list = res
        this.total = total
      }, msg=>{
        this.listLoading = false
        Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${typeof msg === 'string' ? msg : msg[0]}`)})
      })
    },
  }
}
</script>
<style lang="less" scoped>
.safety h3{height: 55px; padding-left: 28px; font-weight: normal;font-size: 18px;line-height: 55px;color: #333; border-bottom: 1px solid #e7e7e7;}
.join-list {background-color: #212020;}
.join-list li {
  display: flex;
  line-height: 50px;
  border-bottom: 1px solid #37342F;
  text-align: center;
  &:last-of-type {border-bottom: none;}
  span {
    flex: 1;
    color: #fff;
  }
  &.header span {color: #BA8D35;}
}

.nodata{text-align: center;}
.nodata .nodata-icon{height: 80px;line-height: 80px;font-size: 40px;color: #A1A1A1;}
.nodata .nodata-text{height: 40px;line-height: 20px;color: #A1A1A1;}
</style>

