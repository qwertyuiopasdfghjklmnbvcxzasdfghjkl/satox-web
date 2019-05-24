<template>
    <div class="addWallet">
        <Card>
            <p slot="title">{{vm.$t('fund.tjxdz')}}</p>
            <Form ref="formItem" :model="formLeft" :rules="ruleInline" label-position="left" :label-width="100">
                <Row>
                    <Col span="24">
                        <FormItem :label="vm.$t('common.bz')" prop="symbol">
                            <Input v-model="formLeft.symbol" name="symbol"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                        <FormItem :label="vm.$t('common.dz')" prop="address">
                            <Input v-model="formLeft.address" name="address"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormItem :label="vm.$t('common.zllx')" prop="symbolType">
                            <RadioGroup ref="symbolType" v-model="formLeft.symbolType">
                                <Radio v-for="item in  symbolTypeList" :label="item.code">
                                    <span>{{item.name}}</span>
                                </Radio>
                            </RadioGroup>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <Button type="primary" @click="closeDialog">{{vm.$t('common.qx')}}</Button>
                    </Col>
                    <Col span="12">
                        <Button type="primary" @click="addColdWallet('formLeft')">{{vm.$t('common.qd')}}</Button>
                    </Col>
                </Row>
            </Form>
        </Card>
    </div>
</template>
<script>
    import fundApi from '../../api/fund';

    export default {
        data () {
            const vm = window.vm;
            return {
                vm: vm,
                symbolTypeList: [],
                formLeft: {
                    symbol: '',
                    address: '',
                    symbolType: '1'
                },
                ruleInline: {
                    symbol: [
                        {required: true, message: vm.$t('fund.qsrbz'), trigger: 'blur'}
                    ],
                    address: [
                        {required: true, message: vm.$t('fund.qsrdz'), trigger: 'blur'}
                    ]
                }
            };
        },
        created () {
            this.symbolTypeList = JSON.parse(window.localStorage.symbolTypes);
        },
        methods: {
            closeDialog () {
                this.$emit('removeDialog');
            },
            addColdWallet (name) {
                if (this.formLeft.symbol) {
                    if (this.formLeft.address) {
                        fundApi.addColdWallet(this.formLeft, (res) => {
                            this.$Message.success({content: this.vm.$t('common.tjcg')});
                            this.$emit('okCallback');
                            this.$emit('removeDialog');
                        }, (msg) => {
                            this.$Message.error({content: msg});
                        });
                    } else {
                        this.$Message.error({content: this.vm.$t('fund.qsrdz')});
                    }
                } else {
                    this.$Message.error({content: this.vm.$t('fund.qsrbz')});
                }
            }
        }
    };
</script>

<style>
    .addWallet {
    }
</style>

