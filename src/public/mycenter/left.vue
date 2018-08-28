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
            <li :class="{'active': active === 'settings'}" @click="switch_tab('settings')">
                <i class="icon-curry"></i>
                <span>{{$t('otc_legal.otc_legal_currency')}}</span>
                <!--收款方式设置-->
            </li>
            <li :class="{'active': active === 'transaction'}" @click="switch_tab('transaction')">
                <i class="icon-reports"></i>
                <span>{{$t('trade_record.my_trade_record')}}</span>
                <!--我的交易记录-->
            </li>
            <li :class="{'active': active === 'message'}" @click="switch_tab('message')">
                <i class="icon-message"></i>
                <span>{{$t('message.my_message')}}</span>
                <!--我的站内消息-->
            </li>
        </ul>
    </div>
</template>

<script>
export default {
  props: {
    active: {
      type: String
    }
  },
  methods: {
    switch_tab (tab) {
      this.$emit('switchTab', tab)
    }
  }
}
</script>

<style scoped>
.myassets-left{float: left;width: 192px;}
.myassets-left ul{background-color: #333232;}
.myassets-left ul li{
    padding-left: 20px;margin-top: 1px;font-size: 0;line-height: 0;color: #cbd4ec;text-align: left;
    background-color: #222121;border-left: 5px solid #333232;cursor: pointer;
}
.myassets-left ul li:first-of-type{margin-top: 0;}
.myassets-left ul li:hover,
.myassets-left ul li.active{color: #FFDE00;border-left-color: #FFDE00;}
.myassets-left ul li i,
.myassets-left ul li span{display: inline-block;vertical-align: middle;}
.myassets-left ul li i{font-size: 16px;}
.myassets-left ul li span{height: 50px;line-height: 50px;font-size: 14px;text-indent: 10px;}
</style>
