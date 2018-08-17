<template>
    <div class="feed">
        <div class="top">
            <a class="icon-close"  @click="closeDialog"></a>
        </div>
        <div class="cont">
            <div class="description">
                <p>{{$t('feedback.feedback_text1')}}<!--欢迎反馈问题，您的意见与建议就是我们的动力！--></p>
                <p>{{$t('feedback.feedback_text2').format(100, 'BARK')}}<!--如果您的建议被采纳我们将奖励您100个Bark币--></p>
            </div>
            <div class="description">
                <span>{{$t('feedback.feedback_text3')}}<!--我们会认真查阅您反馈的每一个问题，并尽快给您答复。--></span>
                <span>{{$t('feedback.feedback_text4')}}<!--在这里您可以提出遇到的问题也可以发表自己的建议和想法。--></span>
            </div>
            <div class="qustion">{{$t('feedback.feedback_text5')}}<!--问题与建议描述-->：</div>
            <div style="position:relative;">
                <textarea v-model="content" :class="{error:errors.has('content')}" v-validate="'required'" name="content"></textarea>
                <em class="error" v-if="errors.has('content')">{{$t('public0.public74')}}<!--请输入内容--></em>
            </div>
            <div class="btn">
                <input type="reset" :value="$t('account.user_cancel')" @click="closeDialog"/><!--取消-->
                <input type="submit" :value="$t('account.user_submit')" @click="submit"/><!--提交-->
            </div>
        </div>
    </div>
</template>
<script>
import Vue from 'vue'
import otcApi from '@/api/otc'
export default {
  data () {
    return {
      content: ''
    }
  },
  watch: {
    content (newValue) {
      if (newValue.length > 200) {
        this.content = newValue.substring(0, 200)
      }
    }
  },
  methods: {
    closeDialog () {
      this.$emit('removeDialog')
    },
    submit () {
      this.$validator.validateAll().then((validResult) => {
        if (!validResult) {
          return
        }
        otcApi.createFeedback({description: this.content}, (msg) => {
          this.closeDialog()
          Vue.$koallTipBox({icon: 'success', message: this.$t(`error_code.${msg}`)})
        }, (msg) => {
          Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
        })
      })
    }
  }
}
</script>
<style scoped>
textarea{border:1px solid #eee;}
textarea:focus{border-color:#11a8fe;}
textarea.error{border-color:#ff0000!important;}
em.error{position:absolute;color:#ff0000;left:0;bottom:-16px;}
.feed{width: 400px;min-height: 520px;background-color: #fff;}
.feed .top{width: 100%; height: 35px;}
.feed .top .icon-close{float: right;margin: 17px 17px 0 0;text-decoration: none;font-size: 18px;color: #999;cursor: pointer;}
.feed .cont{margin:20px;}
.feed .cont .description{margin-bottom: 10px;}
.feed .cont .description p{font-size: 14px;color: #333;font-weight: bold;line-height: 20px;}
.feed .cont .description span{font-size: 12px;color: #787878;display: block;}
.feed .cont .qustion{margin-bottom: 10px;}
.feed .cont .icon-bt{position:relative;zoom:1;height:25px;}
.feed .cont .icon-bt span{display: inline-block;cursor: pointer;font-size: 14px;color: #00a0e9;}
.feed .cont .icon-bt input{position: absolute;left: 0;top: 0;cursor: pointer;height: 32px;width: 98px;opacity: 0;}
.feed .cont input[type="file"]{margin-bottom: 8px;}
.feed .cont textarea{width:352px;height: 254px;background-color: #eeeeee;resize: none;}
.feed .cont .btn{text-align: right;margin-top:10px;}
.feed .cont .btn input{display: inline-block;width:100px;height: 24px;text-align:center;cursor: pointer;}
.feed .cont .btn input[type="submit"]{background-color: #00a0e9;color: #fff;}
.feed .cont .btn input[type="reset"]{background-color: #c7c7c7;color: #fff;}
</style>

