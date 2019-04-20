<template>
    <Card style="width:600px;padding-bottom: 50px;">
        <p slot="title">
            <span>{{state==='0'? $t('finance.kc') :$t('finance.cz')}}USSD</span>
            <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
        </p>
        <div class="detail">
            <p><label>{{$t('common.zje')}}：</label><span>{{data.totalBalance}}</span></p>
            <p><label>{{$t('common.kyye')}}：</label><span>{{data.availableBalance}}</span></p>
            <p><label>{{$t('common.djje')}}：</label><span>{{data.frozenBalance}}</span></p>
            <p><label>{{state==='0'? $t('finance.kc') :$t('finance.cz')}}{{$t('common.sl')}}：</label>
                <input autocomplete="off" spellcheck="false" type="Number"
                       :placeholder="state==='0'? $t('finance.czslxdy'):$t('finance.kcslxdy')" class="ivu-input"
                       style="width: 250px;" v-model="amount">
                <button type="button" class="ivu-btn ivu-btn-primary recharge-btn"
                        @click="submit()" :disabled="locked">
                    <span>{{$t('common.bc')}}</span></button>
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
                        this.recharge(this.amount, this.$t('finance.czcg'));
                    } else if (this.state === '1') {
                        if (Number(this.amount) > Number(this.data.availableBalance)) {
                            this.$Message.error({content: this.$t('finance.kcslxxydykyye')});
                            this.locked = false;
                        } else {
                            this.recharge(-this.amount, this.$t('finance.kccg'));
                        }
                    }
                } else {
                    this.$Message.error({content: this.$t('finance.czslxdy')});
                    this.locked = false;
                }
            },
            recharge (i, d) {
                financeApi.recordRecharge({accountId: this.id, availableBalance: i}, res => {
                    this.locked = false;
                    this.$Message.success({content: d});
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
