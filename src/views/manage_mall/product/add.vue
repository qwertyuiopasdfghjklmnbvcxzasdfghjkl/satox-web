<!-- 添加 -->
<template>
    <Card style="width:430px;">
        <p slot="title">
            {{vm.$t('mall.tjsp')}}
            <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
        </p>
        <Form ref="form" :model="form" :rules="ruleInline" :label-width="90" style="margin:0 20px;">
            <FormItem :label="vm.$t('mall.tp')" prop="iconFile">
                <input type="file" ref="iconFile" name="iconFile" @change="getImg()">
            </FormItem>
            <FormItem :label="vm.$t('mall.yj')"  prop="originalPrice">
                <numberbox class="number_input" v-model="form.originalPrice"/>
            </FormItem>
            <FormItem :label="vm.$t('mall.zkj')"  prop="discountPrice">
                <numberbox class="number_input" v-model="form.discountPrice"/>
            </FormItem>
            <FormItem :label="vm.$t('mall.mc')" prop="productName">
                <Input v-model="form.productName" :maxlength="32"></Input>
            </FormItem>
            <FormItem :label="vm.$t('mall.ywm')" prop="productNameEn">
                <Input v-model="form.productNameEn" :maxlength="32"></Input>
            </FormItem>
            <FormItem :label="vm.$t('mall.jj')" prop="productDescription">
                <Input v-model="form.productDescription" type="textarea" :maxlength="120"></Input>
            </FormItem>
            <FormItem :label="vm.$t('mall.ywjj')" prop="productDescriptionEn">
                <Input v-model="form.productDescriptionEn" type="textarea" :maxlength="120"></Input>
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
                    productNameEn: null,
                    productDescription: null,
                    productDescriptionEn: null,
                    iconFile: null,
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
                    ],
                    productNameEn: [
                        {required: true, message: vm.$t('common.qsr')+vm.$t('mall.ywm')}
                    ],
                    productDescription: [
                        {required: true, message: vm.$t('common.qsr')+vm.$t('mall.jj')}
                    ],
                    productDescriptionEn: [
                        {required: true, message: vm.$t('common.qsr')+vm.$t('mall.ywjj')}
                    ],
                    iconFile: [
                        {required: true, message: vm.$t('common.qsr')+vm.$t('mall.tp')}
                    ]
                }
            };
        },
        created () {
        },
        methods: {
            addVerify () {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        let formData = new FormData();
                        formData.append('discountPrice', this.form.discountPrice)
                        formData.append('originalPrice', this.form.originalPrice)
                        formData.append('productName', this.form.productName)
                        formData.append('productNameEn', this.form.productNameEn)
                        formData.append('productDescription', this.form.productDescription)
                        formData.append('productDescriptionEn', this.form.productDescriptionEn)
                        formData.append('iconFile', this.form.iconFile)
                        mallApi.addProduct(formData, (res) => {
                            this.$Message.success({content: this.vm.$t('common.tjcg')});
                            this.$emit('okCallback');
                            this.$emit('removeDialog');
                        }, (msg) => {
                            this.$Message.error({content: msg});
                        });
                    }
                });
            },
            getImg(){
                this.form.iconFile = this.$refs.iconFile.files[0]
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
        width: 267px;
        text-indent: 6px;
    }
</style>
