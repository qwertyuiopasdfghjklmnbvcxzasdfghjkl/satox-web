<!-- 投票挖矿管理 -->
<template>
	<Card>
		<p slot="title">投票记录</p>
		<Table border :columns="users.columns" :data="users.data"></Table>
        <Page :current="users.page" :total="users.total" :page-size="users.size" @on-change="votechangePage" style="text-align:center;margin-top:20px;"></Page>
	</Card>
</template>

<script>
import util from '../../libs/util';
import Cookies from 'js-cookie';
import voteApi from '@/api/vote'
export default {
  data () {
    return {
			users:{
				page:1,
				size:10,
				total:0,
				columns:[
					{title:'投票记录ID', key:'accountId'},
					{title:'用户名', key:'userName'},
					{title:'社区', key: 'community'},
					{title:'投票数量', key: 'amount'},
					{title:'期限', key: 'voteTime'},
					{title:'预估收益', key: 'estimateAmount'},
					{title:'结算日', key: 'completeTime'},
					{title:'创建时间', key: 'createdAt'}
				],
				data:[]
			},
		}
  },
  created () {
		this.getVoteRecord();
  },
  methods: {
	//投票记录
  	votechangePage(page){
  		this.users.page = page
  		this.getVoteRecord()
  	},
  	getVoteRecord(){
  		voteApi.voteRecord({page:this.users.page, size:this.users.size},res=>{
				this.users.data = res.data
				this.users.total = res.total
  		})
		},
  }
}

</script>

