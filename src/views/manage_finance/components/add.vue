<!-- 添加 -->
<template>
    <Card style="width:430px;">
        <p slot="title">
            {{vm.$t('finance.cjxjy')}}
            <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
        </p>
        <Form ref="formValidate" :model="formValidate" :rules="ruleInline" :label-width="90" style="margin:0 20px;">
            <FormItem :label="vm.$t('common.bzdh')" prop="symbol">
                <Select v-model="formValidate.symbol">
                    <Option value="USSD">USSD</Option>
                </Select>
            </FormItem>
            <FormItem :label="vm.$t('common.sl')"  prop="quantity">
                <input class="number_input" type="number" @input="oninput"/>
            </FormItem>
            <FormItem :label="vm.$t('finance.zcyhm')"  prop="fromUserName">
                <AutoComplete
                        v-model="formValidate.fromUserName"
                        :data="data2"
                        @on-search="nameSearch(formValidate.fromUserName, 'formName')"
                        name="fromUserName"
                        :placeholder="vm.$t('finance.zcyhm')"></AutoComplete>
            </FormItem>
            <FormItem :label="vm.$t('finance.skyhm')" prop="toUserName">
                <AutoComplete
                        v-model="formValidate.toUserName"
                        :data="data3"
                        @on-search="nameSearch(formValidate.toUserName, 'name')"
                        name="fromUserName"
                        :placeholder="vm.$t('finance.skyhm')"></AutoComplete>
            </FormItem>
            <FormItem :label="vm.$t('common.beiz')" prop="remarks">
                <Input v-model="formValidate.remarks" name="remarks" :maxlength="255"></Input>
            </FormItem>

            <FormItem>
                <Button type="primary" style="width:100%;" @click="addVerify">{{vm.$t('finance.chuangj')}}</Button>
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
            var vm = window.vm;
            return {
                vm: vm,
                formValidate: {
                    symbol: 'USSD',
                    quantity: null,
                    fromUserName: null,
                    toUserName: null,
                    remarks: null,
                },
                data1: [],
                data2: [],
                data3: [],
                symbolList: [],
                ruleInline: {
                    symbol: [
                        {required: true, message: this.text, trigger: 'blur'}
                    ],
                    quantity: [
                        {required: true, message: vm.$t('common.qsr')+vm.$t('common.sl')}
                    ],
                    fromUserName: [
                        {required: true, message: vm.$t('common.qsr')+vm.$t('finance.zcyhm'), trigger: 'blur'}
                    ],
                    toUserName: [
                        {required: true, message: vm.$t('common.qsr')+vm.$t('finance.skyhm'), trigger: 'blur'}
                    ],
                    remarks: [
                        {required: false, message: ''}
                    ]
                }
            };
        },
        created () {
            this.getdataSymbol();
        },
        methods: {
            nameSearch (value, state) {
                this.getNameSearch(value, state);
            },
            getdataSymbol () {
                currenyApi.findAllValidSymbolList((res) => {
                    this.symbolList = res;
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
            oninput (e) {
                // 通过正则过滤小数点后8位
                e.target.value = (e.target.value.match(/^\d*(\.?\d{0,8})/g)[0]) || null;
                this.formValidate.quantity = e.target.value;
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
    .number_input {
        border: 1px solid #dcdcdc;
        border-radius: 4px;
        width: 267px;
        text-indent: 6px;
    }
</style>
