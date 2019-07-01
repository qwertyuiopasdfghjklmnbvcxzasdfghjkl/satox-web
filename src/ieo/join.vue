<template>
	<div class="page">
		<div class="join-title">
		    <a href="javascript:;" @click="closeDailog" class="icon-close"></a>
		    立即参与 <!--立即参与-->
		</div>
		<div class="join-form">
			<section class="fs16">
				<p>可认购份数： <strong>10</strong> 份</p>
				<p class="mt15">选择付款币种：
					<select class="tokens">
						<option value="USSD" selected="">USSD</option>
						<option value="BTC">BTC</option>
					</select>
				</p>
				<p class="mt15">可用余额： <strong class="mr20">1000.00 USSD</strong> (每份需支付 <strong>100 USSD</strong>)</p>
				<p class="mt15">申请份数：
					<input type="number" name="total" class="total">
				</p>
				<p class="mt15 fs14 agreement">
					<label class="checkbox">
					  <input id="agreement" type="checkbox" name="agreement">
					  <i type="checkbox"></i>
					</label>
					<label for="agreement">我已阅读并同意 <a href="/#/ieo/agreement" target="_blank" class="mcolor">XXXXXX</a> 协议条款</label>
				</p>
				<p class="mt25"><button type="button" class="mint-btn success" style="width: 200px">确认申购</button></p>
			</section>
			<section class="lh15 f-c-gray">
				<p><span class="icon-info-with-circle f-c-danger"></span> 认购须知：</p>
				<p>1. 认购订单无法取消，份数也无法更改。</p>
			</section>
		</div>
		<div class="title box mt10">当前参与记录</div>
		<ul class="join-list">
			<li class="header">
				<span>认购时间</span>
				<span>付款币种</span>
				<span>申请份数</span>
				<span>申请金额</span>
				<span>获取数量</span>
				<span>状态</span>
			</li>
			<li>
				<span>2019-05-05 00:00:00</span>
				<span>BTC</span>
				<span>100</span>
				<span>100BTC</span>
				<span>100</span>
				<span>200</span>
			</li>
		</ul>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
	data(){
		return {

		}
	},
	computed:{
		...mapGetters([]),
	},
	methods:{
		closeDailog () {
		  this.$emit('removeDialog')
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
	.box {padding-left: 20px; padding-right: 20px;}
}
.title {background-color: #000; color: #fff; font-size: 18px; line-height: 50px;}
.join-title {position: relative; height: 50px;line-height: 50px;color: #fff;font-size: 20px;  text-align: center;background-color: #BA8D35; border-top-left-radius: 10px; border-top-right-radius: 10px;}
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