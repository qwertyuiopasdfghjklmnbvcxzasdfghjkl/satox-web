<template>
  <div class="wallet-transfer">
        <div class="wallet-transfer-title">
            <span>{{$t('public0.public53')}}<!--资金划转--></span>
            <span @click="closeDialog" class="icon-close"></span>
        </div>
        <div class="wallet-transfer-form">
            <div class="wallet-transfer-row">
                <label class="wallet-transfer-label">
                    {{$t('public0.public54')}}<!--从：-->：
                </label>
                <div class="wallet-transfer-div">
                    {{item && item.alias}}
                </div>
            </div>
            <div class="wallet-transfer-row">
                <label class="wallet-transfer-label">
                    {{$t('public0.public55')}}<!--划转到：-->：
                </label>
                <div class="wallet-transfer-div">
                    <select v-model="to_account_id" v-validate="'required'" data-vv-name="wallet" class="wallet-transfer-select" :class="{error:errors.has('wallet')}">
                        <option value="">{{$t('public0.public56')}}<!--请选择钱包--></option>
                        <option v-for="data in filterDatas" :value="data.id" :key="data.id">{{data.alias}}</option>
                    </select>
                    <em class="error" v-if="errors.has('wallet')">{{$t('public0.public56')}}<!--请选择钱包--></em>
                </div>
            </div>
            <div class="wallet-transfer-row">
                <label class="wallet-transfer-label">
                    {{$t('public0.public57')}}<!--划转数量：-->：
                </label>
                <div class="wallet-transfer-div">
                    <numberbox v-validate="'required'" data-vv-name="money" v-model="amount" :accuracy="8" class="wallet-transfer-input" :class="{error:errors.has('money')}" type="text"></numberbox>
                    <em class="error" v-if="errors.has('money')">{{$t('public0.public58')}}<!--请输入划转数量--></em>
                </div>
            </div>
            <div class="wallet-transfer-row">
                <label class="wallet-transfer-label">
                    {{$t('public0.public59')}}<!--可转数量：-->：
                </label>
                <div class="wallet-transfer-div">
                    {{item && item.available}}
                    <a class="wallet-transfer-all" @click="transferAll">{{$t('public0.public60')}}<!--全部转出--></a>
                </div>
            </div>
            <div class="wallet-transfer-row">
                <button class="wallet-transfer-button" @click="submit">{{$t('exchange.exchange_determine')}}<!--确定--></button>
            </div>
        </div>
  </div>
</template>

<script>
import Vue from 'vue'
import numberbox from '@/components/formel/numberbox'
import walletApi from '@/api/wallet'
import numUtils from '@/assets/js/numberUtils'
export default {
  props: ['item', 'datas'],
  components: {
    numberbox
  },
  data () {
    return {
      to_account_id: '',
      amount: ''
    }
  },
  computed: {
    filterDatas () {
      if (!this.datas) {
        return []
      }
      return this.datas.filter((item) => {
        return item.coin_addr !== this.item.coin_addr
      })
    }
  },
  methods: {
    closeDialog () {
      this.$emit('okCallback')
      this.$emit('removeDialog')
    },
    transferAll () {
      this.amount = this.item.available
    },
    submit () {
      this.$validator.validateAll().then((validResult) => {
        if (!validResult) {
          return
        }
        if (numUtils.BN(0).equals(numUtils.BN(this.amount))) {
          Vue.$koallTipBox({icon: 'notification', message: this.$t('exchange.exchange_number_ont')})
          return
        }
        if (numUtils.BN(this.item.available).lt(numUtils.BN(this.amount))) {
          Vue.$koallTipBox({icon: 'notification', message: this.$t('exchange.exchange_Insufficient_balance')})
          return
        }
        walletApi.walletTransfer({
          from_account_id: this.item.id,
          to_account_id: this.to_account_id,
          amount: this.amount
        }, (msg) => {
          Vue.$koallTipBox({icon: 'success', message: this.$t('public0.public61')}) // 划转成功
          this.closeDialog()
        }, (msg) => {
          Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
        })
      })
    }
  }
}
</script>

<style scoped>
.wallet-transfer{width:438px;height:260px;display:flex;flex-flow:column;padding:15px 20px;background-color:#fff;color:#333;}
.wallet-transfer-title{font-size:18px;font-weight:bold;display:flex;align-items:center;justify-content:space-between;}
.icon-close{font-size:18px;cursor:pointer;opacity:0.7;}
.icon-close:hover{opacity:1;}
.wallet-transfer-form{display:flex;flex-flow:column;margin-top:20px;}
.wallet-transfer-row{display: flex;justify-content:center;margin-bottom:20px;}
.wallet-transfer-label{width:150px;text-align:right;}
.wallet-transfer-div{width:calc(100% - 150px);position:relative;}
.wallet-transfer-input,.wallet-transfer-select{width:calc(100% - 10px);height:26px;line-height:26px;border:1px solid #333;padding:0 4px;}
.wallet-transfer-select{width:100%;}
.wallet-transfer-input.error,.wallet-transfer-select.error{border-color:#ff0000;}
.wallet-transfer-all{cursor:pointer;color:#fdb902;font-size:14px;}
.wallet-transfer-button{width:104px;height:30px;background-color:#fdb902;color:#fff;font-weight:bold;margin-top:10px;}
.wallet-transfer-button:hover{opacity:0.8;}
em.error{position:absolute;left:0;bottom:-18px;font-size:12px;color:#ff0000;}
</style>
