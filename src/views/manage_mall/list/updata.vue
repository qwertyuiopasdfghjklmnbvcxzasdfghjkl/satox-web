<template>
    <div>
        <Card style="width:600px;">
            <p slot="title">
                {{vm.$t('mall.ddsxxg')}}
                <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
            </p>
            <Row style="border-bottom:1px solid #e9eaec;height:30px; line-height:30px;">
                <Col span="5">{{vm.$t('mall.ddid')}}</Col>
                <Col span="10">{{this.item.orderId}}</Col>
                <Col span="6"></Col>
            </Row>
            <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:45px; line-height:40px;">
                <Col span="5">{{vm.$t('common.sjh')}}</Col>
                <Col span="8">{{this.item.receiverPhone}}</Col>
                <Col span="8">
                    <numberbox v-model="receiverPhone" style="width: 180px;border:1px solid #dddee1"></numberbox>
                </Col>
                <Col span="3">
                    <Button type="primary" @click="tabs('receiverPhone')">{{vm.$t('common.bc')}}</Button>
                </Col>
            </Row>
            <Row style="margin-top：10px;border-bottom:1px solid #e9eaec; line-height:24px;display: flex;align-items: center;padding: 4px 0;">
                <Col span="5">{{vm.$t('mall.yjdz')}}</Col>
                <Col span="8">{{this.item.receiverAddress}}</Col>
                <Col span="8">
                    <Input v-model="receiverAddress" style="width: 180px"></Input>
                </Col>
                <Col span="3">
                    <Button type="primary" @click="tabs('receiverAddress')">{{vm.$t('common.bc')}}</Button>
                </Col>
            </Row>
            <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:45px; line-height:40px;">
                <Col span="5">{{vm.$t('common.zt')}}</Col>
                <!--<Col span="8">{{this.item.state}}</Col>-->
                <Col span="8">
                    <Select v-model="state" style="width: 180px">
                        <Option :value="0">{{vm.$t('mall.dzf')}}</Option>
                        <Option :value="1">{{vm.$t('mall.dqr')}}</Option>
                        <Option :value="2">{{vm.$t('mall.yfkdcl')}}</Option>
                        <Option :value="3">{{vm.$t('mall.yfh')}}</Option>
                        <Option :value="4">{{vm.$t('mall.yys')}}</Option>
                        <Option :value="5">{{vm.$t('mall.yth')}}</Option>
                    </Select>
                </Col>
                <Col span="3">
                    <Button type="primary" @click="tabs('state')">{{vm.$t('common.bc')}}</Button>
                </Col>
            </Row>
        </Card>
    </div>
</template>

<script>
    import Numberbox from '../../components/dialog/numberbox';
    import mallApi from '../../../api/mall';

    export default {
        components: {Numberbox},
        props: ['item'],
        data () {
            const vm = window.vm;
            return {
                vm: vm,
                receiverPhone: null,
                receiverAddress: null,
                state: null
            };
        },
        created () {
            this.state = this.item.state;
        },
        methods: {
            tabs (name) {
                let data = {
                    orderId: this.item.orderId
                };
                data[name] = this[name];
                mallApi.updataOrder(data, (res) => {
                    this.$Message.success({content: this.vm.$t('common.xgcg')});
                    this.item[name] = this[name]
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            },
            closeDialog () {
                this.$emit('removeDialog');
                this.$emit('okCallback');
            }
        }
    };
</script>

<style scoped>

</style>
