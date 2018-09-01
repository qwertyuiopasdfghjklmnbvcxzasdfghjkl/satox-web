<template>
    <Card style="width:500px;">
        <p slot="title">
          用户信息
          <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
        </p>
        <Form style="margin:0 20px;">
            <FormItem label="邮箱:">{{data.email || '--'}}</FormItem>
            <FormItem label="昵称:">{{data.nickName || '--'}}</FormItem>
            <FormItem label="手机号:">{{data.mobile || '--'}}</FormItem>
            <FormItem label="国家:">{{data.cn || '--'}}</FormItem>
            <FormItem label="证件ID:">{{data.verifyIdCard || '--'}}</FormItem>
        </Form>
        <Form label-position="top" style="margin:0 20px;">
            <FormItem label="1.银行卡支付">
              <span>{{data.cardBank || '--'}}</span>
              <span style="margin-left:20px">{{data.cardName || '--'}}</span>
              <span style="margin-left:20px">卡号：{{data.cardNumber || '--'}}</span>
            </FormItem>
            <Row>
                <Col span="8">
                    <FormItem label="2.微信付款二维码">
                        <div style="width:120px;height:120px;background:#ccc;">
                            <!-- <img :src="data1.length && data1[0].verifyBackImg" width="300px" height="300px"/> -->
                            <img :src="data.weChatImagePath" width="120px" height="120px" />
                        </div>
                        <div>微信名：{{data.weChatName || '--'}}</div>
                    </FormItem>
                </Col>
                <Col span="8">
                    <FormItem label="3.支付宝付款二维码">
                        <div style="width:120px;height:120px;background:#ccc;">
                            <img :src="data.aliPayImagePath" width="120px" height="120px" />
                        </div>
                        <div>支付宝名：{{data.aliPayName || '--'}}</div>
                    </FormItem>
                </Col>
                <Col span="8">
                </Col>
            </Row>
        </Form>
    </Card>
</template>

<script>
import util from '../../../libs/util';
import qs from 'qs';
import otcApi from '../../../api/otc'
export default {
  props: ['userId'],
  data () {
    return {
      data: {},
      imgData: []
    }
  },
  created () {
      this.getfindUserInfo()
  },
  methods: {
    getfindUserInfo () {
        otcApi.findUserInfoManage({
            userId: this.userId
        },(res) => {
            this.data = res
        })
    },
    // getUserInfo (id) {
    //   util.ajax.get(`api/v1/manage/otc/customer/userInfo/${id}`).then((res)=> {
    //     if (res.data && res.data.rst === 1) {
    //         var data = res.data.data;
    //         this.data = data
    //     } else if (res.data && res.data.rst !== 1) {
    //         var msgs = res.data.msg;
    //         this.$Message.error(typeof msgs === 'string' ? msgs : msgs[0]);
    //     } else {
    //         this.$Message.error('其他错误');
    //         window.console.log(error);
    //     }
    //   })
    // },
    // downImage (type, userId) {
    //   util.ajax.post(`api/v1/manage/otc/download/${type}`, qs.stringify({
    //     user_id: userId
    //   })).then((res)=> {
    //     if (res.data && res.data.rst === 1) {
    //         var data = res.data.data;
    //     } else if (res.data && res.data.rst !== 1) {
    //         var msgs = res.data.msg;
    //         this.$Message.error(typeof msgs === 'string' ? msgs : msgs[0]);
    //     } else {
    //         this.$Message.error('其他错误');
    //         window.console.log(error);
    //     }
    //   })
    // },
    closeDialog () {
      this.$emit('removeDialog');
    }
  }
}
</script>

<style>

</style>
