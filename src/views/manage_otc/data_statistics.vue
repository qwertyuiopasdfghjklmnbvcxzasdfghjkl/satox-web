<!-- 数据统计 -->
<template>
  <Row>
    <Card>
      <p slot="title">数据统计
         <span class="refresh" @click="refreshAll"></span>
      </p>
      <Row>
        <Col span="8">
          用户在线数量：{{data1.onlineAmount || 0}}
        </Col>
        <Col span="8">
          待处理申诉数：{{data1.waitHandleAppealAmount || 0}}
        </Col>
        <Col span="8">
          今日异常预警情况数量：{{data1.abnormalAmount || 0}}
        </Col>
      </Row>
    </Card>
    <Card style="margin-top:10px;">
      <p slot="title">交易数据</p>
      <Row v-for="(data, index) in data2" :key="data.id">
        <Col span="6">
          {{data.symbol}}交易总量：{{data.transactionAmount || 0}}
        </Col>
        <Col span="6">
           {{data.symbol}}上架广告数量：{{data.onShelfAmount || 0}}
        </Col>
        <Col span="6">
           {{data.symbol}}正在交易订单数：{{data.beingTransactionOrderAmount || 0}}
        </Col>
        <Col span="6">
           {{data.symbol}}完成交易单数：{{data.accomplishTransactionOrderAmount || 0}}
        </Col>
      </Row>
      <Page :current="curPage" :total="total" @on-change="changePage" style="text-align:center;margin-top:20px;"></Page>  
    </Card>
    <Card style="margin-top:10px;">
      <p slot="title">图表展示</p>
      <Form ref="formItem" :model="formItem" :label-width="80" inline>
        <FormItem prop="user" label="币种">
            <Select v-model="formItem.symbol" style="width:100px">
                <Option value="BTC">BTC</Option>
                <Option value="ETH">ETH</Option>
                <Option value="ATN">ATN</Option>
                <Option value="MECoin">MECoin</Option>
                <Option value="USDT">USDT</Option>
            </Select>
        </FormItem>
        <FormItem prop="password" label="项目"><!--1,在线用户数量 2,上架广告数量 3,正在交易的订单数 4,当天完成订单数 5,当天交易额 6,待处理申述数 7,当天异常预警数-->
            <Select v-model="formItem.project" style="width:150px">
                <Option value="1">在线用户数量</Option>
                <Option value="2">上架广告数量</Option>
                <Option value="3">正在交易的订单数</Option>
                <Option value="4">当天完成订单数</Option>
                <Option value="5">当天交易额</Option>
                <Option value="6">待处理申述数</Option>
                <Option value="7">当天异常预警数</Option>
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
            <Button type="primary" @click="getfindChartDataList()">查询</Button>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="exportTable">输出报表</Button>
        </FormItem>
      </Form>
      <div ref="canvas" class="manage_exchange_canvas"></div>
    </Card>
  </Row>
</template>

<script>
import echarts from 'echarts';
import otcApi from '../../api/otc'
import util from '../../libs/util'
export default {
  data () {
    return {
      curPage: 1, 
      total: 0,
      formItem: {
        symbol: 'BTC',
        project: '1',
        date: [],
        du: '1'
      },
      data1: [],
      data2: []
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
    this.getfindDataStatistic()
    this.getfindTransactionData()
    this.$nextTick(() => {
      this.getfindChartDataList()
    })
  },
  methods: {
    refreshAll (){
        this.getfindDataStatistic()
        this.getfindTransactionData()
        this.$nextTick(() => {
          this.getfindChartDataList()
        })
    },
    exportTable () {
      let paramStr = []
      for (var i in this.params) {
        paramStr.push(`${i}=${this.params[i]}`)
      }
      window.location.href = `${util.baseURL}`+`api/bm/otcManage/exportOtcExcel?${paramStr.join('&')}`
    },
    getfindDataStatistic () {
      otcApi.findDataStatistic((res) => {
        this.data1 = res.data
      })
    },
    getfindTransactionData () {
      otcApi.findTransactionData(this.curPage, {}, (res, total) => {
        this.total = total
        this.data2 = res
      }, (msg) => {
        this.$Message.error({content: msg})
      })
    },
    changePage (page) {
        this.curPage = page
        this.getfindTransactionData()
    },
    getfindChartDataList () {
      otcApi.findChartDataList(this.params, (res) => {
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
    }
  }
}
</script>

<style lang="less" scoped>
.refresh{width: 49px;height: 24px;background: url(../../images/frsh.png) center/cover no-repeat;background-size: contain;cursor: pointer;color: #2d8cf0;}
.manage_exchange_canvas{display:flex;margin:20px;height:400px;}
.ivu-card-head-inner, .ivu-card-head p{display: flex !important;justify-content: space-between  !important;height: 40px !important; line-height: 40px !important;}
</style>
