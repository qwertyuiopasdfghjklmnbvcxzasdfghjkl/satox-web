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
            <span>{{data.productDescription}}</span>
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
            <span>{{total}} {{pay}}</span>
          </div>
          <!--GET /order-->
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
        baseURL: config.origin,
        total: null,
        amount: null,
        $btc: null,
        $eth: null
      }
    },
    watch: {
      payCar() {
        console.log(this.payCar)
        this.amount = 0;
        this.payCar.filter((res) => {
          this.amount += res.discountPrice
        })
      },
      amount() {
        this.sw()
      },
      pay() {
        window.localStorage.pay = this.pay
        this.sw()
      },
    },
    created() {
      this.pay = window.localStorage.pay || 'SATO'
      shops.productList((res) => {
        console.log(res)
        this.productList = res.data
      })
      this.getCarList();
    },
    methods: {
      getCarList() {
        shops.cartList((res) => {
          console.log(res)
          this.payCar = res.list;
          this.$btc = res.symbolCurrency.BTC;
          this.$eth = res.symbolCurrency.ETH;
        })
      },
      add(data) {
        let datas = {
          productId: data.productId,
          productQuantity: 1
        }
        shops.addCart(datas, (res) => {
          console.log('加入成功')
          this.getCarList();
        }, (msg) => {
          Vue.$koallTipBox({icon: 'notification', message: '只能添加一件'})
        });
      },
      addList() {
        Vue.$koallTipBox({icon: 'notification', message: '只能添加一件'})
      },
      del(item) {
        let data = {
          cartId: item.cartId,
          productQuantity: 0
        }
        shops.putCart(data, (res) => {
          this.getCarList();
        })
      },
      next() {
        let data = {
          paytype: this.pay
        }
        shops.getMoney(data, (res) => {
          console.log(res)
          this.$router.push({name: 'shop_pay', params: {total: this.total}})
        }, (msg) => {
          Vue.$koallTipBox({
            icon: 'notification',
            message: this.$t(`error_code.${typeof msg === 'string' ? msg : msg[0]}`)
          })
        })
      },
      sw() {
        switch (true) {
          case this.pay === 'SATO':
            this.total = this.amount;
            break;
          case this.pay === 'USSD':
            this.total = this.amount;
            break;
          case this.pay === 'BTC':
            let reg = /([0-9]+\.[0-9]{8})[0-9]*/
            let d = this.amount / this.$btc
            this.total = d.toString().replace(reg, "$1");
            break;
          case this.pay === 'ETH':
            let re = /([0-9]+\.[0-9]{8})[0-9]*/
            let n = this.amount / this.$eth
            this.total = n.toString().replace(re, "$1");
            break
        }
      }
    }
  }
</script>

<style scoped lang="less">
  @import "shop";
</style>
