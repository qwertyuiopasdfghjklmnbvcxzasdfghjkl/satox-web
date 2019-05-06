<!-- OTC异常预警 -->
<template>
    <div>
        <Card>
            <p slot="title">{{$t('risk.otcycyj')}}
                <span class="refresh" @click="reshAll"></span>
            </p>
            <Row>
                <Col span="12">{{$t('risk.dclycyjs')}}：{{this.data2.waitHandleAmount}}</Col>
                <Col span="12">{{$t('risk.rxzyjs')}}：{{this.data2.dailyIncreaseAmount}}</Col>
            </Row>
            <Checkbox v-model="single" @on-change="curPage=1;getAbnormalInfo1()">{{$t('risk.xssyyc')}}</Checkbox>
            <Table :columns="columns1" :data="data1"></Table>
            <Page :current="curPage" :total="total" @on-change="changePage"
                  style="text-align:center;margin-top:20px;"></Page>
        </Card>
    </div>
</template>

<script>
    import util from '../../libs/util';
    import otcApi from '../../api/otcAberrant';
    import detail from './detail';

    export default {
        data () {
            return {
                curPage: 1,
                total: 0,
                single: false,
                columns1: [
                    {
                        title: this.$t('risk.ycbh'),
                        key: 'abnormalNumber'
                    },
                    {
                        title: this.$t('risk.ycyy'),
                        key: 'abnormalReason'
                    },
                    {
                        title: this.$t('risk.ddbh'),
                        key: 'orderNumber'
                    },
                    {
                        title: this.$t('common.bz'),
                        key: 'symbol'
                    },
                    {
                        title: this.$t('common.je'),
                        key: 'currencyAmount',
                        render: (h, params) => {
                            return h('div', [params.row.currencyAmount, 'CNY']);
                        }
                    },
                    {
                        title: this.$t('risk.cssj'),
                        key: 'surplus_Time',
                        render: (h, params) => {
                            return h('div', (params.row.surplus_Time));
                        }
                    },
                    {
                        title: this.$t('risk.ddsj'),
                        key: 'orderTime'
                    },
                    {
                        title: this.$t('common.zt'),//0,未处理， 2:已忽略
                        key: 'status',
                        render: (h, params) => {
                            return h('div', params.row.status === 0 ? this.$t('risk.wcl') : this.$t('risk.yhn'));
                        }
                    },
                    {
                        title: this.$t('common.cz'),
                        key: 'opreat',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    style: {marginRight: '10px'},
                                    on: {
                                        click: () => {
                                            util.setDialog(detail, {
                                                orderId: params.row.orderId
                                            });
                                            // otcApi.findOtcOrderInfo({
                                            //     orderNumber: params.row.orderNumber
                                            // }, (res) => {
                                            //     this.$Message.success({content: '成功'})
                                            // })
                                        }
                                    }
                                }, this.$t('risk.ckddxq')),
                                h('Button', {
                                    props: {type: 'primary', size: 'small', disabled: params.row.status === 1},
                                    style: {marginRight: '10px'},
                                    on: {
                                        click: () => {
                                            otcApi.handleAbnormal({
                                                abnormalId: params.row.abnormalId
                                            }, (res) => {
                                                this.$Message.success({content: this.$t('risk.ycl')});
                                                this.getAbnormalInfo1();
                                            });
                                        }
                                    }
                                }, this.$t('risk.cl'))
                            ]);
                        }
                    }
                ],
                data1: [],
                data2: []
            };
        },
        created () {
            this.getAbnormalInfo1();
            this.getList();
        },
        methods: {
            reshAll () {
                this.getAbnormalInfo1();
                this.getList();
            },
            getList () {
                otcApi.abnormalInfo((res) => {
                    this.data2 = res.data;
                });
            },
            getAbnormalInfo1 () {
                if (this.single) {
                    otcApi.findOtcAbnormalInfo(this.curPage, {
                        displayAll: true
                    }, (res, total) => {
                        res.forEach((item, index) => {
                            if (item.orderPayTime !== null) {
                                let date = util.formatDate(item.orderPayTime).getTime();
                                let ndate = util.formatDate(item.systemDate).getTime();
                                var diffTime = Math.floor((ndate - date) / 1000);
                                var minutes = Math.floor(diffTime / 60);
                                var day = Math.floor((minutes / 60) / 24);
                                var hour = Math.floor(diffTime / 60) - Math.floor(day * 24 * 60);
                                item.surplus_Time = day + this.$t('common.t') + Math.floor(hour / 60) + this.$t('common.shi')
                                    + minutes % 60 + this.$t('common.fen') + diffTime % 60 + this.$t('common.m');
                                // item.surplus_Time = Math.floor(minutes/60) + '时' + minutes%60 + '分' + diffTime%60 + '秒'
                            } else {
                                item.surplus_Time = this.$t('common.lslflm');
                            }

                        });
                        this.total = total;
                        this.data1 = res;
                    });
                } else {
                    otcApi.findOtcAbnormalInfo(this.curPage, {
                        displayAll: false
                    }, (res, total) => {
                        res.forEach((item, index) => {
                            if (item.orderPayTime !== null) {
                                let date = util.formatDate(item.orderPayTime).getTime();
                                let ndate = util.formatDate(item.systemDate).getTime();
                                var diffTime = Math.floor((ndate - date) / 1000);
                                var minutes = Math.floor(diffTime / 60);
                                var day = Math.floor((minutes / 60) / 24);
                                var hour = Math.floor(diffTime / 60) - Math.floor(day * 24 * 60);
                                item.surplus_Time = day + this.$t('common.t') + Math.floor(hour / 60) + this.$t('common.shi')
                                    + minutes % 60 + this.$t('common.fen') + diffTime % 60 + this.$t('common.m');
                            } else {
                                item.surplus_Time = this.$t('common.lslflm');
                            }

                        });
                        this.total = total;
                        this.data1 = res;
                    });
                }
            },
            //   getAbnormalInfo () {
            //       otcApi.findOtcAbnormalInfo(this.curPage, {
            //           displayAll: false
            //       },(res, total) => {
            //            res.forEach((item, index) => {
            //                 if (item.orderPayTime !== null) {
            //                     let date = util.formatDate(item.orderPayTime).getTime()
            //                     let ndate = util.formatDate(item.systemDate).getTime()
            //                     var diffTime = Math.floor((ndate - date) / 1000)
            //                     var minutes = Math.floor(diffTime/60)
            //                     var day = Math.floor((minutes/60)/24)
            //                     var hour = Math.floor(diffTime/60) - Math.floor(day * 24 * 60)
            //                     item.surplus_Time = day + '天' + Math.floor(hour/60) + '时' + minutes%60 + '分' + diffTime%60 + '秒'
            //                 } else {
            //                     item.surplus_Time = '0天0时0分0秒'
            //                 }

            //             })
            //           this.total = total
            //           this.data1 = res
            //       })
            //   },
            changePage (page) {
                if (this.single) {
                    this.curPage = page;
                    this.getAbnormalInfo1();
                    return;
                }
                this.curPage = page;
                this.getAbnormalInfo1();
            },
            //
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
