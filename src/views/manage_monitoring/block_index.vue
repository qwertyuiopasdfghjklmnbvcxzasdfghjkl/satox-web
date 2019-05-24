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
            <Col span="1">{{$t('common.zt')}}：</Col>
             <Col span="2">
                <select v-model="status" style="width:100px;height:30px;border: 1px solid #dddee1;border-radius: 4px;">
                    <option value="">{{$t('common.qb')}}</option>
                    <option value="1">{{$t('common.dd')}}</option>
                    <option value="2">{{$t('common.wc')}}</option>
                </select>
            </Col>
        </Row>
        <Row style="margin-bottom: 20px;">
            <Col span="1">{{$t('monitoring.jyfx')}}：</Col>
            <Col span="2">
                <select v-model="direction" style="width:100px;height:30px;border: 1px solid #dddee1;border-radius: 4px;">
                    <option value="">{{$t('common.qb')}}</option>
                    <option value="1">{{$t('monitoring.yhcz')}}</option>
                    <option value="2">{{$t('monitoring.yhtx')}}</option>
                    <option value="3">{{$t('monitoring.jysgj')}}</option>
                    <option value="4">{{$t('monitoring.lqbcz')}}</option>
                    <option value="5">{{$t('monitoring.lqbtx')}}</option>
                </select>
            </Col>
            <Col span="1">{{$t('monitoring.qkddsc')}}：</Col>
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
            <Col span="1">{{$t('common.jyid')}}：</Col>
            <Col span="2">
                <Input v-model="txId"  style="width:100px;"/>
            </Col>
            <Col span="2">
                <Button type="primary" @click="curPage=1;getconfirmList()">{{$t('common.cx')}}</Button>
                <!--<Button type="primary" @click="block">区块扫描进度</Button>-->
            </Col>
        </Row>
         <Table :columns="columns1" :data="data1"></Table>
         <Page :current="curPage" :total="total" @on-change="changePage" style="text-align:center;margin-top:20px;"></Page>
     </Card>
  </div>
</template>

<script>
import monitorApi from '../../api/monitoring'
import block_scan from './block_scan'
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
                        title: this.$t('common.jyid'),
                        key: 'txId'
                    },
                    {
                        title: this.$t('common.yhm'),
                        key: 'userName'
                    },
                    {
                        title: this.$t('monitoring.zhid'),
                        key: 'accountId'
                    },
                    {
                        title: this.$t('common.bz'),
                        key: 'symbol'
                    },
                    {
                        title: this.$t('monitoring.gllx'),
                        key: 'symbolType',
                        render: (h, params) => {
                            return h('div', this.switchStaus(params.row.symbolType))
                        }
                    },
                    {
                        title: this.$t('monitoring.jyfx'),
                        key: 'direction',
                        render: (h, params) => {
                            return h('div', this.switchStaus1(params.row.direction))
                        }
                    },
                    {
                        title: this.$t('monitoring.fdz'),
                        key: 'fromAddress'
                    },
                    {
                        title: this.$t('monitoring.tdz'),
                        key: 'toAddress'
                    },
                    {
                        title: 'Memo',
                        key: 'memo'
                    },
                    {
                        title: this.$t('monitoring.se'),
                        key: 'amount'
                    },
                    {
                        title: this.$t('exchange.sxf'),
                        key: 'procedureFee'
                    },
                    {
                        title: this.$t('exchange.kgf'),
                        key: 'minerFee'
                    },
                    {
                        title: this.$t('monitoring.qkqrs'),
                        key: 'confirmation'
                    },
                    {
                        title: this.$t('monitoring.qkh'),
                        key: 'blockNumber'
                    },
                    {
                        title: this.$t('common.zt'), //1 等待  2 完成
                        key: 'status',
                        render: (h, params) => {
                            return h('div', params.row.status === 1 ? this.$t('common.dd'): this.$t('common.wc'))
                        }
                    },
                    {
                        title: this.$t('monitoring.sfyjz'),  //0 未记账  1 已记账
                        key: 'ledgeredFlag',
                        render: (h, params) => {
                            return h('div', params.row.ledgeredFlag === 0 ? this.$t('monitoring.wjz'): this.$t('monitoring.yjz'))
                        }
                    },
                    {
                        title: this.$t('common.cjsj'),
                        key: 'createdTime'
                    },
                    {
                      title: this.$t('monitoring.qkddsc'),
                      key: 'tradeWaitingTime',
                      width: 120,
                      render: (h, params) => {
                          return h('div', [params.row.tradeWaitingTime, 'h'])
                      }
                    }
                ],
                data1: [],
                symbolTypeList: [],
            }
        },
        created () {
            this.getconfirmList()
            this.symbolTypeList = JSON.parse(window.localStorage.symbolTypes);
        },
        methods: {
            switchStaus1(state) {
                switch(state){
                    case 1:
                        return this.$t('monitoring.yhcz')
                        break;
                    case 2:
                        return this.$t('monitoring.yhtx')
                        break;
                    case 3:
                        return this.$t('monitoring.jysgj')
                        break;
                    case 4:
                        return this.$t('monitoring.lqbcz')
                        break;
                    case 5:
                        return this.$t('monitoring.lqbtx')
                        break;
                }
            },
            block () {
                util.setDialog(block_scan)
            },
            switchStaus(state) {
                return this.symbolTypeList.map((res) => {
                    if (res.code == state) {
                        return res.name;
                    }
                });
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
                    this.total = total
                    this.data1 = res
                })
            },
            changePage (page) {
                this.curPage = page
                this.getconfirmList()
            }
        }
    }
</script>
<style scoped>
.main .single-page-con{width: 2500px;}
.ivu-row{height: 40px;line-height: 40px;}
</style>
