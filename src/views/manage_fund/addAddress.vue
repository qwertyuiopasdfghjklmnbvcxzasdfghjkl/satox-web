<template>
    <div class="addColdWalletAddress">
        <Card>
            <p slot="title">新增地址</p>
             <Form ref="formItem" :model="formLeft" :rules="ruleInline" label-position="left" :label-width="100">
                <Row>
                    <Col span="6">币种
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
                        <FormItem label="地址" prop="address">
                            <Input v-model="formLeft.address" name="address"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                     <FormItem label="是否启用" prop="enable">
                        <RadioGroup v-model="formLeft.enable" >
                            <Radio label="1">
                                <span>是</span>
                            </Radio>
                            <Radio label="0">
                                <span>否</span>
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                     <FormItem label="是否设为默认" prop="defaultFlag">
                        <RadioGroup v-model="formLeft.defaultFlag" >
                            <Radio label="1">
                                <span>是</span>
                            </Radio>
                            <Radio label="0">
                                <span>否</span>
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                         <Button type="primary" @click="closeDialog">取消</Button>
                    </Col>
                    <Col span="12">
                         <Button type="primary" @click="addColdWallet('formLeft')">确定</Button>
                    </Col>
                </Row>
            </Form>
        </Card>
    </div>
</template>
<script>
import fundApi from '../../api/fund'
export default {
    props: ['symbol'],
    data () {
        return {
            formLeft: {
                symbol: this.symbol,
                address: '',
                defaultFlag: '1',
                enable: '1'
            },
            ruleInline: {
                address: [
                    { required: true, message: '请输入地址', trigger: 'blur' }
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
                this.$Message.success({content: '添加成功'})
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


