<!-- 投票挖矿管理 -->
<template>
	<Card>
		<p slot="title">用户投票挖矿查询</p>
		<Row>
			<Col span="16">
				<Select v-model="formData.type" style="width:200px;">
					<Option value="username">用户名</Option>
					<Option value="mobile">手机号</Option>
					<Option value="accountId">投票账户ID</Option>
				</Select>
				<Input v-model="formData.text" clearable style="width: 200px" placeholder="请输入..."></Input>
				<Button type="primary" @click="users.page=1;getVoteMinerList()">查询</Button>
			</Col>
		</Row>
		<Table border :columns="users.columns" :data="users.data" style="margin-top:20px;"></Table>
        <Page :current="users.page" :total="users.total" :page-size="users.size" @on-change="userschangePage" style="text-align:center;margin-top:20px;"></Page>
		<Modal
			width="1000"
	        v-model="showModal"
	        :title="modalTitle+'记录'"
	        :mask-closable='false'
			class-name='z-top'
	        >
			<Card>
				<Row>
					<Col span="8">
					累计收益：{{poolRecordList.data.communityGive || 0}}
					</Col>
					<Col span="8">
					预估收益：{{poolRecordList.data.estimateAmount || 0}}
					</Col>
				</Row>
			</Card>
			<Table border :columns="voteRecordList.columns" :data="voteRecordList.data" style="margin-top:20px;"></Table>
        	<Page :current="voteRecordList.page" :total="voteRecordList.total" :page-size="voteRecordList.size" @on-change="votechangePage" style="text-align:center;margin-top:20px;"></Page>
	        
			<div slot="footer">
				<Button @click="showModal=false">取消</Button>
			</div>
	    </Modal>
		<Modal
			width="1000"
	        v-model="poolModal"
	        :title="modalTitle+'记录'"
	        :mask-closable='false'
			class-name='z-top'
	        >
			<Card>
				<Row>
					<Col span="6">
					矿池人数：{{poolRecordList.count.userCount || 0}}
					</Col>
					<Col span="6">
					每日收益：{{poolRecordList.count.dailyProfit || 0}}
					</Col>
					<Col span="6">
					累计收益：{{poolRecordList.count.totalProfit || 0}}
					</Col>
					<Col span="6">
					预估收益：{{poolRecordList.count.estimateProfit || 0}}
					</Col>
				</Row>
			</Card>
			<Table border :columns="poolRecordList.columns" :data="poolRecordList.data" style="margin-top:20px;"></Table>
        	<Page :current="poolRecordList.page" :total="poolRecordList.total" :page-size="poolRecordList.size" @on-change="poolchangePage" style="text-align:center;margin-top:20px;"></Page>
	        
			<div slot="footer">
				<Button @click="poolModal=false">取消</Button>
			</div>
	    </Modal>
		
	</Card>
</template>

<script>
import util from '../../libs/util';
import Cookies from 'js-cookie';
import voteApi from '@/api/vote'
export default {
  data () {
    return {
    	showModal:false,
    	poolModal:false,
		modalType:'vote',
    	formData:{
    		type:'username',
    		text:''
		},
		users:{
			usersname: '',
			mobile: '',
			accountId: '',
			page:1,
			size:10,
			total:0,
			columns:[
				{title: '用户名', key: 'username'},
				{title: '手机号', key: 'mobile'},
				{title: '投票账户ID', key: 'accountId'},
				{title: '投票账户等级', key: 'lv'},
				{title: '投票账户总金额', key: 'totalBalance'},
				{title: '投票账户可用金额', key: 'availableBalance'},
				{title: '投票账户冻结金额', key: 'frozenBalance'},
				{title: '邀请人手机号', key: 'invitePhone'},
				{
					title: '操作', 
					key: 'dailyVoteAmount',
					width: 210,
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('Button', {
								props: {
									type: 'primary'
								},
								style: {
									marginRight: '5px',
								},
								on: {
									click: () => {
										this.voteRecord(params.index)
									}
								}
							},'投票记录'),
							h('Button', {
								props: {
									type: 'primary'
								},
								on: {
									click: () => {
										this.poolRecord(params.index)
									}
								}
							}, '挖矿记录')
						])
					}
				},
			],
			data:[],
		},
		voteRecordList:{
			usersname: '',
			page:1,
			size:10,
			total:0,
			columns:[
				{title:'投票记录ID', key:'accountId'},
				{title:'投票数量', key:'amount'},
				{title:'期限', key: 'voteAmount'},
				{title:'预估收益', key: 'estimateAmount'},
				{title:'结算日', key: 'completeTime'},
				{title:'创建时间', key: 'createdAt'}
			],
			data:[]
		},
		poolRecordList:{
			usersname: '',
			page:1,
			size:10,
			total:0,
			count:[],
			columns:[
				{title:'昵称', key:'nickname'},
				{title:'手机号', key:'mobile'},
				{title:'投票时间', key: 'completeTime', width: 150},
				{title:'矿池记录ID', key: 'string'},
				{title:'预期数量', key: 'estimateAmount'},
				{title:'已发放数量', key: 'giveAmount'},
				{title:'创建时间', key: 'createdAt', width: 150}
			],
			data:[]
		},
	}
  },
  computed:{
  	modalTitle(){
  		return this.modalType==='vote'?'投票':'矿池'
  	}
  },
  created () {
  	this.getVoteMinerList()
  },
  methods: {
	//总列表记录
  	userschangePage(page){
  		this.users.page = page
  		this.getVoteMinerList()
  	},
  	getVoteMinerList(){
		var ss = this.formData.type
		console.log(this.formData.text,this.formData.type )
  		voteApi.voteMinerQuery(
			{
				page:this.users.page, 
				size:this.users.size, 
				usersname:this.formData.text, 
			},
			res=>{
  			this.users.total = res.total
  			this.users.data = res.data
  		})
	},

	//投票记录
  	votechangePage(page){
  		this.voteRecordList.page = page
  		this.getVoteRecordList()
  	},
	voteRecord(index) {
		this.voteRecordList.page = 1
		this.modalType = 'vote'
		this.showModal = true
		this.voteRecordList.usersname = this.users.data[index].username
		this.getVoteRecordList()
	},
  	getVoteRecordList(){
  		voteApi.voteRecord({page:this.voteRecordList.page, size:this.voteRecordList.size, username:this.voteRecordList.usersname},res=>{
  			this.voteRecordList.total = res.total
  			this.voteRecordList.data = res.data
  		})
	},

	//挖矿记录
  	poolchangePage(page){
  		this.voteRecordList.page = page
  		this.getPoolRecordList()
  	},
	poolRecord(index) {
		this.poolRecordList.page = 1
		this.modalType = 'pool'
		this.poolModal = true
		this.poolRecordList.usersname = this.users.data[index].username
		this.getPoolRecordList()
	},
  	getPoolRecordList(){
  		voteApi.poolRecord({page:this.poolRecordList.page, size:this.poolRecordList.size, username:this.poolRecordList.usersname},res=>{
  			this.poolRecordList.total = res.total
			this.poolRecordList.data = res.data.list
			this.poolRecordList.count = res.data
  		})
	},

  }
}

</script>


<style lang="less" scoped>
.ivu-modal-wrap.z-top{z-index: 1003;}
</style>