<template>
    <div class="arrows" :class="{'disabled':disabled}">
        <i class="up icon-arrow-up2" @click="up"></i>
        <i class="down icon-arrow-down3" @click="down"></i>
    </div>
</template>

<script>
import numUtils from '@/assets/js/numberUtils'
export default {
  props: ['value', 'fixedNumber', 'disabled'],
  data () {
    return {
      fixed: this.fixedNumber
    }
  },
  created () {
    this.updateFixed()
  },
  watch: {
    value () {
      this.updateFixed()
    }
  },
  methods: {
    updateFixed () {
      let arr = (this.value || '').split('.')
      this.fixed = arr[1] ? arr[1].length : 0
    },
    up () {
      if (this.disabled) {
        return
      }
      let val = this.toFixed(numUtils.max([numUtils.add(this.value, 1 / Math.pow(10, this.fixed)), 0]))
      this.$emit('input', val)
    },
    down () {
      if (this.disabled) {
        return
      }
      let val = this.toFixed(numUtils.max([numUtils.minus(this.value, 1 / Math.pow(10, this.fixed)), 0]))
      this.$emit('input', val)
    },
    toFixed (value, fixed) {
      return numUtils.BN(value || 0).toFixed(fixed === undefined ? this.fixed : fixed, 1)
    }
  }
}
</script>

<style scoped>
.arrows{width:35px;height:34px;display:flex;flex-flow:column;position:absolute;top:1px;right:1px;}
.up,.down{flex:1;height:17px;cursor:pointer;display:flex;justify-content:center;align-items:center;color:#3A76E7;}
.up:hover,.down:hover{color:#5f8de4;}
.disabled .up,.disabled .down{color:#a1a8bb;cursor:not-allowed;}
.disabled .up:hover,.disabled .down:hover{background:#2d344e;color:#a1a8bb;}
@media screen and (max-width: 1600px) and (max-height: 900px) {
  .arrows{width:28px;height:28px;}
}
</style>
