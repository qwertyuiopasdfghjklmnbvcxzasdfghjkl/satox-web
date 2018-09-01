<template>
    <div style="width:1800px;">
        <Card>
            <p slot="title">账户信息</p>
            <Row style="margin-bottom: 20px;">
                
                <Col span="1">用户名：</Col>
                <Col span="2">
                    <Input v-model="username"   style="width:100px;"/>
                </Col>
                <Col span="1">币种：</Col>
                <Col span="2">
                    <Input v-model="symbol" style="width:80px;"/>
                </Col>
                <Col span="1">锁定状态：</Col>
                <Col span="2">
                    <select v-model="locked" style="width:100px;height:30px;border: 1px solid #dddee1;border-radius: 4px;">
                        <option value="">全部</option>
                        <option value="0">未锁定</option>
                        <option value="1">锁定</option>
                    </select>
                </Col>
                <Col span="2">
                    <Button type="primary" @click="curPage=1;getfindAccountList()">查询</Button>
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
                        title: '用户名',
                        key: 'username'
                    },
                    {
                        title: '币种',
                        key: 'symbol'
                    },
                    {
                        title: '账户ID',
                        key: 'accountId'
                    },
                    {
                        
                        title: '锁定状态', // 0  未锁定   1  锁定
                        key: 'locked',
                        render: (h, params) => {
                            let status = Number(params.row.locked)
                            let color = ''
                            switch(status){
                                case 0:
                                    color = '#495060'
                                    break;
                                case 1:
                                    color = 'red'
                                    break;
                            }
                            return h('div', [
                                h('div', {
                                    style: { color: color}
                                }, params.row.locked === '0' ? '未锁定': '锁定'),
                            ])
                        }
                    },
                    {
                        title: '用户真实姓名',
                        key: 'userRealName'
                    },
                    {
                        title: '手机号',
                        key: 'mobile'
                    },
                    {
                        title: '邮箱',
                        key: 'email'
                    },
                    {
                        title: '钱包地址',
                        key: 'address'
                    },
                    {
                        title: '总金额',
                        key: 'totalBalance'
                    },
                    {
                        title: '可用金额',
                        key: 'availableBalance'
                    },
                    {
                        title: '冻结金额',
                        key: 'frozenBalance'
                    },
                    {
                        title: '广告冻结金额',
                        key: 'adFrozenBalance'
                    },
                    {
                        title: '每日提现限额',
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
