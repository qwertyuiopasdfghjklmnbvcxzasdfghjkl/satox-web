<template>
  <div class="uploading">
    <div class="uploading-container">
      <p>{{$t('public0.public188')}}</p>
    </div>
  </div>
</template>

<script>
</script>

<style>
.uploading{display: flex;justify-content: center;align-items: center;position: fixed;top: 0; right: 0;bottom: 0;left: 0;background-color: rgba(0, 0, 0, 0.5);}
.uploading-container{padding: 40px;background-color: #404b69;}
.uploading-container p{height: 30px;line-height: 30px;font-size: 16px;color: #becbe8;text-indent: 46px;background: url(../assets/images/loading.gif) no-repeat -8px center / 50px 50px;}
</style>
