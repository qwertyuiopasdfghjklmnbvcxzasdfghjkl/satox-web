<template>
  <div class="transaction">
    <ul class="tabcontrol">
      <li :class="{'active': active === 'delegate'}" @click="switch_tab('delegate')">{{$t('trade_record.entrust_record')}}<!--委讬纪录 --></li>
      <li :class="{'active': active === 'curreny'}" @click="switch_tab('curreny')">{{$t('trade_record.exchange_record')}}<!--币币成交记录--></li>
      <li :class="{'active': active === 'otccurreny'}" @click="switch_tab('otccurreny')">{{$t('trade_record.otc_record')}}<!--OTC交易记录--></li>
    </ul>
    <delegate v-show="active==='delegate'"/>
    <curreny v-show="active==='curreny'"/>
    <otccurreny v-show="active==='otccurreny'"/>
  </div>
</template>
<script>
import delegate from '@/public/mycenter/records/delegate'
import curreny from '@/public/mycenter/records/curreny'
import otccurreny from '@/public/mycenter/records/otccurreny'
export default {
  data () {
    return {
      active: 'delegate'
    }
  },
  components: {
    delegate,
    curreny,
    otccurreny
  },
  methods: {
    switch_tab (tab) {
      this.active = tab
    }
  }
}
</script>
<style>
.transaction .tabcontrol {font-size: 0;line-height: 0;border-bottom: 1px solid #b1bedb;}
.transaction .tabcontrol li{display: inline-block;height: 24px;margin-right: 40px;margin-bottom: -1px;line-height: 24px;font-size: 16px;color: #becbe8;border-bottom: 1px solid #b1bedb;cursor: pointer;}
.transaction .tabcontrol li:hover,
.transaction .tabcontrol li.active{color: #E3CB2B;border-bottom-color: #E3CB2B;}
</style>

