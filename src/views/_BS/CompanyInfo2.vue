<template>
  <div id="print-report">
    <vx-card>
      <div class="grid grid-cols-12 gap-x-10 mt-8 mb-5">
        <div class="col-span-12">
          <div class="flex items-center justify-between">
            <p class="title ">하도급업체 현황</p>
          </div>
          <vs-table
            v-model="selected"
            @selected="handleSelected"
            pagination
            :data="childList"
            class="mt-5"
          >
            <template slot="thead">
              <vs-th> No.</vs-th>
              <vs-th> 사업자등록번호</vs-th>
              <vs-th> 업체명</vs-th>
              <vs-th> 대표자</vs-th>
              <vs-th> 주소</vs-th>
            </template>

            <template slot-scope="{ data }">
              <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                <vs-td> {{ indextr }}</vs-td>
                <vs-td> {{ data[indextr].com_number }}</vs-td>
                <vs-td> {{ data[indextr].com_name }} </vs-td>
                <vs-td> {{ data[indextr].director }}</vs-td>
                <vs-td> {{ data[indextr].com_address }}</vs-td>
              </vs-tr>
            </template>
          </vs-table>
        </div>
        <div class="col-span-12 mb-6">
          <div class="flex items-center justify-between">
            <p class="title ">상세정보</p>
          </div>
          <div class="mt-5">
            <div class="grid grid-cols-12 gap-x-6 gap-y-4">

<!-- 1.      -->
              <div class="col-span-4 flex items-center">
                <div class="label-text mr-4">업체명</div>
                <ml-input
                  class="w-full flex-1"
                  v-model="selectedSubCompany.com_name"
                  :readonly="true"
                />
              </div>
              <div class="col-span-4 flex items-center">
                <div class="label-text mr-4">대표자</div>
                <ml-input
                  class="w-full flex-1"
                  :readonly="true"
                  :value="selectedSubCompany.com_ceo"
                />
              </div>
              <div class="col-span-4 flex items-center">
                <div class="label-text mr-4">사업자등록번호</div>
                <ml-input
                  class="w-full flex-1"
                  :readonly="true"
                  :value="selectedSubCompany.com_number"
                />
              </div>

<!-- 2   -->
              <div class="col-span-4 flex items-center">
                <div class="label-text mr-4">주소</div>
                <ml-input
                  class="w-full flex-1"
                  :readonly="true"
                  :value="selectedSubCompany.com_address"
                />
              </div>
              <div class="col-span-4 flex items-center">
                <div class="label-text mr-4">업태</div>
                <ml-input
                  class="w-full flex-1"
                  :readonly="true"
                  :value="selectedSubCompany.com_business_class"
                />
              </div>
              <div class="col-span-4 flex items-center">
                <div class="label-text mr-4">업종</div>
                <ml-input
                  class="w-full flex-1"
                  :readonly="true"
                  :value="selectedSubCompany.com_business_type"
                />
              </div>

<!-- 3   -->
              <div class="col-span-4 flex items-center">
                <div class="label-text mr-4">담당자</div>
                <ml-input
                  class="w-full flex-1"
                  :readonly="true"
                  :value="selectedSubCompany.director"
                />
              </div>
              <div class="col-span-4 flex items-center">
                <div class="label-text mr-4">연락처</div>
                <ml-input
                  class="w-full flex-1"
                  :readonly="true"
                  :value="selectedSubCompany.phone"
                />
              </div>

            </div>
          </div>
        </div>
      </div>

      <!-- 참여 인원 정보 -->
      <company-user-auth-module title="사용자 정보" v-model="userTable.list" type="info"/>
    </vx-card>
  </div>
</template>

<script>
import FileInput from '@/components/custom/FileInput'
import SearchNavItemSelect from '@/components/nav/SearchNavItemSelect'
import SearchNavStartEnd from '@/components/nav/SearchNavStartEnd.vue'
import FileUploadModule from '@/views/modules/FileUploadModule'
import CompanyUserAuthModule from '@/views/_BS/components/CompanyUserAuthModule'
import DateSelector from '@/components/selector/DateSelector'

export default {
  components: {
    DateSelector,
    CompanyUserAuthModule,
    SearchNavStartEnd,
    SearchNavItemSelect,
    FileInput,
    FileUploadModule
  },
  data () {
    return {
      isPrint: false,
      selectedCompanyId: 0,
      selectedSubCompany: {},
      form: {
        inputA_1: '',
        inputA_2: '',
        inputA_3: '',
        inputA_4: '',
        inputA_5: ''
      },
      companyList: [],
      childList: [],
      companyInfo: {},
      fileList: [],
      keyword: '',
      comTypes: [
        {
          text: '본청',
          value: '본청'
        },
        {
          text: '도급',
          value: '도급'
        },
        {
          text: '용역',
          value: '용역'
        },
        {
          text: '위탁',
          value: '본청'
        },
        {
          text: '기타',
          value: '기타'
        }
      ],
      selected: [],
      userTable: {
        page: 1,
        perPage: 10,
        list: [],
      }
    }
  },
  computed: {
    projectId () {
      return this.$route.params.proj_id
    },
    selectedCompanyName () {
      for (const company of this.companyList) {
        if (company.id === this.selectedCompanyId) {
          return company.com_name
        }
      }

      return ''
    }
  },
  watch: {
    async selectedCompanyId (/*value*/) {
      this.userTable = {
        page: 1,
        perPage: 10,
        list: [],
      }
      await this.loadCompanyInfo()
      await this.setChildCompany()
    }
  },
  created () {
    this.initBreadcrumb();
  },
  mounted () {
    this.$store.dispatch('company/LOAD_COMPANY_TREE', {projectId: this.projectId}).then(value => {
      const companyTree = value

      const list = []
      for (const com of companyTree) {
        list.push(com.descendant)
      }

      this.companyList = list

      const myInfo = this.$store.state.auth.userInfo
      this.selectedCompanyId = myInfo.company_id

      this.setChildCompany()
    })
  },
  methods: {

    initBreadcrumb () {
      this.$store.commit('menu/UPDATE_PAGE_LIST', [{title: 'Home'}, {title: '안전보건조직체계'}, {title: '하도급업체 정보', active: true}])
    },

    async setChildCompany () {
      const list = []
      for (const company of this.companyList) {
        if (company.parent_id === this.selectedCompanyId) {
          list.push(company)
        }
      }

      this.childList = list
      await this.loadCompanyUsers()
    },
    async loadCompanyInfo () {
      this.$store.dispatch('company/LOAD_COMPANY', {companyId: this.selectedCompanyId}).then(value => {
        this.companyInfo = value
      })
    },
    async loadCompanyUsers () {
      const projectId = this.projectId
      const page = this.userTable.page
      const perPage = this.userTable.perPage
      const company_id = this.selectedCompanyId

      await this.$store.dispatch('project/LOAD_PROJECT_COMPANY_MEMBER_LIST', {page, perPage, projectId, company_id})

      const memberList = JSON.parse(JSON.stringify(this.$store.state.project.projectCompanyUserList))
      for (const member of memberList) {
        let join = 'N'
        if (member.projects.length > 0) {
          join = 'Y'
        }
        member['select'] = `${join}|${member.id}`
      }
      this.userTable.list = JSON.parse(JSON.stringify(memberList))

    },
    onClickTab (tabIndex) {
      if (tabIndex === 0) {
        this.$router.push({name: 'field-field-list'})
      } else if (tabIndex === 1) {
        this.$router.push({name: 'field-field-info'})
      }
    },
    handleSelected (tr) {
      this.selectedSubCompany = tr
    },
    handleSearch (/*searching*/) {
    },
    handleSort (/*key, active*/) {
    },
    handlePrint () {
      // 프린트
      this.isPrint = true

      setTimeout(() => {
        const g_oBeforeBody = document.getElementById('print-report').innerHTML
        // 프린트를 보이는 그대로 나오기위한 셋팅
        window.onbeforeprint = function () {
          document.body.style.backgroundColor = '#fff'
          document.body.innerHTML = `${g_oBeforeBody}`
        }
        window.print()
        location.reload()
      }, 300)
    }
  }
}
</script>

<style scoped lang="scss">
.table-list {
  .action-button {
    margin-left: auto;
  }
}

.title {
  font-weight: 500;
  font-size: 16px;
  height: 17px;
  line-height: 17px;
  position: relative;
  padding-left: 12px;

  &::before {
    content: "";
    width: 8px;
    height: 8px;
    background: #7e72f2;
    display: block;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: -8px;
    border-radius: 100%;
  }
}

.size-search {
  width: 200px;
}

.title-n {
  font-weight: 500;
  font-size: 16px;
  height: 17px;
  line-height: 17px;
}

.label-text {
  min-width: 127px;
  font-weight: 500;
  font-size: 14px;
}

.input-se {
  width: 100%;

  &::v-deep .start-end-title {
    width: 127px;
    font-weight: 500;
    font-size: 14px;
    justify-content: flex-start;
  }

  &::v-deep .mr-2 {
    flex: 1;
    margin-right: 10px !important;
  }

  &::v-deep .mr-2 + .mr-2 {
    margin-right: 0 !important;

    &::before {
      content: "~";
      margin-right: 10px;
    }
  }

  &::v-deep .inline-block {
    width: 100% !important;
  }
}

.vs-table-primary .is-selected {
  background: rgba(126, 114, 242, 0.6) !important;
  color: white;
}

.search-item {
  width: 100% !important;
  margin: 0 !important;

  &::v-deep > div:first-child {
    width: 127px !important;
    font-weight: 500;
    font-size: 14px;
  }

  &::v-deep > div:last-child {
    flex: 1 !important;

    .con-select {
      width: 100%;
    }
  }
}

.upload-img {
  width: 100%;
  height: 318px !important;
  margin-top: 22px;
}
</style>

<style lang="scss">
.none-card {
  box-shadow: none;
  border-radius: 0;
  display: inline-block;

  .vx-card__body {
    padding: 0 !important;
  }
}

span.up {
  color: #28c76f;
}

span.down {
  color: #ea5455;
}

.vs-table--tbody-table tr:nth-child(2n) {
  background-color: #f9f9f9;
}
</style>
