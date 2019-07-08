<!-- 商品管理 -->
<template>
    <Row>
        <Col span="24">
            <Row>
                <Card style="margin-top:10px;">
                    <p slot="title">{{$t('nav.xmgl')}}
                        <!--<span class="refresh" @click="reshAll"></span>-->
                    </p>
                    <p style="margin-bottom: 20px">
                        {{$t('common.bzdh')}}：
                        <Input v-model="formData.projectSymbol" clearable style="width: 200px"
                               :placeholder="$t('common.bzdh')"></Input>
                        {{$t('common.zt')}}：
                        <Select v-model="formData.state" style="width: 200px">
                            <Option :value="5">{{$t('common.qb')}}</Option>
                            <Option :value="0">{{$t('exchange.xs')}}</Option>
                            <Option :value="1">{{$t('ieo.jjks')}}</Option>
                            <Option :value="2">{{$t('ieo.jxz')}}</Option>
                            <Option :value="3">{{$t('ieo.yjs')}}</Option>
                            <Option :value="4">{{$t('ieo.fbwc')}}</Option>
                        </Select>
                        <Button type="primary" @click="curPage=1;getList()">{{$t('common.cx')}}</Button>
                    </p>
                    <Table :columns="columns" :data="datas"></Table>
                    <Page :current="curPage" :total="total" @on-change="changePage" :page-size="size"
                          style="text-align:center;margin-top:20px;"></Page>
                </Card>
            </Row>
        </Col>
    </Row>
</template>

<script>
    import util from '../../libs/util';
    import updata from './ieo_project/updata';
    import details from './ieo_project/details';
    import updataState from './ieo_project/updataState';
    import confirm from './ieo_project/confirm';
    import ieoApi from '../../api/ieo';

    export default {
        data () {
            return {
                curPage: 1,
                total: 0,
                size: 10,
                columns: [
                    {key: 'projectId', title: this.$t('ieo.xmbh')},
                    {key: 'projectName', title: this.$t('ieo.xmmc')},
                    {key: 'projectSymbol', title: this.$t('common.bzdh')},
                    {key: 'totalIssue', title: this.$t('ieo.fxsl')},
                    {key: 'issuePrice', title: this.$t('ieo.fxjg')},
                    {key: 'totalRaised', title: this.$t('ieo.mjmb')},
                    {key: 'startTime', title: this.$t('common.kssj')},
                    {key: 'endTime', title: this.$t('common.jssj')},
                    {key: 'paidTime', title: this.$t('ieo.kksj')},
                    {key: 'releaseTime', title: this.$t('ieo.fbsj')},
                    {
                        key: 'state', title: this.$t('common.zt'),
                        render: (h, params) => {
                            return h('div', {
                                style: {
                                    color: this.switchColor(params.row.state)
                                }
                            }, this.switchStaus(params.row.state));
                        }
                    },
                    {key: 'totalSubscription', title: this.$t('ieo.zfs')},
                    {key: 'remainingQuantity', title: this.$t('ieo.syfs')},
                    {key: 'updatedAt', title: this.$t('common.gxsj')},
                    {
                        key: 'action', title: this.$t('common.cz'), render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    style: {margin: '3px'},
                                    on: {
                                        click: () => {
                                            util.setDialog(details, {
                                                item: params.row,
                                            });
                                        }
                                    }
                                }, this.$t('kyc.ckxq')),
                                h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    style: {margin: '3px'},
                                    on: {
                                        click: () => {
                                            util.setDialog(updata, {
                                                item: params.row,
                                                okCallback: () => {
                                                    this.getList();
                                                }
                                            });
                                        }
                                    }
                                }, this.$t('ieo.xgsx')),
                                h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    style: {margin: '3px'},
                                    on: {
                                        click: () => {
                                            util.setDialog(updataState, {
                                                item: params.row,
                                                okCallback: () => {
                                                    this.getList();
                                                }
                                            });
                                        }
                                    }
                                }, this.$t('ieo.ztxg')),
                                h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    style: {margin: '3px'},
                                    on: {
                                        click: () => {
                                            util.setDialog(confirm, {
                                                item: params.row,
                                                name: 1,
                                                okCallback: () => {
                                                    this.getList();
                                                }
                                            });
                                        }
                                    }
                                }, this.$t('ieo.kkfb')),
                                h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    style: {margin: '3px'},
                                    on: {
                                        click: () => {
                                            util.setDialog(confirm, {
                                                item: params.row,
                                                name: 2,
                                                okCallback: () => {
                                                    this.getList();
                                                }
                                            });
                                        }
                                    }
                                }, this.$t('ieo.sbjd'))
                            ]);
                        }
                    }
                ],
                datas: [],
                formData: {
                    projectSymbol: null,
                    state: 5,
                },
            };
        },
        created () {
            this.getList();
        },
        methods: {
            switchStaus (state) {//0：下线，1：即将开始，2：进行中，3：已结束，4：发币完成
                switch (state) {
                    case 0:
                        return this.$t('exchange.xs');
                    case 1:
                        return this.$t('ieo.jjks');
                    case 2:
                        return this.$t('ieo.jxz');
                    case 3:
                        return this.$t('ieo.yjs');
                    case 4:
                        return this.$t('ieo.fbwc');
                }
            },
            switchColor (i) {
                switch (i) {
                    case 0:
                        return '#f3b138';
                    case 1:
                        return '#6ff35b';
                    case 2:
                        return '#3ba5f3';
                    case 3:
                        return '#5a60f3';
                    case 4:
                        return '#0a5ff3';
                    case 5:
                        return '#d14af3';
                }
            },
            getList () {
                let D = JSON.stringify(this.formData);
                let data = JSON.parse(D);
                data.state = data.state === 5 ? null : data.state;
                data.size = this.size;
                data.page = this.curPage;
                ieoApi.projectList(data, (res, total) => {
                    this.total = total;
                    this.datas = res;
                });
            },
            switch (i) {
                switch (i) {
                    case '1':
                        this.formData.min = null;
                        this.formData.max = 1;
                        break;
                    case '2':
                        this.formData.max = 1000;
                        this.formData.min = 1;
                        break;
                    case '3':
                        this.formData.max = 10000;
                        this.formData.min = 1000;
                        break;
                    case '4':
                        this.formData.min = 10000;
                        this.formData.max = null;
                        break;
                    case '0':
                        this.formData.max = null;
                        this.formData.min = null;
                        break;
                    default:
                        this.formData.max = null;
                        this.formData.min = null;
                }
            },
            changePage (page) {
                this.curPage = page;
                this.getList();
            }
        }
    };
</script>

<style lang="less" scoped>
    .refresh {
        width: 49px;
        height: 24px;
        background: url(../../images/frsh.png) center/cover no-repeat;
        background-size: contain;
        cursor: pointer;
        color: #2d8cf0;
    }

    .ivu-card-head-inner, .ivu-card-head p {
        display: flex !important;
        justify-content: space-between !important;
        height: 40px !important;
        line-height: 40px !important;
    }
</style>
