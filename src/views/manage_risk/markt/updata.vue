<template>
    <div>
        <Card style="width:600px;">
            <p slot="title">
                {{vm.$t('risk.xggz')}}
                <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
            </p>
            <Row style="border-bottom:1px solid #e9eaec;height:30px; line-height:30px;">
                <Col span="7">{{vm.$t('exchange.jysc')}}</Col>
                <Col span="10">{{this.item.marketName}}</Col>
                <Col span="6"></Col>
            </Row>
            <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:45px; line-height:40px;">
                <Col span="7">{{vm.$t('risk.wjyjgfz')}}</Col>
                <Col span="7">{{this.item.marketTimeDiff}}</Col>
                <Col span="7">
                    <numberbox v-model="marketTimeDiff" :accuracy="0"
                               style="width: 160px;border:1px solid #dddee1"></numberbox>
                </Col>
                <Col span="3">
                    <Button type="primary" @click="tabs('marketTimeDiff')">{{vm.$t('common.bc')}}</Button>
                </Col>
            </Row>
        </Card>
    </div>
</template>

<script>
    import Numberbox from '../../components/dialog/numberbox';
    import extendApi from '../../../api/extend';

    export default {
        components: {Numberbox},
        props: ['item'],
        data () {
            const vm = window.vm;
            return {
                vm: vm,
                marketTimeDiff: null,
            };
        },
        created () {
        },
        methods: {
            tabs (name) {
                let data = {
                    marketManageId: this.item.marketManageId,
                    marketName: this.item.marketName,
                };
                data[name] = this[name];
                extendApi.updataMarket(data, (res) => {
                    this.$Message.success({content: this.vm.$t('common.xgcg')});
                    this.item[name] = this[name];
                    this.closeDialog();
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
