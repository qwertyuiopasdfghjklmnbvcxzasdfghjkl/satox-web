<template>
  <div class="cont">
    <p class="title"><img src="../assets/images/title-ico.jpg">{{$t('shop.product')}}</p>
    <div class="box">
      <ul class="box_left">
        <li v-for="data in productList">
          <span class="pic">
            <img :src="baseURL+data.coverImgPath">
          </span>
          <div>
            <h2>{{lang === 1 ? data.productName:data.productNameEn}}</h2>
            <p>${{data.discountPrice}}</p>
            <span>{{lang === 1 ?data.productDescription:data.productDescriptionEn}}</span>
            <button @click="add(data)">{{$t('shop.add_to_cart')}}</button>
          </div>
        </li>
      </ul>
      <div class="box_right">
        <div class="no_shop" v-if="!payCar.length">
          <p style="text-align: center" class="noImg"><img src="../assets/images/noShop.png" alt=""></p>
          <h4>{{$t('shop.empty_cart')}}</h4>
          <h4>{{$t('shop.shopping_now')}}</h4>
        </div>
        <div class="shop_list" v-if="payCar.length">
          <h1>{{$t('shop.cart')}}</h1>
          <div class="list_box">
            <shop-list v-for="item in payCar"
                       :item="item"
                       @add="addList"
                       @del="del"></shop-list>
          </div>
          <div class="pay_radio">
            <h1>{{$t('shop.payment')}}：</h1>
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
            <h1>{{$t('shop.total_amount')}}</h1>
            <span>{{total}} {{pay}}</span>
          </div>
          <!--GET /order-->
          <button @click="next()">{{$t('shop.continue')}}</button>
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
  import {mapGetters} from 'vuex'

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
        $eth: null,
        lang: 1
      }
    },
    computed: {
      ...mapGetters(['getLang']),
    },
    watch: {
      getLang() {
        this.cLang()
      },
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
      this.cLang()
    },
    methods: {
      cLang() {
        if (this.getLang === 'zh-CN') {
          this.lang = 1
        } else {
          this.lang = 2
        }
      },
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
          Vue.$koallTipBox({icon: 'notification', message: this.$t('shop.just_add_once')})
        });
      },
      addList() {
        Vue.$koallTipBox({icon: 'notification', message: this.$t('shop.just_add_once')})
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
