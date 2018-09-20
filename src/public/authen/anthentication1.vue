<template>
    <div class="authencation1">
        <form ref="form" onsubmit="return false">
            <div class="form-summary">
                <p>{{$t('public0.public200')}}<!--个人身份证--></p>
                <p>{{$t('account.user_prompt9')}}<!--请确保您使用本人的真实身份进行认证，我们会保护您的个人信息安全。--></p>
            </div>
            <div class="form-row">
                <label class="row-label">{{$t('public0.public77')}}<!--姓名--><em class="asterisk">&nbsp;*</em></label>
                <input class="row-text" :class="{error: getError('firstName')['isError']}" type="text" name="firstName" v-validate="'required'" maxlength="128" autocomplete="off"/>
                <span class="row-error">{{getError('firstName')['value']}}</span>
            </div>
            <div class="form-row">
                <label class="row-label">{{$t('public0.public79')}}<!--身份证号--><em class="asterisk">&nbsp;*</em></label>
                <input class="row-text" :class="{error: getError('idNumber')['isError']}" type="text" name="idNumber" v-validate="'required'" maxlength="18" autocomplete="off"/>
                <span class="row-error">{{getError('idNumber')['value']}}</span>
            </div>
            <div class="form-row">
                <label class="row-label">{{$t('public0.public80')}}<!--本人身份证正面照--><em class="asterisk">&nbsp;*</em></label>
                <div class="row-file">
                    <div class="row-file-img" :class="{error: getError('front')['isError']}">
                        <img :src="image.front" alt=""/>
                    </div>
                    <div class="row-file-input">
                        <input type="hidden" v-model="value.front" v-validate="'required'" data-vv-name="front"/>
                        <input type="file" data-key="1" title=" " v-show="isShowUpload.front" @change="uploadImage($event, 'front')"/>
                        <input type="file" data-key="2" title=" " v-show="!isShowUpload.front" @change="uploadImage($event, 'front')"/>
                    </div>
                    <div class="row-file-prompt" :class="{error: getError('front')['isError']}">{{getError('front')['value']}}</div>
                </div>
                <div class="row-description">{{$t('public0.public81')}}<!--请确保照片内容完整并清晰可见，仅支持JPG、PNG、JPEG、BMP图片格式。--></div>
            </div>
            <div class="form-row">
                <label class="row-label">{{$t('public0.public83')}}<!--本人身份证背面照--><em class="asterisk">&nbsp;*</em></label>
                <div class="row-file">
                    <div class="row-file-img" :class="{error: getError('back')['isError']}">
                        <img :src="image.back" alt=""/>
                    </div>
                    <div class="row-file-input">
                        <input type="hidden" v-model="value.back" v-validate="'required'" data-vv-name="back"/>
                        <input type="file" data-key="1" title=" " v-show="isShowUpload.back" @change="uploadImage($event, 'back')"/>
                        <input type="file" data-key="2" title=" " v-show="!isShowUpload.back" @change="uploadImage($event, 'back')"/>
                    </div>
                    <div class="row-file-prompt" :class="{error: getError('back')['isError']}">{{getError('back')['value']}}</div>
                </div>
                <div class="row-description">{{$t('public0.public84')}}<!--请确保照片内容完整并清晰可见，身份证必须在有效期内，仅支持JPG、PNG、JPEG、BMP图片格式。--></div>
            </div>
            <div class="form-row">
                <label class="row-label">{{$t('public0.public85')}}<!--本人手持身份证照--><em class="asterisk">&nbsp;*</em></label>
                <div class="row-file">
                    <div class="row-file-img" :class="{error: getError('hand')['isError']}">
                        <img :src="image.hand" alt=""/>
                    </div>
                    <div class="row-file-input">
                        <input type="hidden" v-model="value.hand" v-validate="'required'" data-vv-name="hand"/>
                        <input type="file" data-key="1" title=" " v-show="isShowUpload.hand" @change="uploadImage($event, 'hand')"/>
                        <input type="file" data-key="2" title=" " v-show="!isShowUpload.hand" @change="uploadImage($event, 'hand')"/>
                    </div>
                    <div class="row-file-prompt" :class="{error: getError('hand')['isError']}">{{getError('hand')['value']}}</div>
                </div>
                <div class="row-description">{{$t('public0.public86').format('NEWTON')}}<!--请您上传一张手持身份证及写有“NEWTON”和当天日期的卡片的照片。请确保头像、身份证信息、卡片上NEWTON和当天日期内容清晰可见。--></div>
            </div>
            <div class="form-button">
                <input class="cancel" type="button" :value="$t('otc_legal.otc_legal_cancel')" @click="switch_tab('mycenter')"><!--取消-->
                <input class="confirm" :class="{disabled: isSubmit}" type="button" :value="$t('exchange.exchange_determine')" @click="isSubmit ? false : identity1()"><!--确定-->
            </div>
        </form>
        <uploading v-if="isUploading"/>
    </div>
</template>

<script>
import Vue from 'vue'
import myApi from '@/api/individual'
import utils from '@/assets/js/utils'
import config from '@/assets/js/config'
import uploading from '@/components/uploading'
import diagramFront from '@/assets/images/sfzzm.png'
import diagramBack from '@/assets/images/sfzbm.png'
import diagramHand from '@/assets/images/scsfz.png'
export default {
  components: {
    uploading
  },
  data () {
    return {
      value: {
        firstName: null,
        idNumber: null,
        front: null,
        back: null,
        hand: null
      },
      image: {
        front: diagramFront,
        back: diagramBack,
        hand: diagramHand
      },
      isShowUpload: {
        front: true,
        back: true,
        hand: true
      },
      isUploading: false,
      isSubmit: false
    }
  },
  computed: {
    prompts () {
      return {
        firstName: {required: this.$t('public0.public88')}, // 请输入姓名
        idNumber: {required: this.$t('public0.public89')}, // 请输入身份证号码
        front: {required: this.$t('public0.public90')}, // 未选择文件
        back: {required: this.$t('public0.public90')}, // 未选择文件
        hand: {required: this.$t('public0.public90')} // 未选择文件
      }
    }
  },
  methods: {
    switch_tab (tab) {
      this.$emit('switchTab', tab)
    },
    getError (name) {
      if (this.errors.has(name)) {
        return {
          isError: true,
          value: this.prompts[name][this.errors.firstRule(name)] || this.$t(this.errors.first(name))
        }
      } else {
        return {
          isError: false,
          value: name in this.image ? (this.value[name] ? null : this.$t('public0.public82')) : null
        }
      }
    },
    uploadImage (event, propertyName) {
      let isTrue = false
      if (config.imageType.test(event.target.value)) {
        isTrue = utils.limitUploadImage(event.target, (msg) => {
          Vue.$koallTipBox({icon: 'notification', message: this.$t(msg)}) // 图片不能超过2M
        }, 2)
      } else {
        isTrue = false
        Vue.$koallTipBox({icon: 'notification', message: this.$t('public0.public43')}) // 请上传JPG、PNG、JPEG、BMP格式的图片
      }
      if (isTrue) {
        this.value[propertyName] = this.image[propertyName] = window.URL.createObjectURL(event.target.files[0])
        event.target.name = propertyName
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
    identity1 () {
      this.$validator.validateAll().then((res) => {
        if (!res) {
          return
        }
        this.isUploading = true
        setTimeout(() => {
          var formData = new FormData(this.$refs.form)
          formData.append('countryClass', '1')
          myApi.submitIdentityInfo(formData, (msg) => {
            this.isUploading = false
            this.isSubmit = true
            Vue.$confirmDialog({
              id: 'verify_submit_success',
              width: 400,
              title: this.$t('error_code.SUBMIT_SUCCESS'),
              showCancel: false,
              content: this.$t('public0.public160'), // 您已经提交了实名认证材料（每人仅有三次KYC机会），请耐心等待审核结果。审核结果将第一时间在站内消息中进行通知。
              okCallback: () => {
                this.$emit('switchTab', 'mycenter')
              }
            })
          }, (msg) => {
            this.isUploading = false
            Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
          })
        }, 1500)
      })
    }
  }
}
</script>

<style scoped>
.authencation1{padding: 10px 8px 40px 8px;}
.form-summary{padding-bottom: 10px}
.form-summary p{min-height: 30px;line-height: 30px;color: #becbe8;}
.form-row{padding-bottom: 10px;overflow: auto;}
.form-row .row-label{float: left;width: 150px;min-height: 30px;padding-right: 10px;line-height: 30px;color: #becbe8;}
.form-row .row-label em.asterisk{position: relative;top: 5px;line-height: 0;font-size: 18px;color: #fdb902;}
.form-row .row-text{float: left;width: 290px;height: 28px;color: #261003;background-color: #FFF;border: 1px solid #505e83;}
.form-row .row-text.error{border-color: #e53f3f;}
.form-row .row-error{float: left;height: 30px;line-height: 30px;color: #e53f3f;text-indent: 10px;}
.form-row .row-file{position: relative;float: left;width: 140px;}
.form-row .row-file-img{width: 138px;height: 138px;border: 1px solid #505e83;}
.form-row .row-file-img.error{border-color: #e53f3f;}
.form-row .row-file-img /deep/ img{width: 100%;height: 100%;}
.form-row .row-file-input{position: absolute;top: 0;left: 0;width: 140px;height: 140px;}
.form-row .row-file-input input{width: 100%;height: 100%;opacity: 0;cursor: pointer;}
.form-row .row-file-prompt{height: 30px;line-height: 30px;color: #becbe8;white-space: nowrap;}
.form-row .row-file-prompt.error{color: #e53f3f;}
.form-row .row-description{float: left;width: 674px;min-height: 30px;padding-left: 10px;line-height: 30px;color: #becbe8;}
.form-button{font-size: 0;line-height: 0;padding-left: 160px;}
.form-button input{min-width: 100px;height: 30px;padding-left: 24px;padding-right: 24px;border-radius: 4px;cursor: pointer;}
.form-button input.cancel{margin-right: 30px;color: #fdb902;background-color: transparent;border: 1px solid #fdb902;}
.form-button input.cancel:hover{color: #fdb902;border-color: #fdb902;}
.form-button input.confirm{color: #261003;background-color: #fdb902;}
.form-button input.confirm:hover{background-color: #fdb902;}
.form-button input.confirm.disabled{background-color: #999;cursor: not-allowed}
.form-button input.confirm.disabled:hover{background-color: #999;}
</style>

