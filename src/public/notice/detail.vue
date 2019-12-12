<template>
  <div class="wrap">
    <p class="title">
      {{$t('public.notice')}}
      <small @click="back()">{{$t('public0.public11')}}</small>
    </p>
    <div class="cont">
      <h4 class="title" v-html="title"></h4>
      <small class="small" v-html="small"></small>
      <div class="detail_cont" v-html="data"></div>
    </div>
  </div>
</template>

<script>
  import market from '../../api/market'
  import {mapGetters} from 'vuex'

  export default {
    data() {
      return {
        data: null,
        title: null,
        small: null,
        id: null
      }
    },
    computed: {
      ...mapGetters(['getLang'])
    },
    watch: {
      '$route'(e) {
        this.getDetail()
      },
      getLang() {
        this.getDetail()
      }
    },
    created() {
      this.getDetail()
    },
    methods: {
      getDetail() {
        this.id = this.$route.query.id
        market.getCmsDetail(this.id, res => {
          if (this.getLang === 'zh-CN') {
            this.data = res.bodyCn
            this.title = res.titleCn
            this.small = new Date(res.updatedAt).format()
          } else {
            this.data = res.bodyEn
            this.title = res.titleEn
            this.small = new Date(res.updatedAt).format()
          }
        })
      },
      back() {
        this.$router.back()
      }
    }
  }
</script>

<style scoped lang="less">
  .wrap {
    min-width: 1190px;
    max-width: 1360px;
    margin: 40px auto;

    .title {
      height: 40px;
      background: #000;
      padding: 6px 20px;
      line-height: 40px;
      font-size: 16px;
      color: #BA8D35;
      display: flex;
      align-items: center;
      justify-content: space-between;

      small {
        cursor: pointer;
      }
    }

    .cont {
      background: #292828;
      padding: 20px;
      &>.title{
        font-size: 18px;
        text-align: center;
        line-height: 34px;
        color: #e9e9e9;
      }
      &>.small{
        text-align: center;
        display: block;
        padding: 10px;
      }
    }
  }
</style>
