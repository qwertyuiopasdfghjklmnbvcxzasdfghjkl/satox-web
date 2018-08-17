<template>
    <div class="application">
        <em class="icon-close" @click="iconclose"></em>
        <h3>{{$t('otc_exchange.otc_exchange_delay')}}<!--申请延时--></h3>
        <ul>
            <li v-for="item in datas" :key="item" @click="minute=item">
                <em :class="[minute === item?'icon-radio-checked':'icon-radio-unchecked']" ></em>
                <span>{{item}} {{$t('exchange.exchange_min')}}<!--分钟--></span>
            </li>
        </ul>
        <input type="button" :value="$t('otc_exchange.otc_exchange_determine')" @click="delay"/> <!-- 确定 -->
    </div>
</template>
<script>
import otcApi from '@/api/otc'
import Vue from 'vue'
export default {
  props: ['id'],
  data () {
    return {
      minute: 20,
      datas: [20, 30, 40]
    }
  },
  methods: {
    iconclose () {
      this.$emit('removeDialog')
    },
    delay () {
      otcApi.applydelay(this.id, {
        delay_time: this.minute
      }, (msg) => {
        Vue.$koallTipBox({icon: 'success', message: this.$t(`error_code.${msg}`)})
        this.$emit('okCallback')
        this.$emit('removeDialog')
      }, (msg) => {
        Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
        this.$emit('removeDialog')
      })
    },
    switch_tabs (tab) {
      this.active = tab
    }
  }
}
</script>
<style scoped>
.application{width: 290px;height: 200px;background-color: #404b69;text-align:center;position: relative;}
.application > em{position: absolute;color: #becbe8;right: 10px;top: 7px;cursor: pointer;}
.application h3{font-size: 14px;color: #becbe8;height: 30px;line-height: 30px;background-color: #283149;}
.application ul{display: flex;margin:0 auto;justify-content: space-around;margin-top:40px;}
.application ul li em{color: #11a8fe;}
.application ul li span{color: #becbe8;}
.application input{width: 124px;height: 30px;background-color: #11a8fe;border-radius: 4px; color: #fff;text-align: center;margin-top: 25px;cursor: pointer;}
</style>


