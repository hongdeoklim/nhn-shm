<template>
  <div>
    <plan-calendar
      @handleSelectDay="handleSelectDay"
      @handleClickItem="handleClickItem"
    />
  </div>
</template>

<script>
import VueCookie from 'vue-cookie'
import PlanCalendar from '@/views/project/safety/equipment/PlanCalendar'

export default {
  name: 'Equipment',
  components: {
    PlanCalendar
  },
  data () {
    return {
      tabs: [
        {
          label: '장비점검 계획',
          key: 'plan',
          create: false,
          update: false
        },
        {
          label: '장비점검 결과',
          key: 'result',
          create: false,
          update: false
        }
      ],
      selectDay:null
    }
  },
  created () {

  },

  methods: {
    handleSelectDay (date) {
      this.selectDay = date
    },

    handleClickItem (tab, id, raw) {
      this.$router.push({path: `/project/${raw.project_id}/safety/equipment/plan/${raw.post.id}`})
    },

    handleBackMenu (tab) {
      this.$router.push({path: `${this.rootPath}/safety/equipment/${tab}`})
    }
  }
}
</script>

<style scoped>

</style>
