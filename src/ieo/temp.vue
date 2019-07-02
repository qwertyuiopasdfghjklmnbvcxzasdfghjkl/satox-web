<template>
	<div class="page">
		
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
}
.title {background-color: #000; color: #fff; font-size: 18px; line-height: 50px;}
</style>