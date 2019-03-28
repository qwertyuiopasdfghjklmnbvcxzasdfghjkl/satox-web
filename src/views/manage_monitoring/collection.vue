<template>
    <div style="min-width: 1250px">
        <Card>
            <Row style="margin-bottom: 20px;">
                <Col span="2">公链类型：</Col>
                <Col span="4">
                    <select v-model="symbolType"
                            style="width:100px;height:30px;border: 1px solid #dddee1;border-radius: 4px;">
                        <option value="">全部</option>
                        <option value="1">ETH</option>
                        <option value="2">BTC</option>
                        <option value="3">OMNI</option>
                        <option value="4">MBT</option>
                        <option value="5">EOS</option>
                    </select>
                </Col>
                <Col span="2">币种：</Col>
                <Col span="4">
                    <Input v-model="symbol" style="width:100px;"/>
                </Col>
                <Col span="2">用户名：</Col>
                <Col span="4">
                    <Input v-model="username" style="width:100px;"/>
                </Col>
            </Row>
            <Row style="margin-bottom: 20px;">
                <Col span="2">归集状态：</Col>
                <Col span="4">
                    <select v-model="status"
                            style="width:100px;height:30px;border: 1px solid #dddee1;border-radius: 4px;">
                        <option value="">全部</option>
                        <option value="1">未处理</option>
                        <option value="2">等待交易发起</option>
                        <option value="3">交易已发送</option>
                        <option value="4">撤销</option>
                        <option value="5">提现失败</option>
                        <option value="6">对账完成</option>
                        <option value="7">提现失败资金返还</option>
                    </select>
                </Col>
                <Col span="2">交易发起时长：</Col>
                <Col span="4">
                    <select v-model="initiationTime"
                            style="width:100px;height:30px;border: 1px solid #dddee1;border-radius: 4px;">
                        <option value="">全部</option>
                        <option value="1">1h以内</option>
                        <option value="2">2h以内</option>
                        <option value="5">5h以内</option>
                        <option value="24">24小时以内</option>
                    </select>
                </Col>
                <Col span="2">交易ID：</Col>
                <Col span="4">
                    <Input v-model="txId" style="width:100px;"/>
                </Col>
                <Col span="2">
                    <Button type="primary" @click="curPage=1;getconfirmList()">查询</Button>
                </Col>
            </Row>
            <Table :columns="columns1" :data="data1"></Table>
            <Page :current="curPage" :total="total" @on-change="changePage"
                  style="text-align:center;margin-top:20px;"></Page>
        </Card>
    </div>
</template>

<script>
    import monitorApi from '../../api/monitoring';
    import block_scan from './block_scan';
    import util from '../../libs/util';

    export default {
        data () {
            return {
                symbolType: '',
                symbol: '',
                initiationTime: '',
                direction: '',
                username: '',
                txId: '',
                status: '',
                curPage: 1,
                size: 10,
                total: 0,
                columns1: [
                    {
                        title: '交易ID',
                        key: 'txId'
                    },
                    {
                        title: '用户名',
                        key: 'username'
                    },
                    {
                        title: '币种',
                        key: 'symbol'
                    },
                    {
                        title: '公链类型',
                        key: 'symbolType',
                        render: (h, params) => {
                            return h('div', this.switchStaus(params.row.symbolType));
                        }
                    },
                    {
                        title: 'from地址',
                        key: 'fromAddress'
                    },
                    {
                        title: 'to地址',
                        key: 'toAddress'
                    },
                    {
                        title: '数量',
                        key: 'amount'
                    },
                    {
                        title: '矿工费',
                        key: 'btcMinerFee'
                    },
                    {
                        title: '归集状态', //1 等待  2 完成
                        key: 'status',
                        render: (h, params) => {
                            return h('div', this.switchStaus2(params.row.status));
                        }
                    },
                    {
                        title: '交易失败原因',
                        key: 'failMsg'
                    },
                    {
                        title: 'Nounce值',
                        key: 'nonce'
                    },
                    {
                        title: '交易发起时间',
                        key: 'tradeAt'
                    },
                    {
                        title: '交易完成时间',
                        key: 'completeTime'
                    },
                    {
                        title: '解冻归还ID',
                        key: 'tradeWaitingTime'
                    }
                ],
                data1: []
            };
        },
        created () {
            this.getconfirmList();
        },
        methods: {
            switchStaus (state) {
                switch (state) { // 1 BTC 2 ETH 3 OMNI 4 MBT 5 EOS
                    case 1:
                        return 'BTC';
                        break;
                    case 2:
                        return 'ETH';
                        break;
                    case 3:
                        return 'OMNI';
                        break;
                    case 4:
                        return 'MBT';
                        break;
                    case 5:
                        return 'EOS';
                        break;
                }
            },
            switchStaus2 (state) {
                switch (state) { //  1 未处理 2 等待交易发起 3 交易已发送(等待对账) 4 撤销 5 提现失败 6 对账完成 7 提现失败资金返还
                    case 1:
                        return '未处理';
                        break;
                    case 2:
                        return '等待交易发起';
                        break;
                    case 3:
                        return '交易已发送';
                        break;
                    case 4:
                        return '撤销';
                        break;
                    case 5:
                        return '提现失败';
                        break;
                    case 6:
                        return '对账完成';
                        break;
                    case 7:
                        return '提现失败资金返还';
                        break;
                }
            },
            getconfirmList () {
                monitorApi.transfersList({
                    page: this.curPage,
                    size: this.size,
                    symbolType: this.symbolType,
                    initiationTime: this.initiationTime,
                    username: this.username,
                    status: this.status,
                    symbol: this.symbol,
                    txId: this.txId
                }, (res, total) => {
                    this.total = total;
                    this.data1 = res;
                });
            },
            changePage (page) {
                this.curPage = page;
                this.getconfirmList();
            }
        }
    };
</script>
<style scoped>
    .main .single-page-con {
        width: 2500px;
    }

    .ivu-row {
        height: 40px;
        line-height: 40px;
    }
</style>
