<template>
  <div class="container">
    <div class="block banner">
    	<div class="control">
    		<span>资金划转</span>
    		<span>投票挖矿</span>
    	</div>
    </div>
    <div class="block main">
    	<div class="content">
    		<div class="tabs">
    			<span :class="{active:tab==='vote'}" @click="tab='vote'">投票收益</span>
    			<span :class="{active:tab==='mining'}" @click="tab='mining'">挖矿收益</span>
    			<span :class="{active:tab==='community'}" @click="tab='community'">社区收益</span>
    			<button type="button" v-show="tab==='mining'">我的矿池</button>
    		</div>
    		<div class="tabpane-vote" v-show="tab==='vote'">
    			<div class="statistics">
    				<div>
    					挖矿账户
    					<span class="tips">
    					  <i class="tips-icon">?</i>
    					  <em class="tips-text">包含投票冻结状态和已获得的CDCC<!--包含投票冻结状态和已获得的CDCC--></em>
    					</span>
    					: 12,345.23 CDCC
    				</div>
    				<div>
    					累计收益
    					<span class="tips">
    					  <i class="tips-icon">?</i>
    					  <em class="tips-text">包含投票冻结状态和已获得的CDCC<!--包含投票冻结状态和已获得的CDCC--></em>
    					</span>
    					: 12,345.23 CDCC
    				</div>
    				<div>
    					预估收益
    					<span class="tips">
    					  <i class="tips-icon">?</i>
    					  <em class="tips-text">包含投票冻结状态和已获得的CDCC<!--包含投票冻结状态和已获得的CDCC--></em>
    					</span>
    					: 12,345.23 CDCC
    				</div>
    				
    			</div>
    			<div class="records">
    				<div class="item header">
    					<span>投票期</span>
    					<span>投入票数(CDCC)</span>
    					<span>预估收益(CDCC)</span>
    					<span>结算日</span>
    				</div>
    				<div class="item">
    					<span>3个月</span>
    					<span>30,000.00</span>
    					<span>30,000.00</span>
    					<span>2019-01-05</span>
    				</div>
    				<div class="item">
    					<span>3个月</span>
    					<span>30,000.00</span>
    					<span>30,000.00</span>
    					<span>2019-01-05</span>
    				</div>
    				<div class="item">
    					<span>3个月</span>
    					<span>30,000.00</span>
    					<span>30,000.00</span>
    					<span>2019-01-05</span>
    				</div>
    				<div class="item">
    					<span>3个月</span>
    					<span>30,000.00</span>
    					<span>30,000.00</span>
    					<span>2019-01-05</span>
    				</div>
    			</div>
    			<page v-if="!vote.loading && vote.data.length > 0" :pageIndex="vote.page" :pageSize="vote.size" :total="vote.total" @changePageIndex="vote.pageChange"/>
    			<div v-if="!vote.loading && vote.data.length === 0" class="nodata">
    			  <div class="nodata-icon icon-no-order"></div>
    			  <div class="nodata-text">{{$t('public0.public50')}}<!--暂无相关数据--></div>
    			</div>
    			<loading v-if="vote.loading"/>
    		</div>
    		<div class="tabpane-mining" v-show="tab==='mining'">
    			<div class="statistics">
    				<div>
    					每日收益
    					<span class="tips">
    					  <i class="tips-icon">?</i>
    					  <em class="tips-text">包含投票冻结状态和已获得的CDCC<!--包含投票冻结状态和已获得的CDCC--></em>
    					</span>
    					: 12,345.23 CDCC
    				</div>
    				<div>
    					累计收益
    					<span class="tips">
    					  <i class="tips-icon">?</i>
    					  <em class="tips-text">包含投票冻结状态和已获得的CDCC<!--包含投票冻结状态和已获得的CDCC--></em>
    					</span>
    					: 12,345.23 CDCC
    				</div>
    				<div>
    					预估收益
    					<span class="tips">
    					  <i class="tips-icon">?</i>
    					  <em class="tips-text">包含投票冻结状态和已获得的CDCC<!--包含投票冻结状态和已获得的CDCC--></em>
    					</span>
    					: 12,345.23 CDCC
    				</div>
    				
    			</div>
    			<div class="records">
    				<div class="item header">
    					<span>投票期</span>
    					<span>投票笔数</span>
    					<span>挖矿收益(CDCC)</span>
    				</div>
    				<div class="item">
    					<span>3个月</span>
    					<span>3</span>
    					<span>30,000.00</span>
    				</div>
    				<div class="item">
    					<span>6个月</span>
    					<span>4</span>
    					<span>30,000.00</span>
    				</div>
    				<div class="item">
    					<span>12个月</span>
    					<span>5</span>
    					<span>30,000.00</span>
    				</div>
    			</div>
    		</div>
    		<div class="tabpane-community" v-show="tab==='community'">
    			<div class="overview">
    				<div class="row">
    					<div>
    						每日收益
    						<span class="tips">
    						  <i class="tips-icon">?</i>
    						  <em class="tips-text">包含投票冻结状态和已获得的CDCC<!--包含投票冻结状态和已获得的CDCC--></em>
    						</span>
    						: 
    						<p>12,345.23 CDCC</p>
    					</div>
    					<div>
    						累计收益
    						<span class="tips">
    						  <i class="tips-icon">?</i>
    						  <em class="tips-text">包含投票冻结状态和已获得的CDCC<!--包含投票冻结状态和已获得的CDCC--></em>
    						</span>
    						: 
    						<p>12,345.23 CDCC</p>
    					</div>
    					<div>
    						预估收益
    						<span class="tips">
    						  <i class="tips-icon">?</i>
    						  <em class="tips-text">包含投票冻结状态和已获得的CDCC<!--包含投票冻结状态和已获得的CDCC--></em>
    						</span>
    						: 
    						<p>12,345.23 CDCC</p>
    					</div>
    				</div>
    				<div class="sepline"></div>
    				<div class="row mt50">
    					<div>
    						每日收益
    						<span class="tips">
    						  <i class="tips-icon">?</i>
    						  <em class="tips-text">包含投票冻结状态和已获得的CDCC<!--包含投票冻结状态和已获得的CDCC--></em>
    						</span>
    						: 
    						<p>12,345.23 CDCC</p>
    					</div>
    					<div>
    						累计收益
    						<span class="tips">
    						  <i class="tips-icon">?</i>
    						  <em class="tips-text">包含投票冻结状态和已获得的CDCC<!--包含投票冻结状态和已获得的CDCC--></em>
    						</span>
    						: 
    						<p>12,345.23 CDCC</p>
    					</div>
    					<div>
    						预估收益
    						<span class="tips">
    						  <i class="tips-icon">?</i>
    						  <em class="tips-text">包含投票冻结状态和已获得的CDCC<!--包含投票冻结状态和已获得的CDCC--></em>
    						</span>
    						: 
    						<p>12,345.23 CDCC</p>
    					</div>
    				</div>
    			</div>
    		</div>
    	</div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import page from '@/components/page'
  import loading from '@/components/loading'

  export default {
    name: 'vote_mining_profile',
    components: {
      page,
      loading
    },
    data(){
    	return {
    		tab:'vote',
    		vote:{
    			data:[],
    			loading:false,
    			page:1,
    			size:20,
    			total:100,
    			pageChange(){

    			}
    		},
    	}
    },
    computed: {
      ...mapGetters(['getApiToken', 'getLang']),
    },
    watch: {
      
    },
    created () {
      
    },
  }
</script>

<style scoped>
.mt45 {margin-top: 45px;}
.mt50 {margin-top: 50px;}
.mt70 {margin-top: 70px;}
.text-center {text-align: center;}
.gray {color: #666;}
.blue {color: #2679F9;}
.fs26 {font-size: 26px;}
.fs32 {font-size: 32px;}
.pointer {cursor: pointer;}
.container{width:100%;min-height:calc(100% - 60px); background-color: #fff;}
.block {min-width: 1200px; max-width: 1920px; }
.banner {position: relative;}
.banner::before {
	content: '';
	display: block;
	padding-bottom: 34.375%;
	background: url('../assets/images/vote_mining/banner_other.jpg') no-repeat center top;
	background-size: cover;
}
.banner .control {position: absolute; left: 0; right: 0; bottom: 14%; width: 1200px; margin-left: auto; margin-right: auto; z-index: 1; text-align: right;}
.banner .control span {
	display: inline-block;
	width: 180px;
	height: 50px;
	line-height: 50px;
	border: 2px solid #0064FE;
	border-radius: 4px;
	color: #fff;
	font-size: 24px;
	margin-left: 30px;
	text-align: center;
	cursor: pointer;
}
.main {
	min-height: 350px;
	padding-bottom: 100px;
}
.content {width: 1200px; margin-left: auto; margin-right: auto; margin-top: 25px; background-color: #fff; box-shadow: 0 2px 10px rgba(0,0,0,.3); border-radius: 4px; overflow: hidden;}
.tabs {
	border-bottom: 1px solid #ccc;
	height: 70px;
	display: flex;
	position: relative;
}
.tabs span {
	font-size: 20px;
	color: #666;
	padding-left: 50px;
	padding-right: 50px;
	line-height: 70px;
	border-top: 1px solid #ccc;
	border-right: 1px solid #ccc;
	border-top-right-radius: 6px;
	box-sizing: border-box;
	cursor: pointer;
	position: relative;
	background-color: #fff;
}
.tabs span:hover {color: #0D66EF; }
.tabs span:nth-of-type(n+1) {
	margin-left: -6px;
}
.tabs span:nth-of-type(1){z-index: 3;}
.tabs span:nth-of-type(2){z-index: 2;}
.tabs span:nth-of-type(3){z-index: 1;}
.tabs span.active {background-color: #0D66EF; color: #fff; font-size: 24px; border-color: #0D66EF;}
.tabs button {position: absolute; right: 25px; top: 15px; height: 40px; background-color: #3283FF; border: none; border-radius: 20px; font-size: 16px; color: #fff; width: 120px; cursor: pointer;}
.tabs button:hover {background-color: #0044ad;}

.statistics {height: 100px; line-height: 100px; font-size: 24px; padding-left: 55px; padding-right: 55px; display: flex; justify-content: space-between;}
.statistics > div {display: flex;}

.records {padding-bottom: 50px;}
.records .item{display: flex; justify-content: space-between; line-height: 55px; border-bottom: 1px solid #ccc; font-size: 16px; color: #666; line-height: 55px; margin-left: 55px; margin-right: 55px;}
.records .item.header {margin-left: 0; margin-right: 0; box-shadow: 0 0 5px rgba(0,0,0,.2); padding: 0 55px; border-bottom: none; color: #333; font-size: 18px;}
.records .item span {width: 300px;}
.records .item span:last-of-type {width: 120px;}

.tabpane-mining .records .item span:last-of-type {width: 200px;}

.overview {padding: 60px 70px;}
.overview .row {display: flex; }
.overview .row > div {flex: 5; display: flex; flex-wrap: wrap; font-size: 20px;}
.overview .row > div:nth-of-type(2) {flex: 6; border-left: 1px solid #ccc; border-right: 1px solid #ccc; padding-left: 90px;}
.overview .row > div:nth-of-type(3) {padding-left: 70px;}
.overview .row > div p {width: 100%; font-size: 26px; margin-top: 25px;}
.overview .sepline {border-top: 1px solid #ccc; margin-top: 35px;}


.tips{display: flex;justify-content: center;position: relative;width: 18px;height: 18px; margin-left: 5px; margin-right: 5px;}
.tips-icon{width: 18px;height: 18px;font-weight: bold;font-size: 12px;line-height: 18px;color: #fff;text-align: center;background-color: #ccc;border-radius: 50%;cursor: help;}
.tips-text{display: none;position: absolute;top: -32px;height: 24px;padding-left: 12px;padding-right: 12px;font-size: 12px;line-height: 24px;color: #fff;white-space: nowrap;background-color: #3182FF;border-radius: 4px;}
.tips-text:before{content: "";position: absolute;bottom: -6px;left: 50%;width: 0;height: 0;margin-left: -6px;border-width: 6px 6px 0 6px;border-style: solid;border-color: #3182FF transparent transparent transparent;}
.tips-icon:hover + .tips-text{display: block;}

.statistics .tips {margin-top: 41px;}
.overview .tips {margin-top: 3px;}

.nodata{text-align: center;}
.nodata .nodata-icon{height: 80px;line-height: 80px;font-size: 40px;color: #A1A1A1;}
.nodata .nodata-text{height: 40px;line-height: 20px;color: #A1A1A1;}

</style>

