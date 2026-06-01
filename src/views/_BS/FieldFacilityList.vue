<template>
  <vs-tabs :value="0">
    <vs-tab label="시설물 등록" @click="onClickTab(0)">
      <div>
        <search-nav>
          <search-nav-item-project :label="$t('search.현장명')" />
        </search-nav>

        <div class="flex justify-end gap-4 w-full text-right mb-4 px-4 xl:px-0" v-if="parseInt(this.$store.state.auth.userInfo.is_superuser) === 1">
          <vs-button class="flex-1 xl:flex-none" color="secondary" @click="onClickNew"> 신규작성 </vs-button>
        </div>

        <div class="flex mb-4" style="justify-content: flex-end">
          <vs-button class="" color="secondary" @click="onClickNew"> 신규작성 </vs-button>
        </div>
        <vs-card>
          <vs-table stripe ref="table" :sst="true" :max-items="table.perPage" :data="table.list" :noDataText="$t('approval.결재문서가 없습니다')" @selected="handleItemClickDetail">
            <template slot="thead">
              <vs-th style="min-width: 130px"><span class="w-full text-center">No.</span></vs-th>
              <vs-th style="min-width: 130px"><span class="w-full text-center">분야명</span></vs-th>
              <vs-th style="min-width: 130px"><span class="w-full text-center">현장(시설물)명</span></vs-th>
              <vs-th style="min-width: 130px"><span class="w-full text-center">구분</span></vs-th>
              <vs-th style="min-width: 130px"><span class="w-full text-center">시설물 위치(상세주소)</span></vs-th>
              <vs-th style="min-width: 130px"><span class="w-full text-center">규모 1</span></vs-th>
              <vs-th style="min-width: 130px"><span class="w-full text-center">준공일</span></vs-th>
              <vs-th style="min-width: 130px"><span class="w-full text-center">사업금액</span></vs-th>
            </template>

            <template slot-scope="{ data }">
              <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                <vs-td class="text-center">{{ indextr + 1 + table.perPage * (currentPage - 1) }}</vs-td>
                <vs-td class="text-center">{{ tr.project.field_name }}</vs-td>
                <vs-td class="text-center">{{ tr.field_name }}</vs-td>
                <vs-td class="text-center">{{ tr.facility_category ? tr.facility_category.cat1 : "" }}</vs-td>
                <vs-td class="text-center">{{ tr.address }}</vs-td>
                <vs-td class="text-center">{{ tr.scale1 }}</vs-td>
                <vs-td class="text-center">{{ tr.be_completed_at }}</vs-td>
                <vs-td class="text-center">{{ tr.deposit_amount ? new Intl.NumberFormat().format(parseInt(tr.deposit_amount.replace(/,/g, ""))) : "-" }}</vs-td>
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
    <vs-tab label="담당 시설물 정보" @click="onClickTab(1)"></vs-tab>
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
      this.$store.commit("menu/UPDATE_PAGE_LIST", [{ title: "Home" }, { title: "현장/시설물 개요" }, { title: "시설물 관리", active: true }]);
    },
    async loadFieldList() {
      const projectId = this.projectId;
      const page = this.currentPage;
      const perPage = this.table.perPage;

      const options = { projectId, type: "시설물", page, perPage, showAll: 0 }
      if (JSON.stringify(options) === JSON.stringify(this.apiLastLoadOptions)) {
        // 이전과 동일한 옵션으로 리스트를 불러옵니다.
        return;
      }
      this.apiLastLoadOptions = JSON.parse(JSON.stringify(options));
      await this.$store.dispatch("project/LOAD_FIELD_LIST", options);

      const fieldListInfo = this.$store.state.project.fieldListInfo;
      this.table.list = fieldListInfo.data;
      this.table.perPage = fieldListInfo.per_page;
      this.total = fieldListInfo.total;
      this.currentPage = fieldListInfo.current_page;
      this.lastPage = fieldListInfo.last_page;
    },
    onClickTab(tabIndex) {
      if (tabIndex === 0) {
        this.$router.push({ name: "field-facility-list" });
      } else if (tabIndex === 1) {
        this.$router.push({ name: "field-facility-info" });
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
      this.$router.push({ name: "field-facility-create" });
    },
    onClickClose() {
      const keys = Object.keys(this.popup);
      keys.map((key) => {
        this.popup[key] = false;
      });
    },
    onClickDetail(value, target) {},

    handleItemClickDetail(data) {
      this.$router.push({ name: "field-facility-update", params: { proj_id: this.$route.params.proj_id, postId: data.id } });
    },

    handleChangePage(page) {
      this.currentPage = page;
      this.loadFieldList();
      //
    },
  },
};
</script>

<style scoped></style>
