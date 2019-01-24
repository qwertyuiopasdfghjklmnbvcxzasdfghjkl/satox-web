<!-- 投票挖矿管理 -->
<template>
	<Card>
		<p slot="title">数据统计</p>
		<Table border :columns="users.columns" :data="users.data"></Table>
        <Page :current="users.page" :total="users.total" :page-size="users.size" @on-change="changePage" style="text-align:center;margin-top:20px;"></Page>
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
					{title:'总投票用户数', key:'userCount'},
					{title:'总投票笔数', key:'voteCount'},
					{title:'总投票金额', key: 'voteAmount'},
					{title:'日投票用户数', key: 'dailyUserCount'},
					{title:'日新增笔数', key: 'dailyVoteCount'},
					{title:'日新增投票金额', key: 'dailyVoteAmount'}
				],
				data:[]
			},
		}
  },
  created () {
		this.getStatisticsList();
  },
  methods: {
  	changePage(page){
  		this.users.page = page
  		this.getStatisticsList()
  	},
  	getStatisticsList(){
  		voteApi.statisticsList({page:this.users.page, size:this.users.size},res=>{
				this.users.data = [res.data]
				this.users.total = res.total
  		})
		},
  }
}

</script>

