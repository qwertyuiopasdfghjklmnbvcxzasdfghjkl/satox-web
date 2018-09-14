<template>
  <div class="updaImge">
      <div class="allUpdata">
          <div class="allUpdata-left" style="width:150px;height:150px;background:#ccc;">
              <img :src="image" /> 
          </div>
          <div class="allUpdata-left">
                <Form ref="formItem" :model="formLeft" :rules="ruleInline" label-position="left" :label-width="100" style="max-height:680px;overflow:auto;">
                    <FormItem label="" prop="img">
                        <input type="file" ref="img" name="img" @change="iconValidator('img', $event)"/>
                    </FormItem>
                    <FormItem label="" >
                        {{this.item.activityImgName}}
                    </FormItem>
                    <FormItem label="" >
                        跳转到地址
                    </FormItem>
                    <FormItem label="" prop="jumpAddress">
                        <Input v-model="formLeft.jumpAddress" name="jumpAddress"></Input>
                    </FormItem>
                </Form>
               
          </div>
      </div>
      <div class="updaBtn">
            <Button @click="closeDialog">取消</Button>
            <Button type="primary" @click="updaAddress">确定</Button>
      </div>
  </div>  
</template>
<script>
import extendApi from '../../api/extend'
export default {
    props: ['item'],
    data () {
        return {
            formLeft: {
                img: '',
                jumpAddress: ''
            },
            ruleInline: {
                img: [
                    { required: true, message: '请输入路径', trigger: 'blur' }
                ],
                jumpAddress: [
                    { required: true, message: '请输入地址', trigger: 'blur' }
                ]
            }
        }
    },
    computed: {
        image () {
            return this.item.activityImgUrl
        }
    },
    methods: {
        iconValidator (prop, e) {
            this.formLeft[prop] = e.target.value
        },
        closeDialog () {
            this.$emit('removeDialog')
        },
        updaAddress () {
            let form = this.$refs.formItem;
            form.validate((valid) => {
            if (valid) {
                var formData = new FormData(form.$el)
                formData.append('adPosition', this.item.adPosition)
                extendApi.updatePromotionActivity(formData, (res) => {
                    this.$Message.success({content:　'修改成功'})
                    this.$emit('removeDialog')
                    this.$emit('okCallback')
                }, (msg) => {
                    this.$Message.error({content:　msg})
                })
            }
            })
        }
    }
}
</script>
<style>
.updaImge{width: 500px;height: 300px;background: #fff;padding: 10px;}
.allUpdata{ display: flex;justify-content: space-between;}
.updaBtn{display: flex;justify-content: space-around;}
.allUpdata-left img{width: 150px;height: 150px;}
</style>

