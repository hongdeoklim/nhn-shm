<template>
  <div>

    <search-nav @handleSearch="handleSearch">
      <search-nav-item-date label="대상기간" v-model="nav.date" @handleSearch="handleSearch"/>
    </search-nav>

    <div class="border border-top border-left border-right pb-2" style="overflow-x: auto;">
      <vs-row >
        <vs-col>
          <div class="table-display" :style="{gridTemplateColumns:`1fr repeat(${disasterList.length +1 }, 1fr)`}" >
            <span class="title table-center" style="min-width:120px;">현장명</span>
            <span class="title table-center border-left" style="min-width:80px;">합계</span>
            <span v-for="(disaster, index) in disasterList" :key="index"
                  class="title table-center border-left" style="min-width:80px; text-align: center;" >
            {{disaster.text}}
            </span>
          </div>
        </vs-col>
      </vs-row>

      <vs-row class="">
        <vs-col>
          <div class="table-display"
               :style="{gridTemplateColumns:`1fr repeat(${disasterList.length +1}, 1fr)`, boardTop:'1px solid'}"
               :data="tr" :key="indextr" v-for="(tr, indextr) in table">
            <span class="table-center border-top border-bottom " style="min-width:120px;">{{ tr.field_name }}</span>
            <span class="table-center border-top border-bottom  border-left" style="min-width:80px;">{{ (tr.sum) ? tr.sum : 0 }}</span>
            <span v-for="(disaster, index) in disasterList" :key="index"
                  class="table-center border-top border-bottom border-left" style="min-width:80px;">{{ (tr[`occur_${disaster.value}`]) ? tr[`occur_${disaster.value}`] : 0 }}</span>
          </div>
        </vs-col>
      </vs-row>
    </div>


  </div>
</template>

<script>
import SearchNav from '@/components/nav/SearchNav'
import SearchNavItemKeyword from '@/components/nav/SearchNavItemKeyword'
import SearchNavItemDate from '@/components/nav/SearchNavItemDate'

export default {
  name: 'PreventionTotalList',
  components: {
    SearchNavItemDate,
    SearchNavItemKeyword,
    SearchNav
  },
  props: {
    boardId: Number,
    boardSlug: String,
    tagKey: String
  },
  data () {
    return {
      rootPath: '',

      // 검색 네비게이션
      nav: {
        date: ['', ''],
        keyword: '',
        dateTarget:'content$preview.occur_date'
      },

      table: []
    }
  },

  computed: {
    disasterList () {
      const list = this.$store.state.approval.disasterTypeList
      const returnList = []
      for (const item of list) {
        returnList.push({
          text:item.name,
          value:item.id
        })
      }
      return returnList
    }
  },

  created () {
    const paths = this.$route.path.split('/')
    this.rootPath = `/${paths[1]}/${paths[2]}`

    this.$store.dispatch('approval/LOAD_DISASTER_TYPE_LIST', {})
    this.loadPostList()
  },

  methods: {
    async loadPostList () {
      const projectId = this.$route.params.proj_id
      const boardId = this.boardId
      const boardSlug = this.boardSlug
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
        if (item.document_status.code === 'approved') {
          const field_name = this.getPreview(item).field_name
          const occur_type = `occur_${this.getPreview(item).occur_type}`

          let isPass = false
          this.disasterList.map(value => {
            if (occur_type === `occur_${value.value}`) {
              isPass = true
            }
          })
          if (isPass) {
            if (!data[field_name]) data[field_name] = {}
            data[field_name]['field_name'] = field_name

            if (occur_type) {
              const sum = (data[field_name][occur_type]) ? data[field_name][occur_type] : 0
              data[field_name][occur_type] = (sum + 1)

              const all = (data[field_name]['sum']) ? (data[field_name]['sum']) : 0
              data[field_name]['sum'] = (all + 1)
            }

          }
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
