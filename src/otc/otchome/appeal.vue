<template>
  <div class="appeal">
    <h3>
      <span>{{$t('otc_exchange.otc_exchange_complaint')}}<!--发起申诉--></span>
      <a class="icon-close" href="javascript:;" @click="iconclose"></a>
    </h3>
    <div class="appeal-cont">
      <div class="explain">
        <p>{{$t('public0.public183')}}<!--（1）错误的申诉会导致发起人好评率下降。申诉在受理前，发起人可根据需要主动取消申诉。--></p>
        <p>{{$t('public0.public184')}}<!--（2）针对已经标记为已付款的订单，一方提交申诉后，交易双方可继续沟通释放数字币。--></p>
        <p>{{$t('public0.public185')}}<!--（3）申诉一定受理，系统将根据申诉内容，判断双方的欺诈行为，对欺诈方做出冻结、封禁等处理。--></p>
      </div>
      <form class="question" ref="appealform" onsubmit="return false" >
        <div class="question-row">
          <label>{{$t('public0.public1')}}<!--问题类型--><em class="asterisk">&nbsp;*</em></label>
          <select :class="{error: errors.has('type')}" name="type" v-model="formData.type" v-validate="'required'">
            <option v-for="(appeal) in appealTtpe" :key="appeal.appeal_type_id" :value="appeal.appeal_type_id">{{$t(`otc_exchange.otc_exchange_${appeal.type_key}`)}}</option>
          </select>
          <span>{{getError('type')}}</span>
        </div>
        <div class="question-row" v-if="currentTypeKey">
          <label>{{$t('public0.public4')}}<!--问题描述--><em class="asterisk" v-if="currentTypeKey === 'OTHER'">&nbsp;*</em></label>
          <textarea :class="{error: errors.has('description')}" name="description" v-model="formData.description" v-validate="currentTypeKey === 'OTHER' ? 'required' : null" :placeholder="currentTypeKey === 'OTHER' ? $t('public0.public236') : $t('public0.public237')" maxlength="255" autocomplete="off"></textarea>
          <span>{{getError('description')}}</span>
        </div>
        <div class="question-row question-button">
          <input class="cancel" type="button" :value="$t('otc_legal.otc_legal_cancel')" @click="iconclose"><!--取消-->
          <input class="confirm" type="button" :value="$t('otc_exchange.otc_exchange_determine')" @click="appealSubmit"><!--确定-->
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import otcApi from '@/api/otc'
export default {
  props: ['orderNumber'],
  data () {
    return {
      files: [],
      appealTtpe: [],
      formData: {
        description: '',
        type: '',
        order_number: ''
      }
    }
  },
  computed: {
    ...mapGetters(['getUserInfo']),
    msgs () {
      return {
        order_number: {required: this.$t('public0.public5')}, // 请输入订单编号
        name: {required: this.$t('otc_legal.otc_legal_WeChat_nam')}, // 请输入姓名
        mobile: {required: this.$t('public0.public6')}, // 请输入手机号
        mailbox: {required: this.$t('login_register.email'), email: this.$t('exchange.exchange_Email_format_error')}, // 请输入邮箱||邮箱格式错误
        pic: {required: this.$t('public0.public7')}, // 请上传图片
        type: {required: this.$t('public0.public8')}, // 请输入问题类型
        description: {required: this.$t('public0.public9')} // 请输入问题描述
      }
    },
    currentTypeKey () {
      let val = ''
      for (let i = 0; i < this.appealTtpe.length; i++) {
        let temp = this.appealTtpe[i]
        if (this.formData.type === temp.appeal_type_id) {
          val = temp.type_key
          break
        }
      }
      return val
    }
  },
  watch: {
    'formData.description' (newVal) {
      if (newVal.length > 255) {
        this.formData.description = newVal.substring(0, 255)
      }
    },
    'formData.name' (newVal) {
      if (newVal.length > 100) {
        this.formData.name = newVal.substring(0, 100)
      }
    },
    'formData.mobile' (newVal) {
      if (newVal.length > 100) {
        this.formData.mobile = newVal.substring(0, 100)
      }
    },
    'formData.mailbox' (newVal) {
      if (newVal.length > 100) {
        this.formData.mailbox = newVal.substring(0, 100)
      }
    }
  },
  methods: {
    iconclose () {
      this.$emit('removeDialog')
    },
    selFiles (e) {
      this.files = []
      let files = e.target.files
      for (let i = 0; i < files.length; i++) {
        let file = files[i]
        this.files.push(file)
      }
    },
    remove (index) {
      this.files.splice(index, 1)
    },
    appealSubmit () {
      this.$validator.validateAll().then((res) => {
        if (!res) {
          return
        }
        this.formData.order_number = this.orderNumber
        otcApi.createAppeal(this.formData, (msg) => {
          Vue.$koallTipBox({icon: 'success', message: this.$t(`error_code.${msg}`)})
          this.$emit('okCallback')
          this.$emit('removeDialog')
        }, (msg) => {
          Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
        })
      })
    },
    getError (name) {
      return this.errors.has(name) ? this.msgs[name][this.errors.firstRule(name)] || this.$t(this.errors.first(name)) : null
    }
  },
  created () {
    otcApi.appealTtpe((res) => {
      this.appealTtpe = res || {}
    })
  }
}
</script>

<style scoped>
.appeal{width: 400px;background-color: #404b69;}
.appeal h3{position: relative;height: 30px;font-weight: normal;font-size: 14px;line-height: 30px;color: #cbd4ec;text-align: center;background-color: #283149;}
.appeal h3 a{position: absolute;right: 8px;top: 8px;color: #becbe8;}
.appeal h3 a:hover{color: #11a8fe;}

.appeal-cont{padding: 10px 10px 20px 10px;}
.explain{padding: 10px;background-color: #525e7f;border-radius: 4px;}
.explain p{padding-bottom: 10px;color: #becbe8;}
.explain p:last-of-type{padding-bottom: 0;}
.question{padding-top: 10px;}
.question-row label{display: block;height: 24px;line-height: 24px;color: #becbe8;}
.question-row label em.asterisk{position: relative;top: 5px;line-height: 0;font-size: 18px;color: #11a8fe;}
.question-row select{width: 100%;height: 30px;padding-left: 4px;padding-right: 20px;color: #becbe8;background-position: right 4px center;border:1px solid #283149;cursor: pointer;}
.question-row select.error{border-color: #e53f3f;}
.question-row textarea{box-sizing: border-box;width: 100%;height: 72px;padding: 5px;font: 12px/20px serif;color: #becbe8;vertical-align: top;background-color: transparent;border:1px solid #283149;resize: none;}
.question-row textarea.error{border-color: #e53f3f;}
.question-row textarea::-webkit-input-placeholder{color: #999;}
.question-row textarea::-moz-placeholder{color: #999;}
.question-row textarea:-moz-placeholder{color: #999;}
.question-row textarea:-ms-input-placeholder{color: #999;}
.question-row span{display: block;height: 24px;line-height: 24px;color: #e53f3f;}
.question-button{padding-top: 10px;font-size: 0;line-height: 0;text-align: center;}
.question-button input{min-width: 80px;height: 30px;padding-left: 24px;padding-right: 24px;border-radius: 4px;cursor: pointer;}
.question-button input.cancel{margin-right: 30px;color: #11a8fe;background-color: transparent;border: 1px solid #11a8fe;}
.question-button input.cancel:hover{color: #15c9ff;border-color: #15c9ff;}
.question-button input.confirm{color: #fff;background-color: #11a8fe;}
.question-button input.confirm:hover{background-color: #15c9ff;}
</style>

