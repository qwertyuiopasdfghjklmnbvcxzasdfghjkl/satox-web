<template>
    <Modal v-model="show" :title="title">
        <Form  ref="formAdsValidate" :model="userData" :rules="ruleValidate" label-position="left" :label-width="100">
            <FormItem label="管理员姓名" prop="name">
                <Input v-model="userData.name"></Input>
            </FormItem>
            <FormItem label="管理员账号" prop="account">
                <Input v-model="userData.account"></Input>
            </FormItem>
            <FormItem label="管理员密码" prop="password">
                <Input type="password" v-model="userData.password"></Input>
            </FormItem>
            <FormItem label="备注">
                <Input type="textarea" v-model="userData.remark"></Input>
            </FormItem>
            <FormItem label="管理员权限">
                <CheckboxGroup v-model="userData.permissions">
                    <Checkbox label="1">用户管理权限</Checkbox>
                    <Checkbox label="2">币种管理权限</Checkbox>
                    <Checkbox label="3">广告管理</Checkbox>
                    <Checkbox label="4">申诉管理</Checkbox>
                    <Checkbox label="5">超级管理员</Checkbox>
                </CheckboxGroup>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="text" @click="show=false">取消</Button><Button type="primary" @click="saveOrEdit">确定</Button>
        </div>
    </Modal>
</template>

<script>
import util from '@/libs/util';
import qs from 'qs';
export default {
  props: ['value', 'title', 'editData'],
  data () {
    return {
      show: this.value,
      formData: {},
      ruleValidate: {
          name: [{required: true, message: '请输入管理员姓名', trigger: 'blur'}],
          account: [{required: true, message: '请输入管理员姓名', trigger: 'blur'}],
          password: [{required: true, message: '请输入管理员姓名', trigger: 'blur'}]
      },
      userData: {
         name: null,
         account: '',
         password: '',
         permissions: [],
         remark: ''
      }
    }
  },
  watch: {
    value (bool) {
      this.show = bool
    },
    show (bool) {
      this.$refs.formAdsValidate.resetFields();
      this.$emit('input', bool)
    },
    editData (data) {
        if (data) {
            this.userData.name = data.name;
            this.userData.account = data.account;
            this.userData.remark = data.remark;
            this.userData.permissions = data.permissions.split(',');
        } else {
            this.userData.name = '';
            this.userData.account = '';
            this.userData.remark = '';
            this.userData.password = '';
            this.userData.permissions = [];
        }
    }
  },
  methods: {
    saveOrEdit () {
        this.$refs.formAdsValidate.validate((valid) => {
            if (!valid) {
                return;
            }
            if (this.editData) {
                this.edit();
            } else {
                this.addUser();
            }
        });
    },
    addUser () {
      var data = JSON.parse(JSON.stringify(this.userData));
      data.permissions = data.permissions.join(',');
      util.ajax.post('api/v1/manage/otc/user', qs.stringify(data)).then((res) => {
        if (res.data && res.data.rst === 1) {
           this.$Message.success(res.data.msg);
           this.show = false;
           this.getList();
        }else if (res.data && res.data.rst !== 1){
            var msgs = res.data.msg;
            this.$Message.error(typeof msgs === 'string' ? msgs : msgs[0]);
            window.console.log(res.data.msg);
       }
      })
    },
    edit () {
      var data = JSON.parse(JSON.stringify(this.userData));
      data.permissions = data.permissions.join(',');
      util.ajax.put(`api/v1/manage/otc/user/${this.editData.id}`, data).then((res)=> {
         if (res.data && res.data.rst === 1) {
            this.$Message.success(res.data.msg);
            this.show = false;
            this.$emit('getList');
         } else if (res.data && res.data.rst !== 1){
            var msgs = res.data.msg;
            this.$Message.error(typeof msgs === 'string' ? msgs : msgs[0]);
            window.console.log(res.data.msg);
         }
      })
    }
  }
}
</script>

<style>

</style>
