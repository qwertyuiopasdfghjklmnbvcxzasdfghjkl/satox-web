<template>
    <Card style="width:600px;padding-bottom: 50px;">
        <p slot="title">
            <span>{{state==='0'?'增加':'扣除'}}SATO</span>
            <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
        </p>
        <div class="detail">
            <p><label>总金额：</label><span>{{data.totalBalance}}</span></p>
            <p><label>可用余额：</label><span>{{data.availableBalance}}</span></p>
            <p><label>冻结金额：</label><span>{{data.frozenBalance}}</span></p>
            <p><label>{{state==='0'?'充值':'扣除'}}数量：</label>
                <input autocomplete="off" spellcheck="false" type="Number"
                       :placeholder="state==='0'?'增加数量需大于0':'扣除数量需大于0'" class="ivu-input"
                       style="width: 250px;" v-model="amount">
                <button type="button" class="ivu-btn ivu-btn-primary recharge-btn"
                        @click="submit()" :disabled="locked">
                    <span>保存</span></button>
            </p>
        </div>
    </Card>
</template>

<script>
    import financeApi from '../../../api/finance';

    export default {
        props: ['id', 'state'],
        data () {
            return {
                data: {},
                amount: '',
                locked: false
            };
        },
        created () {
            this.getAccount();
        },
        methods: {
            submit () {
                if (Number(this.amount) > 0) {
                    this.locked = true;
                    if (this.state === '0') {
                        this.add();
                    } else if (this.state === '1') {
                        if (Number(this.amount) > Number(this.data.availableBalance)) {
                            this.$Message.error({content: '扣除数量需小于等于可用余额'});
                            this.locked = false;
                        } else {
                            this.deduct();
                        }
                    }
                } else {
                    this.$Message.error({content: '增加数量需大于0'});
                    this.locked = false;
                }
            },
            add () {
                financeApi.recordRecharge({accountId: this.id, availableBalance: this.amount}, res => {
                    this.locked = false;
                    this.$Message.success({content: '增加成功'});
                    this.$emit('okCallback');
                    this.$emit('removeDialog');
                }, msg => {
                    this.locked = false;
                    this.$Message.error({content: msg});
                });
            },
            deduct () {
                financeApi.recordRecharge({accountId: this.id, availableBalance: this.amount}, res => {
                    this.locked = false;
                    this.$Message.success({content: '扣除成功'});
                    this.$emit('okCallback');
                    this.$emit('removeDialog');
                }, msg => {
                    this.locked = false;
                    this.$Message.error({content: msg});
                });
            },
            getAccount () {
                financeApi.findUSDSRechargeRecord({accountId: this.id}, rdata => {
                    this.data = rdata;
                });
            },
            closeDialog () {
                this.$emit('removeDialog');
            }
        }
    };
</script>

<style>
    .detail p {
        font-size: 16px;
        margin-top: 20px;
        position: relative;
    }

    .detail label {
        display: inline-block;
        width: 150px;
    }

    .recharge-btn {
        position: absolute;
        right: 50px;
    }
</style>
