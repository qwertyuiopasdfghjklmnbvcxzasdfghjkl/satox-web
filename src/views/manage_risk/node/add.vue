<!-- 添加 -->
<template>
    <Card style="width:430px;">
        <p slot="title">
            {{vm.$t('risk.xzgz')}}
            <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
        </p>
        <Form ref="form" :model="form" :rules="ruleInline" :label-width="150" style="margin:0 20px;">
            <FormItem :label="vm.$t('monitoring.gllx')" prop="nodeChain">
                <Select  v-model="form.nodeChain">
                    <Option v-for="item in pLink" :value="item.name">{{item.name}}</Option>
                </Select>
            </FormItem>
            <FormItem :label="vm.$t('risk.syjdtbczfz')"  prop="nodeSyncDiff">
                <numberbox class="number_input" :accuracy="0" v-model="form.nodeSyncDiff"/>
            </FormItem>
            <FormItem :label="vm.$t('risk.qksmgdczfz')"  prop="nodeScanDiff">
                <numberbox class="number_input" :accuracy="0" v-model="form.nodeScanDiff"/>
            </FormItem>
            <FormItem>
                <Button type="primary" style="width:100%;" @click="addVerify">{{vm.$t('common.tj')}}</Button>
            </FormItem>
        </Form>
    </Card>
</template>

<script>
    import extendApi from '../../../api/extend';
    import Numberbox from '../../components/dialog/numberbox';

    export default {
        components: {Numberbox},
        data () {
            var vm = window.vm;
            return {
                vm: vm,
                form: {
                    nodeChain: null,
                    nodeSyncDiff: null,
                    nodeScanDiff: null,
                },
                ruleInline: {
                    nodeChain: [
                        {required: true, message: vm.$t('common.qsr')+vm.$t('mall.zkj'), trigger: 'blur'}
                    ],
                    nodeSyncDiff: [
                        {required: true, message: vm.$t('common.qsr')+vm.$t('mall.yj')}
                    ],
                    nodeScanDiff: [
                        {required: true, message: vm.$t('common.qsr')+vm.$t('mall.mc')}
                    ]
                },
                pLink: []
            };
        },
        created () {
            this.pLink = JSON.parse(window.localStorage.symbolTypes);
        },
        methods: {
            addVerify () {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        extendApi.addNode(this.form, (res) => {
                            this.$Message.success({content: this.vm.$t('common.tjcg')});
                            this.$emit('okCallback');
                            this.$emit('removeDialog');
                        }, (msg) => {
                            this.$Message.error({content: msg});
                        });
                    }
                });
            },
            closeDialog(){
                this.$emit('removeDialog');
            }
        }
    };
</script>

<style lang="less">
    input.number_input {
        border: 1px solid #dcdcdc;
        border-radius: 4px;
        width: 206px;
        text-indent: 6px;
    }
</style>
