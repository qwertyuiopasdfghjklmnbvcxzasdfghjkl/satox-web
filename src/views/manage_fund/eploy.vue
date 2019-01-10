<template>
    <div class="eploy">
        <Card>
            <p slot="title">添加配置</p>
            <Form ref="formItem" :model="formLeft" :rules="ruleInline" label-position="left" :label-width="100">
                <Row style="height:40px;line-height:40px;margin-bottom: 20px;">
                    <Col span="24">
                        <FormItem prop="symbol" label="币种">
                            <Input v-model="formLeft.symbol" type="text" style="width:200px;"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row style="height:40px;line-height:40px;margin-bottom: 20px;">
                    <Col span="24">
                        <FormItem prop="coinMin" label="最小金额">
                            <Input v-model="formLeft.coinMin" type="text" style="width:200px;" ></Input>
                        </FormItem>
                     </Col>
                </Row>
                <Row style="height:40px;line-height:40px;margin-bottom: 20px;">
                    <Col span="24">
                        <FormItem prop="coinReserve" label="保留金额">
                            <Input v-model="formLeft.coinReserve" style="width:200px;" ></Input>
                        </FormItem>
                     </Col>
                </Row>
                <Row style="height:40px;line-height:40px;margin-bottom: 20px;">
                    <Col span="24">
                        <FormItem prop="minerFee" label="BTC矿工费">
                            <Input v-model="formLeft.minerFee" style="width:200px;" ></Input>
                        </FormItem>
                     </Col>
                </Row>
                <Row style="height:40px;line-height:40px;margin-bottom: 20px;">
                    <Col span="24">
                        <FormItem prop="gasPrice" label="ETH GAS单价">
                            <Input v-model="formLeft.gasPrice" style="width:200px;" ></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row style="height:40px;line-height:40px;margin-bottom: 20px;">
                    <Col span="24">
                        <FormItem prop="gasLimit" label="ETH GAS上限">
                            <Input v-model="formLeft.gasLimit" style="width:200px;" ></Input>
                        </FormItem>
                     </Col>
                </Row>
                <FormItem label="主链类型" prop="symbolType">
                    <Col span="24">
                        <RadioGroup ref="symbolType" v-model="formLeft.symbolType">
                            <Radio label="2">
                                <span>ETH</span>
                            </Radio>
                            <Radio label="1">
                                <span>BTC</span>
                            </Radio>
                            <Radio label="3">
                                <span>OMNI</span>
                            </Radio>
                            <Radio label="4">
                                <span>MBT</span>
                            </Radio>
                            <Radio label="5">
                                <span>EOS</span>
                            </Radio>
                        </RadioGroup>
                     </Col>
                </FormItem>
                <Row style="height:40px;line-height:40px;margin-bottom: 40px;">
                    <Col span="24">
                        <FormItem prop="enable" label="是否可用">
                            <RadioGroup v-model="formLeft.enable" >
                                    <Radio label="1">
                                        <span>是</span>
                                    </Radio>
                                    <Radio label="2">
                                        <span>否</span>
                                    </Radio>
                                </RadioGroup>
                        </FormItem>
                     </Col>
                </Row>
                <Row style="height:40px;line-height:40px;">
                    <Col span="24">
                        <Button @click="addEploy">确定</Button>
                        <Button @click="closeDialog">取消</Button>
                    </Col>
                </Row>
            </Form>
        </Card>
    </div>
</template>
<script>
import fundApi from '../../api/fund'
export default {
    data () {
        return{
            formLeft: {
                symbol: '',
                coinMin: '',
                coinReserve:'',
                minerFee: '',
                gasPrice: '',
                gasLimit: '',
                enable: '1',
                symbolType: '1'
            },
            ruleInline: {
                symbol: [
                    { required: true, message: '请输入币种', trigger: 'blur' }
                ],
                coinMin: [
                    { required: true, message: '请输入最小金额', trigger: 'blur' }
                ],
                coinReserve: [
                    { required: true, message: '请输入保留金额', trigger: 'blur' }
                ],
                minerFee: [
                    { required: true, message: '请输入BTC矿工费', trigger: 'blur' }
                ],
                gasPrice: [
                    { required: true, message: '请输入ETH GAS单价', trigger: 'blur' }
                ],
                gasLimit: [
                    { required: true, message: '请输入ETH GAS上限', trigger: 'blur' }
                ],
            }
        }
    },
    methods: {
        closeDialog () {
            this.$emit('removeDialog')
        },
        addEploy () {
            this.$refs.formItem.validate((valid) => {
                if (valid) {
                    fundApi.addConfig(this.formLeft, (res) => {
                        this.$Message.success({content: '添加成功'})
                        this.$emit('removeDialog')
                        this.$emit('okCallback')
                    }, (msg) => {
                        this.$Message.error({content: msg})                
                    })
                }
            })
        }
    }
}
</script>
<style scoped>
.eploy{width: 400px;}
.ivu-form-item-content{margin-left: 200px !important;}
</style>
