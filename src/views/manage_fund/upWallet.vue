<template>
    <div class="addWallet">
        <Card>
            <p slot="title">修改</p>
            <Form  label-position="left" :label-width="100">
                <Row>
                    <Col span="24">
                        <FormItem label="币种" prop="symbol">
                            <Input v-model="symbol" name="symbol"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                        <FormItem label="地址" prop="address">
                            <Input v-model="address" name="address"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                         <Button type="primary" @click="closeDialog">取消</Button>
                    </Col>
                    <Col span="12">
                         <Button type="primary" @click="upColdwallt">确定</Button>
                    </Col>
                </Row>
            </Form>
        </Card>
    </div>
</template>
<script>
import fundApi from '../../api/fund'
export default {
    props: ['walletId', 'version', 'address', 'symbol'],
    data () {
        return {
            formData: {
                walletId: '',
                version: '',
                address: '',
                symbol: ''
            }
        }
    },
    methods: {
        closeDialog () {
            this.$emit('removeDialog')
        },
        upColdwallt () {
            // fundApi.updateColdWallet({
            //     walletId: this.walletId,
            //     symbol: this.symbol,
            //     address: this.address,
            //     version: this.version
            // }, (res) => {
            //     this.$Message.success({content: '修改成功'})
            // })
        }
    }
}
</script>

<style>
.addWallet{}
</style>

