<template>
  <div class="sw">
    <swiper  class="swiper" :options="swiperOption">
      <swiper-slide v-for="(item,index) in banners" :key="index">
        <router-link :to="{name: 'note_detail', query: {id: item.id}}">{{item.id}}</router-link>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        banners: [
          {id: '132456'},
          {id: 'asdas635465d'},
          {id: '132456asdf'},
        ],
        swiperOption:{
          autoplay: {
            delay: 15000, // 自动切换的时间间隔，单位ms
          },
          speed: 500,
        }
      }
    },
    created() {

    },
    methods: {}
  }
</script>

<style scoped lang="less">
  .sw{
    background: #262525;
  }
.swiper{
  height: 30px;
  min-width: 1190px;
  max-width: 1360px;
  margin: 0 auto;
  margin-top: 20px;
  background: #202020;
}
</style>
