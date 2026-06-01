<template>
  <div>

    <!-- 검색 부분 -->

    <component v-if="tab.search" :is="tab.search" @search="onClickCustomSearch"/>
    <search-nav v-else @handleSearch="() => onClickSearch(nav)">
      <search-nav-item-field label="키워드" v-model="nav.keyword" @keyupEvent="handleInput" />
    </search-nav>

    <!-- 버튼 리스트 -->
    <slot name="top-buttons">
      <div class="flex mb-4 justify-between items-center w-full">
        <!-- 왼쪽 -->
        <div class="flex items-center">
          <div v-if="useTools.total" class="mr-2 pl-2 xl:pl-0" style="font-size: 18px;">
            <span class="mr-2" style="font-weight: 700;">표시된 문서 :</span>
            <span>{{ total }}건</span>
          </div>
        </div>

        <!-- 오른쪽 -->
        <div class="flex gap-4 text-right px-4 xl:px-0">
          <vs-button v-if="useTools.showExcelListDownload" class="" color="secondary" @click="onClickShowExcelListDownload"> List Excel 내려받기 </vs-button>
          <vs-button v-if="useTools.new" class="" color="secondary" @click="onClickNew"> 신규작성 </vs-button>
        </div>
      </div>
    </slot>

    <!--소규모현장 - 현장현황 전용-->
    <div v-if="field.fieldCode === 'workplace-ordering' && `${field.projectId}` === '7'">
      <div class="grid grid-cols-12 gap-x-6 gap-y-4">
        <field-list-item-card v-for="item in tableList" :key="item.id"
                              :field-id="item.id"
                              :selected-field-id="selectedFieldId"
                              :title="item.field_name"
                              :address="item.address"
                              :start-date="item.start_work_at" :end-date="item.be_completed_at"
                              :amount="item.deposit_amount"
                              @on-click-info="onClickDetail"
                              @on-click-select="updateSelectedField(item)" />
      </div>
      <div class="vs-con-table">
        <div class="con-pagination-table vs-table--pagination">
          <k-pagination :total="lastPage ? lastPage : 1" v-model="currentPage" @change="onClickPage"></k-pagination>
        </div>
      </div>
    </div>

    <!-- 목록 -->
    <vs-card v-else>
      <vs-table stripe ref="table" :sst="true" :data="tableList" noDataText="" @sort="onClickSort" @selected="onClickDetail">
        <template slot="thead">
          <vs-th
            v-for="(head, headIndex) in options.getHead()"
            style="min-width: 130px"
            :style="head.style"
            :class="head.class"
            :key="headIndex"
            :sort-key="head.key"
          >
            <span class="w-full text-center">{{ head.name }}</span>
          </vs-th>
        </template>

        <template>
          <vs-tr v-if="tableList.length === 0">
            <vs-td colspan="100">
              <div class="w-full p-5 flex items-center justify-center" style="min-height: 100px;">
                <feather-icon icon="AlertTriangleIcon" class="mr-2"/>
                표시할 데이터가 없습니다.
              </div>
            </vs-td>
          </vs-tr>
          <vs-tr v-else
                 v-for="(row, rowIndex) in tableList"
                 :data="row"
                 :key="rowIndex" >
            <vs-td
              v-for="(col, colIndex) in options.getHead()"
              style="text-align: center;"
              :style="getCol(rowIndex, colIndex, row).style"
            >{{ getCol(rowIndex, colIndex, row).value }}</vs-td>
          </vs-tr>
        </template>
      </vs-table>

      <div class="vs-con-table">
        <div class="con-pagination-table vs-table--pagination">
          <k-pagination :total="lastPage ? lastPage : 1" v-model="currentPage" @change="onClickPage"></k-pagination>
        </div>
      </div>
    </vs-card>

<!-- 팝업 -->
    <popup-excel-download
      v-if="useTools.showExcelListDownload"
      :showHeader="false"
      :col-num="options.getHead().length"
      v-model="popupController.showExcelList"
      :list="popupController.excelList"
      :title="`${tab.field_name} 목록`"
    />
  </div>
</template>

<script>
import moment from "moment";
import includeSinglePage from "@/views/fields/single-page/include";
import SearchNav from "@/components/nav/SearchNav";
import SearchNavItemProject from "@/components/nav/SearchNavItemProject";
import KPagination from "@/components/kPagination/kPagination";
import SearchNavItemKeyword from "@/components/nav/SearchNavItemKeyword";
import SearchNavItemField from "@/components/nav/SearchNavItemField";
import PopupExcelDownload from "@/popup/PopupExcelDownload.vue";
import PopupApprovalProcess from "@/views/approval/PopupApprovalProcess.vue";
import FieldListItemCard from "@/views/fields/component/FieldListItemCard.vue";
export default {
  name: "FieldList",
  components: {
    FieldListItemCard,
    PopupApprovalProcess,
    PopupExcelDownload,
    SearchNavItemField,
    SearchNavItemKeyword,
    KPagination,
    SearchNavItemProject,
    SearchNav,
  },
  props: {
    fieldCode: String,
    tab: Object,
    projectId: [String, Number],
  },
  data() {
    return {
      // 검색 네비게이션
      nav: {
        keyword: "",
      },
      sort: {
        key: "",
        order: "",
      },
      list: [],
      total: 0,
      currentPage: 1,
      lastPage: 1,

      params: {},
      popupController:{
        showExcelList: false,
        excelList: [],
      }
    };
  },
  computed: {
    field () {
      return {
        fieldCode: this.fieldCode,
        pageType: this.tab.pageType,
        projectId: this.projectId,
      }
    },
    options () {
      return this.tab ? this.tab.options : {};
    },
    tableList () {
      return this.list;
    },
    companyList() {
      // 해당 변수를 사용하기 위해서는 loadCompanyList()를 먼저 실행해야 합니다.
      return this.$store.state.company.companyList;
    },
    useTools() {
      // 기본값
      const tools = {
        total: false,
        new: true,
        showExcelListDownload: true,
      }

      if (this.options.useDocumentCount) {
        tools.total = this.options.useDocumentCount(this.field, this.tab)
      }

      if (this.options.useNewButton) {
        tools.new = this.options.useNewButton(this.field, this.tab)
      }

      if (tools.new) {
        if (this.isEditable) {
          tools.new = true;
        } else {
          tools.new = false;
        }
      }

      if (this.options.useshowExcelListDownload) {
        tools.showExcelListDownload = this.options.useshowExcelListDownload(this.field, this.tab)
      }

      return tools
    },
    memberInfo() {
      return this.$store.state.member.memberInfo;
    },
    /**
     * 사용자가 현재 프로젝트에서 선택하고 있는 현장의 ID를 반환합니다.
     */
    selectedFieldId() {
      const metaKey = `selected_field_${this.projectId}`;

      if (this.memberInfo && this.memberInfo.meta) {
        const metaValue = this.memberInfo.meta[metaKey];
        if (metaValue) {
          return JSON.parse(metaValue).id;
        }
      }

      return null;
    },
    /**
     * 현재 사용자가 프로젝트 관리자인지 확인합니다.
     * 프로젝트 관리자는 사업장을 등록/수정/삭제할 수 있습니다.
     * @returns {boolean}
     */
    isProjectManager() {
      const memberInfo = this.memberInfo;
      if (memberInfo) {
        if (memberInfo.is_superuser) {
          return true;
        }

        const projects = memberInfo.projects;
        if (projects && projects.length > 0) {
          for (const project of projects) {
            if (`${project.id}` === `${this.projectId}`) {
              return project.pivot.is_manager;
            }
          }
        }
      }
      return false;
    },
    /**
     * 사업장을 프로젝트 관리자만 수정할 수 있는지 확인합니다.
     * @returns {boolean}
     */
    isFieldEditByManagerOnly() {
      const projectInfo = this.$store.state.project.projectInfo;

      return !!projectInfo.field_edit_by_manager_only;
    },
    isEditable() {
      if (this.isFieldEditByManagerOnly) {
        return this.isProjectManager;
      }
      return true;
    },
    readonly() {
      return !this.isEditable;
    },
  },
  async created() {
    await this.$store.dispatch("member/LOAD_MEMBER_DETAIL");
    await this.$store.dispatch("project/LOAD_PROJECT", {project_id: this.projectId});
  },
  mounted() {
    this.loadFieldList();

    if (includeSinglePage.list.loadCompanyList) {
      this.loadCompanyList();
    }
  },
  methods: {
    // ============ 클릭 이벤트 ============
    onClickNew() { this.$emit("moveCreate"); },
    onClickSort(key, order) {
      this.sort.key = key;
      this.sort.order = order;
      this.loadFieldList();
    },
    onClickDetail(data) {
      const fieldId = data.id
      this.$emit("moveUpdate", fieldId);
    },
    onClickSearch(nav) {
      this.nav = nav
      const params = {
        keyword: this.nav.keyword
      }
      this.params = params
      this.currentPage = 1;
      this.loadFieldList();
    },
    onClickCustomSearch (data) {
      if (this.options.loadFieldList) {
        const params = this.options.loadFieldList(data)
        this.params = params
      }
      this.currentPage = 1;
      this.loadFieldList();
    },
    onClickPage(page) {
      this.currentPage = page;
      this.loadFieldList();
    },
    onClickShowExcelListDownload() {
      this.loadFieldListAll((_list) => {
        const head = this.options.getHead().map((item) => item.name);
        // console.log("head", head)
        const list = [];
        for (let rowIndex = 0, row; row = _list[rowIndex]; rowIndex++) {
          const item = [];
          for (let colIndex = 0, col; col = this.options.getHead()[colIndex]; colIndex++) {
            item.push(this.getCol(rowIndex, colIndex, row).value)
          }
          list.push(item);
        }

        this.popupController.excelList = [head, ...list];
        this.popupController.showExcelList = true;
      });

    },


    // 사업장 검색 폼에서 Enter 키가 눌렸을 때
    handleInput(data) {
      const params = {
        keyword: this.nav.keyword
      }
      this.params = params
      this.loadFieldList();
    },

    getCol(rowIndex, colIndex, value) {
      const options = this.options;
      if (options) {
        const func = {
          // object
          no: this.getNo(rowIndex),
          meta: this.getMeta(value),
          // function
          comma: this.comma,
          date: this.convertDate,
          totalNumDevices: this.totalNumDevices,
          getCompanyName: this.getCompanyName,
          getCompanyNames: this.getCompanyNames,
          onNameBlur: this.onNameBlur,
          getContent: this.getContent,
          getContentTargetList: this.getContentTargetList,
          getContentRiskList: this.getContentRiskList,
          getContentStringList: this.getContentStringList,
        }
        const col = options.getCol(colIndex, value, func);
        if (typeof col === 'string' || typeof col === 'number') {
          return { type: 'text', value: col, style:{} }
        }
        if (!col) return {
          style: {},
          type: 'text',
          value: '',
        };
        return col;
      }
      return {
        style: {},
        type: 'text',
        value: '',
      };
    },
    getNo(index) {
      const total = Number(`${this.total}`)
      const currentPage = Number(`${this.currentPage}`)
      const perPage = this.options.getPerPage ? Number(`${this.options.getPerPage(this.tab)}`) : 10 // 기본값 10
      return total - currentPage * perPage + (perPage - index)
    },

    getMeta(row) {
      try {
        if (typeof row.meta === 'string') {
          return JSON.parse(row.meta)
        }
        return row.meta
      } catch (e) {
        return {}
      }

      return {}
    },

    async loadFieldList() {
      const projectId = this.projectId;
      const page = this.currentPage;
      const perPage = this.options.getPerPage(this.tab);
      const code = this.fieldCode;
      const params = this.params;

      const options = { projectId, code, page, perPage, ...params }

      if (this.sort.key && this.sort.order) {
        options.order_by = `${this.sort.key}`.replaceAll("body.", "");
        options.order_direction = this.sort.order;
      }

      if (JSON.stringify(options) === JSON.stringify(this.apiLastLoadOptions)) {
        // 이전과 동일한 옵션으로 리스트를 불러옵니다.
        return;
      }
      this.apiLastLoadOptions = JSON.parse(JSON.stringify(options));
      await this.$store.dispatch("project/LOAD_FIELD_LIST", options);

      const fieldListInfo = this.$store.state.project.fieldListInfo;
      this.list = fieldListInfo.data;
      this.currentPage = fieldListInfo.current_page;
      this.lastPage = fieldListInfo.last_page;
      this.total = fieldListInfo.total;
    },

    loadFieldListAll(callback) {
      const projectId = this.projectId;
      const page = 1;
      const perPage = 10000;
      const code = this.fieldCode;
      const params = this.params;

      const options = { projectId, code, page, perPage, ...params }
      this.$store.dispatch("project/LOAD_FIELD_LIST", options).then((fieldListInfo) => {
        const list = fieldListInfo.data;
        callback(list);
      });
    },

    async loadCompanyList() {
      const projectId = this.projectId;
      const page = 1;
      const perPage = 10000;
      await this.$store.dispatch("company/LOAD_COMPANY_LIST", {
        page,
        perPage,
        projectId,
      });
    },

    // ===============  func ===============
    comma(str) {
      return `${str}`.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    convertDate(data, format = 'YYYY-MM-DD') {
      if (data === "") return "";
      return moment(data).format(format);
    },
    totalNumDevices(data) {
      // 오브젝트의 value를 전부 합한 값을 리턴
      let sum = 0;
      for (const key in data) {
        sum += data[key];
      }
      return sum;
    },
    // 해당 함수를 사용하기 위해서는 loadCompanyList()를 먼저 실행해야 합니다.
    getCompanyName(comId) {
      for (const com of this.companyList) {
        if (com.id === comId) {
          return com.com_name;
        }
      }
    },
    getCompanyNames(companies) {
      return companies ? companies.map((item) => item.com_name).join(", ") : "-";
    },
    onNameBlur(name) {
      const length = name.length;
      if (2 < length) {
        const first = name[0];
        const last = name[name.length - 1];
        let star = "";
        for (let index = 0; index < length - 2; index++) {
          star += "*";
        }
        name = first + star + last;
      } else if (length === 2) {
        const first = name[0];
        name = `${first}*`;
      }
      return name;
    },
    getContent(data) {
      if (data.post_content) {
        const content = JSON.parse(data.post_content);
        return content;
      }
    },
    getContentTargetList(list) {
      let result = "";
      for (const data of list) {
        if (!result.includes(data.target)) {
          result += `${data.target},`;
        }
      }
      return result.substring(0, result.length - 1);
    },
    getContentRiskList(list) {
      let result = "";
      for (const data of list) {
        if (!result.includes(data.input_3)) {
          result += `${data.input_3},`;
        }
      }
      return result.substring(0, result.length - 1);
    },
    getContentStringList(list) {
      let result = "";
      for (const data of list) {
        if (!result.includes(data)) {
          result += `${data},`;
        }
      }
      return result.substring(0, result.length - 1);
    },

    /**
     * 현재 프로젝트에 대해서 기본 값으로 선택하는 사업장 정보를 업데이트합니다.
     * @param field
     */
    async updateSelectedField(field) {
      const param = {
        userId: this.memberInfo.id,
        metas: [
          {
            key: `selected_field_${this.projectId}`,
            value: JSON.stringify({
              id: field.id,
              field_name: field.field_name,
              field_code: field.field_code,
              field_type: field.field_type,
              address: field.address,
              be_completed_at: field.be_completed_at,
              start_work_at: field.start_work_at,
              deposit_amount: field.deposit_amount,
              director_name: field.director_name,
              facility_category_id: field.facility_category_id,
              facility_category: field.facility_category,
              manager_name: field.manager_name,
              safety_manager_name: field.safety_manager_name,
              work_begin_at: field.work_begin_at,
              work_end_at: field.work_end_at,
            }),
          }
        ]
      };
      await this.$store.dispatch('member/MODIFY_MEMBER', param)
        .then((/*response*/) => {
          // 사용자 정보를 업데이트하고, 변경된 사용자 정보를 새로 불러오도록 한다
          this.$store.dispatch("member/LOAD_MEMBER_DETAIL");
        });
    },
  },
};
</script>

<style scoped></style>
