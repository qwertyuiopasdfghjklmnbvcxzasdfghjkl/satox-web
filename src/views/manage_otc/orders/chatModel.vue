<template>
    <Card style="width:500px;height:700px;overflow: auto;">
        <p slot="title">
            聊天记录
            <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
        </p>
        <div class="chat" v-for="data in data1" :key="data.id" :class="{right:leftUser!==data.userId}">
            <p class="chat-p">{{data.userRealName == null ? data.userName : data.userRealName}}</p>
            <div class="chat-div">{{data.message}}</div>
            <span class="chat-span">{{data.createdAt}}</span>
        </div>
        <div class="no-record" v-show="this.data1.length === 0">暂无聊天记录</div>
    </Card>
</template>

<script>
import otcApi from '../../../api/otc'
import util from '../../../libs/util'
export default {
    props: ['orderNumber', 'type'],
    data () {
        return {
            data: [],
            leftUser: null,
            data1: [],
        }
    },
    created () {
        this.getlistChatInfo()
    },
    methods: {
        closeDialog () {
            this.$emit('removeDialog')
        },
        getlistChatInfo () {
            otcApi.listChatInfo({
                orderNumber: this.orderNumber
            }, (res) => {
                if (this.type === 'chat') {
                    res.forEach((item) => {
                        if (item.isSystem) {
                            item.message = util.formatSystemMessage(item.message)
                        }
                    })
                }
                if (res.length) {
                    this.leftUser = res[0].userId
                }
                this.data1 = res
            })
        }
    }
}
</script>

<style>
.chat{margin-top: 10px;}
.chat-p{font-size:16px;font-weight:bold;}
.chat-div{padding-left:25px;}
.chat-span{padding-left:25px;}
.chat.right{float: right;overflow: hidden;width: 100%;text-align: right;padding-right: 10px;}
.chat.right .chat-div{margin-right: 15px;}
.chat.right .chat-span{margin-right: 25px;}
</style>
