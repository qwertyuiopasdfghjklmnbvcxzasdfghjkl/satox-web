<template>
    <Card style="width: 600px">
        <p slot="title">
            {{vm.$t('ieo.ztxg')}}
            <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
        </p>
        <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:45px; line-height:40px;">
            <Col span="4">{{vm.$t('common.yhm')}}</Col>
            <Col span="6" style="white-space: nowrap">{{this.item.username }}</Col>
        </Row>
        <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:45px; line-height:40px;">
            <Col span="4">{{vm.$t('ieo.xmmc')}}</Col>
            <Col span="6" style="white-space: nowrap">{{this.item.projectName }}</Col>
        </Row>
        <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:45px; line-height:40px;">
            <Col span="4">{{vm.$t('common.zt')}}</Col>
            <Col span="6" style="white-space: nowrap">{{this.item.state | stateT}}</Col>
            <Col span="10">
                <Select v-model="state">
                    <Option :value="1">{{vm.$t('ieo.yqr')}}</Option>
                    <Option :value="2">{{vm.$t('ieo.kkbcg')}}</Option>
                    <Option :value="3">{{vm.$t('ieo.kkcg')}}</Option>
                    <Option :value="4">{{vm.$t('ieo.ffbcg')}}</Option>
                    <Option :value="5">{{vm.$t('ieo.ffcg')}}</Option>
                    <Option :value="6">{{vm.$t('ieo.rgsb')}}</Option>
                    <Option :value="7">{{vm.$t('ieo.rgcg')}}</Option>
                </Select>
            </Col>
            <Col span="3">
                <Button type="primary" @click="tabs()">{{vm.$t('common.bc')}}</Button>
            </Col>
        </Row>
    </Card>
</template>

<script>
    import ieoApi from '../../../api/ieo';

    export default {
        props: ['item'],
        data () {
            const vm = window.vm;
            return {
                vm: vm,
                state: null
            };
        },
        created () {
            // this.state = this.item.state;
        },
        methods: {
            tabs () {
                if (this.state) {
                    let data = {
                        projectId: this.item.projectId,
                        state: this.state,
                        subscriptionId: this.item.subscriptionId
                    }
                    ieoApi.updateSubscription(data, res => {
                        this.$Message.success({content: this.vm.$t('common.xgcg')});
                        this.$emit('okCallback');
                        this.$emit('removeDialog');
                    });
                } else {
                    this.$Message.error({content: this.vm.$t('common.bnwk')});
                }
            },
            closeDialog () {
                this.$emit('removeDialog');
            },
        },
        filters: {
            stateT (i) {
                let data = [window.vm.$t('ieo.yqr'), window.vm.$t('ieo.kkbcg'),
                    window.vm.$t('ieo.kkcg'), window.vm.$t('ieo.ffbcg'), window.vm.$t('ieo.ffcg'),
                    window.vm.$t('ieo.sb'), window.vm.$t('ieo.cg')];
                return data[i - 1];
            }
        }
    };
</script>

<style scoped>

</style>
