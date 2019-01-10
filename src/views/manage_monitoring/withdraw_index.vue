<template>
    <div style="width:2500px;">
        <Card>
            <Row style="margin-bottom: 20px;">
                <Col span="1">公链类型：</Col>
                <Col span="2">
                    <select v-model="symbolType" style="width:100px;height:30px;border: 1px solid #dddee1;border-radius: 4px;">
                        <option value="">全部</option>
                        <option value="1">BTC</option>
                        <option value="2">ETH</option>
                        <option value="3">OMNI</option>
                        <option value="4">MBT</option>
                    </select>
                </Col>
                <Col span="1">币种：</Col>
                <Col span="2">
                    <Input v-model="symbol" style="width:100px;"/>
                </Col>
                <Col span="1">用户名：</Col>
                <Col span="2">
                    <Input v-model="userName" style="width:100px;"/>
                </Col>
             </Row>
             <Row style="margin-bottom: 20px;">
                <Col span="1">提币状态：</Col>
                <Col span="2">
                    <select v-model="status" style="width:100px;height:30px;border: 1px solid #dddee1;border-radius: 4px;">
                        <option value="">全部</option>
                        <option value="1">未处理 </option>
                        <option value="2">等待交易发起</option>
                        <option value="3">交易已发送(等待对账)</option>
                        <option value="4">撤销 </option>
                        <option value="5">提现失败</option>
                        <option value="6">提现完成</option>
                        <option value="7">提现失败资金返还</option>
                    </select>
                </Col>
                <Col span="1">交易发起时间：</Col>
                <Col span="2">
                    <DatePicker type="date" v-model="date" placeholder="开始时间" format="yyyy-MM-dd" style="width: 150px"></DatePicker>
                    <!-- <DatePicker v-model="formItem.date" format="yyyy-MM-dd" type="daterange" placement="bottom-end" style="width: 200px"></DatePicker> -->
                </Col>
                <Col span="2">
                    <DatePicker type="date" v-model="date1" placeholder="结束时间" format="yyyy-MM-dd"style="width: 150px"></DatePicker>
                    <!-- <DatePicker v-model="formItem.date" format="yyyy-MM-dd" type="daterange" placement="bottom-end" style="width: 200px"></DatePicker> -->
                </Col>
                <Col span="1">提现申请ID：</Col>
                <Col span="2">
                    <Input v-model="withdrawApplyId" style="width:100px;"/>
                </Col>
                <Col span="2">
                    <Button type="primary" @click="select">查询</Button>
                </Col>
            </Row>
            <!-- <Table :columns="columns1" :data="data1"></Table> -->

            <Table :columns="columns10" :data="data9"></Table>
            <Page :current="curPage" :total="total" @on-change="changePage" style="text-align:center;margin-top:20px;"></Page>  
         </Card>    
    </div>
</template>
<script>
import expandRow from './table-expand.vue';
import monitorApi from '../../api/monitoring'
import util from '../../libs/util'
    export default {
        components: { expandRow },
        data () {
            return {
                curPage: 1,
                total: 0,
                // formItem: {
                    symbolType: '',
                    symbol: '',
                    status: '',
                    date: '',
                    date1: '',
                    userName: '',
                    withdrawApplyId: '',
                // },
                columns10: [
                    {
                        type: 'expand',
                        width: 50,
                        render: (h, params) => {
                            return h(expandRow, {
                                props: {
                                    row: params.row
                                }
                            })
                        }
                    },
                    {
                        title: '提现申请ID',
                        key: 'withdrawApplyId'
                    },
                    {
                        title: '交易ID',
                        key: 'txId'
                    },
                    {
                        title: '用户名',
                        key: 'userName'
                    },
                    {
                        title: '币种',
                        key: 'symbol'
                    },
                    {
                        title: '公链类型',
                        key: 'symbolType',
                        render: (h, params) => {
                            return h('div',this.switchStaus(params.row.symbolType))
                        }
                    },
                    {
                        title: '系统打币地址',
                        key: 'fromAddress'
                    },
                    {
                        title: '用户收币地址',
                        key: 'toAddress'
                    },
                    {
                        title: '提现数额',
                        key: 'withdrawAmount'
                    },
                    {
                        title: '提现手续费',
                        key: 'fee'
                    },
                    {
                        title: '矿工费',
                        key: 'minerFee'
                    },
                    {
                        title: '提币状态', //1 未处理 2 等待交易发起 3 交易已发送(等待对账) 4 撤销 5 提现失败 6对账完成 7提现失败资金返还
                        key: 'status',
                        render: (h, params) => {
                            return  h('div', this.statusSwicth(params.row.status))
                        }
                    },
                    {
                        title: '交易失败原因',
                        key: 'failMsg',
                        width: 500
                    },
                    {
                        title: 'nonce值',
                        key: 'nonce'
                    },
                    {
                        title: '申请时间',
                        key: 'createdTime'
                    },
                    {
                        title: '交易发起时间',
                        key: 'tradeTime'
                    },
                    {
                        title: '交易完成时间',
                        key: 'competedTime'
                    },
                    {
                        title: '金额解冻退还ID',
                        key: 'unfrozenLedgerId',
                        width: 150
                    }
                ],
                data9: []
            }
        },
        created () {
            this.getApplyList()
        },
        computed: {
            params () {
            let data = {
                symbolType: this.symbolType,
                symbol: this.symbol,
                status: this.status,
                withdrawApplyId: this.withdrawApplyId,
                userName: this.userName
            }
            // data.beginDate = util.dateToStr(new Date(), 'yyyy-MM-dd 00:00:00')
             if (this.date) {
                data.beginTime = util.dateToStrDate(this.date)
            } 
            if (this.date1) {
                data.endTime = util.dateToStrDate(this.date1)
            } 
            return data
            }
        },
        methods: {
            switchStaus(state) { 
                switch(state){
                    case '1':
                        return 'BTC'
                        break;
                    case '2':
                        return 'ETH'
                        break;
                    case '3':
                        return 'OMNI'
                        break;
                    case '4':
                        return 'MBT'
                        break;
                    case 5:
                        return 'EOS'
                        break;
                }
            },
            statusSwicth(state) { //1 未处理 2 等待交易发起 3 交易已发送(等待对账) 4 撤销 5 提现失败 6对账完成 7提现失败资金返还
                switch(state){
                    case 1:
                        return '未处理'
                        break;
                    case 2:
                        return '等待交易发起'
                        break;
                    case 3:
                        return '交易已发送(等待对账)'
                        break;
                    case 4:
                        return '撤销'
                        break;
                    case 5:
                        return '提现失败'
                        break;
                    case 6:
                        return '提现完成'
                        break;
                    case 7:
                        return '提现失败资金返还'
                        break;
                }
            },
            select () {
                monitorApi.findAllWithdrawApplyList(this.curPage, this.params, (res, total) => {
                    this.total = total
                    this.data9 = res
                }, (msg) => {
                   this.$Message.error({name: msg}) 
                })
            },
            getApplyList () {
                monitorApi.findAllWithdrawApplyList(this.curPage, {}, (res, total) => {
                    this.total = total
                    this.data9 = res
                }, (msg) => {
                     this.$Message.error({name: msg}) 
                })
            },
            changePage (page) {
                this.curPage = page
                this.getApplyList()
            }
        }
    }
</script>
<style scoped>
.single-page-con{width: 2500px;}
.ivu-row{height: 40px;line-height: 40px;}
</style>