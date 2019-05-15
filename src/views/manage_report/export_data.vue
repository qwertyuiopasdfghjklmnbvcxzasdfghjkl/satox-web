<template>
    <Row style="margin-top:10px;">
        <Card>
            <p slot="title">{{$t('nav.dsfdcsj')}}</p>
            <p style="margin-bottom: 20px">
                {{$t('common.cjsj')}}：
                <DatePicker type="datetime" v-model="formData.createdStart" :placeholder="$t('common.kssj')"
                            format="yyyy-MM-dd HH:mm:ss"
                            style="width: 200px"></DatePicker>
                <DatePicker type="datetime" v-model="formData.createdEnd" :placeholder="$t('common.jssj')"
                            format="yyyy-MM-dd HH:mm:ss"
                            style="width: 200px"></DatePicker>
                <Button type="primary" @click="curPage=1;getfindUser()">{{$t('common.cx')}}</Button>
            </p>
            <Table ref="test2" :columns="columns" :data="data"></Table>
            <Page :current="curPage" :total="total" @on-change="changePage"
                  :page-size="size" style="text-align:center;margin-top:20px;"></Page>
        </Card>
    </Row>
</template>

<script>
    import reportApi from '../../api/report';
    import util from '../../libs/util';

    export default {
        data () {
            return {
                curPage: 1,
                total: 0,
                size: 10,
                columns: [
                    {title: 'ID', key: 'statisticsFileId'},
                    {title: this.$t('report.wjm'), key: 'fileName'},
                    {title: this.$t('common.cjsj'), key: 'createdAt'},
                    {
                        title: this.$t('common.cz'), key: 'status',
                        render: (h, params) => {
                            return h('a', {
                                attrs: {
                                    href: util.baseURL+params.row.fileName,
                                    download: params.row.fileName
                                }
                            }, this.$t('report.xz'));
                        }
                    },
                ],
                data: [],
                formData: {
                    createdStart: null,
                    createdEnd: null,
                },
            };
        },
        created () {
            this.getfindUser();
        },
        methods: {
            getfindUser () {
                this.formData.page = this.curPage;
                this.formData.size = this.size;
                let D = JSON.stringify(this.formData)
                let data = JSON.parse(D);
                data.createdStart = data.createdStart ? util.dateToStr(new Date(data.createdStart)) : null;
                data.createdEnd = data.createdEnd ? util.dateToStr(new Date(data.createdEnd)) : null;
                reportApi.getFileList(data, (res, total) => {
                    this.total = total;
                    this.data = res;
                });
            },
            changePage (page) {
                this.curPage = page;
                this.getfindUser();
            }
        }
    };
</script>

<style scoped>

</style>
