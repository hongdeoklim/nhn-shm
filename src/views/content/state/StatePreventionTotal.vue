<template>
  <div>

    <search-nav @handleSearch="handleSearch">
      <search-nav-item-date :label="$t('search.대상기간')" v-model="nav.date"/>
      <search-nav-item-project :label="$t('search.현장명')" v-model="nav.projectId"  />
    </search-nav>

    <vs-row class="border">
      <vs-col>
        <div class="border-top border-left border-right table-display">
          <span class="title table-center">{{$t('content.state.prevention.total.table.현장명')}}</span>
          <span class="title table-center border-left">{{$t('content.state.prevention.total.table.대기')}}</span>
          <span class="title table-center border-left">{{$t('content.state.prevention.total.table.수질')}}</span>
          <span class="title table-center border-left">{{$t('content.state.prevention.total.table.폐기물')}}</span>
          <span class="title table-center border-left">{{$t('content.state.prevention.total.table.소음')}}</span>
          <span class="title table-center border-left">{{$t('content.state.prevention.total.table.진동')}}</span>
          <span class="title table-center border-left">{{$t('content.state.prevention.total.table.토양')}}</span>
          <span class="title table-center border-left">{{$t('content.state.prevention.total.table.기타')}}</span>
          <span class="title table-center border-left">{{$t('content.state.prevention.total.table.합계')}}</span>
        </div>
      </vs-col>
    </vs-row>


    <vs-row class="">
      <vs-col class="border-bottom">
        <div class="border-top border-left border-right table-display table-content"
             :data="tr" :key="indextr" v-for="(tr, indextr) in table">
          <span class="table-center">{{ tr.field_name }}</span>
          <span class="table-center border-left">{{ (tr.occur_type_1) ? tr.occur_type_1 : 0 }}</span>
          <span class="table-center border-left">{{ (tr.occur_type_2) ? tr.occur_type_2 : 0 }}</span>
          <span class="table-center border-left">{{ (tr.occur_type_3) ? tr.occur_type_3 : 0 }}</span>
          <span class="table-center border-left">{{ (tr.occur_type_4) ? tr.occur_type_4 : 0 }}</span>
          <span class="table-center border-left">{{ (tr.occur_type_5) ? tr.occur_type_5 : 0 }}</span>
          <span class="table-center border-left">{{ (tr.occur_type_6) ? tr.occur_type_6 : 0 }}</span>
          <span class="table-center border-left">{{ (tr.occur_type_7) ? tr.occur_type_7 : 0 }}</span>
          <span class="table-center border-left">{{ (tr.sum) ? tr.sum : 0 }}</span>
        </div>
      </vs-col>
    </vs-row>


  </div>
</template>

<script>
import SearchNav from '@/components/nav/SearchNav'
import SearchNavItemKeyword from '@/components/nav/SearchNavItemKeyword'
import SearchNavItemDate from '@/components/nav/SearchNavItemDate'
import SearchNavItemProject from '@/components/nav/SearchNavItemProject'

export default {
  name: 'StatePreventionTotal',
  components: {
    SearchNavItemProject,
    SearchNavItemDate,
    SearchNavItemKeyword,
    SearchNav
  },
  data () {
    return {
      rootPath: '',

      // 검색 네비게이션
      nav: {
        projectId: '',
        date: ['', ''],
        keyword: '',
        dateTarget:'content$preview.occur_date',
      },

      table: []
    }
  },

  created () {
    const paths = this.$route.path.split('/')
    this.rootPath = `/${paths[1]}/${paths[2]}`
    this.loadPostList()
  },

  methods: {
    async loadPostList () {
      const projectId = this.nav.projectId
      const boardId = 39
      const boardSlug = 'environment_request'
      const page = 1
      const perPage = 10000
      const dateTarget = []
      const dateBegin = []
      const dateEnd = []
      if (this.nav.dateTarget) dateTarget.push(this.nav.dateTarget)
      if (this.nav.date[0]) dateBegin.push(this.nav.date[0])
      if (this.nav.date[1]) dateEnd.push(this.nav.date[1])

      await this.$store.dispatch('approval/LOAD_POST_ALL', {
        projectId,
        boardId,
        boardSlug,
        page,
        perPage,
        dateTarget,
        dateBegin,
        dateEnd
      })

      const postListInfo = this.$store.state.approval.postListInfo
      const list = postListInfo.data
      const data = []
      for (const item of list) {
        const field_name = this.getPreview(item).field_name
        const occur_type = this.getPreview(item).occur_type

        if (!data[field_name]) data[field_name] = {}
        data[field_name]['field_name'] = field_name

        if (occur_type) {
          const sum = (data[field_name][occur_type]) ? data[field_name][occur_type] : 0
          data[field_name][occur_type] = (sum + 1)

          const all = (data[field_name]['sum']) ? (data[field_name]['sum']) : 0
          data[field_name]['sum'] = (all + 1)
        }
      }

      this.table = []
      const keys = Object.keys(data)
      for (const key of keys) {
        this.table.push(data[key])
      }
    },

    getPreview (data) {
      if (data.post.preview) {
        const preview = JSON.parse(data.post.preview)
        return preview
      }
    },

    handleSearch () {
      this.loadPostList()
    }
  }
}
</script>

<style scoped>
.table-display {
  display: grid;
  grid-template-rows: minmax(52px, 100%);
  grid-template-columns: 2fr repeat(8, minmax(0, 1fr));
}

.table-content {
  background-color: white;
}

.table-center {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
}
</style>
