<template>
  <div>
    <result-list
      @handleClickItem="handleClickItem"
      @handleClickRegister="handleClickRegister"
    />
  </div>
</template>

<script>
import VueCookie from 'vue-cookie'
import ResultList from '@/views/content/safety/SafetyEquipmentCheck'

export default {
  name: 'Equipment',
  components: {
    ResultList
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

    handleClickRegister (tab) {
      if (this.selectDay) {
        VueCookie.set('equipment_create_selectday', new Date(this.selectDay).format('yyyy-MM-dd'))
      }
      this.$router.push({path: `${this.rootPath}/safety/equipment/${tab}/create`})
    },

    handleClickItem (tab, id) {
      this.$router.push({path: `${this.rootPath}/safety/equipment/${tab}/${id}`})
    },

    handleBackMenu (tab) {
      this.$router.push({path: `${this.rootPath}/safety/equipment/${tab}`})
    }
  }
}
</script>

<style scoped>

</style>
