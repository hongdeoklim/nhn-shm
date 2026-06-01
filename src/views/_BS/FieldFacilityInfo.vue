<template>
  <vs-tabs :value="1">
    <vs-tab label="시설물 등록" @click="onClickTab(0)">
    </vs-tab>
    <vs-tab label="담당 시설물 정보" @click="onClickTab(1)">
      <div>
        <vx-card class="mb-8">
          <vs-row class="flex w-auto mr-4" vs-align="center">
            <vs-col class="w-auto mr-4">부서(하도급업체)</vs-col>
            <vs-col class="w-auto">
              <vs-select autocomplete v-model="selectedCompanyId">
                <vs-select-item
                  v-for="(item, index) in companyList" :key="index"
                  :text="item.com_name"
                  :value="item.id"/>
              </vs-select>
            </vs-col>
          </vs-row>
        </vx-card>
        <vx-card>
          <div>
            <p class="title mt-8 mb-5">상위 담당 부서 정보</p>
            <div class="grid grid-cols-12 gap-x-6 gap-y-4 ">
              <div class="col-span-4 flex items-center">
                <search-nav-item-select
                  class="search-item"
                  label="구분"
                  v-model="parentCompanyInfo.com_type"
                  :list="comTypes"
                  :readonly="true"
                />
              </div>
              <div class="col-span-4 flex items-center ">
                <div class="label-text mr-4">계약번호(하도급업체)</div>
                <ml-input class="w-full flex-1" v-model="parentCompanyInfo.contract_number" :readonly="true"/>
              </div>
              <div class="col-span-4 flex items-center ">
                <div class="label-text mr-4">부서명(회사명)</div>
                <ml-input class="w-full flex-1" v-model="parentCompanyInfo.com_name" :readonly="true"/>
              </div>
              <div class="col-span-4 flex items-center ">
                <div class="label-text mr-4">담당자</div>
                <ml-input class="w-full flex-1" v-model="parentCompanyInfo.director" :readonly="true"/>
              </div>
              <div class="col-span-4 flex items-center ">
                <div class="label-text mr-4">업태</div>
                <ml-input class="w-full flex-1" v-model="parentCompanyInfo.com_business_class"
                          :readonly="true"/>
              </div>
              <div class="col-span-4 flex items-center ">
                <div class="label-text mr-4">업종</div>
                <ml-input class="w-full flex-1" v-model="parentCompanyInfo.com_business_type"
                          :readonly="true"/>
              </div>
              <div class="col-span-4 flex items-center ">
                <div class="label-text mr-4">사업자번호</div>
                <ml-input class="w-full flex-1" v-model="parentCompanyInfo.com_number" :readonly="true"/>
              </div>
              <div class="col-span-4 flex items-center ">
                <div class="label-text mr-4">주소</div>
                <ml-input class="w-full flex-1" v-model="parentCompanyInfo.address" :readonly="true"/>
              </div>
              <div class="col-span-4 flex items-center">
                <search-nav-start-end
                  class="input-se"
                  label="사업기간"
                  v-model="form.inputA_4"
                  :readonly="true"
                />
              </div>
              <div class="col-span-4 flex items-center ">
                <div class="label-text mr-4">대표자</div>
                <ml-input class="w-full flex-1" v-model="parentCompanyInfo.com_ceo" :readonly="true"/>
              </div>
              <div class="col-span-4 flex items-center ">
                <div class="label-text mr-4">FAX</div>
                <ml-input class="w-full flex-1" v-model="parentCompanyInfo.fax" :readonly="true"/>
              </div>
              <div class="col-span-4 flex items-center">
                <div class="label-text mr-4">대표번호</div>
                <ml-input class="w-full flex-1" v-model="parentCompanyInfo.phone" :readonly="true"/>
              </div>
              <div class="col-span-4 flex items-center">
                <div class="label-text mr-4">이메일</div>
                <ml-input class="w-full flex-1" v-model="parentCompanyInfo.email" :readonly="true"/>
              </div>
            </div>
          </div>
          <div>
            <p class="title mt-8 mb-5">부서 및 하도급업체 정보</p>
            <div class="grid grid-cols-12 gap-x-6 gap-y-4 ">
              <div class="col-span-4 flex items-center">
                <search-nav-item-select
                  class="search-item"
                  label="구분"
                  v-model="companyInfo.com_type"
                  :list="comTypes"
                  :readonly="true"
                />
              </div>
              <div class="col-span-4 flex items-center ">
                <div class="label-text mr-4">계약번호(하도급업체)</div>
                <ml-input class="w-full flex-1" v-model="companyInfo.contract_number" :readonly="true"/>
              </div>
              <div class="col-span-4 flex items-center ">
                <div class="label-text mr-4">부서명(회사명)</div>
                <ml-input class="w-full flex-1" v-model="companyInfo.com_name" :readonly="true"/>
              </div>
              <div class="col-span-4 flex items-center ">
                <div class="label-text mr-4">담당자</div>
                <ml-input class="w-full flex-1" v-model="companyInfo.director" :readonly="true"/>
              </div>
              <div class="col-span-4 flex items-center ">
                <div class="label-text mr-4">업태</div>
                <ml-input class="w-full flex-1" v-model="companyInfo.com_business_class" :readonly="true"/>
              </div>
              <div class="col-span-4 flex items-center ">
                <div class="label-text mr-4">업종</div>
                <ml-input class="w-full flex-1" v-model="companyInfo.com_business_type" :readonly="true"/>
              </div>
              <div class="col-span-4 flex items-center ">
                <div class="label-text mr-4">사업자번호</div>
                <ml-input class="w-full flex-1" v-model="companyInfo.com_number" :readonly="true"/>
              </div>
              <div class="col-span-4 flex items-center ">
                <div class="label-text mr-4">주소</div>
                <ml-input class="w-full flex-1" v-model="companyInfo.com_address" :readonly="true"/>
              </div>
              <div class="col-span-4 flex items-center">
                <search-nav-start-end
                  class="input-se"
                  label="사업기간"
                  v-model="form.inputA_4"
                  :readonly="true"
                />
              </div>
              <div class="col-span-4 flex items-center ">
                <div class="label-text mr-4">대표자</div>
                <ml-input class="w-full flex-1" v-model="companyInfo.com_ceo" :readonly="true"/>
              </div>
              <div class="col-span-4 flex items-center ">
                <div class="label-text mr-4">FAX</div>
                <ml-input class="w-full flex-1" v-model="companyInfo.fax" :readonly="true"/>
              </div>
              <div class="col-span-4 flex items-center">
                <div class="label-text mr-4">대표번호</div>
                <ml-input class="w-full flex-1" v-model="companyInfo.phone" :readonly="true"/>
              </div>
              <div class="col-span-4 flex items-center">
                <div class="label-text mr-4">이메일</div>
                <ml-input class="w-full flex-1" v-model="companyInfo.email" :readonly="true"/>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-12 gap-x-10 mt-8 mb-5">
            <div class="col-span-12">
              <div class="flex items-center justify-between">
                <p class="title ">담당 시설물 현황</p>
              </div>
              <vs-table
                v-model="selected"
                @selected="handleSelected"
                pagination
                :data="fieldList"
                class="mt-5"
              >
                <template slot="thead">
                  <vs-th> No.</vs-th>
                  <vs-th> 현장명</vs-th>
                  <vs-th> 종류</vs-th>
                  <vs-th> 시설물 위치</vs-th>
                  <vs-th> 준공일</vs-th>
                  <vs-th> 계약금액</vs-th>
                </template>

                <template slot-scope="{ data }">
                  <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td> {{ data[indextr].id }}</vs-td>
                    <vs-td> {{ data[indextr].field_name }}</vs-td>
                    <vs-td> {{ data[indextr].facility_category ? data[indextr].facility_category.cat2 : '' }}</vs-td>
                    <vs-td> {{ data[indextr].address }}</vs-td>
                    <vs-td> {{ data[indextr].be_completed_at }}</vs-td>
                    <vs-td> {{ data[indextr].deposit_amount }}</vs-td>
                  </vs-tr>
                </template>
              </vs-table>
            </div>
            <div class="col-span-12">
              <div class="flex items-center justify-between">
                <p class="title ">시설물 개요</p>
              </div>
              <div class="mt-5">
                <div class="w-full grid" style="grid-template-columns: 1fr 1fr 1fr; column-gap: 1.5rem;">
                  <div class="mb-4" style="display: grid; grid-template-columns: 116px 1fr; align-items: center;">
                    <div class="label-text mr-4">현장(시설물)명</div>
                    <ml-input class="w-full flex-1" :readonly="true" v-model="selectedField.field_name"/>
                  </div>
                  <div class="mb-4" style="display: grid; grid-template-columns: 116px 1fr; align-items: center;">
                    <div class="label-text mr-4">계약금액</div>
                    <ml-input class="w-full flex-1" :readonly="true" v-model="selectedField.deposit_amount"/>
                  </div>
                  <div></div>


                  <div class="mb-4" style="display: grid; grid-template-columns: 116px 1fr; align-items: center;">
                    <div class="label-text mr-4">구분</div>
                    <ml-input class="w-full flex-1" :readonly="true" :value="selectedField && selectedField.facility_category ? selectedField.facility_category.cat1 : ''"/>
                  </div>
                  <div class="mb-4" style="display: grid; grid-template-columns: 116px 1fr; align-items: center;">
                    <div class="label-text mr-4">종류</div>
                    <ml-input class="w-full flex-1" :readonly="true" :value="selectedField && selectedField.facility_category ? selectedField.facility_category.cat2 : ''"/>
                  </div>
                  <div class="mb-4" style="display: grid; grid-template-columns: 116px 1fr; align-items: center;">
                    <div class="label-text mr-4">세분류</div>
                    <ml-input class="w-full flex-1" :readonly="true" :value="selectedField && selectedField.facility_category ? selectedField.facility_category.cat3 : ''"/>
                  </div>
                  <div class="mb-4" style="display: grid; grid-template-columns: 116px 1fr; align-items: center;">
                    <div class="label-text mr-4">종별</div>
                    <ml-input class="w-full flex-1" :readonly="true" :value="selectedField && selectedField.facility_category ? selectedField.facility_category.classification : ''"/>
                  </div>
                  <div class="mb-4" style="display: grid; grid-template-columns: 116px 1fr; align-items: center;">
                    <div class="label-text mr-4">안전 등급</div>
                    <ml-input class="w-full flex-1" :readonly="true" v-model="selectedField.safety_grade"/>
                  </div>
                  <div class="mb-4" style="display: grid; grid-template-columns: 116px 1fr; align-items: center;">
                    <div class="label-text mr-4">시설물 위치(상세주소)</div>
                    <ml-input class="w-full flex-1" :readonly="true" v-model="selectedField.address"/>
                  </div>


                  <div class="mb-4" style="display: grid; grid-template-columns: 116px 1fr; align-items: center;">
                    <div class="label-text mr-4">형식</div>
                    <ml-input class="w-full flex-1" :readonly="true" v-model="selectedField.format"/>
                  </div>
                  <div class="mb-4" style="display: grid; grid-template-columns: 116px 1fr; align-items: center;">
                    <div class="label-text mr-4">준공일</div>
                    <date-selector class="popup-fixed" :readonly="true" v-model="selectedField.be_completed_at"></date-selector>
                  </div>
                  <div></div>


                  <div class="mb-4" style="display: grid; grid-template-columns: 116px 1fr; align-items: center;">
                    <div class="label-text mr-4">규모1</div>
                    <ml-input class="w-full flex-1" :readonly="true" v-model="selectedField.scale1"/>
                  </div>
                  <div class="mb-4" style="display: grid; grid-template-columns: 116px 1fr; align-items: center;">
                    <div class="label-text mr-4">규모2</div>
                    <ml-input class="w-full flex-1" :readonly="true" v-model="selectedField.scale2"/>
                  </div>
                  <div class="mb-4" style="display: grid; grid-template-columns: 116px 1fr; align-items: center;">
                    <div class="label-text mr-4">규모3</div>
                    <ml-input class="w-full flex-1" :readonly="true" v-model="selectedField.scale3"/>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 참여 인원 정보 -->
          <company-user-auth-module :users="users" type="info"/>
        </vx-card>
      </div>
    </vs-tab>
  </vs-tabs>
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
      selectedCompanyId: 0,
      selectedField: {},
      form: {
        inputA_1: '',
        inputA_2: '',
        inputA_3: '',
        inputA_4: '',
        inputA_5: ''
      },
      companyList: [],
      parentCompanyInfo: {},
      companyInfo: {},
      fieldList: [],
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
      users: []
    }
  },
  computed: {
    projectId () {
      return this.$route.params.proj_id
    }
  },
  watch: {
    selectedCompanyId (/*value*/) {
      this.users = []
      this.loadCompanyInfo()
    }
  },
  created () {
    this.initBreadcrumb()
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

      this.loadCompanyInfo()
    })
  },
  methods: {
    initBreadcrumb () {
      this.$store.commit('menu/UPDATE_PAGE_LIST', [{title: 'Home'}, {title: '현장/시설물 개요'}, {title: '시설물 관리', active: true}])
    },
    loadCompanyInfo () {
      this.$store.dispatch('company/LOAD_COMPANY', {companyId: this.selectedCompanyId}).then(value => {
        this.companyInfo = value

        if (this.companyInfo.id) {
          const companyId = this.companyInfo.id
          const projectId = this.projectId
          this.$store.dispatch('company/LOAD_COMPANY_FIELD', {companyId, projectId, fieldType: '시설물'}).then(value => {
            // const total = value.total
            this.fieldList = value.data
          })

        }

        if (this.companyInfo.parent_id) {
          const parent_id = this.companyInfo.parent_id
          this.$store.dispatch('company/LOAD_COMPANY', {companyId: parent_id}).then(value => {
            this.parentCompanyInfo = value
          })
        }
      })
    },
    loadFieldUsers () {
      if (this.selectedField.id) {
        this.$store.dispatch('project/LOAD_FIELD_USERS', {fieldId: this.selectedField.id}).then(value => {
          this.users = value.data
        })
      }
    },
    onClickTab (tabIndex) {
      if (tabIndex === 0) {
        this.$router.push({name: 'field-facility-list'})
      } else if (tabIndex === 1) {
        this.$router.push({name: 'field-facility-info'})
      }
    },
    handleSelected (tr) {
      console.log(tr)
      this.selectedField = tr
      this.loadFieldUsers()
    },
    handleSearch (/*searching*/) {
    },
    handleSort (/*key, active*/) {
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
  width: 114px;
  font-weight: 500;
  font-size: 14px;
}

.input-se {
  width: 100%;

  &::v-deep .start-end-title {
    width: 114px;
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
    width: 114px !important;
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
