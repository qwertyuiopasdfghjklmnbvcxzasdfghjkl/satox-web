<!--资产记录-->
<template>
  <div>
      <Card style="width:1200px;">
         <p slot="title">
             资产记录
             <span>
                <Button type="primary" @click="reshAll" style="margin-right:50px;">刷新</Button>
                <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer; margin-top: 14px;" @click="closeDialog"></i>
            </span>
         </p>
         <Tabs value="name1">
            <TabPane label="当前资产" name="name1">
                <Card>
                    <p slot="title">总资产：{{this.totalAssets.totalAmountByBTC}}BTC   {{this.totalAssets.totalAmountByCNY}}CNY</p>
                </Card>
                <Table :columns="columns1" :data="data1"></Table>
                <Page :current="curPage" :total="total" @on-change="changePage" style="text-align:center;margin-top:20px;"></Page>
            </TabPane>
            <TabPane label="充值记录" name="name2">
                <Table :columns="columns2" :data="data2"></Table>
                 <Page :current="curPage1" :total="total1" @on-change="changePage1" style="text-align:center;margin-top:20px;"></Page>
            </TabPane>
            <TabPane label="提币记录" name="name3">
                 <Table :columns="columns3" :data="data3"></Table>
                 <Page :current="curPage2" :total="total2" @on-change="changePage2" style="text-align:center;margin-top:20px;"></Page>
            </TabPane>
            <TabPane label="充值地址记录" name="name4">
                <Table :columns="columns4" :data="data4"></Table>
                <Page :current="curPage3" :total="total3" @on-change="changePage3" style="text-align:center;margin-top:20px;"></Page>
            </TabPane>
            <TabPane label="提币地址记录" name="name5">
                <Table :columns="columns5" :data="data5"></Table>
                <Page :current="curPage4" :total="total4" @on-change="changePage4" style="text-align:center;margin-top:20px;"></Page>
            </TabPane>
            <TabPane label="分发记录" name="name6">
                <Table :columns="columns6" :data="data6"></Table>
                <Page :current="curPage5" :total="total5" @on-change="changePage5" style="text-align:center;margin-top:20px;"></Page>
            </TabPane>
         </Tabs>
      </Card>
  </div>
</template>

<script>
import currenyApi from '../../../api/currency'
export default {
  props: ['userId'],
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
        curPage5: 1,
        total5: 0,
        columns1: [
            {
                title: '币种',
                key: 'symbol'
            },
            {
                title: '可用',
                key: 'availableAmount'
            },
            {
                title: '锁定',
                key: 'frozenAmount'
            },
            {
                title: '合计',
                key: 'totalAmount'
            }
        ],
        data1: [],
        columns2: [
            {
                title: '币种',
                key: 'symbol'
            },
            {
                title: '数量',
                key: 'quantity'
            },
            {
                title: '转入地址',
                key: 'toAddress'
            },
            {
                title: '交易ID',
                key: 'txId'
            },
            {
                title: '区块进度',
                key: 'confirmation'
            },
            {
                title: '状态',
                key: 'status',
                render: (h, params) => {
                    return h('div', params.row.status === 1 ? '等待' : '完成')
                }
            },
            {
                title: '到账时间',
                key: 'transferIntoTime'
            }
        ],
        data2: [],
        columns3: [
            {
                title: '币种',
                key: 'symbol'
            },
            {
                title: '数量',
                key: 'quantity'
            },
            {
                title: '转入地址',
                key: 'toAddress'
            },
            {
                title: '交易ID',
                key: 'txId'
            },
            {
                title: '状态',
                key: 'status',
                render: (h, params) => {
                    return h('div', this.switchStaus(params.row.status))
                }
            },
            {
                title: '发送时间',
                key: 'createdTime'
            }
        ],
        data3: [],
        columns4: [
            {
                title: '账户名',
                key: 'accountName'
            },
            {
                title: '币种',
                key: 'symbol'
            },
            {
                title: '转入地址',
                key: 'toAddress'
            },
            {
                title: 'MEMO',
                key: 'memo'
            }
        ],
        data4: [],
        columns5: [
            {
                title: '币种',
                key: 'symbol'
            },
            {
                title: '转入地址',
                key: 'toAddress'
            },
            {
                title: '地址别名',
                key: 'addrAlias'
            },
            {
                title: 'MEMO',
                key: 'memo'
            }
        ],
        data5: [],
        columns6: [
            {
                title: '时间',
                key: 'ticreatedTime'
            },
            {
                title: '币种',
                key: 'symbol'
            },
            {
                title: '数量',
                key: 'quantity'
            },
            {
                title: '备注',
                key: 'remarks'
            }
        ],
        data6: [],
        totalAssets: []
      }
  },
  created() {
      this.getAssetsList()
      this.getRecordList()
      this.getWithdraw()
      this.getRecharge()
      this.getWithdrawAddrList()
      this.getDistribute()
      this.allRecord()
  },
  methods: {
    switchStaus(state) {
        switch(state){
            case 1:
                return '提现中'
                break;
            case 2:
                return '已完成'
                break;
        }
    },
    allRecord () {
        currenyApi.findUserCurrentAssetsByBTC({
            userId: this.userId
        }, (res) => {
            this.totalAssets = res
        })
    },
    closeDialog () {
        this.$emit('removeDialog')
    },
    getAssetsList() {
         currenyApi.findUserCurrentAssetsList( this.curPage, this.userId, (res, total) => {
             this.total = total
             this.data1 = res
         }, (msg) => {
             this.$Message.error({content: msg})
         })
    },
    changePage (page) {
      this.curPage = page
      this.getAssetsList()
    },
    getRecordList() {
        currenyApi.findUserRechargeRecordList(this.curPage1, this.userId, (res, total) => {
            this.total1 = total
            this.data2 = res
        }, (msg) => {
             this.$Message.error({content: msg})
         })
    },
    changePage1 (page) {
      this.curPage1 = page
      this.getRecordList()
    },
    getWithdraw() {
        currenyApi.findUserWithdrawRecordList(this.curPage2, this.userId, (res, total) => {
            this.total2 = total
            this.data3 = res
        }, (msg) => {
            this.$Message.error({content: msg})
         })
    },
    changePage2 (page) {
      this.curPage2 = page
      this.getWithdraw()
    },
    getRecharge() {
        currenyApi.findUserRechargeAddrList(this.curPage3, this.userId, (res, total) => {
            this.total3 = total
            this.data4 = res
        },(msg) => {
             this.$Message.error({content: msg})
         })
    },
    changePage3 (page) {
      this.curPage3 = page
      this.getRecharge()
    },
    getWithdrawAddrList() {
        currenyApi.findUserWithdrawAddrList(this.curPage4, this.userId, (res, total) => {
            this.total4 = total
            this.data5 = res
        },(msg) => {
             this.$Message.error({content: msg})
         })
    },
    changePage4 (page) {
      this.curPage4 = page
      this.getWithdrawAddrList()
    },
    getDistribute() {
        currenyApi.findUserDistributeRecordList(this.curPage5, this.userId, (res, total) => {
            this.total5 = total
            this.data6 = res
        },(msg) => {
             this.$Message.error({content: msg})
        })
    },
    changePage5 (page) {
      this.curPage5 = page
      this.getDistribute()
    }
   }
}
</script>

