<template>
        <div ref="adressCava" class="adressCava" style="width:328px;height:392px;background-color:#fff;">
            <div class="title-div">
                <span @click="closeEWM" class="icon-close"></span>
                <p>{{symbol}} {{$t('account.recharge_memo')}}<!--充值备注--></p>
            </div>
            <div ref="qrcode" class="qrcode"></div>
            <div ref="qraddr" class="qraddess">{{addr}}</div>
        </div>
</template>
<script>
import utils from '@/assets/js/utils'
export default {
  props: {
    addr: {
      type: String,
      default: ''
    },
    symbol: {
      type: String
    }
  },
  methods: {
    closeEWM () {
      this.$emit('removeDialog')
    }
  },
  created () {
    this.$nextTick(() => {
      utils.qrcode(this.$refs.qrcode, {
        text: this.addr,
        width: 280,
        height: 280
      })
    })
  }
}
</script>
<style scoped>
div.adressCava{position: absolute;width: 100px;height: 100px;padding: 0px;}
div.adressCava>.qrcode{width: 280px!important;height: 280px!important;position: absolute;left: 50%;top: 50%;margin-left: -140px;margin-top: -140px;}
div.adressCava span{width: 20px;cursor: pointer; float:right;cursor: pointer; height: 20px;display: inline-block;background-size: 12px;margin-top: 19px;margin-right: 10px;}
div.adressCava p{font-size: 18px;font-weight: bold;color: #333;}
div.adressCava p:nth-child(2){position: relative;top: 15px;text-align: left; margin-left: 17px;display: inline-block;}
div.adressCava p:nth-child(2){position: relative;top: 15px;text-align: left; margin-left: 17px;display: inline-block;}
div.adressCava div.title-div{overflow: hidden;}
div.adressCava div.qraddess{margin-top: 310px;font-size: 12px;text-align: center; width: 100%;}
</style>
