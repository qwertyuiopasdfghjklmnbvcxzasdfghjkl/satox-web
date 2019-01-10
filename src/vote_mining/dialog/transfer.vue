<template>
    <div class="transfer-dialog">
        <div class="transfer-dialog-title">{{$t('vote_mining.funds_transfer')}}<!--资金划转--></div>
        <div class="transfer-dialog-form">
            <div class="transfer-dialog-row">
                <label class="transfer-dialog-label">{{$t('trade_record.trade_record_currency')}}：</label>
                <select class="transfer-dialog-select" v-model="symbol">
                  <option v-for="item in transferList" :value="item" :key="item">{{item}}</option>
                </select>
            </div>
            <div class="transfer-dialog-row">
                <label class="transfer-dialog-label">{{$t('vote_mining.transfer_direction')}}：</label>
                <p v-if="M2D"><span>{{$t('vote_mining.main_account')}}</span><i class="icon-two-way c-blue"></i><span>{{$t('vote_mining.vote_mining_account')}}</span></p>
                <p v-else><span>{{$t('vote_mining.vote_mining_account')}}</span><i class="icon-two-way c-blue"></i><span>{{$t('vote_mining.main_account')}}</span></p>
                <p class="c-blue pointer" @click="M2D=!M2D">{{$t('vote_mining.change')}}</p>
            </div>
            <div class="transfer-dialog-row">
                <label class="transfer-dialog-label">{{$t('vote_mining.transfer_quantity')}}：</label>
                <input type="number" name="amount" class="transfer-dialog-input" v-model="formData.amount" :placeholder="$t('account.estimated_value_available')+' '+this.balance">
                <p class="c-blue pointer ml20" @click="formData.amount=balance">{{$t('public0.public60')}}</p>
            </div>
            <div class="transfer-dialog-btns">
                <button class="transfer-dialog-cancel" @click="closeDialog">{{$t('otc_legal.otc_legal_cancel')}}<!--取消--></button>
                <button class="transfer-dialog-confirm" @click="submit">{{$t('public0.public35')}}<!--确定--></button>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import userApi from '@/api/individual'
import userUtils from '@/api/wallet'
import voteMiningApi from '@/api/voteMining'

export default {
  data () {
    return {
      M2D:true, //主账户到挖矿账户
      assets:[],
      symbol:'',
      formData:{
        toAccountId:'',
        fromAccountId:'',
        amount:''
      }
    }
  },
  computed:{
    transferList(){
      let list = []
      for(let item of this.assets){
        if(item.type===2){
          list.push(item.symbol)
          if(!this.symbol){
            this.symbol = item.symbol
          }
        }
      }
      return list
    },
    balance(){
      let type = this.M2D?1:2, balance = 0
      for(let item of this.assets){
        if(item.type===type && item.symbol === this.symbol){
          balance = Number(item.availableBalance)
          break
        }
      }
      return balance
    }
  },
  created(){
    this.getList()
  },
  methods: {
    setAll(){

    },
    closeDialog () {
      this.$emit('removeDialog')
    },
    getList () {
      userUtils.myAssets({}, (data) => {
        this.assets = data
      })
    },
    submit () {
      if(!this.formData.amount){
        Vue.$koallTipBox({icon: 'notification', message: this.$t('vote_mining.transfer_quantity_input')})
        return
      }
      if(Number(this.formData.amount)>this.balance){
          Vue.$koallTipBox({icon: 'notification', message: this.$t('public0.public292')})
          return
      }

      let type = this.M2D?1:2
      for(let item of this.assets){
        if(item.symbol === this.symbol){
          if(item.type === type){
            this.formData.fromAccountId = item.accountId
          } else {
            this.formData.toAccountId = item.accountId
          }
        }
      }
      voteMiningApi.postTransfer(this.formData, res=>{
        Vue.$koallTipBox({icon: 'success', message: this.$t('vote_mining.transfer_tips'), delay:3000})
        this.$emit('okCallback')
        this.closeDialog()
      },msg=>{
        Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
      })
    }
  }
}
</script>

<style scoped>
.c-blue {color: #2c78ec;}
.pointer {cursor: pointer;}
.ml20 {margin-left: 20px;}
.icon-two-way { margin-left: 20px; margin-right: 20px;}
.transfer-dialog{width: 550px;background-color: #fff; border-top-left-radius: 10px; border-top-right-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px #5d5d5d;}
.transfer-dialog-title{height: 60px;line-height: 60px;color: #fff;font-size: 22px;  text-align: center;background-color: #0D66EF;}
.transfer-dialog-form{padding: 30px 30px 60px; position: relative; font-size: 16px;}
.transfer-dialog-row {display: flex; justify-content: space-between; padding-bottom: 20px; line-height: 45px;}
.transfer-dialog-label{color: #333; margin-right: 15px;}
.transfer-dialog-select{
  flex:1; height: 45px;color:#333;background-color: transparent;border: 1px solid #ccc; border-radius: 4px; font-size: 16px; box-sizing: border-box; background: url('../../assets/images/vote_mining/arrow-down-blue.png') no-repeat right center; padding-left: 15px; line-height: 45px;
}
.transfer-dialog-input{
  flex:1; height: 45px;color:#333;background-color: transparent;border: 1px solid #ccc; border-radius: 4px; font-size: 16px; box-sizing: border-box;  padding-left: 15px; line-height: 45px;
}
.transfer-dialog-input.error{border-color: #e53f3f;}
.transfer-dialog-prompt{display: block;height: 30px;line-height: 30px;color: #e53f3f;}
.transfer-dialog-confirm{color: #fff;background-color: #0D66EF;}
.transfer-dialog-confirm:hover{background-color: #0b4cb1;}
.transfer-dialog-cancel{color: #A3A3A3;background-color: #F5F5F5;border:none;}
.transfer-dialog-cancel:hover{color: #666;}
.transfer-dialog-btns {position: absolute; left: 0; right: 0; bottom: 0; display: flex;}
.transfer-dialog-btns button {flex: 1; height: 50px; font-size: 16px;}
</style>
