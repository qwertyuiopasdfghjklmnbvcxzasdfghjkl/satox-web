<template>
  <div class="myassets clearfix">
      <left :active="active" @switchTab="switch_tab"></left>
      <div class="myassets-right">
        <component
          :is="active"
          :linkItem="linkItem"
          :adsSymbol="adsSymbol"
          :adsType="adsType"
          @switchTab="switch_tab"></component>
      </div>
  </div>
</template>

<script>
import digassets from '@/public/mycenter/digassets'
import mycenter from '@/public/mycenter/mycenter'
import authentication from '@/public/authen'
import historyrecord from '@/public/mycenter/historyrecord'
import left from '@/public/mycenter/left'
import settings from '@/public/mycenter/settings'
import safety from '@/public/mycenter/safety'
import transaction from '@/public/mycenter/transaction'
import message from '@/public/mycenter/message'
import hardware from '@/public/mycenter/hardware'
import SATODebitCard from '@/public/mycenter/SATODebitCard'
import ieorecords from '@/public/mycenter/ieorecords'
export default {
  props: ['adsSymbol', 'adsType', 'linkItem'],
  data () {
    return {
      active: this.$route.params.menu || 'digassets'
    }
  },
  components: {
    digassets,
    mycenter,
    authentication,
    left,
    settings,
    safety,
    transaction,
    historyrecord,
    message,
    hardware,
    SATODebitCard,
    ieorecords
  },
  watch: {
    '$route' (to, from) {
      this.active = this.$route.params.menu || 'digassets'
    }
  },
  methods: {
    switch_tab (tab) {
      if (tab === 'digassets') {
        this.$router.push({name: 'mycenter'})
        return
      }
      this.$router.push({
        name: 'mycenter_menu',
        params: {
          menu: tab
        }
      })
    }
  }
}
</script>

<style scoped>
.myassets{width: 1200px;margin-left: auto;margin-right: auto;padding-top: 8px;padding-bottom: 60px;}
.myassets::before {content: ''; position: fixed; left: 0; top: 0; right: 0; bottom: 0; background-color: #F2F3F8; z-index: -1;}
.myassets-right{float: right;width: 1000px;}
</style>

