<template>
	<div class="page">
		<div class="box title">{{$t('ieo.subscription_user_agreement')}}<!-- IEO申购用户协议 --></div>
		<div class="inner"></div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
	data(){
		return {

		}
	},
	computed:{
		...mapGetters([]),
	},
	methods:{

	}

}
</script>

<style lang="less" scoped="">
@main-color:#BA8D35;
.page {
	margin:12px auto 42px;
	width:1100px;
	background-color: #1A1A1A;
	position: relative;
	.box {padding-left: 20px; padding-right: 20px;}
	.inner {padding: 20px;}
}
.title {background-color: #000; color: #fff; font-size: 18px; line-height: 50px;}
</style>