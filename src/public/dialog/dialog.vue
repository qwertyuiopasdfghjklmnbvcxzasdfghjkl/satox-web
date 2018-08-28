<template>
  <div class="dialog" :style="dialogStyle">
      <div class="top">
        <div class="title">{{title}}</div>
        <a class="icon-close" href="javascript:;" @click="closeDialog"></a>
      </div>
      <div class="form">
        <slot></slot>
      </div>
  </div>
</template>

<script>
export default {
  props: {
    width: {
      type: Number,
      default: 370
    },
    height: {
      type: Number
    },
    minHeight: {
      type: Number,
      default: 200
    },
    title: {
      type: String,
      default: ''
    }
  },
  computed: {
    dialogStyle () {
      return {
        width: `${this.width}px`,
        height: this.height ? `${this.height}px` : `auto`,
        'min-height': `${this.minHeight}px`
      }
    }
  },
  methods: {
    closeDialog () {
      if (this.$parent) {
        this.$parent.$emit('removeDialog')
      } else {
        this.$emit('removeDialog')
      }
    }
  }
}
</script>

<style scoped>
.dialog{display:flex;justify-content:center;flex-flow:column;background-color:#404b69;}
.top{width:100%;height:30px;position:relative;background-color:#283149;}
.icon-close{position:absolute;text-decoration:none;font-size:14px;color:#becbe8;top:calc(50% - 7px);right:10px;}
.icon-close:hover{color: #11a8fe;}
.title{width:100%;height:30px;line-height:30px;text-align:center;font-size:14px;color:#becbe8;}
.form{display:flex;justify-content:center;align-items:center;flex-flow:column;width:100%;margin:30px 0;}
</style>
