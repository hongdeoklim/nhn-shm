<template>
  <div>
    <vs-tabs :value="selectedTab">
      <vs-tab :label="tabs[0].label" @click="()=>{ handleChangeTab(tabs[0].key) }">
        <prevention-list v-if="!tabs[0].create && !tabs[0].update"
                         :boardId="tabs[0].boardId"
                         :boardSlug="tabs[0].boardSlug"
                         :tagKey="tabs[0].key"
                         @handleClickItem="handleClickItem"
                         @handleClickRegister="handleClickRegister"></prevention-list>
        <prevention-write v-else
                          :isUpdateMode="tabs[0].update"
                          :boardId="tabs[0].boardId"
                          :boardSlug="tabs[0].boardSlug"
                          :tagKey="tabs[0].key"
                          @handleBackMenu="handleBackMenu" ></prevention-write>
      </vs-tab>
      <vs-tab :label="tabs[1].label" @click="()=>{ handleChangeTab(tabs[1].key) }">
        <prevention-list v-if="!tabs[1].create && !tabs[1].update"
                         :boardId="tabs[1].boardId"
                         :boardSlug="tabs[1].boardSlug"
                         :tagKey="tabs[1].key"
                         @handleClickItem="handleClickItem"
                         @handleClickRegister="handleClickRegister"></prevention-list>
        <prevention-write v-else
                          :isUpdateMode="tabs[1].update"
                          :boardId="tabs[1].boardId"
                          :boardSlug="tabs[1].boardSlug"
                          :tagKey="tabs[1].key"
                          @handleBackMenu="handleBackMenu" ></prevention-write>
      </vs-tab>

      <vs-tab :label="tabs[2].label" @click="()=>{ handleChangeTab(tabs[2].key) }">
        <prevention-total/>
      </vs-tab>
    </vs-tabs>
  </div>
</template>

<script>
import PreventionTotal from '@/views/project/prevention/total/PreventionTotal'
import PreventionList from '@/views/project/prevention/PreventionList'
import PreventionWrite from '@/views/project/prevention/PreventionWrite'

export default {
  name: 'Request',
  components: {
    PreventionWrite,
    PreventionList,
    PreventionTotal,
  },
  data () {
    return {
      rootPath: '', // 프로젝트의 rootPath
      selectedTab: -1,
      tabs: [
        {
          label: '안전',
          key: 'safety',
          boardId: 36,
          boardSlug: 'safety_request',
          create: false,
          update: false
        },
        {
          label: '보건',
          key: 'health',
          boardId: 40,
          boardSlug: 'health_request',
          create: false,
          update: false
        },
        {
          label: '형태별 분류',
          key: 'total',
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
        this.$router.push({path: `${this.rootPath}/prevention/request/${tab}`})
      }
    },

    handleClickRegister (tab) {
      this.$router.push({path: `${this.rootPath}/prevention/request/${tab}/create`})
    },

    handleClickItem (tab, id) {
      this.$router.push({path: `${this.rootPath}/prevention/request/${tab}/${id}`})
    },

    handleBackMenu (tab) {
      this.$router.push({path: `${this.rootPath}/prevention/request/${tab}`})
    }

  }
}
</script>

<style scoped>

</style>
