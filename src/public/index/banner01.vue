<template>
    <div class="banner">
        <router-link :to="{name: 'exchange_index2'}">
            <img :src="image"/>
        </router-link>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
import banner from '@/assets/images/home/banner.png'
export default {
  computed: {
    ...mapGetters(['getLang']),
    image () {
      return banner
    }
  }
}
</script>

<style scoped>
.banner{display: flex;justify-content: space-between;width: 100%;height:100%;}
.banner /deep/ a{display:block;width:100%;height:100%;}
.banner /deep/ img{width:100%;}
</style>
