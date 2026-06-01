<template>
  <div>
    <div>
      <!-- 문의 -->
      <vx-card class="mb-8">
        <vs-row>
          <vs-col class="">
            <h5 class="mb-4"><i class="dot"></i>{{ $t("content.community.qna.detail.고객문의") }}</h5>
          </vs-col>
        </vs-row>

        <vs-row class="mb-4">
          <vs-col class="flex flex-wrap">
            <vs-row class="w-full mb-4 flex" vs-align="center">
              <vs-col class="w-1/12">{{ $t("content.community.qna.detail.제목") }}</vs-col>
              <vs-col class="w-11/12"
                ><span class="w-full"> {{ post.post_title }} </span></vs-col
              >
            </vs-row>
            <vs-row class="w-full mb-4 flex" vs-align="center">
              <vs-col class="w-1/12">문의분류</vs-col>
              <vs-col class="w-11/12"
                ><span class="w-full">
                  {{ getQnaType(form.qna_type) }}
                </span></vs-col
              >
            </vs-row>

            <vs-row class="w-full mb-4 flex" vs-align="center">
              <vs-col class="w-1/12">{{ $t("content.community.qna.detail.작성자") }}</vs-col>
              <vs-col class="w-1/12"
                ><span class="w-full">{{ post.author ? post.author.name : "" }}</span></vs-col
              >
            </vs-row>

            <vs-row class="w-full mb-4 flex" vs-align="center">
              <vs-col class="w-1/12">연락처</vs-col>
              <vs-col class="w-1/12"
                ><span class="w-full">{{ form.phone }}</span></vs-col
              >
            </vs-row>

            <vs-row class="w-full mb-4 flex" vs-align="center">
              <vs-col class="w-1/12">이메일</vs-col>
              <vs-col class="w-1/12"
                ><span class="w-full">{{ form.email }}</span></vs-col
              >
            </vs-row>

            <vs-row class="w-full mb-4 flex" vs-align="center">
              <vs-col class="w-1/12">{{ $t("content.community.qna.detail.작성일") }}</vs-col>
              <vs-col class="w-11/12"
                ><span class="w-full">{{ post.created_at }}</span></vs-col
              >
            </vs-row>

            <vs-row class="w-full mb-4 flex" vs-align="center">
              <vs-col class="w-1/12">{{ $t("content.community.qna.detail.내용") }}</vs-col>
              <vs-col class="w-11/12"><span class="w-full" v-html="form.content"></span></vs-col>
            </vs-row>

            <file-upload-module v-if="fileList.length > 0" class="w-full" v-model="fileList" type="check_list_col" :readonly="true"></file-upload-module>

            <vs-divider />

            <vs-row class="w-full flex" vs-align="center">
              <vs-col class="w-1/2 flex" vs-justify="flex-start">
                <a href="javascript:;" class="mr-2" v-if="prevPost ? prevPost.id > 0 : false" @click="handleClickPrevPost">&lt; {{ $t("content.community.qna.detail.이전글") }}</a>
                <span class="mr-2" v-if="(prevPost ? prevPost.id > 0 : false) && (nextPost ? nextPost.id > 0 : false)">|</span>
                <a href="javascript:;" v-if="nextPost ? nextPost.id > 0 : false" @click="handleClickNextPost">{{ $t("content.community.qna.detail.다음글") }} &gt;</a>
              </vs-col>
              <vs-col class="w-1/2 flex" vs-justify="flex-end">
                <vs-button class="mr-2" color="secondary" type="border" @click="handleClickList">{{ $t("button.목록") }}</vs-button>
                <vs-button v-if="post.children && post.children.length == 0" class="mr-2" color="secondary" type="border" @click="handleClickReply">{{ $t("button.답변") }}</vs-button>
                <vs-button v-if="isAuthor || isAdmin" class="mr-2" color="secondary" @click="handleClickUpdate">{{ $t("button.수정") }}</vs-button>
                <vs-button v-if="isAuthor || isAdmin" color="danger" type="border" @click="handleClickDelete">삭제</vs-button>
              </vs-col>
            </vs-row>
          </vs-col>
        </vs-row>
      </vx-card>

      <!-- 답변 -->
      <vx-card v-if="post.children ? post.children.length > 0 : false" v-for="(sub, index) in post.children" :key="index">
        <vs-row>
          <vs-col class="">
            <h5 class="mb-4"><i class="dot"></i>{{ $t("content.community.qna.detail.답변") }}</h5>
          </vs-col>
        </vs-row>

        <vs-row class="mb-4">
          <vs-col class="flex flex-wrap">
            <vs-row class="w-1/2 mb-4 flex" vs-align="center">
              <vs-col class="w-2/12">{{ $t("content.community.qna.detail.제목") }}</vs-col>
              <vs-col class="w-10/12"
                ><span class="w-full">{{ sub.post_title }}</span></vs-col
              >
            </vs-row>
            <vs-row class="w-1/2 mb-4 flex" vs-align="center"> </vs-row>

            <vs-row class="w-1/2 mb-4 flex" vs-align="center">
              <vs-col class="w-2/12">{{ $t("content.community.qna.detail.작성자") }}</vs-col>
              <vs-col class="w-10/12"
                ><span class="w-full">{{ getContents(sub) ? getContents(sub).writer : "" }}</span></vs-col
              >
            </vs-row>
            <vs-row class="w-1/2 mb-4 flex" vs-align="center"> </vs-row>

            <vs-row class="w-full mb-4 flex" vs-align="center">
              <vs-col class="w-1/12">{{ $t("content.community.qna.detail.작성일") }}</vs-col>
              <vs-col class="w-11/12"
                ><span class="w-full">{{ sub.created_at }}</span></vs-col
              >
            </vs-row>

            <vs-row class="w-full mb-4 flex" vs-align="center">
              <vs-col class="w-1/12">{{ $t("content.community.qna.detail.내용") }}</vs-col>
              <vs-col class="w-11/12"><span class="w-full" v-html="getContents(sub) ? getContents(sub).content : ''"></span></vs-col>
            </vs-row>

            <file-upload-module v-if="reply_fileList.length > 0" class="w-full" v-model="reply_fileList" type="check_list_col" :readonly="true"></file-upload-module>
          </vs-col>
        </vs-row>
      </vx-card>
    </div>
  </div>
</template>

<script>
import VueCookie from "vue-cookie";
import FileUploadModule from "@/views/modules/FileUploadModule";

export default {
  name: "CommunityQnaDetail",
  components: { FileUploadModule },
  data() {
    return {
      postId: 0,
      boardSlug: "qna",
      boardId: 17,
      post: {},
      form: {
        title: "", //현장명
        writer: "", //작성자
        content: "",
      },
      fileList: [],
      reply_fileList: [],
      comment: "",
      comments: [],
      subComment: [],
      subCommentType: [],

      prevPost: {},
      nextPost: {},
    };
  },
  computed: {
    projectId() {
      return this.$route.params.proj_id;
    },
    isAuthor() {
      if (this.post.author) {
        return parseInt(`${this.post.author.id}`) === parseInt(`${this.$store.state.auth.userInfo.id}`);
      }
      return false;
    },
    isAdmin() {
      let isAdmin = false;
      const myInfo = this.$store.state.auth.userInfo;
      isAdmin = isAdmin || parseInt(myInfo.is_superuser) > 0;
      return isAdmin;
    },
    activeUserId() {
      return this.$store.state.auth.userInfo.id;
    },
  },
  created() {
    this.postId = this.$route.params.postId;

    this.loadPost();
    this.loadCommentList();
  },
  methods: {
    async loadPost() {
      // cookie 정보를 가져온다.
      this.loadCookieBoard();

      const projectId = this.projectId;
      const boardId = this.boardId;
      const postId = this.$route.params.postId;
      await this.$store.dispatch("board/LOAD_POST", {
        projectId,
        boardId,
        postId,
      });

      // 내용
      this.post = this.$store.state.board.postInfo;
      this.form = JSON.parse(this.post.post_content);
      this.fileList = [];
      for (const file of this.post.post_attachment) {
        this.fileList.push({
          id: file.id,
          fileName: file.file_name,
          fileSize: file.file_size,
          path: file.path,
        });
      }

      // 이전글 / 다음글
      await this.settingPrevNextPostId();
    },

    //이전글/다음글 설정
    async settingPrevNextPostId() {
      const initPostData = {};
      const projectId = this.projectId;
      const boardId = this.boardId;
      const page = parseInt(this.tableCurrentPage ? this.tableCurrentPage : 1);
      const perPage = parseInt(this.tablePerPage ? this.tablePerPage : 10);
      const keyword = this.tableSearchKeyword;

      this.prevPost = initPostData;
      this.nextPost = initPostData;
      this.tablePrevPage = page;
      this.tableNextPage = page;

      // 현재 페이지의 공지사항을 불러온다.
      await this.$store.dispatch("board/LOAD_POST_LIST", {
        projectId,
        boardId,
        page,
        perPage,
        keyword,
        orderTarget: "id",
        orderDirection: "desc",
      });
      // await this.$store.dispatch("board/LOAD_POST_LIST", {
      //   boardId,
      //   page,
      //   perPage,
      //   keyword,
      // });
      const postListInfo = this.$store.state.board.postListInfo;
      const postList = postListInfo.data;
      const postIndex = this.getListIndexPost(postList);
      const lastPage = parseInt(postListInfo.last_page);

      if (postIndex === -1) {
        // 현재 페이지가 없을 경우
        return;
      }

      if (postIndex === 0) {
        // 현재페이지의 첫번째 게시글인 경우

        // 현재페이지가 첫번째 페이지인 경우 이전글 없음
        // 현재페이지가 첫번째 페이지가 아닌 경우 이전페이지의 마지막 게시글이 이전글
        if (page === 1) {
          this.prevPost = initPostData;
        } else {
          await this.$store.dispatch("board/LOAD_POST_LIST", {
            boardId,
            page: page - 1,
            perPage,
            keyword,
          });
          const prevPostListInfo = this.$store.state.board.postListInfo;
          this.prevPost = prevPostListInfo.data[prevPostListInfo.data.length - 1];
          this.tablePrevPage = page - 1;
        }

        this.nextPost = postList[postIndex + 1] ? postList[postIndex + 1] : initPostData;
      } else if (postIndex === postList.length - 1) {
        // 현재페이지의 마지막 게시글인 경우
        this.prevPost = postList[postIndex - 1];

        // 현재페이지가 마지막 페이지인 경우 이전글 없음
        // 현재페이지가 마지막 페이지가 아닌 경우 다음페이지의 첫번째 게시글이 다음글
        if (page === lastPage) {
          this.nextPost = initPostData;
        } else {
          await this.$store.dispatch("board/LOAD_POST_LIST", {
            boardId,
            page: page + 1,
            perPage,
            keyword,
          });
          const nextPostListInfo = this.$store.state.board.postListInfo;
          this.nextPost = nextPostListInfo.data[0];
          this.tableNextPage = page + 1;
        }
      } else {
        // 현재페이지의 중간 게시글 인경우
        this.prevPost = postList[postIndex - 1];
        this.nextPost = postList[postIndex + 1];
      }
    },

    // 현재 페이지 인덱스 찾기
    getListIndexPost(postList) {
      let post = null;
      for (let i = 0; i < postList.length; i++) {
        post = postList[i];
        if (parseInt(post.id) === parseInt(this.postId)) {
          return i;
        }
      }
      return -1;
    },

    getQnaType(qna_type) {
      if (qna_type === "error") return "오류 및 버그 신고";
      if (qna_type === "account") return "계정 문의";
      if (qna_type === "add_partner") return "협력업체 등록 문의";
      if (qna_type === "support") return "기술지원";
      if (qna_type === "suggestion") return "건의사항";
      if (qna_type === "etc") return "기타";
      return "";
    },

    async loadCommentList() {
      const boardSlug = this.boardSlug;
      const postId = this.$route.params.postId;

      await this.$store.dispatch("board/LOAD_COMMENT_LIST", {
        boardSlug,
        postId,
      });
      this.comments = this.$store.state.board.commentList;

      this.comment = "";
      this.subComment = [];
    },

    // 쿠키에 저장된 데이터를 불러온다.
    loadCookieBoard() {
      this.tableCurrentPage = VueCookie.get("table_current_page");
      this.tablePerPage = VueCookie.get("table_per_page");
      this.tableSearchKeyword = VueCookie.get("table_search_keyword");
    },

    getContents(data) {
      if (data && data.post_content) {
        const preview = JSON.parse(data.post_content);
        return preview;
      }
    },

    handleClickUpdate() {
      const project_id = parseInt(this.$route.params.proj_id);
      const postId = this.$route.params.postId;
      if (project_id) {
        this.$router.push({
          path: `/project/${project_id}/community/qna/${postId}/update`,
        });
      } else {
        this.$router.push({ path: `/community/qna/${postId}/update` });
      }
    },
    handleClickDelete() {
      if (confirm("문서를 삭제하시겠습니까?")) {
        const boardId = this.boardId;
        const postId = this.$route.params.postId;
        this.$store.dispatch("board/DELETE_POST", { boardId, postId }).then(() => {
          this.$router.back();
        });
      }
    },

    handleClickList() {
      const project_id = parseInt(this.$route.params.proj_id);
      if (project_id) {
        this.$router.push({ path: `/project/${project_id}/community/qna/` });
      } else {
        this.$router.push({ path: "/community/qna/" });
      }
    },

    handleClickRegister() {
      const project_id = parseInt(this.$route.params.proj_id);
      if (project_id) {
        this.$router.push({
          path: `/project/${project_id}/community/qna/create`,
        });
      } else {
        this.$router.push({ path: "/community/qna/create" });
      }
    },

    handleClickReply() {
      const project_id = parseInt(this.$route.params.proj_id);
      const postId = this.$route.params.postId;
      if (project_id) {
        this.$router.push({
          path: `/project/${project_id}/community/qna/${postId}/reply`,
        });
      } else {
        this.$router.push({ path: `/community/qna/${postId}/reply` });
      }
    },

    handleClickPrevPost() {
      const project_id = parseInt(this.$route.params.proj_id);
      if (project_id) {
        this.$router.push({
          path: `/project/${project_id}/community/qna/${this.prevPost.id}`,
        });
      } else {
        this.$router.push({ path: `/community/qna/${this.prevPost.id}` });
      }
    },

    handleClickNextPost() {
      const project_id = parseInt(this.$route.params.proj_id);
      if (project_id) {
        this.$router.push({
          path: `/project/${project_id}/community/qna/${this.nextPost.id}`,
        });
      } else {
        this.$router.push({ path: `/community/qna/${this.nextPost.id}` });
      }
    },

    handleClickAddComment(comment, parentId) {
      this.addComment(comment, parentId);
    },

    handleClickAddSubComment(index, commendId) {
      const comment = this.subComment[index];
      const parentId = commendId;
      const addCommentType = this.subCommentType[index];

      if (addCommentType === "c") {
        this.addComment(comment, parentId);
      }
      if (addCommentType === "u") {
        this.updateComment(comment, commendId);
      }
      this.closeWrite(index);
    },

    handleClickUpdateComment(comment, commentId) {
      this.updateComment(comment, commentId);
    },

    handleClickDeleteComment(commentId) {
      this.deleteComment(commentId);
    },

    // 댓글 삭제
    async deleteComment(_commentId) {
      const boardSlug = this.boardSlug;
      const postId = this.$route.params.postId;
      const commentId = _commentId;
      if (postId <= 0) {
        return;
      }
      await this.$store.dispatch("board/DELETE_COMMENT", {
        boardSlug,
        postId,
        commentId,
      });

      // 댓글 리스트 새로고침
      await this.loadCommentList();
    },

    // 댓글 추가
    async addComment(_comment, _parentId) {
      const boardSlug = this.boardSlug;
      const postId = this.$route.params.postId;
      const comment = _comment;
      const parentId = _parentId;

      await this.$store.dispatch("board/ADD_COMMENT", {
        boardSlug,
        postId,
        comment,
        parentId,
      });

      // 댓글 리스트 새로고침
      await this.loadCommentList();
    },

    // 댓글 수정
    async updateComment(_comment, _commentId) {
      const boardSlug = this.boardSlug;
      const postId = this.$route.params.postId;
      const comment = _comment;
      const commentId = _commentId;

      await this.$store.dispatch("board/UPDATE_COMMENT", {
        boardSlug,
        postId,
        comment,
        commentId,
      });

      // 댓글 리스트 새로고침
      await this.loadCommentList();
    },

    openWrite(event, index) {
      this.subCommentType[index] = "c";
      this.subComment[index] = "";

      const commentType = JSON.parse(JSON.stringify(this.subCommentType));
      const comment = JSON.parse(JSON.stringify(this.subComment));
      this.subCommentType = commentType;
      this.subComment = comment;
      document.getElementsByClassName(`comment-item-${index}`)[0].children[1].classList.add("open");
    },

    openUpdate(event, index, comments) {
      this.subCommentType[index] = "u";
      this.subComment[index] = comments;

      const commentType = JSON.parse(JSON.stringify(this.subCommentType));
      const comment = JSON.parse(JSON.stringify(this.subComment));
      this.subCommentType = commentType;
      this.subComment = comment;
      document.getElementsByClassName(`comment-item-${index}`)[0].children[1].classList.add("open");
    },

    closeWrite(index) {
      document.getElementsByClassName(`comment-item-${index}`)[0].children[1].classList.remove("open");
    },
  },
};
</script>

<style scoped>
.content-head {
  width: 100px;
  font-weight: bold;
}

.content-read {
  min-height: 20em;
  line-height: 1.6;
}

.read-layout,
.read-layout-2 {
  margin-bottom: 1.5rem;
}

.read-layout {
  display: grid !important;
  grid-template-columns: 60px 1fr;
}
.read-layout-2 {
  display: grid !important;
  grid-template-columns: 60px auto 60px 1fr;
}
.read-layout-title {
  font-weight: bold;
  display: flex;
  align-items: center;
}
.read-layout-title.top {
  align-items: start;
}

.read-layout-footer {
  width: auto !important;
  height: 50px;
  display: grid !important;
  grid-template-columns: 120px 1fr;
  align-items: center;

  margin-left: -1.5rem;
  margin-right: -1.5rem;
  border-top: 1px solid #f2f2f2 !important;
}
.read-layout-footer .read-layout-title {
  height: 100%;
  justify-content: center;

  background-color: #ededed;
}
.read-layout-footer span {
  height: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
}
.read-layout-footer:last-child {
  margin-bottom: -1.5rem;
}

.add-comment .vs-row {
  display: grid !important;
  margin-right: -1.5rem;
  grid-template-columns: minmax(0%, 100%) 12rem;
}

.mb-wide {
  margin-bottom: 1.5rem !important;
}
.mb-big-wide {
  margin-bottom: 4.5rem !important;
}
.vs-button-list-left {
  width: auto !important;
}
.vs-button-list-right {
  width: auto !important;
  margin-left: auto !important;
}

b.secondary {
  color: rgb(102, 112, 203);
}

.comment-item {
  border-bottom: 1px solid #eaeaea;
  margin-bottom: 1.5rem;
}
.comment-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.comment-item.sub-1 {
  padding-left: 4.5rem;
}
.comment-item.sub-2 {
  padding-left: 9rem;
}
.comment-item.sub-3 {
  padding-left: 13.5rem;
}
.comment-view {
  display: grid !important;
  grid-template-columns: minmax(0%, 100%) 300px;
}
.comment-view-body {
  display: grid !important;
  grid-template-columns: 70px minmax(0%, 100%);
  grid-template-rows: 70px;
}
.comment-write {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;

  display: none !important;
}
.comment-write.open {
  display: flex !important;
}
</style>

<style>
.ql-edit-text .ql-editor {
  overflow-y: scroll;
  resize: vertical;
  min-height: 20em;
}

.read-vs-upload .btn-x-file {
  visibility: hidden;
}

.add-comment .vx-card__collapsible-content .vx-card__body {
  padding-right: 0px !important;
}

.col-img .vs-image--img {
  background-color: #c4c4c4 !important;
}

.comment-item .con-vs-image .vs-image--img {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
