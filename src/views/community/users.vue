<!-- 社区用户管理 -->
<template>
	<Card>
		<p slot="title">社区用户管理
			<span class="refresh" @click="getCommunityUsers"></span>
		</p>
		<Row>
			<Col span="16">
				<Select v-model="formData.type" style="width:200px;">
					<Option value="name">社区名称</Option>
				</Select>
				<Input v-model="formData.text" clearable style="width: 200px"></Input>
				<Button type="primary" @click="getCommunityUsers">查询</Button>
			</Col>
			<Col span="8" class="text-right">
				<Button type="primary" html-type="button">新增</Button>
			</Col>
		</Row>
		<Table :columns="users.columns" :data="users.data" style="margin-top:20px;"></Table>
		<Page :current="users.page" :total="users.total" @on-change="users.changePage" style="text-align:center;margin-top:20px;"></Page>  
	</Card>
</template>

<script>
import util from '../../libs/util';
import Cookies from 'js-cookie';
export default {
  data () {
    return {
    	formData:{
    		type:'name',
    		text:''
    	},
    	users:{
    		page:1,
    		size:20,
    		total:0,
    		columns:[
    			{title:'社区ID', key:'communityId'},
    			{title:'社区名称', key:'communityName'},
    			{title:'控制用户', key:'controlUser'},
    			{title:'每日收益', key:'dailyProfit'},
    			{title:'累计收益', key:'totalProfit'},
    			{title:'预估收益', key:'estimateProfit'},
    			{title:'社区成员数', key:'memberNumber'},
    			{title:'社区收益总额', key:'communityTotalProfit'},
    			{title:'社区成员收益总额', key:'communityMemberTotalProfit'},
    			{title:'添加时间', key:'addTime'},
    			{title:'操作', key:'action', render:(h, params) => {
    				return h('Button', {
    					props:{
    						type:'primary',
    						'html-type':'button'
    					},
    					on:{
    						click(){
    							
    						}
    					}
    				}, '修改')
    			}}
    		],
    		data:[{}],
    		changePage(page){

    		}
    	}
    }
  },
  created () {
  },
  methods: {
  	getCommunityUsers(){

  	},
  }
}
</script>

<style lang="less" scoped>
/deep/ .text-right {text-align: right;}

.refresh{width: 49px;height: 24px;background: url(../../images/frsh.png) center/cover no-repeat;background-size: contain;cursor: pointer;color: #2d8cf0;}
.ivu-card-head-inner, .ivu-card-head p{display: flex !important;justify-content: space-between  !important;height: 40px !important; line-height: 40px !important;}
</style>
