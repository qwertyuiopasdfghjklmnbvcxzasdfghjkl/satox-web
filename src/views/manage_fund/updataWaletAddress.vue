<template>
    <div class="updataWaletAddress">
        <Card>
            <p slot="title">修改地址</p>
            <Row>
                <Col span="2">
                    地址
                </Col>
                <Col span="12">
                    {{this.item.address}}
                </Col>
                <Col span="10">
                    <Input v-model="address" ></Input>
                </Col>
            </Row>
            <Row>
                <Col span="24">
                    <Button @click="updateAddress">确定修改</Button>
                    <Button @click="closeDialog">取消</Button>
                </Col>
            </Row>
        </Card>
    </div>
</template>
<script>
import fundApi from '../../api/fund'
export default {
    props: ['item'],
    data () {
        return {
            address: ''
        }
    },
    methods: {
        closeDialog () {
            this.$emit('removeDialog')
        },
        updateAddress () {
            if (this.address !== '') {
                 fundApi.updateWalletAddress({                 
                    walletId: this.item.walletId,
                    address: this.address,
                    version: this.item.version
                }, (res) =>{
                    this.$Message.success({content: '修改成功'})
                    this.$emit('removeDialog')
                    this.$emit('okCallback')
                })
            } else {
                this.$Message.error({content: '请填写地址'})
            }
            
        }
    }
}
</script>
<style>
.updataWaletAddress{width: 800px;background: #fff;padding: 20px;}
</style>

