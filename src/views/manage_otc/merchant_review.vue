<!-- 商家审核 -->
<template>
  <Card>
    <p slot="title">商家审核
        <span class="refresh" @click="page=1;username='';getShopsList()"></span>
    </p>
    <Row>
        <Col span="16">
            <Input style="width: 300px;" v-model="username" placeholder="如：123456@qq.com"></Input>
            <Button type="primary" @click="page=1;getShopsList()">查询</Button>
        </Col>
        <Col>
            <Col span="8">
              
            </Col>
        </Col>
    </Row>
    <Table :columns="columns" :data="data" style="margin-top:10px;"></Table>
    <Page :current="page" :total="total" @on-change="changePage" :page-size="size" style="text-align:center;margin-top:20px;"></Page>  
  </Card>
</template>

<script>
import util from '../../libs/util';
import shopsApi from '../../api/shops'
export default {
  data () {
    return {
        single: false,
        page: 1, 
        total: 0,
        size:20,
        username: '',
        columns: [
            {title: '用户名', key: 'username'},
            {title: '手机号', key: 'mobile'},
            {title: '微信号码', key: 'wechat'},
            {title: 'QQ号码', key: 'qq'},
            {title: 'Email', key: 'email'},
            {title: '社区', key: 'community'},
            {title: '状态', key: 'status', render: (h, params) => {
                let status = params.row.state===0?'red':(params.row.state===3?'green':'#666'),
                text = params.row.state===0?'未通过':(params.row.state===3?'已通过':'未审核')
                return h('span', {
                    style:{color:status}
                }, text)
            }},
            {title: '审核处理', key: 'action', render: (h, params) => {
                return h('div', [
                    h('Button', {
                        props: {type: 'success', size: 'small'},
                        style: {display:(params.row.state===0 || params.row.state===3)?'none':''},
                        on: {
                            click: () => {
                                this.$Modal.confirm({
                                    title: '确认框',
                                    content: '<h3>确认后将无法更改，是否确认审核通过？</h3>',
                                    closable:true,
                                    onOk: () => {
                                        this.shopsUpdate(params.row.userId, 3);
                                    }
                                });
                            }
                        }
                    }, '通过'),
                    h('Button', {
                        props: {type: 'error', size: 'small'},
                        style: {marginLeft:'10px', display:(params.row.state===0 || params.row.state===3)?'none':''},
                        on: {
                            click: () => {
                                this.$Modal.confirm({
                                    title: '确认框',
                                    content: '<h3>确认后将无法更改，是否确认审核未通过？</h3>',
                                    closable:true,
                                    onOk: () => {
                                        this.shopsUpdate(params.row.userId, 0);
                                    }
                                });
                            }
                        }
                    }, '未通过')
                ]);
            }}
        ],
        data: []  
    }
  },
  created () {
      this.getShopsList()
  },
  methods: {
    shopsUpdate(userId, state){
        shopsApi.shopsUpdate({userId:userId, state:state}, res=>{
            this.$Message.success('设置成功');
            this.getShopsList()
        },msg=>{
            this.$Message.error(msg);
        })
    },
    getShopsList(){
        shopsApi.shopsList({page:this.page, size:this.size, username:this.username},data=>{
            this.total = data.total
            this.data = data.data
        })
    },
    changePage (page) {
        this.page = page
        this.getShopsList()
    }
  }
}
</script>

<style lang="less" scoped>
.refresh{width: 49px;height: 24px;background: url(../../images/frsh.png) center/cover no-repeat;background-size: contain;cursor: pointer;color: #2d8cf0;}
.ivu-card-head-inner, .ivu-card-head p{display: flex !important;justify-content: space-between  !important;height: 40px !important; line-height: 40px !important;}
</style>
