<!-- 财务管理 -->
<template>
  <Row>
    <Col span="24">
      <Row style="margin:10px 0;">
        <Card>
          <p slot="title">充值监控
            <Button type="primary" @click="reshAll">刷新</Button>
          </p>
          <Table :columns="columns1" :data="data1"></Table>
          <Page :current="curPage" :total="total" @on-change="changePage" style="text-align:center;margin-top:20px;"></Page>  
        </Card>
      </Row>
      <Row>
        <Card>
          <p slot="title">日提币统计</p>
          <Table :columns="columns2" :data="data2"></Table>
          <Page :current="curPage1" :total="total1" @on-change="changePage1" style="text-align:center;margin-top:20px;"></Page>  
        </Card>
      </Row>
      <Row style="margin:10px 0;">
        <Card>
          <p slot="title">实时对账</p>
          <Table :columns="columns3" :data="data3"></Table>
           <Page :current="curPage2" :total="total2" @on-change="changePage2" style="text-align:center;margin-top:20px;"></Page>  
        </Card>
        </Card>
      </Row>
      <Row>
        <Card>
          <p slot="title">资金池情况</p>
          <Table :columns="columns4" :data="data4"></Table>
          <Page :current="curPage3" :total="total3" @on-change="changePage3" style="text-align:center;margin-top:20px;"></Page>  
        </Card>
      </Row>
      <Row style="margin-top:10px;">
        <Card>
          <p slot="title">手续费账户</p>
          <Table :columns="columns5" :data="data5"></Table>
          <Page :current="curPage4" :total="total4" @on-change="changePage4" style="text-align:center;margin-top:20px;"></Page>  
        </Card>
      </Row>
    </Col>
  </Row>
</template>

<script>
import util from '../../libs/util'
import dialog from './dialog'
import financeApi from '../../api/finance'
export default {
  data () {
    return {
      curPage: 1,
      total: 0,
      curPage1: 1,
      total1: 0,
      curPage2: 1,
      total2: 0,
      curPage3: 1,
      total3: 0,
      curPage4: 1,
      total4: 0,
      columns1: [
        {title: '公链币种', key: 'symbol'},
        {title: '监控地址数量', key: 'currentMonitorAddrCount'},
        {title: '日充值待确认笔数', key: 'dailyRechargeWaitComfirmCount'},
        {title: '日充值待确认总量', key: 'dailyRechargeWaitComfirmAmount'},
        {title: '日充值完成笔数', key: 'dailyRechargeFinishCount'},
        {title: '日充值完成总量', key: 'dailyRechargeWaitComfirmAmount'}
      ],
      data1: [],
      columns2: [
        {title: '公链币种', key: 'symbol'},
        {title: '日待提币笔数', key: 'withdrawDailyToBeConfirmedCount'},
        {title: '日待提币总量', key: 'withdrawDailyToBeConfirmedAmount'},
        {title: '日已提币笔数', key: 'withdrawDailyFinishCount'},
        {title: '日已提币总量', key: 'withdrawDailyFinishAmount'},
      ],
      data2: [],
      columns3: [
        {title: '对账状态', key: 'status',
          render: (h, params) => {
              return h('div', params.row.status == 1 ? '正常' : '异常')
          }
        },
        {title: '日已核对交易笔数', key: 'exchangeVerifyDailyCount'},
        {title: '日待核对交易笔数', key: 'exchangeToBeVerifyCount'},
        {title: '异常交易', key: 'action', render: (h, params) => {
            return h('div', [
                h('Button', {
                    props: {type: 'primary', size: 'small'},
                    on: {
                        click: () => {
                          util.setDialog(dialog)
                        }
                    }
                }, '查看')
            ]);
        }}
      ],
      data3: [],
      columns4: [
        {title: '币种', key: 'symbol'},
        {title: '当前数量', key: 'currentCapitalPoolQuantity'},
        {title: '上一交易日收盘数量', key: 'closingCapitalPoolYesterdayQuantity'},
        {title: '日净增', key: 'increaseDailyQuantity'}
      ],
      data4: [],
      columns5: [
        {title: '币种', key: 'symbol'},
        {title: '当前数量', key: 'currentCapitalPoolQuantity'},
        {title: '上一交易日收盘数量', key: 'closingCapitalPoolYesterdayQuantity'},
        {title: '日收取', key: 'collectfeeDailyQuantity'}
      ],
      data5: []
    }
  },
  created() {
    this.getMonitorList()
    this.getStatisticsList()
    this.getCheckingList()
    this.getPoolList()
    this.getAccountList()
  },
  methods: {
    reshAll () {
      this.getMonitorList()
      this.getStatisticsList()
      this.getCheckingList()
      this.getPoolList()
      this.getAccountList()
    },
    getMonitorList() {
      financeApi.findRechargeMonitorList( this.curPage, (res, total) => {
        this.total = total
        this.data1 = res
      })
    },
    changePage (page) {
      this.curPage = page
      this.getMonitorList()
    },
    getStatisticsList() {
      financeApi.findWithdrawStatisticsList(this.curPage1, (res, total) => {
        this.total = total
        this.data2 = res
      })
    },
    changePage1 (page) {
      this.curPage1 = page
      this.getStatisticsList()
    },
    getCheckingList() {
      financeApi.findRealTimeCheckingList(this.curPage2, (res, total) => {
        this.total2 = total
        this.data3 = res
      })
    },
    changePage2 (page) {
      this.curPage2 = page
      this.getCheckingList()
    },
    getPoolList() {
      financeApi.findCapitalPoolList(this.curPage3, (res, total) => {
        this.total3 = total
        this.data4 = res
      })
    },
    changePage3 (page) {
      this.curPage3 = page
      this.getPoolList()
    },
    getAccountList() {
      financeApi.findServiceFeeAccountList(this.curPage4, (res, total) => {
        this.total4 = total
        this.data5 = res
      })
    },
    changePage4 (page) {
      this.curPage4 = page
      this.getAccountList()
    }
  }
}
</script>

<style lang="less" scoped>
.ivu-card-head-inner, .ivu-card-head p{display: flex !important;justify-content: space-between  !important;height: 40px !important; line-height: 40px !important;}
</style>