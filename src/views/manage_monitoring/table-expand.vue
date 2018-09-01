<style scoped>
    .expand-row{
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
import monitorApi from '../../api/monitoring'
import errorLogDetail from './errorLogDetail'
import util from '../../libs/util'
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
                        title: '错误id',
                        key: 'errorLogId'
                    },
                    {
                        title: '错误应用',
                        key: 'app'
                    },
                    {
                        title: '错误模块',
                        key: 'module'
                    },
                    {
                        title: '提现申请ID',
                        key: 'businessId'
                    },
                    {
                        title: '错误类别',
                        key: 'errorType'
                    },
                    {
                        title: '错误简述',
                        key: 'errorSketch',
                         width: 300
                    },
                    {
                        title: '错误详情',
                        key: 'errorDetails',
                        render: (h, params) => {
                            return h('div', [
                                params.row.hasDetails===0?'':h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    style: {marginRight: '10px'},
                                    on: {   
                                        click: () => {
                                            util.setDialog(errorLogDetail, {
                                                errorLogId: params.row.errorLogId
                                            })
                                            
                                        }
                                    }
                                }, '查看详情链接')
                            ]);
                        }
                    },
                    {
                        title: '参数',
                        key: 'params',
                        width: 300
                    },
                    {
                        title: '产生错误的路径',
                        key: 'path'
                    },
                    {
                        title: '创建时间',
                        key: 'createdTime'
                    }
                ],
                data12: []
            }
        },
        created () {
            this.getErrorLogList()
        },
        methods: {
            getErrorLogList () {
                monitorApi.findErrorLogList( {
                    businessId: this.row.withdrawApplyId
                }, (res) => {
                    // this.total = total
                    this.data12 = res
                }, (msg) => {
                     this.$Message.error({content: msg})
                })
            },
            changePage (page) {
                this.curPage = page
                this.getErrorLogList()
            }
        }
    };
</script>