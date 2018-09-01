<template>
    <div class="addWallet">
        <Card>
            <p slot="title">修改</p>
            <Form ref="formItem" :model="formLeft" :rules="ruleInline" label-position="left" :label-width="100">
                <Row>
                    <Col span="24">
                        <FormItem label="触发数量" prop="symbol">
                            <Input v-model="formLeft.symbol" name="symbol"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                        <FormItem label="剩余数量" prop="address">
                            <Input v-model="formLeft.address" name="address"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                         <Button type="primary" @click="closeDialog">取消</Button>
                    </Col>
                    <Col span="12">
                         <Button type="primary" >确定</Button>
                    </Col>
                </Row>
            </Form>
        </Card>
    </div>
</template>
<script>
export default {
    data () {
        return {
            formLeft: {
                symbol: '',
                address: ''
            },
            ruleInline: {
                symbol: [
                    { required: true, message: '请输入币种', trigger: 'blur' }
                ],
                address: [
                    { required: true, message: '请输入地址', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        closeDialog () {
            this.$emit('removeDialog')
        }
    }
}
</script>

<style>
.addWallet{}
</style>

