<template>
  <div>
    <table-list-page
      ref="table"
      :board-id="52"

      :moveNew="false"
      :moveDetail="false"
      :download="false"
      :approval="false"
      :nav="nav"
      :heads="heads"
      :getCol="getCol"
      :create="parseInt(`${myLv}`) <= 3"
      create-btn-label="등록 요청"

      @new="onClickNew"
      @detail="onClickDetail"
    >
      <template #search>
        <search-nav-item-keyword class="mr-2" label="업체명" v-model="nav.com_name"/>
        <search-nav-item-keyword class="mr-2" label="사업명" v-model="nav.title"/>
      </template>
    </table-list-page>
  </div>
</template>

<script>
import TableListPage from '@/views/list/TableListPage'
import SearchNavItemSelect from '@/components/nav/SearchNavItemSelect'
import SearchNavStartEnd from '@/components/nav/SearchNavStartEnd.vue'
import SearchNavItemKeyword from '@/components/nav/SearchNavItemKeyword'
import PopupPartnerAgreementAdd from '@/views/project/popup/PopupPartnerAgreementAdd'
export default {
  name: 'PartnersJoin',
  components: {
    PopupPartnerAgreementAdd,
    SearchNavItemKeyword,
    SearchNavStartEnd,
    SearchNavItemSelect,
    TableListPage},
  data () {
    return {
      rootPath:'',
      popupActive: false,
      nav: {
        orderTarget: 'created_at',
        orderDirection: 'desc',
        com_name: '',
        title:'',
        keyword: [
          'content$partnerInfo.com_name*%[:nav.com_name]%',
          'content$partnerInfo.title*%[:nav.title]%'
        ]
      },
      heads: [
        {name: '현장명'},
        {name: '사업명'},
        {name: '부서'},
        {name: '작성자'},
        {name: '업체명'},
        {name: '작성일'},
        {name: '첨부문서'}
      ]
    }
  },
  computed: {
    myLv () {
      return this.$store.state.auth.userInfo.position
    },
  },
  created () {
    const paths = this.$route.path.split('/')
    this.rootPath = `/${paths[1]}/${paths[2]}`
  },
  methods:{
    loadPost () {
      this.$refs.table.loadList()
    },
    onClickNew () {
      this.$router.push({path: `${this.rootPath}/plan/partners/join/write`})
    },
    onClickDetail (value) {
      this.$router.push({path: `${this.rootPath}/plan/partners/join/write/${value.No}`})
    },
    popupActiveSync () {
      this.popupActive = false
    },
    getCol (index, value) {
      const content = this.getContent(value)
      const files = []
      const file1 = content.fileInfo.businessRegistration ? content.fileInfo.businessRegistration.path : ''
      const file2 = content.fileInfo.etc ? content.fileInfo.etc.path : ''
      if (file1) files.push({path:file1})
      if (file2) files.push({path:file2})
      switch (index) {
        case 0: return this.getContent(value).requesterInfo.projectName
        case 1: return this.getContent(value).partnerInfo.title
        case 2: return this.getContent(value).requesterInfo.team_name
        case 3: return this.getContent(value).requesterInfo.writer
        case 4: return this.getContent(value).partnerInfo.com_name
        case 5: return new Date(value.created_at).format('yyyy-MM-dd')
        case 6: return {
          type: 'file',
          files
        }
      }
      return ''
    },
    getContent (data) {
      if (data.post_content) {
        const content = JSON.parse(data.post_content)
        return content
      }
    },

    comma (str) {
      str = `${str}`
      if (str && str.length > 0) {
        return str.replace(/,/gi, '').replace(/\B(?=(\d{3})+(?!\d))/gi, ',')
      }
    },

    onClickAdd () {
      this.loadPost()
    }
  }
}
</script>

<style scoped>

</style>
