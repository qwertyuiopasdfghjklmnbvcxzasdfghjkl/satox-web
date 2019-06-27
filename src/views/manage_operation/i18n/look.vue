<template>
    <Card style="width: 650px">
        <p slot="title">{{vm.$t('kyc.ckxq')}}
            <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
        </p>
        <Row v-for="data in datas" style="margin-bottom:20px;">
            <Col span="4">{{swLang(data.languageTypeId)}}</Col>
            <Col span="20">{{data.languageContent || '—'}}</Col>
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
                datas: null
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
