<template>
    <div style="min-width: 1250px">
        <Card>
            <Row style="margin-bottom: 20px;">
                <Col span="2">公链类型：</Col>
                <Col span="4">
                    <select v-model="symbolType"
                            style="width:100px;height:30px;border: 1px solid #dddee1;border-radius: 4px;">
                        <option value="">全部</option>
                        <option value="1">BTC</option>
                        <option value="2">ETH</option>
                        <option value="3">OMNI</option>
                        <!--<option value="4">MBT</option>-->
                    </select>
                </Col>
                <Col span="2">币种：</Col>
                <Col span="4">
                    <Input v-model="symbol" style="width:100px;"/>
                </Col>
                <Col span="2">用户名：</Col>
                <Col span="4">
                    <Input v-model="userName" style="width:100px;"/>
                </Col>
            </Row>
            <Row style="margin-bottom: 20px;">
                <Col span="2">归集状态：</Col>
                <Col span="4">
                    <select v-model="direction"
                            style="width:100px;height:30px;border: 1px solid #dddee1;border-radius: 4px;">
                        <option value="">全部</option>
                        <option value="1">等待交易发起</option>
                        <option value="2">交易已发送</option>
                        <option value="3">撤销</option>
                        <option value="4">归集失败</option>
                        <option value="5">归集完成</option>
                        <option value="5">归集失败资金返还</option>
                    </select>
                </Col>
                <Col span="2">交易发起时长：</Col>
                <Col span="4">
                    <select v-model="time"
                            style="width:100px;height:30px;border: 1px solid #dddee1;border-radius: 4px;">
                        <option value="">全部</option>
                        <option value="3">1h以上</option>
                        <option value="4">2h以</option>
                        <option value="6">5h以上</option>
                        <option value="8">24h以上</option>
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
                time: '',
                direction: '',
                userName: '',
                txId: '',
                status: 1,
                curPage: 1,
                total: 0,
                columns1: [
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
                        key: 'minerFee'
                    },
                    {
                        title: '归集状态', //1 等待  2 完成
                        key: 'status',
                        render: (h, params) => {
                            return h('div', params.row.status === 1 ? '等待' : '完成');
                        }
                    },
                    {
                        title: '交易失败原因',
                        key: 'ledgeredFlag'
                    },
                    {
                        title: 'Nounce值',
                        key: 'createdTime'
                    },
                    {
                        title: '交易发起时间',
                        key: 'createdTime'
                    },
                    {
                        title: '交易完成时间',
                        key: 'createdTime'
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
            switchStaus1 (state) {
                switch (state) {
                    case 1:
                        return '用户充值';
                        break;
                    case 2:
                        return '用户提现';
                        break;
                    case 3:
                        return '交易所归集';
                        break;
                    case 4:
                        return '冷钱包充值';
                        break;
                    case 5:
                        return '冷钱包提现';
                        break;
                }
            },
            switchStaus (state) {
                switch (state) {
                    case '1':
                        return 'BTC';
                        break;
                    case '2':
                        return 'ETH';
                        break;
                    case '3':
                        return 'OMNI';
                        break;
                    case '4':
                        return 'MBT';
                        break;
                    case 5:
                        return 'EOS';
                        break;
                }
            },
            getconfirmList () {
                monitorApi.confirmList(this.curPage, {
                    symbolType: this.symbolType || '',
                    symbol: this.symbol || '',
                    timeInterval: this.time || '',
                    direction: this.direction || '',
                    userName: this.userName || '',
                    txId: this.txId || '',
                    status: this.status
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
