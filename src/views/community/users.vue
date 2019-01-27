<!-- 社区管理 -->
<template>
	<Card>
		<p slot="title">社区管理
			<span class="refresh" @click="users.page=1;formData.text='';getCommunityList()"></span>
		</p>
		<Row>
			<Col span="16">
				<Select v-model="formData.type" style="width:200px;">
					<Option value="name">社区名称</Option>
				</Select>
				<Input v-model="formData.text" clearable style="width: 200px" placeholder="请输入..."></Input>
				<Button type="primary" @click="users.page=1;getCommunityList()">查询</Button>
			</Col>
			<Col span="8" class="text-right">
				<Button type="primary" html-type="button" @click="modalType='add';showModal=true">新增</Button>
			</Col>
		</Row>
		<Table :columns="users.columns" :data="users.data" style="margin-top:20px;"></Table>
		<Page :current="users.page" :total="users.total" :page-size="users.size" @on-change="changePage" style="text-align:center;margin-top:20px;"></Page>
		<Modal
	        v-model="showModal"
	        :title="modalTitle+'社区'"
			:loading="loading"
	        :mask-closable='false'
	        ok-text="保存"
	        @on-ok="subModal">
	        <Form ref="modalLayer" :model="modalData" :label-width="100" :rules="ruleValidate">
                <FormItem label="社区名称" prop="communityName">
                    <Input v-model="modalData.communityName" placeholder="请输入社区名称"></Input>
                </FormItem>
                <FormItem label="控制用户名" prop="username">
                    <Input v-model="modalData.username" placeholder="请输入控制用户名"></Input>
                </FormItem>
            </Form>
			<div slot="footer">
				<Button @click="showModal=false">取消</Button>
				<Button @click="subModal()" type="primary" >保存</Button>
			</div>
	    </Modal>
	</Card>
</template>

<script>
import util from '../../libs/util';
import Cookies from 'js-cookie';
import communityApi from '@/api/community'

export default {
  data () {
    return {
    	showModal:false,
		modalType:'add',
		loading:true,
    	formData:{
    		type:'name',
    		text:''
    	},
    	modalData:{
    		communityId:'',
    		communityName:'',
    		username:''
    	},
    	users:{
    		page:1,
    		size:20,
    		total:0,
    		columns:[
    			{title:'社区ID', key:'communityId'},
    			{title:'社区名称', key:'communityName'},
    			{title:'控制用户', key:'username', width:200},
    			{title:'每日收益', key:'dailyProfit'},
    			{title:'累计收益', key:'totalProfit'},
    			{title:'预估收益', key:'estimateProfit'},
    			{title:'社区成员数', key:'membersNumber'},
    			{title:'社区收益总额', key:'myProfit'},
    			{title:'社区成员收益总额', key:'memberProfit'},
    			{title:'添加时间', key:'createdAt', width:200},
    			{title:'操作', key:'action', fixed:'right', render:(h, params) => {
    				return h('Button', {
    					props:{
    						type:'primary',
    						'html-type':'button'
    					},
    					on:{
    						click: () => {
								this.editShow(params.row)
    						}
    					}
    				}, '修改')
    			}}
    		],
    		data:[],
    	},
    	ruleValidate: {
           communityName: [
               { required: true, message: '社区名称不能为空', trigger: 'blur' }
           ],
           username: [
               { required: true, message: '控制用户名不能为空', trigger: 'blur' }
           ]
       }
    }
  },
  computed:{
  	modalTitle(){
  		return this.modalType==='add'?'新增':'修改'
  	},
  },
  created () {
	  this.getCommunityList()
  },
  methods: {
  	subModal(){
  		this.$refs.modalLayer.validate((valid) => {
            if (valid) {
                if(this.modalType==='add'){
					this.communityAdd()
				} else {
					this.communityModify()
				}
            } else {
                
            }
        })
  		// this.showModal = false
	},
	communityAdd(){
		communityApi.communityAdd(this.modalData, res=>{
			this.$Message.success('添加成功!');
			this.getCommunityList()
			this.modalData.communityId = ''
			this.modalData.communityName = ''
			this.modalData.username = ''
			this.showModal=false
		}, msg=>{
			this.$Message.error(msg);
		})
	},
	communityModify(){
		communityApi.communityModify(this.modalData, res=>{
			this.$Message.success('修改成功!');
			this.getCommunityList()
			this.modalData.communityId = ''
			this.modalData.communityName = ''
			this.modalData.username = ''
			this.showModal=false
		}, msg=>{
			this.$Message.error(msg);
		})
	},
  	changePage(page){
  		this.users.page = page
  		this.getCommunityList()
  	},
  	getCommunityList(){
  		communityApi.communityList({page:this.users.page, size:this.users.size, keyword:this.formData.text},res=>{
  			this.users.total = res.total
			this.users.data = res.data
  		})
	},
	editShow(row){
    console.log(row)
		this.modalType = 'edt'
		this.showModal = true
    this.modalData.communityId = row.communityId
		this.modalData.username = row.username
		this.modalData.communityName = row.communityName
	}
  }
}
</script>

<style lang="less" scoped>
body /deep/ .text-right {text-align: right;}

.refresh{width: 49px;height: 24px;background: url(../../images/frsh.png) center/cover no-repeat;background-size: contain;cursor: pointer;color: #2d8cf0;}
.ivu-card-head-inner, .ivu-card-head p{display: flex !important;justify-content: space-between  !important;height: 40px !important; line-height: 40px !important;}
</style>
