<template>
  <Card class="manage_otc_appeals_info" style="width:1000px;">
      <p slot="title">
          申诉/被申诉人信息
          <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
      </p>
      <Row class="manage_otc_appeals_info_row" type="flex" style="border-bottom:1px #ccc solid;">
          <div class="manage_otc_appeals_info_row_title">申诉人</div>
          <div class="manage_otc_appeals_info_row_name">
              <!-- 姓名：{{datas.userRealName || '--'}} -->
               姓名：{{ this.datas.userRealName  === null ? this.datas.username : this.datas.userRealName}}
          </div>
          <div class="manage_otc_appeals_info_row_email">
              账号：{{datas.username || '-'}}
          </div>
          <div>
              电话：{{datas.mobile || '-'}}
          </div>
      </Row>
      <Row class="manage_otc_appeals_info_row" type="flex">
          <div class="manage_otc_appeals_info_row_title">被申诉人</div>
          <div class="manage_otc_appeals_info_row_name">
              <!-- 姓名：{{data1.userRealName || '--'}} -->
              姓名：{{ this.data1.userRealName  === null ? this.data1.username : this.data1.userRealName}} 
          </div>
          <div class="manage_otc_appeals_info_row_email">
              账号：{{data1.username || '-'}}
          </div>
          <div>
              电话：{{data1.mobile || '-'}}
          </div>
      </Row>
  </Card>
</template>

<script>
import otcApi from '../../../api/otc'
export default {
    props: ['msgNumber'],
    data () {
      return {
          datas: [],
          data1: []
      }
    },
    created () {
        this.getselectUserInfo()
    },
    methods: {
        closeDialog () {
            this.$emit('removeDialog');
        },
        getselectUserInfo () {
            otcApi.selectUserInfo({
                msgNumber: this.msgNumber
            }, (res) => {
                if (res.oppositeUser) {
                    this.data1 = res.oppositeUser
                } else {
                    return
                }
                if (res.user) {
                    this.datas = res.user
                } else {
                    return
                }
            })
        }
    }
}
</script>

<style lang="less">
.manage_otc_appeals_info .ivu-card-body{padding:0px;}
.manage_otc_appeals_info_row{height:100px;line-height:100px;font-size:20px;}
.manage_otc_appeals_info_row_title{width:150px;text-align:center;border-right:1px solid #ccc;}
.manage_otc_appeals_info_row_name{width:220px;padding-left:4px;}
.manage_otc_appeals_info_row_email{width:350px;}
</style>
