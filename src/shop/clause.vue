<template>
  <div class="cont">
    <p class="title">{{$t('shop.product_terms')}}</p>
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
        name: "clause"
    }
</script>

<style scoped lang="less">
@import "shop";
</style>
