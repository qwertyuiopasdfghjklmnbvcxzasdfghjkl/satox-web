<template>
    <Card class="market_setting" style="width:500px;">
        <p slot="title">
            {{vm.$t('finance.xn')}}{{type === 1 ? vm.$t('finance.tx'):vm.$t('finance.cz')}}
            <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
        </p>
        <Row>
            <Col span="8">{{vm.$t('common.qblx')}}</Col>
            <Col span="8">{{item.type | myCurrency}}</Col>
            <Col span="8"></Col>
        </Row>
        <Row>
            <Col span="8">{{vm.$t('common.bz')}}</Col>
            <Col span="8">{{item.symbol}}</Col>
            <Col span="8"></Col>
        </Row>
        <Row>
            <Col span="8">{{vm.$t('common.zje')}}</Col>
            <Col span="8">{{item.totalBalance}}</Col>
            <Col span="8"></Col>
        </Row>
        <Row>
            <Col span="8">{{vm.$t('common.kyye')}}</Col>
            <Col span="8">{{item.availableBalance }}</Col>
            <Col span="8"></Col>
        </Row>
        <Row>
            <Col span="8">{{vm.$t('common.djje')}}</Col>
            <Col span="8">{{item.loanBalance}}</Col>
            <Col span="8"></Col>
        </Row>
        <Row>
            <Col span="8">{{vm.$t('finance.bcxnje')}}</Col>
            <Col span="8">{{item.virtualBalance}}</Col>
            <Col span="8"></Col>
        </Row>
        <Row>
            <Col span="8">{{type === 0 ? vm.$t('finance.cz'): vm.$t('finance.tx')}}{{vm.$t('common.sl')}}</Col>
            <Col span="8">
                <!--<InputNumber style="width:113px;" :min="0" v-model="coinPoolsDTO"></InputNumber>-->
                <input class="number_input" type="number" @input="oninput" :placeholder="vm.$t('finance.qsrdy0ds')"/>
            </Col>
            <Col span="8" style="text-align:right;">
                <Button type="primary" @click="tabs('virtualBalance')">{{vm.$t('common.bc')}}</Button>
            </Col>
        </Row>
    </Card>
</template>

<script>
    import financeApi from '../../api/finance';

    export default {
        props: ['item', 'type'],
        data () {
            var vm = window.vm;
            return {
                vm: vm,
                virtualBalance: null
            };
        },
        created () {
            console.log(this.vm);
        },
        methods: {
            closeDialog () {
                this.$emit('removeDialog');
            },
            scientificToNumber (num) {
                var str = num.toString();
                var reg = /^(\d+)(e)([\-]?\d+)$/;
                var arr, len,
                    zero = '';
                if (!reg.test(str)) {
                    return num;
                } else {
                    arr = reg.exec(str);
                    len = Math.abs(arr[3]) - 1;
                    for (var i = 0; i < len; i++) {
                        zero += '0';
                    }
                    return '0.' + zero + arr[1];
                }
            },
            tabs (propName) {
                if (!this[propName] && (!this[propName] !== 0)) {
                    this.$Message.error({content: this.vm.$t('finance.qsryxz')});
                    return;
                }
                let data = {
                    'coinPoolId': this.item.coinPoolId,
                    virtualBalance: this.scientificToNumber(this.virtualBalance)
                }
                this.$Message.info({content: this.type === 0 ? this.vm.$t('finance.czzqsh'): this.vm.$t('finance.txzqsh')});
                if (this.type === 0) {
                    financeApi.findRecharge(data, (res) => {
                        this.$emit('okCallback');
                        this.$Message.success({content: this.vm.$t('finance.czcg')});
                        this.$emit('removeDialog');
                    }, (msg) => {
                        this.$Message.error({content: msg});
                    });
                } else {
                    financeApi.findWithdraw(data, (res) => {
                        this.$emit('okCallback');
                        this.$Message.destroy()
                        this.$Message.success({content: this.vm.$t('finance.txcg')});
                        this.$emit('removeDialog');
                    }, (msg) => {
                        this.$Message.error({content: msg});
                    });
                }
            },
            oninput (e) {
                // 通过正则过滤小数点后8位
                e.target.value = (e.target.value.match(/^\d*(\.?\d{0,8})/g)[0]) || null;
                this.virtualBalance = Number(e.target.value);
            }
        },
        filters: {
            myCurrency: function (myInput) {
                let result = {
                    1: vm.$t('common.zqb'),
                    2: vm.$t('common.fzqb')
                };
                return result[myInput];
            }
        }
    };
</script>
<style lang="less" scoped>
    .market_setting {
        background: #fff;
        padding: 8px;

        .title {
            font-size: 14px;
            font-weight: bold;
            color: #000;
        }

        .ivu-table-cell input {
            width: 50px;
        }

        .ivu-table-cell > div {
            display: flex;
        }

        .ivu-btn-primary {
            margin-left: 12px;
        }

        .ivu-row {
            padding: 10px 0;
        }

        .number_input {
            border: 1px solid #dcdcdc;
            border-radius: 4px;
            width: 180px;
            text-indent: 6px;
            padding: 4px;
        }
    }
</style>
