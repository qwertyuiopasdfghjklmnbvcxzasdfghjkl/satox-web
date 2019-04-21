<template>
    <div class="add_order">
        <Card style="width:800px;">
            <p slot="title">
                {{vm.$t('finance.xgxx')}}
                <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
            </p>
            <Row style="border-bottom:1px solid #e9eaec;height:30px; line-height:30px;">
                <Col span="5">{{vm.$t('common.yhm')}}</Col>
                <Col span="10">{{this.datas.username}}</Col>
                <Col span="6"></Col>
            </Row>
            <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:45px; line-height:40px;">
                <Col span="5">{{vm.$t('finance.gjyh')}}</Col>
                <Col span="8">{{this.datas.bankCountryCode}}</Col>
                <Col span="8">
                    <Input v-model="bankCountryCode"/>
                </Col>
                <Col span="3">
                    <Button type="primary" @click="tabs('bankCountryCode')">{{vm.$t('common.bc')}}</Button>
                </Col>
            </Row>
            <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:45px; line-height:40px;">
                <Col span="5">{{vm.$t('finance.yhs')}}</Col>
                <Col span="8">{{this.datas.bankProvince}}</Col>
                <Col span="8">
                    <Input v-model="bankProvince"/>
                </Col>
                <Col span="3">
                    <Button type="primary" @click="tabs('bankProvince')">{{vm.$t('common.bc')}}</Button>
                </Col>
            </Row>
            <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:45px; line-height:40px;">
                <Col span="5">{{vm.$t('finance.yhq')}}}</Col>
                <Col span="8">{{this.datas.bankDistrict}}</Col>
                <Col span="8">
                    <Input v-model="bankDistrict"/>
                </Col>
                <Col span="3">
                    <Button type="primary" @click="tabs('bankDistrict')">{{vm.$t('common.bc')}}</Button>
                </Col>
            </Row>

            <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:45px; line-height:40px;">
                <Col span="5">{{vm.$t('finance.yhbh')}}</Col>
                <Col span="8">{{this.datas.bankCode}}</Col>
                <Col span="8">
                    <Input v-model="bankCode"></Input>
                </Col>
                <Col span="3">
                    <Button type="primary" @click="tabs('bankCode')">{{vm.$t('common.bc')}}</Button>
                </Col>
            </Row>
            <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:45px; line-height:40px;">
                <Col span="5">{{vm.$t('finance.fhmc')}}</Col>
                <Col span="8">{{this.datas.bankBranch}}</Col>
                <Col span="8">
                    <Input v-model="bankBranch"></Input>
                </Col>
                <Col span="3">
                    <Button type="primary" @click="tabs('bankBranch')">{{vm.$t('common.bc')}}</Button>
                </Col>
            </Row>
            <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:45px; line-height:40px;">
                <Col span="5">{{vm.$t('finance.khm')}}</Col>
                <Col span="8">{{this.datas.bankRealname}}</Col>
                <Col span="8">
                    <Input v-model="bankRealname"></Input>
                </Col>
                <Col span="3">
                    <Button type="primary" @click="tabs('bankRealname')">{{vm.$t('common.bc')}}</Button>
                </Col>
            </Row>
            <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:45px; line-height:45px;">
                <Col span="5">{{vm.$t('finance.yhzh')}}</Col>
                <Col span="8">{{this.datas.bankNumber}}
                </Col>
                <Col span="8">
                    <Input v-model="bankNumber"/>
                </Col>
                <Col span="3">
                    <Button type="primary" @click="tabs('bankNumber')">{{vm.$t('common.bc')}}</Button>
                </Col>
            </Row>
        </Card>
    </div>
</template>
<script>
    import finance from '../../../api/finance';

    export default {
        props: ['item'],
        data () {
            var vm = window.vm;
            return {
                vm: vm,
                datas: {
                    bankProvince: null,
                    bankDistrict: null,
                    bankCountryCode: null,
                    bankCode: null,
                    bankBranch: null,
                    bankRealname: null,
                    bankNumber: null
                },
                data: {},
                bankProvince: null,
                bankDistrict: null,
                bankCountryCode: null,
                bankCode: null,
                bankBranch: null,
                bankRealname: null,
                bankNumber: null
            };
        },
        created () {
            this.getSymbolInfo();
        },
        methods: {
            getSymbolInfo () {
                this.datas = this.item;
            },
            closeDialog () {
                this.$emit('removeDialog');
            },
            tabs (propName) {
                if (!this[propName]) {
                    this.$Message.error({content: this.vm.$t('common.bnwk')});
                    return;
                }
                let data = {
                    symbolId: this.item.symbolId,
                    userBankInfoId: this.item.userBankInfoId
                };
                data[propName] = this[propName];
                finance.updateBank(data, (res) => {
                    this.$Message.success({content: this.vm.$t('common.xgcg')});
                    this.$emit('okCallback');
                    let d = JSON.stringify(this[propName]);
                    this.datas[propName] = JSON.parse(d);
                    this[propName] = '';
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            }
        }
    };
</script>
<style lang="less" scoped>
    .add_order {
        .title {
            position: relative;
            height: 30px;
            line-height: 30px;
            background: #2d8cf0;
            color: #fff;
            font-size: 16px;
            text-align: center;

            span {
                font-size: 18px;
                cursor: pointer;
                position: absolute;
                right: 10px;
                top: 2px;
            }
        }

        .ivu-form .ivu-form-item-label {
            color: #000;
            font-size: 13px;
        }

        .ivu-form-item {
            margin-top: 10px;
        }

        .ivu-input {
            width: 88%;
        }

        .ivu-form .ivu-form-item-label {
            padding-left: 10px;
        }

        .ivu-btn-primary {
            display: flex;
            margin: 0 auto;
            margin-bottom: 10px;
        }

        .ivu-form-item {
            margin-bottom: 16px;
        }
    }
</style>
