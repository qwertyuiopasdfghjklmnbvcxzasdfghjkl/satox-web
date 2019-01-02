<template>
  <div class="inputbox" :style="boxStyle">
      <div class="title" v-if="title">
          {{title}}
      </div>
      <div class="inputdiv">
          <input ref="input" :uid="id" :readonly="readonly" :maxlength="maxLength" v-model="inputValue" :type="type" class="input" :class="{error:showOrHide}" :style="inputStyle" @keyup.enter="keyupEnter" :placeholder="placeholder" :autocomplete="autocomplete"/>
          <em class="errorinfo" :style="errorCss" v-if="showOrHide">{{errorInfo}}</em>
      </div>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String
    },
    name: {
      type: String
    },
    maxLength: {
      type: Number
    },
    value: {
      type: String
    },
    placeholder: {
      type: String
    },
    autocomplete: {
      type: String,
      default: 'off'
    },
    width: {
      type: Number,
      default: 272
    },
    height: {
      type: Number,
      default: 24
    },
    title: {
      type: String
    },
    type: {
      type: String,
      default: 'text'
    },
    errs: {
      type: Object,
      default: () => {
        return {}
      }
    },
    msgs: {
      type: Object,
      default: () => {
        return {}
      }
    },
    errorCss: {
      type: Object,
      default: () => {
        return {}
      }
    },
    readonly: null
  },
  data () {
    return {
      inputValue: this.value
    }
  },
  watch: {
    value () {
      this.inputValue = this.value
    },
    inputValue () {
      this.$emit('input', this.inputValue)
    }
  },
  computed: {
    showOrHide () {
      return this.name && this.errs && this.errs.has && this.errs.has(this.name)
    },
    errorInfo () {
      if (this.showOrHide) {
        return this.msgs[this.errs.firstRule(this.name)] || this.$t(this.errs.first(this.name)) || null
      } else {
        return null
      }
    },
    boxStyle () {
      return {
        width: `${this.width}px`,
        'min-height': '76px'
      }
    },
    inputStyle () {
      return {
        width: `${this.width - 10}px`
      }
    }
  },
  methods: {
    keyupEnter () {
      this.$emit('keyupEnter')
    }
  }
}
</script>

<style scoped>
.inputbox{display:flex;font-size:14px;}
.title{color:#261003;text-align:left;height:20px;line-height:20px; flex: 2; min-width: 0; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;}
.title em{font-size: 18px;color: #e53f3f;vertical-align:middle;margin-right: 5px;}
.inputdiv{position:relative;display:flex;flex: 3}
.input{height:30px;line-height:30px;margin:0;padding:0 4px;border:1px solid #283149;outline:none;color:#becbe8;background-color:#261003;}
.input:focus{background-color:#261003;}
.input.error{border-color: #e53f3f;background-color:#261003;}
.errorinfo{color: #e53f3f;font-style:normal;line-height:18px;white-space:normal;width:100%;padding-top:4px;}
</style>

