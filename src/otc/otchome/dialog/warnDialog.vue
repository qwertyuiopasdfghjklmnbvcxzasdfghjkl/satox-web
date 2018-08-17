<template>
  <div class="warn-dialog">
      <img src="@/assets/images/jinggao.png"/>
      <div class="content">{{$t('error_code.SUSPEND_TRADES_24H')}}</div>
  </div>
</template>

<script>
export default {
  created () {
    this.$nextTick(() => {
      setTimeout(() => {
        this.$emit('removeDialog')
      }, 3000)
    })
  }
}
</script>

<style scoped>
.warn-dialog{width:240px;min-height:120px;background-color:#e65353;border-radius:4px;display:flex;flex-flow:column;align-items:center;}
.warn-dialog /deep/ img{width:55px;height:55px;margin-top:14px;}
.warn-dialog /deep/ .content{margin:18px 36px;font-size:14px;color:#fff;}
</style>
