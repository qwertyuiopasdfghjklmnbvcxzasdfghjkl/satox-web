<template>
    <Card class="cont">
        <p slot="title">
            {{vm.$t('operation.xinzwz')}}
            <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
        </p>
        <div>
            <Row style="margin-bottom:20px;">
                <Col span="4">{{vm.$t('operation.ssyjmk')}}</Col>
                <Col span="18">
                    <Select v-model="form.firstLevel">
                        <Option :value="1">{{vm.$t('operation.ggjzx')}}</Option>
                        <Option :value="2">{{vm.$t('operation.yjnr')}}</Option>
                    </Select>
                </Col>
                <Col span="2">
                    <Button @click="tabRemark('firstLevel')">{{vm.$t('common.xg')}}</Button>
                </Col>
            </Row>
            <Row style="margin-bottom:20px;">
                <Col span="4">{{vm.$t('operation.ssejmk')}}</Col>
                <Col span="18">
                    <Select v-model="form.secondLevel">
                        <Option :value="1">{{vm.$t('operation.gg')}}</Option>
                        <Option :value="2">{{vm.$t('operation.zx')}}</Option>
                        <Option :value="3">{{vm.$t('operation.gywm')}}</Option>
                        <Option :value="4">{{vm.$t('operation.jy')}}</Option>
                        <Option :value="5">{{vm.$t('operation.bzzx')}}</Option>
                        <Option :value="6">{{vm.$t('operation.tksm')}}</Option>
                    </Select>
                </Col>
                <Col span="2">
                    <Button @click="tabRemark('secondLevel')">{{vm.$t('common.xg')}}</Button>
                </Col>
            </Row>
            <Row style="margin-bottom:20px;">
                <Col span="4">{{vm.$t('operation.zwbt')}}</Col>
                <Col span="18">
                    <Input v-model="form.titleCn" :max="100"></Input>
                </Col>
                <Col span="2">
                    <Button @click="tabRemark('titleCn')">{{vm.$t('common.xg')}}</Button>
                </Col>
            </Row>
            <Row style="margin-bottom:20px;">
                <Col span="4">{{vm.$t('operation.ywbt')}}</Col>
                <Col span="18">
                    <Input v-model="form.titleEn" :max="100"></Input>
                </Col>
                <Col span="2">
                    <Button @click="tabRemark('titleEn')">{{vm.$t('common.xg')}}</Button>
                </Col>
            </Row>

            <Row style="margin-bottom:20px;">
                <Col span="4">{{vm.$t('operation.zwzw')}}</Col>
                <Col span="18">
                    <wangeditor :catchData="bodyCnhData" :content="form.bodyCn"></wangeditor>
                </Col>
                <Col span="2">
                    <Button @click="tabRemark('bodyCn')">{{vm.$t('common.xg')}}</Button>
                </Col>
            </Row>
            <Row style="margin-bottom:20px;">
                <Col span="4">{{vm.$t('operation.ywzw')}}</Col>
                <Col span="18">
                    <wangeditor :catchData="bodyEnData" :content="form.bodyEn"></wangeditor>
                </Col>
                <Col span="2">
                    <Button @click="tabRemark('bodyEn')">{{vm.$t('common.xg')}}</Button>
                </Col>
            </Row>

            <Row style="margin-bottom:20px;">
                <Col span="4">{{vm.$t('common.zt')}}</Col>
                <Col span="18">
                    <Select v-model="form.state">
                        <Option :value="0">{{vm.$t('operation.wfb')}}</Option>
                        <Option :value="1">{{vm.$t('operation.yfb')}}</Option>
                    </Select>
                </Col>
                <Col span="2">
                    <Button @click="tabRemark('state')">{{vm.$t('common.xg')}}</Button>
                </Col>
            </Row>

        </div>
    </Card>
</template>

<script>
    import wangeditor from '../../my_components/wangeditor/wangeditor'
    import extendApi from '../../../api/extend'
    export default {
        props:['item'],
        components:{
            wangeditor
        },
        data(){
            const vm = window.vm
            return{
                vm: vm,
                form:{
                    firstLevel: 1,
                    secondLevel: 1,
                    titleCn: null,
                    titleEn: null,
                    bodyCn: null,
                    bodyEn: null,
                    state: 0,
                },
                data: {}
            }
        },
        created(){
            this.form = this.item
            let d = JSON.stringify(this.item)
            this.data = JSON.parse(d)
        },
        methods:{
            closeDialog(){
                this.$emit('okCallback');
                this.$emit('removeDialog')
            },
            bodyCnhData(data){
                this.form.bodyCn = data
            },
            bodyEnData(data){
                this.form.bodyEn = data
            },
            tabRemark(name){
                this.data[name] = this.form[name]
                extendApi.updataCms(this.data,res=>{
                    this.$Message.success({content: this.vm.$t('common.xgcg')});
                },msg=>{
                    this.$Message.error({content: msg});
                })
            }
        }
    }
</script>

<style scoped>
    .cont{
        width: 1000px;
    }
    .btn{
        margin: 10px auto;
        text-align: center;
    }
    button{
        margin-left:4px;
    }
</style>
