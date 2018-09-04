<!-- 数据统计 -->
<template>
  <Row>
    <Card>
      <p slot="title">数据统计</p>
      <Row>
        <Col span="9">
          <p>
            日全站交易量：
            <span style="margin-right:15px;">{{datas.length ? datas[0].btcTransactionAmount : 0}}BTC</span>
            <span style="margin-right:15px;">{{datas.length ? datas[0].ethTransactionAmount : 0}}ETH</span>
            <span>{{datas.length ? datas[0].barkTransactionAmount : 0}}ATN</span>
            <span>{{datas.length ? datas[0].barkTransactionAmount : 0}}USDT</span>
          </p>
        </Col>
        <Col span="7">
          <p>
            当前在线用户：{{datas.length ? datas[0].onlineUserAmount : 0}}个
          </p>
        </Col>
        <Col span="8">
          <p>
            总用户数：{{datas.length ? datas[0].allUserAmount : 0}}个
          </p>
        </Col>
      </Row>
    </Card>
    <Card style="margin:10px 0;">
      <p slot="title">市场交易情况</p>
      <Table :columns="columns1" :data="data1"></Table>
       <Page :current="curPage1" :total="total1" :page-size="pageSize" @on-change="changePage1" style="text-align:center;margin-top:20px;"></Page>
    </Card>
    <Card>
      <p slot="title">用户情况</p>
      <Table :columns="columns2" :data="data2"></Table>
    </Card>
    <Card style="margin:10px 0;">
      <p slot="title">财务情况</p>
      <Table :columns="columns3" :data="data3"></Table>
      <Page :current="curPage" :total="total" @on-change="changePage" style="text-align:center;margin-top:20px;"></Page>
    </Card>
    <Card>
      <p slot="title">风控情况</p>
      <Table :columns="columns4" :data="data4"></Table>
    </Card>
    <Card style="margin-top:10px;">
      <p slot="title">图表展示</p>
      <Form ref="formItem" :model="formItem" :label-width="80" inline>
        <FormItem prop="user" label="币种">
            <Select v-model="formItem.symbol" style="width:100px">
                <Option value="BTC">BTC</Option>
                <Option value="ETH">ETH</Option>
                <Option value="ATN">ATN</Option>
            </Select>
        </FormItem>
        <FormItem prop="password" label="项目">
            <Select v-model="formItem.project" style="width:150px">
                <Option value="1">在线用户数量</Option>
                <Option value="2">上架广告数量</Option>
                <Option value="3">正在交易订单数量</Option>
                <Option value="4">当天完成订单数量</Option>
            </Select>
        </FormItem>
        <FormItem prop="password" label="时间段">
            <DatePicker v-model="formItem.date" format="yyyy-MM-dd" type="daterange" placement="bottom-end" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem prop="password" label="时间步长">
            <Select v-model="formItem.du" style="width:150px">
                <Option value="1">1小时</Option>
                <Option value="12">12小时</Option>
                <Option value="24">24小时</Option>
                <Option value="168">7天</Option>
                <Option value="360">15天</Option>
                <Option value="720">1月</Option>
            </Select>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="search()">查询</Button>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="exportBBExcel()">输出报表</Button>
        </FormItem>
      </Form>
      <div ref="canvas" class="manage_exchange_canvas"></div>
    </Card>
  </Row>
</template>

<script>
import echarts from 'echarts';
import currenyApi from '../../api/currency'
import util from '../../libs/util'
export default {
  data () {
    return {
      curPage: 1,
      total: 0,
      curPage1: 1,
      total1: 0,
      pageSize: 3,
      columns1: [
        {title: '市场', key: 'market'},
        {title: '最新价格', key: 'currentPrice'},
        {title: '日跌涨', key: 'highLowDaily'},
        {title: '日交易量', key: 'exchangeQuantityDaily'},
        {title: '日用户量', key: 'userCountDaily'},
        {title: '日交易比例', key: 'ratioExchangeDaily'}
      ],
      data1: [],
      columns2: [
        {title: '日新注册用户', key: 'registerAmountDaily'},
        {title: '日登陆用户', key: 'loginAmountDaily'},
        {title: '日交易用户', key: 'rechargeAmountDaily'},
        {title: '当前在线用户', key: 'onlineAmountDaily'}
      ],
      data2: [],
      columns3: [
        {title: '币种', key: 'symbol'},
        {title: '日充值数量', key: 'rechargeAmountDaily'},
        {title: '日提现数量', key: 'withdrawAmountDaily'},
        {title: '日新增净额', key: 'increaseAmountDaily'},
        {title: '待审核提现', key: 'waitCheckWithdraw'},
        {title: '待审核提现请求数量', key: 'waitCheckWithdrawAmount'}
      ],
      data3: [],
      columns4: [
        {title: '财务对账情况', key: 'financialBalance'},
        {title: '紧急预警当前未处理', key: 'emergencyWarningUntreatedCount'},
        {title: '紧急预警日新增', key: 'emergencyWarningDailyAddedCount'},
        {title: '异常预警当前未处理', key: 'abnormalWarningUntreatedCount'},
        {title: '日常预警日新增', key: 'abnormalWarningDailyAddedCount'}
      ],
      data4: [],
      formItem: {
        symbol: 'BTC',
        project: '1',
        date: [],
        du: '1'
      },
      datas: [],
      data8: []
    }
  },
  computed: {
    params () {
      let data = {
        symbol: this.formItem.symbol,
        item: this.formItem.project,
        step: this.formItem.du
      }
      if (this.formItem.date[0]) {
        data.beginDate = util.dateToStr(this.formItem.date[0])
      } else {
        data.beginDate = util.dateToStr(new Date(), 'yyyy-MM-dd 00:00:00')
      }
      if (this.formItem.date[1]) {
        data.endDate = util.dateToStr(this.formItem.date[1])
      } else {
        data.endDate = util.dateToStr(new Date(), 'yyyy-MM-dd 00:00:00')
      }
      return data
    }
  },
  created () {
    this.getDataList()
    this.getfindRiskDataList()
    this.getfindMarketExchangeList()
    this.getfindUserDataList()
    this.getfindStatisticData()
    this.$nextTick(() => {
      this.search();
    })
  },
  methods: {
    exportBBExcel () {
      let paramStr = []
      for (var i in this.params) {
        paramStr.push(`${i}=${this.params[i]}`)
      }
      window.location.href = `${util.baseURL}`+`api/bm/bbManage/DataStatistic/exportBBExcel?${paramStr.join('&')}`
    },
    search () {
      currenyApi.getfindChartDataList(this.params, (res) => {
        let data1 = []
        let data2 = []
        res.forEach((item) => {
          data1.push(item.createdAt)
          if (this.formItem.project === '1') {
            data2.push(item.onlineUserAmount)
          } else if (this.formItem.project === '2') {
            data2.push(item.listAdvertisementAmount)
          } else if (this.formItem.project === '3') {
            data2.push(item.transcationingOrderAmount)
          } else if (this.formItem.project === '4') {
            data2.push(item.completedOrderAmount)
          } else if (this.formItem.project === '5') {
            data2.push(item.transactionSum)
          } else if (this.formItem.project === '6') {
            data2.push(item.waitHandleAppealAmount)
          } else if (this.formItem.project === '7') {
            data2.push(item.abnormalWarningAmount )
          }
        })
        this.initCanvas(data1, data2);
      })
    },

    initCanvas (data1, data2) {
      let option = {
        color: ['#3398DB'],
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                data : data1 || [],
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name:'直接访问',
                type:'bar',
                barWidth: '60%',
                data:data2 || []
            }
        ]
      };
      var myChart = echarts.init(this.$refs.canvas);
      myChart.setOption(option);
    },
    getDataList () {
      currenyApi.findFinancialDataList({}, this.curPage, (res, total) => {
        this.total = total
        this.data3 = res
      })
    },
    changePage (page) {
      this.curPage = page
      this.getDataList()
    },
    getfindRiskDataList () {
      currenyApi.findRiskDataList((res) => {
        this.data4 = [res]
      })
    },
    getfindUserDataList () {
      currenyApi.findUserDataList((res) => {
        this.data2 = [res]
      })
    },
    getfindMarketExchangeList () {
      currenyApi.findMarketExchangeList(this.curPage1, (res, total) => {
        this.total1 = total
        this.data1 = res
      })
    },
    changePage1 (page) {
      this.curPage1 = page
      this.getfindMarketExchangeList()
    },
    getfindStatisticData() {
      currenyApi.findStatisticData((res) => {
        this.datas = [res]
      })
    }
  }
}
</script>

<style lang="less" scoped>
.manage_exchange_canvas{display:flex;margin:20px;height:400px;}
</style>
