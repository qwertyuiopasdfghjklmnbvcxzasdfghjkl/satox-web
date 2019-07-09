<template>
    <Row>
        <Card>
            <p slot="title">
                USSD{{$t('finance.yhkxxjlgl')}}
                <span class="refresh" @click="getList"></span>
            </p>
            <Row>
                <Col span="16">
                    {{$t('common.yhm')}}：
                    <Input v-model="formData.text" clearable style="width: 200px"></Input>
                    <Button type="primary" @click="getList(true)">{{$t('common.cx')}}</Button>
                </Col>
                <Col span="8">
                    <Button type="primary" style="float:right;" @click="addDialog">{{$t('finance.xzjl')}}</Button>
                </Col>
            </Row>
            <Table :columns="columns1" :data="data1" style="margin-top:10px;"></Table>
            <Page :current="curPage" :total="total" @on-change="changePage" :page-size="size"
                  style="text-align:center;margin-top:20px;"></Page>
        </Card>
    </Row>
</template>

<script>
    import finance from '../../api/finance';
    // import kyc from '../../api/kyc';
    import util from '../../libs/util';
    import dialogBank from './components/dialog_bank';
    import updataBank from './components/updata_bank';

    export default {
        data () {
            return {
                curPage: 1,
                total: 0,
                size: 10,
                formData: {
                    type: 'username',
                    text: ''
                },
                columns1: [
                    {title: this.$t('common.idh'), key: 'userId'},
                    {title: this.$t('common.yhm'), key: 'username'},
                    {title: this.$t('finance.gjyh'), key: 'bankCountryCode'},
                    {title: this.$t('finance.yhs'), key: 'bankProvince'},
                    {title: this.$t('finance.yhq'), key: 'bankDistrict'},
                    {title: this.$t('finance.yhbh'), key: 'bankCode'},
                    {title: this.$t('finance.fhmc'), key: 'bankBranch'},
                    {title: this.$t('finance.khm'), key: 'bankRealname'},
                    {title: this.$t('finance.yhzh'), key: 'bankNumber'},
                    {title: this.$t('common.cjsj'), key: 'createdAt'},
                    {
                        title: this.$t('common.cz'),
                        key: 'address',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    on: {
                                        click: () => {
                                            util.setDialog(updataBank, {
                                                item: params.row,
                                                okCallback: () => {
                                                    this.getList();
                                                }
                                            });
                                        }
                                    }
                                }, this.$t('common.xg'))
                            ]);
                        }
                    }
                ],
                data1: []
            };
        },
        created () {
            this.getList();
        },
        methods: {
            getList (key) {
                // if (key) {
                //     this.curPage = 1;
                // }
                let data = {
                    page: this.curPage,
                    size: this.size
                };
                if (this.formData.text) {
                    data[this.formData.type] = this.formData.text;
                }
                finance.selectPageUsdsBanks(data, (res, total) => {
                    this.total = total;
                    this.data1 = res;
                });
            },
            addDialog () {
                util.setDialog(dialogBank, {
                    okCallback: () => {
                        this.getList();
                    }
                });
            },
            changePage (page) {
                this.curPage = page;
                this.getList();
            }
        }
    };
</script>

<style scoped>

</style>
