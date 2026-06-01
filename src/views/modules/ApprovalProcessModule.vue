<template>
  <div class="h-full">
    <vx-card class="h-full" id="print-approval" :style="isPrint ? { boxShadow: 'none', borderRadius: '0' } : {}">
      <vs-row v-if="board && board.savable && board.isWriter">
        <vs-col class="w-full pr-2">
          <div v-if="isPrint" style="display: inline-flex; align-items: center">
            <img src="@/assets/images/icon/red_exclamation.svg" />
            <span style="color: #e42728; padding-left: 10px; font-size: 17px">결재 절차가 이루어지지 않은 임시저장 문서입니다.</span>
          </div>
          <vs-button v-else class="w-full" color="secondary" @click="handleClickUpload">결재품의</vs-button>
        </vs-col>
      </vs-row>
      <vs-row v-if="board && board.isTurnApproval">
        <vs-col class="w-1/2 pr-2">
          <vs-button class="w-full" color="secondary" @click="handleClickOk">승인</vs-button>
        </vs-col>
        <vs-col class="w-1/2 pl-2">
          <vs-button class="w-full" color="#EDEDED" text-color="black" @click="handleClickNo">반려</vs-button>
        </vs-col>
      </vs-row>

      <div style="page-break-after: always"></div>

      <!-- 결재 프로세스 -->
      <vs-row class="side-item-title py-4 flex" vs-align="flex-end">
        <h5>결재 프로세스</h5>
        <vs-button v-if="board && board.savable" class="small p-2 ml-auto" color="secondary" @click="showApprovalPopup">결재선 지정 </vs-button>
      </vs-row>

      <vs-row class="side-item border-bottom" v-if="board && board.writer">
        <vs-col class="w-full my-3 flex items-center">
          <vs-avatar class="flex" style="min-width: 32px" :text="board && board.writer.name" />
          <div>
            <span style="line-height: 1">{{ board.writer.name }}</span>
            <br />
            <span style="font-size: 11px">{{ board && board.writer.company_name ? `${board.writer.company_name}` : "" }}</span>
          </div>
          <span class="btn-border btn-border-0 ml-auto flex items-center justify-center p-0" style="min-width: 55px">기안</span>
        </vs-col>
      </vs-row>

      <div v-if="approvalLine && approvalLine.length > 0">
        <!-- 결재 프로세스 -->
        <div v-for="(item, index) in approvalLine" :key="'approval_' + index">
          <vs-row v-if="item.type_code === 'approval'" class="side-item border-bottom">
            <vs-col class="w-full my-3 flex items-center">
              <vs-avatar class="flex" style="min-width: 32px" :text="item && item.user_name" />
              <div>
                <span style="line-height: 1">{{ item.user_name }}</span>
                <br />
                <span style="font-size: 11px">{{ item.company_name ? `${item.company_name}` : "" }}</span>
              </div>
              <span style="min-width: 55px" :class="'btn-border-' + getStatusNum(item.user_id, item.status_id)" class="btn-border btn-border-0 ml-auto flex items-center justify-center p-0">
                {{ getStatusName(getStatusNum(item.user_id, item.status_id)) }}
              </span>
            </vs-col>
          </vs-row>

          <vs-row v-if="Number(item.status_id) === 3" class="side-item border-bottom">
            <vs-col class="w-full my-3" v-if="item.comments.length > 0">
              <h5 class="mb-2"></h5>
              <div class="flex">
                <p>{{ item.comments[0].comment }}</p>
                <p class="ml-auto">
                  <!--<span style="font-size:12px; cursor:pointer" @click="()=>{updateComment()}">의견수정</span>-->
                  <span class="ml-4 font-bold">반려</span>
                </p>
              </div>
            </vs-col>
          </vs-row>
        </div>

        <!-- 수신참조 -->
        <vs-row class="side-item-title pt-8 pb-4" v-if="referenceCount > 0">
          <h5>수신참조</h5>
        </vs-row>
        <div v-for="(item, index) in approvalLine" :key="'reference_' + index">
          <vs-row v-if="item.type_code === 'reference'" class="side-item border-bottom">
            <vs-col class="w-full my-3">
              <vs-col class="w-6/12" vs-align="center" vs-type="flex">
                <span style="min-width: 42px"><vs-avatar class="flex" style="min-width: 32px" /></span>
                <span class="">{{ item.user_name }}<br />{{ item.company_name ? `${item.company_name}` : "" }}</span>
              </vs-col>
              <vs-col class="w-6/12 h-full" vs-align="center" vs-justify="flex-end" vs-type="flex"> </vs-col>
            </vs-col>
          </vs-row>
        </div>

        <!-- 회람자 -->
        <vs-row class="side-item-title pt-8 pb-4" v-if="circulationCount > 0">
          <h5>회람자</h5>
        </vs-row>

        <div v-for="(item, index) in approvalLine" :key="'circulation_' + index">
          <vs-row v-if="item.type_code === 'circulation'" class="side-item border-bottom">
            <vs-col class="w-full my-3">
              <vs-col class="w-6/12" vs-align="center" vs-type="flex">
                <span style="min-width: 42px">
                  <vs-avatar class="flex" style="min-width: 32px" />
                </span>
                <span class="">{{ item.user_name }}<br />{{ item.company_name ? `${item.company_name}` : "" }}</span>
              </vs-col>
              <vs-col class="w-6/12 h-full" vs-align="center" vs-justify="flex-end" vs-type="flex"> </vs-col>
            </vs-col>
          </vs-row>
        </div>

        <!-- 댓글 리스트-->
        <div v-if="commentList && commentList.length > 0" class="border-top" style="margin-top: 100px; margin-left: -1.5rem; margin-right: -1.5rem; padding-left: 1.5rem; padding-right: 1.5rem">
          <vs-row v-for="(comment, index) in commentList" :key="index" class="side-item pt-4" :class="index < commentList.length - 1 ? 'border-bottom' : ''">
            <vs-col class="w-full" vs-align="center" vs-type="flex">
              <vs-avatar class="flex" style="min-width: 32px" />
              <span class="">
                <p>{{ comment.user_name }}</p>
                <h5 class="mb-2">
                  {{ comment.created_at ? comment.created_at.substr(0, 10) : "" }}<span style="color: #aaa; font-weight: 300">{{ comment.created_at ? comment.created_at.substr(10) : "" }}</span>
                </h5>
              </span>
            </vs-col>
            <vs-col class="w-full my-3">
              <div class="flex">
                <p>{{ comment.comment_content }}</p>
                <p v-if="!isPrint" class="ml-auto text-right" style="min-width: 75px; width: 75px">
                  <span v-if="commentabled && isCommentUpdateMode && comment.user_id === userId && comment.comment_id === updateCommentId" class="font-bold" style="font-size: 12px; cursor: pointer" @click="updateCommentModeCancel"
                    >취소</span
                  >
                  <span
                    v-if="commentabled && !isCommentUpdateMode && comment.user_id === userId"
                    class="font-bold"
                    style="font-size: 12px; cursor: pointer"
                    @click="
                      () => {
                        updateCommentMode(comment.comment_id, comment.comment_content);
                      }
                    "
                    >수정</span
                  >
                  <span
                    v-if="commentabled && !isCommentUpdateMode && comment.user_id === userId"
                    class="ml-4 font-bold"
                    style="font-size: 12px; cursor: pointer"
                    @click="
                      () => {
                        deleteComment(comment.comment_id);
                      }
                    "
                    >삭제</span
                  >
                </p>
              </div>
            </vs-col>
          </vs-row>
        </div>

        <!-- 댓글 작성 -->
        <div v-if="commentabled && !isPrint" class="border-top" style="margin-left: -1.5rem; margin-right: -1.5rem; padding: 1rem 1.5rem; padding-bottom: 0rem">
          <vs-row class="side-item">
            <vs-col class="w-full my-3 flex" vs-align="center">
              <span style="min-width: 42px"><vs-avatar class="flex" style="min-width: 32px" /></span>
              <span class="mr-2 w-full"><ml-input class="w-full" v-model="comment" /></span>
              <vs-button v-if="isCommentUpdateMode" class="px-4" style="min-width: 60px" @click="updateComment">수정 </vs-button>
              <vs-button v-else class="px-4" style="min-width: 60px" @click="addComment">입력</vs-button>
            </vs-col>
          </vs-row>
        </div>
      </div>
    </vx-card>

    <popup-approval-process v-model="approvalLine" :show-popup="showPopup" :enabled="true" @sendApprovalList="handleSendApprovalProcess" @closePopup="handleCloseApprovalPopup" />
  </div>
</template>

<script>
import PopupApprovalProcess from "@/views/approval/PopupApprovalProcess";

export default {
  name: "ApprovalProcessModule",
  components: {
    PopupApprovalProcess,
  },
  props: {
    isPrint: Boolean,
    board: Object, // 문서정보
    commentabled: false, // 댓글사용여부
  },

  watch: {
    board: {
      deep: true,
      handler(board) {
        this.initApprovalList(board.approvalLine);
        this.loadCommentList();
      },
    },
  },

  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
  },
  data() {
    return {
      userId: 0,
      isCommentUpdateMode: false, //댓글 수정상태인가
      updateCommentId: "", //수정하려는 댓글 ID

      boardInfo: {},
      showPopup: false,
      approvalLine: [],
      referenceCount: 0,
      circulationCount: 0,
      nowChecker: "", //결재자
      commentList: [], //댓글리스트
      comment: "",
    };
  },
  async created() {
    this.initApprovalList(this.board.approvalLine);
    this.boardInfo = this.board;

    if (this.$store.state.auth.userInfo === null) {
      await this.$store.dispatch("USER_INFO");
    }
    this.userId = this.$store.state.auth.userInfo.id;
  },
  methods: {
    getDate(date) {
      return new Date(date).format("yyyy-MM-dd");
    },
    getTime(date) {
      return new Date(date).format("HH:mm:ss");
    },
    initApprovalList(line) {
      this.approvalLine = [];
      this.nowChecker = "";
      this.referenceCount = 0;
      this.circulationCount = 0;
      for (const member of line) {
        if (member.type_code !== "register") {
          if (member.type_id === 3 && member.status_id === 1 && this.nowChecker.length === 0) {
            this.nowChecker = member.user_id;
          }

          if (member.type_code === "reference") {
            this.referenceCount += 1;
          }

          if (member.type_code === "circulation") {
            this.circulationCount += 1;
          }

          this.approvalLine.push({
            comments: member.comments,
            company_id: member.company_id,
            company_name: member.company_name,
            status_code: member.status_code,
            status_id: member.status_id,
            status_name: member.status_name,
            type_code: member.type_code,
            type_id: member.type_id,
            type_name: member.type_name,
            user_id: member.user_id,
            user_name: member.user_name,
            updated_at: member.updated_at,
          });
        }
      }
    },

    getStatusNum(member_id, status_id) {
      // 1 : 대기
      // 2 : 승인
      // 3 : 반려
      // 4 : 결재중

      let classNum = status_id;

      if (this.nowChecker === member_id && status_id !== 5) {
        if (this.board.savable) {
          classNum = 1;
        } else {
          classNum = 4;
        }
      }
      return classNum;
    },

    getStatusName(classNum) {
      if (classNum === 1) {
        return "대기";
      } else if (classNum === 2) {
        return "승인";
      } else if (classNum === 3) {
        return "반려";
      } else if (classNum === 4) {
        return "결재중";
      }
    },

    showApprovalPopup() {
      this.showPopup = true;
    },

    handleCloseApprovalPopup() {
      this.showPopup = false;
    },

    handleSendApprovalProcess(approvalList) {
      this.initApprovalList(approvalList);
      this.$emit("handleSendApprovalProcess", approvalList);
    },

    handleClickUpload() {
      this.$emit("handleClickUpload");
    },

    handleClickOk() {
      this.$emit("handleClickOk");
    },

    handleClickNo() {
      this.$emit("handleClickNo");
    },

    handleAddComment() {
      this.$emit("handleAddComment", this.comment);
    },

    // 댓글 조회
    async loadCommentList() {
      const boardSlug = this.board.slug;
      const postId = this.$route.params.postId;

      if (boardSlug && postId && postId !== "create") {
        await this.$store.dispatch("board/LOAD_COMMENT_LIST", {
          boardSlug,
          postId,
        });
        this.commentList = this.$store.state.board.commentList;
      }

      this.comment = "";
      this.subComment = [];
    },

    // 댓글 추가
    async addComment() {
      const boardSlug = this.board.slug;
      const postId = this.$route.params.postId;
      const comment = this.comment;
      await this.$store.dispatch("board/ADD_COMMENT", {
        boardSlug,
        postId,
        comment,
      });

      // 댓글 리스트 새로고침
      await this.loadCommentList();
    },

    // 댓글 수정
    updateCommentMode(_commentId, _comment) {
      this.isCommentUpdateMode = true;
      this.updateCommentId = _commentId;
      this.comment = _comment;
    },
    updateCommentModeCancel() {
      this.isCommentUpdateMode = false;
      this.updateCommentId = 0;
      this.comment = "";
    },
    async updateComment() {
      const boardSlug = this.board.slug;
      const postId = this.$route.params.postId;
      const comment = this.comment;
      const commentId = this.updateCommentId;

      await this.$store.dispatch("board/UPDATE_COMMENT", {
        boardSlug,
        postId,
        comment,
        commentId,
      });
      // 댓글 리스트 새로고침
      await this.loadCommentList();
      this.updateCommentModeCancel();
    },

    // 댓글 삭제
    async deleteComment(_commentId) {
      const boardSlug = this.board.slug;
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
  },
};
</script>

<style scoped>
.date {
  font-weight: 500;
}
.time {
  color: #9ca0a4;
}
.btn-border {
  font-size: 12px;
  width: 55px;
  border-radius: 999px;
  display: inline-block;
  text-align: center;

  border: 1px solid #00b812;
}

.btn-border-0 {
  border-color: #00b812;
  color: #00b812;
}

.btn-border-1 {
  border-color: #ffa84c;
  color: #ffa84c;
}

.btn-border-2 {
  border-color: #a0a0a0;
  color: #a0a0a0;
}

.btn-border-3 {
  border-color: #1e0d61;
  color: #1e0d61;
}

.btn-border-4 {
  border-color: #f60000;
  color: #f60000;
}

.btn-border-5 {
  border-color: #001aff;
  color: #001aff;
}

.btn-border-6 {
  border-color: #6ca7ff;
  color: #6ca7ff;
}

.btn-border-7 {
  border-color: #353535;
  color: #353535;
}

.btn-border-8 {
  border-color: #7e72f2;
  color: #7e72f2;
}

.side-item {
  font-size: 14px;
}

.side-item h5 {
  font-size: 14px;
}

.side-item-title {
  border-bottom: 1px solid #a0a0a0;
}
</style>
