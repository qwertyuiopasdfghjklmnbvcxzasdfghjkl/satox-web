<template>
    <div class="addColdWalletAddress">
        <Card>
            <p slot="title">{{vm.$t('fund.xzdz')}}</p>
             <Form ref="formItem" :model="formLeft" :rules="ruleInline" label-position="left" :label-width="100">
                <Row>
                    <Col span="6">{{vm.$t('common.bz')}}
                    </Col>
                    <Col span="12">
                     {{this.symbol}}
                        <!-- <FormItem label="币种" prop="symbol">
                            <Input v-model="formLeft.symbol" name="symbol"></Input>
                        </FormItem> -->
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
                    <Col span="24">
                     <FormItem :label="vm.$t('fund.sfqy')" prop="enable">
                        <RadioGroup v-model="formLeft.enable" >
                            <Radio label="1">
                                <span>{{vm.$t('common.s')}}</span>
                            </Radio>
                            <Radio label="0">
                                <span>{{vm.$t('common.f')}}</span>
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                     <FormItem :label="vm.$t('fund.sfswmr')" prop="defaultFlag">
                        <RadioGroup v-model="formLeft.defaultFlag" >
                            <Radio label="1">
                                <span>{{vm.$t('common.s')}}</span>
                            </Radio>
                            <Radio label="0">
                                <span>{{vm.$t('common.f')}}</span>
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
import fundApi from '../../api/fund'
export default {
    props: ['symbol', 'symbolType'],
    data () {
        const vm = window.vm;
        return {
            vm: vm,
            formLeft: {
                symbol: this.symbol,
                address: '',
                defaultFlag: '1',
                enable: '1',
                symbolType: this.symbolType
            },
            ruleInline: {
                address: [
                    { required: true, message: vm.$t('fund.qsrdz'), trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        closeDialog () {
            this.$emit('removeDialog')
        },
        addColdWallet () {
            fundApi.addColdWalletAddress(this.formLeft,(res) => {
                this.$Message.success({content: this.vm.$t('common.tjcg')})
                this.$emit('okCallback')
                this.$emit('removeDialog')
            }, (msg) => {
                 this.$Message.error({content: msg})
            })
        }
    }
}
</script>
<style>
.addColdWalletAddress{width: 400px;padding: 10px;background: #fff;}
</style>


