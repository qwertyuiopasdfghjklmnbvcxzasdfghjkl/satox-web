<!-- 添加 -->
<template>
    <Card style="width:430px;">
        <p slot="title">
            创建新交易
            <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
        </p>
        <Form ref="formValidate" :model="formValidate" :rules="ruleInline" :label-width="90" style="margin:0 20px;">
            <FormItem label="币种代号" prop="verifyClass">
                <Select v-model="formValidate.verifyClass" name="verifyClass">
                    <Option value="2">二代身份证</Option>
                    <Option value="0">驾照</Option>
                    <Option value="1">护照</Option>
                </Select>
            </FormItem>
            <FormItem label="数量" prop="account">
                <InputNumber  v-model="formValidate.account" name="account" style="width: 100%"></InputNumber>
            </FormItem>
            <FormItem label="转出用户名" prop="cn">
                <Input v-model="formValidate.cn" name="cn"></Input>
            </FormItem>
            <FormItem label="收款用户名" prop="verifySurname">
                <Input v-model="formValidate.verifySurname" name="verifySurname"></Input>
            </FormItem>
            <FormItem label="备注" prop="verifyIdCard">
                <Input v-model="formValidate.verifyIdCard" name="verifyIdCard" maxlength="'255'"></Input>
            </FormItem>

            <FormItem>
                <Button type="primary" style="width:100%;" @click="addVerify">创建</Button>
            </FormItem>
        </Form>
    </Card>
</template>

<script>
    import kycApi from '../../../api/kyc';
    import until from '../../../libs/util';

    export default {
        data () {
            return {
                formValidate: {
                    account: null,
                    verifyClass: '',
                    verifySex: '1',
                    verifyIdCard: null,
                    verifyStatus: null,
                    verifyAddTime: '',
                    verifyUserID: null,
                    verifyCountryId: null,
                    cn: '',
                    verifySurname: ''
                },
                ruleInline: {
                    verifyClass: [
                        {required: true, message: '请选择币种', trigger: 'blur'}
                    ],
                    account: [
                        {required: true, message: '请输入数量', trigger: 'blur'}
                    ],
                    cn: [
                        {required: true, message: '请输入转出用户名', trigger: 'blur'}
                    ],
                    verifySurname: [
                        {required: true, message: '请输入收款用户名', trigger: 'blur'}
                    ],
                    verifyIdCard: [
                        {required: false, message: '', trigger: 'blur'}
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
                            this.$Message.success({content: '添加成功'});
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
