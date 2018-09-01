<template>
    <Card style="width:1200px">
        <p slot="title">
            交易记录
            <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
        </p>
        <Tabs>
            <TabPane label="当前委托">
                <Table :columns="columns1" :data="data1"></Table>
                <Page :current="curPage" :total="total" @on-change="changePage" style="text-align:center;margin-top:20px;"></Page> 
            </TabPane>
            <TabPane label="历史委托">
                <Table :columns="columns2" :data="data2"></Table>
                <Page :current="curPage1" :total="total1" @on-change="changePage1" style="text-align:center;margin-top:20px;"></Page> 
            </TabPane>
            <TabPane label="币币交易记录">
                <Table :columns="columns3" :data="data3"></Table>
                <Page :current="curPage2" :total="total2" @on-change="changePage2" style="text-align:center;margin-top:20px;"></Page>
            </TabPane>
        </Tabs>
    </Card>
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
            columns1: [
                {title: '时间', key: 'entrustmentTime'},
                {title: '市场', key: 'market'},
                {title: '方向', key: 'direction',
                  render: (h, params) => {
                    return h('div', params.row.direction == 1 ? '买' : '卖')
                }},
                {title: '价格', key: 'price',
                    render: (h, params) => {
                        return h('div', params.row.price === -1 ? '市价': params.row.price)
                    }
                },
                {title: '成交量', key: 'exchangeQuantity'},
                {title: '总量', key: 'total'},
                {title: '金额', key: 'amount',
                    render: (h, params) => {
                        return h('div', params.row.price === -1 ? '市价': (params.row.price * params.row.exchangeQuantity).toFixed(8))
                    }
                }
            ],
            columns2: [
                {title: '委托时间', key: 'entrustmentTime'},
                {title: '市场', key: 'market'},
                {title: '方向', key: 'direction',
                  render: (h, params) => {
                    return h('div', params.row.direction == 1 ? '买' : '卖')
                }},
                {title: '价格', key: 'price',
                    render: (h, params) => {
                        return h('div', params.row.price === -1 ? '市价': params.row.price)
                    }
                },
                {title: '成交均价', key: 'averagePrice'},
                {title: '成交量', key: 'exchangeQuantity'},
                {title: '总量', key: 'total'},
                {title: '成交金额', key: 'exchangeAmount',
                    render: (h, params) => {
                        return h('div', params.row.exchangeAmount === -1 ? '市价': params.row.exchangeAmount)
                    }
                },
                {title: '状态', key: 'state',// 1，正常 2，部分成交 0，已撤销 3，全部成交
                    render: (h, params) => { 
                        return h('div', this.switchStaus(params.row.state))
                    }
                }
            ],
            columns3: [
                {title: '时间', key: 'exchangeTime'},
                {title: '市场', key: 'market'},
                {title: '方向', key: 'direction',
                  render: (h, params) => {
                    return h('div', params.row.direction == 1 ? '买' : '卖')
                }},
                {title: '成交均价', key: 'averagePrice'},
                {title: '成交量', key: 'exchangeQuantity'},
                {title: '成交金额', key: 'exchangeAmount',
                    render: (h, params) => { 
                        return h('div', (params.row.exchangeAmount).toFixed(8))
                    }
                },
                {title: '手续费', key: 'fee'}
            ],
            data1: [],
            data2: [],
            data3: []
        }
    },
    created () {
        this.userCurreny()
        this.historyUserCurreny()
        this.tradeCurreny()
    },
    methods: {
        switchStaus(state) {
            switch(state){
                case 0:
                    return '已撤销'
                    break;
                case 1:
                    return '正常'
                    break;
                case 2:
                    return '部分成交'
                    break;
                case 3:
                    return '全部成交'
                    break;
            }
        },
        closeDialog () {
            this.$emit('removeDialog');
        },
        userCurreny () {
            currenyApi.findUserCurrentEntrustmentList(this.curPage, this.userId, (res, total) => {
                this.total = total
                this.data1 = res
            }, (msg) => {
                this.$Message.error({content: msg})
            })
        },
        changePage (page) {
          this.curPage = page
          this.userCurreny()
        },
        historyUserCurreny () {
            currenyApi.findUserHistoricalEntrustmentList(this.curPage1, this.userId, (res, total) => {
                this.total1 = total
                this.data2 = res
            }, (msg) => {
                this.$Message.error({content: msg})
            })
        },
        changePage1 (page) {
          this.curPage1 = page
          this.historyUserCurreny()
        },
        tradeCurreny () {
            currenyApi.findUserExchangeRecordList(this.curPage2, this.userId, (res, total) => {
                this.total2 = total
                this.data3 = res
            }, (msg) => {
                this.$Message.error({content: msg})
            })
        },
        changePage2 (page) {
          this.curPage2 = page
          this.tradeCurreny()
        }
    }
}
</script>

<style>

</style>
