<template>
    <!--<div class="upPlacard">-->
    <Card style="width: 650px">
        <p slot="title">{{vm.$t('common.xg')}}
            <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
        </p>
        <Row style="margin-bottom:20px;">
            <Col span="5">{{vm.$t('operation.ssmk')}}</Col>
            <Col span="5"></Col>
            <Col span="11">
                <Select v-model="form.languageModule" name="languageModule" style="width: 200px">
                    <Option :value="1">{{vm.$t('operation.ty')}}</Option>
                    <Option :value="2">{{vm.$t('operation.jyspc')}}</Option>
                    <Option :value="3">{{vm.$t('operation.jysh5')}}</Option>
                    <Option :value="4">{{vm.$t('operation.jysapp')}}</Option>
                    <Option :value="5">{{vm.$t('operation.ht')}}</Option>
                </Select>
            </Col>
            <Col span="3">
                <Button @click="tabRemark('languageModule')">{{vm.$t('common.xg')}}</Button>
            </Col>
        </Row>
        <Row v-for="data in datas" style="margin-bottom:20px;">
            <Col span="5">{{swLang(data.languageTypeId)}}</Col>
            <Col span="5">{{data.languageContent}}</Col>
            <Col span="11">
                <Input v-model="form[data.languageTypeId]" style="width: 200px"/>
            </Col>
            <Col span="3">
                <Button @click="tabs(data)">{{vm.$t('common.xg')}}</Button>
            </Col>
        </Row>
        <Row style="margin-bottom:20px;">
            <Col span="5">{{vm.$t('operation.sm')}}</Col>
            <Col span="5">{{item.remark}}</Col>
            <Col span="11">
                <Input v-model="form.languageRemark" style="width: 200px"/>
            </Col>
            <Col span="3">
                <Button @click="tabRemark('languageRemark')">{{vm.$t('common.xg')}}</Button>
            </Col>
        </Row>
    </Card>
    <!--</div>-->
</template>
<script>
    import extendApi from '../../../api/extend';

    export default {
        props: ['item', 'lang'],
        data () {
            const vm = window.vm;
            return {
                vm: vm,
                datas: [],
                form: {}
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
                    this.form.languageModule = Number(this.datas[0].languageModule);
                });
            },
            swLang (i) {
                let d = this.lang.find((res) => {
                    if (res.languageTypeId === i) {
                        return res;
                    }
                });
                return d.languageTypeName;
            },
            closeDialog () {
                this.$emit('removeDialog');
                this.$emit('okCallback');
            },
            tabs (data) {
                if (!this.form[data.languageTypeId]) {
                    this.$Message.error({content: this.vm.$t('common.bnwk')});
                    return;
                }
                let datas = {
                    languageContent: this.form[data.languageTypeId],
                    languageExtId: data.languageExtId
                };
                let id = data.languageTypeId;
                this.updata(datas, id);
            },
            tabRemark (id) {
                let d = id
                if (this.form[id]) {
                    let datas = {
                        languageExtId: this.datas[0].languageExtId
                    };
                    datas[d] = this.form[d];
                    let da = null;
                    d === 'languageRemark' ? da = 'languageRemark' : da = null
                    this.updata(datas, da);
                } else {
                    this.$Message.error({content: this.vm.$t('common.bnwk')});
                }
            },
            updata (datas, id) {
                extendApi.updateI18nList(datas, (res) => {
                    this.$Message.success({content: this.vm.$t('common.xgcg')});
                    this.getDetail();
                    if (id === 'languageRemark') {
                        this.item.remark = this.form.languageRemark;
                    }
                    this.form[id] = '';
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
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
