<template>
  <div class="helpecenter">
      <div class="helpe-botton">
          <helpeleft />
          <helpecont />
      </div>
  </div>
</template>
<script>
import helpeleft from '@/exchanges/helpe/helpeleft'
import helpecont from '@/exchanges/helpe/helpecont'
export default {
  components: {
    helpeleft,
    helpecont
  }
}
</script>
<style scoped>
.helpecenter{width: 100%;height: 100vh;}
.helpecenter .helpe-botton{display: flex;height: 100%;}
</style>

