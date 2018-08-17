<template>
  <input type="button" class="button" :class="{disabled:disabled}" :style="inputStyle" :value="text" @click="submit"/>
</template>

<script>
export default {
  props: {
    text: {
      type: String
    },
    width: {
      type: Number,
      default: 272
    },
    height: {
      type: Number,
      default: 30
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    inputStyle () {
      return {
        width: `${this.width}px`,
        height: `${this.height}px`
      }
    }
  },
  methods: {
    submit () {
      if (this.disabled) {
        return
      }
      this.$emit('click')
    }
  }
}
</script>

<style scoped>
.button{display:flex;justify-content:center;align-items:center;color:#fff;background-color:#11a8fe;border:none;border-radius:4px;cursor:pointer;}
.button:hover{background-color:#15c9ff;}
.button.disabled{background-color:#999;}
</style>

