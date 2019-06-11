<template>
    <!--<div class="upPlacard">-->
        <Card style="width: 650px">
            <p slot="title">{{vm.$t('common.xg')}}
                <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
            </p>
            <Row style="margin-bottom:20px;">
                <Col span="5">{{vm.$t('operation.zw')}}</Col>
                <Col span="5">{{datas.cn}}</Col>
                <Col span="11">
                    <Input v-model="cn" style="width: 200px"/>
                </Col>
                <Col span="3">
                    <Button @click="tabs('cn')">{{vm.$t('common.xg')}}</Button>
                </Col>
            </Row>
            <Row style="margin-bottom:20px;">
                <Col span="5">{{vm.$t('operation.yw')}}</Col>
                <Col span="5">{{datas.en}}</Col>
                <Col span="11">
                    <Input v-model="en" style="width: 200px"/>
                </Col>
                <Col span="3">
                    <Button @click="tabs('en')">{{vm.$t('common.xg')}}</Button>
                </Col>
            </Row>
            <Row style="margin-bottom:20px;">
                <Col span="5">{{vm.$t('operation.zwft')}}</Col>
                <Col span="5">{{datas.cnzh}}</Col>
                <Col span="11">
                    <Input v-model="cnzh" style="width: 200px"/>
                </Col>
                <Col span="3">
                    <Button @click="tabs('cnzh')">{{vm.$t('common.xg')}}</Button>
                </Col>
            </Row>
            <Row style="margin-bottom:20px;">
                <Col span="5">{{vm.$t('operation.hy')}}</Col>
                <Col span="5">{{datas.korean}}</Col>
                <Col span="11">
                    <Input v-model="korean" style="width: 200px"/>
                </Col>
                <Col span="3">
                    <Button @click="tabs('korean')">{{vm.$t('common.xg')}}</Button>
                </Col>
            </Row>
            <Row style="margin-bottom:20px;">
                <Col span="5">{{vm.$t('operation.ry')}}</Col>
                <Col span="5">{{datas.japanese}}</Col>
                <Col span="11">
                    <Input v-model="japanese" style="width: 200px"/>
                </Col>
                <Col span="3">
                    <Button @click="tabs('japanese')">{{vm.$t('common.xg')}}</Button>
                </Col>
            </Row>
            <Row style="margin-bottom:20px;">
                <Col span="5">{{vm.$t('operation.dy')}}</Col>
                <Col span="5">{{datas.german}}</Col>
                <Col span="11">
                    <Input v-model="german" style="width: 200px"/>
                </Col>
                <Col span="3">
                    <Button @click="tabs('german')">{{vm.$t('common.xg')}}</Button>
                </Col>
            </Row>
            <Row style="margin-bottom:20px;">
                <Col span="5">{{vm.$t('operation.xbyy')}}</Col>
                <Col span="5">{{datas.spanish}}</Col>
                <Col span="11">
                    <Input v-model="spanish" style="width: 200px"/>
                </Col>
                <Col span="3">
                    <Button @click="tabs('spanish')">{{vm.$t('common.xg')}}</Button>
                </Col>
            </Row>
            <Row style="margin-bottom:20px;">
                <Col span="5">{{vm.$t('operation.fy')}}</Col>
                <Col span="5">{{datas.french}}</Col>
                <Col span="11">
                    <Input v-model="french" style="width: 200px"/>
                </Col>
                <Col span="3">
                    <Button @click="tabs('french')">{{vm.$t('common.xg')}}</Button>
                </Col>
            </Row>
            <Row style="margin-bottom:20px;">
                <Col span="5">{{vm.$t('operation.ydly')}}</Col>
                <Col span="5">{{datas.italian}}</Col>
                <Col span="11">
                    <Input v-model="italian" style="width: 200px"/>
                </Col>
                <Col span="3">
                    <Button @click="tabs('italian')">{{vm.$t('common.xg')}}</Button>
                </Col>
            </Row>
            <Row style="margin-bottom:20px;">
                <Col span="5">{{vm.$t('operation.alby')}}</Col>
                <Col span="5">{{datas.arabic}}</Col>
                <Col span="11">
                    <Input v-model="arabic" style="width: 200px"/>
                </Col>
                <Col span="3">
                    <Button @click="tabs('arabic')">{{vm.$t('common.xg')}}</Button>
                </Col>
            </Row>
            <Row style="margin-bottom:20px;">
                <Col span="5">{{vm.$t('operation.sm')}}</Col>
                <Col span="5">{{datas.remark}}</Col>
                <Col span="11">
                    <Input v-model="remark" style="width: 200px"/>
                </Col>
                <Col span="3">
                    <Button @click="tabs('remark')">{{vm.$t('common.xg')}}</Button>
                </Col>
            </Row>

        </Card>
    <!--</div>-->
</template>
<script>
    import extendApi from '../../api/extend';

    export default {
        props: ['item'],
        data () {
            const vm = window.vm;
            return {
                vm: vm,
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
                this.$emit('okCallback');
            },
            tabs (propName) {
                if (!this[propName]) {
                    this.$Message.error({content: this.vm.$t('common.bnwk')});
                    return;
                }
                let data = {
                    publicKey: this.item.publicKey
                };
                data[propName] = this[propName];
                extendApi.updateI18nList(data, (res) => {
                    this.$Message.success({content: this.vm.$t('common.xgcg')});
                    this.datas[propName] = this[propName];
                    this[propName] = '';
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            },
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
