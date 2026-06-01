<template>
  <div>
    <!-- 부서명 -->
    <vx-card class="mb-8">
      <vs-row class="flex w-auto mr-4" vs-align="center">
        <vs-col class="w-auto mr-4">부서명</vs-col>
        <vs-col class="w-auto">
          <vs-select autocomplete v-model="selectedCompany">
            <vs-select-item v-for="(item, index) in companyList" :key="index" :text="item.com_name" :value="item" />
          </vs-select>
        </vs-col>
      </vs-row>
    </vx-card>

    <!-- =================================== 내용 =================================== -->
    <vx-card>
      <!-- 사업장 현황 -->
      <div>
        <p class="title mb-5">{{ tabName }} 현황</p>
        <div class="select-table-container">
          <table class="select-table">
            <thead>
            <th>{{ tabName }}명</th>
            <th>담당 주무관</th>
            <th>{{ tabName }} 주소</th>
            </thead>
            <tbody>
            <tr v-for="tr in table.list" :key="tr.id" :class="selectId === tr.id && 'selected'" @click="onClickSelectData(tr)">
              <td>{{ !!tr.field_name ? tr.field_name : "-" }}</td>
              <td>{{ !!tr.manager_name ? tr.manager_name : "-" }}</td>
              <td>{{ !!tr.address ? tr.address : "-" }}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="vs-con-table">
          <div class="con-pagination-table vs-table--pagination">
            <k-pagination :total="lastPage ? lastPage : 1" v-model="currentPage" @change="handleChangePage"></k-pagination>
          </div>
        </div>
      </div>

      <!-- 사업장 정보 -->
      <div class="mt-8">
        <p class="title mb-5">{{ tabName }} 정보</p>
        <div class="writeGridContainer">
          <div>
            <div>{{ tabName }}명</div>
            <ml-input readonly :value="!!selectData ? selectData.field_name : ''" />
          </div>
          <div>
            <div>담당 주무관</div>
            <ml-input readonly :value="!!selectData ? selectData.manager_name : ''" />
          </div>
          <div>
            <div>{{ tabName }} 주소</div>
            <ml-input readonly :value="!!selectData ? selectData.address : ''" />
          </div>
          <div>
            <div>{{ tabName }} 연락처</div>
            <ml-input readonly :value="!!selectData ? selectData.phone : ''" />
          </div>
        </div>
      </div>

      <!-- 담당 부서 정보 -->
      <div class="mt-8">
        <p class="title mb-5">담당 부서 정보</p>
        <div class="select-table-container">
          <table class="select-table">
            <thead>
            <th>구분</th>
            <th>부서명</th>
            <th>연락처</th>
            </thead>
            <tbody>
            <tr v-for="tr in companyTable.list" :key="tr.id" :class="selectCompanyId === tr.id && 'selected'" @click="() => onClickCompanySelectData(tr)">
              <td>{{ tr.com_type }}</td>
              <td>{{ tr.com_name }}</td>
              <td>{{ tr.com_number }}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="vs-con-table">
          <div class="con-pagination-table vs-table--pagination">
            <k-pagination :total="companyTable.lastPage ? companyTable.lastPage : 1" v-model="companyTable.currentPage" @change="handleCompanyChangePage"></k-pagination>
          </div>
        </div>
      </div>

      <!-- 부서 세부 정보 -->
      <!-- <div class="mt-8">
        <p class="title mb-5">부서 세부 정보</p>
        <div class="writeGridContainer">
          <div>
            <div>구분</div>
            <ml-input readonly :value="!!selectCompanyData ? selectCompanyData.com_type : ''" />
          </div>
          <div></div>
          <div></div>
          <div>
            <div>부서명</div>
            <ml-input readonly :value="!!selectCompanyData ? selectCompanyData.com_name : ''" />
          </div>
          <div>
            <div>대표자</div>
            <ml-input readonly :value="!!selectCompanyData ? selectCompanyData.com_ceo : ''" />
          </div>
          <div>
            <div>사업자번호</div>
            <ml-input readonly :value="!!selectCompanyData ? selectCompanyData.com_number : ''" />
          </div>
          <div>
            <div>주소</div>
            <ml-input readonly :value="!!selectCompanyData ? selectCompanyData.com_address : ''" />
          </div>
          <div>
            <div>업태</div>
            <ml-input readonly :value="!!selectCompanyData ? selectCompanyData.com_business_class : ''" />
          </div>
          <div>
            <div>업종</div>
            <ml-input readonly :value="!!selectCompanyData ? selectCompanyData.com_business_type : ''" />
          </div>
          <div>
            <div>담당자</div>
            <ml-input readonly :value="!!selectCompanyData ? selectCompanyData.director : ''" />
          </div>
          <div>
            <div>연락처</div>
            <ml-input readonly :value="!!selectCompanyData ? selectCompanyData.phone : ''" />
          </div>
        </div>
      </div> -->

      <!-- 참여 인원 정보 -->
      <!-- <company-user-auth-module
        :colData="[
          { head: '구분', key: 'department' },
          { head: '사용자명', key: 'name' },
          { head: '연락처', key: 'phone' },
        ]"
        :users="users"
        type="info"
        class="mt-8"
      /> -->
    </vx-card>
  </div>
</template>

<script>
import FileInput from "@/components/custom/FileInput";
import SearchNavItemSelect from "@/components/nav/SearchNavItemSelect";
import SearchNavStartEnd from "@/components/nav/SearchNavStartEnd.vue";
import FileUploadModule from "@/views/modules/FileUploadModule";
import CompanyUserAuthModule from "@/views/_BS/components/CompanyUserAuthModule";
import DateSelector from "@/components/selector/DateSelector";
import KPagination from "@/components/kPagination/kPagination";
import DateSelectorRang from "@/components/selector/DateSelectorRang";

export default {
  components: {
    DateSelector,
    CompanyUserAuthModule,
    SearchNavStartEnd,
    SearchNavItemSelect,
    FileInput,
    FileUploadModule,
    KPagination,
    DateSelectorRang,
  },
  data() {
    return {
      // 부서명
      selectedCompany: null,
      companyList: [],

      // 창고 현황
      currentPage: 1,
      lastPage: 1,
      total: 0,
      table: {
        list: [],
        perPage: 5,
        keyword: "",
      },
      selectId: null,
      selectData: null,

      // 부서정보
      companyTable: {
        list: [],
        page: 1,
        lastPage: 1,
        total: 0,
        perPage: 5,
      },
      selectCompanyId: null,
      selectCompanyData: null,

      keyword: "",
      users: [],
    };
  },
  computed: {
    projectId() {
      return this.$route.params.proj_id;
    },
    tabName() {
      if (`${this.projectId}` === "2") {
        return "부서";
      }
      return "사업장";
    },
    getTags() {
      if (`${this.projectId}` === "2") {
        return ["부서 등록", "부서 현황"];
      }
      return ["사업장 등록", "사업장 현황"];
    },
  },
  watch: {
    selectedCompany(/*value*/) {
      // 초기화
      this.currentPage = 1;
      this.lastPage = 1;
      this.total = 0;
      this.table = {
        list: [],
        perPage: 5,
        keyword: "",
      };
      this.selectId = null;
      this.selectData = null;
      this.selectCompanyId = null;
      this.selectCompanyData = null;

      this.keyword = "";
      this.users = [];

      this.loadCompanyInfo();
    },
  },
  mounted() {
    this.$store.dispatch("company/LOAD_COMPANY_TREE", { projectId: this.projectId }).then(async (value) => {
      const companyTree = value;
      const list = [];
      for (const com of companyTree) {
        if (com.descendant) list.push(com.descendant);
      }
      this.companyList = list;

      let myInfo = this.$store.state.auth.userInfo;
      if (!myInfo.company_id) {
        await this.$store.dispatch("USER_INFO");
        myInfo = this.$store.state.auth.userInfo;
      }
      this.selectedCompany = this.companyList.find((com) => com.id === myInfo.company_id);

      this.loadCompanyInfo();
    });
  },
  methods: {

    // =============== 창고 현황 ===============
    loadCompanyInfo() {
      if (!this.selectedCompany) return;
      const page = this.currentPage;
      const perPage = this.table.perPage;
      const companyId = this.selectedCompany.id;
      const projectId = this.projectId;
      this.$store.dispatch("company/LOAD_COMPANY_FIELD", { companyId, projectId, fieldCode: "workplace-insider", page, perPage }).then((value) => {
        const fieldListInfo = value;
        this.table.list = fieldListInfo.data.map((item) => {
          return { ...item, meta: typeof item.meta === "object" ? JSON.parse(item.meta) : item.meta };
        });

        this.currentPage = fieldListInfo.current_page;
        this.lastPage = fieldListInfo.last_page;
        this.total = fieldListInfo.total;

        this.keyword = "";
        this.users = [];
      });
    },

    onClickSelectData(data) {
      this.selectId = data.id;
      this.selectData = data;

      this.loadFieldCompanys();
      this.loadFieldUsers();
    },
    handleChangePage(page) {
      this.currentPage = page;
      this.loadCompanyInfo();
    },

    // =============== 부서 정보 ===============
    loadFieldCompanys() {
      if (this.selectId) {
        this.$store.dispatch("project/LOAD_FIELD_COMPANYS", { fieldId: this.selectId, page: this.companyTable.page, perPage: this.companyTable.perPage }).then((result) => {
          this.companyTable.lastPage = result.last_page;
          this.companyTable.total = result.total_count;
          this.companyTable.list = result.data;
        });
      }
    },
    handleCompanyChangePage(page) {
      this.companyTable.currentPage = page;
      this.loadFieldCompanys();
    },
    onClickCompanySelectData(data) {
      this.selectCompanyId = data.id;
      this.selectCompanyData = data;
    },

    // =============== 참여 인원 정보 ===============
    loadFieldUsers() {
      if (this.selectId) {
        this.$store.dispatch("project/LOAD_FIELD_USERS", { fieldId: this.selectId }).then((value) => {
          this.users = value.data;
        });
      }
    },

    // =============== 기타 ===============
    jsonParse(str) {
      return JSON.parse(str);
    },
    totalNumDevices(data) {
      // 오브젝트의 value를 전부 합한 값을 리턴
      let sum = 0;
      for (const key in data) {
        sum += data[key];
      }
      return sum;
    },
    comma(str) {
      return `${str}`.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
};
</script>

<style scoped lang="scss">
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

.select-table-container {
  overflow-x: auto;
  table.select-table {
    table-layout: fixed;
    border-collapse: collapse;
    width: 100%;
    min-width: 1200px;

    background: #f8f8f8;
    border: 2px solid #f8f8f8;

    th,
    td {
      text-align: center;
      background: white;
      padding: 10px 15px;
    }

    td {
      cursor: pointer;
    }

    tr:nth-child(1) td {
      background: #f8f8f8;
    }

    tr.selected td {
      background: rgba(126, 114, 242, 0.6) !important;
      color: white;
    }
  }
}

table.custom {
  table-layout: fixed;
  border-collapse: collapse;
  width: 100%;

  th,
  td {
    border: 1px solid #cdcdcd;
  }

  th {
    font-weight: 500;
    font-size: 14px;
    text-align: center;

    background: #f9f9f9;
    padding: 15px 4px;
  }
  td {
    height: 40px;

    text-align: center;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;

    padding: 6px;
  }
}

.vulnerable table {
  table-layout: fixed;
  border-collapse: collapse;
  width: 100%;

  th,
  td {
    border: 1px solid #cdcdcd;
  }

  th {
    font-weight: 500;
    font-size: 14px;
    text-align: center;

    background: #f9f9f9;
    padding: 15px 4px;
  }
  td {
    padding: 6px;
  }
}
</style>
