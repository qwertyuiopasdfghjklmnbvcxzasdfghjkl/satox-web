<template>
        <Card style="width: 650px">
            <p slot="title">{{vm.$t('kyc.ckxq')}}
                <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
            </p>
            <Row style="margin-bottom:20px;">
                <Col span="4">{{vm.$t('operation.zw')}}</Col>
                <Col span="20">{{datas.cn || '—'}}</Col>
            </Row>
            <Row style="margin-bottom:20px;">
                <Col span="4">{{vm.$t('operation.yw')}}</Col>
                <Col span="20">{{datas.en || '—'}}</Col>
            </Row>
            <Row style="margin-bottom:20px;">
                <Col span="4">{{vm.$t('operation.zwft')}}</Col>
                <Col span="20">{{datas.cnzh || '—'}}</Col>
            </Row>
            <Row style="margin-bottom:20px;">
                <Col span="4">{{vm.$t('operation.hy')}}</Col>
                <Col span="20">{{datas.korean || '—'}}</Col>
            </Row>
            <Row style="margin-bottom:20px;">
                <Col span="4">{{vm.$t('operation.ry')}}</Col>
                <Col span="20">{{datas.japanese || '—'}}</Col>
            </Row>
            <Row style="margin-bottom:20px;">
                <Col span="4">{{vm.$t('operation.dy')}}</Col>
                <Col span="20">{{datas.german || '—'}}</Col>
            </Row>
            <Row style="margin-bottom:20px;">
                <Col span="4">{{vm.$t('operation.xbyy')}}</Col>
                <Col span="20">{{datas.spanish || '—'}}</Col>
            </Row>
            <Row style="margin-bottom:20px;">
                <Col span="4">{{vm.$t('operation.fy')}}</Col>
                <Col span="20">{{datas.french || '—'}}</Col>
            </Row>
            <Row style="margin-bottom:20px;">
                <Col span="4">{{vm.$t('operation.ydly')}}</Col>
                <Col span="20">{{datas.italian || '—'}}</Col>
            </Row>
            <Row style="margin-bottom:20px;">
                <Col span="4">{{vm.$t('operation.alby')}}</Col>
                <Col span="20">{{datas.arabic || '—'}}</Col>
            </Row>
            <Row style="margin-bottom:20px;">
                <Col span="4">{{vm.$t('operation.sm')}}</Col>
                <Col span="20">{{datas.remark || '—'}}</Col>
            </Row>
        </Card>
</template>
<script>

    export default {
        props: ['item'],
        data () {
            const vm = window.vm;
            return {
                vm: vm,
                datas: {
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
                }
            };
        },
        created () {
            this.datas = this.item;
        },
        methods: {
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
