<template>
  <div class="cont">
    <p class="title">{{$t('shop.pay_product')}}</p>
    <div class="box">
      <ul class="box_left">
        <li class="pay_box">
          <h1>{{$t('shop.your_receiving_address')}}</h1>
          <form>
            <label>
              <span>* {{$t('shop.name')}}：</span>
              <input type="text" maxlength="20" v-model="name">
            </label>
            <label>
              <span>* {{$t('shop.phone')}}：</span>
              <input type="text" maxlength="20" v-model="phone">
            </label>
            <label>
              <span>* {{$t('shop.email')}}：</span>
              <input type="text" maxlength="20" v-model="eMail">
            </label>
            <label>
              <span>* {{$t('shop.postal_address')}}：</span>
              <input type="text" maxlength="20" v-model="address">
            </label>
          </form>
          <small>{{$t('shop.warn')}}</small>
          <h1 class="mt3 as">
            <router-link to="/shop/clause">{{$t('shop.terms')}}</router-link>
          </h1>
          <label class="mt3">
            <input type="checkbox" v-model="check">
            {{$t('shop.agree_terms')}}
          </label>
          <button @click="sub()">{{$t('shop.confirmation_pay')}}</button>
          <p>
            <router-link to="/shop" style="color: #000">{{$t('shop.return_product')}}</router-link>
          </p>
        </li>
      </ul>
      <div class="box_right">
        <div class="shop_list" v-if="payCar.length">
          <h1>{{$t('shop.cart')}}</h1>
          <div class="list_box">
            <shop-list v-for="item in payCar"
                       :item="item"
                       :change="false"></shop-list>
          </div>
          <div class="pay_radio">
            <h1>{{$t('shop.payment')}}：
              <small style="font-weight: 400">{{pay}}</small>
            </h1>
          </div>
          <div class="amout">
            <h1>{{$t('shop.total_amount')}}</h1>
            <span>{{total}} {{pay}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import shopList from '../components/shop_list'
  import shops from '../api/shops'
  import Vue from 'vue'

  export default {
    name: 'shop',
    components: {shopList},
    data() {
      return {
        pay: 'SATO',
        payCar: [],
        name: null,
        phone: null,
        eMail: null,
        address: null,

        check: true,
        total: null,
      }
    },
    watch: {
      payCar() {
        if (!this.payCar.length) {
          this.$router.push({name: 'shop_index'})
        }
      },
      phone() {
        this.phone = this.phone.replace(/[^\d]/g, '')
      }
    },
    created() {
      this.pay = window.localStorage.pay;
      this.getCarList();
      this.total = this.$route.params.total;
      if (!this.total) {
        this.$router.push({name: 'shop_index'})
      }
    },
    methods: {
      getCarList() {
        shops.cartList((res) => {
          this.payCar = res.list;
        })
      },
      // addList() {
      //   Vue.$koallTipBox({icon: 'notification', message: '只能添加一件'})
      // },
      // del(item) {
      //   let data = {
      //     cartId: item.cartId,
      //     productQuantity: 0
      //   }
      //   shops.putCart(data, (res) => {
      //     this.getCarList();
      //   })
      // },
      sub() {
        if (!this.check) {
          Vue.$koallTipBox({icon: 'notification', message: this.$t('shop.read_terms')})
        } else {
          if (this.ref(this.name)
            && this.ref(this.phone)
            && this.ref(this.address)
            && this.refEmail(this.eMail)) {
            let data = {
              address: this.address,
              email: this.eMail,
              paytype: this.pay,
              phone: this.phone,
              realName: this.name
            }
            shops.createdOrder(data, (res) => {
              console.log(res)
              Vue.$koallTipBox({icon: 'success', message: this.$t('shop.order_success')})
              // window.localStorage.pay = null;
              if (this.payCar.productName === '中本硬件') {
                this.$router.push('/mycenter/hardware')
              } else {
                this.$router.push('/mycenter/SATODebitCard')
              }
            })
          } else {
            Vue.$koallTipBox({icon: 'notification', message: this.$t('shop.improving_receiving_info')})
          }
        }
      },
      ref(id) {
        if (id) {
          return true;
        } else {
          return false;
        }
      },
      refEmail(data) {
        let reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
        if (!reg.test(data)) {
          Vue.$koallTipBox({icon: 'notification', message: this.$t('shop.email_invalid')})
        }
        return reg.test(data)
      }
    }
  }
</script>

<style scoped lang="less">
  @import "shop";
</style>
