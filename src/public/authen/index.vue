<template>
  <div class="authentication">
      <h3>{{$t('account.user_Real_name_verification')}}<!--实名认证--></h3>
      <div class="tab">
          <ul class="tab-list">
              <li class="tab-item" :class="[active==='china'?'active':'']" @click="switch_tabs('china')">
                  {{$t('public0.public75')}}<!--中国大陆-->
              </li>
              <li class="tab-item" :class="[active==='other'?'active':'']" @click="switch_tabs('other')">
                  {{$t('public0.public76')}}<!--其他国家-->
              </li>
          </ul>
      </div>
      <anthentication1 v-if="active==='china'" @switchTab="switchTab"/>
      <anthentication2 v-if="active==='other'" @switchTab="switchTab"/>
  </div>
</template>

<script>
import userUtils from '@/api/individual'
import anthentication1 from '@/public/authen/anthentication1'
import anthentication2 from '@/public/authen/anthentication2'
export default {
  components: {
    anthentication1,
    anthentication2
  },
  data () {
    return {
      active: 'china'
    }
  },
  created () {
    userUtils.getUserState((data) => {
      data.verifyState === 0 ? void 0 : this.$emit('switchTab', 'mycenter')
    }, (msg) => {
      console.error(msg)
    })
  },
  methods: {
    switch_tabs (tab) {
      this.active = tab
    },
    switchTab (tab) {
      this.$emit('switchTab', tab)
    }
  }
}
</script>

<style scoped>
.authentication{background-color: #222121;}
.authentication h3{height: 24px;font-weight: normal;font-size: 14px;line-height: 24px;color: #cbd4ec;text-indent: 8px;background-color: #333232;}
.authentication .tab{padding: 16px 8px 0 8px;}
.authentication .tab-list{font-size: 0;line-height: 0;border-bottom: 1px solid #404b69;}
.authentication .tab-item{display: inline-block;height: 24px;margin-right: 20px;margin-bottom: -1px;font-size: 16px;line-height: 24px;color: #becbe8;border-bottom: 1px solid #404b69;cursor: pointer;}
.authentication .tab-item:hover,
.authentication .tab-item.active{color: #fdb902;border-bottom-color: #fdb902;}
</style>

