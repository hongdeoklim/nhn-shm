<template>
  <hse-monitoring />
</template>

<script>

import HseMonitoring from '@/views/graph-detail/HseMonitoring'
export default {
  components: {HseMonitoring},
  props: {
    isPrint: Boolean,
    board: Object,
    value: Object
  },
}
</script>

<style scoped>

</style>
