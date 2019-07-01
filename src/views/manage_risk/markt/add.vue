<!-- 添加 -->
<template>
    <Card style="width:430px;">
        <p slot="title">
            {{vm.$t('risk.xzgz')}}
            <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
        </p>
        <Form ref="form" :model="form" :rules="ruleInline" :label-width="162" style="margin:0 20px;">
            <FormItem :label="vm.$t('exchange.jysc')" prop="marketName">
                <Select v-model="form.marketName">
                    <Option v-for="item in marketList" :value="item.market" :key="item.market">{{ item.market }}
                    </Option>
                </Select>
            </FormItem>
            <FormItem :label="vm.$t('risk.wjyjgfz')" prop="marketTimeDiff">
                <numberbox class="number_input" :accuracy="0" v-model="form.marketTimeDiff"/>
            </FormItem>
            <FormItem>
                <Button type="primary" style="width:100%;" @click="addVerify">{{vm.$t('finance.chuangj')}}</Button>
            </FormItem>
        </Form>
    </Card>
</template>

<script>
    import extendApi from '../../../api/extend';
    import Numberbox from '../../components/dialog/numberbox';
    import currenyApi from '../../../api/currency';

    export default {
        components: {Numberbox},
        data () {
            var vm = window.vm;
            return {
                vm: vm,
                form: {
                    marketName: null,
                    marketTimeDiff: null,
                },
                ruleInline: {
                    marketName: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('exchange.jysc'), trigger: 'blur'}
                    ],
                    marketTimeDiff: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('mall.yj')}
                    ],
                },
                marketList: []
            };
        },
        created () {
            this.getAllMarket();
        },
        methods: {
            getAllMarket () {
                currenyApi.findAllMarketList((res) => {
                    this.marketList = res;
                });
            },
            addVerify () {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        extendApi.addMarket(this.form, (res) => {
                            this.$Message.success({content: this.vm.$t('common.tjcg')});
                            this.$emit('okCallback');
                            this.$emit('removeDialog');
                        }, (msg) => {
                            this.$Message.error({content: msg});
                        });
                    }
                });
            },
            closeDialog () {
                this.$emit('removeDialog');
            }
        }
    };
</script>

<style lang="less">
    input.number_input {
        border: 1px solid #dcdcdc;
        border-radius: 4px;
        width: 195px;
        text-indent: 6px;
    }
</style>
