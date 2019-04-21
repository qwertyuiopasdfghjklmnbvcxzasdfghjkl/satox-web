<!-- 添加 -->
<template>
    <Card style="width:430px;">
        <p slot="title">
            KYC{{vm.$t('common.tj')}}
            <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
        </p>
        <Form ref="formValidate" :model="formValidate" :rules="ruleInline" :label-width="80" style="margin:0 20px;">
            <FormItem :label="vm.$t('common.zh')" prop="account">
                <Input v-model="formValidate.account" name="account"></Input>
            </FormItem>
            <FormItem :label="vm.$t('common.dq')" prop="cn">
                <Input v-model="formValidate.cn" name="cn"></Input>
            </FormItem>
            <FormItem :label="vm.$t('common.xm')" prop="verifySurname">
                <Input v-model="formValidate.verifySurname" name="verifySurname"></Input>
            </FormItem>
            <FormItem :label="vm.$t('common.xb')" prop="verifySex">
                <Select v-model="formValidate.verifySex" name="verifySex">
                    <Option value="1">{{vm.$t('common.n')}}</Option>
                    <Option value="0">{{vm.$t('common.nv')}}</Option>
                </Select>
            </FormItem>
            <FormItem :label="vm.$t('common.zjlx')" prop="verifyClass">
                <Select v-model="formValidate.verifyClass" name="verifyClass">
                    <Option value="2">{{vm.$t('common.sfz')}}</Option>
                    <Option value="0">{{vm.$t('common.jz')}}</Option>
                    <Option value="1">{{vm.$t('common.hz')}}</Option>
                </Select>
            </FormItem>
            <FormItem :label="vm.$t('common.zjh')" prop="verifyIdCard">
                <Input v-model="formValidate.verifyIdCard" name="verifyIdCard"></Input>
            </FormItem>
            <FormItem :label="vm.$t('common.zt')" prop="verifyStatus">
                <Select v-model="formValidate.verifyStatus" name="verifyStatus">
                    <Option value="2">{{vm.$t('common.ytg')}}</Option>
                    <Option value="3">{{vm.$t('common.btg')}}</Option>
                </Select>
            </FormItem>
            <FormItem :label="vm.$t('common.sj')" prop="verifyAddTime">
                <DatePicker type="date" :placeholder="vm.$t('common.qxz')+vm.$t('common.sj')"
                            name="verifyAddTime" v-model="formValidate.verifyAddTime" width="100%"></DatePicker>
            </FormItem>
            <FormItem :label="vm.$t('common.zp')" prop="frontImg">
                <input type="file" ref="frontImg" name="frontImg" @change="iconValidator('frontImg', $event)"/>
            </FormItem>
            <FormItem label="" prop="backImg">
                <input type="file" ref="backImg" name="backImg" @change="iconValidator('backImg', $event)"/>
            </FormItem>
            <FormItem label="" prop="handImg">
                <input type="file" ref="handImg" name="handImg" @change="iconValidator('handImg', $event)"/>
            </FormItem>
            <FormItem>
                <Button type="primary" style="width:100%;" @click="addVerify">{{vm.$t('common.tj')}}</Button>
            </FormItem>
        </Form>
    </Card>
</template>

<script>
    import kycApi from '../../api/kyc';
    import until from '../../libs/util';

    export default {
        data () {
            const customValidator = (rule, value, callback) => {
                if (this.formValidate[rule.field] === null) {
                    return callback(new Error('error'));
                } else {
                    return callback();
                }
            };
            const xxx = (rule, value, callback) => {
                if (/\.(jpg|png|jpeg|bmp)/i.test(value) === false) {
                    return callback(new Error());
                } else {
                    return callback();
                }
            };
            let self = this;
            const xxx1 = (rule, value, callback) => {
                let isTrue = until.limitUploadImage(self.$refs.frontImg);
                if (!isTrue) {
                    return callback(new Error());
                }
                return callback();
            };
            const xxx2 = (rule, value, callback) => {
                let isTrue = until.limitUploadImage(self.$refs.backImg);
                if (!isTrue) {
                    return callback(new Error());
                }
                return callback();
            };
            const xxx3 = (rule, value, callback) => {
                let isTrue = until.limitUploadImage(self.$refs.handImg);
                if (!isTrue) {
                    return callback(new Error());
                }
                return callback();
            };
            var vm = window.vm;
            return {
                vm: vm,
                formValidate: {
                    account: '',
                    verifySex: '1',
                    verifyClass: '',
                    verifyIdCard: null,
                    verifyStatus: null,
                    verifyAddTime: '',
                    verifyUserID: null,
                    frontImg: '',
                    backImg: '',
                    handImg: '',
                    verifyCountryId: null,
                    cn: '',
                    verifySurname: ''
                },
                ruleInline: {
                    verifyAddTime: [
                        {
                            required: true, type: 'date', message: vm.$t('common.qsr') + vm.$t('common.sj'),
                            trigger: 'change'
                        }
                    ],
                    account: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('common.zh'), trigger: 'blur'}
                    ],
                    cn: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('common.dq'), trigger: 'blur'},
                    ],
                    verifySurname: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('common.xm'), trigger: 'blur'}
                    ],
                    verifySex: [
                        {required: true, message: vm.$t('common.qxz') + vm.$t('common.xb'), trigger: 'blur'}
                    ],
                    verifyClass: [
                        {
                            required: true,
                            message: vm.$t('common.qxz') + vm.$t('common.zjlx'),
                            trigger: 'blur'
                        },
                    ],
                    verifyIdCard: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('common.zjh'), trigger: 'blur'},
                    ],
                    verifyStatus: [
                        {required: true, message: vm.$t('common.qxz') + vm.$t('common.zt'), trigger: 'blur'},
                    ],
                    frontImg: [
                        {required: true, message: vm.$t('kyc.qscbrzjzmz'), trigger: 'blur'},
                        {validator: xxx, message: vm.$t('kyc.znscpnghjpeghbmpdtp'), trigger: 'blur'},
                        {validator: xxx1, message: vm.$t('kyc.tpbncg2m'), trigger: 'blur'}
                    ],
                    backImg: [
                        {required: true, message: vm.$t('kyc.qscbrzjbmz'), trigger: 'blur'},
                        {validator: xxx, message: vm.$t('kyc.znscpnghjpeghbmpdtp'), trigger: 'blur'},
                        {validator: xxx2, message: vm.$t('kyc.tpbncg2m'), trigger: 'blur'}
                    ],
                    handImg: [
                        {required: true, message: vm.$t('kyc.qscbrsczjzp'), trigger: 'blur'},
                        {validator: xxx, message: vm.$t('kyc.znscpnghjpeghbmpdtp'), trigger: 'blur'},
                        {validator: xxx3, message: vm.$t('kyc.tpbncg2m'), trigger: 'blur'}
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
                        let formData = new FormData(this.$refs.formValidate.$el);
                        formData.append('verifyClass', this.formValidate.verifyClass);
                        formData.append('verifyCountryId', '1');
                        formData.append('verifySex', this.formValidate.verifySex);
                        // formData.append('verifyUserID', this.formItem.verifyUserID);
                        kycApi.insertVerify(formData, (res) => {
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
