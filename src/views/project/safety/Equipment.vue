<template>
  <div>
    <vs-tabs :value="selectedTab">
      <vs-tab :label="tabs[0].label" @click="()=>{ handleChangeTab(tabs[0].key) }">
        <plan-create
          v-if="tabs[0].create"
          @handleBackMenu="handleBackMenu"
        />
        <plan-update
          v-else-if="tabs[0].update"
          @handleBackMenu="handleBackMenu"
        />
        <plan-calendar
          v-else
          @handleSelectDay="handleSelectDay"
          @handleClickItem="handleClickItem"
          @handleClickRegister="handleClickRegister"
        />
      </vs-tab>
      <vs-tab :label="tabs[1].label" @click="()=>{ handleChangeTab(tabs[1].key) }">
        <plan-create
          v-if="tabs[1].create"
          @handleBackMenu="handleBackMenu"
        />
        <plan-update
          v-else-if="tabs[1].update"
          @handleBackMenu="handleBackMenu"
        />
        <result-list
          v-else
          @handleClickItem="handleClickItem"
          @handleClickRegister="handleClickRegister"
        />
      </vs-tab>
    </vs-tabs>
  </div>
</template>

<script>
import ResultList from './equipment/ResultList'
import PlanCalendar from './equipment/PlanCalendar'
import PlanCreate from '@/views/project/safety/equipment/PlanCreate'
import PlanUpdate from '@/views/project/safety/equipment/PlanUpdate'
import VueCookie from 'vue-cookie'

export default {
  name: 'Equipment',
  components: {
    PlanCreate,
    PlanUpdate,
    PlanCalendar,
    ResultList
  },
  data () {
    return {
      rootPath: '', // 프로젝트의 rootPath
      selectedTab: -1,
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

    const paths = this.$route.path.split('/')
    this.rootPath = `/${paths[1]}/${paths[2]}`

    this.checkPage()
  },

  methods: {
    // 리스트 / 상세 페이지 조절
    checkPage () {
      for (const index in this.tabs) {

        // 리스트 페이지를 보여주게 설정
        this.tabs[index].create = false
        this.tabs[index].update = false

        // 탭 변경
        if (this.$route.params.tab) {
          if (this.tabs[index].key === this.$route.params.tab) {
            this.selectedTab = index
          }


          if (this.$route.params.postId) {
            if (this.$route.params.postId === 'create') {
              // 작성페이지로 진입해야하는 경우
              this.tabs[index].create = true
              this.tabs[index].update = false

            } else {
              // 상세페이지로 진입해야하는 경우
              this.tabs[index].create = false
              this.tabs[index].update = true
            }
          }

        }
      }

      // 선택된 탭이 없다면 잘못 된 경로로 진입한 것으로 판단 (뒤로 이동)
      if (this.selectedTab === -1) {
        this.$router.push({path: '../'})
      }
    },
    handleChangeTab (tab) {
      if (this.$route.params.tab !== tab) {
        this.$router.push({path: `${this.rootPath}/safety/equipment/${tab}`})
      }
    },
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
