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
                    </select>
                </Col>
                <Col span="1">交易发起时长：</Col>
                <Col span="2">
                    <select v-model="time" style="width:100px;height:30px;border: 1px solid #dddee1;border-radius: 4px;">
                        <option value="">全部</option>
                        <option value="1">0.5h以内 </option>
                        <option value="2">0.5h以上</option>
                        <option value="3">1h以上</option>
                        <option value="4">2h以</option>
                        <option value="5">3h以上</option>
                        <option value="6">5h以上</option>
                        <option value="7">10h以上</option>
                        <option value="8">24h以上</option>
                        <option value="9">48h以上</option>
                        <option value="10">72h以上</option>
                    </select>
                </Col>
                <Col span="1">提现申请ID：</Col>
                <Col span="2">
                    <Input v-model="withdrawApplyId"  style="width:100px;"/>
                </Col>
                <Col span="2">
                    <Button type="primary" @click="curPage=1;getWithdrawApplyList()">查询</Button>
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
                // formItem: {
                //     date: '',
                //     date1: ''
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
                        title: '交易ID',
                        key: 'txId'
                    },
                    {
                        title: '提现申请ID',
                        key: 'withdrawApplyId'
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
                        title: '审核状态', //0 未审核  1 审核不通过  2 审核通过
                        key: 'auditStatus',
                        render: (h, params) => {
                            return  h('div', this.statusSwicth(params.row.auditStatus))
                        }
                    },
                    {
                        title: '提币状态',  //1 未处理  2 等待交易发起  3 交易已发送(等待记账)
                        key: 'status',
                         render: (h, params) => {
                            return  h('div', this.statusSwicth1(params.row.status))
                        }
                    },
                    {
                        title: '交易失败原因',
                        key: 'failMsg'
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
                        title: '交易发起时长',
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
            this.getWithdrawApplyList()
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
            statusSwicth(state) { //0 未审核  1 审核不通过  2 审核通过
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
            statusSwicth1 (state) { //1 未处理  2 等待交易发起  3 交易已发送(等待记账)
                switch(state){
                    case 1:
                        return '未处理'
                        break;
                    case 2:
                        return '等待交易发起'
                        break;
                    case 3:
                        return '交易已发送(等待记账)'
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