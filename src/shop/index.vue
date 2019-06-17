<template>
  <div class="cont">
    <p class="title">产品</p>
    <div class="box">
      <ul class="box_left">
        <li v-for="data in productList">
          <span class="pic">
            <img :src="baseURL+data.coverImgPath">
          </span>
          <div>
            <h2>{{data.productName}}</h2>
            <p>${{data.discountPrice}}</p>
            <span>{{data.parameters}}</span>
            <button @click="add(data)">加入购物车</button>
          </div>
        </li>
      </ul>
      <div class="box_right">
        <div class="no_shop" v-if="!payCar.length">
          <p style="text-align: center"><img src="../assets/images/noShop.jpg" alt=""></p>
          <h4>购物车空空如也</h4>
          <h4>立即购物</h4>
        </div>
        <div class="shop_list" v-if="payCar.length">
          <h1>购物车</h1>
          <div class="list_box">
            <shop-list v-for="item in payCar"
                       :item="item"
                       @add="addList"
                       @del="del"></shop-list>
          </div>
          <div class="pay_radio">
            <h1>支付方式：</h1>
            <p class="pay">
              <label v-for="item in payList">
                <span>
                  <input type="radio" name="pay" v-model="pay" :value="item">
                  <img :src="pay === item ? checked:unCheck">
                </span>
                {{item}}
              </label>
            </p>
          </div>
          <div class="amout">
            <h1>总额</h1>
            <span>100 BTC</span>
          </div>
          <button @click="next()">继续</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import shopList from '../components/shop_list'
  import checked from '../assets/images/checked.png'
  import no from '../assets/images/nomorl.png'
  import Vue from 'vue'
  import shops from '../api/shops'
  import config from '../assets/js/config'

  export default {
    name: 'shop',
    components: {shopList},
    data() {
      return {
        pay: null,
        checked: checked,
        unCheck: no,
        payList: ['SATO', 'USSD', 'BTC', 'ETH'],
        productList: [],
        payCar: [],
        baseURL: config.origin
      }
    },
    watch: {
      payCar() {
        console.log(this.payCar)
        window.localStorage.payCarList = JSON.stringify(this.payCar)
      },
      pay() {
        window.localStorage.pay = this.pay
      }
    },
    created() {
      this.pay = window.localStorage.pay || 'SATO';
      let f = window.localStorage.payCarList;
      f = JSON.parse(f);
      if (f === 'undefined' || f === null || f === undefined || f === '') {
        this.payCar = []
      } else {
        this.payCar = f;
      }
      shops.productList((res) => {
        console.log(res)
        this.productList = res.data;
      })
    },
    methods: {
      add(data) {
        this.payCar.push(data);
        let k = 0
        this.payCar.filter((res, i) => {
          if (res.productId === data.productId) {
            if (k > 0) {
              this.payCar.splice(i, 1)
              console.warn('只能添加一件')
              Vue.$koallTipBox({icon: 'notification', message: '只能添加一件'})
              return
            } else {
              k++
            }
          }
        })
      },
      addList() {
        Vue.$koallTipBox({icon: 'notification', message: '只能添加一件'})
      },
      del(item) {
        this.payCar.filter((res, i) => {
          if (res.productId === item.productId) {
            this.payCar.splice(i, 1)
          }
        })
      },
      next() {
        this.$router.push({name: 'shop_pay'})
      }
    }
  }
</script>

<style scoped lang="less">
  @import "shop";
</style>
