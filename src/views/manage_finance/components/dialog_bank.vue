<!-- 添加 -->
<template>
    <Card style="width:430px;">
        <p slot="title">
            新增记录
            <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
        </p>
        <Form ref="formValidate" :model="formValidate" :rules="ruleInline" :label-width="90" style="margin:0 20px;">
            <FormItem label="用户名" prop="username">
                <Input v-model="formValidate.username" name="username"></Input>
            </FormItem>
            <FormItem label="国家银行" prop="bankCountryCode">
                <Input  v-model="formValidate.bankCountryCode" name="bankCountryCode"></Input>
            </FormItem>
            <FormItem label="银行省" prop="bankProvince">
                <Input  v-model="formValidate.bankProvince" name="bankProvince"></Input>
            </FormItem>
            <FormItem label="银行区" prop="bankDistrict">
                <Input v-model="formValidate.bankDistrict" name="bankDistrict"></Input>
            </FormItem>
            <FormItem label="银行编号" prop="bankCode">
                <Input v-model="formValidate.bankCode" name="bankCode"></Input>
            </FormItem>
            <FormItem label="分行名称" prop="bankBranch">
                <Input v-model="formValidate.bankBranch" name="bankBranch" ></Input>
            </FormItem>
            <FormItem label="开户名" prop="bankRealname">
                <Input v-model="formValidate.bankRealname" name="bankRealname" ></Input>
            </FormItem>
            <FormItem label="银行账号" prop="bankNumber">
                <InputNumber :step="1" v-model="formValidate.bankNumber"
                             name="bankNumber" style="width: 267px;" ></InputNumber>
            </FormItem>

            <FormItem>
                <Button type="primary" style="width:100%;" @click="addVerify">创建</Button>
            </FormItem>
        </Form>
    </Card>
</template>

<script>
    import finance from '../../../api/finance';

    export default {
        data () {
            return {
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
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                    bankCountryCode: [
                        {required: true, message: '请输入国家银行', trigger: 'blur'}
                    ],
                    bankProvince: [
                        {required: true, message: '请输入银行省', trigger: 'blur'}
                    ],
                    bankDistrict: [
                        {required: true, message: '请输入银行区', trigger: 'blur'}
                    ],
                    bankCode: [
                        {required: true, message: '请输入银行编号', trigger: 'blur'}
                    ],
                    bankBranch: [
                        {required: true, message: '请输入分行名称', trigger: 'blur'}
                    ],
                    bankRealname: [
                        {required: true, message: '请输入开户名', trigger: 'blur'}
                    ],
                    bankNumber: [
                        {required: true, message: '请输入银行账号'}
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
