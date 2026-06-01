<template>
  <div>

    <!--  상단 검색바-->
    <search-nav @handleSearch="handleSearch">
      <search-nav-item-project :label="$t('search.현장명')" v-model="nav.projectId"/>
    </search-nav>

    <vs-row class="mb-4">
      <vs-col class="flex" vs-justify="flex-end">
        <vs-button class="mr-2" type="border" color="secondary" @click="excelDownFunc">{{$t('button.Excel 다운로드')}}</vs-button>
        <vs-button v-if="selectProjectId" class="mr-2" color="secondary" @click.stop="handleItemClickDetail">{{$t('button.바로가기')}}</vs-button>
      </vs-col>
    </vs-row>

    <vs-row>
      <vs-col>
        <vs-table stripe
                  ref="table"
                  :sst="true"
                  noDataText="데이터가 없습니다"
                  pagination
                  :max-items="table.perPage"
                  :data="table.list">


          <template slot="thead">
            <vs-th class="w-1/12"><span class="w-full text-center">{{$t('content.state.government.check.column.구분')}}</span></vs-th>
            <vs-th class="w-3/12"><span class="w-full text-center">{{$t('content.state.government.check.column.신고종류')}}</span></vs-th>
            <vs-th class="w-3/12"><span class="w-full text-center">{{$t('content.state.government.check.column.대상여부')}}</span></vs-th>
            <vs-th class="w-5/12"><span class="w-full text-center">{{$t('content.state.government.check.column.신고대상기준')}}</span></vs-th>
          </template>


          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">

              <vs-td class="text-center">{{ tr.division }}</vs-td>
              <vs-td class="text-center">{{ tr.type }}</vs-td>
              <vs-td class="text-center">
                <vs-checkbox v-model="tr.is_checked" :disabled="true"></vs-checkbox>
              </vs-td>
              <vs-td class="text-left">{{ tr.criteria }}</vs-td>

            </vs-tr>
          </template>
        </vs-table>
      </vs-col>
    </vs-row>

    <popup-excel-download
      v-model="showExcelDownload"
      :list="excelList"
      title="대관인허가체크"/>
  </div>
</template>

<script>
import SearchNav from '@/components/nav/SearchNav'
import SearchNavItemKeyword from '@/components/nav/SearchNavItemKeyword'
import PopupExcelDownload from '@/popup/PopupExcelDownload'
import SearchNavItemProject from '@/components/nav/SearchNavItemProject'

export default {
  name: 'StateGovernmentCheck',
  components: {
    SearchNavItemProject,
    SearchNavItemKeyword,
    SearchNav,
    PopupExcelDownload
  },

  data () {
    return {
      // 검색 네비게이션
      nav: {
        projectId:'',
        date: ['', ''],
        keyword: ''
      },
      selectProjectId:'',
      showExcelDownload: false,
      table: {
        list: [],
        targetList: [],
        perPage: 30,
        keyword: ''
      },

      post_id: '',
      isCreated: true,
      form: {
        field_name: '',          // 현장명
        type: '', // 구분
        reportType: '', // 신고종류
        isTarget: false, // 대상여부
        content: '', // 신고대상기준

        preview: {
          type: '', // 구분
          reportType: '', // 신고종류
          isTarget: false, // 대상여부
          content: '' // 신고대상기준
        }
      }
    }
  },
  computed: {
    projectInfo () {
      return this.$store.state.project.projectInfo
    },
    excelList () {
      const list = []
      for (let i = 0; i < this.table.list.length; i++) {
        const data  = this.table.list[i]

        list.push({
          '구분.': data.division,
          '신고종류': data.type,
          '대상여부': data.is_checked ? 'V' : '',
          '신고대상기준': data.criteria,

        })
      }
      return list
    }
  },
  created () {
    this.init()
    this.loadPostList()
  },
  methods: {
    async init () {
      await this.$store.dispatch('USER_INFO')
      this.form.field_name = this.projectInfo.field_name
    },
    async loadPostList () {
      await this.$store.dispatch('project/HSE_LOAD_INFO_RENTWORK')

      const checkList = this.$store.state.project.hseRentWorkList
      this.table.list = checkList

    },

    async loadPost () {

      // 내용불러오기
      const boardId = 34 //state_government_checklist
      const projectId = this.nav.projectId
      await this.$store.dispatch('project/HSE_LOAD_INFO_RENTWORK_PROJECT', {projectId})
      const list = this.$store.state.project.hseProjectRentWorkList


      const tableList = JSON.parse(JSON.stringify(this.table.list))
      for (const item of tableList) {
        item.is_checked = false
        for (const doc of list) {
          if (item.id === doc.id) {
            item.is_checked = true
            break
          }
        }
      }
      this.table.list = tableList
    },

    getPreview (data) {
      if (data.preview) {
        const preview = JSON.parse(data.preview)
        return preview
      } else {
        return {
          type: '', // 구분
          reportType: '', // 신고종류
          isTarget: false, // 대상여부
          content: '' // 신고대상기준
        }
      }
    },

    async excelDownFunc () {
      if (this.nav.projectId) {
        await this.loadPost()
      } else {
        await this.loadPostList()
      }
      this.showExcelDownload = true
    },

    async handleClickSave () {
      // this.$emit('handleClickRegister', 'first')

      const boardId = 34 //state_government_checklist
      const title = this.form.field_name

      let index = 0
      for (const data of this.table.list) {
        const item = {
          field_name: this.getPreview(data).field_name,
          type: this.getPreview(data).type,
          reportType: this.getPreview(data).reportType,
          isTarget: this.table.targetList[index],
          content: this.getPreview(data).content,
          preview: {
            type: this.getPreview(data).type,
            reportType: this.getPreview(data).reportType,
            isTarget: this.table.targetList[index],
            content: this.getPreview(data).content
          }
        }

        const content = JSON.stringify(item)
        const postId = data.id
        await this.$store.dispatch('board/UPDATE_POST', {
          boardId,
          postId,
          title,
          content
        })
        this.$emit('update')

        index++
      }

    },
    handleItemClickDetail () {
      this.$router.push({ path: `/project/${this.nav.projectId}/state/government` })
    },
    handleSearch () {
      if (this.nav.projectId) {
        this.selectProjectId = this.nav.projectId
        this.loadPost()
      } else {
        this.loadPostList()
      }
    }
  }
}
</script>

<style scoped>
</style>
