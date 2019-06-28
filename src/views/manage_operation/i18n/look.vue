<template>
    <Card style="width: 650px">
        <p slot="title">{{vm.$t('kyc.ckxq')}}
            <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
        </p>
        <Row style="margin-bottom:20px;">
            <Col span="4">{{vm.$t('operation.ssmk')}}</Col>
            <Col span="20">{{languageModule | module}}</Col>
        </Row>
        <Row v-for="data in datas" style="margin-bottom:20px;">
            <Col span="4">{{swLang(data.languageTypeId)}}</Col>
            <Col span="20">{{data.languageContent || '—'}}</Col>
        </Row>
        <Row style="margin-bottom:20px;">
            <Col span="4">{{vm.$t('operation.sm')}}</Col>
            <Col span="20">{{languageRemark || '—'}}</Col>
        </Row>
    </Card>
</template>
<script>
    import extendApi from '../../../api/extend';

    export default {
        props: ['lang', 'item'],
        data () {
            const vm = window.vm;
            return {
                vm: vm,
                datas: [],
                languageModule: null,
                languageRemark: null,
            };
        },
        created () {
            this.getDetail();
        },
        methods: {
            getDetail () {
                let data = {
                    languageId: this.item.languageId
                };
                extendApi.i18nDetail(data, res => {
                    this.datas = res;
                    this.languageModule = this.datas[0].languageModule;
                    this.languageRemark = this.datas[0].languageRemark;
                });
            },
            swLang (i) {
                let d = this.lang.find((res) => {
                    if (res.languageTypeId === i) {
                        return res;
                    }
                });
                return d.languageTypeName
            },
            closeDialog () {
                this.$emit('removeDialog');
            }
        },
        filters: {
            module(i) {
                let data = [window.vm.$t('operation.ty'), window.vm.$t('operation.jyspc'),
                    window.vm.$t('operation.jysh5'), window.vm.$t('operation.jysapp'), window.vm.$t('operation.ht')]
                return data[i-1]
            }
        }
    };
</script>

<style>
    .upPlacard {
        width: 600px;
        padding: 20px;
        background: #fff;
    }
</style>
