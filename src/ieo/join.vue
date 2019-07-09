<template>
	<div class="page">
		<div class="join-title">
		    <a href="javascript:;" @click="closeDailog" class="icon-close"></a>
		    {{$t('ieo.participate_immediately')}}<!--立即参与-->
		</div>
		<div class="join-form">
			<section class="fs16">
				<p>{{$t('ieo.subscribed_shares')}}<!-- 可认购份数 -->： <strong>{{buyLimit}}</strong></p>
				<p class="mt15">{{$t('ieo.choose_payment_symbol')}}<!-- 选择付款币种 -->：
					<select class="tokens" v-model="accountId">
						<option :value="item.accountId" selected="" v-for="item in info.accounts">{{item.symbol}}</option>
					</select>
				</p>
				<p class="mt15">{{$t('account.estimated_value_available')}}<!-- 可用余额 -->： <strong class="mr20">{{String(currtAccount.availableBalance).toMoney()}} {{currtAccount.symbol}}</strong> ({{$t('ieo.pay_per_copy')}}<!-- 每份需支付 --> <strong>{{Number(price)}} {{currtAccount.symbol}}</strong>)</p>
				<p class="mt15">{{$t('ieo.subscription_shares')}}<!-- 认购份数 -->：
					<input type="number" name="total" class="total" v-model="applyQuantity" :placeholder="`${$t('public0.public114')} ${info.subscriptionLeast} ${currtAccount.symbol}`">
					<span class="ml20" v-show="Number(applyQuantity)">{{$t('ieo.payable')}}<!-- 需支付 --> <strong>{{totalPay}}</strong> {{currtAccount.symbol}} </span>
				</p>
				<p class="mt15 fs14 agreement">
					<label class="checkbox">
					  <input id="agreement" type="checkbox" name="agreement" checked="">
					  <i type="checkbox"></i>
					</label>
					<label for="agreement">{{$t('login_register.agree_Service')}}<!-- 我已阅读并同意 --> <a href="/#/ieo/agreement" target="_blank" class="mcolor">XXXXXX</a> {{$t('ieo.terms_of_agreement')}}<!-- 协议条款 --></label>
				</p>
				<p class="mt25"><button type="button" class="mint-btn success" :disabled="locked" style="width: 200px" @click="applyValidate">{{$t('ieo.confirm_purchase')}}<!-- 确认申购 --></button></p>
			</section>
			<section class="lh15 f-c-gray">
				<p><span class="icon-info-with-circle f-c-danger"></span> {{$t('ieo.subscription_notice')}}<!-- 认购须知 -->：</p>
				<div v-html="this.info.subscriptionNotice"></div>
			</section>
		</div>
		<div class="title box mt10">{{$t('ieo.participation_record')}}<!-- 当前参与记录 --></div>
		<ul class="join-list">
			<li class="header">
				<span>{{$t('ieo.subscribed_time')}}<!-- 认购时间 --></span>
				<span>{{$t('ieo.payment_symbol')}}<!-- 付款币种 --></span>
				<span>{{$t('ieo.number_of_applications')}}<!-- 申请份数 --></span>
				<span>{{$t('ieo.application_amount')}}<!-- 申请金额 --></span>
				<span>{{$t('ieo.gain_quantity')}}<!-- 获取数量 --></span>
				<span>{{$t('ieo.status')}}<!-- 状态 --></span>
			</li>
			<li v-for="item in list">
				<span>{{new Date(item.createdAt).format()}}</span>
				<span>{{item.subscriptionSymbol}}</span>
				<span>{{item.applyQuantity}}</span>
				<span>{{item.subscriptionAmount}}</span>
				<span>{{item.gainQuantity}}</span>
				<span>{{getStatus(item.state).text}}</span>
			</li>
		</ul>
	</div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import ieoApi from '@/api/ieo'
import marketApi from '@/api/market'
export default {
	props:['info'],
	data(){
		return {
			list:[],
			accountId:Object.keys(this.info.accounts)[0],
			applyQuantity:'',
			locked:false
		}
	},
	computed:{
		...mapGetters([]),
		buyLimit(){
			let applied = 0
			for(let item of this.list){
				applied += item.gainQuantity
			}
			return this.info.subscriptionQuantityLimit - applied
		},
		currtAccount(){
			return this.info.accounts[this.accountId]
		},
		totalPay(){
			return Number((Number(this.price)*Number(this.applyQuantity)).toFixed(8))
		},
		price(){
			return this.info.paymentConfig[this.currtAccount.symbol].symbolCount
		}

	},
	created(){
		this.getUserIEOProjectsList()
	},
	methods:{
		getStatus(status){
		  let rst = {type:'danger', text:''}
		  switch(status){
		    case 1: rst.type = 'warning';  rst.text = this.$t('ieo.confirmed'); break; //已确认
		    case 2: rst.type = 'danger';  rst.text = this.$t('ieo.debit_unsuccessful'); break; //扣款不成功
		    case 3: rst.type = 'success';  rst.text = this.$t('ieo.debit_success'); break; //扣款成功
		    case 4: rst.type = 'danger';  rst.text = this.$t('ieo.unsuccessfully_distribution'); break; //发放不成功
		    case 5: rst.type = 'success';  rst.text = this.$t('ieo.successfully_distribution'); break; //发放成功
		    case 6: rst.type = 'danger';  rst.text = this.$t('ieo.subscription_failed'); break; //认购失败
		    case 7: rst.type = 'success';  rst.text = this.$t('ieo.successful_subscription'); break; //认购成功
		  }
		  return rst
		},
		applyValidate(){
			let self = this
			if(!Number(this.applyQuantity)){
				Vue.$koallTipBox({icon: 'notification', message: this.$t('ieo.enter_number_of_subscriptions')}) //请输入认购份数
				return
			} else if(Number(this.applyQuantity)>this.buyLimit){
				Vue.$koallTipBox({icon: 'notification', message: this.$t('ieo.more_than_number_of_subscriptions')}) //超过当前可认购份数
				return
			} else if(Number(this.applyQuantity)<this.info.subscriptionLeast){
				Vue.$koallTipBox({icon: 'notification', message: `${this.$t('public0.public114')} ${this.info.subscriptionLeast} ${this.currtAccount.symbol}`}) //最小份额
				return
			} else if(this.totalPay> this.currtAccount.availableBalance){
				Vue.$koallTipBox({icon: 'notification', message: this.currtAccount.symbol + ' ' + this.$t('error_code.AVAILABLE_INSUFFICIENT')})
				return
			} else if(!document.getElementById('agreement').checked){
				Vue.$koallTipBox({icon: 'notification', message: this.$t('public0.public122')})
				return
			}
			this.locked = true
			ieoApi.postProjectsValidate({projectId:this.info.projectId}, res=>{
				let formData = {
					applyQuantity:this.applyQuantity,
					projectId:this.info.projectId,
					symbol:this.currtAccount.symbol,
					symbolType:this.info.paymentConfig[this.currtAccount.symbol].symbolType
				}
				ieoApi.postProjectsApply(formData, res=>{
					this.locked = false
					Vue.$koallTipBox({icon: 'success', message: this.$t(`error_code.SUCCESS`)})
					this.$emit('okCallback')
					this.$emit('removeDialog')
				}, msg=>{
					this.locked = false
					Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${typeof msg === 'string' ? msg : msg[0]}`)})
				})
			}, msg=>{
				this.locked = false
				if(msg==='KYC_AUTH_FIRST'){
					Vue.$confirmDialog({
					  id: 'KYC_AUTH_FIRST',
					  showCancel: true,
					  title:this.$t('otc_ad.otc_ad_confirm'),
					  content: this.$t(`error_code.KYC_AUTH_FIRST`), // 请先完成实名认证
					  okCallback: () => {
					  	this.$emit('removeDialog')
					    vm.$router.push({name: 'mycenter_menu', params: {menu: 'mycenter'}})
					  }
					})
				} else {
					Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${typeof msg === 'string' ? msg : msg[0]}`)})
				}
			})
		},
		closeDailog () {
		  this.$emit('removeDialog')
		},
		getUserIEOProjectsList(){
			ieoApi.getUserIEOProjectsList({projectId:this.info.projectId}, res=>{
				this.list = res
			}, msg=>{
				Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${typeof msg === 'string' ? msg : msg[0]}`)})
			})
		},
	}

}
</script>

<style lang="less" scoped="">
@main-color:#BA8D35;
.mcolor {color: @main-color;}
.page {
	width:1100px;
	padding-bottom: 10px;
	background-color: #212020;
	position: relative;
	border-top-left-radius: 10px; border-top-right-radius: 10px;
	overflow: hidden;
	.box {padding-left: 20px; padding-right: 20px;}
}
.title {background-color: #000; color: #fff; font-size: 18px; line-height: 50px;}
.join-title {position: relative; height: 50px;line-height: 50px;color: #fff;font-size: 20px;  text-align: center;background-color: #BA8D35;}
.join-title a {position:absolute;text-decoration:none;font-size:16px;color:#fff;top:17px;right:15px; opacity: 0.8; cursor: pointer;}
.join-title a:hover{opacity: 1;}
.join-form {
	background-color:#fff;
	padding:25px 60px;
	display: flex;
	section:first-of-type {flex: 1; min-width: 0;}
	section:last-of-type {width: 300px; min-width: 0;}
}
.tokens {min-width: 100px; border:1px solid #999; height: 25px; padding-left: 10px; padding-right: 10px; line-height: 25px; background-position: 93% center; border-radius: 4px;}
.total {width: 120px; border:1px solid #999; height: 25px; padding-left: 10px; padding-right: 10px; line-height: 25px; border-radius: 4px;}
.agreement label {display: inline-block;}
.checkbox {
    width: 12px;
    height: 12px;
    vertical-align: top;
    margin-right: 5px;
    input {
      display: none;
      &:checked {
        + i {
          background-color: @main-color;
          border-color:@main-color;
          &::before {
            border-color: #fff;
          }
        }
      }
    }
    i {
      position: relative;
      display: block;
      width: 12px;
      height: 12px;
      border: 2px solid @main-color;
      border-radius: 2px;
      margin-top: 2px;
      overflow: hidden;
      &::before {
        content: "";
        position: absolute;
        top: -2px;
        left: 4px;
        width: 4px;
        height: 11px;
        border-width: 0 2px 2px 0;
        border-style: solid;
        border-color: transparent;
        border-radius: 2px;
        transform: rotate(45deg);
      }
    }
}
.join-list {max-height: 550px; overflow-y: auto;}
.join-list li {
	display: flex;
	line-height: 50px;
	border-bottom: 1px solid #37342F;
	text-align: center;
	&:last-of-type {border-bottom: none;}
	span {
		flex: 1;
		color: #fff;
	}
	&.header span {color: @main-color;}
}
</style>