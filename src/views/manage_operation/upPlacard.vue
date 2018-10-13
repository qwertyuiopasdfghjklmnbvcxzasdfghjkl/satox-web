<template>
  <div class="upPlacard">
      <Card>
          <p slot="title">修改公告
               <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
          </p>
          <Row style="margin-bottom:20px;">
              <Col span="5">展示顺序</Col>
              <Col span="5">{{datas.sequence}}</Col>
              <Col span="11">
                <InputNumber style="width:200px;" v-model="sequence" ></InputNumber>
              </Col>
              <Col span="3">
                <Button  @click="tabs2('sequence')">修改</Button>
              </Col>
          </Row>
          <Row style="margin-bottom:20px;">
              <Col span="5">简体公告标题</Col>
              <Col span="5">{{datas.title}}</Col>
              <Col span="11">
               <Input v-model="title" style="width: 200px" />
                <!-- <InputNumber style="width:100%;" v-model="formLeft.title" name="title"></InputNumber> -->
              </Col>
              <Col span="3">
                <Button @click="tabs2('title')">修改</Button>
              </Col>
          </Row>
          <Row style="margin-bottom:20px;">
              <Col span="5">简体公告链接</Col>
              <Col span="5">{{datas.link}}</Col>
              <Col span="11">
                <Input v-model="link" style="width: 200px" />
              </Col>
              <Col span="3">
                <Button @click="tabs2('link')">修改</Button>
              </Col>
          </Row>
          <Row style="margin-bottom:20px;">
              <Col span="5">英文公告标题</Col>
              <Col span="5">{{datas.titleEn}}</Col>
              <Col span="11">
              <Input v-model="titleEn" style="width: 200px" />
              </Col>
              <Col span="3">
                <Button @click="tabs2('titleEn')">修改</Button>
              </Col>
          </Row>
          <Row style="margin-bottom:20px;">
              <Col span="5">英文公告链接</Col>
              <Col span="5">{{datas.linkEn}}</Col>
              <Col span="11">
                <Input v-model="linkEn" style="width: 200px" />
              </Col>
              <Col span="3">
                <Button @click="tabs2('linkEn')">修改</Button>
              </Col>
          </Row>
          <Row style="margin-bottom:20px;">
              <Col span="5">繁体公告标题</Col>
              <Col span="5">{{datas.titleCht}}</Col>
              <Col span="11">
                 <Input v-model="titleCht" style="width: 200px" />
              </Col>
              <Col span="3">
                <Button @click="tabs2('titleCht')">修改</Button>
              </Col>
          </Row>
          <Row style="margin-bottom:20px;">
              <Col span="5">繁体公告链接</Col>
              <Col span="5">{{datas.linkCht}}</Col>
              <Col span="11">
                <Input v-model="linkCht" style="width: 200px" />
              </Col>
              <Col span="3">
                <Button @click="tabsLink('linkCht')">修改</Button>
              </Col>
          </Row>
      </Card>
  </div>  
</template>
<script>
import extendApi from '../../api/extend'
export default {
  props: ['item'],
  data () {
    return {
        sequence: null,
        title: '',
        link: '',
        titleEn: '',
        linkEn: '',
        titleCht: '',
        linkCht: '',
        datas: {
            sequence: null,
            title: '',
            link: '',
            titleEn: '',
            linkEn: '',
            titleCht: '',
            linkCht: ''
        }
    }
  },
  created () {
    this.detail()
  },
  methods: {
    closeDialog () {
        this.$emit('removeDialog')
    },
    detail () {
        extendApi.findDetail({
            announcementId: this.item.announcementId
        },(res) => {
            this.datas = [res][0][0]
        }, (msg) => {
            this.$Message.error({content: msg})
        })
    },
    tabs2 (propName) {
        if (!this[propName]) {
            this.$Message.error({content: '不能为空'})
            return
        }
        let data = {
            announcementId: this.item.announcementId,
            version: this.item.version
        }
        data[propName] = this[propName]
        extendApi.updateAnnouncement(data, (res) =>{
            this.detail()
            this.$Message.success({content: '修改成功'})
            this[propName] = ''
        }, (msg) => {
            this.$Message.error({content: msg})
        }) 
    },
    tabsLink (propName) {

        if (!this[propName]) {
            this.$Message.error({content: '不能为空'})
            return
        }
        let reg=/^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/
        if (reg.test(this[propName]) === false) {
            this.$Message.error({content: '请输入以http:或者//https://开头的网址'})
        } else {
            let data = {
                announcementId: this.item.announcementId,
                version: this.item.version
            }
            data[propName] = this[propName]
            extendApi.updateAnnouncement(data, (res) =>{
                this.detail()
                this.$Message.success({content: '修改成功'})
                this[propName] = ''
            }, (msg) => {
                this.$Message.error({content: msg})
            })   
        }
    }
  }
}
</script>

<style>
.upPlacard{width: 600px;padding: 20px;background: #fff;}
</style>
