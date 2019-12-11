<template>
  <div class="wrap note_list">
    <p class="title">{{$t('public.notice')}}</p>
    <ul>
      <li @click="goDetail()">
        <p class="cont">biaoti</p>
        <span class="time">2018-02-12</span>
      </li>
      <li>
        <p class="cont">biaoti</p>
        <span class="time">2018-02-12</span>
      </li>
      <li>
        <p class="cont">biaoti</p>
        <span class="time">2018-02-12</span>
      </li>
      <li>
        <p class="cont">biaoti</p>
        <span class="time">2018-02-12</span>
      </li>
    </ul>
    <page/>
  </div>
</template>

<script>
  import Page from "../../components/page";

  export default {
    components: {Page},
    data() {
      return {}
    },
    created() {

    },
    methods: {
      goDetail(){
        this.$router.push({name: 'note_detail', query: {id: '123456789'}})
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
        }

        &:hover {
          background: #37342F;
        }
      }
    }
  }
</style>
