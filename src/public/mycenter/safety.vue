<template>
    <div class="safety">
        <!--登录密码 begin-->
        <div class="password">
            <h3>{{$t('account.user_center_login_password')}}<!--登录密码--></h3>
            <div class="password-level" :class="{active:!infoLoaded}">
                <div class="password-level-left">
                    <img src="../../assets/images/lock_icon.png" />
                    <span class="label">{{$t('public0.public193')}}<!--安全级别--></span>
                    <div class="state">
                        <!--<span class="low middle high">低、中、高级别对应的class名</span>-->
                        <span :class="[pwdLevelInfo.css]">{{pwdLevelInfo.text}}</span>
                    </div>
                </div>
                <div class="password-level-right">
                    <input type="button" :value="$t('account.user_center_change_password')" @click="changepwdDialog"/><!--修改密码-->
                </div>
            </div>
        </div>
        <!--登录密码 end-->
        <!--谷歌验证 begin-->
        <div class="google" v-show="delayedShow">
            <h3>{{$t('auth_warning.warning_google_auth')}}<!--谷歌验证--></h3>
            <div class="google-content"  :class="{active:!infoLoaded}">
                <div class="google-content-left">
                    <img src="../../assets/images/google_icon.png"/>
                    <span class="label">{{googleState === 0 ? $t('public0.public195') : $t('account.user_Google_verified_binding')}}<!--扫二维码绑定谷歌验证||已绑定谷歌验证--></span>
                </div>
                <div class="google-content-center">
                    <!--<div class="state" v-if="googleState === 1 && !showUnbindGoogleForm">
                      {{$t('account.user_center_state_bind')}}&lt;!&ndash;已绑定&ndash;&gt;
                    </div>-->
                    <div class="bind clearfix" v-if="googleState === 0">
                      <div class="bind-qrcode">
                          <div class="bind-qrcode-img" ref="qrcode"></div>
                      </div>
                      <div class="bind-form">
                          <p><span>{{$t('account.user_center_backup_key')}}：<!--密钥--></span></p>
                          <p class="secretkey">
                            <span class="secretkey-code">{{bindGoogleFormData.key}}</span>
                            <span class="secretkey-tips">
                              <i class="tips-icon">?</i>
                              <em class="tips-text">{{$t('public0.public240')}}<!--强烈建议备份此密钥！--></em>
                            </span>
                          </p>
                          <p><em class="asterisk">*&nbsp;</em><span>{{$t('account.user_center_login_password')}}：<!--登录密码--></span></p>
                          <p>
                              <input :class="{error: errors.has('password')}" type="password" v-model="bindGoogleFormData.password" v-validate="'required'" data-vv-name="password"/>
                              <em class="error">{{errorsInfo.password}}</em>
                          </p>
                          <p><em class="asterisk">*&nbsp;</em><span>{{$t('account.user_center_Google_verification_code')}}：<!--谷歌验证码--></span></p>
                          <p>
                              <input :class="{error: errors.has('verifyCode')}" type="text" maxlength="6" v-model="bindGoogleFormData.verifyCode" v-validate="'required|pInteger'" data-vv-name="verifyCode"/>
                              <em class="error">{{errorsInfo.code}}</em>
                          </p>
                      </div>
                    </div>
                    <div class="unbind" v-if="showUnbindGoogleForm">
                        <div class="unbind-form">
                            <p><span>{{$t('account.user_unbind_google_authentication')}}<!--解除谷歌验证--></span></p>
                            <p><em class="asterisk">*&nbsp;</em><span>{{$t('account.user_center_login_password')}}：<!--登录密码--></span></p>
                            <p>
                                <input :class="{error: errors.has('password')}" type="password" v-model="unbindGoogleFormData.password" v-validate="'required'" data-vv-name="password"/>
                                <em class="error">{{errorsInfo.password}}</em>
                            </p>
                            <p><em class="asterisk">*&nbsp;</em><span>{{$t('account.user_center_Google_verification_code')}}：<!--谷歌验证码--></span></p>
                            <p>
                                <input :class="{error: errors.has('verifyCode')}" type="text" maxlength="6" v-model="unbindGoogleFormData.verifyCode" v-validate="'required|pInteger'" data-vv-name="verifyCode"/>
                                <em class="error">{{errorsInfo.code}}</em>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="google-content-right">
                    <input type="button" v-if="googleState === 0" :value="$t('account.user_center_google_auth')" @click="bindGoogleAuth"/><!--绑定二次验证-->
                    <input type="button" v-if="showUnbindGoogleButton" :value="$t('account.user_center_operate_unbind')" @click="fnShowUnbindGoogleForm"/><!--解绑-->
                    <input type="button" v-if="showUnbindGoogleForm" :value="$t('exchange.exchange_determine')" @click="unbindGoogleAuth"/><!--确定-->
                    <br/>
                    <input class="cancel" type="button" v-if="showUnbindGoogleForm" :value="$t('otc_legal.otc_legal_cancel')" @click="fnShowUnbindGoogleForm"/><!--取消-->
                </div>
            </div>
          </div>
          <!--谷歌验证 end-->
          <!--短信验证 begin-->
          <div class="cellphone google" v-show="delayedShow">
            <h3>{{$t('auth_warning.warning_SMS_auth')}}<!--短信验证-->
              <span class="cellphone-tips">
                <span class="tips-container">
                  <i class="tips-icon">?</i>
                  <em class="tips-text">{{$t('account.priority_select_cellphone')}}<!--我们将优先选择手机短信验证码进行二次验证--></em>
                </span>
              </span>
            </h3>
            <div class="google-content"  :class="{active:!infoLoaded}">
                <div class="google-content-left">
                    <img src="../../assets/images/cellphone_icon.png"/>
                    <span class="label">
                      {{$t('account.user_bind_SMS_verification')}}<!--绑定短信验证-->
                    </span>
                </div>
                <div class="google-content-center">
                    <div class="state" v-if="!showBindMobile">
                      {{mobileState === 1 ? $t('account.user_center_state_bind') : $t('account.user_center_state_unbind')}}<!--已绑定||未绑定-->
                    </div>
                    <div class="bind clearfix" v-if="showBindMobile">
                      <div class="bind-form">
                          <p><em class="asterisk">*&nbsp;</em><span>{{$t('account.user_center_phone')}}：<!--手机号--></span></p>
                          <p v-if="mobileState == 1 || readonly">
                            {{mobileFormData.phoneNumber}}
                          </p>
                          <p v-if="mobileState == 0 && !readonly">
                              <span class="mobile">
                                <select v-model="mobileFormData.countryCode">
                                  <option v-for="item in areaCodeList" :value="item.code">{{$t(item.key)}}&nbsp;{{item.code}}</option>
                                </select>
                                <input :class="{error: errors.has('phoneNumber')}" type="text" v-model="mobileFormData.phoneNumber" v-validate="'required|telphone'" data-vv-name="phoneNumber"/>
                              </span>
                              <em class="error">
                                <template v-if="errors.firstRule('phoneNumber')==='required'">{{$t('public0.public6')}}</template>
                                <template v-if="errors.firstRule('phoneNumber')==='telphone'">{{$t(errors.first('phoneNumber'))}}</template>
                              </em>
                          </p>
                          <p><span>{{$t('account.user_center_login_password')}}：<!--登录密码--></span><em class="asterisk">&nbsp;*</em></p>
                          <p>
                              <input :class="{error: errors.has('phonepassword')}" type="password" v-model="mobileFormData.phonepassword" v-validate="'required'" data-vv-name="phonepassword"/>
                              <em class="error">
                                <template v-if="errors.firstRule('phonepassword')==='required'">{{$t('login_register.password')}}</template>
                              </em>
                          </p>
                          <p><em class="asterisk">*&nbsp;</em><span>{{$t('account.user_center_SMS_code')}}：<!--短信验证码--></span></p>
                          <p>
                              <input :class="{error: errors.has('smsCode')}" type="text" maxlength="6" v-model="mobileFormData.smsCode" v-validate="'required|pInteger'" data-vv-name="smsCode" style="width:64px;"/>
                              <button :class="{disabled:btnDisabled}" @click="sendSMSCode">{{$t('account.user_center_send_SMS')}}<!--发送验证码-->{{disabled ? `（${time}s）` : ''}}</button>
                              <em class="error">
                                <template v-if="errors.firstRule('smsCode')==='required'">{{$t('login_register.verify_code')}}</template>
                                <template v-if="errors.firstRule('smsCode')==='pInteger'">{{$t(errors.first('smsCode'))}}</template>
                              </em>
                          </p>
                      </div>
                    </div>
                </div>
                <div class="google-content-right">
                    <input type="button" v-if="mobileState === 0 && !showBindMobile" :value="$t('account.user_center_operate_bind')" @click="showBindMobile=true"/><!--绑定-->
                    <input v-if="mobileState == 1 && !showBindMobile" type="button" :value="$t('account.user_center_operate_unbind')" @click="clickShowBindMobile"/><!--解绑-->
                    <template v-if="showBindMobile">
                      <input type="button" :value="$t('exchange.exchange_determine')" @click="bindMobile"/><!--确定-->
                      <br/>
                      <input class="cancel" type="button" :value="$t('otc_legal.otc_legal_cancel')" @click="showBindMobile=false"/><!--取消-->
                    </template>
                </div>
            </div>
        </div>
        <!--短信验证 end-->
    </div>
</template>
<script>
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import userApi from '@/api/individual'
import myApi from '@/api/user'
import utils from '@/assets/js/utils'
import changepwd from '@/public/dialog/changepwd'
import commonConfig from '@/assets/js/commonConfig'
export default {
  data () {
    return {
      infoLoaded: false,
      delayedShow: false,
      googleState: 0,
      mobileState: 0,
      pwdLevel: null,
      bindGoogleFormData: {
        key: '',
        verifyCode: '',
        password: ''
      },
      unbindGoogleFormData: {
        verifyCode: '',
        password: ''
      },
      showUnbindGoogleButton: false,
      showUnbindGoogleForm: false,
      areaCodeList: commonConfig.areaCodeList,
      mobileFormData: {
        countryCode: commonConfig.defaultCode,
        phoneNumber: '',
        phonepassword: '',
        smsCode: ''
      },
      showBindMobile: false,
      disabled: false,
      readonly: false,
      time: 60
    }
  },
  computed: {
    ...mapGetters(['getUserInfo']),
    errorsInfo () {
      let info = {}
      this.errors.has('password') && (info.password = this.$t('login_register.password')) // 请输入密码
      this.errors.firstRule('verifyCode') === 'required' && (info.code = this.$t('login_register.verify_code')) // 请输入验证码
      this.errors.firstRule('verifyCode') === 'pInteger' && (info.code = this.$t('error_code.NUMERIC')) // 输入类型必须为数字
      return info
    },
    pwdLevelInfo () {
      if (this.pwdLevel === 2) {
        return {
          css: 'middle',
          text: this.$t('public0.public194_Medium') // 中
        }
      } else if (this.pwdLevel === 3) {
        return {
          css: 'high',
          text: this.$t('public0.public194_High') // 高
        }
      } else {
        return {
          css: 'low',
          text: this.$t('public0.public194_Low') // 低
        }
      }
    },
    btnDisabled () {
      if (this.mobileFormData.phoneNumber === '') {
        return true
      } else if (this.errors.has('phoneNumber')) {
        return true
      } else {
        return this.disabled
      }
    }
  },
  created () {
    this.fnUserState()
    this.getMyUserInfo()
  },
  methods: {
    ...mapActions(['setUserInfo']),
    fnUserState () { // 获取当前用户状态信息
      userApi.getUserState((data) => {
        this.googleState = data.googleState
        this.mobileState = data.mobileAuthState
        this.pwdLevel = Number(data.passwdLevel)
        this.showUnbindGoogleButton = data.googleState === 1
        if (data.googleState === 0) {
          userApi.createGoogleKey((res) => {
            this.bindGoogleFormData.key = res.key
            var qrCode = `otpauth://totp/${res.company}:${this.getUserInfo.username}?secret=${res.key}&issuer=${res.company}`
            utils.qrcode(this.$refs.qrcode, {
              width: 150,
              height: 150,
              text: qrCode
            })
          }, (msg) => {
            Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
          })
        }
        this.delayedShow = true
        this.infoLoaded = true
      }, (msg) => {
        console.error(msg)
      })
    },
    changepwdDialog () { // 修改密码
      utils.setDialog(changepwd)
    },
    fnShowUnbindGoogleForm () { // 显示解除谷歌二次验证的内容
      this.showUnbindGoogleButton = !this.showUnbindGoogleButton
      this.showUnbindGoogleForm = !this.showUnbindGoogleForm
    },
    bindGoogleAuth () { // 绑定谷歌二次验证
      this.$validator.validateAll(this.bindGoogleFormData).then((validResult) => {
        if (!validResult) {
          return
        }
        let formData = {}
        for (let i in this.bindGoogleFormData) {
          formData[i] = this.bindGoogleFormData[i]
        }
        myApi.getRsaPublicKey((rsaPublicKey) => {
          formData.password = utils.encryptPwd(rsaPublicKey, formData.password)
          formData.rsaPublicKey = rsaPublicKey
          userApi.bindGoogleAuth(formData, (msg) => {
            Vue.$koallTipBox({icon: 'success', message: this.$t(`error_code.${msg}`)})
            this.bindGoogleFormData = {key: '', verifyCode: '', password: ''}
            this.fnUserState()
          }, (msg) => {
            Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
          })
        })
      })
    },
    unbindGoogleAuth () { // 解除谷歌二次验证
      this.$validator.validateAll(this.unbindGoogleFormData).then((validResult) => {
        if (!validResult) {
          return
        }
        let formData = {}
        for (let i in this.unbindGoogleFormData) {
          formData[i] = this.unbindGoogleFormData[i]
        }
        myApi.getRsaPublicKey((rsaPublicKey) => {
          formData.password = utils.encryptPwd(rsaPublicKey, formData.password)
          formData.rsaPublicKey = rsaPublicKey
          userApi.unbindGoogleAuth(formData, (msg) => {
            Vue.$koallTipBox({icon: 'success', message: this.$t(`error_code.${msg}`)})
            this.unbindGoogleFormData = {verifyCode: '', password: ''}
            this.fnUserState()
            this.showUnbindGoogleForm = false
          }, (msg) => {
            Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
          })
        })
      })
    },
    clickShowBindMobile () {
      Vue.$confirmDialog({
        content: this.$t('public0.public245'), // 为了您的资产安全，不建议您解除手机短信验证码功能。
        okCallback: () => {
          this.showBindMobile = true
        }
      })
    },
    bindMobile () {
      this.$validator.validateAll(this.mobileFormData).then((validResult) => {
        if (!validResult) {
          return
        }
        let formData = {}
        for (let i in this.mobileFormData) {
          formData[i] = this.mobileFormData[i]
        }
        formData.password = formData.phonepassword
        delete formData.phonepassword
        myApi.getRsaPublicKey((rsaPublicKey) => {
          formData.password = utils.encryptPwd(rsaPublicKey, formData.password)
          formData.rsaPublicKey = rsaPublicKey
          if (Number(this.mobileState) === 1) {
            userApi.unbindMobile(formData, (msg) => {
              this.showBindMobile = false
              this.disabled = false
              Vue.$koallTipBox({icon: 'success', message: this.$t(`error_code.${msg}`)})
              this.mobileFormData = {
                phoneNumber: '',
                phonepassword: '',
                smsCode: ''
              }
              this.fnUserState()
              this.getMyUserInfo()
            }, (msg) => {
              Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
            })
            return
          }
          userApi.bindMobile(formData, (msg) => {
            this.showBindMobile = false
            this.disabled = false
            Vue.$koallTipBox({icon: 'success', message: this.$t(`error_code.${msg}`)})
            this.mobileFormData = {
              phoneNumber: '',
              phonepassword: '',
              smsCode: ''
            }
            this.fnUserState()
            this.getMyUserInfo()
          }, (msg) => {
            Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
          })
        })
      })
    },
    getMyUserInfo () {
      myApi.getUserInfo((userInfo) => {
        if (userInfo.mobile) {
          this.readonly = true
          if (userInfo.countryCode) {
            this.mobileFormData.countryCode = userInfo.countryCode
          }
          this.mobileFormData.phoneNumber = userInfo.mobile
        } else {
          this.readonly = false
        }
        this.setUserInfo(userInfo)
      }, (msg) => {
        Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
      })
    },
    sendSMSCode () {
      if (this.btnDisabled) {
        return
      }
      this.disabled = true
      userApi.sendAuthSMSCode({
        countryCode: this.mobileFormData.countryCode,
        phoneNumber: this.mobileFormData.phoneNumber
      }, (msg) => {
        let timeOut = () => {
          this.time--
          if (this.time === 0) {
            this.disabled = false
            this.time = 60
            return
          }
          setTimeout(timeOut, 1000)
        }
        this.time = 60
        setTimeout(timeOut, 1000)
        Vue.$koallTipBox({icon: 'success', message: this.$t(`error_code.${msg}`)})
      }, (msg) => {
        this.disabled = false
        Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
      })
    }
  }
}
</script>
<style scoped>

.safety h3{height: 55px; padding-left: 28px; font-weight: normal;font-size: 18px;line-height: 55px;color: #333; border-bottom: 1px solid #e7e7e7;}
.safety .cellphone h3 .text{display: inline-block;height: 24px;font-size: 14px;line-height: 24px;text-indent: 8px;}
.cellphone-tips{display: inline-block;}
.cellphone-tips .tips-container{display: flex;justify-content: center;position: relative;}
.secretkey-tips .tips-icon,
.cellphone-tips .tips-icon{display: inline-block; width: 20px;height: 20px;font-weight: bold;font-size: 12px;line-height: 20px;color: #fff;text-align: center;background-color: #FA4D4D;border-radius: 50%;cursor: help;}
.secretkey-tips .tips-text,
.cellphone-tips .tips-text{display: none; position: absolute;top: -2px;height: 24px;padding-left: 6px;padding-right: 6px;font-size: 12px;line-height: 24px;color: #181b2a;white-space: nowrap;background-color: #fff;border-radius: 4px; left: 25px;}
.secretkey-tips .tips-text:before,
.cellphone-tips .tips-text:before{content: "";position: absolute;bottom: -6px;left: 50%;width: 0;height: 0;margin-left: -6px;border-width: 6px 6px 0 6px;border-style: solid;border-color: #fff transparent transparent transparent;}
.secretkey-tips .tips-icon:hover + .tips-text,
.cellphone-tips .tips-icon:hover + .tips-text{display: block;}
.secretkey{display: flex;align-items: center;}
.secretkey .secretkey-code{height: 20px;font-size: 12px;line-height: 20px;padding-left: 6px;padding-right: 6px;background-color: #E6EFFD; color: #333；}
.secretkey .secretkey-tips{display: flex;justify-content: center;position: relative; margin-left: 6px;}

.password, .google{background-color: #FFF; border-radius: 4px; box-shadow: 0 1px 3px #e2e2e2;}
.password-level{display: flex;justify-content: space-between;align-items: center;height: 80px;padding-left: 30px;padding-right: 30px; position: relative;}
.password-level.active::after {content: ''; position: absolute; left: 0;top: 0; right: 0; bottom: 0; background-color: #fff; z-index: 1;}
.password-level-left{font-size: 0;line-height: 0;}
.password-level-left img{margin-right: 50px;vertical-align: middle;}
.password-level-left .label{display: inline-block;height: 24px;margin-right: 50px;font-size: 14px;line-height: 24px;color: #261003;vertical-align: middle;}
.password-level-left .state{display: inline-block;width: 210px;height: 16px;vertical-align: middle;background-color: #F5F5F5;border-radius: 8px;}
.password-level-left .state span{display: block;height: 16px;font-size: 14px;line-height: 16px;color: #fff;text-align: center;border-radius: 8px;}
.password-level-left .state span.low{width: 70px;background-color: #FA4D4D;}
.password-level-left .state span.middle{width: 140px;background-color: #22AC38;}
.password-level-left .state span.high{width: 210px;background-color: #22AC38;}
.password-level-right input{min-width: 140px;height: 50px;padding: 0 30px;color: #fff;text-align: center;vertical-align: top;background-color: #0D66EF;border-radius: 4px;cursor: pointer;}
.password-level-right input:hover{background-color: #0a47a5;}

.google{margin-top: 8px;}
.google-content{display: flex;justify-content: space-between;align-items: center;height: 240px;padding-left: 30px;padding-right: 30px; position: relative;}
.google-content.active::after {content: ''; position: absolute; left: 0;top: 0; right: 0; bottom: 0; background-color: #fff; z-index: 1;}
.google-content-left{font-size: 0;line-height: 0;}
.google-content-left img{margin-right: 50px;vertical-align: middle;}
.google-content-left .label{display: inline-block;width: 140px;min-height: 24px;font-size: 14px;line-height: 24px;color: #261003;vertical-align: middle;}
.google-content-center .state{color: #261003;}
.google-content-center .bind-qrcode{float: left;width: 150px;height: 150px;padding: 10px;}
.google-content-center .bind-form{float: left;width: 200px;padding-left: 24px;}
.cellphone .google-content-center .bind-form{padding-left: 0;}
.google-content-center .bind-form p,
.google-content-center .unbind-form p{min-height: 24px;line-height: 24px;color: #261003;}
.google-content-center .bind-form input,
.google-content-center .unbind-form input{width: 190px;height: 22px;color: #333;vertical-align: top;background-color: transparent;border: 1px solid #9EC2F9;}
.google-content-center .bind-form input.error,
.google-content-center .unbind-form input.error{border-color: #e53f3f;}
.google-content-center .bind-form em.asterisk,
.google-content-center .unbind-form em.asterisk{position: relative;top: 5px;line-height: 0;font-size: 18px;color: #FA4D4D;}
.google-content-center .bind-form em.error,
.google-content-center .unbind-form em.error{display: block;height: 24px;font-size: 12px;color: #e53f3f;white-space: nowrap;}
.google-content-center button{width:120px;height:24px;padding: 0;color:#fff;background-color:#0D66EF;border-radius:3px;cursor:pointer;}
.google-content-center button:hover{background-color: #0a47a5;}
.google-content-center button.disabled,
.google-content-center button.disabled:hover{background-color:#999;color:#FFF;cursor:not-allowed;}
.google-content-right input{min-width: 140px;height: 50px;padding: 0px 30px;color: #fff;text-align: center;vertical-align: top;border-radius: 4px;background-color: #0D66EF;cursor: pointer;}
.google-content-right input:hover{background-color: #0a47a5;}
.google-content-right input.cancel{margin-top:4px;color:#666;background-color:transparent;border:1px solid #ccc;}
.google-content-right input.cancel:hover{color:#333;border-color:#bbb;}

.mobile{position:relative;}
.mobile /deep/ select{
  position:absolute;left:4px;top:0px;
  width: 120px;height:22px;padding-right: 20px;color: #d6dff9;z-index: 1;
  background-position: right 4px center;
}
.mobile /deep/ input{padding-left:126px;width:120px!important;}
</style>


