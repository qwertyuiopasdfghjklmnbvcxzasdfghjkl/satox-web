<template>
    <div class="addPlacard">
        <Card>
            <p slot="title">{{vm.$t('operation.xzzd')}}</p>
            <Form ref="formItem" :model="formLeft" :rules="ruleInline" label-position="left" :label-width="100"
                  style="width:450px;overflow:auto;">
                <FormItem :label="vm.$t('operation.ssmk')" prop="languageModule">
                    <Select v-model="formLeft.languageModule" name="languageModule">
                        <Option :value="1">{{vm.$t('operation.ty')}}</Option>
                        <Option :value="2">{{vm.$t('operation.jyspc')}}</Option>
                        <Option :value="3">{{vm.$t('operation.jysh5')}}</Option>
                        <Option :value="4">{{vm.$t('operation.jysapp')}}</Option>
                        <Option :value="5">{{vm.$t('operation.ht')}}</Option>
                    </Select>
                </FormItem>
                <FormItem :label="'Parent_key'" prop="parentKey">
                    <Input v-model="formLeft.parentKey" name="parentKey"></Input>
                </FormItem>
                <FormItem :label="'Public_key'" prop="publicKey">
                    <Input v-model="formLeft.publicKey" name="publicKey"></Input>
                </FormItem>
                <FormItem v-for="data in item" :label="data.languageTypeName" :prop="data.languageTypeCode">
                    <Input v-model="formLeft[data.languageTypeCode]" :name="data.languageTypeCode"></Input>
                </FormItem>
                <FormItem :label="vm.$t('operation.sm')" prop="remark">
                    <Input v-model="formLeft.remark" name="remark" type="textarea" :maxlength="250"></Input>
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
        props: ['item'],
        data () {
            const vm = window.vm;
            return {
                vm: vm,
                formLeft: {
                    languageModule: 1,
                    publicKey: null,
                    parentKey: null,
                    remark: null,
                },
                ruleInline: {
                    languageModule: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('operation.ssmk')},
                    ],
                    parentKey: [
                        {required: true, message: vm.$t('common.qsr') + 'parentKey'},
                    ],
                    publicKey: [
                        {required: true, message: vm.$t('common.qsr') + 'publicKey'},
                    ],
                    zh: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('operation.zw'), trigger: 'blur'},
                    ],
                    'zh-CN': [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('operation.zw'), trigger: 'blur'},
                    ],
                    en: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('operation.yw'), trigger: 'blur'},
                    ]
                },
                form: {
                    ext: []
                }
            };
        },
        created () {
            console.log(this.item);
        },
        methods: {
            closeDialog () {
                this.$emit('removeDialog');
            },
            addCurreny () {
                let form = this.$refs.formItem;
                this.form.languageModule = this.formLeft.languageModule;
                this.form.languageParentKey = this.formLeft.parentKey;
                this.form.languageKey = this.formLeft.publicKey;
                this.form.languageRemark = this.formLeft.remark;
                this.item.filter(res => {
                    let data = {
                        languageContent: this.formLeft[res.languageTypeCode],
                        languageTypeId: res.languageTypeId
                    };
                    this.form.ext.push(data);
                });
                form.validate((valid) => {
                    if (valid) {
                        extendApi.addI18nList(this.form, (res) => {
                            this.$Message.success({content: this.vm.$t('common.tjcg')});
                            this.$emit('removeDialog');
                            this.$emit('okCallback');
                        }, (msg) => {
                            this.$Message.error({content: msg});
                        });
                    }
                });
            },
            iconValidator (prop, e) {
                this.formLeft[prop] = e.target.value;
            },
            checkUrl (prop, e) {
                this.formLeft[prop] = e.target.value;
            }
        }
    };
</script>
<style>
    .addPlacard {
    }
</style>

