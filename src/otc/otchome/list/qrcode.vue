<template>
  <div class="qrcode-dialog" style="width:500px;height:500px;">
    <a class="icon-close" @click="closeDialog"></a>
    <div ref="qrcode" class="qrcode-content"></div>
  </div>
</template>

<script>
import utils from '@/assets/js/utils'
export default {
  props: ['imageUrl'],
  created () {
    this.$nextTick(() => {
      utils.imgZoom(this.$refs.qrcode, this.imageUrl, 460, 460)
    })
  },
  methods: {
    closeDialog () {
      this.$emit('removeDialog')
    }
  }
}
</script>

<style scoped>
.qrcode-dialog{display:flex;justify-content:center;flex-flow:column;background:#fff;position:relative;}
.icon-close{display:flex;align-items:center;justify-content:center;width:20px;height:20px;position:absolute;top:4px;right:4px;cursor:pointer;color:#666;}
.qrcode-content{display:flex;align-items:center;justify-content:center;}
</style>