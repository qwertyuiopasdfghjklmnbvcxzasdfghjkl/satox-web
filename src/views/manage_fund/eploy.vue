<template>
    <div class="eploy">
        <Card>
            <p slot="title">添加配置</p>
             <Form ref="formItem" :model="formLeft" :rules="ruleInline" label-position="left" :label-width="100">
            <Row style="height:40px;line-height:40px;margin-bottom: 20px;">
                <FormItem prop="symbol" label="币种">
                    <Input v-model="formLeft.symbol" type="text" style="width:200px;"></Input>
                </FormItem>
            </Row>
            <Row style="height:40px;line-height:40px;margin-bottom: 20px;">
                <FormItem prop="coinMin" label="最小金额">
                    <Input v-model="formLeft.coinMin" type="text" style="width:200px;" ></Input>
                </FormItem>
            </Row>
            <Row style="height:40px;line-height:40px;margin-bottom: 20px;">
                <FormItem prop="coinReserve" label="保留金额币种">
                    <Input v-model="formLeft.coinReserve" style="width:200px;" ></Input>
                </FormItem>
            </Row>
            <Row style="height:40px;line-height:40px;margin-bottom: 20px;">
                <FormItem prop="minerFee" label="BTC矿工费">
                    <Input v-model="formLeft.minerFee" style="width:200px;" ></Input>
                </FormItem>
            </Row>
            <Row style="height:40px;line-height:40px;margin-bottom: 20px;">
                <FormItem prop="gasPrice" label="ETH GAS单价">
                    <Input v-model="formLeft.gasPrice" style="width:200px;" ></Input>
                </FormItem>
            </Row>
            <Row style="height:40px;line-height:40px;margin-bottom: 20px;">
                <FormItem prop="gasLimit" label="ETH GAS上限">
                    <Input v-model="formLeft.gasLimit" style="width:200px;" ></Input>
                </FormItem>
            </Row>
            <Row style="height:40px;line-height:40px;margin-bottom: 20px;">
                <FormItem prop="gasPrice" label="是否可用">
                     <RadioGroup v-model="formLeft.enable" >
                            <Radio label="1">
                                <span>是</span>
                            </Radio>
                            <Radio label="2">
                                <span>否</span>
                            </Radio>
                        </RadioGroup>
                </FormItem>
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
                enable: '1'
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
                    fundApi.addConfig({
                        symbol: this.symbol,
                        coinMin: this.coinMin,
                        coinReserve:this.coinReserve,
                        minerFee:this.minerFee,
                        gasPrice: this.gasPrice,
                        gasLimit: this.gasLimit,
                        enable: this.enable
                    }, (res) => {
                        this.$Message.success({content: '添加成功'})
                    }, (msg) => {
                        this.$Message.error({content: msg})                
                    })
                }
            })
        }
    }
}
</script>
<style>
.eploy{width: 500px;}
</style>
