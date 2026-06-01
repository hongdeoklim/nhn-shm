<template>
  <div>
    <vx-card class="mb-8">
      <vs-row class="mb-4">
        <vs-col class="flex" vs-justify="flex-end">
          <vs-button class="mr-2" color="secondary" type="border" @click="handleClickList">{{ $t("button.목록") }}</vs-button>
          <vs-button v-if="isAdmin" class="mr-2" color="secondary" @click="handleClickRegister">{{ $t("button.글쓰기") }}</vs-button>
          <vs-button v-if="enableReply && isAdmin" class="mr-2" color="secondary" type="border" @click="handleClickReply">{{ $t("button.답글") }}</vs-button>
          <vs-button v-if="isAuthor || isAdmin" class="mr-2" color="secondary" @click="handleClickUpdate">{{ $t("button.수정") }}</vs-button>
          <vs-button v-if="isAuthor || isAdmin" color="danger" type="border" @click="handleClickDelete">삭제</vs-button>
        </vs-col>
      </vs-row>

      <vs-row>
        <vs-col class="">
          <h5 class="mb-4"><i class="dot"></i>{{ $t("content.community.businessnews.detail.CEO 메세지") }}</h5>
        </vs-col>
      </vs-row>

      <vs-row class="mb-4">
        <vs-col class="flex flex-wrap">
          <vs-row class="w-full mb-4 grid" vs-align="center" vs-justify="center" style="grid-template-columns: 129px 1fr">
            <vs-col>{{ $t("content.community.businessnews.detail.제목") }}</vs-col>
            <vs-col
              ><span class="w-full">{{ post.post_title }}</span></vs-col
            >
          </vs-row>
          <vs-row class="w-full mb-4 grid" vs-align="center" vs-justify="center" style="grid-template-columns: 129px 1fr">
            <vs-col>{{ $t("content.community.businessnews.detail.작성자") }}</vs-col>
            <vs-col
              ><span class="w-full">{{ post.author ? post.author.name : "" }}</span></vs-col
            >
          </vs-row>
          <vs-row class="w-full mb-4 grid" vs-align="center" vs-justify="center" style="grid-template-columns: 129px 1fr">
            <vs-col>{{ $t("content.community.businessnews.detail.작성일") }}</vs-col>
            <vs-col
              ><span class="w-full">{{ post.created_at }}</span></vs-col
            >
          </vs-row>
          <vs-row class="w-full mb-4 grid" vs-align="center" vs-justify="center" style="grid-template-columns: 129px 1fr">
            <vs-col>{{ $t("content.community.businessnews.detail.내용") }}</vs-col>
            <vs-col><span class="w-full" v-html="form.content"></span></vs-col>
          </vs-row>
        </vs-col>
      </vs-row>

      <file-upload-module v-if="fileList.length > 0" class="w-full" v-model="fileList" type="check_list_col" :readonly="true"></file-upload-module>
    </vx-card>

    <vx-card class="p-6 mb-wide">
      <div class="w-full flex" slot="no-body">
        <h5 class="mr-auto flex items-center">
          <b>댓글목록</b>
          <b class="ml-2 secondary">{{ comments.length }}</b>
        </h5>
      </div>
    </vx-card>

    <vx-card>
      <div :data="comment" :key="index" v-for="(comment, index) in comments" class="comment-item" :class="`comment-item-${index}`" :style="{ paddingLeft: 4.5 * comment.dep + 'rem' }">
        <vs-row class="comment-view mb-4">
          <vs-col>
            <vs-row class="comment-view-body">
              <vs-col class="col-img">
                <vs-images hover="zoom">
                  <vs-image class="w-full h-full" :src="comment.user_avatar"></vs-image>
                </vs-images>
              </vs-col>
              <vs-col class="pl-4" vs-type="grid" vs-align="center">
                <vs-col>
                  <span>{{ comment.user_name }}</span>
                  <span class="ml-8">{{ comment.created_at }}</span>
                </vs-col>
                <vs-col>{{ comment.comment_content }}</vs-col>
              </vs-col>
            </vs-row>
          </vs-col>
          <vs-col v-if="comment.user_id === activeUserId" class="col-fix-buttons" vs-type="flex" vs-align="center" vs-justify="flex-end">
            <vs-button
              class="mr-2"
              color="#eaeaea"
              text-color="black"
              @click="
                (event) => {
                  openWrite(event, index);
                }
              "
              >{{ $t("content.community.businessnews.detail.답글") }}</vs-button
            >
            <vs-button
              class="mr-2"
              type="border"
              text-color="black"
              @click="
                (event) => {
                  openUpdate(event, index, comment.comment_content);
                }
              "
              >{{ $t("content.community.businessnews.detail.수정") }}</vs-button
            >
            <vs-button
              class=""
              color="#eaeaea"
              text-color="black"
              @click="
                (event) => {
                  handleClickDeleteComment(comment.comment_id);
                }
              "
              >{{ $t("content.community.businessnews.detail.삭제") }}</vs-button
            >
          </vs-col>
          <vs-col v-else class="col-fix-buttons" vs-type="flex" vs-align="center" vs-justify="flex-end">
            <vs-button
              class="mr-2"
              color="#eaeaea"
              text-color="black"
              @click="
                (event) => {
                  openWrite(event, index);
                }
              "
              >{{ $t("content.community.businessnews.detail.답글") }}</vs-button
            >
          </vs-col>
        </vs-row>

        <vs-row class="comment-write" vs-type="flex">
          <ml-textarea class="w-full" rows="2" v-model="subComment[index]" />
          <vs-button
            class="ml-auto mr-2"
            color="secondary"
            @click="
              (event) => {
                handleClickAddSubComment(index, comment.comment_id);
              }
            "
          >
            <span v-if="subCommentType[index] === 'u'">{{ $t("content.community.businessnews.detail.수정") }}</span>
            <span v-else>등록</span>
          </vs-button>
          <vs-button
            type="border"
            @click="
              (event) => {
                closeWrite(index);
              }
            "
            >{{ $t("content.community.businessnews.detail.취소") }}</vs-button
          >
        </vs-row>
      </div>
    </vx-card>

    <!-- 댓글 달기 -->
    <vx-card class="add-comment mb-wide">
      <vs-row>
        <vs-col class="">
          <ml-textarea class="mb-0" rows="3" v-model="comment" />
        </vs-col>
        <vs-col class="col-fix-buttons" vs-type="flex" vs-justify="center" vs-align="center">
          <vs-button
            color="secondary"
            @click="
              (event) => {
                handleClickAddComment(this.comment, 0);
              }
            "
            >등록하기</vs-button
          >
        </vs-col>
      </vs-row>
    </vx-card>
  </div>
</template>

<script>
import FileUploadModule from "@/views/modules/FileUploadModule";
export default {
  name: "CommunityBusinessnewsDetail",
  components: { FileUploadModule },
  data() {
    return {
      boardSlug: "news",
      boardId: 16,
      post: {},
      form: {
        title: "", //현장명
        writer: "", //작성자
        content: "",
      },
      fileList: [],
      comment: "",
      comments: [],
      subComment: [],
      subCommentType: [],
      enableReply: true,
    };
  },

  computed: {
    projectId() {
      return this.$route.params.proj_id;
    },
    myLv() {
      return this.$store.state.auth.userInfo.position;
    },

    isAuthor() {
      if (this.post.author) {
        return parseInt(`${this.post.author.id}`) === parseInt(`${this.$store.state.auth.userInfo.id}`);
      }
      return false;
    },

    activeUserId() {
      return this.$store.state.auth.userInfo.id;
    },
    rootCompanyList() {
      const list = [];
      for (const company of this.$store.state.company.companyList) {
        if (company.com_type === "head") {
          list.push(company);
        }
      }
      return list;
    },
    isAdmin() {
      let isAdmin = false;
      const myInfo = this.$store.state.auth.userInfo;
      isAdmin = isAdmin || parseInt(myInfo.is_superuser) > 0;
      return isAdmin;
    },
  },

  async created() {
    await this.loadCompanyList();
    await this.loadPost();
    await this.loadCommentList();
  },

  methods: {
    async loadCompanyList() {
      const page = 1;
      const perPage = 10000;
      const projectId = this.projectId;
      await this.$store.dispatch("company/LOAD_COMPANY_LIST", {
        page,
        perPage,
        comType: "head",
        projectId,
      });
    },
    async loadPost() {
      const projectId = this.projectId;
      const boardId = this.boardId;
      const postId = this.$route.params.postId;
      await this.$store.dispatch("board/LOAD_POST", { projectId, boardId, postId });

      // 내용
      this.post = this.$store.state.board.postInfo;
      this.fileList = [];
      for (const file of this.post.post_attachment) {
        this.fileList.push({
          id: file.id,
          fileName: file.file_name,
          fileSize: file.file_size,
          path: file.path,
        });
      }
      this.enableReply = !(this.post.post_parent_id > 0);
      this.form = JSON.parse(this.post.post_content);
    },

    async loadCommentList() {
      const boardSlug = this.boardSlug;
      const postId = this.$route.params.postId;

      await this.$store.dispatch("board/LOAD_COMMENT_LIST", { boardSlug, postId });
      this.comments = this.$store.state.board.commentList;

      this.comment = "";
      this.subComment = [];
    },

    handleClickUpdate() {
      const project_id = parseInt(this.$route.params.proj_id);
      const postId = this.$route.params.postId;
      if (project_id) {
        this.$router.push({ path: `/project/${project_id}/community/businessnews/${postId}/update` });
      } else {
        this.$router.push({ path: `/community/businessnews/${postId}/update` });
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
        this.$router.push({ path: `/project/${project_id}/community/businessnews/` });
      } else {
        this.$router.push({ path: "/community/businessnews/" });
      }
    },

    handleClickRegister() {
      const project_id = parseInt(this.$route.params.proj_id);
      if (project_id) {
        this.$router.push({ path: `/project/${project_id}/community/businessnews/create` });
      } else {
        this.$router.push({ path: "/community/businessnews/create" });
      }
    },

    handleClickReply() {
      const project_id = parseInt(this.$route.params.proj_id);
      const postId = this.$route.params.postId;
      if (project_id) {
        this.$router.push({ path: `/project/${project_id}/community/businessnews/${postId}/reply` });
      } else {
        this.$router.push({ path: `/community/businessnews/${postId}/reply` });
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
      await this.$store.dispatch("board/DELETE_COMMENT", { boardSlug, postId, commentId });

      // 댓글 리스트 새로고침
      await this.loadCommentList();
    },

    // 댓글 추가
    async addComment(_comment, _parentId) {
      const boardSlug = this.boardSlug;
      const postId = this.$route.params.postId;
      const comment = _comment;
      const parentId = _parentId;

      await this.$store.dispatch("board/ADD_COMMENT", { boardSlug, postId, comment, parentId });

      // 댓글 리스트 새로고침
      await this.loadCommentList();
    },

    // 댓글 수정
    async updateComment(_comment, _commentId) {
      const boardSlug = this.boardSlug;
      const postId = this.$route.params.postId;
      const comment = _comment;
      const commentId = _commentId;

      await this.$store.dispatch("board/UPDATE_COMMENT", { boardSlug, postId, comment, commentId });

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
