<template>
    <div class="exchange_address">
        <Card>
            <p slot="title">{{$t('exchange.dzcx')}}</p>
             <Row style="margin-bottom: 20px;">
                <Col span="2">{{$t('common.bz')}}</Col>
                <Col span="4">
                     <Input v-model="symbol" style="width:150px;"/>
                </Col>
                <Col span="1">{{$t('common.dz')}}</Col>
                <Col span="6">
                     <Input v-model="address" style="width:200px;"/>
                </Col>
                <Col span="3">
                     <Button type="primary" @click="getAddress">{{$t('common.cx')}}</Button>
                </Col>
            </Row>
            <Row style="margin-bottom: 20px;border-bottom: 1px solid #e9eaec;">
                <Col span="6">{{$t('common.zh')}}</Col>
                <Col span="6">{{$t('common.bz')}}</Col>
                <Col span="6">{{$t('common.dz')}}</Col>
            </Row>
            <Row style="margin-bottom: 20px;text-align: center;" v-if="this.data1 == ''">
                <Col span="24">{{$t('common.zwsj')}}</Col>
            </Row>
            <Row style="margin-bottom: 20px;" v-if="this.data1 != ''">
                <Col span="6">{{data1.username}}</Col>
                <Col span="6">{{data1.symbol}}</Col>
                <Col span="6">{{data1.address}}</Col>
            </Row>
        </Card>
    </div>
</template>
<script>
import currenyApi from '../../api/currency'
export default {
    data () {
        return {
            address: '',
            symbol: '',
            data1: []
        }
    },
    methods: {
        getAddress () {
            if (this.symbol) {
                if (this.address) {
                    currenyApi.findUserAccountByAddress({
                        symbol: this.symbol,
                        address: this.address
                    }, (res) => {
                        // if (res) {
                            this.data1 = res
                        // }
                    })
                } else {
                     this.$Message.error({content: this.$t('exchange.dzbnwk')})
                }
            } else {
                this.$Message.error({content: this.$t('exchange.bzbnwk')})
            }
        }
    }
}
</script>
<style>
.exchange_address{width: 1500px;}
</style>

