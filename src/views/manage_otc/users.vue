<!-- 用户管理 -->
<template>
  <Card>
    <p slot="title">用户管理
        <span class="refresh" @click="getfindUserManage"></span>
    </p>
    <Row>
        <Input style="width: 300px;" v-model="userSearh" placeholder="如：123456@qq.com"></Input>
        <Button type="primary" @click="curPage=1;getfindUserManage()">查询</Button>
        <Checkbox v-model="single" @on-change="curPage=1;getfindUserManage('1')">显示在线</Checkbox>
    </Row>
    <Table :columns="columns1" :data="data1" style="margin-top:10px;" @on-sort-change="setUserSort"></Table>
    <Page :current="curPage" :total="total" @on-change="changePage" style="text-align:center;margin-top:20px;"></Page>  
  </Card>
</template>

<script>
import util from '../../libs/util';
import infoModel from './users/infoModel';
import assetsModel from './users/assetsModel';
import tradeRecordModel from './users/tradeRecordModel';
import messageModel from './users/messageModel';
import closure from './users/closure';
import otcApi from '../../api/otc'
import Cookies from 'js-cookie';
export default {
  data () {
    return {
        single: false,
        curPage: 1, 
        total: 0,
        userSearh: '',
        readOnly: !util.showThisRoute(['ROLE_ADMIN', 'ROLE_OPERATION', 'ROLE_OTC_AUDIT'], Cookies.get('roles')) && util.showThisRoute(['ROLE_OTC_APPEAL', 'ROLE_CUSTOMER'], Cookies.get('roles')),
        columns1: [
            {title: '账号', key: 'username'},
            {title: '在线状态', key: 'online',
                render: (h, params) => { 
                    // return h('div', params.row.online == 1 ? '在线' : '离线')
                    let status = params.row.online
                    let color = ''
                    switch(status){
                        case true:
                            color = 'green'
                            break;
                        case false:
                            color = '#ff8041'
                            break;
                    }
                    return h('div', [
                        h('div', {
                            style: { color: color}
                        }, params.row.online === true ? '在线' : '离线'),
                    ])
                }
            },
            {title: '账号状态', key: 'frozenState',
                render: (h, params) => { 
                    // return h('div', params.row.frozenState == 0 ? '正常' : '冻结')
                    let status = params.row.frozenState
                    let color = ''
                    switch(status){
                        case 0:
                            color = 'green'
                            break;
                        case 1:
                            color = '#ff8041'
                            break;
                    }
                    return h('div', [
                        h('div', {
                            style: { color: color}
                        }, params.row.frozenState === 0 ? '正常' : '冻结'),
                    ])
                },
                sortable: 'custom'
            },
            {
                title: '注册时间',
                key: 'createdTime',
                sortable: 'custom'
            },
            {title: '操作', key: 'action', render: (h, params) => {
                return h('div', [
                    h('Button', {
                        props: {type: 'primary', size: 'small'},
                        style: {marginRight: '10px'},
                        on: {
                            click: () => {
                                util.setDialog(infoModel, {
                                    userId: params.row.userId
                                });
                            }
                        }
                    }, '用户信息'),
                    h('Button', {
                        props: {type: 'primary', size: 'small'},
                        style: {marginRight: '10px'},
                        on: {
                            click: () => {
                                util.setDialog(assetsModel, {
                                    userId: params.row.userId
                                });
                            }
                        }
                    }, '资产信息'),
                    h('Button', {
                        props: {type: 'primary', size: 'small'},
                        style: {marginRight: '10px'},
                        on: {
                            click: () => {
                                util.setDialog(tradeRecordModel, {
                                    userId: params.row.userId
                                });
                            }
                        }
                    }, '交易信息'),
                    h('Button', {
                        props: {type: 'primary', size: 'small', disabled: this.readOnly},
                        style: {marginRight: '10px'},
                        on: {
                            click: () => {
                                if (params.row.frozenState == 0) {
                                    util.setDialog(closure, {
                                        curPage : this.curPage,
                                        userId: params.row.userId,
                                        frozenState: params.row.frozenState,
                                        okCallback: () => {
                                            this.getfindUserManage()
                                        }
                                    })
                                } else if (params.row.frozenState == 1) {
                                    otcApi.relieveFrozenManage({
                                        userId: params.row.userId
                                    },(res) => {
                                        this.$Message.success({content: '解除成功'})
                                        this.getfindUserManage()
                                    })
                                }
                            }
                        }
                    }, params.row.frozenState == 0 ? '封禁' : '解除封禁'),
                    h('i', {
                        class: 'ivu-icon ivu-icon-volume-medium',
                        style: {verticalAlign: 'middle', cursor: 'pointer', fontSize: '30px', cursor: this.readOnly ? 'not-allowed' : 'pointer', color: this.readOnly ? '#CCC' : null}, 
                        on: {
                            click: () => {
                                if (this.readOnly) {
                                    return
                                }
                                util.setDialog(messageModel, {
                                    userId: params.row.userId,
                                    username: params.row.username
                                });
                            }
                        }
                    })
                ]);
            }}
        ],
        data1: []  
    }
  },
  created () {
      this.getfindUserManage()
  },
  methods: {
    setUserSort(column){
      this.curPage = 1
      if(column.order!=='normal'){
        this.UserSortKey = column.key
        this.UserSortVal = column.order
      } else {
        this.UserSortKey = null
      }
      this.getfindUserManage()
    },
      getfindUserManage () {
          if (this.single) {
            let data = {
                    username: this.userSearh || null,
                    online: true
                }
                if(this.UserSortKey){
                    data.sortKey = `${this.UserSortKey} ${this.UserSortVal}`
                }
                otcApi.findUserManage(this.curPage, data, (res, total) => {
                    this.total = total
                    this.data1 = res
                }, (msg) => {
                    this.$Message.error({content: msg})
                })
          } else {
            let data = {
                    username: this.userSearh || null
                }
                if(this.UserSortKey){
                    data.sortKey = `${this.UserSortKey} ${this.UserSortVal}`
                }
                otcApi.findUserManage(this.curPage, data, (res, total) => {
                    this.total = total
                    this.data1 = res
                }, (msg) => {
                    this.$Message.error({content: msg})
                })
          }
      },
      changePage (page) {
        this.curPage = page
        this.getfindUserManage()
      }
  }
}
</script>

<style lang="less" scoped>
.refresh{width: 49px;height: 24px;background: url(../../images/frsh.png) center/cover no-repeat;background-size: contain;cursor: pointer;color: #2d8cf0;}
.ivu-card-head-inner, .ivu-card-head p{display: flex !important;justify-content: space-between  !important;height: 40px !important; line-height: 40px !important;}
</style>
