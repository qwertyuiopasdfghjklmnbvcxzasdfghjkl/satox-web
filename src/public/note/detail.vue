<template>
  <div class="wrap">
    <p class="title">
      {{$t('public.notice')}}
      <small @click="back()">{{$t('public0.public11')}}</small>
    </p>
    <div class="cont">
      <p></p>
      <div></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "detail",
    data() {
      return {}
    },
    created() {

    },
    methods: {
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
      small{
        cursor: pointer;
      }
    }

    .cont {
      background: #292828;
      padding: 20px;
    }
  }
</style>
