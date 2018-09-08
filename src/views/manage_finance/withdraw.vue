<!-- 提币审核 -->
<template>
  <Row>
    <Col span="24">
      <Row>
        <Card>
          <p slot="title">提币审核
                <Button type="primary" @click="reshAll">刷新</Button>
          </p>
          <Row>
            <Col span="12">
              <p>自动审核</p>
              <p>
                <span>待审核笔数：{{numberData.toBeAuditingAutoCount }}</span>
                <span style="margin-left:40px;">已审核笔数：{{numberData.auditingFinishAutoCount }}</span>
              </p>
            </Col>
            <Col span="12">
              <p>人工审核</p>
              <p>
                <span>待审核笔数：{{numberData.toBeAuditingManualCount}}</span>
                <span style="margin-left:40px;">已审核笔数：{{numberData.auditingFinishManualCount}}</span>
              </p>
            </Col>
          </Row>
        </Card>
        <Card style="margin-top:10px;">
          <Table :columns="columns" :data="datas"></Table>
           <Page :current="curPage" :total="total" @on-change="changePage" style="text-align:center;margin-top:20px;"></Page>
        </Card>
      </Row>
    </Col>
  </Row>
</template>

<script>
import util from '../../libs/util';
import check from './check';
import financeApi from '../../api/finance'
export default {
    data () {
        return {
            curPage: 1,
            total: 0,
            columns: [
                {key: 'createdTime', title: '创建时间'},
                {key: 'userName', title: '用户账号'},
                {key: 'withdrawAmount', title: '提现金额',
                    render: (h, params) => { 
                        return h('div', [params.row.withdrawAmount, params.row.symbol])
                    }
                },
                {key: 'phoneNumber', title: '电话'},
                {key: 'auditStatus', title: '状态',
                    render: (h, params) => { 
                        return h('div', this.switchStaus(params.row.auditStatus))
                    }
                },//0 未审核 1 审核不通过 2 审核通过
                {key: 'action', title: '操作', render: (h, params) => {
                    return h('div', [
                        h('Button', {
                            props: {type: 'primary', size: 'small', disabled: params.row.auditStatus === 2},
                            on: {
                                click: () => {
                                  util.setDialog(check,{
                                    id: params.row.id,
                                    withdrawApplyId: params.row.withdrawApplyId,
                                    okCallback: () => {
                                      this.getAuditing()
                                    }
                                  })
                                }
                            }
                        }, '审核')
                    ]);
                }}
            ],
            datas: [],
            numberData: []
        }
    },
    created() {
      this.getAuditing()
      this.getAuditingData()
    },
    methods: {
      reshAll () {
         this.getAuditing()
         this.getAuditingData()
      },
      switchStaus(state) {//0 未审核 1 审核不通过 2 审核通过
        switch(state){
            case 0:
                return '未审核'
                break;
            case 1:
                return '审核不通过'
                break;
            case 2:
                return '审核通过'
                break;
        }
    },
      getAuditing() {
        financeApi.getAuditingList(this.curPage, {
          auditType: 2 // 1 自动  2  人工
        }, (res, total) => {
          this.total = total
          this.datas = res
        })
      },
      changePage (page) {
        this.curPage = page
        this.getAuditing()
      },
      getAuditingData() {
        financeApi.findTotalWithdrawAuditingData((res) => {
          this.numberData = res
        })
      }
    }
}
</script>

<style lang="less" scoped>
.ivu-card-head-inner, .ivu-card-head p{display: flex !important;justify-content: space-between  !important;height: 40px !important; line-height: 40px !important;}
</style>
