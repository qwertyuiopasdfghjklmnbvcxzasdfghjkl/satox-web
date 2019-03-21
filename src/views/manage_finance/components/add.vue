<!-- 添加 -->
<template>
    <Card style="width:430px;">
        <p slot="title">
            创建新交易
            <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
        </p>
        <Form ref="formValidate" :model="formValidate" :rules="ruleInline" :label-width="90" style="margin:0 20px;">
            <FormItem label="币种代号" prop="symbol">
                <AutoComplete
                        v-model="formValidate.symbol"
                        :data="data1"
                        @on-search="handleSearch"
                        name="symbol"
                        placeholder="币种代号"></AutoComplete>
            </FormItem>
            <FormItem label="数量" prop="quantity">
                <InputNumber v-model="formValidate.quantity" :min="0" name="quantity" style="width: 100%"></InputNumber>
            </FormItem>
            <FormItem label="转出用户名" prop="fromUserName">
                <!--<Input v-model="formValidate.fromUserName" name="fromUserName"></Input>-->
                <AutoComplete
                        v-model="formValidate.fromUserName"
                        :data="data2"
                        @on-search="nameSearch(formValidate.fromUserName, 'formName')"
                        name="fromUserName"
                        placeholder="转出用户名"></AutoComplete>
            </FormItem>
            <FormItem label="收款用户名" prop="toUserName">
                <!--<Input v-model="formValidate.toUserName" name="toUserName"></Input>-->
                <AutoComplete
                        v-model="formValidate.toUserName"
                        :data="data3"
                        @on-search="nameSearch(formValidate.toUserName, 'name')"
                        name="fromUserName"
                        placeholder="收款用户名"></AutoComplete>
            </FormItem>
            <FormItem label="备注" prop="remarks">
                <Input v-model="formValidate.remarks" name="remarks" :maxlength="255"></Input>
            </FormItem>

            <FormItem>
                <Button type="primary" style="width:100%;" @click="addVerify">创建</Button>
            </FormItem>
        </Form>
    </Card>
</template>

<script>
    import kycApi from '../../../api/kyc';
    import currenyApi from '../../../api/currency';
    import financeApi from '../../../api/finance';
    import until from '../../../libs/util';

    export default {
        data () {
            return {
                formValidate: {
                    symbol: null,
                    quantity: null,
                    fromUserName: null,
                    toUserName: null,
                    remarks: null,
                },
                data1: [],
                data2: [],
                data3: [],
                ruleInline: {
                    symbol: [
                        {required: true, message: '请选择币种', trigger: 'blur'}
                    ],
                    quantity: [
                        {required: true, message: '请输入数量'}
                    ],
                    fromUserName: [
                        {required: true, message: '请输入转出用户名', trigger: 'blur'}
                    ],
                    toUserName: [
                        {required: true, message: '请输入收款用户名', trigger: 'blur'}
                    ],
                    remarks: [
                        {required: false, message: ''}
                    ]
                }
            };
        },
        methods: {
            handleSearch (value) {
                this.getHandleSearch(value);
            },
            nameSearch (value, state) {
                this.getNameSearch(value, state);
            },
            getHandleSearch (value) {
                currenyApi.findSymbolList({
                    symbol: value || null
                }, 1, 1, (res) => {
                    let data = [];
                    res.forEach(res => {
                        data.push(res.symbol);
                    });
                    this.data1 = data;
                });
            },
            getNameSearch (value, state) {
                currenyApi.getfindUserList(1, 1,
                    {
                        username: value || null
                    }, (res) => {
                        let data = [];
                        res.forEach(res => {
                            data.push(res.username);
                        });
                        if (state === 'formName') {
                            this.data2 = data;
                        } else if (state === 'name') {
                            this.data3 = data;
                        }
                    });
            },
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
                        financeApi.addTransfer(this.formValidate, (res) => {
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
