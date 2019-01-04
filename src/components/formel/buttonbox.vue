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
.button{display:flex;justify-content:center;align-items:center;font-size: 14px; color: #fff;background-color: #0D66EF;cursor:pointer;}
.button:hover{background-color:#0b4cb1;}
.button.disabled{background-color:#999;}
</style>

