<template>
    <div class="addPlacard">
        <Card>
            <p slot="title">{{vm.$t('common.xz')}}</p>
            <Form ref="formItem" :model="formLeft" :rules="ruleInline" label-position="left" :label-width="100"
                  style="width:450px;overflow:auto;">
                <FormItem :label="vm.$t('operation.yymczw')" prop="languageTypeCode">
                    <Input v-model="formLeft.languageTypeCode" name="languageTypeCode"></Input>
                </FormItem>
                <FormItem :label="vm.$t('operation.yyzs')" prop="languageTypeName">
                    <Input v-model="formLeft.languageTypeName" name="languageTypeName"></Input>
                </FormItem>
                <div class="bannerBtn">
                    <Button type="primary" @click="addCurreny()">{{vm.$t('common.tj')}}</Button>
                    <Button @click="closeDialog()">{{vm.$t('common.qx')}}</Button>
                </div>
            </Form>
        </Card>
    </div>
</template>
<script>
    import extendApi from '../../../api/extend';
    import util from '../../../libs/util';

    export default {
        data () {
            const vm = window.vm;
            return {
                vm: vm,
                formLeft: {
                    publicKey: null,
                    languageTypeCode: null,
                    languageTypeName: null,
                },
                ruleInline: {
                    languageTypeCode: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('operation.yymczw'), trigger: 'blur'},
                    ],
                    languageTypeName: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('operation.yyzs'), trigger: 'blur'},
                    ]
                }
            };
        },
        methods: {
            closeDialog () {
                this.$emit('removeDialog');
            },
            addCurreny () {
                let form = this.$refs.formItem;
                form.validate((valid) => {
                    if (valid) {
                        extendApi.addLang(this.formLeft, (res) => {
                            this.$Message.success({content: this.vm.$t('common.tjcg')});
                            this.$emit('removeDialog');
                            this.$emit('okCallback');
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
    .addPlacard {
    }
</style>

