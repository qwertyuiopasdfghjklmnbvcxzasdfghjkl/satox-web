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
      // data.verifyState === 0 ? void 0 : this.$emit('switchTab', 'mycenter')
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
.authentication{background-color: #FFF; border-radius: 4px; box-shadow: 0 1px 3px #e2e2e2;}
.authentication h3{height: 55px; padding-left: 20px; font-weight: normal;font-size: 18px;line-height: 55px;color: #333;text-indent: 8px;border-bottom: 1px solid #e7e7e7;}
.authentication .tab{border-bottom: 1px solid #e7e7e7; padding-left: 30px; height: 60px; line-height: 60px;}
.authentication .tab-item{display: inline-block;margin-right: 20px; height: 61px; line-height: 62px; box-sizing: border-box; border-bottom: -1px; font-size: 16px;color: #666;border-bottom: 2px solid transparent;cursor: pointer;}
.authentication .tab-item.active{color: #3283FF;border-bottom-color: #3283FF;}
.authentication .tab-item:hover {color: #3283FF;}

</style>

