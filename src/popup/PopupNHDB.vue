<template>
  <vs-popup id="popupNHDB" title="농협네트웍스 D/B" :active.sync="showPopup">
    <!-- Search -->
    <div class="flex justify-between gap-4 p-6">
      <div class="flex items-center gap-4">
        <label class="search-label"> 사업분야 </label>
        <vs-select autocomplete v-model="search.businessArea" @change="onChangeBusinessArea">
          <vs-select-item v-for="item of businessAreaList" :key="item" :value="item" :text="item" />
        </vs-select>
        <label class="search-label"> 공종명 </label>
        <vs-select autocomplete v-model="search.processName" @change="onChangeProcessName">
          <vs-select-item v-for="item of processNameList" :key="item" :value="item" :text="item" />
        </vs-select>
        <label class="search-label"> 작업내용 </label>
        <vs-select autocomplete v-model="search.taskName" @change="loadRiskReferenceList">
          <vs-select-item v-for="item of taskNameList" :key="item" :value="item" :text="item" />
        </vs-select>
        <ml-input icon-pack="feather" icon="icon-search" placeholder="키워드" v-model="search.keyword" />
      </div>
      <vs-button color="secondary" @click="handleClickSearch"> 검색 </vs-button>
    </div>

    <!-- Table -->
    <div>
      <vs-table stripe ref="table" :sst="true" :max-items="page.perPage" :data="riskList" noDataText="데이터가 없습니다" class="risk-table">
        <template slot="thead">
          <vs-th style="width: 5%"> <vs-checkbox :value="isAllCheck" @click.native="onClickAllCheck" /></vs-th>
          <vs-th style="width: 5%">No.</vs-th>
          <vs-th style="width: 10%">작업내용</vs-th>
          <vs-th>평가구분</vs-th>
          <vs-th>유해·위험요인</vs-th>
          <vs-th>재해형태</vs-th>
          <vs-th>개선대책</vs-th>
          <vs-th style="width: 5%">빈도</vs-th>
          <vs-th style="width: 5%">강도</vs-th>
          <vs-th style="width: 5%">위험도</vs-th>
          <vs-th style="width: 10%">검토후 추가 개선대책</vs-th>
        </template>

        <template slot-scope="{ data }">
          <vs-tr v-for="(risk, index) in data" :data="risk" :key="index">
            <vs-td><vs-checkbox :vs-value="risk.id" v-model="checkIds" @input="changeCheck(risk)" /></vs-td>
            <vs-td>{{ risk.id }}</vs-td>
            <vs-td>{{ risk.task_name }}</vs-td>
            <vs-td>{{ risk.classification }}</vs-td>
            <vs-td>{{ risk.risk_factor }}</vs-td>
            <vs-td>{{ risk.disaster_type }}</vs-td>
            <vs-td>{{ risk.improvement }}</vs-td>
            <vs-td>{{ risk.frequency }}</vs-td>
            <vs-td>{{ risk.strength }}</vs-td>
            <vs-td>{{ risk.risk }}</vs-td>
            <vs-td>{{ risk.additional_improvement }}</vs-td>
          </vs-tr>
        </template>
      </vs-table>
      <div class="vs-con-table">
        <div class="con-pagination-table vs-table--pagination">
          <k-pagination :total="page.lastPage ? page.lastPage : 0" v-model="page.current" @change="handleChangePage" />
        </div>
      </div>
    </div>

    <!-- Buttons -->
    <div class="flex items-center justify-end gap-4 p-6 pt-0">
      <vs-button color="secondary" @click="finishDataSelect">적용</vs-button>
      <vs-button color="secondary" type="border" @click="popupClose">취소</vs-button>
    </div>
  </vs-popup>
</template>

<script>
import SearchNavItemKeyword from "@/components/nav/SearchNavItemKeyword.vue";
import KPagination from "@/components/kPagination/kPagination";

export default {
  name: "PopupNHDB",
  components: { SearchNavItemKeyword, KPagination },
  props: {
    value: Boolean,
  },
  data() {
    return {
      showPopup: this.value,

      businessAreaList: [],
      processNameList: [],
      taskNameList: [],

      checkIds: [],
      checkDatas: [],

      // 페이징
      page: {
        current: 1,
        lastPage: 1,
        perPage: 5,
      },

      // 겅색
      search: {
        businessArea: "", // 사업분야
        processName: "", // 공정명
        taskName: "", // 평가 작업명
        keyword: "", // 검색어
      },
    };
  },
  computed: {
    riskList() {
      const info = this.$store.state.project.hasRiskReferenceList;

      if (!info) return [];
      const options = info.options;
      const data = info.data;
      const list = data.data;

      this.businessAreaList = options.business_area;
      this.processNameList = options.process_name;
      this.taskNameList = options.task_name;

      this.page.current = data.current_page;
      this.page.perPage = data.per_page;
      this.page.lastPage = data.last_page;

      if (this.businessAreaList.length > 0) {
        this.search.businessArea = this.businessAreaList[0]
      }

      return list;
    },
    isAllCheck() {
      const check = this.riskList.filter((data) => this.checkIds.includes(data.id));
      return check.length === this.page.perPage;
    },
  },
  watch: {
    value: {
      handler(value) {
        this.showPopup = value;
      },
    },
    showPopup: {
      handler(value) {
        const body = document.querySelector('body');
        if (value) {
          body.style.overflow = 'hidden'
          this.resetData();
        } else {
          body.style.overflow = 'auto'
        }
        this.$emit("input", value);
      },
    },
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
  methods: {
    resetData() {
      this.page = {
        current: 1,
        lastPage: 1,
        perPage: 5,
      };
      this.search = {
        businessArea: "", // 사업분야
        processName: "", // 공정명
        taskName: "", // 평가 작업명
        keyword: "", // 검색어
      };

      this.checkIds = [];
      this.checkDatas = [];
    },
    popupOpen() {
      this.resetData();
      this.loadRiskReferenceList();
      this.showPopup = true;
    },
    popupClose() {
      this.showPopup = false;
    },
    async loadRiskReferenceList() {
      const page = this.page.current;
      const perPage = this.page.perPage;
      const businessArea = this.search.businessArea,
        processName = this.search.processName,
        taskName = this.search.taskName,
        keyword = this.search.keyword;
      await this.$store.dispatch("project/HSE_LOAD_RISK_REFERENCE", {
        page,
        perPage,
        businessArea,
        processName,
        taskName,
        keyword,
      });
    },

    onChangeBusinessArea() {
      this.search.processName = "";
      this.search.taskName = "";

      this.loadRiskReferenceList();
    },
    onChangeProcessName() {
      this.search.taskName = "";
      this.loadRiskReferenceList();
    },

    handleClickSearch() {
      this.loadRiskReferenceList();
    },

    handleChangePage(page) {
      this.page.current = page;
      this.loadRiskReferenceList();
    },

    onClickAllCheck() {
      const listIds = this.riskList.map((item) => item.id);
      if (this.isAllCheck) {
        this.checkIds = this.checkIds.filter((id) => !listIds.includes(id));
        this.checkDatas = this.checkDatas.filter((data) => this.checkIds.includes(data.id));
      } else {
        this.checkIds = [...new Set(this.checkIds.concat(listIds))];

        this.checkDatas = this.checkDatas.concat(this.riskList).reduce(function (acc, current) {
          if (acc.findIndex(({ id }) => id === current.id) === -1) {
            acc.push(current);
          }
          return acc;
        }, []);
      }
    },
    changeCheck(data) {
      if (this.checkIds.includes(data.id)) this.checkDatas.push(data);
      else this.checkDatas = this.checkDatas.filter((cd) => cd.id !== data.id);
    },

    finishDataSelect() {
      this.originCheckDatas = this.checkDatas;
      this.$emit("selectData", this.checkDatas);
      this.popupClose();
    },
  },
};
</script>
<style lang="scss" scoped>
#popupNHDB::v-deep > .vs-popup {
  width: 90% !important;
  .search-label {
    width: 114px;
  }

  .vs-popup--content {
    width: 100%;
    padding: 0;
    margin: 0;

    .vs-row {
      padding: 24px;
    }
  }
}
.risk-table::v-deep {
  th .vs-table-text {
    justify-content: center !important;
    white-space: nowrap;
  }
  // table {
  //   table-layout: fixed;
  // }
  // td {
  //   overflow: hidden;
  //   white-space: nowrap;
  //   text-overflow: ellipsis;
  // }
}
</style>
