<template>
	<div class="page">
		<div class="detail-top">
			<div class="left box-bgc"><img src="../assets/images/login_bg.jpg"></div>
			<div class="right">
				<div>
					<strong class="fs18">EOSIO  EOS</strong>
					<button type="button" class="mint-btn danger small ml50" style="vertical-align: bottom;">Processing</button>
					<button type="button" class="mint-btn success small ml50" style="vertical-align: bottom;">Processing</button>
					<button type="button" disabled="" class="mint-btn disabled small ml50" style="vertical-align: bottom;">Processing</button>
				</div>
				<div class="mt20 fs13">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. 
				</div>
				<div class="mt20 items">
					<p>Start of purchase: <span>2018-07-03 20:00:00</span></p>
					<p>Subscription deadline: <span>2018-07-03 20:00:00</span></p>
				</div>
				<div class="mt15 items">
					<p>Subscription price: <span>1 ETH = 8474 TNT </span></p>
					<p>Issue number: <span>3,500,000 EOS</span></p>
				</div>
				<div class="mt15 items">
					<p>Subscribed: <span>2300 ETH</span></p>
					<p>Raising goals: <span>3,500,000 ETH</span></p>
				</div>
				<div class="mt20 progress-container">
					<div class="progress" sty>
						<div class="progress-bar-base"></div>
						<div class="progress-bar" style="width: 50%"></div>
						<p class="mt8 f-c-gray">completed: 50%</p>
					</div>
					<div>
						<button type="button" class="mint-btn  success"  @click="joinDialog()">Participate</button>
						<span class="f-c-danger fs12 ml20">剩余：1小时20分</span>
					</div>
				</div>
			</div>
		</div>
		<div class="title box mt10">项目进度</div>
		<div class="steps-container box-bgc">
			<div class="steps">
				<span></span>
				<span></span>
				<span></span>
				<span></span>
			</div>
			<div class="steps-title mt20">
				<span>认购时间：2019-06-15  00:00:00</span>
				<span>申购截止：2019-06-15  00:00:00</span>
				<span>扣款时间：2019-06-15  00:00:00</span>
				<span>发币时间：2019-06-15  00:00:00</span>
			</div>
		</div>
		<div class="mt10 detail-bottom">
			<div class="brief">
				<div class="title box">项目详情</div>
				<div class="inner box-bgc"></div>
			</div>
			<div class="rules">
				<div class="title box">参与规则</div>
				<div class="inner box-bgc">
					<p>1. 认购订单无法取消，份数也无法更改。</p>
					<p>2. 一只新币一个用户只能申购一次</p>
					<p>3. 我们严格遵守不同国家和地区的法规，用户参与认购须完成实名认证。由于相关法规，中国大陆用户和美国用户无法参与此次认购，对您造成的不便敬请谅解。  </p>             
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import utils from '@/assets/js/utils'
import joinDialog from './join'
export default {
	data(){
		return {

		}
	},
	computed:{
		...mapGetters([]),
	},
	methods:{
		joinDialog(){
			utils.setDialog(joinDialog, {
			  okCallback: () => {
			    
			  }
			})
		}
	}

}
</script>

<style lang="less" scoped="">
@main-color:#BA8D35;
.box-bgc {background-color: #1A1A1A;}
.page {
	margin:12px auto 42px;
	width:1100px;
	position: relative;
	.box {padding-left: 20px; padding-right: 20px;}
	.inner {padding: 20px;}
}
.detail-top {
	display: flex;
	.left {
		width: 390px;
		min-width: 0;
		img {width: 100%; height: 100%; object-fit: cover; object-position: center;}
	}
	.right {
		flex: 1;
		box-sizing: border-box;
		min-height: 280px;
		background-color: #fff;
		padding: 25px 30px 15px;
	}
	.items {
		display: flex;
		> div, p {
			flex: 1;
			min-width: 0;
			span {color: #666; margin-left: 20px;}
		}
	}
}
.progress-container {
	display: flex;
	justify-content: space-between;
	> div:first-of-type {width: 280px;}
	> div:last-of-type {width: 50%;}
}
.progress {
	position: relative;
	text-align: center;
	&-bar {
		position: absolute;
		top: 0;
		left: 0;
		height: 3px;
		font-size: 0;
		background-color: @main-color;
		z-index: 1;
	}
	&-bar-base {
		height: 3px;
		line-height:0;
		font-size: 0;
		background-color: #eee;
	}
}
.title {background-color: #000; color: #fff; font-size: 18px; line-height: 50px;}
.steps-container {
	padding:55px 20px 50px;
	.steps {
		height: 6px;
		line-height: 0;
		font-size: 0;
		background-color:@main-color;
		position: relative;
		border-radius: 6px;
		display: flex;
		justify-content: space-between;
		span {
			width: 12px;
			height: 12px;
			background-color:@main-color;
			border-radius: 12px;
			margin-top: -3px;
		}
	}
	.steps-title {
		display: flex;
		justify-content: space-between;
		color: #fff;
	}
}
.detail-bottom {
	display: flex;
	.brief {flex: 1; color: #fff; line-height: 1.5em;}
	.rules {width: 400px; margin-left: 10px; color: #fff; line-height: 1.5em;}
}
</style>