<!-- 添加 -->
<template>
    <Card style="width:430px;">
        <p slot="title">
            {{vm.$t('exchange.xzgl')}}
            <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
        </p>
        <Form ref="formValidate" :model="formValidate" :rules="ruleInline" :label-width="80" style="margin:0 20px;">

            <FormItem :label="vm.$t('monitoring.gllx')" prop="remarks">
                <Input v-model="formValidate.remarks" name="remarks" :maxlength="20"></Input>
            </FormItem>

            <FormItem>
                <Button type="primary" style="width:100%;" @click="addVerify">{{vm.$t('common.bc')}}</Button>
            </FormItem>
        </Form>
    </Card>
</template>

<script>
    import financeApi from '../../api/finance';

    export default {
        data () {
            var vm = window.vm;
            return {
                vm: vm,
                formValidate: {
                    remarks: null,
                },
                ruleInline: {
                    remarks: [
                        {required: true, message: vm.$t('common.qsr')+vm.$t('monitoring.gllx')}
                    ]
                }
            };
        },
        methods: {
            addVerify () {
                this.$refs.formValidate.validate((valid) => {
                    if (valid) {
                        financeApi.addTransfer(this.formValidate, (res) => {
                            this.$Message.success({content: this.vm.$t('common.tjcg')});
                            this.$emit('okCallback');
                            this.$emit('removeDialog');
                        }, (msg) => {
                            this.$Message.error({content: msg});
                        });
                    }
                });
            },
            closeDialog () {
                this.$emit('removeDialog');
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
