<template>
  <div class="uploading">
    <div class="uploading-container">
      <p>
        <loading :size="50"></loading>
        <span>{{$t('public0.public188')}}</span>
      </p>
    </div>
  </div>
</template>

<script>
import loading from '@/components/loading'
export default {
  components: {
    loading
  }
}
</script>

<style scoped>
.uploading{display: flex;justify-content: center;align-items: center;position: fixed;top: 0; right: 0;bottom: 0;left: 0;background-color: rgba(0, 0, 0, 0.5);}
.uploading-container{padding: 40px;background-color: #404b69;}
.uploading-container p{height: 30px;line-height: 30px;font-size: 16px;color: #becbe8;display:flex;align-items:center;}
.uploading-container div{margin-right:10px;}
</style>
