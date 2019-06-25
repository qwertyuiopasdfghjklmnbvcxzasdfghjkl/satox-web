<template>
    <div class="addPlacard">
        <Card>
            <p slot="title">{{vm.$t('common.xz')}}</p>
            <Form ref="formItem" :model="formLeft" :rules="ruleInline" label-position="left" :label-width="100"
                  style="width:450px;overflow:auto;">
                <FormItem :label="vm.$t('operation.yymczw')" prop="cn">
                    <Input v-model="formLeft.cn" name="cn"></Input>
                </FormItem>
                <FormItem :label="vm.$t('operation.yyzs')" prop="en">
                    <Input v-model="formLeft.en" name="en"></Input>
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
                    cn: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('operation.yymczw'), trigger: 'blur'},
                    ],
                    en: [
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
                        extendApi.addI18nList(this.formLeft, (res) => {
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

