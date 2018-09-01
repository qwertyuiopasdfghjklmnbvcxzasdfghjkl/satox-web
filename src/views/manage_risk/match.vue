<!-- 撮合异常监控 -->
<template>
  <div>
    <Card>
      <p slot="title">撮合异常监控</p>
      <Card>
        <p slot="title">撮合异常</p>
        <Table :columns="columns1" :data="data1"></Table>
      </Card>
      <Card style="margin-top:16px;">
        <p slot="title">撮合性能</p>
        <Table :columns="columns2" :data="data2"></Table>
      </Card>
    </Card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      columns1: [
        {
          title: '时间',
          key: 'time'
        },
        {
          title: '异常情况',
          key: 'abnormal'
        },
        {
          title: '操作',
          render: (h, params) => {
            return h('Button', {
              props: {type: 'primary', size: 'small'},
              on: {
                click: () => {
                }
              }
            }, '忽略')
          }
        }
      ],
      data1: [
        {
          time: '2018-07-28 10:35:03',
          abnormal: '交易异常'
        }
      ],
      columns2: [
        {
          title: '时间',
          key: 'time'
        },
        {
          title: '日峰值TPS',
          key: 'dayPeakValue'
        },
        {
          title: '5MTPS',
          key: 'minutePeakValue'
        },
        {
          title: '1HTPS',
          key: 'hourPeakValue'
        },
        {
          title: '1DTPS',
          key: 'dayPeakValue'
        }
      ],
      data2: [
        {
          time: '2018-07-28 10:35:03',
          dayPeakValue: '20',
          minutePeakValue: '20',
          hourPeakValue: '20',
        }
      ],
    }
  }
}
</script>

<style lang="less">
</style>
