<template>
    <div>
        <Card style="width:600px;">
            <p slot="title">
                {{vm.$t('mall.ddsxxg')}}
                <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
            </p>
            <Row style="border-bottom:1px solid #e9eaec;height:30px; line-height:30px;">
                <Col span="5">{{vm.$t('mall.ddid')}}</Col>
                <Col span="10">{{this.item.address}}</Col>
                <Col span="6"></Col>
            </Row>
            <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:45px; line-height:40px;">
                <Col span="5">{{vm.$t('common.sjh')}}</Col>
                <Col span="8">{{this.item.phone}}</Col>
                <Col span="8">
                    <numberbox v-model="phone" style="width: 180px;border:1px solid #dddee1"></numberbox>
                </Col>
                <Col span="3">
                    <Button type="primary" @click="tabs('phone')">{{vm.$t('common.bc')}}</Button>
                </Col>
            </Row>
            <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:45px; line-height:40px;">
                <Col span="5">{{vm.$t('mall.yjdz')}}</Col>
                <Col span="8">{{this.item.address}}</Col>
                <Col span="8">
                    <Input v-model="address" style="width: 180px"></Input>
                </Col>
                <Col span="3">
                    <Button type="primary" @click="tabs('address')">{{vm.$t('common.bc')}}</Button>
                </Col>
            </Row>
            <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:45px; line-height:40px;">
                <Col span="5">{{vm.$t('common.zt')}}</Col>
                <Col span="8">{{this.item.address}}</Col>
                <Col span="8">
                    <Select v-model="state" style="width: 180px">
                        <Option :value="0">{{vm.$t('mall.yfkdcl')}}</Option>
                        <Option :value="1">{{vm.$t('mall.clz')}}</Option>
                        <Option :value="2">{{vm.$t('mall.yqs')}}</Option>
                    </Select>
                </Col>
                <Col span="3">
                    <Button type="primary" @click="tabs('address')">{{vm.$t('common.bc')}}</Button>
                </Col>
            </Row>
        </Card>
    </div>
</template>

<script>
    import Numberbox from '../components/dialog/numberbox';
    export default {
        components: {Numberbox},
        props: ['item'],
        data () {
            const vm = window.vm;
            return {
                vm: vm,
                nonce: null
            };
        },
        methods: {
            tabs () {
            },
            closeDialog () {
                this.$emit('removeDialog')
            }
        }
    };
</script>

<style scoped>

</style>
