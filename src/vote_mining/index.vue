<template>
  <div class="container">
    <div class="block banner"></div>
    <div class="block main">
    	<div class="content">
    		<div class="join-form" :class="{en:getLang==='en'}">
    			<div class="form-item flex">
    				<p><span>*</span>{{$t('business.CHOOSE_COMMUNITY')}}：</p>
    				<p>
    					<input type="text" name="community" readonly="" v-model="formData.communityId" :placeholder="$t('business.CHOOSE_YOUR_COMMUNITY')" @click="showCommunities=!showCommunities">
    					<ul class="communities" v-show="showCommunities">
    					  <li v-for="item in voteInfo.communities" @click="formData.communityId=item.communityName;showCommunities=false">{{item.communityName}}</li>
    					</ul>
    				</p>
    			</div>
    			<div class="form-item flex">
    				<p>{{$t('business.INVITE_MOBILE')}}：</p>
    				<p><input type="number" name="mobile" v-model="formData.invitePhone" :readonly="voteInfo.invitePhone" :placeholder="$t('business.INVITE_MOBILE_PLACEHOLDER')"></p>
    			</div>
    			<div class="form-item">
    				<p><span>*</span>{{$t('business.TICKET_PERIOD')}}：</p>
    				<ul class="period">
    					<li v-for="period in voteInfo.periods" :class="{active:period.votePeriodId===formData.periodId}" @click="formData.periodId=period.votePeriodId">
    						<i></i>
    						<span>{{period.name+$t('business.TICKET_PERIOD_1')}}</span>
    						<span></span>
    						<span>{{$t('business.TICKET_PERIOD_1_INCOME')+period.rate}}%</span>
    					</li>
    				</ul>
    			</div>
    			<div class="form-item flex">
    				<p><span>*</span>{{$t('business.VOTE_NUM')}}：</p>
    				<p><input type="number" name="amount"  v-model="formData.amount" :placeholder="votesPlaceholder"></p>
    			</div>
    			<div class="mt50"><button type="button" class="btn-enjoy" @click="enjoyVote">{{$t('business.ENJOY')}}</button></div>
    			<div class="mt45 fs32 text-center gray">
    				{{$t('business.NOT_VOTE')}}<router-link :to="{name:'vote_mining_profile'}" tag="span" class="blue pointer">{{$t('business.VIEW_EARNINGS')}}</router-link>
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
import Vue from 'vue'
import { mapGetters } from 'vuex'
import voteMiningApi from '@/api/voteMining'
import userUtils from '@/api/wallet'
import userApi from '@/api/individual'
import utils from '@/assets/js/utils'
import googleAuth from '@/public/dialog/googleauth'
import smswithdraw from '@/public/dialog/smswithdraw'
import myApi from '@/api/user'

export default {
    name: 'vote_mining_index',
    components: {
      
    },
    data(){
    	return {
            googleState: 0,
            mobileState: 0,
    		formData:{
                symbol:'',
    			communityId:'',
                invitePhone:'',
                periodId:'',
                amount:'',
                secondaryValidateDTO:{
                    type:1,
                    password:'',
                    smsCode:'',
                    rsaPublicKey:'',
                    googleCode:''
                }
    		},
    		showCommunities:false,
    		voteInfo:{
                communities:[],
                periods:[],
                invitePhone:'',
                phone:'',
                symbols:''
            },
            assets:[]
    	}
    },
    computed: {
      ...mapGetters(['getApiToken', 'getLang','getUserInfo']),
      votesPlaceholder(){
        return this.$t('business.VOTE_NUM_PLACEHOLDER')+'，'+this.voteInfo.symbols + this.$t('account.estimated_value_available')+' '+this.balance
      },
      balance(){
        let balance = 0
        for(let item of this.assets){
            if(item.type===2 && item.symbol===this.voteInfo.symbols){
                balance = item.availableBalance
                break
            }
        }
        return Number(balance)
      },
    },
    created () {
      this.getVoteInfo()
      if(this.getApiToken){
        this.getList()
        this.getUserState()
      }
      
    },
    watch:{
        'formData.invitePhone'(_n, _o){
            this.formData.invitePhone = _n.trim()
        }
    },
    methods:{
        enjoyVote(){
            if(!this.getApiToken){
                Vue.$koallTipBox({icon: 'notification', message: this.$t('business.public293')})
                return
            }
            if(!this.formData.communityId){
                Vue.$koallTipBox({icon: 'notification', message: this.$t('business.CHOOSE_YOUR_COMMUNITY')})
                return
            }
            if(this.formData.invitePhone){
                if(!/^\d{11}$/.test(this.formData.invitePhone)){
                    Vue.$koallTipBox({icon: 'notification', message: this.$t('public0.public128')})
                    return
                }
            }
            if(Number(this.formData.amount)<10000){
                Vue.$koallTipBox({icon: 'notification', message: this.$t('public0.public290')})
                return
            }
            if(Number(this.formData.amount)>this.balance){
                Vue.$koallTipBox({icon: 'notification', message: this.$t('public0.public292')})
                return
            }
            if(!(Number(this.formData.amount)%1000===0)){
                Vue.$koallTipBox({icon: 'notification', message: this.$t('public0.public291')})
                return
            }

            if (this.googleState !== 1 && this.mobileState !== 1) {
              Vue.$confirmDialog({
                id: 'GOOGLEAUTH_OR_SMSAUTH_FIRST',
                showCancel: false,
                content: this.$t('error_code.GOOGLE_CELLPHONE_AUTH_FIRST'), // 请先进行谷歌验证或短信验证
                okCallback: () => {
                  this.$router.push({name: 'mycenter_menu', params: {menu: 'safety'}})
                }
              })
              return
            }
            if (!this.getUserInfo.email && this.mobileState !== 1) {
              Vue.$confirmDialog({
                id: 'SMS_AUTH_FIRST',
                showCancel: false,
                content: this.$t('error_code.CELLPHONE_AUTH_FIRST'), // 请先进行短信验证
                okCallback: () => {
                  this.$router.push({name: 'mycenter_menu', params: {menu: 'safety'}})
                }
              })
              return
            }

            // 二次验证
            utils.setDialog(this.mobileState === 1 ? smswithdraw : googleAuth, {
              authType: 'getCode',
              isWithdrawal: true,
              okCallback: (code) => {
                if (typeof code === 'string') {
                  // 谷歌验证提现
                  this.formData.secondaryValidateDTO.googleCode = code
                  this.formData.secondaryValidateDTO.type = 0
                  this.postVote()
                } else {
                  // 手机短信验证提现
                  for (let i in code) {
                    this.formData.secondaryValidateDTO[i] = code[i]
                  }
                  myApi.getRsaPublicKey((rsaPublicKey) => {
                    this.formData.secondaryValidateDTO.password = utils.encryptPwd(rsaPublicKey, this.formData.secondaryValidateDTO.password)
                    this.formData.secondaryValidateDTO.rsaPublicKey = rsaPublicKey
                    this.postVote()
                  })
                }
              }
            })

        },
        postVote(){
            let _data = JSON.parse(JSON.stringify(this.formData))
            for(let item of this.voteInfo.communities){
              if(_data.communityId===item.communityName){
                _data.communityId = item.communityId
                break
              }
            }
            voteMiningApi.postVote(_data, res=>{
              this.$router.push({name:'vote_mining_profile'})
            }, msg=>{
                Vue.$koallTipBox({icon: 'notification', message: this.$t('error_code.'+msg)})
            })
        },
        merchant_name(level){
          return this.$t(`business.MERCHANT_LEVEL_${level}`)
        },
        getVoteInfo(){
          voteMiningApi.getVoteInfo(res=>{
            this.voteInfo = res
            this.formData.invitePhone = res.invitePhone?res.invitePhone:''
            this.formData.symbol = res.symbols
            this.formData.periodId = res.periods[0].votePeriodId
          })
        },
        getList () {
          userUtils.myAssets({}, (data) => {
            this.assets = data
          })
        },
        getUserState(){
            // 获取当前用户状态信息
            userApi.getUserState((data) => {
              this.googleState = data.googleState
              this.mobileState = data.mobileAuthState
            }, (msg) => {
              console.error(msg)
            })
        }
    }
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

