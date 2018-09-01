<template>
    <Modal v-model="show" title="认证申请">
        <Form label-position="top">
            <Row>
                <Col span="12">
                    <FormItem label="证件正面">
                        <div class="account-auth-model-image">
                            <img class="account-auth-model-image-w" :src="datas.front_url" />
                        </div>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="证件背面">
                        <div class="account-auth-model-image">
                            <img class="account-auth-model-image-w" :src="datas.back_url" />
                        </div>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="12">
                    <FormItem label="手持证件照片">
                        <div class="account-auth-model-image">
                            <img class="account-auth-model-image-w" :src="datas.hand_url" />
                        </div>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="未通过认证理由">
                        <Select>
                            <Option value="beijing">照片不清楚</Option>
                            <Option value="shanghai">证件号有误</Option>
                            <Option value="shenzhen">照片不符合规范</Option>
                        </Select>
                    </FormItem>
                </Col>
            </Row>
        </Form>
        <div slot="footer">
            <Button type="error" @click="updateVerifyState(2)">不通过认证</Button>
            <Button type="primary" @click="updateVerifyState(1)">通过认证</Button>
        </div>
    </Modal>
</template>

<script>
import util from '../../libs/util';
import qs from 'qs';
export default {
  props: ['value', 'userId'],
  data () {
    return {
      show: this.value,
      datas: {}
    }
  },
  watch: {
    value (bool) {
      this.show = bool
    },
    show (bool) {
      this.$emit('input', bool)
    },
    userId (userId) {
        if (userId) {
            this.verifyInfo(userId);
        } else {
            this.datas = {};
        }
    }
  },
  methods: {
    verifyInfo (userId) {
      util.ajax.get(`api/v1/manage/otc/customer/verifyInfo/${userId}`).then((res)=> {
          if (res.data && res.data.rst === 1) {
            var data = res.data.data;
            this.datas = data
          } else if (res.data && res.data.rst !== 1) {
            this.$Message.error(res.data.data);
          } else {
            this.$Message.error('其他错误');
            window.console.log(error);
          }
      })
    },
    updateVerifyState (state) {
        util.ajax.put(`api/v1/manage/otc/customer/verifyState/${this.userId}`, qs.stringify({
            state: state
        })).then((res) => {
            var data = res.data;
            if (data.rst === 1) {
                this.$Message.success(data.msg);
                this.$emit('customerList');
            } else {
                this.$Message.error(data.msg);
            }
        }).catch((error) => {
            this.$Message.error('其他错误');
            window.console.log(error);
        })
    }
  }
}
</script>

<style>
.account-auth-model-image{width:200px;height:150px;background:#ccc;}
.account-auth-model-image-w{width:100%;height:100%;}
</style>
