<template>
    <div class="shareImg">
        <div class="title">{{$t('referral.invite_friends')}}<!--邀请好友--><em class="icon-close" @click="closeDialog"></em></div>
        <div id="picture" >
            <img :src="image"/>
            <div class="code_p">
                <div ref="qrcode" class="qrcode"></div>
            </div>
        </div>
        <div class="shareBtn">
            <span @click="copyCode">{{$t('referral.copy')}}<!--复制--></span>
            <span @click="savePic()">{{$t('referral.download')}}<!--下载到桌面--></span>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import utils from '@/assets/js/utils'
import html2canvas from 'html2canvas'
import Vue from 'vue'
import en from '@/assets/images/invite/poster-en.jpg'
import zhCN from '@/assets/images/invite/poster-zhcn.jpg'
import CHT from '@/assets/images/invite/poster-cht.jpg'
const copyText = (str) => {
  var save = function (e) {
    e.clipboardData.setData('text/plain', str)
    e.preventDefault()
  }
  document.addEventListener('copy', save)
  document.execCommand('copy')
  document.removeEventListener('copy', save)
}
export default {
  created () {
    this.$nextTick(() => {
      utils.qrcode(this.$refs.qrcode, {
        text: this.getUserInfo.myInvitationUrl,
        width: 100,
        height: 100
      })
    })
  },
  computed: {
    ...mapGetters(['getUserInfo', 'getLang']),
    image () {
      if (this.getLang === 'zh-CN') {
        return zhCN
      } else if (this.getLang === 'cht') {
        return CHT
      } else {
        return en
      }
    }
  },
  methods: {
    closeDialog () {
      this.$emit('removeDialog')
    },
    copyCode () {
      Vue.$koallTipBox({icon: 'success', message: this.$t('public0.public33')}) // 复制成功
      copyText(this.getUserInfo.myInvitationUrl)
    },
    savePic () {
      html2canvas(document.getElementById('picture')).then(canvas => {
        var imgUri = canvas.toDataURL('image/png')
        let a = document.createElement('a')
        a.href = imgUri
        a.download = Date.now() + '.png'
        a.click()
      })
    }
  }
}
</script>

<style scoped>
.shareImg{width: 630px;background: #394363;text-align: center;}
.shareImg .title{font-size: 18px;color: #cbd4ec;background: #252a40; padding-left: 30px;padding-right: 30px; height: 50px;line-height: 50px;display: flex;justify-content: space-between;}
.shareImg .title em{line-height: 52px;cursor: pointer;}
.shareImg img{margin: 0 auto;width: 333px;}
.shareImg .code_p .qrcode>img{width: 88px;}
.shareBtn {width: 333px; margin: 20px auto;text-align: center;display: flex;justify-content: space-between; }
.shareBtn span{display: inline-block;width: 135px;height: 30px;line-height: 30px;text-align: center;background: #fdb902;color: #fff;cursor: pointer;border-radius: 5px;}
.qrcode{width: 100px;height: 100px;background-color: #fff;position: absolute;top: -223px;left: 26px;border-radius: 4px;padding: 5px;}
.qrcode >img {width: 88px;height: 88px; }
.code_p{position: relative;}
.code_p .qrcode>img{width: 100px;height: 100px;}
#picture{width: 333px;height: 593px;margin: 0 auto;margin-top: 20px;}
</style>

