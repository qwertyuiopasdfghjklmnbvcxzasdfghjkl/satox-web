<!-- 申诉管理 -->
<template>
    <Row>
      <Card>
          <p slot="title">申诉管理
            <span class="refresh" @click="unprocessed"></span>
          </p>
          <Row>
            <Col span="6">
              申诉管理：<Checkbox v-model="single" @on-change = "curPage=1;unprocessed()">只显示待处理</Checkbox>
            </Col>
            <Col span="6">申诉编号排序：
              <RadioGroup v-model="orderNumber" @on-change="setOrderNumberSort">
                  <Radio label="">默认</Radio>
                  <Radio label="asc">升序</Radio>
                  <Radio label="desc">降序</Radio>
              </RadioGroup>
            </Col>
            <Col span="6">申诉时间排序：
              <RadioGroup v-model="createdAt" @on-change="setCreatedAtSort">
                  <Radio label="">默认</Radio>
                  <Radio label="asc">升序</Radio>
                  <Radio label="desc">降序</Radio>
              </RadioGroup>
            </Col>
          </Row>
      </Card>
      <Card v-for="(data, index) in datas" :key="index" style="margin-top:10px;">
          <p slot="title" style="height:32px;line-height:32px;">
            申诉编号：{{data.msgNumber}}
            <Button type="primary" style="float:right;" @click="viewInfo(index)">申诉/被申诉人信息</Button>
          </p>
          <Table :columns="columns1" :data="[data]"></Table>
      </Card>
      <Page :current="curPage" :page-size="pageSize" :total="total" @on-change="changePage" style="text-align:center;margin-top:20px;"></Page>
    </Row>
</template>

<script>
import util from '../../libs/util';
import info from './appeals/info';
import vieworder from './appeals/vieworder';
import handle from './appeals/handle';
import otcApi from '../../api/otc'
import Cookies from 'js-cookie'
export default {
  data () {
    return {
      curPage: 1,
      pageSize: 5,
      total: 0,
      single: false,
      orderNumber:'',
      createdAt:'',
      columns1: [
        {title: '订单编号', key: 'orderNumber'},
        {title: '问题类型', key: 'appealTypeName'},
        {title: '申诉内容', key: 'description'},
        {title: '状态', key: 'state',
          render: (h, params) => {  // 0: 未处理  1:已处理  2：已取消  3：已审核
              return h('div',  this.switchStaus(params.row.state))
          }
        },
        {title: '申诉时间', key: 'createdAt'},
        {title: '操作', key: 'action', width: 300, render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {type: 'primary', size: 'small'},
              style: {marginRight: '10px'},
              on: {
                click: () => {
                  util.setDialog(vieworder, {
                    msgNumber: params.row.msgNumber
                  });
                }
              }
            }, '查看订单'),
            h('Button', {
              props: {type: 'primary', size: 'small',disabled:params.row.state !== 0 || !util.showThisRoute(['ROLE_ADMIN', 'ROLE_OTC_APPEAL', 'ROLE_OTC_AUDIT'], Cookies.get('roles')) && util.showThisRoute('ROLE_CUSTOMER', Cookies.get('roles')) },
              on: {
                click: () => {
                  util.setDialog(handle, {
                    winUserId: params.row.winUserId,
                    punishTypeId: params.row.punishTypeId,
                    appealManageId: params.row.appealManageId,
                    oppositeUserId: params.row.oppositeUserId,
                    userId: params.row.userId,
                    type: 'chuli',
                    okCallback: () => {
                      this.unprocessed()
                    }
                  });
                }
              }
            }, '处理')
          ]);
        }}
      ],
      datas: []
    }
  },
  created () {
    this.unprocessed()
  },
  methods: {
    setCreatedAtSort(){
      this.curPage = 1
      this.orderNumber = ''
      this.unprocessed()
    },
    setOrderNumberSort(){
      this.createdAt = ''
      this.unprocessed()
    },
    switchStaus(state) { 
        switch(state){// 0: 未处理  1:已处理  2：已取消  3：已审核
          case 0:
              return '未处理'
              break;
          case 1:
              return '已处理'
              break;
          case 2:
              return '已取消'
              break;
          case 3:
              return '已审核'
              break;
        }
    },
    viewInfo (index) {
      util.setDialog(info, {
        msgNumber: this.datas[index].msgNumber
      });
    },
    changePage (page) {
      this.curPage = page
      this.unprocessed()
    },
    unprocessed () {
      let data = {}
      if(this.orderNumber){
          data.sortKey = `orderNumber ${this.orderNumber}`
      }
      if(this.createdAt){
          data.sortKey = `createdAt ${this.createdAt}`
      }
      if (this.single) {
        data.state = 0
        otcApi.listAppealRequest(this.pageSize, this.curPage, data, (res, total) => {
          this.total = total
          this.datas = res
        })
      } else {
        otcApi.listAppealRequest(this.pageSize, this.curPage, data, (res, total) => {
          this.total = total
          this.datas = res
        })
      }
      
    }
  }
}
</script>

<style lang=" scoped>
.refresh{width: 49px;height: 24px;background: url(../../images/frsh.png) center/cover no-repeat;background-size: contain;cursor: pointer;color: #2d8cf0;}
.ivu-card-head-inner, .ivu-card-head p{display: flex !important;justify-content: space-between  !important;height: 40px !important; line-height: 40px !important;}
</style>
