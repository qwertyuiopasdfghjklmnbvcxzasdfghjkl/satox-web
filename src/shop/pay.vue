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
              <input type="text" maxlength="100" v-model="eMail">
            </label>
            <label>
              <span>* {{$t('shop.postal_address')}}：</span>
              <input type="text" maxlength="100" v-model="address">
            </label>
          </form>
          <small>{{$t('shop.warn')}}</small>
          <h1 class="mt3 as">
            <router-link :to="{name: 'shop_clause', params: {total:this.total}}">{{$t('shop.terms')}}</router-link>
          </h1>
          <label class="mt3">
            <input type="checkbox" v-model="check" style="margin-top: 1px;vertical-align: middle;">
            {{$t('shop.agree_terms')}}
          </label>
          <button @click="sub()" :disabled="butState" :class="{'dis':butState}">{{$t('shop.confirmation_pay')}}</button>
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
        butState: false,
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
        this.butState = true;
        if (!this.check) {
          Vue.$koallTipBox({icon: 'notification', message: this.$t('shop.read_terms')})
          this.butState = false;
        } else {
          if (this.ref(this.name, 'type_in_name')
            && this.ref(this.phone, 'type_in_phone')
            && this.ref(this.address, 'type_in_address')
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
              if (this.payCar[0].productName === '中本硬件') {
                this.$router.push('/mycenter/hardware')
              } else {
                this.$router.push('/mycenter/SATODebitCard')
              }
              this.butState = false;
            }, (msg) => {
              Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
              this.butState = false;
            })
          }else {
            this.butState = false;
          }
        }
      },
      ref(id, text) {
        if (id) {
          return true;
        } else {
          Vue.$koallTipBox({icon: 'notification', message: this.$t('shop.'+text)})
          return false;
        }
      },
      refEmail(data) {
        if(!data){
          Vue.$koallTipBox({icon: 'notification', message: this.$t('shop.type_in_email')})
        }
        let reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
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
  .cont .box .box_left li.pay_box button{
    width: 170px;
    margin-top: 10px;
    margin-bottom: 20px;
  }
</style>
