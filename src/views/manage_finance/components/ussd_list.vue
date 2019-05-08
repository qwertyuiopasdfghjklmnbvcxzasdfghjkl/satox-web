<template>
    <Row>
        <Card style="width:1000px;">
            <p slot="title">
                <span>USSD{{vm.$t('finance.slxgjl')}}</span>
                <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
            </p>
            <Row>
                <Col span="16">
                    <span>{{vm.$t('common.yhm')}}</span>
                    <Input v-model="formData.text" clearable style="width: 200px"></Input>
                    <Button type="primary" @click="page=1;getList(true)">{{vm.$t('common.cx')}}</Button>
                </Col>
            </Row>
            <Table :columns="columns1" :data="data1" style="margin-top:10px;"></Table>
            <Page :current="page" :total="total" @on-change="changePage" :page-size="10"
                  style="text-align:center;margin-top:20px;"></Page>
        </Card>
    </Row>
</template>

<script>
    import financeApi from '../../../api/finance';
    import kyc from '../../../api/kyc';

    export default {
        data () {
            var vm = window.vm;
            return {
                vm: vm,
                page: 1,
                total: 0,
                formData: {
                    type: 'username',
                    text: ''
                },
                columns1: [
                    {title: vm.$t('common.cjsj'), key: 'createdAt'},
                    {title: vm.$t('common.yhm'), key: 'username'},
                    {title: vm.$t('common.sjh'), key: 'mobile'},
                    {title: vm.$t('common.xm'), key: 'userRealName'},
                    {title: vm.$t('common.bzdh'), key: 'symbol'},
                    {
                        title: vm.$t('finance.xglx'),
                        key: 'direction',
                        render: (h, params) => {
                            return h('div', params.row.direction == 1 ? vm.$t('common.zj') : vm.$t('common.kc'));
                        }
                    },
                    {
                        title: vm.$t('common.sl'),
                        key: 'quantity',
                        render: (h, params) => {
                            return h('div', Math.abs(params.row.quantity));
                        }
                    },
                    {title: vm.$t('finance.czr'), key: 'lastUpdatedBy'}
                ],
                data1: []
            };
        },
        created () {
            this.getList();
        },
        methods: {
            state (data) {
                switch (data) {
                    case 1:
                }
            },
            getList () {
                let data = {
                    page: this.page,
                    size: 10,
                    symbol: 'USSD'
                };
                if (this.formData.text) {
                    data[this.formData.type] = this.formData.text;
                }
                financeApi.recordSato(data, (res, total) => {
                    this.total = total;
                    this.data1 = res;
                });
            },
            changePage (page) {
                this.page = page;
                this.getList();
            },
            closeDialog () {
                this.$emit('removeDialog');
            }
        }
    };
</script>

<style scoped>

</style>
