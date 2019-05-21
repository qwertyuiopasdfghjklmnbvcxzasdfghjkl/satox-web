<template>
    <div>
        <Card>
            <p slot="title" style="height:auto;vertical-align:top;overflow:hidden;">
                <span style="height:32px;font-weight:normal;line-height:32px;">{{$t('nav.tszhgl')}}</span>
                <Button type="primary" style="float:right;" @click="addAccount">{{$t('exchange.xztsyh')}}</Button>
            </p>
            <Table :columns="column" :data="data" style="margin-top:10px;"></Table>
            <Page :current="accountsPage.currentPage" :total="accountsPage.total"
                  @on-change="changePage" style="text-align:center;margin-top:20px;"></Page>
        </Card>
    </div>
</template>

<script>
    import system from '../../api/systemparam';
    import util from '../../libs/util';
    import addAccount from './add_account';

    export default {
        data () {
            return {
                accountsSymbolParam: null,
                column: [
                    {title: 'ID', key: 'specialUserId'},
                    {title: this.$t('common.yhm'), key: 'username'},
                    {
                        title: this.$t('exchange.yhlx'), key: 'specialType',
                        render: (h, params) => {
                            return h('div', params.row.specialType === 1 ? this.$t('finance.sxfzh') : this.$t('finance.jqrzh'));
                        }
                    },
                    {title: this.$t('common.cjsj'), key: 'createdAt'},
                    {
                        title: this.$t('common.cz'), render: (h, params) => {
                            return h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        system.deleteAccounts(params.row.specialUserId, () => {
                                            this.$Message.success({content: this.$t('kyc.sccg')});
                                            this.getAccounts();
                                        }, (msg) => {
                                            this.$Message.error({content: msg});
                                        });
                                    }
                                }
                            }, this.$t('common.sc'));
                        }
                    }
                ],
                data: [],
                accountsPage: {
                    pageSize: 10,
                    currentPage: 1,
                    total: 0
                },
            };
        },
        created () {
            this.getAccounts();
        },
        methods: {
            getAccounts () {
                let data = {};
                data.page = this.accountsPage.currentPage;
                data.size = this.accountsPage.pageSize;
                system.getAccounts(data, (res, total) => {
                    this.data = res;
                    this.accountsPage.total = total;
                }, (msg) => {
                    console.error(msg);
                });
            },
            addAccount () {
                util.setDialog(addAccount, {
                    okCallback: () => {
                        this.getAccounts();
                    }
                });
            },
            changePage (page) {
                this.accountsPage.currentPage = page;
                this.getAccounts();
            }
        }
    };
</script>

<style scoped>

</style>
