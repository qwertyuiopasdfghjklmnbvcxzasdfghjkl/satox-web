<template>
  <div style="width:2500px;">
     <Card>
       <Row style="margin-bottom: 20px;">
                <Col span="1">{{$t('monitoring.gllx')}}：</Col>
                <Col span="2">
                    <select v-model="symbolType" style="width:100px;height:30px;border: 1px solid #dddee1;border-radius: 4px;">
                        <option value="">{{$t('common.qb')}}</option>
                        <option v-for="item in  symbolTypeList" :value="item.code" >{{item.name}}</option>
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
                    </select>
                </Col>
                <Col span="1">{{$t('monitoring.jyfqsj')}}：</Col>
                <Col span="2">
                    <select v-model="time" style="width:100px;height:30px;border: 1px solid #dddee1;border-radius: 4px;">
                        <option value="">{{$t('common.qb')}}</option>
                        <option value="1">{{$t('monitoring.ldwxsyn')}} </option>
                        <option value="2">{{$t('monitoring.ldwxsys')}}</option>
                        <option value="3">{{$t('monitoring.yxsys')}}</option>
                        <option value="4">{{$t('monitoring.lxsys')}}</option>
                        <option value="5">{{$t('monitoring.sxsys')}}</option>
                        <option value="6">{{$t('monitoring.wxsys')}}</option>
                        <option value="7">{{$t('monitoring.shixsys')}}</option>
                        <option value="8">{{$t('monitoring.esxsys')}}</option>
                        <option value="9">{{$t('monitoring.sbxsys')}}</option>
                        <option value="10">{{$t('monitoring.qexsys')}}</option>
                    </select>
                </Col>
                <Col span="1">{{$t('finance.txsqid')}}：</Col>
                <Col span="2">
                    <Input v-model="withdrawApplyId"  style="width:100px;"/>
                </Col>
                <Col span="2">
                    <Button type="primary" @click="curPage=1;getWithdrawApplyList()">{{$t('common.cx')}}</Button>
                </Col>
            </Row>
            <!-- <Table :columns="columns1" :data="data1"></Table> -->
            <Table :columns="columns10" :data="data9"></Table>
            <Page :current="curPage" :total="total" @on-change="changePage" style="text-align:center;margin-top:20px;"></Page>
     </Card>
  </div>
</template>
<script>
import expandRow from './table-expand1.vue';
import monitorApi from '../../api/monitoring'
    export default {
       components: { expandRow },
        data () {
            return {
                symbolType: '',
                symbol: '',
                status:　'',
                time: '',
                withdrawApplyId: '',
                userName: '',
                curPage: 1,
                total: 0,
                symbolTypeList:[],
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
                        title: this.$t('common.jyid'),
                        key: 'txId'
                    },
                    {
                        title: this.$t('finance.txsqid'),
                        key: 'withdrawApplyId'
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
                        title: this.$t('monitoring.shzt'), //0 未审核  1 审核不通过  2 审核通过
                        key: 'auditStatus',
                        render: (h, params) => {
                            return  h('div', this.statusSwicth(params.row.auditStatus))
                        }
                    },
                    {
                        title: this.$t('monitoring.tbzt'),  //1 未处理  2 等待交易发起  3 交易已发送(等待记账)
                        key: 'status',
                         render: (h, params) => {
                            return  h('div', this.statusSwicth1(params.row.status))
                        }
                    },
                    {
                        title: this.$t('monitoring.jysbyy'),
                        key: 'failMsg'
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
                        title: this.$t('monitoring.jyfqsc'),
                        key: 'tradeWaitingTime',
                        render: (h, params) =>{
                            return h('div', [params.row.tradeWaitingTime, 'h'])
                        }
                    }
                ],
                data9: []
            }
        },
        created () {
            this.getWithdrawApplyList();
            this.symbolTypeList = JSON.parse(window.localStorage.symbolTypes);
        },
        methods: {
            switchStaus(state) {
                return this.symbolTypeList.map((res) => {
                    if (res.code == state) {
                        return res.name;
                    }
                });
            },
            statusSwicth(state) { //0 未审核  1 审核不通过  2 审核通过
                switch(state){
                    case 0:
                        return this.$t('common.wsh')
                        break;
                    case 1:
                        return this.$t('common.wsbtg')
                        break;
                    case 2:
                        return this.$t('common.wstg')
                        break;

                }
            },
            statusSwicth1 (state) { //1 未处理  2 等待交易发起  3 交易已发送(等待记账)
                switch(state){
                    case 1:
                        return this.$t('risk.wcl')
                        break;
                    case 2:
                        return this.$t('finance.ddjyfq')
                        break;
                    case 3:
                        return this.$t('finance.jyyfs')
                        break;

                }
            },
            getWithdrawApplyList () {
                monitorApi.findWaitingWithdrawApplyList(this.curPage, {
                    symbolType: this.symbolType || '',
                    symbol: this.symbol || '',
                    status:　this.status || '',
                    timeInterval: this.time || '',
                    withdrawApplyId: this.withdrawApplyId || '',
                    userName: this.userName || '',
                }, (res, total) => {
                    this.total = total
                    this.data9 = res
                })
            },
            changePage (page) {
                this.curPage = page
                this.getWithdrawApplyList()
            }
        }
    }
</script>
<style scoped>
.ivu-row{height: 40px;line-height: 40px;}
</style>
