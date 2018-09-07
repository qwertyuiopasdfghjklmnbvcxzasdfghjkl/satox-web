<!-- 币种管理 -->
<template>
  <Row>
    <Card>
        <p slot="title">币种管理
             <Button type="primary" @click="reshAll">刷新</Button>
        </p>
        <Row>
            <span>代号</span>
            <Input v-model="symbol" placeholder="Search" style="width: 300px"></Input>
            <Button type="primary" @click="findSymbolList()">查询</Button>
            <Button type="primary" @click="add_order()" style="float:right;">添加</Button>
        </Row>
    </Card>
    <Card style="margin-top:20px;">
        <p slot="title">基本资料</p>
        <Table :columns="columns1" :data="data1"></Table>
        <Page :current="curPage" :total="total" @on-change="changePage" style="text-align:center;margin-top:20px;"></Page>  
    </Card>
    <Card style="margin-top:20px;">
        <p slot="title">交易情况</p>
        <Table :columns="columns2" :data="data2"></Table>
        <Page :current="curPage1" :total="total1" @on-change="changePage1" style="text-align:center;margin-top:20px;"></Page>
    </Card>
  </Row>
</template>

<script>
import util from '../../libs/util'
import add_order from './add_order'
import coin_setting from './coin_setting'
import recharge_settings from './recharge_settings'
import currenyApi from '../../api/currency'
import updata from './users/updata'
export default {
 data () {
   return {
     curPage: 1,
     total: 0,
     curPage1: 1,
     total1: 0,
     symbol: '',
     columns1: [
          {
              title: '代号',
              key: 'symbol'
          },
          {
              title: '中文名',
              key: 'captionCN'
          },
          {
              title: '主链类型', 
              key: 'symbolType',
              render: (h, params) => {
                  return h('div', this.switchStaus(params.row.symbolType))
              }
          },
        //   {
        //       title: 'ICON',
        //       key: 'iconUrl'
        //   },
          {
              title: '市场',
              key: 'market'
          },
        //   {
        //       title: '钱包服务器',
        //       key: 'symbolServer'
        //   },
          {
              title: 'ERC20合约地址',
              key: 'contractAddr'
          },
          {
              title: '合约精度',
              key: 'contractDecimals'
          },
          {
              title: '充值权限',
              key: 'rechargeFlag', //1 正常 2  暂停
              render: (h, params) => {
                  let status = params.row.rechargeFlag
                let color = ''
                switch(status){
                    case 1:
                        color = 'green'
                        break;
                    case 2:
                        color = '#ff8041'
                        break;
                }
                return h('div', [
                    h('div', {
                        style: { color: color}
                    }, params.row.rechargeFlag == 1 ? '正常' : '暂停'),
                ])
                //   return h('div', params.row.rechargeFlag == 1 ? '正常' : '暂停')
              }
          },
          {
              title: '提币权限', //1 正常 2  暂停
              key: 'withdrawFlag',
              render: (h, params) => {
                let status = params.row.withdrawFlag
                let color = ''
                switch(status){
                    case 1:
                        color = 'green'
                        break;
                    case 2:
                        color = '#ff8041'
                        break;
                }
                return h('div', [
                    h('div', {
                        style: { color: color}
                    }, params.row.withdrawFlag == 1 ? '正常' : '暂停'),
                ])
              }
          },
          {
              title: 'GASPrice', 
              key: 'gasprice',
              render: (h, params) => {
                  return h('div', params.row.gasprice)
              }
          },
          {
              title: 'GASNumber', 
              key: 'gaslimit',
              render: (h, params) => {
                  return h('div', params.row.gaslimit)
              }
          },
          {
              title: '最小提币数量', 
              key: 'minWithdrawQuantity',
              render: (h, params) => {
                  return h('div', params.row.minWithdrawQuantity)
              }
          },
          {
              title: '手续费固定额度', 
              key: 'feeFixedAmount',
              render: (h, params) => {
                  return h('div', params.row.feeFixedAmount)
              }
          },
          {
              title: '矿工费', 
              key: 'minerFee',
              render: (h, params) => {
                  return h('div', params.row.minerFee)
              }
          },
          {
              title: '状态', //1 上线 2  下线
              key: 'status',
              render: (h, params) => {
                  let status = params.row.status
                let color = ''
                switch(status){
                    case 1:
                        color = 'green'
                        break;
                    case 2:
                        color = '#ff8041'
                        break;
                }
                return h('div', [
                    h('div', {
                        style: { color: color}
                    }, params.row.status == 1 ? '上线' : '下线'),
                ])
              }
          },
          {
              title: '等待区块数', 
              key: 'confirmBlock',
              render: (h, params) => {
                  return h('div', params.row.confirmBlock)
              }
          },
          {
              title: '操作',
              key: 'opreat',
              render: (h, params) => {
                return h('div', [
                    h('Button', {
                        props: {type: 'primary', size: 'small'},
                        style: {marginRight: '3px'},
                        on: {
                            click: () => {
                                util.setDialog(coin_setting, {
                                    item: params.row
                                })
                            }
                        }
                    }, '充提设置'),
                    h('Button', {
                        props: {type: 'primary', size: 'small'},
                        style: {marginRight: '3px'},
                        on: {
                            click: () => {
                                util.setDialog(updata,{
                                     item: params.row,
                                     okCallback: () => {
                                        this.reshAll()
                                     }
                                })
                            }
                        }
                    }, '修改'),
                    h('Button', {
                        props: {type: 'primary', size: 'small'},
                        style: {marginRight: '3px'},
                        on: {
                            click: () => {
                                currenyApi.updateSymbol({
                                    status: params.row.status === 1 ? 2:1,
                                    symbolId: params.row.symbolId,
                                    version: params.row.version
                                }, (res) => {
                                    this.$Message.success({content: '修改成功'})
                                    this.findSymbolList()
                                }, (msg) => {
                                    this.$Message.success({content: msg})
                                })   
                            }
                        }
                    }, params.row.status === 1 ? '下线':'上线')
                ]);
            }
          }
      ],
      data1: [],
      columns2: [
          {
              title: '代号',
              key: 'symbol'
          },
          {
              title: '用户数量',
              key: 'userCount'
          },
          {
              title: '最新价格',
              key: 'currentPrice'
          },
          {
              title: '日交易量',
              key: 'exchangeDailyQuantity'
          },
          {
              title: '上一日收盘数量',
              key: 'closingCapitalPoolYesterdayQuantity'
          },
          {
              title: '当前数量',
              key: 'currentCapitalPoolQuantity'
          },
          {
              title: '日净增',
              key: 'netIncreaseDailyQuantity'
          },
          {
              title: '日换手率',
              key: 'turnoverRateDaily'
          }
      ],
      data2: []
   }
 },
 computed: {
 },
 created() {
     this.getchangeList()
     this.findSymbolList()
 },
 methods: {
    reshAll () {
        this.getchangeList()
        this.findSymbolList()
    },
    switchStaus(state) {
        switch(state){
            case 1:
                return 'BTC'
                break;
            case 2:
                return 'ETH'
                break;
            case 3:
                return 'OMNI'
                break;
            case 4:
                return 'MBT'
                break;
        }
    },
   add_order () {
     util.setDialog(add_order, {
        okCallback: () => {
          this.findSymbolList()
        }
     })
   },
   getchangeList () {
       currenyApi.findSymbolExchangeInfoList({
           symbol: this.symbol || null
       }, this.curPage1, (res, total1) => {
           this.total = total1
           this.data2 = res
       }, (msg) => {
           this.$Message.error({content: msg})
       })
   },
   findSymbolList() {
       currenyApi.findSymbolList({
         symbol: this.symbol || null
       }, this.curPage, (res, total) => {
           this.total = total
           this.data1 = res
    }, (msg) => {
        this.$Message.error({content: msg})
    })
   },
   changePage (page) {
      this.curPage = page
      this.findSymbolList()
   },
   changePage1 (page1) {
      this.curPage1 = page1
      this.getchangeList()
   }
 }
}
</script>

<style lang="less" scoped>
.ivu-card-head-inner, .ivu-card-head p{display: flex !important;justify-content: space-between  !important;height: 40px !important; line-height: 40px !important;}
</style>
