<template>
  <div class="sw">
    <div class="swiper">
      <span class="ico">
        <img src="../../assets/images/notice.png"/>
      </span>
      <swiper class="text" :options="swiperOption">
        <swiper-slide v-for="(item,index) in list" :key="index">
          <router-link :to="{name: 'note_detail', query: {id: item.cmsInfoId}}">{{getTitle(item)}}</router-link>
        </swiper-slide>
      </swiper>
      <span class="more">
        <router-link :to="{name: 'note_list'}">{{$t('exchange.advanced_more')}} >></router-link>
      </span>
    </div>
  </div>
</template>

<script>
  import market from '../../api/market'
  import {mapGetters} from 'vuex'

  export default {
    data() {
      return {
        list: [
          {id: '132456'},
          {id: 'asdas635465d'},
          {id: '132456asdf'},
        ],
        swiperOption: {
          direction: 'vertical',
          autoplay: {
            delay: 5000, // 自动切换的时间间隔，单位ms
          },
          speed: 500,
        }
      }
    },
    computed: {
      ...mapGetters(['getLang'])
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        market.getCmsList({firstLevel: 1, secondLevel: 1, page: 1, size: 20}, res => {
          this.list = res.filter(item => {
            return item.state !== 0
          }).slice(0, 5)
        })
      },
      getTitle(item) {
        let title = item.titleEn
        switch (this.getLang) {
          case 'zh-CN':
            title = item.titleCn
            break
          case 'cht':
            title = item.titleCht
            break
        }
        return title
      }
    }
  }
</script>

<style scoped lang="less">
  .sw {
    background: #262525;
  }

  .swiper {
    height: 40px;
    min-width: 1190px;
    max-width: 1360px;
    margin: 0 auto;
    margin-top: 20px;
    background: #202020;
    display: flex;
    align-items: center;
    padding: 7px 0;

    .text {
      height: 40px;
      line-height: 40px;
      flex: 1;

      a {
        color: #CBCBCB;
      }
    }

    .ico {
      margin: 0 15px;

      img {
        width: 26px;
      }
    }

    .more {
      padding: 0 10px;

      a {
        color: #BA8D35;
      }
    }
  }
</style>
