<!-- KYC复核 -->
<template>
  <Row>
    <Card>
      <p slot="title">KYC复核
        <span class="refresh" @click="getCheckVerifys"></span>
      </p>
      <Table :columns="columns1" :data="data1" style="margin-top:10px;"></Table>
      <Page :current="curPage" :total="total" @on-change="changePage" style="text-align:center;margin-top:20px;"></Page>
    </Card>
  </Row>
</template>

<script>
import util from '../../libs/util';
import detail from './auditing_detail'
import kycAPI from '../../api/kyc'
import messageModel from './messageModel'
export default {
  props: ['userId'],
  data () {
    return {
      curPage: 1,
      total: 0,
      columns1: [
        {title: '账号', key: 'account'},
        {title: '地区', key: 'cn'},
        {title: '姓名', key: 'verifyName'},
        {title: '性别', key: 'verifySex',
          render: (h, params) => {
              return h('div', params.row.verifySex == 1 ? '男' : '女')
          }
        },
        {title: '证件类型', key: 'verifyClass',
          render: (h, params) => {
              return h('div', this.switchVerify(params.row.verifyClass) )
          }
        },
        {title: '证件号', key: 'verifyIdCard'},
        {title: '审核管理员', key: 'firstMgrName'},
        {title: '操作', key: 'action', render: (h, params) => {
            return h('div', [
                h('Button', {
                    props: {type: 'primary', size: 'small'},
                    on: {
                        click: () => {
                          util.setDialog(detail, {
                            verifyId: params.row.verifyId,
                            type: 'fuhe',
                            okCallback: () => {
                              this.getCheckVerifys()
                            }
                          })
                        }
                    }
                }, '查看详情并处理'),
                h('i', {
                    class: 'ivu-icon ivu-icon-volume-medium',
                    style: {verticalAlign: 'middle', cursor: 'pointer', fontSize: '30px', marginLeft:'10px', cursor: this.readOnly ? 'not-allowed' : 'pointer', color: this.readOnly ? '#CCC' : null}, 
                    on: {
                        click: () => {
                            util.setDialog(messageModel, {
                                userId: params.row.verifyUserID,
                                username: params.row.account,
                                type: 2
                            });
                        }
                    }
                })
            ]);
        }}
      ],
      data1: []
    }
  },
  created () {
    this.getCheckVerifys()
  },
  methods: {
    switchVerify(state) {// 0：驾照，1：护照，2：国民身份证）
        switch(state){
            case 2:
                return '身份证'
                break;
            case 0:
                return '驾照'
                break;
            case 1:
                return '护照'
                break;
        }
    },
    getCheckVerifys () {
      kycAPI.listPageReCheckVerifys(this.curPage, {
        userId: this.userId
      }, (res, total) => {
        this.total = total
        this.data1 = res
      }, (msg) => {
        this.$Messages.error({content: msg})
      })
    },
    changePage (page) {
      this.curPage = page
      this.getCheckVerifys()
    }
  }
}
</script>

<style lang="less" scoped>
.refresh{width: 49px;height: 24px;background: url(../../images/frsh.png) center/cover no-repeat;background-size: contain;cursor: pointer;color: #2d8cf0;}
.ivu-card-head-inner, .ivu-card-head p{display: flex !important;justify-content: space-between  !important;height: 40px !important; line-height: 40px !important;}
</style>
