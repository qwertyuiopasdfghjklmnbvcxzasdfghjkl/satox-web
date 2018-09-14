<!-- 审核管理 -->
<template>
    <Row>
        <Card>
            <p slot="title">审核管理
                <span class="refresh" @click="getRequestManage('1')"></span>
            </p>
            <Row>
              审核管理：<Checkbox v-model="single" @on-change="curPage=1;getRequestManage('1')">显示全部</Checkbox>
            </Row>
            <Table :columns="columns1" :data="datas1" style="margin-top:10px;"></Table>
            <Page :current="curPage" :total="total" @on-change="changePage" style="text-align:center;margin-top:20px;"></Page> 
        </Card>
      </Row>
</template>

<script>
import util from '../../libs/util';
import viewdetail from './auditing/viewdetail';
import handle from './appeals/handle';
import otcApi from '../../api/otc'
export default {
  data () {
    return {
      single: false,
      curPage: 1,
      total: 0,
      columns1: [
        {title: '申诉编号', key: 'msgNumber'},
        {title: '审核状态', key: 'state',
            render: (h, params) => { // 1：未审核   3：已审核
                return h('div', params.row.state == 1 ? '未审核': '已审核')
            }
        }, // 0,未处理//1:已处理)
        {title: '申诉类型', key: 'appealTypeName'},
        {title: '申诉结果', key: 'winUserId',
            render: (h, params) => { 
                return h('div', params.row.winUserId != params.row.userId ? '被申诉方胜利': '申诉方胜利')
            }
        },
        {title: '申诉管理员', key: 'appealMgrName'},
        {title: '处理时间', key: 'updatedAt'},
        {title: '操作', key: 'action', render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {type: 'primary', size: 'small'},
              style: {marginRight: '10px'},
              on: {
                click: () => {
                  util.setDialog(viewdetail, {
                    msgNumber: params.row.msgNumber
                  });
                }
              }
            }, '查看详情'),
            h('Button', {
              props: {type: 'primary', size: 'small', disabled: params.row.state == 3},
              style: {marginRight: '10px'},
              on: {
                click: () => {
                  otcApi.appealHandleSecond({
                    winUserId: params.row.winUserId,
                    punishTypeId: params.row.punishTypeId,
                    appealManageId:params.row.appealManageId
                  }, (res) => {
                    this.$Message.success({content: '申述处理完毕'})
                    this.getRequestManage()
                  }, (msg) => {
                    this.$Message.error({content: msg})
                  })
                }
              }
            }, '同意'),
            h('Button', {
              props: {type: 'primary', size: 'small', disabled: params.row.state == 3},
              on: {
                click: () => {
                  util.setDialog(handle, {
                    winUserId:params.row.winUserId,
                    punishTypeId: params.row.punishTypeId,
                    msgNumber: params.row.msgNumber,
                    oppositeUserId:params.row.oppositeUserId ,//卖
                    userId: params.row.userId, //买
                    appealManageId: params.row.appealManageId,
                    okCallback: () => {
                      this.getRequestManage()
                    }
                  });
                }
              }
            }, '修改')
          ]);
        }}
      ],
      datas1: []
    }
  },
  created () {
    this.getRequestManage('1')
  },
  methods: {
    getRequestManage (all) {
      if (this.single) {
        otcApi.listAppealRequestManage(this.curPage, {
          state: 3
        }, (res, total) => {
          this.total = total
          this.datas1 = res
        })
      } else {
        otcApi.listAppealRequestManage(this.curPage,{}, (res, total) => {
          this.total = total
          this.datas1 = res
        })
      }
    },
    changePage (page) {
      this.curPage = page
      this.getRequestManage()
    }
  }
}
</script>

<style lang="less" scoped>
.refresh{width: 49px;height: 24px;background: url(../../images/frsh.png) center/cover no-repeat;background-size: contain;cursor: pointer;color: #2d8cf0;}
.ivu-card-head-inner, .ivu-card-head p{display: flex !important;justify-content: space-between  !important;height: 40px !important; line-height: 40px !important;}
</style>
