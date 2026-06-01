<template>
  <event-today v-if="filename === 'EventToday'"></event-today>

  <error404 v-else></error404>
</template>

<script>
import Error404 from '@/views/pages/Error404'
import EventToday from '@/views/pages/custom/EventToday'

export default {
  name : 'pages',
  components : {
    Error404, EventToday
  },
  data () {
    return {
      filename : ''
    }
  },

  created () {
    this.filename = this.$route.params.custom
  }
}
</script>

<style scoped>

</style>
