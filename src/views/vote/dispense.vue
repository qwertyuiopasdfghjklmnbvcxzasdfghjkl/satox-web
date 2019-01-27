<!-- 投票挖矿管理 -->
<template>
	<Card>
		<p slot="title">挖矿分发记录</p>
			<Table border :columns="users.columns" :data="users.data"></Table>
      <Page :current="users.page" :total="users.total" :page-size="users.size" style="text-align:center;margin-top:20px;"></Page>
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
					{title:'矿池记录ID', key:'minerId'},
					{title:'用户名', key:'username'},
					{title:'投票记录ID', key: 'voteId'},
					{title:'预估数量', key: 'remainAmount'},
					{title:'已发放数量', key: 'giveAmount'},
					{title:'创建时间', key: 'createAt'}
				],
				data:[]
			},
		}
  },
  created () {
		this.getDisRecord();
  },
  methods: {
  	getDisRecord(){
  		voteApi.disRecord({page:this.users.page, size:this.users.size},res=>{
				this.users.data = res.data
				this.users.total = res.total
  		})
		},
  }
}

</script>

