<template>
    <div class="banner">
        <router-link :to="{name: 'exchange_index2'}">
            <img :src="image"/>
        </router-link>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
import en from '@/assets/images/home/banner-home-en.png'
import zhCN from '@/assets/images/home/banner-home-zh-cn.png'
import CHT from '@/assets/images/home/banner-home-zh-tw.png'
export default {
  computed: {
    ...mapGetters(['getLang']),
    image () {
      if (this.getLang === 'zh-CN') {
        return zhCN
      } else if (this.getLang === 'cht') {
        return CHT
      } else {
        return en
      }
    }
  }
}
</script>

<style scoped>
.banner{display: flex;justify-content: space-between;width: 100%;}
.banner /deep/ img{width:100%;height:225px;}
</style>
