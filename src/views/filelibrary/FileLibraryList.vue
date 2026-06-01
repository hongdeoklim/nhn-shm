<template>
  <div>
    <!-- 검색 폼 -->
    <SearchNav @handleSearch="searchFiles">
      <search-nav-start-end label="업로드일" v-model="search.date" class="mr-4" />
      <search-nav-item-keyword label="서식명" v-model="search.keyword" @keyupEvent="searchFiles" />
    </SearchNav>

    <!-- 버튼 -->
    <div class="flex justify-end gap-3 mt-8 mb-4">
      <input ref="fileInput" type="file" style="display: none" @change="handleChangeFile" />
      <vs-button v-if="(!!getPermission && getPermission.c === 1) || isAdmin" color="secondary" @click="onClickAddBtn">파일추가</vs-button>
      <vs-button v-if="(!!getPermission && getPermission.c === 1) || isAdmin" color="secondary" type="border" @click="onClickDeleteBtn">선택삭제</vs-button>
    </div>

    <!-- 리스트 -->
    <div>
      <vs-table :multiple="(!!getPermission && getPermission.c === 1) || isAdmin" v-model="selected" :data="fileDatas" noDataText="표시할 데이터가 없습니다." class="file-list">
        <template slot="thead">
          <vs-th> No. </vs-th>
          <vs-th> 서식명 </vs-th>
          <vs-th> 업로드 시각 </vs-th>
          <vs-th> 업로드 팀원 </vs-th>
          <vs-th> 파일크기 </vs-th>
          <vs-th> 다운로드 </vs-th>
        </template>

        <template slot-scope="{ data }">
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td :data="data[indextr].id">
              {{ data[indextr].id }}
            </vs-td>
            <vs-td :data="data[indextr].name">
              {{ data[indextr].name }}
            </vs-td>
            <vs-td :data="data[indextr].date">
              {{ data[indextr].date }}
            </vs-td>
            <vs-td :data="data[indextr].uploader">
              {{ data[indextr].uploader }}
            </vs-td>
            <vs-td :data="data[indextr].size">
              {{ data[indextr].size }}
            </vs-td>
            <vs-td>
              <button @click.stop="() => downloadFile(tr.id, tr.name)" style="background: none" class="border-0 cursor-pointer">
                <feather-icon icon="DownloadIcon" />
              </button>
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
      <div class="vs-con-table">
        <div class="con-pagination-table vs-table--pagination">
          <k-pagination :total="pagination.lastPage || 1" v-model="pagination.currentPage" @change="handleChangePage"></k-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueCookie from "vue-cookie";
import SearchNav from "@/components/nav/SearchNav.vue";
import SearchNavStartEnd from "@/components/nav/SearchNavStartEnd.vue";
import SearchNavItemKeyword from "@/components/nav/SearchNavItemKeyword";
import KPagination from "@/components/kPagination/kPagination";
import SearchNavItemSelect from "@/components/nav/SearchNavItemSelect.vue";

import config from "/public/config";

export default {
  name: "FileLibraryList",
  components: {
    SearchNavItemSelect,
    SearchNav,
    SearchNavStartEnd,
    SearchNavItemKeyword,
    KPagination,
  },
  props: {
    board: Object,
  },
  computed: {
    boardId() {
      return this.$route.meta.boardId;
    },
    memberInfoBoards() {
      return this.$store.state.member.memberInfo.boards;
    },
    projectId() {
      return this.$route.params.proj_id;
    },
    isAdmin() {
      return this.$store.state.member.memberInfo.is_superuser;
    },
    getPermission() {
      const boards = this.memberInfoBoards;
      if (!boards) {
        this.getMemberInfoBoards();
      } else {
        const board = boards.find((b) => parseInt(b.id) === this.boardId && `${this.projectId}` === `${b.pivot.project_id}`);
        if (board && typeof board.pivot !== "undefined") {
          const pivot = { ...board.pivot };
          return {
            c: pivot.c,
            r: pivot.r,
            u: pivot.u,
            d: pivot.d,
            v: pivot.v,
          };
        }
      }
      return null;
    },
  },
  data() {
    return {
      // === Search ===
      search: {
        searchType: "",
        date: "",
        keyword: "",
      },
      // === List ===
      selected: [],
      fileDatas: [],

      pagination: {
        lastPage: 1,
        currentPage: 1,
      },
      searchTypes: [{ text: "서식명", value: "서식명" }],
    };
  },
  created() {
    this.initBreadcrumb();
    this.loadBoardFiles();
  },
  methods: {
    async getMemberInfoBoards() {
      const userId = this.$store.state.auth.userInfo.id;
      await this.$store.dispatch("member/LOAD_MEMBER", { userId });
    },
    initBreadcrumb() {
      switch (this.boardId) {
        case 320:
          this.$store.commit("menu/UPDATE_PAGE_LIST", [{ title: "Home" }, { title: "자료실" }, { title: "안전 점검표 서식", active: true }]);
          break;
        case 321:
          this.$store.commit("menu/UPDATE_PAGE_LIST", [{ title: "Home" }, { title: "자료실" }, { title: "안전 계획표 서식", active: true }]);
          break;
        case 322:
          this.$store.commit("menu/UPDATE_PAGE_LIST", [{ title: "Home" }, { title: "자료실" }, { title: "중대시민재해 법령 사항", active: true }]);
          break;
        case 323:
          this.$store.commit("menu/UPDATE_PAGE_LIST", [{ title: "Home" }, { title: "자료실" }, { title: "은평구 현황", active: true }]);
          break;
        case 324:
          this.$store.commit("menu/UPDATE_PAGE_LIST", [{ title: "Home" }, { title: "자료실" }, { title: "재난발생시 조치 매뉴얼", active: true }]);
          break;
        case 325:
          this.$store.commit("menu/UPDATE_PAGE_LIST", [{ title: "Home" }, { title: "자료실" }, { title: "은평구 중대재해 예방 매뉴얼", active: true }]);
          break;
        case 340:
          this.$store.commit("menu/UPDATE_PAGE_LIST", [{ title: "Home" }, { title: "자료실" }, { title: "자료실", active: true }]);
          break;
        case 341:
          this.$store.commit("menu/UPDATE_PAGE_LIST", [{ title: "Home" }, { title: "자료실" }, { title: "자료실", active: true }]);
          break;
        case 342:
          this.$store.commit("menu/UPDATE_PAGE_LIST", [{ title: "Home" }, { title: "자료실" }, { title: "자료실", active: true }]);
          break;
        case 343:
          this.$store.commit("menu/UPDATE_PAGE_LIST", [{ title: "Home" }, { title: "자료실" }, { title: "자료실", active: true }]);
          break;
        case 347:
          this.$store.commit("menu/UPDATE_PAGE_LIST", [{ title: "Home" }, { title: "자료실" }, { title: "자료실", active: true }]);
          break;
      }
    },
    // =================== File Controller Buttons ===================
    // 파일 추가
    onClickAddBtn() {
      this.$refs.fileInput.click();
    },
    async handleChangeFile(event) {
      const files = event.target.files;
      if (files.length > 0) {
        await this.$store.dispatch("file/FILE_UPLOAD", files[0]);
        const fileInfo = this.$store.state.file.uploadedFile;

        await this.$store.dispatch("board/UPLOAD_FILE_LIST", {
          boardSlug: `board-${this.boardId}`,
          uploads: [fileInfo.id],
        });

        this.loadBoardFiles();
      }
      this.$refs.fileInput.value = null;
    },
    // 파일 제거
    async onClickDeleteBtn() {
      if (this.selected.length < 1) return;
      const _confirm = confirm("선택한 파일을 삭제하시겠습니까?");
      if (!_confirm) return;
      const fileIds = this.selected.map((item) => item.id);
      await this.$store.dispatch("board/REMOVE_FILE_LIST", {
        boardSlug: `board-${this.boardId}`,
        fileIds,
      });

      this.selected = [];
      this.loadBoardFiles();
    },

    // =================== List ===================
    searchFiles() {
      this.pagination.currentPage = 1;
      this.loadBoardFiles();
    },
    async loadBoardFiles() {
      let params = {
        boardSlug: `board-${this.boardId}`,
        page: this.pagination.currentPage,
        perPage: 10,
      };

      if (!!this.search.keyword) params = { ...params, keyword: this.search.keyword };
      if (!!this.search.date.sDate || !!this.search.date.eDate) params = { ...params, dateBegin: this.search.date.sDate, dateEnd: this.search.date.eDate };

      await this.$store.dispatch("board/LOAD_FILE_LIST", params);

      const filesData = this.$store.state.board.fileList;
      this.pagination.lastPage = filesData.last_page;
      this.fileDatas = filesData.data.map((att) => {
        let sizeCheck = att.file_size;
        if (sizeCheck < 1000) sizeCheck = `${sizeCheck}B`;
        else if (sizeCheck < 1000000) sizeCheck = `${(sizeCheck * 0.001).toFixed(1)}KB`;
        else sizeCheck = `${(sizeCheck * 0.000001).toFixed(1)}MB`;

        return {
          id: att.id,
          name: att.file_name,
          date: att.updated_at,
          size: sizeCheck,
          path: att.path,
          uploader: att.user.name,
        };
      });
    },

    handleChangePage(page) {
      this.pagination.currentPage = page;
      this.loadBoardFiles();
    },

    async downloadFile(fileId, filename) {
      const token = VueCookie.get("token");
      const boardSlug = `board-${this.boardId}`;
      fetch(`${config.BASE_API_URL}/api/v1/board/${boardSlug}/download?fileId=${fileId}`, {
        headers: new Headers({
          Authorization: `Bearer ${token}`,
        }),
      }).then((response) => {
        response.blob().then((myBlob) => {
          const url = window.URL.createObjectURL(myBlob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", filename);
          document.body.appendChild(link);
          link.click();
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.file-list::v-deep {
  background: white;

  .vs-con-tbody {
    border: none;
  }

  tr {
    background: white;
    border-top: solid 1px #cdcdcd;
    border-bottom: solid 1px #cdcdcd;
    transform: translateY(0px) !important;
  }

  th {
    background: #f9f9f9;
    padding: 10px 0 !important;
    & > div {
      display: block;
      color: #3c3c3c;
      font-weight: 700;
      font-size: 14px;
      line-height: 18px;
      text-align: center;
    }
  }

  td {
    padding: 10px 0 !important;
    &.td > span {
      display: block;
      color: #3c3c3c;
      text-align: center;
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
    }
  }
}
</style>
