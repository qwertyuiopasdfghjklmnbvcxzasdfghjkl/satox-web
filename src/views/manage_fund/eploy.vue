<template>
    <div class="eploy">
        <Card>
            <p slot="title">{{vm.$t('fund.tjpz')}}</p>
            <Form ref="formItem" :model="formLeft" :rules="ruleInline" label-position="left" :label-width="100">
                <Row style="height:40px;line-height:40px;margin-bottom: 20px;">
                    <Col span="24">
                        <FormItem prop="symbol" :label="vm.$t('common.bz')">
                            <Input v-model="formLeft.symbol" type="text" style="width:200px;"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row style="height:40px;line-height:40px;margin-bottom: 20px;">
                    <Col span="24">
                        <FormItem prop="coinMin" :label="vm.$t('system.zxje')">
                            <Input v-model="formLeft.coinMin" type="text" style="width:200px;"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row style="height:40px;line-height:40px;margin-bottom: 20px;">
                    <Col span="24">
                        <FormItem prop="coinReserve" :label="vm.$t('system.blje')">
                            <Input v-model="formLeft.coinReserve" style="width:200px;"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row style="height:40px;line-height:40px;margin-bottom: 20px;">
                    <Col span="24">
                        <FormItem prop="minerSymbol" :label="vm.$t('system.kgfbz')">
                            <Select v-model="formLeft.minerSymbol" style="width: 200px">
                                <Option v-for="item in symbolList" :value="item.symbol" :key="item.symbol">{{
                                    item.symbol }}
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row style="height:40px;line-height:40px;margin-bottom: 20px;">
                    <Col span="24">
                        <FormItem prop="minerFee" :label="vm.$t('system.btckgf')">
                            <Input v-model="formLeft.minerFee" style="width:200px;"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row style="height:40px;line-height:40px;margin-bottom: 20px;">
                    <Col span="24">
                        <FormItem prop="gasPrice" :label="vm.$t('system.ethdj')">
                            <Input v-model="formLeft.gasPrice" style="width:200px;"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row style="height:40px;line-height:40px;margin-bottom: 20px;">
                    <Col span="24">
                        <FormItem prop="gasLimit" :label="vm.$t('system.ethsx')">
                            <Input v-model="formLeft.gasLimit" style="width:200px;"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <FormItem :label="vm.$t('common.zllx')" prop="symbolType">
                    <Col span="24">
                        <RadioGroup ref="symbolType" v-model="formLeft.symbolType">
                            <Radio v-for="item in  symbolTypeList" :label="item.code">
                                <span>{{item.name}}</span>
                            </Radio>
                        </RadioGroup>
                    </Col>
                </FormItem>
                <Row style="height:40px;line-height:40px;margin-bottom: 40px;">
                    <Col span="24">
                        <FormItem prop="enable" :label="vm.$t('system.sfky')">
                            <RadioGroup v-model="formLeft.enable">
                                <Radio label="1">
                                    <span>{{vm.$t('common.s')}}</span>
                                </Radio>
                                <Radio label="2">
                                    <span>{{vm.$t('common.f')}}</span>
                                </Radio>
                            </RadioGroup>
                        </FormItem>
                    </Col>
                </Row>
                <Row style="height:40px;line-height:40px;">
                    <Col span="24">
                        <Button @click="addEploy">{{vm.$t('common.qd')}}</Button>
                        <Button @click="closeDialog">{{vm.$t('common.qx')}}</Button>
                    </Col>
                </Row>
            </Form>
        </Card>
    </div>
</template>
<script>
    import fundApi from '../../api/fund';
    import currenyApi from '../../api/currency';

    export default {
        data () {
            const vm = window.vm;
            return {
                vm: vm,
                formLeft: {
                    symbol: '',
                    coinMin: '',
                    coinReserve: '',
                    minerFee: '',
                    gasPrice: '',
                    gasLimit: '',
                    enable: '1',
                    symbolType: '1',
                    minerSymbol: ''
                },
                ruleInline: {
                    symbol: [
                        {required: true, message: vm.$t('common.qsr')+vm.$t('common.bz'), trigger: 'blur'}
                    ],
                    coinMin: [
                        {required: true, message: vm.$t('common.qsr')+vm.$t('system.zxje'), trigger: 'blur'}
                    ],
                    coinReserve: [
                        {required: true, message: vm.$t('common.qsr')+vm.$t('system.blje'), trigger: 'blur'}
                    ],
                    minerFee: [
                        {required: true, message: vm.$t('common.qsr')+vm.$t('system.btckgf'), trigger: 'blur'}
                    ],
                    gasPrice: [
                        {required: true, message: vm.$t('common.qsr')+vm.$t('system.ethdj'), trigger: 'blur'}
                    ],
                    gasLimit: [
                        {required: true, message: vm.$t('common.qsr')+vm.$t('system.ethsx'), trigger: 'blur'}
                    ],
                    minerSymbol: [
                        {required: true, message: vm.$t('common.qsr')+vm.$t('system.kgfbz'), trigger: 'blur'}
                    ],
                },
                symbolList: null,
                symbolTypeList: [],
            };
        },
        created () {
            this.getdataSymbol();
            this.symbolTypeList = JSON.parse(window.localStorage.symbolTypes);
        },
        methods: {
            getdataSymbol () {
                currenyApi.findAllValidSymbolList((res) => {
                    this.symbolList = res;
                });
            },
            closeDialog () {
                this.$emit('removeDialog');
            },
            addEploy () {
                this.$refs.formItem.validate((valid) => {
                    if (valid) {
                        fundApi.addConfig(this.formLeft, (res) => {
                            this.$Message.success({content: this.vm.$t('common.tjcg')});
                            this.$emit('removeDialog');
                            this.$emit('okCallback');
                        }, (msg) => {
                            this.$Message.error({content: msg});
                        });
                    }
                });
            }
        }
    };
</script>
<style scoped>
    .eploy {
        width: 400px;
    }

    .ivu-form-item-content {
        margin-left: 200px !important;
    }
</style>
