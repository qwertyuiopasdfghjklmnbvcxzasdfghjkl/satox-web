<template>
    <Card style="width: 600px">
        <p slot="title">
            {{vm.$t('ieo.ztxg')}}
            <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
        </p>
        <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:45px; line-height:40px;">
            <Col span="4">{{vm.$t('common.zt')}}</Col>
            <Col span="6" style="white-space: nowrap">{{this.item.state | stateT}}</Col>
            <Col span="10">
                <Select v-model="state">
                    <Option :value="0">{{vm.$t('exchange.xs')}}</Option>
                    <Option :value="1">{{vm.$t('ieo.jjks')}}</Option>
                    <Option :value="2">{{vm.$t('ieo.jxz')}}</Option>
                    <Option :value="3">{{vm.$t('ieo.yjs')}}</Option>
                    <Option :value="4">{{vm.$t('ieo.fbwc')}}</Option>
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
                    let form = new FormData();
                    form.append('projectId', this.item.projectId)
                    form.append('state', this.state)
                    ieoApi.updataProject(form, res => {
                        this.$Message.success({content: res});
                        this.closeDialog();
                        this.$emit('okCallback');
                    }, msg => {
                        this.$Message.error({content: msg});
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
                let data = [window.vm.$t('exchange.xs'), window.vm.$t('ieo.jjks'),
                    window.vm.$t('ieo.jxz'), window.vm.$t('ieo.yjs'), window.vm.$t('ieo.fbwc')];
                return data[i];
            }
        }
    };
</script>

<style scoped>

</style>
