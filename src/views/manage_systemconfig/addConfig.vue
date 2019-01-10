<template>
    <div class="addConfig">
        <Card>
            <p slot="title">添加</p>
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" style="margin:0 20px;">
                <FormItem label="币种" prop="symbol">
                    <Input type="text" v-model="formValidate.symbol"></Input>
                </FormItem>
                <FormItem label="最小金额" prop="coinMin">
                    <Input type="text" v-model="formValidate.coinMin"></Input>
                </FormItem>
                <FormItem label="保留金额" prop="coinReserve">
                    <Input type="text" v-model="formValidate.coinReserve"></Input>
                </FormItem>
                <FormItem label="旷工费" prop="minerFee" v-if="formValidate.symbolType !== '2'">
                    <Input type="text" v-model="formValidate.minerFee" style="width:100%;"></Input>
                </FormItem>
                <FormItem label="GASPrice" prop="gasPrice" v-if="formValidate.symbolType === '2'">
                    <InputNumber style="width:100%;" :min="0.1" name="gasPrice" v-model="formValidate.gasPrice"></InputNumber>
                </FormItem>
                <FormItem label="GASNumber" prop="gasLimit" v-if="formValidate.symbolType === '2'">
                    <InputNumber style="width:100%;" :min="0.1" name="gasLimit" v-model="formValidate.gasLimit"></InputNumber>
                </FormItem>
                <FormItem label="是否可用" prop="enable">
                    <RadioGroup ref="enable" v-model="formValidate.enable">
                        <Radio label="1">
                            <span>是</span>
                        </Radio>
                        <Radio label="2">
                            <span>否</span>
                        </Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="主链类型" prop="symbolType">
                    <RadioGroup ref="symbolType" v-model="formValidate.symbolType">
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
                </FormItem>
                <FormItem style="line-height:0;text-align:center;">
                    <Button type="ghost" style="width:100px;margin-right:50px;" @click="closeDialog">取消</Button>
                    <Button type="primary" style="width:100px;" @click="saveConfig">确定</Button>
                </FormItem>
            </Form>
        </Card>
    </div>
</template>
<script>
import system from '../../api/systemparam'
export default {
    data () {
        const customValidator = (rule, value, callback) => {
            if (this.formValidate[rule.field] === null) {
            return callback(new Error('error'))
            } else {
            return callback()
            }
        }
        return {
            formValidate: {
                symbol: '',
                coinMin:null,
                coinReserve: null,
                minerFee:null,
                gasPrice:null,
                gasLimit:null,
                enable: '1',
                symbolType: '1'
            },
            ruleValidate: {
                symbol: [
                    { required: true, message: '请输入英文简称', trigger: 'blur' }
                ],
                coinMin: [
                    { required: true, message: '请输入最小金额', trigger: 'blur' }
                ],
                coinReserve: [
                    { required: true, message: '请输入保留金额', trigger: 'blur' }
                ],
                minerFee: [
                    { required: true, message: '请输入矿工费', trigger: 'blur' }
                ],
                gasPrice: [
                    { required: true, message: '请输入gasPrice'},
                    { validator: customValidator, message: '请输入gasprice', trigger: 'blur' }
                ],
                gasLimit: [
                    { required: true, message: '请输入gasLimit'},
                    { validator: customValidator, message: '请输入gasLimit', trigger: 'blur' },
                ],
            }
        }
    },
    methods: {
        closeDialog () {
            this.$emit('removeDialog')
        },
        saveConfig () {
            let form = this.$refs.formValidate;
            form.validate((valid) => {
                if (valid) {
                    if (this.formValidate.coinReserve > this.formValidate.coinMin) {
                        this.$Message.error({content: '保留金额要少于等于最小金额'})
                        return
                    }
                    if (this.formValidate.coinReserve < this.formValidate.minerFee) {
                        this.$Message.error({content: '保留金额大于等于矿工费'})
                        return
                    }
                    system.addConfig ({
                        symbol: this.formValidate.symbol,
                        coinMin: this.formValidate.coinMin,
                        coinReserve: this.formValidate.coinReserve,
                        minerFee: this.formValidate.minerFee,
                        gasPrice: this.formValidate.gasPrice,
                        gasLimit: this.formValidate.gasLimit,
                        enable: this.formValidate.enable,
                        symbolType: this.formValidate.symbolType
                    }, (res) => {
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
<style>
.addConfig{width: 600px;padding: 20px;background: #fff;}
.ivu-form-item-error .ivu-input{width: 100% !important;}
</style>
