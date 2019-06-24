<template>
    <div>
        <Card>
            <p slot="title" style="height:auto;vertical-align:top;overflow:hidden;">
                <span style="height:32px;font-weight:normal;line-height:32px;">{{$t('nav.scskzhsz')}}</span>
                <span>
              <Input type="text" v-model="accountsSymbolParam" :placeholder="$t('system.qsrycxdbzgjz')"
                     style="width:auto;margin-left:28px;"></Input>
              <Button type="primary" @click="fnFindAdminAccounts()">{{$t('common.cx')}}</Button>
              <Button type="ghost" @click="ref()">{{$t('system.cz')}}</Button>
            </span>
                <Button type="primary" style="float:right;" @click="addYollonAccountDialog">{{$t('mall.tjscskzh')}}
                </Button>
            </p>
            <Table :columns="accountsColumns" :data="accountsData" style="margin-top:10px;"></Table>
            <Page :current="accountsPage.currentPage" :total="accountsPage.total"
                  @on-change="changePage" style="text-align:center;margin-top:20px;"></Page>
        </Card>
    </div>
</template>

<script>
    import system from '../../api/systemparam';
    import util from '../../libs/util';
    import addYollonAccount from './addYollonAccount';

    export default {
        data () {
            return {
                accountsSymbolParam: null,
                accountsColumns: [
                    {title: this.$t('common.bz'), key: 'symbol', width: 80},
                    {title: this.$t('common.yhm'), key: 'username'},
                    {title: this.$t('system.yhid'), key: 'userId'},
                    {title: this.$t('system.zhid'), key: 'accountId'},
                    {title: this.$t('system.cjr'), key: 'lastupdatedby'},
                    {title: this.$t('common.cjsj'), key: 'createdAt'},
                    {title: this.$t('system.zhxgsj'), key: 'updatedAt'},
                    {
                        title: this.$t('common.cz'), render: (h, params) => {
                            return h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        util.setDialog(addYollonAccount, {
                                            isEdit: true,
                                            symbol: params.row.symbol,
                                            username: params.row.username,
                                            symbolType: params.row.symbolType,
                                            okCallback: () => {
                                                this.fnFindAdminAccounts();
                                            }
                                        });
                                    }
                                }
                            }, this.$t('common.xg'));
                        }, width: 80
                    }
                ],
                accountsData: [],
                accountsPage: {
                    pageSize: 10,
                    currentPage: 1,
                    total: 0
                },
            };
        },
        created () {
            this.fnFindAdminAccounts();
        },
        methods: {
            fnFindAdminAccounts () {
                let data = {};
                data.page = this.accountsPage.currentPage;
                data.size = this.accountsPage.pageSize;
                data.type = 3;
                data.symbol = this.accountsSymbolParam;
                system.getAccounts(data, (res, total) => {
                    this.accountsData = res;
                    this.accountsPage.total = total;
                }, (msg) => {
                    console.error(msg);
                });
            },
            addYollonAccountDialog () {
                util.setDialog(addYollonAccount, {
                    isEdit: false,
                    okCallback: () => {
                        this.fnFindAdminAccounts();
                    }
                });
            },
            changePage (page) {
                this.accountsPage.currentPage = page;
                this.fnFindAdminAccounts();
            },
            ref () {
                this.accountsPage.currentPage = 1;
                this.accountsSymbolParam = null;
                this.fnFindAdminAccounts();
            }
        }
    };
</script>

<style scoped>

</style>
