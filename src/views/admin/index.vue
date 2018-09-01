<template>
  <div>
        <Row>
           <Card style="font-size:16px;">
                <Row>
                    <Form>
                        <p class="notwrap">
                            <strong>
                                <span>管理员权限管理</span>
                                <span style="float:right;">
                                    <Button type="primary" @click="addAdmin">新增管理员账号</Button>
                                </span>
                            </strong>
                        </p>
                    </Form>
                </Row>
                <Row class="margin-top-20">
                    <Table :columns="columns" :data="datas"></Table>
                </Row>
            </Card>
        </Row>
        <coe v-model="modelShow" :title="title" :editData="editData" @getList="getList"></coe>
    </div>
</template>

<script>
import coe from './modal'
import util from '@/libs/util';
import qs from 'qs';
export default {
  components: {
    coe
  },
  data () {
    return {
      modelShow: false,
      title: '新增管理员',
      editData: null,
      columns: [
        {key: 'account', title: '管理员账号'},
        {key: 'name', title: '管理员姓名'},
        {key: 'remark', title: '备注信息'},
        {key: 'permissions_name', title: '权限'},
        {key: 'action', title: '操作', render: (h, params) => {
            return h('div', [
                h('Button', {
                    props: {type: 'primary', size: 'small'},
                    style: {marginRight: '10px'},
                    on: {
                        click: () => {
                            this.title = '编辑管理员'
                            this.editData = params.row;
                            this.modelShow = true
                        }
                    }
                }, '编辑'),
                h('Button', {
                    props: {type: 'primary', size: 'small'},
                    on: {
                        click: () => {
                            util.ajax.delete(`api/v1/manage/otc/user/${params.row.id}`).then((res)=> {
                                if (res.data && res.data.rst === 1) {
                                    this.$Message.success(res.data.msg);
                                    this.show = false;
                                    this.getList();
                                } else if (res.data && res.data.rst !== 1){
                                    this.$Message.error(res.data.msg);
                                    window.console.log(res.data.msg);
                                }
                            })
                        }
                    }
                }, '删除')
            ]);
        }}
      ],
      datas: []
    }
  },
  watch: {
      modelShow (bool) {
          !bool && (this.editData = null);
      }
  },
  methods: {
    addAdmin () {
        this.title = '新增管理员'
        this.modelShow = true
    },
    getList () {
        util.ajax.get('api/v1/manage/otc/userList').then((res) =>{
            if (res.data && res.data.rst === 1) {
                var data = res.data.data;
                this.datas = data
            } else if (res.data && res.data.rst !== 1) {
                var msgs = res.data.msg;
                this.$Message.error(typeof msgs === 'string' ? msgs : msgs[0]);
            } else {
                this.$Message.error('其他错误');
                window.console.log(error);
            }
        });
    }
  },
  created () {
    this.getList();
  }
}
</script>

<style>

</style>
