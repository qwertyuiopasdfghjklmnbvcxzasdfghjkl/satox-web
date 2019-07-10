<template>
    <input ref="input" type="text" :maxlength="maxLength" :value="value" @input="updateValue"/>
</template>

<script>
    import util from '../../../libs/util';

    const regs = [
        /[0-9]+\.{0,1}[0-9]{0,0}/,
        /[0-9]+\.{0,1}[0-9]{0,1}/,
        /[0-9]+\.{0,1}[0-9]{0,2}/,
        /[0-9]+\.{0,1}[0-9]{0,3}/,
        /[0-9]+\.{0,1}[0-9]{0,4}/,
        /[0-9]+\.{0,1}[0-9]{0,5}/,
        /[0-9]+\.{0,1}[0-9]{0,6}/,
        /[0-9]+\.{0,1}[0-9]{0,7}/,
        /[0-9]+\.{0,1}[0-9]{0,8}/,
        /[0-9]+\.{0,1}[0-9]{0,9}/,
        /[0-9]+\.{0,1}[0-9]{0,10}/
    ];
    export default {
        props: {
            value: null,
            maxLength: {
                type: Number,
                default: 12
            },
            accuracy: {
                type: Number,
                default: 8
            },
            max: {
                type: Number,
                default: 9999999999
            }
        },
        data () {
            return {
                reg: regs[this.accuracy] || regs[0]
            };
        },
        watch: {
            accuracy (val) {
                this.reg = regs[val] || regs[0];
            }
        },
        methods: {
            updateValue () {
                let newPos = util.getCursortPosition(this.$refs.input);
                var newValue = this.$refs.input.value;
                var matches = newValue.match(this.reg);
                newValue = matches ? matches[0] : '';
                this.$refs.input.value = newValue;
                // newValue = newValue > this.max ? this.max : newValue;
                util.setCursortPosition(this.$refs.input, newPos);
                this.$emit('input', newValue);
            }
        }
    };
</script>
<style scoped>
    input {
        width: 100%;
        border: 1px solid red;
        height: 32px;
        line-height: 32px;
        padding: 0 7px;
        text-align: left;
        outline: 0;
        -moz-appearance: textfield;
        color: #666;
        border: 0;
        border-radius: 4px;
        transition: all .2s linear;
    }
</style>


