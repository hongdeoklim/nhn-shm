<template>
  <div>
    <vs-row :class="getClasses">
      <vs-col style="position: relative">
        <vx-card style="width:calc(100% - 40px)">
          <vs-row class="mb-6">
            <vs-col class="flex " vs-justify="flex-end">
              <div class="mr-auto" style="display:grid; align-items: center;">
                <slot name="header" :value="value.header" />
              </div>

              <div class="ml-auto">
                <vs-button
                  v-if="board.search && board.savable && !isUpdateMode"
                  class="ml-4"
                  color="secondary"
                  @click="onClickDocumentSearch"
                  >불러오기</vs-button
                >
                <vs-button
                  v-if="board.savable && isUpdateMode"
                  class="ml-4"
                  color="secondary"
                  type="border"
                  @click="onClickDelete"
                  >삭제</vs-button
                >
                <vs-button
                  v-if="!board.isLaboratory"
                  class="ml-4"
                  color="secondary"
                  type="border"
                  @click="_onClickPrint"
                  >인쇄</vs-button
                >
                <vs-button
                  v-if="!board.isLaboratory"
                  class="ml-4"
                  color="secondary"
                  type="border"
                  @click="onClickClose"
                  >닫기</vs-button
                >
                <vs-button
                  v-if="board.collection"
                  class="ml-4"
                  color="secondary"
                  type="border"
                  @click="onClickRecall"
                  >결재문서 회수</vs-button
                >
                <vs-button
                  v-if="board.savable"
                  class="ml-4"
                  color="secondary"
                  @click="onClickTempsave"
                  >임시저장</vs-button
                >
                <vs-button
                  v-if="board.resend"
                  class="ml-4"
                  color="secondary"
                  @click="onClickReTempsave"
                  >재상신</vs-button
                >

                <vs-button
                  v-if="board.isLaboratory"
                  class="ml-4"
                  color="secondary"
                  @click="onClickTempsave"
                  >인쇄</vs-button
                >
                <vs-button
                  v-if="board.isLaboratory"
                  class="ml-4"
                  color="secondary"
                  type="border"
                  @click="_onClickPrint"
                  >목록</vs-button
                >
                <vs-button
                  v-if="board.isLaboratory"
                  class="ml-4"
                  color="secondary"
                  @click="onClickTempsave"
                  >임시저장</vs-button
                >
              </div>
            </vs-col>
          </vs-row>

          <vs-row>
            <vs-col>
              <slot name="body" :board="board" :data="value" />
              <slot name="print" :board="board" :data="value" />
            </vs-col>
          </vs-row>
        </vx-card>

        <div
          style="position: absolute; top: 0px; right: 0px; bottom:0; z-index:20;"
        >
          <label class="toggle-btn" @click="onClickToggleSide">
            <feather-icon
              v-if="this.toggleSide"
              icon="ChevronRightIcon"
              style="width:18px; height:18px;"
            />
            <feather-icon
              v-else
              icon="ChevronLeftIcon"
              style="width:18px; height:18px;"
            />
          </label>
        </div>
      </vs-col>
      <vs-col
        style="min-width:220px;"
        :style="{ display: this.toggleSide ? 'block' : 'none' }"
      >
        <approval-process-module
          :board="board"
          :isPrint="isPrint"
          :commentabled="!(board.isCompleteApproval || board.savable)"
          @handleClickUpload="_onClickApprovalUpload"
          @handleClickOk="_onClickApprovalOk"
          @handleClickNo="_onClickApprovalNo"
          @handleSendApprovalProcess="onChangeApproval"
        ></approval-process-module>
      </vs-col>
    </vs-row>

    <!-- TODO : 얼럿데이터 -->
    <popup-alert
      v-model="alert.show"
      :is-confirm="alert.isConfirm"
      :html="alert.html"
      :message="alert.message"
      :buttons="alert.buttons"
      @ok="onClickOk"
      @no="onClickNo"
      @upload="onClickUpload"
      @print="onClickPrint"
    ></popup-alert>
  </div>
</template>

<script>
import ApprovalProcessModule from "@/views/modules/ApprovalProcessModule";
import PopupAlert from "@/popup/PopupAlert";

export default {
  name: "ApprovalDocument",
  components: {
    PopupAlert,
    ApprovalProcessModule
  },
  props: {
    board: Object,
    value: Object,
    isPrint: Boolean
  },
  computed: {
    isUpdateMode() {
      return this.$route.params.postId;
    },
    projectInfo() {
      return this.$store.state.project.projectInfo;
    },
    getClasses() {
      if (this.toggleSide) {
        return "fix-grid";
      }
      return "hide-grid";
    }
  },
  data() {
    return {
      // TODO : 얼럿데이터
      alert: {
        show: false,
        message: "결재하시겠습니까?",
        buttons: [
          { label: "승인", action: "ok" },
          { label: "취소", action: "cancel" }
        ]
      },

      toggleSide: true
    };
  },

  beforeMount() {
    const backButtonRouteGuard = this.$router.beforeEach((to, from, next) => {
      if (JSON.stringify(this.oldForm) === JSON.stringify(this.form)) {
        next(true);
      } else if (
        confirm("저장하지 않은 데이터는 삭제됩니다. 닫으시겠습니까?")
      ) {
        next(true);
      }
    });
    this.$once("hook:destroyed", () => {
      backButtonRouteGuard();
    });
  },
  mounted() {
    this.init();
  },

  methods: {
    async init() {
      await this.boardInit();
    },
    async boardInit() {
      await this.$store.dispatch("USER_INFO");
      this.board.writer = {
        id: this.$store.state.auth.userInfo.id,
        name: this.$store.state.auth.userInfo.name,
        company_id: this.$store.state.auth.userInfo.company_id,
        company_name: this.$store.state.auth.userInfo.company_name
      };
      await this.$store.dispatch("company/LOAD_COMPANY", {
        companyId: this.board.writer.company_id
      });
      this.board.writer.company_name = this.$store.state.company.companyInfo.com_name;
    },
    // TODO : 얼럿데이터
    async alertOk() {
      const postId = this.$route.params.postId;
      await this.$store.dispatch("approval/APPROVE_OK", {
        postId
      });

      this.oldForm = JSON.parse(JSON.stringify(this.form));
      document.location.reload();
    },

    async alertNo(text) {
      const postId = this.$route.params.postId;
      const comment = text;
      await this.$store.dispatch("approval/APPROVE_NO", {
        postId,
        comment
      });
      this.oldForm = JSON.parse(JSON.stringify(this.form));
      document.location.reload();
    },

    alertPrint() {
      this.print();
    },

    getCreateStdOption() {
      return {
        boardSlug: this.board.slug,
        approvalLine: JSON.stringify(
          this.lineToSendLine(this.board.approvalLine)
        ),
        security: "normal",
        priority: "medium",
        title: this.projectInfo.field_name
      };
    },

    // TODO : 결재프로세스
    // ApprovalProcessModule 에서 사용하는 line 방식에서 전송용 line 으로 변경
    lineToSendLine(data) {
      const approvalList = [];

      for (const member of data) {
        if (member.type_code !== "register") {
          approvalList.push({
            id: member.user_id,
            name: member.user_name,
            elementType: member.type_code
          });
        }
      }

      return approvalList;
    },

    // button event
    _onClickPrint() {
      this.alert.html =
        "<p>인쇄후 페이지가 새로고침됩니다. 저장하지 않은 데이터는 삭제 됩니다</p><p>인쇄하시겠습니까?</p>";
      this.alert.message = "";
      this.alert.isConfirm = false;
      this.alert.buttons = [
        { label: "인쇄", action: "print" },
        { label: "취소", action: "cancel", type: "border" }
      ];
      this.alert.show = true;
    },
    _onClickApprovalUpload() {
      if (confirm("상신하시겠습니까?")) {
        this.onClickUpload();
      }
    },
    _onClickApprovalOk() {
      this.alert.html = "";
      this.alert.message = "승인하시겠습니까?";
      this.alert.isConfirm = false;
      this.alert.buttons = [
        { label: "승인", action: "ok" },
        { label: "취소", action: "cancel", type: "border" }
      ];
      this.alert.show = true;
    },
    _onClickApprovalNo() {
      this.alert.html =
        "<p>반려하시겠습니까?</p><p>아래에 사유를 작성해주세요.</p>";
      this.alert.message = "";
      this.alert.isConfirm = true;
      this.alert.buttons = [
        { label: "반려", action: "no" },
        { label: "취소", action: "cancel", type: "border" }
      ];
      this.alert.show = true;
    },
    onClickDocumentSearch() {
      this.$emit("documentSearch");
    },
    onClickClose() {
      this.$emit("close");
    },
    onClickDelete() {
      this.$emit("delete");
    },
    onClickRecall() {
      this.$emit("recall", { ...this.getCreateStdOption() });
    },
    onClickPrint() {
      this.$emit("print");
    },
    onClickTempsave() {
      this.$emit("tempsave", { ...this.getCreateStdOption() });
    },
    onClickReTempsave() {
      this.$emit("retempsave", { ...this.getCreateStdOption() });
    },
    onClickUpload() {
      this.$emit("upload", { ...this.getCreateStdOption() });
    },
    onClickOk() {
      this.$emit("ok", this.form);
    },
    onClickNo(text) {
      this.$emit("no", text);
    },
    onChangeApproval(process) {
      this.board.approvalLine = process;
    },
    onClickToggleSide() {
      this.toggleSide = !this.toggleSide;
    }
  }
};
</script>

<style lang="scss" scoped>
.fix-grid {
  display: grid !important;
  grid-template-columns: 9fr 3fr;
}
.hide-grid {
  display: grid !important;
  grid-template-columns: 9fr 0px;
}
.toggle-btn {
  padding: 0.5rem !important;
  height: 100%;
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  background-color: lightgray;
  color: #fff;
}
</style>
<style>
.con-vs-tabs .con-slot-tabs {
  overflow: initial;
}
</style>
