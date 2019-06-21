<template>
  <div class="cont">
    <p class="title">{{$t('shop.product_terms')}}</p>
    <p class="p">
      <router-link :to="{name: 'shop_pay', params: {total:totals}}">{{$t('shop.return_payment_page')}}</router-link>
    </p>
    <div class="box clause">
      <h4>{{$t('shop.card_terms')}}</h4>
      <p v-html="$t('shop.cart_term_contents')"></p>
    </div>
    <div class="box clause">
      <h4>{{$t('shop.hardware_terms')}}</h4>
      <p v-html="$t('shop.hardware_term_contents')"></p>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        totals: null
      }
    },
    created() {
      this.totals = this.$route.params.total;
    }
  }
</script>

<style scoped lang="less">
  @import "shop";
  .p{
    padding: 10px;
  }
</style>
