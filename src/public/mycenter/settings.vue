<template>
    <div class="settings">
      <ul class="form-list">
          <!-- 银行卡 -->
          <li class="form-item">
              <h3> {{$t('otc_legal.otc_legal_Bank_Transfer')}}<!--银行转账--></h3>
              <div class="form-flex" v-if="bankReadOnly">
                <div class="form-flex-left">
                  <i class="icon-bank"></i>
                  <em>{{$t('otc_legal.oyc_legal_Bank_card')}}<!--银行卡--></em>
                </div>
                <div class="form-flex-center">
                  <div class="not-set" v-if="!bankData.card_number">
                    <p>{{$t('public0.public196')}}<!--请设置银行卡信息--></p>
                  </div>
                  <div class="have-set" v-if="bankData.card_number">
                      <p class="card_name">{{$t('otc_legal.otc_legal_Name')}}：<!--姓名-->{{bankData.card_name}}</p>
                      <p class="card_bank">{{$t('otc_legal.otc_legal_Bank')}}：<!--开户行-->{{bankData.card_bank}}</p>
                      <p class="card_number">{{$t('otc_legal.otc_legal_Bank_number')}}：<!--银行卡号-->{{bankData.card_number}}</p>
                  </div>
                </div>
                <div class="form-flex-right">
                  <span @click="checkVerifyState('bank_scope')">{{$t('otc_legal.otc_legal_Set')}}<!--设置--></span>
                </div>
              </div>
              <form class="form-col" ref="bankForm" v-if="!bankReadOnly" data-vv-scope="bank_scope">
                <ul class="form-table">
                    <li class="form-row form-row-top">
                      <i class="form-icon icon-bank"></i>
                      <label class="form-label">{{$t('otc_legal.oyc_legal_Bank_card')}}<!--银行卡--></label>
                    </li>
                    <li class="form-row">
                      <label class="form-label">{{$t('otc_legal.otc_legal_Name')}}<!--姓名--><em class="asterisk">&nbsp;*</em></label>
                      <input class="form-input" type="text" name="card_name" :value="bankData.card_name" autocomplete="off" readonly/>
                    </li>
                    <li class="form-row">
                      <label class="form-label">{{$t('otc_legal.otc_legal_Bank')}}<!--开户行--><em class="asterisk">&nbsp;*</em></label>
                      <input class="form-input" :class="{error: errors.has('bank_scope.card_bank')}" type="text" name="card_bank" v-model="bankData.card_bank" v-validate="'required'" maxlength="32" autocomplete="off"/>
                      <span class="form-error" v-if="errors.has('bank_scope.card_bank')">{{msgs.card_bank[errors.firstRule('card_bank')]}}</span>
                    </li>
                    <li class="form-row">
                      <label class="form-label">{{$t('otc_legal.otc_legal_Bank_number')}}<!--银行卡号--><em class="asterisk">&nbsp;*</em></label>
                      <input class="form-input" :class="{error: errors.has('bank_scope.card_number')}" type="text" name="card_number" v-model="bankData.card_number" v-validate="'required|bankCardValid'" maxlength="32" autocomplete="off"/>
                      <span class="form-error" v-if="errors.has('bank_scope.card_number')">{{msgs.card_number[errors.firstRule('card_number')]}}</span>
                    </li>
                    <li class="form-row form-row-bottom">
                        <input class="form-cancel" type="button" :value="$t('otc_legal.otc_legal_cancel')" @click="bankReadOnly=true"/><!--取消-->
                        <input class="form-save" type="button" :value="$t('otc_legal.otc_legal_save')" @click="saveSettings(1)"/><!--保存-->
                    </li>
                </ul>
              </form>
          </li>

          <!-- 微信 -->
          <li class="form-item">
              <h3>{{$t('otc_legal.otc_legal_WeChat_receivables')}}<!--微信收款--></h3>
              <div class="form-flex" v-if="wechatReadOnly">
                <div class="form-flex-left">
                  <i class="icon-wechat"></i>
                  <em>{{$t('public0.public198')}}<!--微信--></em>
                </div>
                <div class="form-flex-center">
                  <div class="not-set" v-if="!wechatData.wechat_number">
                    <p>{{$t('public0.public197')}}<!--请设置微信账号及收款码，收付款更便捷--></p>
                  </div>
                  <div class="have-set" v-if="wechatData.wechat_number">
                    <p class="wechat_name">{{$t('otc_legal.otc_legal_Payee_Name')}}<!--收款人姓名-->：{{wechatData.wechat_name}}</p>
                    <p class="wechat_number">{{$t('otc_legal.otc_legal_Wechat_number')}}<!--微信账号-->：{{wechatData.wechat_number}}</p>
                  </div>
                </div>
                <div class="form-flex-right">
                  <span @click="checkVerifyState('wechat_scope')">{{$t('otc_legal.otc_legal_Set')}}<!--设置--></span>
                </div>
              </div>
              <form class="form-col" ref="wechatForm" v-if="!wechatReadOnly" data-vv-scope="wechat_scope">
                <ul class="form-table">
                    <li class="form-row form-row-top">
                      <i class="form-icon icon-wechat"></i>
                      <label class="form-label">{{$t('public0.public198')}}<!--微信--></label>
                    </li>
                    <li class="form-row">
                      <label class="form-label">{{$t('otc_legal.otc_legal_Payee_Name')}}<!--收款人姓名--><em class="asterisk">&nbsp;*</em></label>
                      <input class="form-input" type="text" name="wechat_name" :value="wechatData.wechat_name" autocomplete="off" readonly/>
                    </li>
                    <li class="form-row">
                      <label class="form-label">{{$t('otc_legal.otc_legal_Wechat_number')}}<!--微信账号--><em class="asterisk">&nbsp;*</em></label>
                      <input class="form-input" :class="{error: errors.has('wechat_scope.wechat_number')}" type="text" name="wechat_number" v-model="wechatData.wechat_number" v-validate="'required'" maxlength="32" autocomplete="off"/>
                      <span class="form-error" v-if="errors.has('wechat_scope.wechat_number')">{{msgs.wechat_number[errors.firstRule('wechat_number')]}}</span>
                    </li>
                    <li class="form-row">
                        <label class="form-label">{{$t('otc_legal.otc_legal_WeChat_code')}}<!--微信收款码--><em class="asterisk">&nbsp;*</em></label>
                        <div class="form-upload" :class="{error: errors.has('wechat_scope.wechat_QRcode')}">
                            <img class="form-upload-img" v-if="wechatData.wechat_QRcode" :src="wechatData.wechat_QRcode"/>
                            <span class="form-upload-span" v-if="!wechatData.wechat_QRcode">{{$t('otc_legal.otc_legal_Upload_payment')}}<!--点击上传收款码--></span>
                            <input type="hidden" v-model="wechatData.wechat_QRcode" data-vv-name="wechat_QRcode" v-validate="'required'"/>
                            <input class="form-upload-file" type="file" title=" " data-key="1" v-show="isShowUpload.wechat_QRcode" @change="uploadImage($event, 3)"/>
                            <input class="form-upload-file" type="file" name="source" title=" " data-key="2" v-show="!isShowUpload.wechat_QRcode" @change="uploadImage($event, 3)"/>
                        </div>
                        <span class="form-error" v-if="errors.has('wechat_scope.wechat_QRcode')">{{msgs.wechat_QRcode[errors.firstRule('wechat_QRcode')]}}</span>
                    </li>
                    <li class="form-row form-row-bottom">
                        <input class="form-cancel" type="button" :value="$t('otc_legal.otc_legal_cancel')" @click="wechatReadOnly=true"/><!--取消-->
                        <input class="form-save" type="button" :value="$t('otc_legal.otc_legal_save')" @click="saveSettings(3)"/><!--保存-->
                    </li>
                </ul>
              </form>
          </li>

          <!-- 支付宝 -->
          <li class="form-item">
              <h3>{{$t('otc_legal.otc_legal_Alipay_receivables')}}<!--支付宝收款--></h3>
              <div class="form-flex" v-if="alipayReadOnly">
                <div class="form-flex-left">
                  <i class="icon-alipay"></i>
                  <em>{{$t('public0.public199')}}<!--支付宝--></em>
                </div>
                <div class="form-flex-center">
                  <div class="not-set" v-if="!alipayData.alipay_number">
                    <p>{{$t('public0.public261')}}<!--请设置支付宝账号及收款码，收付款更便捷--></p>
                  </div>
                  <div class="have-set" v-if="alipayData.alipay_number">
                    <p class="alipay_name">{{$t('otc_legal.otc_legal_Payee_Name')}}<!--收款人姓名-->：{{alipayData.alipay_name}}</p>
                    <p class="alipay_number">{{$t('otc_legal.otc_legal_Alipay_number')}} <!--支付宝账号-->：{{alipayData.alipay_number}}</p>
                  </div>
                </div>
                <div class="form-flex-right">
                  <span @click="checkVerifyState('alipay_scope')">{{$t('otc_legal.otc_legal_Set')}}<!--设置--></span>
                </div>
              </div>
              <form class="form-col" ref="alipayForm" v-if="!alipayReadOnly" data-vv-scope="alipay_scope">
                <ul class="form-table">
                    <li class="form-row form-row-top">
                        <i class="form-icon icon-alipay"></i>
                        <label class="form-label">{{$t('public0.public199')}}<!--支付宝--></label>
                    </li>
                    <li class="form-row">
                        <label class="form-label">{{$t('otc_legal.otc_legal_Payee_Name')}}<!--收款人姓名--><em class="asterisk">&nbsp;*</em></label>
                        <input class="form-input" type="text" name="alipay_name" :value="alipayData.alipay_name" autocomplete="off" readonly/>
                    </li>
                    <li class="form-row">
                        <label class="form-label">{{$t('otc_legal.otc_legal_Alipay_number')}}<!--支付宝账号--><em class="asterisk">&nbsp;*</em></label>
                        <input class="form-input" :class="{error: errors.has('alipay_scope.alipay_number')}" type="text" name="alipay_number" v-model="alipayData.alipay_number" v-validate="'required'" maxlength="32" autocomplete="off"/>
                        <span class="form-error" v-if="errors.has('alipay_scope.alipay_number')">{{msgs.alipay_number[errors.firstRule('alipay_number')]}}</span>
                    </li>
                    <li class="form-row">
                        <label class="form-label">{{$t('otc_legal.otc_legal_Aipay_code')}}<!--支付宝收款码--><em class="asterisk">&nbsp;*</em></label>
                        <div class="form-upload" :class="{error: errors.has('alipay_scope.alipay_QRcode')}">
                            <img class="form-upload-img" v-if="alipayData.alipay_QRcode" :src="alipayData.alipay_QRcode"/>
                            <span class="form-upload-span" v-if="!alipayData.alipay_QRcode">{{$t('otc_legal.otc_legal_Upload_payment')}}<!--点击上传收款码--></span>
                            <input type="hidden" v-model="alipayData.alipay_QRcode" data-vv-name="alipay_QRcode" v-validate="'required'"/>
                            <input class="form-upload-file" type="file" title=" " data-key="1" v-show="isShowUpload.alipay_QRcode" @change="uploadImage($event, 2)"/>
                            <input class="form-upload-file" type="file" name="source" title=" " data-key="2" v-show="!isShowUpload.alipay_QRcode" @change="uploadImage($event, 2)"/>
                        </div>
                        <span class="form-error" v-if="errors.has('alipay_scope.alipay_QRcode')">{{msgs.alipay_QRcode[errors.firstRule('alipay_QRcode')]}}</span>
                    </li>
                    <li class="form-row form-row-bottom">
                        <input class="form-cancel" type="button" :value="$t('otc_legal.otc_legal_cancel')" @click="alipayReadOnly=true"/><!--取消-->
                        <input class="form-save" type="button" :value="$t('otc_legal.otc_legal_save')" @click="saveSettings(2)"/><!--保存-->
                    </li>
                </ul>
              </form>
          </li>

          <!-- PayPal -->
          <li class="form-item">
              <h3>{{$t('public0.public218')}}<!--PayPal收款--></h3>
              <div class="form-flex" v-if="paypalReadOnly">
                <div class="form-flex-left">
                  <i class="icon-paypal"></i>
                  <em>{{$t('public0.public219')}}<!--PayPal--></em>
                </div>
                <div class="form-flex-center">
                  <div class="not-set" v-if="!paypalData.paypal_number">
                    <p>{{$t('public0.public220')}}<!--请设置PayPal信息--></p>
                  </div>
                  <div class="have-set" v-if="paypalData.paypal_number">
                    <p class="wechat_name">{{$t('otc_legal.otc_legal_Payee_Name')}}<!--收款人姓名-->：{{paypalData.paypal_name}}</p>
                    <p class="wechat_number">{{$t('public0.public221')}}<!--PayPal账号-->：{{paypalData.paypal_number}}</p>
                  </div>
                </div>
                <div class="form-flex-right">
                  <span @click="checkVerifyState('paypal_scope')">{{$t('otc_legal.otc_legal_Set')}}<!--设置--></span>
                </div>
              </div>
              <form class="form-col" ref="paypalForm" v-if="!paypalReadOnly" data-vv-scope="paypal_scope">
                <ul class="form-table">
                    <li class="form-row form-row-top">
                      <i class="form-icon icon-paypal"></i>
                      <label class="form-label">{{$t('public0.public219')}}<!--PayPal--></label>
                    </li>
                    <li class="form-row">
                      <label class="form-label">{{$t('otc_legal.otc_legal_Payee_Name')}}<!--收款人姓名--><em class="asterisk">&nbsp;*</em></label>
                      <input class="form-input" type="text" name="paypal_name" :value="paypalData.paypal_name" autocomplete="off" readonly/>
                    </li>
                    <li class="form-row">
                      <label class="form-label">{{$t('public0.public221')}}<!--PayPal账号--><em class="asterisk">&nbsp;*</em></label>
                      <input class="form-input" :class="{error: errors.has('paypal_scope.paypal_number')}" type="text" name="paypal_number" v-model="paypalData.paypal_number" v-validate="'required'" maxlength="32" autocomplete="off"/>
                      <span class="form-error" v-if="errors.has('paypal_scope.paypal_number')">{{msgs.paypal_number[errors.firstRule('paypal_number')]}}</span>
                    </li>
                    <li class="form-row form-row-bottom">
                        <input class="form-cancel" type="button" :value="$t('otc_legal.otc_legal_cancel')" @click="paypalReadOnly=true"/><!--取消-->
                        <input class="form-save" type="button" :value="$t('otc_legal.otc_legal_save')" @click="saveSettings(4)"/><!--保存-->
                    </li>
                </ul>
              </form>
          </li>
      </ul>
    </div>
</template>

<script>
import Vue from 'vue'
import otcApi from '@/api/otc'
import utils from '@/assets/js/utils'
import config from '@/assets/js/config'
export default {
  data () {
    return {
      bankReadOnly: true,
      bankData: {
        card_name: '',
        card_bank: '',
        card_number: ''
      },
      oldBankData: {
        card_name: '',
        card_bank: '',
        card_number: ''
      },
      wechatReadOnly: true,
      wechatData: {
        wechat_name: '',
        wechat_number: '',
        wechat_QRcode: ''
      },
      oldWechatData: {
        wechat_name: '',
        wechat_number: '',
        wechat_QRcode: ''
      },
      alipayReadOnly: true,
      alipayData: {
        alipay_name: '',
        alipay_number: '',
        alipay_QRcode: ''
      },
      oldAlipayData: {
        alipay_name: '',
        alipay_number: '',
        alipay_QRcode: ''
      },
      paypalReadOnly: true,
      paypalData: {
        paypal_name: '',
        paypal_number: ''
      },
      oldPayPalData: {
        paypal_name: '',
        paypal_number: ''
      },
      isShowUpload: {
        wechat_QRcode: true,
        alipay_QRcode: true
      },
      isSaveSettings: false
    }
  },
  computed: {
    msgs () {
      return {
        card_bank: {required: this.$t('otc_legal.otc_legal_input_bank')}, // 请输入开户行
        card_number: {required: this.$t('otc_legal.otc_legal_input_bank_number'), bankCardValid: this.$t('public0.public135')}, // 请输入银行卡号、请输入有效的银行卡号
        wechat_number: {required: this.$t('otc_legal.otc_legal_input_WeChat_number')}, // 请输入微信账号
        wechat_QRcode: {required: this.$t('public0.public90')}, // 未选择文件
        alipay_number: {required: this.$t('otc_legal.otc_legal_input_Alipay_number')}, // 请输入支付宝账号
        alipay_QRcode: {required: this.$t('public0.public90')}, // 未选择文件
        paypal_number: {required: this.$t('public0.public222')} // 请输入PayPal账号
      }
    }
  },
  watch: {
    bankReadOnly (newVal) {
      if (newVal) {
        if (this.isSaveSettings) {
          this.oldBankData = JSON.parse(JSON.stringify(this.bankData))
          this.isSaveSettings = false
        } else {
          this.bankData = JSON.parse(JSON.stringify(this.oldBankData))
        }
      }
    },
    wechatReadOnly (newVal) {
      if (newVal) {
        if (this.isSaveSettings) {
          this.oldWechatData = JSON.parse(JSON.stringify(this.wechatData))
          this.isSaveSettings = false
        } else {
          this.wechatData = JSON.parse(JSON.stringify(this.oldWechatData))
          this.$refs.wechatForm.querySelector('input[name="source"]').value = null
        }
      }
    },
    alipayReadOnly (newVal) {
      if (newVal) {
        if (this.isSaveSettings) {
          this.oldAlipayData = JSON.parse(JSON.stringify(this.alipayData))
          this.isSaveSettings = false
        } else {
          this.alipayData = JSON.parse(JSON.stringify(this.oldAlipayData))
          this.$refs.alipayForm.querySelector('input[name="source"]').value = null
        }
      }
    },
    paypalReadOnly (newVal) { // PayPal
      if (newVal) {
        if (this.isSaveSettings) {
          this.oldPayPalData = JSON.parse(JSON.stringify(this.paypalData))
          this.isSaveSettings = false
        } else {
          this.paypalData = JSON.parse(JSON.stringify(this.oldPayPalData))
        }
      }
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    loadData () {
      otcApi.getPaySettings((res) => {
        // 银行卡
        this.bankData = {
          card_name: res.real_name,
          card_bank: res.data.card_bank,
          card_number: res.data.card_number
        }
        this.oldBankData = {
          card_name: res.real_name,
          card_bank: res.data.card_bank,
          card_number: res.data.card_number
        }
        // 支付宝
        this.alipayData = {
          alipay_name: res.real_name,
          alipay_number: res.data.alipay_number,
          alipay_QRcode: res.data.alipay_image_path
        }
        this.oldAlipayData = {
          alipay_name: res.real_name,
          alipay_number: res.data.alipay_number,
          alipay_QRcode: res.data.alipay_image_path
        }
        // 微信
        this.wechatData = {
          wechat_name: res.real_name,
          wechat_number: res.data.wechat_number,
          wechat_QRcode: res.data.wechat_image_path
        }
        this.oldWechatData = {
          wechat_name: res.real_name,
          wechat_number: res.data.wechat_number,
          wechat_QRcode: res.data.wechat_image_path
        }
        // PayPal
        this.paypalData = {
          paypal_name: res.real_name,
          paypal_number: res.data.paypal_number
        }
        this.oldPayPalData = {
          paypal_name: res.real_name,
          paypal_number: res.data.paypal_number
        }
      }, (res) => {
        if (res.msg === 'NO_PAY_TYPE') {
          // 银行卡
          this.bankData.card_name = res.real_name
          this.oldBankData.card_name = res.real_name
          // 支付宝
          this.alipayData.alipay_name = res.real_name
          this.oldAlipayData.alipay_name = res.real_name
          // 微信
          this.wechatData.wechat_name = res.real_name
          this.oldWechatData.wechat_name = res.real_name
          // PayPal
          this.paypalData.paypal_name = res.real_name
          this.oldPayPalData.paypal_name = res.real_name
        } else {
          console.error(res.msg)
        }
      })
    },
    saveSettings (type) {
      let scope = null
      let formData = null
      switch (type) {
        case 1:
          scope = 'bank_scope'
          formData = new FormData(this.$refs.bankForm)
          break
        case 2:
          scope = 'alipay_scope'
          formData = new FormData(this.$refs.alipayForm)
          break
        case 3:
          scope = 'wechat_scope'
          formData = new FormData(this.$refs.wechatForm)
          break
        case 4:
          scope = 'paypal_scope'
          formData = new FormData(this.$refs.paypalForm)
          break
      }
      this.$validator.validateAll(scope).then((validResult) => {
        if (!validResult) {
          return
        }
        otcApi.savePaySettings(type, formData, (msg) => {
          this.isSaveSettings = true
          switch (type) {
            case 1:
              this.bankReadOnly = true
              break
            case 2:
              this.alipayReadOnly = true
              break
            case 3:
              this.wechatReadOnly = true
              break
            case 4:
              this.paypalReadOnly = true
              break
          }
          Vue.$koallTipBox({icon: 'success', message: this.$t(`error_code.${msg}`)})
        }, (msg) => {
          Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
        })
      })
    },
    uploadImage (event, type) {
      let objectName = null
      let propertyName = null
      if (type === 2) {
        objectName = 'alipayData'
        propertyName = 'alipay_QRcode'
      } else if (type === 3) {
        objectName = 'wechatData'
        propertyName = 'wechat_QRcode'
      } else {
        return
      }

      let isTrue = false
      if (config.imageType.test(event.target.value)) {
        isTrue = utils.limitUploadImage(event.target, (msg) => {
          Vue.$koallTipBox({icon: 'notification', message: this.$t(msg)}) // 图片不能超过1M
        }, 1)
      } else {
        isTrue = false
        Vue.$koallTipBox({icon: 'notification', message: this.$t('public0.public43')}) // 请上传JPG、PNG、JPEG、BMP格式的图片
      }

      if (isTrue) {
        this[objectName][propertyName] = window.URL.createObjectURL(event.target.files[0])
        event.target.name = 'source'
        if (parseInt(event.target.getAttribute('data-key')) === 1) {
          event.target.nextElementSibling.name = ''
          event.target.nextElementSibling.value = null
          this.isShowUpload[propertyName] = false
        } else {
          event.target.previousElementSibling.name = ''
          event.target.previousElementSibling.value = null
          this.isShowUpload[propertyName] = true
        }
      } else {
        event.target.value = null
      }
    },
    checkVerifyState (scope) {
      // 检查是否完成实名验证
      otcApi.getVerifyState((msg) => {
        switch (scope) {
          case 'bank_scope':
            this.bankReadOnly = false
            break
          case 'wechat_scope':
            this.wechatReadOnly = false
            break
          case 'alipay_scope':
            this.alipayReadOnly = false
            break
          case 'paypal_scope':
            this.paypalReadOnly = false
            break
        }
        this.$validator.errors.clear(scope)
      }, (msg) => {
        if (msg === 'KYC_AUTH_FIRST') {
          Vue.$confirmDialog({
            content: this.$t('error_code.KYC_AUTH_FIRST'), // 请先完成实名验证
            okCallback: () => {
              this.$emit('switchTab', 'mycenter')
              this.$emit('removeDialog')
            }
          })
        } else {
          Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
        }
      })
    }
  }
}
</script>

<style scoped>
.form-list{display: flex;flex-flow: column;}
.form-item{margin-top: 8px;background-color: #FFFFFF;}
.form-item:first-of-type{margin-top: 0;}
.form-item h3{height: 24px;font-weight: normal;font-size: 14px;line-height: 24px;color: #cbd4ec;text-indent: 8px;background-color: #333232;}

.form-flex{display: flex;justify-content: space-between;align-items: center;height: 120px;padding-left: 30px;padding-right: 30px;}
.form-flex-left{font-size: 0;line-height: 0;}
.form-flex-left i{display: inline-block;margin-right: 20px;font-size: 20px;color: #fdb902;vertical-align: middle;}
.form-flex-left em{display: inline-block;width: 160px;min-height: 20px;font-size: 14px;line-height: 20px;vertical-align: middle;color: #261003;}
.form-flex-center{width:300px;}
.form-flex-center p{line-height: 24px;color: #261003;}
.form-flex-center .not-set p{min-height: 24px;}
.form-flex-center .have-set p{height: 24px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
.form-flex-right{width: 200px;text-align: right;}
.form-flex-right span{display: inline-block;min-width: 52px;height: 30px;padding-left: 24px;padding-right: 24px;line-height: 30px;color: #261003;text-align: center;background-color: #fdb902;border-radius: 4px;cursor: pointer;}
.form-flex-right span:hover{background-color: #fdb902;}

.form-table{padding: 30px;}
.form-row{display: flex;padding-bottom: 10px}
.form-row-top{position: relative}
.form-row-bottom{justify-content: flex-end;padding-bottom: 0;font-size: 0;line-height: 0;}
.form-icon{position: absolute;top: 3px;font-size: 24px;}
.form-item .icon-bank{color:#ea1416;}
.form-item .icon-wechat{color:#69c03e;}
.form-item .icon-alipay{color:#1cc5e4;}
.form-item .icon-paypal{color:#2a74d3;}
.form-label{width: 152px;height: 30px;line-height: 30px;padding-left: 48px;color: #261003;}
.form-label em.asterisk{position: relative;top: 5px;line-height: 0;font-size: 18px;color:#fdb902;}
.form-input{width: 270px;height: 28px;color: #cbd4ec;background-color: #261003;border: 1px solid #505e83;}
.form-input[readonly='readonly']{cursor: not-allowed}
.form-input.error{border-color: #e53f3f;}
.form-upload{display: flex;align-items: center;justify-content: center;position: relative;width: 138px;height: 138px;border: 1px solid #505e83;}
.form-upload.error{border-color: #e53f3f;}
.form-upload-span{color: #261003;text-align: center;}
.form-upload-img{width: 100%;height: 100%;}
.form-upload-file{position: absolute;top: 0;left: 0;width: 100%;height: 100%;opacity: 0;cursor: pointer;}
.form-error{height: 30px;line-height: 30px;color: #e53f3f;text-indent: 10px;}
.form-upload + .form-error{align-self: flex-end;}
.form-cancel{min-width: 100px;height: 30px;padding-left: 24px;padding-right: 24px;margin-right: 30px;color: #261003;text-align: center;background-color: transparent;border: 1px solid #fdb902;border-radius: 4px;cursor: pointer;}
.form-cancel:hover{color: #261003;border-color: #fdb902;}
.form-save{min-width: 100px;height: 30px;padding-left: 24px;padding-right: 24px;color: #261003;background-color: #fdb902;border-radius: 4px;cursor: pointer;}
.form-save:hover{background-color: #fdb902;}
</style>
