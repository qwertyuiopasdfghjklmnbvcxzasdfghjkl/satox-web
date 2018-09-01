<template>
    <Modal v-model="show" title="订单列表" width="1200">
        <Row>
            <Form :model="searchForm">
                <p class="notwrap">
                    <span>订单列表</span>
                    <span class="padding-left-20">
                        <Checkbox v-model="state">正在交易的订单</Checkbox>
                    </span>
                </p>
            </Form>
        </Row>
        <Row class="margin-top-10">
            <Table :columns="columns" :data="datas"></Table>
        </Row>
        <Row class="margin-top-10">
            <div style="float:right;">
                <Page :total="params.totalPage" :current="params.page" :page-size="params.show" @on-change="pageChange"></Page>
            </div>
        </Row>
        <div slot="footer">
            <Button @click="show=false">关闭</Button>
        </div>
    </Modal>
</template>

<script>
import util from '@/libs/util';
export default {
    props: ['value', 'orderParams'],
    data () {
        return {
            show: this.value,
            searchForm: {
                name: '',
                type: null
            },
            state: false,
            params: {
                page: 1,
                totalPage: 0,
                show: 10
            },
            columns: [
                {title: '订单号', key: 'order_number'},
                {title: '买家账号', key: 'user_name'},
                {title: '交易金额', key: 'symbol_count'},
                {title: '支付金额', key: 'currency_count'},
                {title: '交易状态', key: 'state', render: (h, params) => {
                    var state = params.row.state;
                    var style = {};
                    if (state === 1) {
                        state = params.row.pay_state === 1 ? '已付款' : '待付款';
                        style = params.row.pay_state === 1 ? {color: '#2db7f5'} : {color: '#f90'};
                    } else if (state === 2) {
                        state = '已完成';
                        style = {color: '#19be6b'};
                    } else if (state === 3) {
                        state = '已取消';
                        style = {color: '#ed3f14'};
                    }
                    return h('div', {
                        style: style
                    }, [state]);
                }},
                {title: '交易限时', key: 'verify_idcard'},
                {title: '操作', key: 'action', width: 300, render: (h, params) => {
                    var pay_state = params.row.state;
                    var id = params.row.id;
                    if (pay_state !== 1) {
                        return '';
                    }
                    if (params.row.pay_state === 0) {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary', size: 'small'},
                                    on: {
                                        click: () => {
                                            this.remindBuyer(id);
                                        }
                                    }
                            }, '提醒买家付款')
                        ]);
                    }
                    return h('div', [
                        h('Button', {
                            props: {
                                type: 'primary', size: 'small'},
                                style: { marginRight: '10px'},
                                on: {
                                    click: () => {
                                        this.remindSeller(id);
                                    }
                                }
                        }, '提醒卖家放币'),
                        h('Button', {
                            props: {type: 'primary', size: 'small'},
                            style: { marginRight: '10px'},
                            on: {
                                click: () => {
                                    this.forcePutCoins(id);
                                }
                            }
                        }, '强行放币')
                    ]);
                }}
            ],
            datas: []
        };
    },
    computed: {
        paramsChange () {
            var p = {
                page: this.params.page,
                show: this.params.show,
                state: this.state ? 1 : 0,
                trade_type: this.orderParams ? this.orderParams.ad_type : null,
                symbol: this.orderParams ? this.orderParams.symbol : null,
                ad_id: this.orderParams ? this.orderParams.ad_id : null
            }
            if (!p.state) {
                delete p.state;
            }
            return p;
        }
    },
    watch: {
        value (bool) {
            this.show = bool
        },
        show (bool) {
            if (!bool) {
                this.datas = [];
                this.params.totalPage = 0;
            }
            this.$emit('input', bool)
        },
        paramsChange (p) {
            if (p.ad_id) {
                this.getOrderList();
            }
        }
    },
    created () {
    },
    methods: {
        getOrderList () { // 获取订单列表
            util.ajax.get('api/v1/manage/otc/orders', {
                params: this.paramsChange
            }).then((res) => {
                if (res.data && res.data.rst === 1) {
                    this.datas = res.data.data;
                    this.params.totalPage = res.data.total;
                    if (Math.ceil(res.data.total / this.params.show) < this.params.page) {
                        this.params.page = 1;
                    }
                } else if (res.data && res.data.rst !== 1){
                    this.$Message.error(res.data.msg);
                    window.console.log(res.data.msg);
                }
            }).catch((error) => {
                this.$Message.error('其他错误');
                window.console.log(error);
            });
        },
        pageChange (page) { // 翻页
            this.params.page = page;
        },
        forcePutCoins (id) { // 强行放币
            util.ajax.put(`api/v1/manage/otc/orders/${id}`).then((res) => {
                if (res.data && res.data.rst === 1) {
                    this.$Message.success(res.data.msg);
                    this.getOrderList();
                } else if (res.data && res.data.rst !== 1){
                    this.$Message.error(res.data.msg);
                    window.console.log(res.data.msg);
                }
            }).catch((error) => {
                this.$Message.error('其他错误');
                window.console.log(error);
            });
        },
        remindSeller (id) { // 提醒卖家放币
            util.ajax.post(`api/v1/manage/otc/notify/release/${id}`).then((res) => {
                if (res.data && res.data.rst === 1) {
                    this.$Message.success(res.data.msg);
                } else if (res.data && res.data.rst !== 1){
                    this.$Message.error(res.data.msg);
                    window.console.log(res.data.msg);
                }
            }).catch((error) => {
                this.$Message.error('其他错误');
                window.console.log(error);
            });
        },
        remindBuyer (id) { // 提醒买家付款
            util.ajax.post(`api/v1/manage/otc/notify/paid/${id}`).then((res) => {
                if (res.data && res.data.rst === 1) {
                    this.$Message.success(res.data.msg);
                } else if (res.data && res.data.rst !== 1){
                    this.$Message.error(res.data.msg);
                    window.console.log(res.data.msg);
                }
            }).catch((error) => {
                this.$Message.error('其他错误');
                window.console.log(error);
            });
        }
    }
};
</script>

<style lang="less" scoped>

</style>