<template>
  <div class="cont">
    <p class="title">产品>支付</p>
    <div class="box">
      <ul class="box_left">
        <li class="pay_box">
          <h1>您的送货地址</h1>
          <form>
            <label>
              <span>* 姓名：</span>
              <input type="text" maxlength="20" v-model="name">
            </label>
            <label>
              <span>* 电话号码：</span>
              <input type="text" maxlength="20" v-model="phone">
            </label>
            <label>
              <span>* 邮箱：</span>
              <input type="text" maxlength="20" v-model="eMail">
            </label>
            <label>
              <span>* 邮寄地址：</span>
              <input type="text" maxlength="20" v-model="address">
            </label>
          </form>
          <small>注：标记*的为必填</small>
          <h1 class="mt3 as">
            <router-link to="/shop/clause">条款和条件</router-link>
          </h1>
          <label class="mt3">
            <input type="checkbox" v-model="check">
            我同意购物的条款和条件
          </label>
          <button @click="next()">确认支付</button>
          <p>
            <router-link to="/shop" style="color: #000">← 返回产品</router-link>
          </p>
        </li>
      </ul>
      <div class="box_right">
        <div class="shop_list" v-if="payCar.length">
          <h1>购物车</h1>
          <div class="list_box">
            <shop-list v-for="item in payCar"
                       :item="item"
                       @add="addList"
                       @del="del"></shop-list>
          </div>
          <div class="pay_radio">
            <h1>支付方式：
              <small style="font-weight: 400">{{pay}}</small>
            </h1>
          </div>
          <div class="amout">
            <h1>总额</h1>
            <span>100 BTC</span>
          </div>
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
        check: true
      }
    },
    watch: {
      payCar() {
        window.localStorage.payCarList = JSON.stringify(this.payCar)
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
      let f = window.localStorage.payCarList;
      f = JSON.parse(f);
      if (f === 'undefined' || f === null || f === undefined || f === '') {
        this.payCar = []
      } else {
        this.payCar = f;
      }
    },
    methods: {
      addList() {
        Vue.$koallTipBox({icon: 'notification', message: '只能添加一件'})
      },
      del(item) {
        this.payCar.filter((res, i) => {
          if (res.id === item.id) {
            this.payCar.splice(i, 1)
          }
        })
      },
      next() {
      }
    }
  }
</script>

<style scoped lang="less">
  @import "shop";
</style>
