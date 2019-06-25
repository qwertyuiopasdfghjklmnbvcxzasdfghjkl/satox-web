<!-- 添加 -->
<template>
    <Card style="width:430px;">
        <p slot="title">
            {{vm.$t('risk.xzgz')}}
            <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
        </p>
        <Form ref="form" :model="form" :rules="ruleInline" :label-width="150" style="margin:0 20px;">
            <FormItem :label="vm.$t('monitoring.gllx')" prop="productName">
                <Select  v-model="form.productName">
                    <Option v-for="item in pLink" :value="item.code">{{item.name}}</Option>
                </Select>
            </FormItem>
            <FormItem :label="vm.$t('risk.syjdtbczfz')"  prop="originalPrice">
                <numberbox class="number_input" :accuracy="0" v-model="form.originalPrice"/>
            </FormItem>
            <FormItem :label="vm.$t('risk.qksmgdczfz')"  prop="discountPrice">
                <numberbox class="number_input" :accuracy="0" v-model="form.discountPrice"/>
            </FormItem>
            <FormItem>
                <Button type="primary" style="width:100%;" @click="addVerify">{{vm.$t('finance.chuangj')}}</Button>
            </FormItem>
        </Form>
    </Card>
</template>

<script>
    import mallApi from '../../../api/mall';
    import until from '../../../libs/util';
    import Numberbox from '../../components/dialog/numberbox';

    export default {
        components: {Numberbox},
        data () {
            var vm = window.vm;
            return {
                vm: vm,
                form: {
                    discountPrice: null,
                    originalPrice: null,
                    productName: null,
                },
                ruleInline: {
                    discountPrice: [
                        {required: true, message: vm.$t('common.qsr')+vm.$t('mall.zkj'), trigger: 'blur'}
                    ],
                    originalPrice: [
                        {required: true, message: vm.$t('common.qsr')+vm.$t('mall.yj')}
                    ],
                    productName: [
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
                        mallApi.addProduct(this.form, (res) => {
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
