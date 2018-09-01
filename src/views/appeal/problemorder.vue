<template>
    <Modal v-model="show" title="问题订单" width="1200">
        <Row class="margin-top-10">
            <Table :columns="columns" :data="datas"></Table>
        </Row>
        <div slot="footer">
            <Button @click="show=false">关闭</Button>
        </div>
    </Modal>
</template>

<script>
import util from '@/libs/util';
import qs from 'qs';
export default {
    props: ['value', 'orderNumber'],
    data () {
        return {
            show: this.value,
            columns: [
                {title: '订单号', key: 'order_number'},
                {title: '卖家账号', key: 'user_name'},
                {title: '交易金额', key: 'symbol_count'},
                {title: '支付金额', key: 'currency_count'},
                {title: '交易状态', key: 'state', render: (h, params) => {
                    var state = params.row.state;
                    if (state === 1) {
                        state = params.row.pay_state === 1 ? '已付款' : '待付款';
                    } else if (state === 2) {
                        state = '已完成';
                    } else if (state === 3) {
                        state = '已取消';
                    }
                    return h('div', [state]);
                }},
                {title: '交易限时', key: 'verify_idcard'},
                {title: '操作', key: 'action', width: 300, render: (h, params) => {
                    var pay_state = params.row.state;
                    var id = params.row.id;
                    if (pay_state !== 1) {
                        return '';
                    }
                    if (params.row.pay_state === 0) {
                        return '';
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
    watch: {
        value (bool) {
            this.show = bool
        },
        show (bool) {
            this.$emit('input', bool)
        },
        orderNumber (orderNumber) {
            orderNumber && this.getDetail(orderNumber);
        }
    },
    methods: {
        getDetail (orderNumber) {
            util.ajax.post('api/v1/manage/otc/appeal/order', qs.stringify({
                order_number: orderNumber
            })).then((res) => {
                if (res.data && res.data.rst === 1) {
                    this.datas = [res.data.data];
                } else if (res.data && res.data.rst !== 1){
                    var msgs = res.data.msg;
                    this.$Message.error(typeof msgs === 'string' ? msgs : msgs[0]);
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
        forcePutCoins (id) { // 强行放币
            util.ajax.put(`api/v1/manage/otc/orders/${id}`).then((res) => {
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