<template>
  <vs-popup id="popupSearchEmployee" title="종사자 검색" :active.sync="showPopup">
    <div class="popupSearchEmployee_list">
      <vs-row class="text-center p-4 grid grid-cols-12">
        <vs-col class="grid grid-cols-10 col-span-10 gap-3" vs-align="center">
          <vs-col class="grid grid-cols-3 col-span-3" vs-align="center">
            <span class="col-span-1 text-left">사업장명</span>
            <field-selector class="col-span-2" v-model="selectedFieldId" @select="handleFieldSelect" />
          </vs-col>
          <vs-col class="grid grid-cols-3 col-span-3" vs-align="center">
            <span class="col-span-1 text-left">부서명</span>
            <company-selector class="col-span-2" v-model="selectedCompanyId" @click.stop @select="handlerCompanySelect" />
          </vs-col>
        </vs-col>
      </vs-row>

      <!-- 검색조건, 키워드 입력 폼을 추가한다 -->
      <vs-row class="px-4 pb-4 grid grid-cols-12" style="border-bottom: 1px solid #e0e0e0">
        <vs-col class="grid grid-cols-10 col-span-10 gap-3" vs-align="center">
          <vs-col class="grid grid-cols-3 col-span-3" vs-align="center">
            <span class="col-span-1 text-left">검색조건</span>
            <vs-select class="col-span-2 w-full" v-model="filterType" :placeholder="'전체'" autocomplete>
              <vs-select-item v-for="selectData in filterTypeOptions" :key="selectData.value" :text="selectData.label" :value="selectData.value" />
            </vs-select>
          </vs-col>
          <vs-col class="grid grid-cols-3 col-span-3" vs-align="center">
            <search-nav-item-keyword class="col-span-3" :view-label="false" placeholder="검색" v-model="search.keyword" @keyup-event="handleClickSearch" />
          </vs-col>
        </vs-col>
        <vs-col class="col-span-2 text-right">
          <vs-button color="secondary" @click="handleClickSearch">검색</vs-button>
        </vs-col>
      </vs-row>

      <vs-row class="p-4">
        <vs-col>
          <vs-table stripe ref="table" :sst="true" :max-items="page.perPage" :data="employeeList" noDataText="데이터가 없습니다" @selected="handleItemClickDetail">
            <template slot="thead">
              <vs-th style="width: 60px"><span class="w-full text-center">No.</span></vs-th>
              <vs-th style="width: 9%"><span class="w-full text-center">업체명</span></vs-th>
              <vs-th style="width: 9%"><span class="w-full text-center">ID(사번)</span></vs-th>
              <vs-th style="width: 9%"><span class="w-full text-center">구분</span></vs-th>
              <vs-th style="width: 9%"><span class="w-full text-center">직종</span></vs-th>
              <vs-th style="width: 9%"><span class="w-full text-center">직급</span></vs-th>
              <vs-th style="width: 9%"><span class="w-full text-center">성명</span></vs-th>
              <vs-th style="width: 9%"><span class="w-full text-center">최종 입사일</span></vs-th>
              <vs-th style="width: 9%"><span class="w-full text-center">현보직일</span></vs-th>
              <vs-th style="width: 9%"><span class="w-full text-center">연락처</span></vs-th>
              <vs-th style="width: 9%"><span class="w-full text-center">교육이수 횟수</span></vs-th>
              <vs-th><span class="w-full text-center">퇴임일</span></vs-th>
            </template>

            <template slot-scope="{ data }">
              <vs-tr :class="getActiveClass(employee.id)" :data="employee" :key="index" v-for="(employee, index) in data">
                <vs-td class="text-center">{{ employee.id }}</vs-td>
                <vs-td class="text-center">{{ /*업체명*/ employee.company.com_name }}</vs-td>
                <vs-td class="text-center">{{ /*사번*/ employee.employee_id }}</vs-td>
                <vs-td class="text-center">{{ /*구분*/ employee.job_category }}</vs-td>
                <vs-td class="text-center">{{ /*직종*/ employee.employment_type }}</vs-td>
                <vs-td class="text-center">{{ /*직급*/ employee.job_title }}</vs-td>
                <vs-td class="text-center">{{ /*성명*/ employee.full_name }}</vs-td>
                <vs-td class="text-center">{{ /*최종 입사일*/ employee.hire_date }}</vs-td>
                <vs-td class="text-center">{{ /*현보직일*/ employee.current_position_date }}</vs-td>
                <vs-td class="text-center">{{ /*연락처*/ employee.contact_number }}</vs-td>
                <vs-td class="text-center">{{ /*교육이수 횟수*/ 0 }}</vs-td>
                <vs-td class="text-center">{{ /*퇴임일*/ employee.retirement_date }}</vs-td>
              </vs-tr>
            </template>
          </vs-table>
        </vs-col>
      </vs-row>
      <vs-row>
        <vs-col>
          <div class="vs-con-table">
            <div class="con-pagination-table vs-table--pagination">
              <k-pagination :total="page.lastPage ? page.lastPage : 0" v-model="page.current" @change="handleChangePage"></k-pagination>
            </div>
          </div>
        </vs-col>
        <vs-col class="mt-4 flex p-4" vs-align="center" vs-justify="flex-end">
          <vs-button class="mr-4" color="#EDEDED" text-color="black" type="filled" @click="handleClickClose">닫기 </vs-button>
          <vs-button class="" color="secondary" @click="handleClickSelect">선택</vs-button>
        </vs-col>
      </vs-row>
    </div>
  </vs-popup>
</template>

<script>
import KPagination from "@/components/kPagination/kPagination";
import FileUploader from "@/components/FileUploader.vue";
import AddressField from "@/components/AddressField.vue";
import FieldSelector from "@/components/selector/FieldSelector.vue";
import CompanySelector from "@/components/selector/CompanySelector.vue";
import SearchNavItemKeyword from "@/components/nav/SearchNavItemKeyword.vue";
export default {
  name: "PopupSearchEmployee",
  props: {
    value: Boolean,
    // 팝업이 열릴 때, 선택된 ID가 있을 경우 해당 ID를 선택한 상태로 팝업을 열기 위한 값
    initSelectedIds: {
      type: Array,
      default: () => [],
    },
    listOnly: {
      type: Boolean,
      default: () => true,
    },
    fieldId: Number,
  },
  components: {
    SearchNavItemKeyword,
    CompanySelector,
    FieldSelector,
    AddressField,
    FileUploader,
    KPagination,
  },

  watch: {
    value(data) {
      this.showPopup = data;

      this.selectedIds = this.initSelectedIds;
      this.loadEmployeeList();
    },
    selectId(id) {
      this.oldSelectCompanyId = id;
      if (this.employeeList) {
        for (const employee of this.employeeList) {
          if (employee.id === this.oldSelectCompanyId) {
            try {
              this.oldSelectCompany = employee;
              this.selectedEmployee = employee;
            } catch (e) {
              //
            }
            break;
          }
        }
      }
    },
    showPopup(value) {
      const body = document.querySelector('body');
      if (value) {
        body.style.overflow = 'hidden'
      } else {
        body.style.overflow = 'auto'
      }

      this.selectedEmployee = this.oldSelectCompany;
      this.$emit("input", value);
    },
    "form.address": {
      handler(address) {
        this.form.com_address = `${address.home_address_1} (${address.home_zip})`;
      },
    },
    fieldId() {
      this.loadEmployeeList();
    },
  },
  computed: {
    projectList() {
      return this.$store.state.project.projectListInfo.data;
    },
    projectId() {
      return parseInt(this.$route.params.proj_id);
    },
    employeeList() {
      if (!this.apiResponseData) return [];

      if (this.apiResponseData.data) {
        return this.apiResponseData.data;
      } else {
        return [];
      }
    },
  },
  data() {
    return {
      showPopup: false,
      mode: "list",

      selectedField: {},
      selectedFieldId: 0,
      selectedCompany: {},
      selectedCompanyId: 0,
      employee: {},
      filterType: '',
      filterTypeOptions: [
        {
          label: '전체',
          value: ''
        }, {
          label: 'ID(사번)',
          value: 'employee_id'
        }, {
          label: '부서',
          value: 'com_name'
        }, {
          label: '구분',
          value: 'job_category'
        }, {
          label: '직종',
          value: 'employment_type'
        }, {
          label: '직급',
          value: 'job_title'
        }, {
          label: '연락처(마지막 4자리)',
          value: 'contact_number'
        }
      ],

      // 현재 검색되어 반환된 리스트
      apiResponseData: [],

      // 현재 선택되어 있는 종사자의 ID 목록
      selectedIds: [],

      oldSelectCompanyId: 0,
      oldSelectCompany: {},
      selectedEmployee: {},

      // 페이징
      page: {
        current: 1,
        lastPage: 1,
        perPage: 5,
      },

      // 겅색
      search: {
        keyword: "", // 검색어
      },

      // 신규작성 / 수정용 데이터
      form: {
        project: [], // 참여 부서
        com_name: "", // 업체명
        com_ceo: "", // 대표자
        com_number: "", // 사업자등록번호
        address: {
          home_zip: "",
          home_address_1: "",
          home_address_2: "",
        },
        com_address: "", // 주소
        com_business_class: "", // 업태
        com_business_type: "", // 업종
        director: "", // 담당자
        phone: "", // 연락처
        file: undefined, // 사업자등록증
      },

      error: {
        com_name: false, // 업체명
        com_ceo: false, // 대표자
        com_number: false, // 사업자등록번호
        com_address: false, // 주소
        com_business_class: false, // 업태
        com_business_type: false, // 업종
        director: false, // 담당자
        phone: false, // 연락처
        file: false, // 사업자등록증

        message: {
          com_name: "업체명을 입력해주세요", // 업체명
          com_ceo: "대표자를 입력해주세요", // 대표자
          com_number: "사업자등록번호를 입력해주세요", // 사업자등록번호
          com_address: "주소를 입력해주세요", // 주소
          com_business_class: "업태를 입력해주세요", // 업태
          com_business_type: "업종을 입력해주세요", // 업종
          director: "담당자를 입력해주세요", // 담당자
          phone: "연락처를 입력해주세요", // 연락처
          file: "사업자등록증을 입력해주세요", // 사업자등록증
        },
      },
    };
  },

  mounted() {
    const backButtonRouteGuard = this.$router.beforeEach((to, from, next) => {
      if (this.showPopup) {
        this.showPopup = false;
        next(false);
        return;
      }
      next(true);
    });
    this.$once("hook:destroyed", () => {
      backButtonRouteGuard();
    });
  },

  created() {
    this.showPopup = this.value;
    this.oldSelectCompanyId = this.selectId;
  },

  methods: {
    async loadEmployeeList() {
      const page = this.page.current;
      const perPage = this.page.perPage;
      const projectId = this.projectId;

      const payload = {
        projectId,
        page,
        perPage,
      }
      if (this.selectedFieldId > 0) {
        payload.field_ids = [this.selectedFieldId];
      }
      if (this.selectedCompanyId > 0) {
        payload.company_id = this.selectedCompanyId;
      }

      // 선택한 필터링 타입에 맞게 검색어를 전달한다
      switch (this.filterType) {
      case '':
        payload.keyword = this.search.keyword;
        break;
      case 'employee_id':
        payload.employee_id = this.search.keyword;
        break;
      case 'com_name':
        payload.com_name = this.search.keyword;
        break;
      case 'job_category':
        payload.job_category = this.search.keyword;
        break;
      case 'employment_type':
        payload.employment_type = this.search.keyword;
        break;
      case 'job_title':
        payload.job_title = this.search.keyword;
        break;
      case 'contact_number':
        payload.contact_number = this.search.keyword;
        break;

      }

      this.apiResponseData = await this.$store.dispatch("employee/LOAD_EMPLOYEE_LIST", payload);

      this.page.current = this.apiResponseData.current_page;
      this.page.perPage = this.apiResponseData.per_page;
      this.page.lastPage = this.apiResponseData.last_page;
    },

    handleClickClose() {
      this.$emit("input", false);
      this.$emit("handleClickClose");
    },

    handleClickSearch() {
      this.loadEmployeeList();
    },

    handleChangePage(page) {
      this.page.current = page;
      this.loadEmployeeList();
    },

    handleItemClickDetail(data) {
      // selectedIds 아이템과 data.id 값이 일치하는 경우, 토글한다
      const index = this.selectedIds.indexOf(data.id);
      if (index > -1) {
        this.selectedIds.splice(index, 1);
      } else {
        this.selectedIds.push(data.id);
      }
    },

    handleClickSelect() {
      this.$emit("input", false);
      this.$emit("handleClickSelect", this.selectedEmployee);
    },

    // 사업장이 선택됐을 대
    handleFieldSelect(fieldData) {
      this.selectedField = fieldData
      this.loadEmployeeList();
    },
    // 부서가 선택됐을 때
    handlerCompanySelect(companyData) {
      this.selectedCompany = companyData
      this.selectedCompanyId = companyData.id
      this.loadEmployeeList();
    },

    // 전달된 employeeId 값이 selectedIds 배열의 아이템 중에 존재할 경우 'active' 문자열을 반환한다.
    // 존재하지 않을 경우 빈 문자열을 반환한다.
    getActiveClass(employeeId) {
      return this.selectedIds.includes(employeeId) ? "active" : "";
    },
  },
};
</script>

<style>
#popupSearchEmployee > .vs-popup {
  width: 1600px !important;
  max-width: 80% !important;

  max-height: 80% !important;
}

#popupSearchEmployee > .vs-popup > .vs-popup--content {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}

.popupSearchEmployee_new {
  height: calc(100% - 40px);
  display: grid;
  grid-auto-rows: auto 1fr auto;
}
.popupSearchEmployee_list {
  height: calc(100% - 40px);
  display: grid;
  grid-auto-rows: auto auto 1fr auto;
}
</style>

<style scoped>
.table-layout {
  border: 1px solid #cdcdcd;
}

.table-layout .trow {
  border-bottom: 1px solid #cdcdcd;
}

.table-layout .tcol {
  border-right: 1px solid #cdcdcd;
}

.vs-con-table.stripe .tr-values.active {
  background: rgb(102, 112, 203) !important;
  color: #fff;
  font-weight: bold;
}

.red {
  color: #ea5455;
}
</style>
