<template>
    <div class="exchange_address">
        <Card>
            <p slot="title">地址查询</p>
             <Row style="margin-bottom: 20px;">
                <Col span="2">币种</Col>
                <Col span="4">
                     <Input v-model="symbol" style="width:150px;"/>
                </Col>
                <Col span="1">地址</Col>
                <Col span="6">
                     <Input v-model="address" style="width:200px;"/>
                </Col>
                <Col span="3">
                     <Button type="primary" @click="getAddress">查询</Button>
                </Col>
            </Row>
            <Row style="margin-bottom: 20px;">
                <Col span="6">账号</Col>
                <Col span="6">币种</Col>
                <Col span="6">地址</Col>
            </Row>
            <!-- <Row style="margin-bottom: 20px;" v-if="this.data1 === null">
                <Col span="24">暂无数据{{this.data1 === null}}</Col>
            </Row> -->
            <Row style="margin-bottom: 20px;">
                <Col span="6">{{this.data1.username}}</Col>
                <Col span="6">{{this.data1.symbol}}</Col>
                <Col span="6">{{this.data1.address}}</Col>
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
                        if (res) {
                            this.data1 = res
                        }
                    })
                } else {
                     this.$Message.error({content: '地址不能为空'})
                }
            } else {
                this.$Message.error({content: '币种不能为空'})
            }
        }
    }
}
</script>
<style>
.exchange_address{width: 1500px;}
</style>

