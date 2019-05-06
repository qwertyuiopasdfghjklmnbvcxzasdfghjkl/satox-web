<template>
    <div class="updataWaletAddress">
        <Card>
            <p slot="title">{{vm.$t('fund.xgdz')}}</p>
            <Row style="margin-bottom: 20px;">
                <Col span="5">
                    {{vm.$t('common.dz')}}
                </Col>
                <Col span="10">
                    <Input v-model="address" ></Input>
                </Col>
            </Row>
            <Row>
                <Col span="24">
                    <Button @click="updateAddress">{{vm.$t('common.qd')}}</Button>
                    <Button @click="closeDialog">{{vm.$t('common.qx')}}</Button>
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
        const vm = window.vm;
        return {
            vm: vm,
            address: this.item.address
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
                    this.$Message.success({content: this.vm.$t('common.xgcg')})
                    this.$emit('removeDialog')
                    this.$emit('okCallback')
                })
            } else {
                this.$Message.error({content: this.vm.$t('fund.qtxdz')})
            }

        }
    }
}
</script>
<style>
.updataWaletAddress{width: 500px;background: #fff;padding: 20px;}
</style>
