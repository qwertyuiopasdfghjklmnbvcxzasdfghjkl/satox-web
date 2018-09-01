<template>
  <Table :columns="columns" :data="datas" :show-header="false"></Table>
</template>

<script>
export default {
  props: ['row'],
  data () {
    return {
        columns: [
            {title: '空格', key: '$space', width: 50},
            {title: '币种', key: 'alias'},
            {title: '总额', key: 'available'},
            {title: '可用余额', key: 'available'},
            {title: '冻结余额', key: 'available'}
        ],
        datas: [{alias: 'BTC01', available: '0.1534818'}, {alias: 'BTC02', available: '0.1534818'}]
    }
  }
}
</script>
