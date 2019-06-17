<template>
    <div style="width:2500px;">
        <Card>
            <Row style="margin-bottom: 20px;">
                <Col span="1">{{$t('monitoring.gllx')}}：</Col>
                <Col span="2">
                    <select v-model="symbolType" style="width:100px;height:30px;border: 1px solid #dddee1;border-radius: 4px;">
                        <option value="">{{$t('common.qb')}}</option>
                        <option v-for="item in  symbolTypeList" :value="item.code">{{item.name}}</option>
                    </select>
                </Col>
                <Col span="1">{{$t('common.bz')}}：</Col>
                <Col span="2">
                    <Input v-model="symbol" style="width:100px;"/>
                </Col>
                <Col span="1">{{$t('common.yhm')}}：</Col>
                <Col span="2">
                    <Input v-model="userName" style="width:100px;"/>
                </Col>
             </Row>
             <Row style="margin-bottom: 20px;">
                <Col span="1">{{$t('monitoring.tbzt')}}：</Col>
                <Col span="2">
                    <select v-model="status" style="width:100px;height:30px;border: 1px solid #dddee1;border-radius: 4px;">
                        <option value="">{{$t('common.qb')}}</option>
                        <option value="1">{{$t('risk.wcl')}} </option>
                        <option value="2">{{$t('finance.ddjyfq')}}</option>
                        <option value="3">{{$t('finance.jyyfs')}}</option>
                        <option value="4">{{$t('finance.cx')}} </option>
                        <option value="5">{{$t('finance.txsb')}}</option>
                        <option value="6">{{$t('finance.txwc')}}</option>
                        <option value="7">{{$t('finance.txsbzjfh')}}</option>
                    </select>
                </Col>
                <Col span="1">{{$t('monitoring.jyfqsj')}}：</Col>
                <Col span="2">
                    <DatePicker type="date" v-model="date" :placeholder="$t('common.kssj')" format="yyyy-MM-dd" style="width: 150px"></DatePicker>
                    <!-- <DatePicker v-model="formItem.date" format="yyyy-MM-dd" type="daterange" placement="bottom-end" style="width: 200px"></DatePicker> -->
                </Col>
                <Col span="2">
                    <DatePicker type="date" v-model="date1" :placeholder="$t('common.jssj')" format="yyyy-MM-dd"style="width: 150px"></DatePicker>
                    <!-- <DatePicker v-model="formItem.date" format="yyyy-MM-dd" type="daterange" placement="bottom-end" style="width: 200px"></DatePicker> -->
                </Col>
                <Col span="1">{{$t('finance.txsqid')}}：</Col>
                <Col span="2">
                    <Input v-model="withdrawApplyId" style="width:100px;"/>
                </Col>
                <Col span="2">
                    <Button type="primary" @click="select">{{$t('common.cx')}}</Button>
                </Col>
            </Row>

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
                        title: this.$t('finance.txsqid'),
                        key: 'withdrawApplyId'
                    },
                    {
                        title: this.$t('common.jyid'),
                        key: 'txId'
                    },
                    {
                        title: this.$t('common.yhm'),
                        key: 'userName'
                    },
                    {
                        title: this.$t('common.bz'),
                        key: 'symbol'
                    },
                    {
                        title: this.$t('monitoring.gllx'),
                        key: 'symbolType',
                        render: (h, params) => {
                            return h('div',this.switchStaus(params.row.symbolType))
                        }
                    },
                    {
                        title: this.$t('monitoring.xtdbdz'),
                        key: 'fromAddress'
                    },
                    {
                        title: this.$t('monitoring.yhsbdz'),
                        key: 'toAddress'
                    },
                    {
                        title: 'Memo',
                        key: 'memo'
                    },
                    {
                        title: this.$t('monitoring.txed'),
                        key: 'withdrawAmount'
                    },
                    {
                        title: this.$t('finance.txsxf'),
                        key: 'fee'
                    },
                    {
                        title: this.$t('exchange.kgf'),
                        key: 'minerFee'
                    },
                    {
                        title: this.$t('monitoring.tbzt'), //1 未处理 2 等待交易发起 3 交易已发送(等待对账) 4 撤销 5 提现失败 6对账完成 7提现失败资金返还
                        key: 'status',
                        render: (h, params) => {
                            return  h('div', this.statusSwicth(params.row.status))
                        }
                    },
                    {
                        title: this.$t('monitoring.jysbyy'),
                        key: 'failMsg',
                        width: 500
                    },
                    {
                        title: this.$t('monitoring.nz'),
                        key: 'nonce'
                    },
                    {
                        title: this.$t('monitoring.sqsj'),
                        key: 'createdTime'
                    },
                    {
                        title: this.$t('monitoring.jyfqsj'),
                        key: 'tradeTime'
                    },
                    {
                        title: this.$t('monitoring.jywcsj'),
                        key: 'competedTime'
                    },
                    {
                        title: this.$t('monitoring.jejdthid'),
                        key: 'unfrozenLedgerId',
                        width: 150
                    },
                ],
                data9: [],
                symbolTypeList: [],
            }
        },
        created () {
            this.getApplyList()
            this.symbolTypeList = JSON.parse(window.localStorage.symbolTypes);
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
                return this.symbolTypeList.map((res) => {
                    if (res.code == state) {
                        return res.name;
                    }
                });
            },
            statusSwicth(state) { //1 未处理 2 等待交易发起 3 交易已发送(等待对账) 4 撤销 5 提现失败 6对账完成 7提现失败资金返还
                switch(state){
                    case 1:
                        return this.$t('risk.wcl');
                        break;
                    case 2:
                        return this.$t('finance.ddjyfq');
                        break;
                    case 3:
                        return this.$t('finance.jyyfs');
                        break;
                    case 4:
                        return this.$t('finance.cx');
                        break;
                    case 5:
                        return this.$t('finance.txsb');
                        break;
                    case 6:
                        return this.$t('finance.txwc');
                        break;
                    case 7:
                        return this.$t('finance.txsbzjfh');
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
