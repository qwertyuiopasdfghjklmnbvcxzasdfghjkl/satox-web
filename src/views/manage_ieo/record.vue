<!--  -->
<template>
    <Row>
        <Col span="24">
            <Row>
                <Card style="margin-top:10px;">
                    <p slot="title">{{$t('nav.sgjl')}}
                        <!--<span class="refresh" @click="reshAll"></span>-->
                    </p>
                    <p style="margin-bottom: 20px">
                        {{$t('ieo.xmmc')}}：
                        <Input v-model="formData.projectName" clearable style="width: 200px"
                               :placeholder="$t('common.bzdh')"></Input>
                        {{$t('common.yhm')}}：
                        <Input v-model="formData.username" clearable style="width: 200px"
                               :placeholder="$t('common.bzdh')"></Input>
                        {{$t('ieo.rgsj')}}：
                        <DatePicker type="datetime" v-model="formData.startTime" :placeholder="$t('common.kssj')"
                                    format="yyyy-MM-dd HH:mm:ss"
                                    style="width: 160px"></DatePicker>
                        <DatePicker type="datetime" v-model="formData.endTime" :placeholder="$t('common.jssj')"
                                    format="yyyy-MM-dd HH:mm:ss"
                                    style="width: 160px"></DatePicker>
                        {{$t('common.zt')}}：
                        <Select v-model="formData.state" style="width: 200px">
                            <Option :value="0">{{$t('common.qb')}}</Option>
                            <Option :value="1">{{$t('ieo.yqr')}}</Option>
                            <Option :value="2">{{$t('ieo.kkbcg')}}</Option>
                            <Option :value="3">{{$t('ieo.kkcg')}}</Option>
                            <Option :value="4">{{$t('ieo.ffbcg')}}</Option>
                            <Option :value="5">{{$t('ieo.ffcg')}}</Option>
                            <Option :value="6">{{$t('ieo.rgsb')}}</Option>
                            <Option :value="7">{{$t('ieo.rgcg')}}</Option>
                        </Select>
                        {{$t('ieo.dfbz')}}：
                        <Input v-model="formData.subscriptionSymbol" clearable style="width: 200px"
                               :placeholder="$t('common.bzdh')"></Input>
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
    import updataState from './record/updataState';
    import ieoApi from '../../api/ieo';

    export default {
        data () {
            return {
                curPage: 1,
                total: 0,
                size: 15,
                columns: [
                    {key: 'projectName', title: this.$t('ieo.xmmc')},
                    {key: 'projectSymbol', title: this.$t('common.bzdh')},
                    {key: 'username', title: this.$t('common.yhm')},
                    {key: 'applyQuantity', title: this.$t('ieo.rgfs')},
                    {key: 'gainQuantity', title: this.$t('ieo.hdfs')},
                    {key: 'gainSymbolQuantity', title: this.$t('ieo.hddb')},
                    {key: 'subscriptionSymbol', title: this.$t('ieo.dfbz')},
                    {key: 'subscriptionAmount', title: this.$t('ieo.fkbzsl')},
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
                    {key: 'createdAt', title: this.$t('ieo.rgsj')},
                    {
                        key: 'action', title: this.$t('common.cz'), render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    style: {margin: '3px'},
                                    on: {
                                        click: () => {
                                            util.setDialog(updataState, {
                                                item: params.row,
                                                okCallback: () => {
                                                    this.getList()
                                                }
                                            });
                                        }
                                    }
                                }, this.$t('ieo.ztxg')),
                            ]);
                        }
                    }
                ],
                datas: [],
                formData: {
                    projectName: null,
                    username: null,
                    state: 0,
                    subscriptionSymbol: null,
                },
            };
        },
        created () {
            this.getList();
        },
        methods: {
            switchStaus (state) {//1、已确认 2、扣款不成功 3、扣款成功 4、发放不成功 5、发放成功 6、认购失败 7、认购成功 ,
                switch (state) {
                    case 1:
                        return this.$t('ieo.yqr');
                    case 2:
                        return this.$t('ieo.kkbcg');
                    case 3:
                        return this.$t('ieo.kkcg');
                    case 4:
                        return this.$t('ieo.ffbcg');
                    case 5:
                        return this.$t('ieo.ffcg');
                    case 6:
                        return this.$t('ieo.rgsb');
                    case 7:
                        return this.$t('ieo.rgcg');
                }
            },
            switchColor (i) {
                switch (i) {
                    case 1:
                        return '#6ff35b';
                    case 2:
                        return '#f36b90';
                    case 3:
                        return '#5a60f3';
                    case 4:
                        return '#f35a5c';
                    case 5:
                        return '#4093f3';
                    case 6:
                        return '#f33f7a';
                    case 7:
                        return '#4e7bf3';
                }
            },
            getList () {
                let D = JSON.stringify(this.formData);
                let data = JSON.parse(D);
                data.startTime = data.startTime ? util.dateToStr(new Date(data.startTime)) : null;
                data.endTime = data.endTime ? util.dateToStr(new Date(data.endTime)) : null;
                data.state = data.state === 0 ? null : data.state;
                data.size = this.size;
                data.page = this.curPage;
                ieoApi.subscriptionList(data,
                    (res, total) => {
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
