<template>
    <!-- <div id="main" class="app-main"> -->
        <router-view></router-view>
    <!-- </div> -->
</template>

<script>
import Cookies from 'js-cookie';
import util from '@/libs/util';
    export default {
        data () {
            return {
                theme: this.$store.state.theme
            };
        },
        watch: {
            $route (to, from) {
                // 权限控制
                let actionCode = Cookies.get('permissions');
                let action = to.meta && to.meta.permission;
                if (action != undefined && !util.oneOf(action, actionCode)) {
                    this.$router.push({name: 'error_401'});
                }
            }
        },
        created () {
          this.$Message.config({
            duration: 3
          })
        },
        mounted () {

        },
        beforeDestroy () {

        },
        methods: {

        }
    };
</script>

<style>
.app-main{
    width: 100%;
    height: 100%;
}
</style>
