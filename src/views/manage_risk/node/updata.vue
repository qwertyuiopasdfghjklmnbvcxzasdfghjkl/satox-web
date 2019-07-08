<template>
    <div>
        <Card style="width:600px;">
            <p slot="title">
                {{vm.$t('risk.xggz')}}
                <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
            </p>
            <Row style="border-bottom:1px solid #e9eaec;height:30px; line-height:30px;">
                <Col span="7">{{vm.$t('monitoring.gllx')}}</Col>
                <Col span="10">{{this.item.nodeChain }}</Col>
                <Col span="6"></Col>
            </Row>
            <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:45px; line-height:40px;">
                <Col span="7">{{vm.$t('risk.syjdtbczfz')}}</Col>
                <Col span="7">{{this.item.nodeSyncDiff}}</Col>
                <Col span="7">
                    <numberbox v-model="nodeSyncDiff" :accuracy="0" style="width: 160px;border:1px solid #dddee1"></numberbox>
                </Col>
                <Col span="3">
                    <Button type="primary" @click="tabs('nodeSyncDiff')">{{vm.$t('common.bc')}}</Button>
                </Col>
            </Row>
            <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:45px; line-height:40px;">
                <Col span="7">{{vm.$t('risk.qksmgdczfz')}}</Col>
                <Col span="7">{{this.item.nodeScanDiff}}</Col>
                <Col span="7">
                    <numberbox :accuracy="0" v-model="nodeScanDiff" style="width: 160px;border:1px solid #dddee1"/>
                </Col>
                <Col span="3">
                    <Button type="primary" @click="tabs('nodeScanDiff')">{{vm.$t('common.bc')}}</Button>
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
                nodeSyncDiff: null,
                nodeScanDiff: null,
            };
        },
        created () {
        },
        methods: {
            tabs (name) {
                let data = {
                    nodeChain: this.item.nodeChain
                };
                data[name] = this[name];
                extendApi.updateNode(data, (res) => {
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
