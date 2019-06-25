<template>
    <!--<div class="upPlacard">-->
        <Card style="width: 650px">
            <p slot="title">{{vm.$t('common.xg')}}
                <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
            </p>
            <Row style="margin-bottom:20px;">
                <Col span="5">{{vm.$t('operation.yymczw')}}</Col>
                <Col span="5">{{datas.cn}}</Col>
                <Col span="11">
                    <Input v-model="cn" style="width: 200px"/>
                </Col>
                <Col span="3">
                    <Button @click="tabs('cn')">{{vm.$t('common.xg')}}</Button>
                </Col>
            </Row>
            <Row style="margin-bottom:20px;">
                <Col span="5">{{vm.$t('operation.yyzs')}}</Col>
                <Col span="5">{{datas.en}}</Col>
                <Col span="11">
                    <Input v-model="en" style="width: 200px"/>
                </Col>
                <Col span="3">
                    <Button @click="tabs('en')">{{vm.$t('common.xg')}}</Button>
                </Col>
            </Row>
        </Card>
    <!--</div>-->
</template>
<script>
    import extendApi from '../../../api/extend';

    export default {
        props: ['item'],
        data () {
            const vm = window.vm;
            return {
                vm: vm,
                cn: null,
                en: null,
                datas: {
                    cn: null,
                    en: null,
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
