<template>
	<div class="page">
		<img src="" class="banner-brief">
		<ul class="tab-bar">
			<li class="active">进行中</li>
			<li>即将开始</li>
			<li>已结束</li>
		</ul>
		<div class="title box">进行中</div>
		<ul class="items-container clearfix">
			<li>
				<p>
					<img src="">
					<span class="fs16">EOSIO  EOS</span>
				</p>
				<p class="mt25">Start of purchase: <span>2018-07-03 20:00:00</span></p>
				<p class="mt15">Subscription deadline: <span>2018-07-03 20:00:00</span></p>
				<p class="mt15">Issue number: <span>3,500,000 EOS</span></p>
				<p class="mt15">Raised amount: <span>3,500,000 ETH</span></p>
				<p class="mt15">Subscribed: <span>2300 ETH</span></p>
				<div class="progress mt20">
					<div class="progress-bar-base"></div>
					<div class="progress-bar" style="width: 50%"></div>
				</div>
				<p class="mt8 text-center">已达成 50%</p>
				<button>End of distance: 00 days 20:50:22</button>
			</li>
		</ul>
		<div class="title box mt10">即将开始</div>
		<ul class="items-container wait clearfix">
			<li>
				<p>
					<img src="">
					<span class="fs16">EOSIO  EOS</span>
				</p>
				<p class="mt25">Start of purchase: <span>2018-07-03 20:00:00</span></p>
				<p class="mt15">Subscription deadline: <span>2018-07-03 20:00:00</span></p>
				<p class="mt15">Issue number: <span>3,500,000 EOS</span></p>
				<p class="mt15">Raised amount: <span>3,500,000 ETH</span></p>
				<p class="mt15">Subscribed: <span>2300 ETH</span></p>
				<button>End of distance: 00 days 20:50:22</button>
			</li>
		</ul>
		<div class="title box mt10">已结束</div>
		<ul class="items-container finished clearfix">
			<li>
				<p>
					<img src="">
					<span class="fs16">EOSIO  EOS</span>
				</p>
				<p class="mt25">Start of purchase: <span>2018-07-03 20:00:00</span></p>
				<p class="mt15">Subscription deadline: <span>2018-07-03 20:00:00</span></p>
				<p class="mt15">Issue number: <span>3,500,000 EOS</span></p>
				<p class="mt15">Raised amount: <span>3,500,000 ETH</span></p>
				<p class="mt15">Subscribed: <span>2300 ETH</span></p>
				<div class="progress mt20">
					<div class="progress-bar-base"></div>
					<div class="progress-bar" style="width: 50%"></div>
				</div>
				<p class="mt8 text-center">达成 50%</p>
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

	}

}
</script>

<style lang="less" scoped="">
@main-color:#BA8D35;
.page {
	margin:12px auto 42px;
	width:1100px;
	background-color: #1A1A1A;
	position: relative;
	.box {padding-left: 20px; padding-right: 20px;}
}
.banner-brief {display: block; width: 100%; height: 340px;}
.tab-bar {
	margin-top: 10px;
	line-height: 56px;
	background-color: #000;
	border-bottom: 1px solid #37342F;
	li {
		display: inline-block;
		width: 180px;
		color: #fff;
		position: relative;
		text-align: center;
		font-size: 16px;
		cursor: pointer;
		&.active {
			color: @main-color;
			&:after {
				content: '';
				position: absolute;
				left: 0;
				right: 0;
				bottom: 0;
				height: 3px;
				background-color:@main-color;
			}
		}
	}
}
.items-container {padding: 20px;}
.items-container li{
	box-sizing:border-box;
	float: left;
	width: 250px;
	padding: 10px 10px 70px;
	margin-right: 20px;
	margin-bottom: 20px;
	background-color:#fff;
	overflow-x: hidden;
	position: relative;
	&:nth-of-type(4n){
		margin-right: 0;
	}
	img {
		width: 68px;
		height: 68px;
		box-shadow:0px 2px 4px 0px rgba(6,0,1,0.2);
		border-radius:4px;
		object-fit: cover;
		object-position: center;
		vertical-align: middle;
		margin-right: 25px;
	}
	p {font-size: 13px;}
	p span {color: #666; margin-left: 5px;}
	button {
		position: absolute;
		height: 46px;
		left: 0;
		width: 100%;
		bottom: 0;
		border:none;
		background-color:#00A55E;
		color: #fff;
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
}
.title {background-color: #000; color: #fff; font-size: 18px; line-height: 50px;}
.items-container.wait li button {background-color: #E44242;}
.items-container.finished li {padding-bottom: 15px;}

</style>