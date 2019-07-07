<template>
  <div class="myassets-left">
    <ul>
      <li :class="{'active': active === 'mycenter' || active === 'authentication'}" @click="switch_tab('mycenter')">
        <i class="icon-people"></i>
        <span>{{$t('account.userPersonalCenter')}}</span>
        <!--我的个人中心-->
      </li>
      <li :class="{'active': active === 'safety'}" @click="switch_tab('safety')">
        <i class="icon-suo"></i>
        <span>{{$t('public0.public189')}}</span>
        <!--我的安全中心-->
      </li>
      <li :class="{'active': active === 'digassets' || active === 'historyrecord'}" @click="switch_tab('digassets')">
        <i class="icon-wallet"></i>
        <span>{{$t('account.userDigitalAssets')}}</span>
        <!--我的数字资产-->
      </li>
      <!--收款方式设置-->
      <!-- <li :class="{'active': active === 'settings'}" @click="switch_tab('settings')">
          <i class="icon-curry"></i>
          <span>{{$t('otc_legal.otc_legal_currency')}}</span>
      </li> -->
      <li :class="{'active': active === 'ieorecords'}" @click="switch_tab('ieorecords')" v-if="false">
          <i class="icon-pie-chart"></i>
          <span>我的IEO</span>
          <!--我的IEO-->
      </li>
      <li :class="{'active': active === 'transaction'}" @click="switch_tab('transaction')">
        <i class="icon-reports"></i>
        <span>{{$t('trade_record.my_trade_record')}}</span>
        <!--我的交易记录-->
      </li>
      <li :class="{'active': active === 'hardware'}" @click="switch_tab('hardware')" v-if="false">
        <i class=""><img :src="active === 'hardware' ? zbh : zb"/></i>
        <span>{{$t('shop.hardware')}}</span>
        <!--中本硬件-->
      </li>
      <li :class="{'active': active === 'SATODebitCard'}" @click="switch_tab('SATODebitCard')" v-if="false">
        <i class=""><img :src="active === 'SATODebitCard' ? sah : sa"/></i>
        <span>{{$t('shop.sato_card')}}</span>
        <!--SATO 借記卡-->
      </li>
      <li :class="{'active': active === 'message'}" @click="switch_tab('message')">
        <i class="icon-message"></i>
        <span>{{$t('message.my_message')}}</span>
        <!--我的站内消息-->
      </li>
      <!--我的推荐中心-->
      <!-- <li @click="switch_like">
          <i class="icon-like"></i>
          <span>{{$t('message.my_referral_center')}}</span>
      </li> -->
    </ul>
  </div>
</template>

<script>
  import shopsApi from '@/api/shops'
  import sa from '@/assets/images/sa.png'
  import sah from '@/assets/images/sah.png'
  import zb from '@/assets/images/zb.png'
  import zbh from '@/assets/images/zbh.png'

  export default {
    props: {
      active: {
        type: String
      }
    },
    data() {
      return {
        showShops: false,
        sa: sa,
        sah: sah,
        zb: zb,
        zbh: zbh
      }
    },
    created() {

    },
    methods: {
      switch_like() {
        this.$router.push({name: 'invite'})
      },
      switch_tab(tab) {
        this.$emit('switchTab', tab)
      },

    }
  }
</script>

<style scoped>
  .myassets-left {
    float: left;
    width: 192px;
  }

  .myassets-left ul {
    background-color: #fff;
    box-shadow: 0 1px 3px #e2e2e2;
    border-radius: 4px;
    overflow: hidden;
  }

  .myassets-left ul li {
    padding-left: 20px;
    padding-right: 20px;
    margin-top: 1px;
    font-size: 0;
    line-height: 0;
    color: #666;
    text-align: left;
    cursor: pointer;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .myassets-left ul li:first-of-type {
    margin-top: 0;
  }

  .myassets-left ul li:hover,
  .myassets-left ul li.active {
    color: #fff;
    background-color: #BA8D35;
  }

  .myassets-left ul li i,
  .myassets-left ul li span {
    display: inline-block;
    vertical-align: middle;
  }

  .myassets-left ul li i {
    font-size: 20px;
  }

  .myassets-left ul li span {
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    text-indent: 10px;
  }

  .myassets-left ul li i.icon-like:before {
    color: #666
  }
</style>
