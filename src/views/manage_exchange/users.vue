<!-- 用户管理 -->
<template>
    <Card>
        <p slot="title">用户管理
            <span class="refresh" @click="getList"></span>
        </p>
        <Row>
            <Select v-model="formData.type" style="width:200px;">
                <Option value="username">账号</Option>
                <Option value="userRealName">姓名</Option>
                <Option value="nickname">昵称</Option>
                <Option value="mobile">手机号</Option>
                <Option value="myInvitationCode">邀请码</Option>
            </Select>
            <Input v-model="formData.text" clearable style="width: 200px"></Input>
            <!-- <span>账号</span>
            <Input v-model="username" placeholder="账号" style="width: 150px;"></Input> -->
            <!-- <span style="margin-left:10px;">昵称</span>
            <Input v-model="nickname" placeholder="昵称" style="width: 150px"></Input> -->
            <Button type="primary" @click="getList('1')">查询</Button>
            <Checkbox v-model="single" @on-change="curPage=1;getList('1')">显示在线</Checkbox>
        </Row>
        <Table :columns="columns1" :data="data1" style="margin-top:20px;" @on-sort-change="setUserSort"></Table>
        <Page :current="curPage" :total="total" @on-change="changePage" style="text-align:center;margin-top:20px;"></Page>  
     </Card>
</template>

<script>
import util from '../../libs/util'
import login_record from './users/login_record'
import invite_info from './users/invite_info'
import msg_record from './users/msg_record'
import send_msg from './users/send_msg'
import trade_record from './users/trade_record'
import user_permission from './users/user_permission'
import update_record from './users/update_record'
import asset_record from './users/asset_record'
import currenyApi from '../../api/currency'
import Cookies from 'js-cookie'
export default {
  data () {
    return {
      formData: {
        type: 'username',
        text: ''
      },
      single: false,
      curPage: 1,
      total: 0,
      username: '',
      nickname: '',
      online: 'online',
      columns1: [
          {
              title: '账号',
              key: 'username'
          },
          {
              title: '姓名',
              key: 'userRealName'
          },
          {
              title: '昵称',
              key: 'nickname'
          },
          {
              title: '手机号',
              key: 'mobile'
          },
          {
              title: '状态',
              key: 'online',
              render: (h, params) => {
                //   return h('div', params.row.online == true ? '在线' : '离线')
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
          {
              title: '注册时间',
              key: 'createdTime',
              sortable: 'custom'
          },
          {
              title: '操作',
              key: 'opreat',
              width: 350,
              render: (h, params) => {
                return h('div', {
                    style: {margin: '10px 0px'}
                }, [
                    h('Button', {
                        props: {type: 'primary', size: 'small'},
                        style: {marginRight: '10px'},
                        on: {
                            click: () => {
                                util.setDialog(login_record, {
                                    id: params.row.id,
                                    userId: params.row.userId
                                })
                                this.title = '编辑管理员'
                                this.editData = params.row;
                                this.modelShow = true
                            }
                        }
                    }, '登录记录'),
                    h('Button', {
                        props: {type: 'primary', size: 'small'},
                        style: {marginRight: '10px'},
                        on: {
                            click: () => {
                                util.setDialog(invite_info, {
                                    id: params.row.id,
                                    userId: params.row.userId
                                })
                            }
                        }
                    }, '邀请信息'),
                     h('Button', {
                        props: {type: 'primary', size: 'small'},
                        style: {marginRight: '10px'},
                        on: {
                            click: () => {
                                util.setDialog(msg_record, {
                                    userId: params.row.userId
                                })
                            }
                        }
                    }, '消息记录'),
                     h('Button', {
                        props: {type: 'primary', size: 'small', disabled: !util.showThisRoute(['ROLE_ADMIN', 'ROLE_OPERATION'], Cookies.get('roles')) && util.showThisRoute('ROLE_CUSTOMER', Cookies.get('roles')) },
                        on: {
                            click: () => {
                                util.setDialog(send_msg, {
                                    userId: params.row.userId
                                })
                            }
                        }
                    }, '发送消息'),
                    h('div', {
                        style: {width: '100%', height: '4px'}
                    }),
                    h('Button', {
                        props: {type: 'primary', size: 'small'},
                        style: {marginRight: '10px'},
                        on: {
                            click: () => {
                                util.setDialog(trade_record, {
                                    userId: params.row.userId
                                });
                            }
                        }
                    }, '交易记录'),
                    h('Button', {
                        props: {type: 'primary', size: 'small'},
                        style: {marginRight: '10px'},
                        on: {
                            click: () => {
                                util.setDialog(asset_record, {
                                    userId: params.row.userId
                                });
                            }
                        }
                    }, '资产记录'),
                     h('Button', {
                        props: {type: 'primary', size: 'small', disabled: !util.showThisRoute(['ROLE_ADMIN', 'ROLE_OPERATION'], Cookies.get('roles')) && util.showThisRoute('ROLE_CUSTOMER', Cookies.get('roles')) },
                        style: {marginRight: '10px'},
                        on: {
                            click: () => {
                                util.setDialog(user_permission, {
                                    userId: params.row.userId,
                                    version: params.row.version
                                });
                            }
                        }
                    }, '账户权限'),
                     h('Button', {
                        props: {type: 'primary', size: 'small'},
                        on: {
                            click: () => {
                                util.setDialog(update_record, {
                                   userId: params.row.userId,
                                   username: params.row.username
                                });
                            }
                        }
                    }, '操作日志')
                ]);
            }
          }
      ],
      data1: []
    }
  },
  created () {
    this.getList ()
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
      this.getList()
    },
    getList (code) {
        if (code == 1) {
            this.curPage = 1
        } else {
            this.curPage = this.curPage
        }
        let sortStr = this.UserSortKey?`${this.UserSortKey}%20${this.UserSortVal}`:'null'
        if (this.single) {
            let data = {}
            data[this.formData.type] = this.formData.text
            data[this.online] = true
            currenyApi.getfindUserList(this.curPage, sortStr, data, (res, total) => {
                this.total = total
                this.data1 = res
            }, (msg) => {
                this.$Message.error({content: msg})
            })
        } else {
            let data = {}
            data[this.formData.type] = this.formData.text
            data[this.online] = false
            currenyApi.getfindUserList(this.curPage, sortStr, data, (res, total) => {
                this.total = total
                this.data1 = res
            }, (msg) => {
                this.$Message.error({content: msg})
            })
        }
    },
    changePage (page) {
      this.curPage = page
      this.getList()
    }
  }
}
</script>

<style lang="less" scoped>
.ivu-card-head-inner, .ivu-card-head p{display: flex !important;justify-content: space-between  !important;height: 40px !important; line-height: 40px !important;}
.refresh{width: 49px;height: 24px;background: url(../../images/frsh.png) center/cover no-repeat;background-size: contain;cursor: pointer;color: #2d8cf0;}
</style>
