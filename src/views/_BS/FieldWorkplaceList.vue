<template>
  <vs-tabs :value="0">
    <vs-tab label="현장 등록" @click="onClickTab(0)">
      <div>
        <search-nav>
          <search-nav-item-project :label="$t('search.현장명')" />
        </search-nav>

        <div class="flex justify-end gap-4 w-full text-right mb-4 px-4 xl:px-0" v-if="parseInt(this.$store.state.auth.userInfo.is_superuser) === 1">
          <vs-button class="flex-1 xl:flex-none" color="secondary" @click="onClickNew"> 신규작성 </vs-button>
        </div>
        <vs-card>
          <vs-table stripe ref="table" :sst="true" :max-items="table.perPage" :data="table.list" :noDataText="$t('approval.데이터가 없습니다')" @selected="handleItemClickDetail">
            <template slot="thead">
              <vs-th sort-key="id" style="min-width: 130px"><span class="w-full text-center">No.</span></vs-th>
              <vs-th sort-key="content$field_name" style="min-width: 130px"><span class="w-full text-center">현장명</span></vs-th>
              <vs-th style="min-width: 130px"><span class="w-full text-center">주소</span></vs-th>
              <vs-th style="min-width: 130px"><span class="w-full text-center">사업기간</span></vs-th>
              <vs-th style="min-width: 130px"><span class="w-full text-center">계약금액</span></vs-th>
            </template>

            <template slot-scope="{ data }">
              <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                <vs-td class="text-center">{{ tr.id }}</vs-td>
                <vs-td class="text-center">{{ tr.field_name }}</vs-td>
                <vs-td class="text-center">{{ tr.address }}</vs-td>
                <vs-td class="text-center">{{ tr.work_begin_at }} ~ {{ tr.work_end_at }}</vs-td>
                <vs-td class="text-center">{{ tr.deposit_amount }}</vs-td>
              </vs-tr>
            </template>
          </vs-table>

          <div class="vs-con-table">
            <div class="con-pagination-table vs-table--pagination">
              <k-pagination :total="lastPage ? lastPage : 1" v-model="currentPage" @change="handleChangePage"></k-pagination>
            </div>
          </div>
        </vs-card>
      </div>
    </vs-tab>
    <vs-tab label="부서별 현장 현황" @click="onClickTab(1)"></vs-tab>
  </vs-tabs>
</template>

<script>
import SearchNav from "@/components/nav/SearchNav";
import SearchNavItemProject from "@/components/nav/SearchNavItemProject";
import KPagination from "@/components/kPagination/kPagination";
export default {
  name: "FieldList",
  components: {
    KPagination,
    SearchNavItemProject,
    SearchNav,
  },
  data() {
    return {
      // 검색 네비게이션
      nav: {
        projectId: "",
        date: ["", ""],
        keyword: "",
        type: "",
        typeList: [],
        orderTarget: "created_at",
        orderDirection: "desc",
        searchTypes: [
          { text: "제목", value: "content$title" },
          { text: "작성자", value: "content$writer" },
        ],
        searchType: "content$title",
      },

      currentPage: 1,
      lastPage: 1,
      total: 0,
      table: {
        list: [],
        perPage: 7,
        keyword: "",
      },

      // 마지막 api 호출시 사용한 옵션
      apiLastLoadOptions: null,
    };
  },
  created() {
    this.initBreadcrumb();
  },
  computed: {
    projectId() {
      return this.$route.params.proj_id;
    },
  },
  mounted() {
    this.loadFieldList();
  },
  methods: {
    initBreadcrumb() {
      this.$store.commit("menu/UPDATE_PAGE_LIST", [{ title: "Home" }, { title: "현장/시설물 개요" }, { title: "현장(직접수행)  관리", active: true }]);
    },
    async loadFieldList() {
      const projectId = this.projectId;

      const options = { projectId, type: "현장(직접수행)", showAll: 0 }
      if (JSON.stringify(options) === JSON.stringify(this.apiLastLoadOptions)) {
        // 이전과 동일한 옵션으로 리스트를 불러옵니다.
        return;
      }
      this.apiLastLoadOptions = JSON.parse(JSON.stringify(options));
      await this.$store.dispatch("project/LOAD_FIELD_LIST", options);

      const fieldListInfo = this.$store.state.project.fieldListInfo;
      this.table.list = fieldListInfo.data;
    },
    onClickTab(tabIndex) {
      if (tabIndex === 0) {
        this.$router.push({ name: "field-workplace-list" });
      } else if (tabIndex === 1) {
        this.$router.push({ name: "field-workplace-info" });
      }
    },
    onClickSearch() {
      this.loadList();
    },
    onClickSort(sortKey, asc) {
      this.sortKey = sortKey;
      this.asc = asc;
    },
    onChangePage(page) {
      this.page = page;
    },
    onClickDownload() {
      this.popup.excel = true;
    },
    onClickNew() {
      this.$router.push({ name: "field-workplace-create" });
    },
    onClickClose() {
      const keys = Object.keys(this.popup);
      keys.map((key) => {
        this.popup[key] = false;
      });
    },
    onClickDetail(value, target) {},

    handleItemClickDetail(data) {
      this.$router.push({ name: "field-workplace-update", params: { proj_id: this.$route.params.proj_id, postId: data.id } });
    },

    handleChangePage(/*page*/) {
      //
    },
  },
};
</script>

<style scoped></style>
