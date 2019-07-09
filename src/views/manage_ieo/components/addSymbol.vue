<template>
    <Card class="box" style="width: 500px">
        <p slot="title">
            {{vm.$t('ieo.tjdfbz')}}
            <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
        </p>
        <Form ref="form" :model="form" :rules="ruleInline" :label-width="100" style="margin:0 20px;">
            <FormItem :label="vm.$t('common.bz')" prop="symbol">
                <Select v-model="form.symbol">
                    <Option v-for="item in symbolList"
                            :value="item.symbol"
                            :key="item.symbol">
                        {{ item.symbol }}
                    </Option>
                </Select>
            </FormItem>
            <FormItem :label="vm.$t('ieo.mfsl')" prop="symbolCount">
                <numberbox v-model="form.symbolCount" :maxlength="32" class="w1"></numberbox>
            </FormItem>
            <FormItem>
                <Button type="primary" class="btn" size="large" @click="add()">
                    {{vm.$t('common.tj')}}
                </Button>
            </FormItem>
        </Form>
    </Card>
</template>

<script>
    import Numberbox from '../../components/dialog/numberbox';

    export default {
        name: 'project',
        props: ['symbolList', 'item'],
        components: {Numberbox},
        data () {
            const vm = window.vm;
            return {
                vm: vm,
                form: {
                    symbol: null,
                    symbolCount: null,
                    symbolType: null,
                    symbolId: null
                },
                ruleInline: {
                    symbol: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('common.bz'), trigger: 'blur'}
                    ],
                    symbolCount: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('ieo.mfsl'), trigger: 'blur'}
                    ]
                }
            };
        },
        watch: {
            'form.symbol' () {
                this.symbolList.map((res) => {
                    if (this.form.symbol === res.symbol) {
                        this.form.symbolType = res.symbolType;
                        this.form.symbolId = res.symbolId;
                    }
                });
            }
        },
        created () {
            console.log(this.symbolList);
            if (this.item) {
                this.form = this.item;
            }
        },
        methods: {
            add () {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$emit('okCallback', this.form);
                        this.$emit('removeDialog');
                    }
                });
            },
            closeDialog () {
                this.$emit('removeDialog');
            }
        }
    };
</script>

<style scoped lang="less">
    .w1 {
        border: 1px solid #dddee1;
    }
</style>
