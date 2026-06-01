<template>
  <vs-popup class="popupSearchField" title="하도급업체 예산 사용분 불러오기" :active.sync="showPopup">
    <!-- Search -->
    <div class="flex justify-between items-center shadow rounded-lg p-5 mb-6">
      <div class="flex gap-3">
        <search-nav-start-end label="작성일" v-model="search.dateLeng" />
        <search-nav-item-select :label="$t('search.검색조건')" v-model="search.searchType" :list="searchTypes" class="ml-3" />
        <search-nav-item-keyword :label="$t('search.키워드')" v-model="search.keyword" />
      </div>
      <vs-button color="secondary" @click="handleClickSearch">검색</vs-button>
    </div>
    <!-- List -->
    <vs-table ref="table" stripe :data="postList" noDataText="데이터가 없습니다" class="field-table">
      <template slot="thead">
        <vs-th></vs-th>
        <vs-th>No.</vs-th>
        <vs-th>현장명</vs-th>
        <vs-th>업체명</vs-th>
        <vs-th>하도급업체 사용분(해당월)</vs-th>
        <vs-th>작성자</vs-th>
        <vs-th>작성월</vs-th>
        <vs-th>첨부파일</vs-th>
      </template>

      <template>
        <vs-tr v-for="(post, index) in postList" :key="index" :data="post" @click.native="handleCheckData(post)">
          <vs-td><vs-checkbox :value="selectIds.includes(post.id)" /></vs-td>
          <vs-td>{{ post.id }}</vs-td>
          <vs-td>{{ getContent(post).stdInfo.field_name }}</vs-td>
          <vs-td>{{ getContent(post).stdInfo.department }}</vs-td>
          <vs-td>{{ getContent(post).budgetTotal.now | comma }}원</vs-td>
          <vs-td>{{ post.author ? post.author.name : '' }}</vs-td>
          <vs-td>{{ getContent(post).headerDate | moment("YYYY년 MM월") }}</vs-td>
          <vs-td>
            <div v-if="0 < getContent(post).fileList.length" class="flex justify-center items-center" @click.stop="openFiles(getContent(post).fileList)">
              <img src="@/assets/icons/paper.svg" alt="첨부파일" />
            </div>
          </vs-td>
        </vs-tr>
      </template>
    </vs-table>

    <div class="vs-con-table">
      <div class="con-pagination-table vs-table--pagination">
        <k-pagination :total="page.lastPage ? page.lastPage : 0" v-model="page.current" @change="handleChangePage"></k-pagination>
      </div>
    </div>

    <vs-col class="mt-4 flex" vs-align="center" vs-justify="flex-end">
      <vs-button class="mr-4" color="#EDEDED" text-color="black" type="filled" @click="handleClickClose">닫기 </vs-button>
      <vs-button color="secondary" @click="handleClickSelect">등록</vs-button>
    </vs-col>
  </vs-popup>
</template>

<script>
import HttpRequest from "@/util/HttpRequest";
import SearchNavStartEnd from "@/components/nav/SearchNavStartEnd.vue";
import SearchNavItemKeyword from "@/components/nav/SearchNavItemKeyword";
import SearchNavItemSelect from "@/components/nav/SearchNavItemSelect";
import KPagination from "@/components/kPagination/kPagination";

export default {
  name: "Popup329List",
  components: {
    SearchNavStartEnd,
    SearchNavItemSelect,
    SearchNavItemKeyword,
    KPagination,
  },
  filters: {
    comma(str) {
      return `${str}`.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
  props: {
    value: Boolean,
    targetDate: String,
    setSelectIds: Array,
  },
  computed: {
    projectId() {
      return parseInt(this.$route.params.proj_id);
    },
  },
  data() {
    return {
      showPopup: this.value,

      //   ============= 검색 ================
      search: {
        dateLeng: "", // 작성일
        searchType: "", // 검색조건
        keyword: "", // 키워드
      },
      searchTypes: [
        { text: "현장명", value: "stdInfo.field_name" },
        { text: "업체명", value: "stdInfo.department" },
        { text: "하도급업체 사용분(해당월)", value: "budgetTotal.now" },
        { text: "작성자", value: "stdInfo.writer_name" },
      ],

      //   ============= 리스트 ================
      postList: [],
      selectIds: [],
      selectDatas: [],

      page: {
        current: 1,
        lastPage: 1,
        perPage: 5,
      },
    };
  },
  watch: {
    value(data) {
      this.showPopup = data;
      if (data) {
        this.postList = [];
        this.page.current = 1;
        this.page.lastPage = 1;
        this.selectIds = this.setSelectIds;
        this.loadListApproval();
      }
    },
    showPopup(data) {
      this.$emit("input", data);
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
    handleClickClose() {
      this.$emit("input", false);
    },

    // 게시물 불러오기
    async loadListApproval() {

      // 팝업이 열렸을 경우에만 API 호출
      if (!this.showPopup) {
        return
      }

      const projectId = this.projectId;
      const boardSlug = "board-329";
      const page = this.page.current || 1;
      const perPage = this.page.perPage || 10;

      const search = {
        keyword: [`content$body.headerDate*${this.targetDate}`],
      };
      if (this.search.dateLeng.sDate) {
        search.dateTarget = "created_at";
        search.dateBegin = this.search.dateLeng.sDate;
      }
      if (this.search.dateLeng.eDate) {
        search.dateTarget = "created_at";
        search.dateEnd = this.search.dateLeng.eDate;
      }
      if (!!this.search.searchType && !!this.search.keyword) search.keyword.push(`content$body.${this.search.searchType}*%${this.search.keyword}%`);

      const option = {
        params: {
          board: boardSlug,
          page,
          perPage,
          projectId,
          ...search,
        },
      };

      new Promise((resolve, reject) => {
        HttpRequest.get(`/api/v1/board/post/329`, option)
          .then((response) => {
            const { data, last_page } = response;
            this.postList = data;
            this.page.lastPage = last_page;
          })
          .catch((err) => reject(err));
      });
    },
    handleChangePage(page) {
      this.page.current = page;
      this.loadListApproval();
    },
    handleClickSearch() {
      this.handleChangePage(1);
    },

    openFiles(files) {
      files.map((file) => window.open(file.path, file.id));
    },

    handleCheckData(checkData) {
      if (this.selectIds.includes(checkData.id)) {
        this.selectIds = this.selectIds.filter((data) => data !== checkData.id);
        this.selectDatas = this.selectDatas.filter((data) => data.id !== checkData.id);
      } else {
        this.selectIds.push(checkData.id);
        this.selectDatas.push(checkData);
      }
    },

    handleClickSelect() {
      this.$emit("handleClickSelect", this.selectDatas);
      this.$emit("input", false);
    },

    getContent(data) {
      if (data.post_content) {
        const content = JSON.parse(data.post_content);
        return content.body;
      }
    },
    getHeader(data) {
      if (data.post_content) {
        const content = JSON.parse(data.post_content);
        return content.header;
      }
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
