<template>
  <vx-card class="table-list-card">
    <vs-row>
      <vs-col>
        <div class="mb-4">
          <span class="font-bold" style="font-size: 14px"><i class="dot"></i> 안전보건 주요 일정 </span>
        </div>
        <vs-table stripe ref="table" class="table" :sst="true" :data="table.list" @selected="handleItemClickDetail" noDataText="데이터가 없습니다">
          <template slot="thead">
            <vs-th><span class="w-full text-center">No.</span></vs-th>
            <vs-th><span class="w-full text-center">작성일</span></vs-th>
            <vs-th><span class="w-full text-center">내 용</span></vs-th>
          </template>

          <template slot-scope="{ data }">
            <colgroup>
              <col width="60" />
              <col style="max-width: 200px" />
              <col />
            </colgroup>
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td class="text-center">{{ getNo(indextr) }}</vs-td>
              <vs-td class="text-center">{{ getDate(tr.created_at) }}</vs-td>
              <vs-td class="text-center">
                <vs-icon v-if="tr.post_parent_id" icon-pack="feather" icon="icon-corner-down-right"></vs-icon>
                {{ tr.post_title }}
              </vs-td>
            </vs-tr>
          </template>
        </vs-table>

        <div class="vs-con-table">
          <div class="con-pagination-table vs-table--pagination">
            <k-pagination :total="lastPage ? lastPage : 1" v-model="currentPage" @change="handleTableChangePage"></k-pagination>
          </div>
        </div>
      </vs-col>
    </vs-row>
  </vx-card>
</template>

<script>
import KPagination from "@/components/kPagination/kPagination";
export default {
  name: "CommunityHealthinfoCard",
  components: { KPagination },
  data() {
    return {
      boardSlug: "safety_info",
      boardId: 18,
      projectTitle: "",
      table: {
        list: [],
      },

      //pagination
      perPage: 5,
      date: "",
      currentPage: 1,
      lastPage: 1,
      total: 0,
    };
  },

  computed: {
    projectId() {
      return this.$route.params.proj_id;
    },
  },

  mounted() {
    this.loadPostList();
  },

  methods: {
    getNo(index) {
      return this.total - ((this.currentPage - 1) * this.perPage + index);
    },

    getDate(date) {
      return new Date(date).format("yyyy-MM-dd");
    },

    // 게시물 불러오기
    async loadPostList() {
      const projectId = this.projectId;
      const boardId = this.boardId;
      const page = this.currentPage ? this.currentPage : 1;
      const perPage = this.perPage;
      const keyword = [];

      if (this.searchKeyword) keyword.push(`${this.searchType}*%${this.searchKeyword}%`);

      await this.$store.dispatch("board/LOAD_POST_LIST", {
        projectId,
        boardId,
        page,
        perPage,
        keyword,
        orderTarget: "created_at",
        orderDirection: "desc",
      });

      // 게시물 불러오기
      const postListInfo = this.$store.state.board.postListInfo;

      // 페이지네이션 정보
      this.currentPage = postListInfo.current_page;
      this.lastPage = postListInfo.last_page;
      this.perPage = postListInfo.per_page;
      this.total = postListInfo.total;

      // 보여지는 게시물 리스트
      const list = postListInfo.data;
      const newList = [];
      for (const item of list) {
        newList.push(item);
        if (item.children.length > 0) {
          for (const subItem of item.children) {
            newList.push(subItem);
          }
        }
      }

      this.table.list = newList;
    },

    getContent(data) {
      if (data.post_content) {
        const content = JSON.parse(data.post_content);
        return content;
      }
    },

    // 글 상세페이지로 이동
    moveProjectDetail(_postId) {
      const project_id = this.$route.params.proj_id;
      if (project_id) {
        this.$router.push({ path: `/project/${project_id}/community/healthinfo/${_postId}` });
      } else {
        this.$router.push({ path: `/community/healthinfo/${_postId}` });
      }
    },

    handleChangePerPage(_data) {
      if (this.perPage !== _data) {
        this.currentPage = 1;
        this.perPage = _data;
        this.loadPostList();
      }
    },
    handleSearch() {
      this.currentPage = 1;
      this.loadPostList();
    },
    handleChangePage(_data) {
      if (this.currentPage !== _data) {
        this.currentPage = _data;
        this.loadPostList();
      }
    },
    handleItemClickDetail(_data) {
      this.moveProjectDetail(_data.id);
    },
    handleClickRegister() {
      this.$router.push({ path: "/community/healthinfo/create" });
    },

    handleTableChangePage(page) {
      this.currentPage = page;
      this.loadPostList();
    },
  },
};
</script>

<style lang="scss" scoped>
.table::v-deep {
  .vs-table--tbody-table {
    min-width: 100%;
  }
  table {
    table-layout: fixed;
  }
}
</style>
