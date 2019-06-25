<template>
    <div class="upPlacard">
        <Card>
            <p slot="title">{{vm.$t('operation.xggg')}}
                <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
            </p>
            <Row style="margin-bottom:20px;">
                <Col span="5">{{vm.$t('operation.zssx')}}</Col>
                <Col span="5">{{datas.sequence}}</Col>
                <Col span="11">
                    <InputNumber style="width:200px;" v-model="sequence"></InputNumber>
                </Col>
                <Col span="3">
                    <Button @click="tabs2('sequence')">{{vm.$t('common.xg')}}</Button>
                </Col>
            </Row>
            <Row style="margin-bottom:20px;">
                <Col span="5">{{vm.$t('operation.jtggbt')}}</Col>
                <Col span="5">{{datas.title}}</Col>
                <Col span="11">
                    <Input v-model="title" style="width: 200px"/>
                    <!-- <InputNumber style="width:100%;" v-model="formLeft.title" name="title"></InputNumber> -->
                </Col>
                <Col span="3">
                    <Button @click="tabs2('title')">{{vm.$t('common.xg')}}</Button>
                </Col>
            </Row>
            <Row style="margin-bottom:20px;">
                <Col span="5">{{vm.$t('operation.jtgglj')}}</Col>
                <Col span="5">{{datas.link}}</Col>
                <Col span="11">
                    <Input v-model="link" style="width: 200px"/>
                </Col>
                <Col span="3">
                    <Button @click="tabsLink('link')">{{vm.$t('common.xg')}}</Button>
                </Col>
            </Row>
            <Row style="margin-bottom:20px;">
                <Col span="5">{{vm.$t('operation.ywggbt')}}</Col>
                <Col span="5">{{datas.titleEn}}</Col>
                <Col span="11">
                    <Input v-model="titleEn" style="width: 200px"/>
                </Col>
                <Col span="3">
                    <Button @click="tabs2('titleEn')">{{vm.$t('common.xg')}}</Button>
                </Col>
            </Row>
            <Row style="margin-bottom:20px;">
                <Col span="5">{{vm.$t('operation.ywgglj')}}</Col>
                <Col span="5">{{datas.linkEn}}</Col>
                <Col span="11">
                    <Input v-model="linkEn" style="width: 200px"/>
                </Col>
                <Col span="3">
                    <Button @click="tabsLink('linkEn')">{{vm.$t('common.xg')}}</Button>
                </Col>
            </Row>
            <Row style="margin-bottom:20px;">
                <Col span="5">{{vm.$t('operation.ftggbt')}}</Col>
                <Col span="5">{{datas.titleCht}}</Col>
                <Col span="11">
                    <Input v-model="titleCht" style="width: 200px"/>
                </Col>
                <Col span="3">
                    <Button @click="tabs2('titleCht')">{{vm.$t('common.xg')}}</Button>
                </Col>
            </Row>
            <Row style="margin-bottom:20px;">
                <Col span="5">{{vm.$t('operation.ftgglj')}}</Col>
                <Col span="5">{{datas.linkCht}}</Col>
                <Col span="11">
                    <Input v-model="linkCht" style="width: 200px"/>
                </Col>
                <Col span="3">
                    <Button @click="tabsLink('linkCht')">{{vm.$t('common.xg')}}</Button>
                </Col>
            </Row>
            <Row style="margin-bottom:20px;">
                <Col span="5">{{vm.$t('common.zt')}}</Col>
                <!--<Col span="5">{{datas.displayStatus}}</Col>-->
                <Col span="11">
                    <!--<Input v-model="displayStatus" style="width: 200px" />-->
                    <RadioGroup v-model="displayStatus">
                        <Radio label="0">{{vm.$t('operation.bzs')}}</Radio>
                        <Radio label="1">{{vm.$t('operation.zs')}}</Radio>
                    </RadioGroup>
                </Col>
                <Col span="3">
                    <Button @click="tabs2('displayStatus')">{{vm.$t('common.xg')}}</Button>
                </Col>
            </Row>
        </Card>
    </div>
</template>
<script>
    import extendApi from '../../../api/extend';

    export default {
        props: ['item'],
        data () {
            const vm = window.vm;
            return {
                vm: vm,
                sequence: null,
                title: '',
                link: '',
                titleEn: '',
                linkEn: '',
                titleCht: '',
                linkCht: '',
                displayStatus: this.item.displayStatus,
                datas: {
                    sequence: null,
                    title: '',
                    link: '',
                    titleEn: '',
                    linkEn: '',
                    titleCht: '',
                    linkCht: ''
                }
            };
        },
        created () {
            this.detail();
        },
        methods: {
            closeDialog () {
                this.$emit('removeDialog');
            },
            detail () {
                extendApi.findDetail({
                    announcementId: this.item.announcementId
                }, (res) => {
                    this.datas = [res][0][0];
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            },
            tabs2 (propName) {
                if (!this[propName]) {
                    this.$Message.error({content: this.swithType(propName) + this.vm.$t('common.bnwk')});
                    return;
                }
                let data = {
                    announcementId: this.item.announcementId,
                    version: this.item.version
                };
                data[propName] = this[propName];
                extendApi.updateAnnouncement(data, (res) => {
                    this.detail();
                    this.$Message.success({content: this.vm.$t('common.xgcg')});
                    if (propName !== 'displayStatus') {
                        this[propName] = '';
                    }
                    this.$emit('okCallback');
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            },
            tabsLink (propName) {
                if (!this[propName]) {
                    this.$Message.error({content: this.swithType(propName) + this.vm.$t('common.bnwk')});
                    return;
                }
                let reg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
                if (reg.test(this[propName]) === false) {
                    this.$Message.error({content: this.vm.$t('operation.qsryhttpktwz')});
                } else {
                    let data = {
                        announcementId: this.item.announcementId,
                        version: this.item.version
                    };
                    data[propName] = this[propName];
                    extendApi.updateAnnouncement(data, (res) => {
                        this.detail();
                        this.$Message.success({content: this.vm.$t('common.xgcg')});
                        this[propName] = '';
                    }, (msg) => {
                        this.$Message.error({content: msg});
                    });
                }
            },
            swithType (type) {
                switch (type) {
                    case 'sequence':
                        return this.vm.$t('operation.zssx');
                        break;
                    case 'title':
                        return this.vm.$t('operation.jtggbt');
                        break;
                    case 'link':
                        return this.vm.$t('operation.jtgglj');
                        break;
                    case 'titleEn':
                        return this.vm.$t('operation.ywggbt');
                        break;
                    case 'linkEn':
                        return this.vm.$t('operation.ywgglj');
                        break;
                    case 'titleCht':
                        return this.vm.$t('operation.ftggbt');
                        break;
                    case 'linkCht':
                        return this.vm.$t('operation.ftgglj');
                        break;
                }
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
