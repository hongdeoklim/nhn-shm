<template>
  <div>
    <vs-tabs :value="tabIndex">
      <vs-tab label="장비투입 입력" @click="moveTab('input')">
        <equipment-input/>
      </vs-tab>
      <vs-tab label="장비투입 현황" @click="moveTab('management')">
        <equipment-manager/>
      </vs-tab>
      <vs-tab label="산재발생현황" @click="moveTab('view')">
        <equipment-view-list/>
      </vs-tab>
    </vs-tabs>
  </div>
</template>

<script>
import EquipmentInput from '@/views/list/partner/equipment/EquipmentInput'
import EquipmentManager from '@/views/list/partner/equipment/EquipmentManager'
import EquipmentViewList from '@/views/list/partner/equipment/EquipmentViewList'
export default {
  name: 'Index',
  components: {EquipmentViewList, EquipmentManager, EquipmentInput},
  data () {
    return {
    }
  },
  created () {
    const breadcrumb = [
      {title: 'Home'},
      {title: '파트너사 일일보고'},
      {
        title: '장비투입 현황',
        active: true
      }
    ]

    this.$store.commit('menu/UPDATE_PAGE_LIST', breadcrumb)
  },
  computed: {
    tab () {
      return this.$route.params.tab
    },
    tabIndex () {
      if (this.tab === 'input') return 0
      if (this.tab === 'management') return 1
      if (this.tab === 'view') return 2
      return 0
    }
  },
  methods:{
    moveTab (tab) {
      if (tab !== this.$route.params.tab) {
        this.$router.push({path:`/project/${this.$route.params.proj_id}/list/partner_equipment/${tab}`})
      }
    }
  }
}
</script>

<style scoped>

</style>
