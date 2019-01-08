<template>
  <div v-show="show" class="message-tip-box">
    <div class="message-tip-icon" :class="['icon-'+icon]"></div>
    <div class="message-tip-content" :class="[icon]">
      <p>{{message}}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: 'success'
    },
    message: {
      type: String
    },
    delay: {
      type: Number,
      default: 1500
    }
  },
  data () {
    return {
      show: false
    }
  },
  watch: {
    show (bool) {
      if (bool === false) {
        this.$emit('removeDialog')
      }
    }
  },
  created () {
    this.show = true
    setTimeout(() => {
      if (window.$autoCloseTip !== false) {
        this.show = false
      }
    }, this.delay)
  },
  methods: {
    closeDialog (e) {
      if (e.target.className === this.$refs.tipBox.className) {
        this.show = false
      }
    }
  }
}
</script>

<style scoped>
.message-tip-box{display:flex;min-width:300px;max-width:400px;min-height:16px;background-color:#fff;border-radius:4px;overflow:hidden;}
.message-tip-icon{width:54px;font-size:32px;display:flex;justify-content:center;align-items:center;color:#fff;}
.message-tip-content{flex:1;font-size:16px;line-height:22px;display:flex;align-items:center;padding:20px;}
.icon-success{background-color:rgb(25, 190, 107);}
.success{color:rgb(25, 190, 107);}
.icon-notification{background-color:#e65353;}
.notification{color:#e65353;}
</style>

