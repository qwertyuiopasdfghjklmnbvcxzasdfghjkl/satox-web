<style scoped>
    .expand-row {
        margin-bottom: 16px;
    }
</style>
<template>
    <div>
        <Table :columns="columns12" :data="data12"></Table>
        <!-- <Page :current="curPage" :total="total" @on-change="changePage" style="text-align:center;margin-top:20px;"></Page>   -->
    </div>
</template>
<script>
    import monitorApi from '../../api/monitoring';
    import errorLogDetail from './errorLogDetail';
    import util from '../../libs/util';

    export default {
        props: {
            row: Object
        },
        data () {
            return {
                // curPage: 1,
                // total: 0,
                columns12: [
                    {
                        title: this.$t('monitoring.cwid'),
                        key: 'errorLogId'
                    },
                    {
                        title: this.$t('monitoring.cwyy'),
                        key: 'app'
                    },
                    {
                        title: this.$t('monitoring.cwmk'),
                        key: 'module'
                    },
                    {
                        title: this.$t('finance.txsqid'),
                        key: 'businessId'
                    },
                    {
                        title: this.$t('monitoring.cwlb'),
                        key: 'errorType'
                    },
                    {
                        title: this.$t('monitoring.cwjs'),
                        key: 'errorSketch',
                        width: 300
                    },
                    {
                        title: this.$t('monitoring.cwxq'),
                        key: 'errorDetails',
                        render: (h, params) => {
                            return h('div', [
                                params.row.hasDetails === 0 ? '' : h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    style: {marginRight: '10px'},
                                    on: {
                                        click: () => {
                                            util.setDialog(errorLogDetail, {
                                                errorLogId: params.row.errorLogId
                                            });

                                        }
                                    }
                                }, this.$t('monitoring.ckxqlj'))
                            ]);
                        }
                    },
                    {
                        title: this.$t('monitoring.cs'),
                        key: 'params',
                        width: 300
                    },
                    {
                        title: this.$t('monitoring.cscwdlj'),
                        key: 'path'
                    },
                    {
                        title: this.$t('common.cjsj'),
                        key: 'createdTime'
                    }
                ],
                data12: []
            };
        },
        created () {
            this.getErrorLogList();
        },
        methods: {
            getErrorLogList () {
                monitorApi.findErrorLogList({
                    businessId: this.row.withdrawApplyId
                }, (res) => {
                    // this.total = total
                    this.data12 = res;
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            },
            changePage (page) {
                this.curPage = page;
                this.getErrorLogList();
            }
        }
    };
</script>
