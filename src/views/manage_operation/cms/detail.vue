<template>
    <div class="box">
        <p class="top-title">
            <span>{{vm.$t('operation.wzyl')}}</span>
            <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
        </p>
        <p class="btn">
            <label @click="show=true" :class="{active: show}">{{vm.$t('operation.zwyl')}}</label>
            <label @click="show=false" :class="{active: !show}">{{vm.$t('operation.ywyl')}}</label>
        </p>
        <div class="cont" v-if="show">
            <p class="title">{{item.titleCn}}</p>
            <p class="small">{{item.createdAt}}</p>
            <div v-html="item.bodyCn"></div>
        </div>
        <div class="cont" v-if="!show">
            <p class="title">{{item.titleEn}}</p>
            <p class="small">{{item.createdAt}}</p>
            <div v-html="item.bodyEn"></div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['item'],
        data(){
            const vm = window.vm
            return{
                vm: vm,
                show: true
            }
        },
        methods:{
            closeDialog(){
                this.$emit('removeDialog')
            }
        }
    }
</script>

<style scoped lang="less">
    .box{
        width: 1000px;
        padding-top: 40px;
        position: relative;
        border-radius:4px;
        overflow: hidden;
        .top-title{
            position: absolute;
            top: 0;
            left: 0;
            height: 40px;
            width: 100%;
            line-height: 20px;
            border-bottom: 1px solid #cecece;
            background: #FFFFFF;
            z-index: 9;
            padding: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 16px;
        }
        .btn{
              background: #FFFFFF;
            padding: 10px;
            label{
                padding: 3px 8px;
                border-radius:2px;
                background: #c8dcdb;
                &.active{
                    background: #2d8cf0;
                    color: #FFFFFF;
                }
            }
          }
    }
.cont{
    background: #19181c;
    color: #FFFFFF;
    font-size: 14px;
    max-height: 80vh;
    min-height: 200px;
    overflow-y: auto;
    padding: 20px;
    .title{
        font-size: 18px;
    }
    .small{
        font-size: 14px;
        padding: 10px;
    }
    p{
        text-align: center;
    }

}
</style>
