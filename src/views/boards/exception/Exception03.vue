<template>
  <div>

    <search-nav @handleSearch="handleSearch">
      <search-nav-item-keyword label="키워드" v-model="nav.keyword"></search-nav-item-keyword>
    </search-nav>

    <popup-search-member v-model="popupActive" :enabledJoin="true" @handleClickSelect="handleClickSelect"/>

    <template-list-normal
      class="mb-6"
      :list="memberList"
      :perPageOption="perPageOption"
      :perPage="Number(perPage)"
      :currentPage="currentPage"
      :lastPage="lastPage"
      :enablePerPageDropDown="false"
      :hideAdd="true"

      @handleChangePerPage="handleChangePerPage"
      @handleItemClickDetail="handleItemClickDetail"
      @handleChangePage="handleChangePage"
      @handleClickRegister="handleClickRegister">
    </template-list-normal>
  </div>
</template>

<script>
import PopupSearchMember from '@/popup/PopupSearchMember'
import TemplateListNormal from '@/views/project/plan/proj/template/TemplateListNormal'
import TemplateListPhoto from '@/views/project/plan/proj/template/TemplateListPhoto'
import SearchNav from '@/components/nav/SearchNav'
import SearchNavItemKeyword from '@/components/nav/SearchNavItemKeyword'

export default {
  name: 'Exception03',
  components: {
    SearchNavItemKeyword,
    SearchNav,
    PopupSearchMember,
    TemplateListNormal,
    TemplateListPhoto
  },
  data () {
    return {
      nav: {
        keyword:''
      },

      listType: 'l',
      popupActive: false,
      searchKeyword: '',
      memberList: [],
      perPage: 10,
      perPageOption: '10,20,30',
      lastPage: 1,
      currentPage: 1

    }
  },

  created () {
    this.loadMember()
  },

  methods: {

    async loadMember () {
      const page = 1
      const perPage = 30
      const projectId = this.$route.params.proj_id
      const keyword = this.nav.keyword

      await this.$store.dispatch('project/LOAD_PROJECT_USER', {
        page,
        perPage,
        projectId,
        keyword
      })
      const memberList = JSON.parse(JSON.stringify(this.$store.state.project.projectUserList))
      this.memberList = memberList
    },

    async addMember (member) {
      const projectId = this.$route.params.proj_id
      const user_ids = member.id
      await this.$store.dispatch('project/ADD_PROJECT_USER', {projectId, user_ids})
      await this.loadMember()
    },

    changeListType (listType) {
      this.listType = listType
    },

    popupActiveSync () {
      this.popupActive = false
    },

    handleSearch () {
      this.currentPage = 1
      this.loadMember()
    },

    // perPage 드롭다운 선택값 변경시 호출
    handleChangePerPage (_data) {
    },

    // 리스트 선택시 호출
    handleItemClickDetail (_data) {
    },

    // 페이지 클릭
    handleChangePage (page) {
    },

    handleClickRegister () {
      this.popupActive = true
    },

    handleClickSelect (member) {
      this.addMember(member)
    }
  }
}
</script>

<style scoped>

</style>
