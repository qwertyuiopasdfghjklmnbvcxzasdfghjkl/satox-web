<template>
    <Card>
        <p>
            <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
        </p>
        <!--<Form :model="formItem" :rules="ruleInline" :label-width="150" style="margin:50px;">-->
            <!--<FormItem label="电话确认:" prop="checkbox">-->
            <!--<Checkbox v-model="formItem.checkbox" name="checkbox"></Checkbox>-->
            <!--</FormItem>-->
            <!--<FormItem label="确认情况填写:" prop="textarea">-->
            <!--<Input v-model="formItem.textarea" name="textarea" type="textarea" :autosize="{minRows: 2, maxRows: 10}"></Input>-->
            <!--</FormItem>-->
            <!--<FormItem>-->
        <p class="btn_p">
            <Button type="primary" @click="audit('2')">同意</Button>
            <Button type="ghost" style="margin-left: 8px" @click="audit('1')">不同意</Button>
        </p>

            <!--</FormItem>-->
        <!--</Form>/-->
    </Card>
</template>

<script>
    import financeApi from '../../api/finance';

    export default {
        props: ['id', 'withdrawApplyId'],
        data () {
            return {
                // formItem: {
                //     checkbox: false, //1，已电话确认 0，未电话确认
                //     textarea: '',
                //     // withdrawApplyId: null,
                //     auditStatus: 2 //0 未审核 1 审核不通过 2 审核通过
                // },
                // ruleInline: {
                //     checkbox: [
                //         { required: true, message: '电话不能为空', trigger: 'blur' }
                //     ],
                //     textarea: [
                //         { required: true, message: '请输入备注', trigger: 'blur' },
                //     ]
                // }
            };
        },
        methods: {
            disagree () {

            },
            closeDialog () {
                this.$emit('removeDialog');
            },
            audit (code) {
                financeApi.updateWithdrawAuditing({
                    withdrawApplyId: this.withdrawApplyId,
                    auditStatus: code
                }, (res) => {
                    this.$Message.success({content: '审核成功'});
                    this.$emit('okCallback');
                    this.$emit('removeDialog');
                }, (msg) => {
                    this.$Message.error({content: msg});
                });

                // let form = this.$refs.formItem;
                // form.validate((valid) => {
                //     if (valid) {

                //     }
                // })

                // financeApi.updateWithdrawAuditing({
                //         phoneComfirm :this.formItem.checkbox?1:0,
                //         comfirmRemark:this.formItem.textarea,
                //         withdrawApplyId:this.id,
                //         auditStatus: this.formItem.auditStatus
                //     },  (res) => {
                //         this.$Message.success({content: '审核成功'})
                //         this.$emit('removeDialog');
                //     }, (msg) => {
                //         this.$Message.error({content: msg})
                //     })
            }
        }
    };
</script>
<style scoped>
    .ivu-form /deep/ .ivu-form-item-label {
        text-align: left !important;
        width: 100px !important;
    }

    .ivu-form-item-content {
        margin-left: 100px !important;
    }
    .btn_p{
        text-align: center;
        width: 200px;
        margin-top: 20px;
    }
</style>

