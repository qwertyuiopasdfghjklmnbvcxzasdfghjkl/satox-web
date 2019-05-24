<template>
    <div class="coldWalletSet">
        <Card>
            <p slot="title">{{$t('fund.lqbsz')}}
                <Button type="primary" @click="add">{{$t('common.tj')}}</Button>
            </p>
            <Table :columns="columns1" :data="data1"></Table>
            <Page :current="curPage" :total="total" @on-change="changePage" style="text-align:center;margin-top:20px;"></Page>
        </Card>
    </div>
</template>
<script>
import addWallet from './addWallet'
import util from '../../libs/util'
import fundApi from '../../api/fund'
import updataWaletAddress from './updataWaletAddress'
import addAddress from './addAddress'
    export default {
        data () {
            return {
                curPage: 1,
                total: 0,
                columns1: [
                    {
                        title: this.$t('common.bz'),
                        key: 'symbol'
                    },
                    {
                        title: this.$t('common.zllx'),
                        key: 'symbolType',
                        render: (h, params) => {
                            return h('div', this.switchStaus(params.row.symbolType))
                        }
                    },
                    {
                        title: this.$t('common.dz'),
                        key: 'address',
                        render: (h, params) => {
                            let o = this.detail(params.row.addressList, h)
                            console.log(params.row.addressList[0].address)
                            return h('Select', {
                                props: {value:o.selValue || params.row.addressList[0].address},
                                on: {
                                    'on-change': (value) => {
                                        params.row.$select_value = value
                                    }
                                }
                            }, o.options)
                        }
                    },
                    {
                        title: ' ',
                        key: 'address',
                        render: (h, params) => {
                            let o = this.detail(params.row.addressList, h)
                            return h('div', [
                                h('Button', {
                                    props: {type: 'primary', size: 'small', disabled: o.valueAll && o.valueAll.enable === null },
                                    style: {marginRight: '10px'},
                                    on: {
                                        click: () => {
                                            let sel = null
                                            let list = params.row.addressList
                                            for (let i=0;i<list.length;i++) {
                                                let d = list[i]
                                                if (params.row.$select_value) {
                                                    if (d.address === params.row.$select_value) {
                                                        sel = d
                                                        break
                                                    }
                                                } else {
                                                    if (d.defaultFlag == 1) {
                                                        sel = d
                                                        break
                                                    }
                                                }
                                            }
                                            if (!sel && list.length) {
                                                sel = list[0]
                                            }
                                           fundApi.updateColdWallet({
                                                walletId: sel.walletId,
                                                version: sel.version,
                                                enable: o.valueAll.enable === 1 ? 0 : 1
                                            }, (res) => {
                                                this.$Message.success({content: this.$t('fund.qycg')})
                                                 this.getAllColdWallet()
                                            })

                                        }
                                    }
                                }, o.valueAll && o.valueAll.enable === 1 ? this.$t('fund.jy'): this.$t('fund.qy')),
                                h('Button', {
                                    props: {type: 'primary', size: 'small', disabled: (params.row.$select_value==
                                            null && o.valueAll && o.valueAll.defaultFlag === 1) ||
                                            o.valueAll &&  params.row.$select_value==o.valueAll.address},
                                    style: {marginRight: '10px'},
                                    on: {
                                        click: () => {
                                            if (!params.row.addressList.length) {
                                                return
                                            }
                                            let sel = null
                                            let list = params.row.addressList
                                            for (let i=0;i<list.length;i++) {
                                                let d = list[i]
                                                if (d.address === params.row.$select_value) {
                                                    sel = d
                                                    break
                                                }
                                            }
                                            if (!sel && list.length) {
                                                sel = list[0]
                                            }
                                            let options = []
                                            let selValue = null
                                            let oldVersion = null
                                            list.forEach((item1) => {
                                                if (item1.defaultFlag == 1) {
                                                    selValue = item1.walletId
                                                    oldVersion = item1.version
                                                }
                                            })
                                            fundApi.setDetail({
                                                oldDefaultWalletId:selValue || null,
                                                newDefaultWalletId:  sel && sel.walletId,
                                                oldVersion:oldVersion || null,
                                                newVersion: sel && sel.version
                                            }, () => {
                                                this.$Message.success({content: this.$t('fund.szcg')})
                                                this.getAllColdWallet()
                                            }, (msg) => {
                                                this.$Message.error({content: msg})
                                            })
                                        }
                                    }
                                }, this.$t('fund.mrsz')),
                                h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    style: {marginRight: '10px'},
                                    on: {
                                        click: () => {
                                            let selItem = null
                                            let list = params.row.addressList
                                            for(let i=0;i<list.length;i++){
                                                let d = list[i]
                                                if (d.address === params.row.$select_value) {
                                                    selItem = d
                                                    break
                                                } else if (d.defaultFlag == 1) {
                                                    selItem = d
                                                    break
                                                }
                                            }
                                            if (!selItem) {
                                                this.$Message.error({content: this.$t('fund.qxzmrdz')})
                                            } else {
                                                util.setDialog(updataWaletAddress, {
                                                    item: selItem,
                                                    okCallback: () => {
                                                        this.getAllColdWallet()
                                                    }
                                                })
                                            }
                                        }
                                    }
                                },  this.$t('common.xg')),
                                h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    style: {marginRight: '10px'},
                                    on: {
                                        click: () => {
                                            util.setDialog(addAddress, {
                                                symbol: params.row.symbol,
                                                symbolType: params.row.symbolType,
                                                okCallback: () => {
                                                    this.getAllColdWallet()
                                                }
                                            })
                                        }
                                    }
                                }, this.$t('fund.xzdz')),
                            ]);
                        }
                    }
                ],
                data1: [],
                symbol: ''
            }
        },
        created () {
            this.getAllColdWallet();
            this.symbolTypeList = JSON.parse(window.localStorage.symbolTypes);
        },
        methods: {
            switchStaus(state) {
                return this.symbolTypeList.map((res) => {
                    if (res.code == state) {
                        return res.name;
                    }
                });
            },
            detail (addressList, h) {
                let options = []
                let selValue = null
                let valueAll = null
                let abled = false
                addressList.forEach((item) => {
                    if (item.defaultFlag == 1) {
                        selValue = item.address
                        valueAll = item
                    }
                    if (item.address === null) {
                        abled = true
                    } else {
                        options.push(h('Option', {
                            props: {value: item.address, label: item.address}
                        }))
                    }

                })
                return {
                    options: options,
                    selValue: selValue,
                    valueAll: valueAll,
                    abled: abled
                }
            },
            add () {
                util.setDialog(addWallet, {
                    okCallback: () => {
                        this.getAllColdWallet()
                    }
                })
            },
            getAllColdWallet () {
                fundApi.findAllColdWallet(this.curPage, (res, total) => {
                    res.forEach((item) => {
                        item.$select_value = null
                    })
                    this.total = total
                    this.data1 = res
                })
            },
            changePage (page) {
                this.curPage = page
                this.getAllColdWallet()
            }
        }
    }
</script>
<style scoped>
.ivu-card-head p{display: flex;justify-content:space-between;height: 30px;}
</style>
