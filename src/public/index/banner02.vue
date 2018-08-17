<template>
    <div class="banner">
        <router-link :to="{name:'otc_index'}">
            <img :src="image1" style="" />
        </router-link>
        <a href="javascript:;" target="_blank">
            <img :src="image3"/>
        </a>
        <a href="javascript:;" target="_blank">
            <img :src="image2"/>
        </a>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
import otcEN from '@/assets/images/home/banner-otc-en.png'
import otcZH from '@/assets/images/home/banner-otc-zh.png'
import forumZHCN from '@/assets/images/home/banner-forum-zh-cn.png'
import forumZHTW from '@/assets/images/home/banner-forum-zh-tw.png'
import forumEN from '@/assets/images/home/banner-forum-en.png'
import newEN from '@/assets/images/home/banner-new-en.png'
import newZH from '@/assets/images/home/banner-new-zh.png'
export default {
  computed: {
    ...mapGetters(['getLang']),
    image1 () {
      if (this.getLang === 'zh-CN' || this.getLang === 'cht') {
        return otcZH
      } else {
        return otcEN
      }
    },
    image2 () {
      if (this.getLang === 'zh-CN') {
        return forumZHCN
      } else if (this.getLang === 'cht') {
        return forumZHTW
      } else {
        return forumEN
      }
    },
    image3 () {
      if (this.getLang === 'zh-CN' || this.getLang === 'cht') {
        return newZH
      } else {
        return newEN
      }
    }
  }
}
</script>

<style scoped>
.banner{display: flex;justify-content: space-between;width: 100%;}
.banner /deep/ img{height: 225px;width: 380px;}
</style>
