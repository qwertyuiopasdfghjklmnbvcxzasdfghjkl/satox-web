<template>
    <div class="addPlacard">
        <Card>
            <p slot="title">{{vm.$t('operation.xzzd')}}</p>
            <Form ref="formItem" :model="formLeft" :rules="ruleInline" label-position="left" :label-width="100"
                  style="width:450px;overflow:auto;">
                <FormItem :label="'Public_key'" prop="publicKey">
                    <Input v-model="formLeft.publicKey" name="publicKey"></Input>
                </FormItem>
                <FormItem :label="vm.$t('operation.zw')" prop="cn">
                    <Input v-model="formLeft.cn" name="cn"></Input>
                </FormItem>
                <FormItem :label="vm.$t('operation.yw')" prop="en">
                    <Input v-model="formLeft.en" name="en"></Input>
                </FormItem>
                <FormItem :label="vm.$t('operation.zwft')" prop="cnzh">
                    <Input v-model="formLeft.cnzh" name="cnzh"></Input>
                </FormItem>
                <FormItem :label="vm.$t('operation.hy')" prop="korean">
                    <Input v-model="formLeft.korean" name="korean"></Input>
                </FormItem>
                <FormItem :label="vm.$t('operation.ry')" prop="japanese">
                    <Input v-model="formLeft.japanese" name="japanese"></Input>
                </FormItem>
                <FormItem :label="vm.$t('operation.dy')" prop="german">
                    <Input v-model="formLeft.german" name="german"></Input>
                </FormItem>
                <FormItem :label="vm.$t('operation.xbyy')" prop="spanish">
                    <Input v-model="formLeft.spanish" name="spanish"></Input>
                </FormItem>
                <FormItem :label="vm.$t('operation.fy')" prop="french">
                    <Input v-model="formLeft.french" name="french"></Input>
                </FormItem>
                <FormItem :label="vm.$t('operation.ydly')" prop="italian">
                    <Input v-model="formLeft.italian" name="italian"></Input>
                </FormItem>
                <FormItem :label="vm.$t('operation.alby')" prop="arabic">
                    <Input v-model="formLeft.arabic" name="arabic"></Input>
                </FormItem>
                <FormItem :label="vm.$t('operation.sm')" prop="remark">
                    <Input v-model="formLeft.remark" name="remark" type="textcent"></Input>
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
    import extendApi from '../../api/extend';
    import util from '../../libs/util';

    export default {
        data () {
            const vm = window.vm;
            return {
                vm: vm,
                formLeft: {
                    publicKey: null,
                    cn: null,
                    en: null,
                    cnzh: null,
                    korean: null,
                    japanese: null,
                    german: null,
                    spanish: null,
                    french: null,
                    italian: null,
                    arabic: null,
                    remark: null,
                },
                ruleInline: {
                    publicKey: [
                        {required: true, message: vm.$t('common.qsr') + 'publicKey'},
                    ],
                    cn: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('operation.zw'), trigger: 'blur'},
                    ],
                    en: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('operation.yw'), trigger: 'blur'},
                    ],
                    cnzh: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('operation.zwft'), trigger: 'blur'}
                    ],
                    // korean: [
                    //     {required: true, message: vm.$t('common.qsr') + vm.$t('operation.ywgglj'), trigger: 'blur'},
                    // ],
                    // japanese: [
                    //     {required: true, message: vm.$t('common.qsr') + vm.$t('operation.ftggbt'), trigger: 'blur'}
                    // ],
                    // german: [
                    //     {required: true, message: vm.$t('common.qsr') + vm.$t('operation.ftgglj'), trigger: 'blur'},
                    // ],
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
                        extendApi.addI18nList(this.formLeft, (res) => {
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

