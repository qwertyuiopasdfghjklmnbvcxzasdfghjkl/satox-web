<template>
    <div>
        <Card>
            <p slot="title" style="height:auto;vertical-align:top;overflow:hidden;">
                <span style="height:32px;font-weight:normal;line-height:32px;">{{$t('system.jyssxfzh')}}</span>
                <span>
              <Input type="text" v-model="accountsSymbolParam" :placeholder="$t('system.qsrycxdbzgjz')"
                     style="width:auto;margin-left:28px;"></Input>
              <Button type="primary" @click="fnFindAdminAccounts(accountsSymbolParam)">{{$t('common.cx')}}</Button>
              <Button type="ghost" @click="fnFindAdminAccounts()">{{$t('system.cz')}}</Button>
            </span>
                <Button type="primary" style="float:right;" @click="addOrEditFeeAccountDialog">{{$t('system.tjsxfzh')}}</Button>
            </p>
            <Table :columns="accountsColumns" :data="accountsData" style="margin-top:10px;"></Table>
            <Page :current="accountsPage.currentPage" :total="accountsPage.total"
                  @on-change="changePage(arguments[0], 1)" style="text-align:center;margin-top:20px;"></Page>
        </Card>
    </div>
</template>

<script>
    import system from '../../api/systemparam';
    import curreny from '../../api/currency';
    import util from '../../libs/util';
    import numberbox from '../components/dialog/numberbox';
    import addOrEditFeeAccount from './addOrEditFeeAccount';
    import addOrEditWithdrawalAddress from './addOrEditWithdrawalAddress';
    import addConfig from './addConfig';
    import upAddress from './upAddress';

    export default {
        data () {
            return {
                accountsSymbolParam: null,
                accountsColumns: [
                    {title: this.$t('common.bz'), key: 'symbol', width: 80},
                    {title: this.$t('common.yhm'), key: 'username'},
                    {title: this.$t('system.yhid'), key: 'userId'},
                    {title: this.$t('system.zhid'), key: 'accountId'},
                    {title: this.$t('system.cjr'), key: 'creator'},
                    {title: this.$t('common.cjsj'), key: 'createdTime'},
                    {title: this.$t('system.zhxgr'), key: 'lastUpdatedBy'},
                    {title: this.$t('system.zhxgsj'), key: 'lastUpdatedTime'},
                    {
                        title: this.$t('common.cz'), render: (h, params) => {
                            return h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        util.setDialog(addOrEditFeeAccount, {
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
        watch: {
            accountsPage () {
                this.fnFindAdminAccounts(this.accountsSymbolParam);
            },
        },
        created () {
            this.fnFindAdminAccounts();
        },
        methods: {
            fnFindAdminAccounts (symbolParam) {
                let tempSymbolParam = null;
                if (symbolParam) {
                    tempSymbolParam = {symbol: symbolParam};
                } else {
                    tempSymbolParam = {};
                    this.accountsSymbolParam = null;
                }
                system.findAdminAccounts(this.accountsPage.pageSize, this.accountsPage.currentPage, tempSymbolParam, (data, total) => {
                    this.accountsData = data;
                    this.accountsPage.total = total;
                }, (msg) => {
                    console.error(msg);
                });
            },
            addOrEditFeeAccountDialog () {
                util.setDialog(addOrEditFeeAccount, {
                    isEdit: false,
                    okCallback: () => {
                        this.fnFindAdminAccounts();
                    }
                });
            },
            changePage (page, flag) {
                if (flag === 1) {
                    this.accountsPage.currentPage = page;
                    this.fnFindAdminAccounts();
                } else if (flag === 2) {
                } else {
                    return false;
                }
            }
        }
    };
</script>

<style scoped>

</style>
