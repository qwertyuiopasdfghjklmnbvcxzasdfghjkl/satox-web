<template>
  <div class="transaction">
    <ul class="tabcontrol">
      <li :class="{'active': active === 'delegate'}" @click="switch_tab('delegate')">{{$t('trade_record.entrust_record')}}<!--委讬纪录 --></li>
      <li :class="{'active': active === 'curreny'}" @click="switch_tab('curreny')">{{$t('trade_record.exchange_record')}}<!--币币成交记录--></li>
      <!-- <li :class="{'active': active === 'otccurreny'}" @click="switch_tab('otccurreny')">{{$t('trade_record.otc_record')}}</li> --><!--OTC交易记录-->
      <!-- <li :class="{'active': active === 'transfer'}" @click="switch_tab('transfer')">{{$t('trade_record.transfer_record')}}</li> --><!--资金划转记录-->
    </ul>
    <delegate v-show="active==='delegate'"/>
    <curreny v-show="active==='curreny'"/>
    <!-- <otccurreny v-show="active==='otccurreny'"/> -->
    <!-- <transfer v-show="active==='transfer'"/> -->
  </div>
</template>
<script>
import delegate from '@/public/mycenter/records/delegate'
import curreny from '@/public/mycenter/records/curreny'
// import otccurreny from '@/public/mycenter/records/otccurreny'
// import transfer from '@/public/mycenter/records/transfer'
export default {
  data () {
    return {
      active: 'delegate'
    }
  },
  components: {
    delegate,
    curreny,
    // otccurreny,
    // transfer
  },
  methods: {
    switch_tab (tab) {
      this.active = tab
    }
  }
}
</script>
<style scoped>
.transaction {background-color: #FFF; border-radius: 4px; box-shadow: 0 1px 3px #e2e2e2;}
.transaction .tabcontrol {border-bottom: 1px solid #e7e7e7; padding: 0 40px; height: 65px;}
.transaction .tabcontrol li{display: inline-block;height: 64px;  margin-right: 40px; line-height: 65px;font-size: 16px;color: #666;border-bottom: 2px solid transparent;cursor: pointer;}
.transaction .tabcontrol li.active{color: #BA8D35;border-bottom-color: #BA8D35;}
.transaction .tabcontrol li:hover {color: #BA8D35;}
</style>

