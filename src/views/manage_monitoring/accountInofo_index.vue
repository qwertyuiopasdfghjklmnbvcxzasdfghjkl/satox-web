<template>
    <div style="width:1800px;">
        <Card>
            <p slot="title">{{$t('monitoring.zhxx')}}</p>
            <Row style="margin-bottom: 20px;">

                <Col span="1">{{$t('common.yhm')}}：</Col>
                <Col span="2">
                    <Input v-model="username"   style="width:100px;"/>
                </Col>
                <Col span="1">{{$t('common.bz')}}：</Col>
                <Col span="2">
                    <Input v-model="symbol" style="width:80px;"/>
                </Col>
                <Col span="1">{{$t('monitoring.sdzt')}}：</Col>
                <Col span="2">
                    <select v-model="locked" style="width:100px;height:30px;border: 1px solid #dddee1;border-radius: 4px;">
                        <option value="">{{$t('common.qb')}}</option>
                        <option value="0">{{$t('monitoring.wsd')}}</option>
                        <option value="1">{{$t('monitoring.sd')}}</option>
                    </select>
                </Col>
                <Col span="2">
                    <Button type="primary" @click="curPage=1;getfindAccountList()">{{$t('common.cx')}}</Button>
                </Col>
            </Row>
            <Table :columns="columns1" :data="data1"></Table>
            <Page :current="curPage" :total="total" @on-change="changePage" style="text-align:center;margin-top:20px;"></Page>
        </Card>

    </div>
</template>
<script>
import monitApi from '../../api/monitoring'
    export default {
        data () {
            return {
                username: '',
                symbol: '',
                locked: '1',
                curPage: 1,
                total: 0,
                columns1: [
                    {
                        title: this.$t('common.yhm'),
                        key: 'username'
                    },
                    {
                        title: this.$t('common.bz'),
                        key: 'symbol'
                    },
                    {
                        title: this.$t('system.zhid'),
                        key: 'accountId'
                    },
                    {

                        title: this.$t('monitoring.sdzt'), // 0  未锁定   1  锁定
                        key: 'locked',
                        render: (h, params) => {
                            let status = params.row.locked
                            let color = ''
                            switch(status){
                                case '0':
                                    color = 'green'
                                    break;
                                case '1':
                                    color = '#ff8041'
                                    break;
                            }
                            return h('div', [
                                h('div', {
                                    style: { color: color}
                                }, params.row.locked === '1' ? this.$t('monitoring.sd') : this.$t('monitoring.wsd')),
                            ])
                        }
                    },
                    {
                        title: this.$t('monitoring.yhzsxm'),
                        key: 'userRealName'
                    },
                    {
                        title: this.$t('common.sjh'),
                        key: 'mobile'
                    },
                    {
                        title: this.$t('monitoring.yx'),
                        key: 'email'
                    },
                    {
                        title: this.$t('system.qbdz'),
                        key: 'address'
                    },
                    {
                        title: this.$t('common.zje'),
                        key: 'totalBalance'
                    },
                    {
                        title: this.$t('common.kyje'),
                        key: 'availableBalance'
                    },
                    {
                        title: this.$t('common.djje'),
                        key: 'frozenBalance'
                    },
                    {
                        title: this.$t('monitoring.ggdjje'),
                        key: 'adFrozenBalance'
                    },
                    {
                        title: this.$t('monitoring.mrtbxe'),
                        key: 'withdrawAmount'
                    }
                ],
                data1: []
            }
        },
        created () {
            this.getfindAccountList()
        },
        methods: {
            getfindAccountList () {
                monitApi.findAccountList(this.curPage, {
                    username: this.username || '',
                    symbol: this.symbol || '',
                    locked: this.locked || ''
                }, (res, total) => {
                    this.total = total
                    this.data1 = res
                })
            },
            changePage (page) {
                this.curPage = page
                this.getfindAccountList()
            }
        }
    }
</script>
<style scoped>
.ivu-row{height: 40px;line-height: 40px;}
</style>
