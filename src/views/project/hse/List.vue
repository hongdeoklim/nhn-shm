<template>
  <div>
    <vs-tabs :value="selectedTab">

      <vs-tab :label="tabs[0].label" @click="()=>{ handleChangeTab(tabs[0].key) }">
        <safety-create v-if="tabs[0].create" @handleBackMenu="handleBackMenu"/>
        <safety-update v-else-if="tabs[0].update" @handleBackMenu="handleBackMenu"/>
        <safety-list v-else @handleClickRegister="handleClickRegister"/>
      </vs-tab>

      <vs-tab :label="tabs[1].label" @click="()=>{ handleChangeTab(tabs[1].key) }">
        <health-create v-if="tabs[1].create" @handleBackMenu="handleBackMenu"/>
        <health-update v-else-if="tabs[1].update" @handleBackMenu="handleBackMenu"/>
        <health-list v-else @handleClickRegister="handleClickRegister"/>
      </vs-tab>

    </vs-tabs>
  </div>
</template>

<script>
import SafetyList from './safety/SafetyList'
import EnvironmentList from './environment/EnvironmentList'
import HealthList from './health/HealthListList'
import SafetyCreate from '@/views/project/hse/safety/SafetyCreate'
import SafetyUpdate from '@/views/project/hse/safety/SafetyUpdate'
import EnvironmentCreate from '@/views/project/hse/environment/EnvironmentCreate'
import EnvironmentUpdate from '@/views/project/hse/environment/EnvironmentUpdate'
import HealthCreate from '@/views/project/hse/health/HealthCreate'
import HealthUpdate from '@/views/project/hse/health/HealthUpdate'

export default {
  name: 'List',
  components: {
    HealthUpdate,
    HealthCreate,
    EnvironmentUpdate,
    EnvironmentCreate,
    SafetyUpdate,
    SafetyCreate,
    HealthList,
    EnvironmentList,
    SafetyList
  },
  data () {
    return {
      rootPath: '', // 프로젝트의 rootPath
      selectedTab: -1,
      tabs: [
        {
          label: '안전교육',
          key: 'safety',
          create: false,
          update: false
        },
        {
          label: '보건교육',
          key: 'health',
          create: false,
          update: false
        }
      ]
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
        //this.$router.push({ path: '../' })
      }
    },

    handleChangeTab (tab) {
      if (this.$route.params.tab !== tab) {
        this.$router.push({path: `${this.rootPath}/hse/list/${tab}`})
      }
    },

    handleClickRegister (tab) {
      this.$router.push({path: `${this.rootPath}/hse/list/${tab}/create`})
    },

    handleClickItem (tab, id) {
      this.$router.push({path: `${this.rootPath}/hse/list/${tab}/${id}`})
    },

    handleBackMenu (tab) {
      this.$router.push({path: `${this.rootPath}/hse/list/${tab}`})
    }

  }
}
</script>

<style scoped>

</style>
