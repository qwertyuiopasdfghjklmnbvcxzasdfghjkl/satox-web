<template>
  <div class="transfer">
    <div class="record">
      <ul class="otc header" v-if="shallShowContent()">
        <li class="flex-box">
          <span class="flex">{{$t('exchange.exchange_direction')}}<!--划转方向--></span>
          <span class="flex">{{$t('exchange.exchange_amount')}}<!--数量--></span>
          <span class="flex">{{$t('exchange.exchange_date')}}<!--时间--></span>
        </li>
      </ul>
      <ul class="otc" v-if="shallShowContent()">
        <li class="list flex-box" v-for="item in res.data.list">
          <span class="flex" v-if="item.transferType===0">{{$t('public.main_account')}}<span class="icon-transfer-out"></span>{{$t('public.vote_miner_account')}}<!--划转方向--></span>
          <span class="flex" v-if="item.transferType===1">{{$t('public.vote_miner_account')}}<span class="icon-transfer-out"></span>{{$t('public.main_account')}}<!--划转方向--></span>
          <span class="flex">{{toFixed(item.quantity)}} {{item.symbol}}<!--数量--></span>
          <span class="flex">{{new Date(Number(item.createdAt)).format()}}<!--时间--></span>
        </li>
      </ul>
      <page v-if="shallShowContent()" :pageIndex="params.page" :pageSize="params.show" :total="res.data.total"
            @changePageIndex="pageChange"/>
      <div class="nodata" v-if="!loading && res.rst ===1 && res.data.list.length === 0">
        <div class="nodata-icon icon-no-order"></div>
        <div class="nodata-text">{{$t('trade_record.not_transfer_record')}}<!--暂无资金划转记录--></div>
      </div>
      <loading v-if="loading"/>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import Datepicker from 'vuejs-datepicker'
  import {en, zh} from 'vuejs-datepicker/dist/locale'
  import page from '@/components/page'
  import loading from '@/components/loading'
  import api from '@/api'
  import numUtils from '@/assets/js/numberUtils'

  let domain = ''
  export default {
    components: {
      Datepicker,
      page,
      loading
    },
    data() {
      return {
        loading: true,
        params: {
          page: 1,
          show: 6
        },
        res: {
          rst: 0,
          data: {
            total: 0,
            list: []
          },
          message: ""
        }
      }
    },
    computed: {
      ...mapGetters(['getLang', 'getApiToken', 'getUserInfo']),
      curLang() {
        return this.getLang === 'en' ? en : zh
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      toFixed(value, fixed) {
        return numUtils.BN(value || 0).toFixed(fixed === undefined ? this.fixedNumber : fixed, 1)
      },
      shallShowContent() {
        return !this.loading && this.res.rst === 1 && this.res.data.list.length > 0;
      },
      fetchData() {
        this.loading = true;
        api.get(`${domain}/api/v2/account2/transfer/record`, {page: this.params.page, size: this.params.show}, res => {
          this.loading = false;
          this.res = res
        })
      },
      pageChange(currentIndex) {
        this.params.page = currentIndex;
        this.fetchData()
      },
    }
  }
</script>

<style scoped>

  .icon-transfer-out{
    background: url("../../../assets/images/transfer-out.png") center no-repeat;
    vertical-align: middle;
    width: 3em;
    height: 1em;
  }
  .transfer /deep/ h3 {
    height: 35px;
    font-weight: normal;
    font-size: 14px;
    line-height: 35px;
    color: #333;
    padding: 0 20px;
    border-top: 1px solid #e7e7e7;
    border-bottom: 1px solid #e7e7e7;
  }

  .transfer /deep/ .record {
    background-color: #fff;
  }

  .transfer /deep/ .record ul {
    padding-left: 20px;
    padding-right: 20px;
  }

  .transfer /deep/ .record ul.header {
    background: #F5F5F5;
  }

  .transfer /deep/ .record ul li {
    border-bottom: 1px solid #eee;
  }

  .transfer /deep/ .record ul.header li {
    border-bottom: none;
  }

  .transfer /deep/ .record ul li span {
    display: inline-block;
    height: 40px;
    line-height: 40px;
    font-size: 12px;
    color: #555;
    white-space: nowrap;
    text-overflow: ellipsis;
    vertical-align: top;
    overflow: hidden;
  }

  .flex-box {
    display: flex;
  }


  .flex {
    flex: 1;
  }


  .transfer {
    text-align: center;
  }

  .transfer /deep/ .record .nodata .nodata-icon {
    height: 80px;
    line-height: 80px;
    font-size: 40px;
    color: #A1A1A1;
  }

  .transfer /deep/ .record .nodata .nodata-text {
    height: 40px;
    line-height: 20px;
    color: #A1A1A1;
  }
</style>

