<template>
	<div class="page">
		<img src="" class="banner-brief">
		<ul class="tab-bar"><a name="A"></a>
			<li class="active"><a href="#A">进行中</a></li>
			<li><a href="#B">即将开始</a></li>
			<li><a href="#C">已结束</a></li>
		</ul>
		<div class="title box">进行中</div>
		<ul class="items-container clearfix">
			<li v-for="item in list1" :key="item.projectId" @click="goDetail(item.projectId)">
				<p>
					<img :src="item.projectLogo">
					<span class="fs16">{{item[`projectName${lang}`]}}</span>
				</p>
				<p class="mt25">申购开始： <span>{{new Date(item.startTime).format()}}</span></p>
				<p class="mt15">申购截止： <span>{{new Date(item.endTime).format()}}</span></p>
				<p class="mt15">发行数量： <span>{{String(item.totalIssue).toMoney()}} {{item.projectSymbol}}</span></p>
				<p class="mt15">募集金额： <span>{{String(item.totalRaised).toMoney()}} {{item.priceSymbol}}</span></p>
				<p class="mt15">已认购： <span>{{item.totalSubscription}} {{item.priceSymbol}}</span></p>
				<div class="progress mt20">
					<div class="progress-bar-base"></div>
					<div class="progress-bar" :style="`width: ${item.totalSubscription/item.totalRaised*100}%`"></div>
				</div>
				<p class="mt8 text-center">已达成 {{(item.totalSubscription/item.totalRaised*100).toFixed(2)}}%</p>
				<button>距离结束：{{item.getMsec(item)|humanTime(lang==''?'天':'days')}}</button>
			</li>
		</ul>
		<div class="title box mt10">即将开始</div><a name="B"></a>
		<ul class="items-container wait clearfix">
			<li v-for="item in list2" :key="item.projectId" @click="goDetail(item.projectId)">
				<p>
					<img :src="item.projectLogo">
					<span class="fs16">{{item[`projectName${lang}`]}}</span>
				</p>
				<p class="mt25">申购开始： <span>{{new Date(item.startTime).format()}}</span></p>
				<p class="mt15">申购截止： <span>{{new Date(item.endTime).format()}}</span></p>
				<p class="mt15">发行数量： <span>{{String(item.totalIssue).toMoney()}} {{item.projectSymbol}}</span></p>
				<p class="mt15">募集金额： <span>{{String(item.totalRaised).toMoney()}} {{item.priceSymbol}}</span></p>
				<p class="mt15">已认购： <span>{{item.totalSubscription}} {{item.priceSymbol}}</span></p>
				<button>距离开始：{{item.getMsec(item)|humanTime('天')}}</button>
			</li>
		</ul>
		<div class="title box mt10">已结束</div><a name="C"></a>
		<ul class="items-container finished clearfix">
			<li v-for="item in list3" :key="item.projectId" @click="goDetail(item.projectId)">
				<p>
					<img :src="item.projectLogo">
					<span class="fs16">{{item[`projectName${lang}`]}}</span>
				</p>
				<p class="mt25">申购开始： <span>{{new Date(item.startTime).format()}}</span></p>
				<p class="mt15">申购截止： <span>{{new Date(item.endTime).format()}}</span></p>
				<p class="mt15">发行数量： <span>{{String(item.totalIssue).toMoney()}} {{item.projectSymbol}}</span></p>
				<p class="mt15">募集金额： <span>{{String(item.totalRaised).toMoney()}} {{item.priceSymbol}}</span></p>
				<p class="mt15">已认购： <span>{{item.totalSubscription}} {{item.priceSymbol}}</span></p>
				<div class="progress mt20">
					<div class="progress-bar-base"></div>
					<div class="progress-bar" :style="`width: ${item.totalSubscription/item.totalRaised*100}%`"></div>
				</div>
				<p class="mt8 text-center">达成 {{(item.totalSubscription/item.totalRaised*100).toFixed(2)}}%</p>
			</li>
		</ul>
		<div class="mask-layer" v-show="locked">
			<div class="center"><loading :size="48"/></div>
		</div>
	</div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import loading from '@/components/loading'
import ieoApi from '@/api/ieo'
export default {
	components: {
	  loading
	},
	data(){
		return {
			list1: [],
			list2: [],
			list3: [],
			timer:0,
			interVal:null,
			locked:true
		}
	},
	computed:{
		...mapGetters(['getLang']),
		lang(){
			if(this.getLang==='zh-CN' || this.getLang==='cht'){
				return ''
			} else {
				return 'En'
			}
		}
	},
	created(){
		this.getIEOProjectsList()
	},
	beforeRouteLeave(to, from, next){
		clearInterval(this.interVal)
		next()
	},
	methods:{
		getIEOProjectsList(){
			ieoApi.getIEOProjectsList((list, serverTime)=>{
				let list1 = [], list2 = [], list3 = []
				this.locked = false
				this.timer = 0
				if(!this.interVal){
					this.interVal = setInterval(()=>{this.timer += 1000},1000)
				}
				for(let item of list){
					item.timestamp = serverTime
					if(item.startTime > serverTime){
						item.getMsec = (project)=>{
							let msec = project.startTime - project.timestamp - this.timer
							if(msec<=0){
								this.getIEOProjectsList()
							}
							return msec>=0?msec:0
						}
						list2.push(item)
					} else if(item.endTime > serverTime){
						item.getMsec = (project)=>{
							let msec = project.endTime - project.timestamp - this.timer
							if(msec<=0){
								this.getIEOProjectsList()
							}
							return msec>=0?msec:0
						}
						list1.push(item)
					} else {
						list3.push(item)
					}
				}
				this.list1 = list1
				this.list2 = list2
				this.list3 = list3
			}, msg=>{
				Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${typeof msg === 'string' ? msg : msg[0]}`)})
			})
		},
		goDetail(id){
			this.$router.push({name:'ieo_detail', params:{id:id}})
		}
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
		a {
			display: block;
			color: #fff;
		}
		&.active {
			a {color: @main-color;}
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
	cursor: pointer;
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
		background-color:#E44242;
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
.items-container.wait li button {background-color: #00A55E;}
.items-container.finished li {padding-bottom: 15px;}
.center { position: absolute; left: 50%; top: 50%; margin-left: -24px; margin-top: -24px; }
</style>