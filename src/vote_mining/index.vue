<template>
  <div class="container">
    <div class="block banner"></div>
    <div class="block main">
    	<div class="content">
    		<div class="join-form" :class="{en:getLang==='en'}">
    			<div class="form-item flex">
    				<p><span>*</span>{{$t('business.CHOOSE_COMMUNITY')}}：</p>
    				<p>
    					<input type="text" name="community" readonly="" v-model="formData.community[1]" :placeholder="$t('business.CHOOSE_YOUR_COMMUNITY')" @click="showCommunities=!showCommunities">
    					<ul class="communities" v-show="showCommunities">
    					  <li v-for="item of communities" @click="formData.community=item;showCommunities=false">{{item[1]}}</li>
    					</ul>
    				</p>
    			</div>
    			<div class="form-item flex">
    				<p>{{$t('business.INVITE_MOBILE')}}：</p>
    				<p><input type="text" name="mobile"  v-model="formData.mobile" :placeholder="$t('business.INVITE_MOBILE_PLACEHOLDER')"></p>
    			</div>
    			<div class="form-item">
    				<p><span>*</span>{{$t('business.TICKET_PERIOD')}}：</p>
    				<ul class="period">
    					<li class="active">
    						<i></i>
    						<span>{{$t('business.TICKET_PERIOD_1')}}</span>
    						<span></span>
    						<span>{{$t('business.TICKET_PERIOD_1_INCOME')}}</span>
    					</li>
    					<li>
    						<i></i>
    						<span>{{$t('business.TICKET_PERIOD_2')}}</span>
    						<span></span>
    						<span>{{$t('business.TICKET_PERIOD_2_INCOME')}}</span>
    					</li>
    					<li>
    						<i></i>
    						<span>{{$t('business.TICKET_PERIOD_3')}}</span>
    						<span></span>
    						<span>{{$t('business.TICKET_PERIOD_3_INCOME')}}</span>
    					</li>
    				</ul>
    			</div>
    			<div class="form-item flex">
    				<p><span>*</span>{{$t('business.VOTE_NUM')}}：</p>
    				<p><input type="text" name="votes"  v-model="formData.votes" :placeholder="$t('business.VOTE_NUM_PLACEHOLDER')"></p>
    			</div>
    			<div class="mt50"><button type="button" class="btn-enjoy">{{$t('business.ENJOY')}}</button></div>
    			<div class="mt45 fs32 text-center gray">
    				{{$t('business.NOT_VOTE')}}<span class="blue pointer">{{$t('business.VIEW_EARNINGS')}}</span>
    			</div>
    		</div>
    		<div class="rules">
    			<h1 class="mt70">{{$t('business.ACTIVITY_RULES')}}</h1>
    			<article class="mt45 fs26">
    				<p>1. {{$t('business.ACTIVITY_RULE_1')}}</p>
    				<p>2. {{$t('business.ACTIVITY_RULE_2')}}<br />{{$t('business.ACTIVITY_RULE_2_a')}}<br />{{$t('business.ACTIVITY_RULE_2_b')}}</p>
    				<p>{{$t('business.ACTIVITY_RULE_2_b_n')}}</p>
    				<p>3. {{$t('business.ACTIVITY_RULE_3')}}<br />{{$t('business.ACTIVITY_REMARK_1')}}<br />{{$t('business.ACTIVITY_REMARK_2')}}</p>
    			</article>
    		</div>
    		
    	</div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'vote_mining_index',
    components: {
      
    },
    data(){
    	return {
    		formData:{
    			community:['',''],
    			votes:''
    		},
    		showCommunities:false,
    		communities:[
    		  ['1',this.$t('business.QILIN_VILLA')],
    		  ['2',this.$t('business.QINGFU_COMMUNITY')],
    		  ['3',this.$t('business.ASIA_PACIFIC_COMMUNITY')],
    		  ['4',this.$t('business.PHANTOM_COMMUNITY')],
    		  ['5',this.$t('business.ZILONG_COMMUNITY')],
    		]
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
.container{width:100%;min-height:calc(100% - 60px); background-color: #300273;}
.block {min-width: 1200px; max-width: 1920px; }
.banner::before {
	content: '';
	display: block;
	padding-bottom: 34.375%;
	background: url('../assets/images/vote_mining/banner_index.jpg') no-repeat center top;
	background-size: cover;
}
.main {
	background: url('../assets/images/vote_mining/bg.jpg') no-repeat center top;
	background-size: cover;
	min-height: 350px;
}
.content {width: 1080px; margin-left: auto; margin-right: auto; padding-top: 100px;}
.join-form {
	background-color: #fff;
	border-radius: 15px;
	padding: 100px 45px 45px;
	position: relative;
	font-size: 32px;
}
.join-form::before{
	content: '';
	position: absolute;
	width: 290px;
	height: 90px;
	top: -45px;
	left: 0;
	right: 0;
	margin-left: auto;
	margin-right: auto;
	box-shadow: 0 2px 12px rgba(0,0,0,.3);
	z-index: 1;
	border-radius: 45px;
	background: url('../assets/images/vote_mining/vote_mining_title.png') #fff no-repeat center center;
}
.join-form.en::before {
	background-image: url('../assets/images/vote_mining/vote_mining_title_en.png');
}
.form-item {min-height: 90px; line-height: 90px; border-bottom: 1px solid #ccc;}
.form-item.flex {display: flex;}
.form-item p {position: relative;}
.form-item.flex p:last-of-type {margin-left: 20px; flex: 1;}
.form-item p span {color: #FF0000;}
.form-item p input {height: 50px; font-size: 30px; width: 100%; text-align: right; box-sizing: border-box;}
.form-item p input[name='community'] {background: url('../assets/images/vote_mining/arrow-down-blue.png') no-repeat right center; padding-right: 40px;}
.communities {position: absolute; right: 0; background-color: #fff; padding: 20px 35px; box-shadow: 0 2px 10px rgba(0,0,0,.3); font-size: 24px; z-index: 1;}
.communities li {line-height: 70px; border-bottom: 1px solid #ccc; color: #666; cursor: pointer;}
.communities li:hover {color: #333;}
.communities li:last-of-type {border-bottom: none;}

.period {width: 100%; font-size: 28px;}
.period li {margin-left: 65px; position: relative; line-height: 80px; border-bottom: 1px solid #ccc; color: #666; display: flex; justify-content:  space-between; cursor: pointer;}
.period li:last-of-type {border-bottom: none;}
.period li span:nth-of-type(2){flex: 1; background: url('../assets/images/vote_mining/dot_bg_gray.png') repeat-x center; margin-left: 10px; margin-right: 10px;}
.period i {position: absolute; left: -65px; top: 25px; width: 30px; height: 30px; border: 2px solid #ccc; border-radius: 100%;}
.period li.active {color: #0069F9;}
.period li.active span:nth-of-type(2) {background-image: url('../assets/images/vote_mining/dot_bg_blue.png');}
.period li.active i{border-color: #00A2FF; background-color: #00A2FF;}
.period li.active i::before {position: absolute; content: ''; width: 16px; height: 8px; left: 6px; top: 7px; border-bottom: 3px solid #fff; border-left: 3px solid #fff; transform: rotate(-45deg);}

.btn-enjoy {height: 85px; border: none; width: 100%; color: #fff; font-size: 32px; border-radius: 40px; background-color: #005AE4; cursor: pointer;}
.btn-enjoy:hover {background-color: #0044ad;}

.rules {color: #BAFEFF;}
.rules p {line-height: 1.5; padding-bottom: 45px;}
</style>

