<!-- KYC审核 -->
<template>
  <Row>
    <Card>
      <p slot="title">KYC审核
        <span class="refresh" @click="getList"></span>
      </p>
      <Row>
        <Col span="8">待审核用户数量：{{data2.verifyWaitFirstCheck || 0}}个</Col>
        <Col span="8">待复核用户数量：{{data2.verifyWaitSecondCheck || 0}}个</Col>
        <Col span="8">已通过用户数量：{{data2.verifyPass || 0}}个</Col>
      </Row>
      <Table :columns="columns1" :data="data1" style="margin-top:10px;"></Table>
      <Page :current="curPage" :page-size="pageSize" :total="total" @on-change="changePage" style="text-align:center;margin-top:20px;"></Page>  
    </Card>
  </Row>
</template>

<script>
import util from '../../libs/util';
import check from './auditing_check'
import detail from './auditing_detail'
import kycAPI from '../../api/kyc'
export default {
  data () {
    return {
      curPage: 1,
      pageSize: 10,
      total: 0,
      columns1: [
        {title: '账号', key: 'account'},
        {title: '地区', key: 'cn'},
        {title: '姓名', key: 'verifyName'},
        {title: '性别', key: 'verifySex',
          render: (h, params) => {
              return h('div', params.row.verifySex === 1 ? '男' : '女')
          }
        },
        {title: '证件类型', key: 'verifyClass',
          render: (h, params) => { // 1:身份证 2：驾照  3：护照
              return h('div',  this.switchStaus(params.row.verifyClass))
          }
        },
        {title: '证件号', key: 'verifyIdCard'},
        {title: '操作', key: 'action', render: (h, params) => {
            return h('div', [
                // h('Button', {
                //     props: {type: 'primary', size: 'small'},
                //     style: {marginRight: '10px'},
                //     on: {
                //         click: () => {
                //           this.getcationCheck(params.row.verifyId)
                //         }
                //     }
                // }, '重复检查'),
                h('Button', {
                    props: {type: 'primary', size: 'small'},
                    on: {
                        click: () => {
                          
                          util.setDialog(detail, {
                            verifyId: params.row.verifyId,
                            params: params,
                            okCallback: () => {
                              this.getList()
                            }
                          })
                        }
                    }
                }, '查看详情并处理'),
                // h('i', {
                //     class: 'ivu-icon ivu-icon-volume-medium',
                //     style: {verticalAlign: 'middle', cursor: 'pointer', fontSize: '30px', cursor: this.readOnly ? 'not-allowed' : 'pointer', color: this.readOnly ? '#CCC' : null}, 
                //     on: {
                //         click: () => {
                //             if (this.readOnly) {
                //                 return
                //             }
                //             util.setDialog(messageModel, {
                //                 userId: params.row.userId,
                //                 username: params.row.username
                //             });
                //         }
                //     }
                // })
            ]);
        }}
      ],
      data1: [],
      statisticData: [],
      data2: []
    }
  },
  created () {
    this.getList()
    this.getStatusCount()
  },
  computed: {
        image () {
            return '../../src/images/frsh.png'
        }
  },
  methods: {
    switchStaus(state) {// 0：驾照，1：护照，2：国民身份证）
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
    getcationCheck (verifyId) {
          kycAPI.duplicationCheck({
            verifyId: verifyId
          }, (res) => {
            util.setDialog(check, {
              verifyId:verifyId,
              status: res,
              okCallback: () => {
                this.getList()
              }
            });
          }, (msg) => {
            this.$Message.error({content: msg})
      })
    },
    getStatusCount() {
      kycAPI.showReviewStatusCount((res) => {
        this.data2 = res.data
      }, (msg) => {
        this.$Message.error({content: msg})
      })
    },
    getList () {
      kycAPI.listPageUserVerifys(this.pageSize, this.curPage, {}, (res, total) => {
        this.total = total
        this.data1 = res
      });
    },
    statistic () {
      kycAPI.kycStatistic((res) => {
        this.statisticData = res
      })
    },
    changePage (page) {
      this.curPage = page
      this.getList()
    }
  }
}
</script>

<style lang="less" scoped>
.ivu-card-head-inner, .ivu-card-head p{display: flex !important;justify-content: space-between  !important;height: 40px !important; line-height: 40px !important;}
.refresh{width: 49px;height: 24px;background: url(../../images/frsh.png) center/cover no-repeat;background-size: contain;cursor: pointer;color: #2d8cf0;}
</style>
