<template>
    <Card class="send_msg" style="width:500px;">
        <p slot="title">
            {{vm.$t('exchange.fsxx')}}
            <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
        </p>
        <span>{{vm.$t('exchange.bjxxnr')}}</span>
        <Input v-model="value5" type="textarea" :placeholder="vm.$t('exchange.srnr')"></Input>
        <Button type="ghost" @click="closeDialog">{{vm.$t('common.qx')}}</Button>
        <Button type="primary" @click="send_msg">{{vm.$t('kyc.fs')}}</Button>
    </Card>
</template>
<script>
    import currenyApi from '../../../api/currency';

    export default {
        props: ['userId'],
        data () {
            const vm = window.vm;
            return {
                vm: vm,
                value5: ''
            };
        },
        methods: {
            closeDialog () {
                this.$emit('removeDialog');
            },
            send_msg () {
                currenyApi.insertUserMessage(this.userId, this.value5, (res) => {
                    this.$Message.success({content: this.vm.$t('kyc.fscg')});
                    this.$emit('removeDialog');
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            }
        }
    };
</script>

<style lang="less">
    .send_msg {
        .cion {
            text-align: right;
            font-size: 14px;
            cursor: pointer;
            margin-right: 10px;
            margin-top: 5px;
        }

        .title {
            font-size: 14px;
            font-weight: bold;
            margin-left: 8px;
            text-align: left
        }

        .ivu-input-wrapper {
            text-align: center;
            width: 96%;
        }

        span {
            float: left;
            padding: 6px 0px;
        }

        textarea.ivu-input {
            margin-left: -10px;
        }

        [type=reset], [type=submit], button, html [type=button] {
            padding: 0px 10px;
            text-align: center;
            margin-top: 20px;
            margin-right: 10px;
        }
    }
</style>
