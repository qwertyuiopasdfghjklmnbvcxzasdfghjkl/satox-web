<template>
  <div class="dialog">
      <div class="top">
        <div class="title">{{$t('business.MERCHANT_APPLICATION')}}<!--商家申请--></div>
        <a class="icon-close" href="javascript:;" @click="closeDialog"></a>
      </div>
      <div class="form">
        <inputbox v-validate="'required|telphone'" type="number" name="mobile" :maxLength="11" :msgs="msgs.mobile" :errs="errors" v-model="formData.mobile" :title="$t('business.MOBILE')+'：'" :placeholder="$t('public0.public287')+$t('business.MOBILE')" /><!--手机号-->
        <inputbox v-validate="'required'" type="text" name="wxacount" :msgs="msgs.wxacount" :errs="errors" v-model="formData.wechat" :title="$t('business.WECHAT')+'：'" :placeholder="$t('public0.public287')+$t('business.WECHAT')" /><!--微信号码-->
        <inputbox v-validate="'required'" type="number" name="qqacount" :msgs="msgs.qqacount" :errs="errors" v-model="formData.qq" :title="$t('business.QQ')+'：'" :placeholder="$t('public0.public287')+$t('business.QQ')" /><!--QQ号码-->
        <inputbox v-validate="'required|email'" type="text" name="email" :msgs="msgs.email" :errs="errors" v-model="formData.email" :title="$t('business.EMAIL')+'：'" :placeholder="$t('public0.public287')+$t('business.EMAIL')" /><!--EMAIL地址-->
        <div class="choose_community">
          <div class="title">{{$t('business.CHOOSE_COMMUNITY')+'：'}}</div>
          <div class="inputdiv">
            <select v-validate="'required'" name="community" class="select" :class="{error:hasSub&&formData.community===''}" v-model="formData.community">
              <option v-for="item of communities" :value="item.communityId">{{item.communityName}}</option>
            </select>
            <em class="errorinfo" v-if="hasSub&&formData.community===''">{{msgs.community}}</em>
          </div>
        </div>
        <div class="checkbox-group clearfix">
            <i :class="[checked?'icon-checkbox-checked':'icon-checkbox-unchecked']" @click="checked=!checked"></i>
            <span>
              <em @click="checked=!checked">{{$t('login_register.agree_Service')}}<!--我已阅读并同意--></em>
              <a :href="getAgreementUrl" target="_blank">{{$t('login_register.bitark_service').format('OTC')}}<!--CDCC服务条款--></a>
            </span>
        </div>
        <div class="btn-apply"><buttonbox :height="40" :width="350" :text="$t('business.APPLY')" @click="apply"/><!--确定--></div>
      </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import inputbox from '@/components/formel/inputbox_horizontal'
import buttonbox from '@/components/formel/buttonbox'
import otcApi from '@/api/otc'
import shopsApi from '@/api/shops'
import utils from '@/assets/js/utils'
export default {
  components: {
    inputbox,
    buttonbox
  },
  data () {
    return {
      locked: false,
      checked: false,
      hasSub:false,
      formData: {
        mobile: '',
        wechat: '',
        qq: '',
        email: '',
        community:''
      },
      communities:[
        {communityId:'', communityName:this.$t('business.CHOOSE_YOUR_COMMUNITY')}
      ]
    }
  },
  computed: {
    ...mapGetters(['getLang']),
    msgs () {
      return {
        mobile: {required: this.$t('public0.public287')+this.$t('business.MOBILE')}, // 请输入手机号
        wxacount: {required: this.$t('public0.public287')+this.$t('business.WECHAT')}, // 请输入微信号码
        qqacount: {required: this.$t('public0.public287')+this.$t('business.QQ')}, // 请输入QQ号码
        email: {required: this.$t('login_register.email'), email: this.$t('exchange.exchange_Email_format_error')}, // 请输入邮箱||邮箱格式错误
        community:this.$t('business.CHOOSE_YOUR_COMMUNITY'), // 请选择社区
      }
    },
    getAgreementUrl () {
      if (this.getLang === 'zh-CN' || this.getLang === 'cht') {
        return 'https://cdcc.kf5.com/hc/kb/article/1225857/'
      } else {
        return 'https://cdcc.kf5.com/hc/kb/article/1225857/'
      }
    }
  },
  created(){
    shopsApi.getShopsCommunity(res=>{
      this.communities = this.communities.concat(res.data)
    })
  },
  methods: {
    apply () {
      let self = this
      this.hasSub = true
      this.$validator.validateAll().then((validResult) => {
        if (!validResult) {
          return
        }
        if(this.formData.community===''){
          return
        }
        if (!this.checked) {
          Vue.$koallTipBox({icon: 'notification', message: this.$t('public0.public122')})
          return
        }
        if (this.locked) {
          return
        }
        this.locked = true
        for(let item of this.communities){
          if(this.formData.community===item.communityId){
            this.formData.community = item.communityName
            break
          }
        }
        shopsApi.postShopsApply(this.formData, res=>{
          this.locked = false
          Vue.$koallTipBox({icon: 'success', message: this.$t('business.APPLY_SUCCESSFUL')})
          self.$emit('okCallback')
          self.$emit('removeDialog')
        },msg=>{
          this.locked = false
          Vue.$confirmDialog({
            id:msg,
            title:this.$t(`business.APPLY_FAILED`),
            content:this.$t(`error_code.${msg}`),
            okCallback(){
              self.$emit('removeDialog')
              if(msg==='MOBILE_AUTH_FIRST'){
                location.href='/#/mycenter/safety'
              } else if(msg==='KYC_AUTH_FIRST'){
                location.href='/#/mycenter/authentication'
              } else if(msg==='NO_PAY_TYPE'){
                location.href='/#/mycenter/settings'
              } 
            }
          })
        })
      })
    },
    closeDialog () {
      this.$emit('removeDialog')
    }
  }
}
</script>

<style scoped>
.choose_community {display: flex;}
.choose_community .title{flex: 2;}
.choose_community .select{flex: 5;}

.dialog{width:450px;height:auto;min-height:200px;display:flex;justify-content:center;flex-flow:column;background-color: #fff; border-top-left-radius: 10px; border-top-right-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px #5d5d5d;}
.top{height: 45px;line-height: 45px;color: #fff;font-size: 18px;  text-align: center;background-color: #0D66EF; position: relative;}
.icon-close{position:absolute;text-decoration:none;font-size:14px;color:#fff;top:calc(50% - 7px);right:15px; opacity: 0.8;}
.icon-close:hover{opacity: 1;}
.form {padding: 20px 50px;}
.form /deep/ .inputbox{width: auto !important;min-height: auto !important;}
.form /deep/ .title{height: 34px;line-height: 34px;font-size: 14px;color: #000;text-align: left;}
.form /deep/ .inputdiv{position: relative;display: block;padding-bottom: 24px; flex: 5;}
.form /deep/ .input{
  width: 100% !important; box-sizing: border-box; height: 40px;margin: 0;font-size: 14px;line-height: normal;
  color: #555;background-color: #F5F5F5; border: 1px solid #F5F5F5;outline: none; padding-left: 15px; padding-right: 15px; border-radius: 4px;
}
.form /deep/ .input:focus{background-color: #F5F5F5; border-color:#3A76E7!important;}
.form /deep/ .input.error{background-color: #F5F5F5;border-bottom-color: #e53f3f;}
.form /deep/ .errorinfo{position: absolute;bottom: 0;left: 0;width: auto;height: 24px;padding-top: 0;color: #e53f3f;font-style: normal;line-height: 24px;white-space: nowrap;}
.form /deep/ .select {
    width: 100%;
    box-sizing: border-box;
    height: 40px;
    margin: 0;
    font-size: 14px;
    line-height: normal;
    color: #555;
    background-color: #F5F5F5;
    border: 1px solid #F5F5F5;
    outline: none;
    padding-left: 15px;
    padding-right: 15px;
    border-radius: 4px;
    background-image: url('../../assets/images/arrow-down-white.png');
    background-size: contain;
}
.form /deep/ .select.error {border-color:#e53f3f;}
.form /deep/ .select:hover, .form /deep/ .select:focus{background-color: #F5F5F5; border-color:#3A76E7;background-image: url('../../assets/images/arrow-down-white-hover.png')}

.checkbox-group{overflow: auto;}
.checkbox-group i{float: left;width: 14px;height: 14px;margin-top: 8px;color: #3283FF;text-indent: 1px;cursor: pointer;}
.checkbox-group i:hover{color: #2565c5;}
.checkbox-group span{float: left;min-height: 30px;padding-left: 8px;line-height: 30px;}
.checkbox-group span em{color: #999999;}
.checkbox-group span a{color: #3A76E7;text-decoration: underline;}
.checkbox-group span a:hover{color: #3A76E7;}

.form .btn-apply {text-align: center; margin-top: 20px; padding-bottom: 20px;}
.form .btn-apply /deep/ .button {display: inline-block;}
</style>
