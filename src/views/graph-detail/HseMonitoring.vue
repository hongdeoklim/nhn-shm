<template>
  <div>
    <search-nav @handleSearch="handleSearch">
      <search-nav-year-month class="mr-4" label="대상기간" v-model="date" :useAllYear="false" monthType="half" />
      <div class="flex items-center">
        <div class="label-text mr-4" >현장명</div>
        <field-selector v-model="selectField" @select="handleSelectField"/>
      </div>

    </search-nav>

    <div style="margin-bottom:60px;">
      <vs-row class="border">
        <vs-col>
          <div class="border-top border-left border-right table-display" :style="getStyle">
            <span class="title table-center border-left" style="grid-row: 1/3; grid-column: 1;">현장명</span>
            <span class="title table-center border-left" style="grid-row: 1/3; grid-column: 2;">대상기간(월)</span>
            <span class="title table-center border-left border-bottom" :style="{gridRow: 1, gridColumn: `3/${keys.length+4}`}">안전교육현황</span>

            <span v-for="(key, iKey) in keys" :key="`header_${key}`"
              class="title table-center border-left"
              :style="{gridRow: 2, gridColumn: 3+iKey}"
              style="word-break: keep-all;text-align:center;">{{ key }}</span>
          </div>
        </vs-col>
      </vs-row>

      <vs-row class="">
        <vs-col class="border-bottom">
          <div v-for="(data, dataIndex) in form.list" :key="dataIndex"
            class="border-top border-left border-right table-content"  :style="getStyle">
            <span class="table-center border-left row-span-3 text-center">{{ data.field_name }}</span>
            <span class="table-center border-left">{{ data.month }}</span>
            <span class="table-center border-left"
                  v-for="key in keys" :key="key">
<!--              <span v-if="!data.data[key]"  class="dot red"></span>-->
              <span>{{ data.data[key] ? data.data[key] : '0' }}</span>
            </span>
          </div>
        </vs-col>
      </vs-row>
    </div>

  </div>
</template>

<script>
import SearchNav from '@/components/nav/SearchNav'
import SearchNavItemSelect from '@/components/nav/SearchNavItemSelect'
import FieldSelector from '@/components/selector/FieldSelector'
import SearchNavYearMonth from '@/components/nav/SearchNavYearMonth.vue'

export default {
  name: 'HseMonitoring',
  components: {
    SearchNavYearMonth,
    FieldSelector,
    SearchNavItemSelect,
    SearchNav
  },
  computed: {
    projectId () {
      return this.$route.params.proj_id
    },
    getStyle () {
      return {
        gridTemplateColumns: `2fr 0.8fr repeat(${this.keys.length}, minmax(0, 1fr))`
      }
    },
    fieldList () {
      return this.$store.state.project.fieldListInfo.data
    }
  },
  data () {
    return {
      date: {year: new Date().getFullYear(), month: new Date().getMonth() + 1, half:'' },
      selectField: 0,
      selectFieldName: '',
      // keys: ['정기안전교육', '특별안전보건교육', '채용시 안전교육', '작업내용 변경시 안전교육', '안전보건총괄책임자 교육', '안전보건관리책임자 교육', '관리감독자 안전교육', 'MSDS', '기타'],
      keys: ['정기안전교육', '특별안전보건교육', '채용시 안전교육', '작업내용 변경시 안전교육', /*'안전보건총괄책임자 교육', '안전보건관리책임자 교육', '관리감독자 안전교육', */'MSDS', '기타'],
      selectProjectId: 1,
      projList: [
        {text: '안전·보건 지원실', value: 1},
        {text: '내부종사자(직접수행)', value: 2},
        {text: '중대산업재해(용역·위탁)', value: 3},
        {text: '신축공사현장', value: 4},
        {text: '중대시민재해', value: 5},
        {text: '소규모 현장', value: 7},
      ],
      // 사용자와 연결된 사업장 목록
      myConnectedFieldList : [],

      form: {
        list: [
          // {
          //   'id': 0,
          //   'proj_name': '분야',
          //   'field_name': '현장',
          //   'month': '10',
          //   'data': {
          //     '정기안전교육': 1,
          //     '채용 시 안전교육': 1,
          //     '작업내용 변경 시 안전교육': 0,
          //     '안전보건 총괄책임자 교육': 1,
          //     '안전보건 관리책임자 교육': 1,
          //     '관리감독자 안전교육': 1,
          //   }
          // }
        ]
      }
    }
  },

  async mounted () {
    this.selectProjectId = this.projectId
    await this.loadFieldListJoinMe()
    await this.loadGraph()
  },
  methods: {
    handleSearch () {
      this.loadGraph()
    },
    handleSelectField (field) {
      this.selectFieldName = field.field_name
    },

    async loadFieldListJoinMe () {
      const page = 1
      const perPage = 1000
      const projectId = this.selectProjectId

      const response = await this.$store.dispatch('project/LOAD_FIELD_LIST_JOIN_ME', {
        page,
        perPage,
        projectId,
      });
      this.myConnectedFieldList = response.data;
    },

    async loadGraph () {
      const summaryKey = ['안전보건교육_현장별교육구분', 'count']

      const beginMMDD = this.date.half === '하반기' ? '07-01' : '01-01'
      const endMMDD = this.date.half === '상반기' ? '06-30' : '12-31'

      const beginAt = this.date.year ? `${this.date.year}-${beginMMDD} 00:00:00` : ''
      const endAt = this.date.year ? `${this.date.year}-${endMMDD} 23:59:59` : ''
      const dateField = 'content$body.inputA_4'

      const value = await this.$store.dispatch('summary/FIRA_LOAD_SUMMARY', {
        boardId: 107,
        projectIds: this.projectId ? [this.projectId] : [],
        beginAt,
        endAt,
        dateField
      }).then(value => {
        let list = this.get현장별데이터FromEachProject(this.getProjectName(this.selectProjectId), this.date.year, this.date.month, value, summaryKey)

        if (this.projectId !== 1) {
          // 내가 참여한 현장을 제외한 현장 삭제
          list = list.filter(data => {
            if (this.myConnectedFieldList && this.myConnectedFieldList.length > 0) {
              const fieldNameList = this.myConnectedFieldList.map(field => {
                return field.field_name
              })
              return fieldNameList.indexOf(data.field_name) >= 0
            }
            return true
          })
        }

        // 검색한 현장만 선택
        if (this.selectFieldName) {
          list = list.filter(data => {
            return data.field_name === this.selectFieldName;
          })
        }

        return list
      })

      this.form.list = value
    },

    getProjectName (projId) {
      for (const proj of this.projList) {
        if (Number(`${proj.value}`) === Number(`${projId}`)) {
          return proj.text
        }
      }
    },

    get현장별데이터FromEachProject (selectProject, selectYear, selectMonth, value, summaryKey) {
      const 중복체크 = {}
      const data = []
      const projNames = Object.keys(value.eachProject)
      if (projNames.length > 0) {
        for (const projName of projNames) {
          if (selectProject === projName) {
            const tempData = value.eachProject[projName][summaryKey[0]]
            if (tempData) {
              // field
              const fieldNames = Object.keys(tempData['count']).map((data) => data.split('_')[0])
              for (const fieldName of fieldNames) {
                // month 추가
                const tempDataKey = Object.keys(tempData)
                // tempDataKey 값에는 2023, 2023-02, 2023-03 이런 식으로 저장되어 있음
                for (const date of tempDataKey) {
                  if (date.split('-').length > 1) {
                    const month = date.split('-')[1]
                    let isAdd = false
                    if (selectMonth) {
                      if (Number(`${selectMonth}`) === Number(`${month}`)) {
                        isAdd = true
                      }
                    } else {
                      isAdd = true
                    }
                    if (isAdd) {

                      if (!중복체크[`${projName}|${fieldName}|${month}`]) {
                        중복체크[`${projName}|${fieldName}|${month}`] = 1
                        const columnKeys = Object.keys(tempData['count']).map((data) => data.split('_')[1])
                        const datadata = {}
                        for (const column of columnKeys) {
                          datadata[column] = tempData[`${selectYear}-${month}`][summaryKey[1]][`${fieldName}_${column}`] ? tempData[`${selectYear}-${month}`][summaryKey[1]][`${fieldName}_${column}`] : 0
                        }

                        data.push({
                          'proj_name': projName,
                          'field_name': fieldName,
                          month,
                          'data': datadata
                        })
                      }
                    }
                  }
                } //month
              }
            } // field
          }

        }
      } // project

      // 작업장명 / 대상기간 순으로 정렬
      return data.sort((a, b) => {
        if (a.field_name > b.field_name) {
          return 1
        } else if (a.field_name < b.field_name) {
          return -1
        } else {
          if (a.month > b.month) {
            return 1
          } else if (a.month < b.month) {
            return -1
          } else {
            return 0
          }
        }
      }); // 중복제거 : [...new Set(data.map(JSON.stringify))].map(JSON.parse)
    }
  }
}
</script>

<style scoped>

.table-display {
  display: grid;
  grid-template-rows: repeat(2, minmax(52px, 100%));
}

.table-content {
  display: grid;
  grid-template-rows: minmax(52px, 100%);
  background-color: white;
}

.table-center {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
}
</style>
