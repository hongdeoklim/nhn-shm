<template>
  <div>

    <!--  상단 검색바-->
    <search-nav @handleSearch="handleSearch">
      <search-nav-item-keyword label="현장명" v-model="nav.keyword" />
    </search-nav>

    <vs-row class="mb-4">
      <vs-col class="flex" vs-justify="flex-end">
        <vs-button class="mr-2" type="border" color="secondary" @click="excelDownFunc">{{$t('button.Excel 다운로드')}}</vs-button>
        <vs-button color="secondary" @click="handleClickSave">저장</vs-button>
      </vs-col>
    </vs-row>

    <vs-row>
      <vs-col>
        <vs-table stripe
                  ref="table"
                  :sst="true"
                  pagination
                  noDataText="데이터가 없습니다"
                  :max-items="table.perPage"
                  :data="table.list">


          <template slot="thead">
            <vs-th class="w-1/12"><span class="w-full text-center">구분</span></vs-th>
            <vs-th class="w-2/12"><span class="w-full text-center">신고종류</span></vs-th>
            <vs-th class="w-1/12"><span class="w-full text-center">대상여부</span></vs-th>
            <vs-th class="w-8/12"><span class="w-full text-center">신고대상기준</span></vs-th>
          </template>


          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">

              <vs-td class="text-center">{{ tr.division }}</vs-td>
              <vs-td class="text-center">{{ tr.type }}</vs-td>
              <vs-td class="text-center">
                <vs-checkbox v-model="tr.is_checked"></vs-checkbox>
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

export default {
  name: 'CheckGovernment',
  components: {
    SearchNavItemKeyword,
    SearchNav,
    PopupExcelDownload
  },

  data () {
    return {
      // 검색 네비게이션
      nav: {
        date: ['', ''],
        keyword: ''
      },
      showExcelDownload: false,
      table: {
        list: [],
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
      for (const data of this.table.list) {
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
      const projectId = this.$route.params.proj_id
      await this.$store.dispatch('project/HSE_LOAD_INFO_RENTWORK_PROJECT', {projectId})
      await this.$store.dispatch('project/HSE_LOAD_INFO_RENTWORK')

      const checkList = this.$store.state.project.hseProjectRentWorkList
      const check = {}
      for (const item of checkList) {
        check[item.id] = true
      }
      this.table.list = this.$store.state.project.hseRentWorkList
      for (let i = 0; i < this.table.list.length; i++) {
        const data = this.table.list[i]
        data.is_checked = check[data.id]
      }

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
      await this.loadPostList()
      this.showExcelDownload = true
    },

    async handleClickSave () {
      const projectId = this.$route.params.proj_id
      const enabled = []
      for (const item of this.table.list) {
        if (item.is_checked) {
          enabled.push(item.id)
        }
      }

      await this.$store.dispatch('project/HSE_UPDATE_INFO_RENTWORK_PROJECT', {projectId, enabled})
      alert('저장되었습니다.')
    },
    handleSearch () {
      this.loadPostList()
    }
  }
}
</script>

<style scoped>
</style>
