<template>
  <div class="wrap note_list">
    <p class="title">{{$t('public.notice')}}</p>
    <ul>
      <li v-for="item in list" @click="goDetail(item.cmsInfoId)">
        <p class="cont">{{getTitle(item)}}</p>
        <span class="time">{{new Date(item.createdAt).format('yyyy-MM-dd')}}</span>
      </li>
    </ul>
    <div class="no_data" v-if="nodata">
      <p>
        <img width="240px" src="../../assets/images/noData.png"/>
      </p>
      <p>NO DATA</p>
    </div>
    <page  v-if="list.length"/>
    <loading v-show="loading"/>
  </div>
</template>

<script>
  import Page from '../../components/page'
  import market from '../../api/market'
  import {mapGetters} from 'vuex'
  import Loading from '../../components/loading'

  export default {
    components: {Loading, Page},
    data() {
      return {
        list: [],
        total: 0,
        loading: false,
        nodata: false
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
        this.loading = true
        market.getCmsList({firstLevel: 1, secondLevel: 1, page: 1, size: 20}, (res, total) => {
          this.list = res.filter(item => {
            return item.state !== 0
          })
          this.total = total
          this.loading = false
          this.nodata = !this.list.length
        },msg=>{
          this.loading = false
          this.nodata = true
        })
      },
      goDetail(id) {
        this.$router.push({name: 'note_detail', query: {id: id}})
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
    }
    .no_data{
      color: #5a5a5a;
      font-size: 20px;
      text-align: center;
      line-height: 30px;
      img{
        opacity: 0.6;
        margin-top: 40px;
      }
    }

    ul {
      li {
        border-bottom: 1px solid #37342F;
        padding: 12px 20px;
        background: #272626;
        transition: 0.3s;
        cursor: pointer;
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 16px;

        .time {
          color: #d6cfc6;
          width: 120px;
          text-align: right;
        }

        .cont {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        &:hover {
          background: #37342F;
        }
      }
    }
  }
</style>
