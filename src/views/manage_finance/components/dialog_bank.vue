<!-- 添加 -->
<template>
    <Card style="width:430px;">
        <p slot="title">
            {{vm.$t('finance.xzjl')}}
            <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
        </p>
        <Form ref="formValidate" :model="formValidate" :rules="ruleInline" :label-width="90" style="margin:0 20px;">
            <FormItem :label="vm.$t('common.yhm')" prop="username">
                <Input v-model="formValidate.username" name="username"></Input>
            </FormItem>
            <FormItem :label="vm.$t('finance.gjyh')" prop="bankCountryCode">
                <Input  v-model="formValidate.bankCountryCode" name="bankCountryCode"></Input>
            </FormItem>
            <FormItem :label="vm.$t('finance.yhs')" prop="bankProvince">
                <Input  v-model="formValidate.bankProvince" name="bankProvince"></Input>
            </FormItem>
            <FormItem :label="vm.$t('finance.yhq')" prop="bankDistrict">
                <Input v-model="formValidate.bankDistrict" name="bankDistrict"></Input>
            </FormItem>
            <FormItem :label="vm.$t('finance.yhbh')" prop="bankCode">
                <Input v-model="formValidate.bankCode" name="bankCode"></Input>
            </FormItem>
            <FormItem :label="vm.$t('finance.fhmc')" prop="bankBranch">
                <Input v-model="formValidate.bankBranch" name="bankBranch" ></Input>
            </FormItem>
            <FormItem :label="vm.$t('finance.khm')" prop="bankRealname">
                <Input v-model="formValidate.bankRealname" name="bankRealname" ></Input>
            </FormItem>
            <FormItem :label="vm.$t('finance.yhzh')" prop="bankNumber">
                <InputNumber :step="1" v-model="formValidate.bankNumber"
                             name="bankNumber" style="width: 267px;" ></InputNumber>
            </FormItem>

            <FormItem>
                <Button type="primary" style="width:100%;" @click="addVerify">{{vm.$t('finance.chuangj')}}</Button>
            </FormItem>
        </Form>
    </Card>
</template>

<script>
    import finance from '../../../api/finance';

    export default {
        data () {
            var vm = window.vm;
            return {
                vm: vm,
                formValidate: {
                    username: '',
                    bankCountryCode: null,
                    bankProvince: null,
                    bankDistrict: null,
                    bankCode: '',
                    bankBranch: '',
                    bankRealname: '',
                    bankNumber: null
                },
                ruleInline: {
                    username: [
                        {required: true, message: vm.$t('common.qsr')+vm.$t('common.yhm'), trigger: 'blur'}
                    ],
                    bankCountryCode: [
                        {required: true, message: vm.$t('common.qsr')+vm.$t('finance.gjyh'), trigger: 'blur'}
                    ],
                    bankProvince: [
                        {required: true, message: vm.$t('common.qsr')+vm.$t('finance.yhs'), trigger: 'blur'}
                    ],
                    bankDistrict: [
                        {required: true, message: vm.$t('common.qsr')+vm.$t('finance.yhq'), trigger: 'blur'}
                    ],
                    bankCode: [
                        {required: true, message: vm.$t('common.qsr')+vm.$t('finance.yhbh'), trigger: 'blur'}
                    ],
                    bankBranch: [
                        {required: true, message: vm.$t('common.qsr')+vm.$t('finance.fhmc'), trigger: 'blur'}
                    ],
                    bankRealname: [
                        {required: true, message: vm.$t('common.qsr')+vm.$t('finance.khm'), trigger: 'blur'}
                    ],
                    bankNumber: [
                        {required: true, message: vm.$t('common.qsr')+vm.$t('finance.yhzh')}
                    ]
                }
            };
        },
        methods: {
            iconValidator (prop, e) {
                this.formValidate[prop] = e.target.value;
            },
            closeDialog () {
                this.$emit('removeDialog');
            },
            addVerify () {
                this.$refs.formValidate.validate((valid) => {
                    if (valid) {
                        // let formData = new FormData(this.$refs.formValidate.$el);
                        finance.insertUsdsBank(this.formValidate, (res) => {
                            this.$Message.success({content: this.vm.$t('common.tjcg')});
                            this.$emit('okCallback');
                            this.$emit('removeDialog');
                        }, (msg) => {
                            this.$Message.error({content: msg});
                        });
                    }
                });
            }
        }
    };
</script>

<style>

</style>
