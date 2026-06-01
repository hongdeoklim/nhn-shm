<template>
    <vs-popup class="popupSearchField" :title="`${fieldLabel} 불러오기`" :active.sync="showPopup">
        <vs-tabs v-if="projectList.length > 1" :value="tabIndex">
            <vs-tab v-for="project of projectList" :key="project.id" :label="project.field_name" @click="onClickTab(project.id)" />
        </vs-tabs>

        <!-- 현장 -->
        <div>
          <!-- 검색 -->
          <div v-if="isMobile" class="mobile flex justify-between items-center shadow rounded-lg pb-4 mb-4">
            <div class="flex">
              <ml-input v-model="search.keyword" class="w-full" placeholder="검색어 입력" @keyup.enter="handleClickSearch" />
            </div>
            <div>
              <vs-button color="secondary" @click="handleClickSearch">검색</vs-button>
            </div>
          </div>
          <div v-else style="border-bottom: 1px solid #e0e0e0" class="flex flex-wrap  items-center justify-between gap-y-4 shadow rounded-lg p-5 mb-6">
            <div class="flex items-center gap-4">
              <p style="width: 114px" class="px-2">검색어</p>
              <ml-input v-model="search.keyword" class="w-full" @keyup.enter="handleClickSearch" />
            </div>
            <div class="ml-auto">
              <vs-button v-if="search.appliedKeyword" color="secondary" type="border" class="mr-2" @click="handleClickReset">초기화</vs-button>
              <vs-button color="secondary" @click="handleClickSearch">검색</vs-button>
            </div>
          </div>
          <vs-row>
            <vs-col style="max-height: 500px; overflow-y: auto">
              <vs-table stripe ref="table" :sst="true" :max-items="page.perPage" :data="getTableData"
                        noDataText="데이터가 없습니다" @selected="handleItemClickDetail" class="field-table">
                <template slot="thead">
                  <vs-th class="whitespace-no-wrap">No.</vs-th>
                  <vs-th class="whitespace-no-wrap">현장명</vs-th>
                  <vs-th v-if="!isMobile" class="whitespace-no-wrap">주소</vs-th>
                  <vs-th class="whitespace-no-wrap">사업기간</vs-th>
                  <vs-th class="whitespace-no-wrap">사업금액</vs-th>
                  <vs-th v-if="isMobile" class="whitespace-no-wrap">주소</vs-th>
                </template>

                <template slot-scope="{ data }">
                  <vs-tr v-for="(field, index) in data" :key="index" :class="selectField && selectField.id === field.id ? 'active' : ''" :data="field">
                    <template v-if="field.id > 0">
                    <vs-td class="whitespace-no-wrap">{{ (page.current - 1) * page.perPage + index + 1 }}</vs-td>
                    <vs-td class="whitespace-no-wrap">{{ field.field_name }}</vs-td>
                    <vs-td v-if="!isMobile">{{ field.address ? field.address : '-' }}</vs-td>
                    <vs-td class="whitespace-no-wrap">{{
                        field.start_work_at || field.be_completed_at ? (field.start_work_at ? getFormattedDate(field.start_work_at) : '') + ' ~ ' + (field.be_completed_at ? getFormattedDate(field.be_completed_at) : '') : '-'
                      }}
                    </vs-td>
                    <vs-td class="whitespace-no-wrap">{{
                        field.deposit_amount ? new Intl.NumberFormat().format(parseInt(field.deposit_amount.replace(/,/g, ''))) : '-'
                      }}
                    </vs-td>
                    <vs-td v-if="isMobile" style="min-width: 300px;" class="whitespace-no-wrap">{{ field.address ? field.address : '-' }}</vs-td>
                    </template>
                    <template v-else>
                      <vs-td></vs-td>
                      <vs-td>&nbsp;</vs-td>
                      <vs-td></vs-td>
                      <vs-td></vs-td>
                      <vs-td></vs-td>
                    </template>
                  </vs-tr>
                </template>
              </vs-table>

              <div class="vs-con-table">
                <div class="con-pagination-table vs-table--pagination">
                  <k-pagination :total="page.lastPage ? page.lastPage : 0" v-model="page.current"
                                @change="handleChangePage"></k-pagination>
                </div>
              </div>
            </vs-col>

            <vs-col class="mt-4 flex" vs-align="center" vs-justify="flex-end">
              <vs-button class="mr-4" color="#EDEDED" text-color="black" type="filled" @click="handleClickClose">닫기
              </vs-button>
              <vs-button color="secondary" @click="handleClickSelect">선택</vs-button>
            </vs-col>
          </vs-row>
        </div>
    </vs-popup>
</template>

<script>
import KPagination from "@/components/kPagination/kPagination";
import moment from "moment";

export default {
  name: "PopupSearchField",
  components: { KPagination },
  props: {
    value: Boolean,
    selectId: [String, Number],
    useTypes: Array,
    fieldLabel: {
      type: String,
      default: '현장명'
    }
  },
  computed: {
    projectId() {
      return parseInt(this.$route.params.proj_id);
    },
    getType() {
      return this.type;
    },
    getTableData() {
      // this.fieldList 개수가 this.page.perPage 보다 작으면 빈 데이터를 채워준다
      const data = this.fieldList;
      const perPage = this.page.perPage;
      const emptyData = Array(perPage - data.length).fill({
        id: -1,
        field_name: "",
        address: "",
        start_work_at: "",
        be_completed_at: "",
        deposit_amount: "",
      });
      return data.concat(emptyData);
    }
  },
  watch: {
    value(data) {
      this.showPopup = data;
      if (this.oldSelectField && this.oldSelectField.id) {
        this.selectField = this.oldSelectField;
      }
    },
    selectId(id) {
      this.oldSelectFieldId = id;
      if (this.fieldList && this.fieldList.length > 0) {
        for (const field of this.fieldList) {
          if (field.id === this.oldSelectFieldId) {
            try {
              this.oldSelectField = field;
              this.selectField = field;
            } catch (ignore) {
              // Ignore
            }
            break;
          }
        }
      }
    },
    showPopup(value) {
      if (value) {
        this.search.keyword = this.search.appliedKeyword;
      }

      const body = document.querySelector('body');
      if (value) {
        body.style.overflow = 'hidden'
      } else {
        body.style.overflow = 'auto'
      }

      this.selectField = this.oldSelectField;
      this.$emit("input", value);
      this.loadFieldList();
    },

    useTypes: {
      immediate: true,
      handler(type) {
        if (type && type.length > 0) {
          let i = 0;
          for (i = 0; i < this.useTypes.length; i++) {
            const type = this.useTypes[i];
            this.tabIndex = i;
            this.selectTab = type;
            if (type === "현장(직접수행)") break;
            else if (type === "현장(용역위탁)") break;
            else if (type === "현장(도급발주)") break;
            else if (type === "시설물") break;
          }
        }
      },
    },
  },
  data() {
    return {
      isMobile: false,
      showPopup: false,

      currentProject: {},
      projectList: [],
      selectedProjectId: 0,

      fieldList: [],

      oldSelectFieldId: 0,
      oldSelectField: {},
      selectField: {},

      // 페이징
      page: {
        current: 1,
        lastPage: 1,
        perPage: 5,
      },

      // 겅색
      search: {
        keyword: "", // 검색어
        appliedKeyword: "", // 적용된 검색어
      },
      selectTab: "현장(직접수행)",
      tabIndex: 0,
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

    // 프로젝트 목록을 불러온다
    this.$store
      .dispatch("project/LOAD_PROJECT_LIST", {
        page: 1,
        perPage: 1000,
        onlyMe: true,
      })
      .then((value) => {
        if (value.data) {
          for (const project of value.data) {
            if (project.id === parseInt(this.$route.params.proj_id)) {
              this.currentProject = project;
            }

            // 총괄 프로젝트는 포함시키지 않는다
            if (project.is_field_oversee) {
              continue;
            }

            this.projectList.push(project);
          }
        }

        // 현재 조회하는 프로젝트가, 총괄 프로젝트가 아니라면, 현재 프로젝트에 포함된 Field만 조회시켜야 한다
        if (!this.currentProject.is_field_oversee) {
          this.projectList = [this.currentProject];
        }

        if (this.projectList.length > 0) {
          this.selectedProjectId = this.projectList[0].id;
        }

        // Field 목록을 조회한다
        this.loadFieldList();
      });
  },

  async created() {
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile);

    this.showPopup = this.value;
    this.oldSelectFieldId = this.selectId;
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.checkMobile)
  },

  methods: {
    getFormattedDate(dateStr) {
      const dateMoment = moment(dateStr);
      if (dateMoment.isValid()) {
        return dateMoment.format('YYYY-MM-DD');
      } else {
        return '';
      }
    },
    async loadFieldList() {
      if (this.selectedProjectId < 1) {
        return;
      }

      const page = this.page.current;
      const perPage = this.page.perPage;
      const keyword = this.search.keyword;
      const projectId = this.selectedProjectId;

      await this.$store.dispatch("project/LOAD_FIELD_LIST", {
        page,
        perPage,
        keyword,
        projectId,
      });

      this.search.appliedKeyword = keyword;
      this.fieldList = this.getFieldList();
    },

    getFieldList() {
      const info = this.$store.state.project.fieldListInfo;
      const list = info.data;

      if (list) {
        this.page.current = info.current_page;
        this.page.perPage = info.per_page;
        this.page.lastPage = info.last_page;

        for (const field of list) {
          if (field.id === this.oldSelectFieldId) {
            this.oldSelectField = field;
            this.selectField = field;
            break;
          }
        }

        return list;
      } else {
        return [];
      }
    },

    onClickTab(tabKey) {
      this.selectTab = tabKey;

      this.page.current = 1;
      this.selectField = {};
      this.selectedProjectId = tabKey;

      this.loadFieldList();
    },

    handleClickClose() {
      this.$emit("input", false);
      this.$emit("handleClickClose");
    },

    handleClickSearch() {
      this.page.current = 1;
      this.loadFieldList();
    },
    handleClickReset() {
      this.search.keyword = "";
      this.page.current = 1;
      this.loadFieldList();
    },

    handleChangePage(page) {
      this.page.current = page;
      this.loadFieldList();
    },

    handleItemClickDetail(data) {
      if (data.id < 0) {
        return;
      }

      if (this.selectField === data) {
        this.selectField = {};
      } else {
        this.selectField = data;
      }
    },

    handleClickSelect() {
      this.$emit("input", false);
      this.$emit("handleClickSelect", this.selectField);
    },

    checkMobile() {
      this.isMobile = window.innerWidth < 768;
    },
  },
};
</script>

<style>
.popupSearchField > .vs-popup {
    width: 1200px !important;
    max-width: 90% !important;
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
    font-width: bold;
}
</style>

<style lang="scss" scoped>
.field-table::v-deep {
    th .vs-table-text {
        justify-content: center;
    }
    td {
        text-align: center;
    }
}
</style>
