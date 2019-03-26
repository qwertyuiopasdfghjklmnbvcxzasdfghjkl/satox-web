<template>
    <div class="add_order">
        <Card style="width:800px;">
            <p slot="title">
                修改Nounce值
                <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
            </p>
            <Row style="border-bottom:1px solid #e9eaec;height:30px; line-height:30px;">
                <Col span="5">ETH地址</Col>
                <Col span="10">{{this.item.address}}</Col>
                <Col span="6"></Col>
            </Row>
            <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:45px; line-height:40px;">
                <Col span="5">Nounce值</Col>
                <Col span="8">{{this.item.nonce}}</Col>
                <Col span="8">
                    <InputNumber  v-model="nonce" :step="1" :precision="0" style="width: 180px"></InputNumber>
                </Col>
                <Col span="3">
                    <Button type="primary" @click="tabs('nonce')">保存</Button>
                </Col>
            </Row>
        </Card>
    </div>
</template>
<script>
    import monitApi from '../../api/monitoring';

    export default {
        props: ['item'],
        data () {
            return {
                nonce: null
            };
        },
        created () {
        },
        methods: {
            closeDialog () {
                this.$emit('removeDialog');
            },
            tabs (propName) {
                if (!this[propName]) {
                    this.$Message.error({content: '不能为空'});
                    return;
                }
                let data = {
                    address: this.item.address,
                    nonce: this.nonce
                };
                monitApi.findUpdataETHNonce(data, (res) => {
                    this.$Message.success({content: '修改成功'});
                    this.$emit('okCallback');
                    this.closeDialog();
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            }
        }
    };
</script>
<style lang="less" scoped>
    .add_order {
        .title {
            position: relative;
            height: 30px;
            line-height: 30px;
            background: #2d8cf0;
            color: #fff;
            font-size: 16px;
            text-align: center;

            span {
                font-size: 18px;
                cursor: pointer;
                position: absolute;
                right: 10px;
                top: 2px;
            }
        }

        .ivu-form .ivu-form-item-label {
            color: #000;
            font-size: 13px;
        }

        .ivu-form-item {
            margin-top: 10px;
        }

        .ivu-input {
            width: 88%;
        }

        .ivu-form .ivu-form-item-label {
            padding-left: 10px;
        }

        .ivu-btn-primary {
            display: flex;
            margin: 0 auto;
            margin-bottom: 10px;
        }

        .ivu-form-item {
            margin-bottom: 10px;
        }
    }
</style>
