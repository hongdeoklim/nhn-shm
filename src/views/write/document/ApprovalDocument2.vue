<template>
  <div>
    <vs-row :class="getClasses">
      <vs-col style="position: relative">
        <vx-card style="width: calc(100% - 40px)">
          <vs-row class="mb-6">
            <vs-col class="flex" vs-justify="flex-end">
              <div class="mr-auto" style="display: grid; align-items: center">
                <slot name="header" :board="board" :isPrint="isPrint" />
              </div>

              <div id="right-button-container" class="ml-auto">
                <vs-button v-if="!isUpdateMode && usePrevPost" color="secondary" type="border" @click="$emit('prevPost')" class="hidden xl:block">이전 문서 불러오기</vs-button>
                <vs-button v-if="isUpdateMode && usePrint" class="ml-4" color="secondary" @click="onClickPrint">{{ printLabel }}</vs-button>
                <vs-button v-if="usedDelete && permission && permission.d" class="ml-4" color="secondary" type="border" @click="onClickDelete">삭제</vs-button>
                <vs-button class="ml-4" color="secondary" type="border" @click="onClickClose">닫기</vs-button>
                <vs-button v-if="usedRecalled && permission && permission.d" class="ml-4" color="secondary" @click="onClickRecall">결재문서 회수</vs-button>
                <vs-button v-if="usedTempsave" class="ml-4" color="secondary" @click="onClickTempsave">임시저장</vs-button>
                <vs-button v-if="board.resend && permission && permission.u" class="ml-4" color="secondary" @click="onClickReTempsave"> 재상신 </vs-button>
              </div>
            </vs-col>
          </vs-row>

          <vs-row>
            <vs-col>
              <div id="print-report">
                <slot name="body" :board="board" :isPrint="isPrint" />
              </div>
            </vs-col>
          </vs-row>
        </vx-card>

        <div style="position: absolute; top: 0px; right: 0px; bottom: 0; z-index: 20">
          <label class="toggle-btn" @click="onClickToggleSide">
            <feather-icon v-if="this.toggleSide" icon="ChevronRightIcon" style="width: 18px; height: 18px" />
            <feather-icon v-else icon="ChevronLeftIcon" style="width: 18px; height: 18px" />
          </label>
        </div>
      </vs-col>
      <vs-col style="min-width: 220px" :style="{ display: this.toggleSide ? 'block' : 'none' }">
        <approval-process-module
          :board="board"
          :isPrint="isPrint"
          :show-approval-time="true"
          :commentabled="!(board.isCompleteApproval || board.savable)"
          @handleClickUpload="_onClickApprovalUpload"
          @handleClickOk="_onClickApprovalOk"
          @handleClickNo="_onClickApprovalNo"
          @handleSendApprovalProcess="_onChangeApproval"
        ></approval-process-module>
      </vs-col>
    </vs-row>

    <!-- TODO : 얼럿데이터 -->
    <popup-alert v-model="alert.show" :is-confirm="alert.isConfirm" :html="alert.html" :message="alert.message" :buttons="alert.buttons" @ok="onClickOk" @no="onClickNo" @upload="onClickUpload" @print="onClickPrint"></popup-alert>
  </div>
</template>

<script>
import ApprovalProcessModule from "@/views/modules/ApprovalProcessModule";
import PopupAlert from "@/popup/PopupAlert";

export default {
  name: "ApprovalDocument2",
  components: {
    PopupAlert,
    ApprovalProcessModule,
  },
  props: {
    docProjectId: String | Number,
    docInfo: Object,
    usePrint: {
      type: Boolean,
      default: true,
    },
    usePrevPost: {
      type: Boolean,
      default: false,
    },
    printDirection: {
      type: String,
      default: 'all', // portrait landscape
    },
    printLabel: {
      type: String,
      default: () => "인쇄",
    },
    tab: Object,
    permission: Object | undefined,
  },
  computed: {
    boardId() {
      return parseInt(this.$route.params.boardId);
    },
    myInfo() {
      return this.$store.state.auth.userInfo;
    },
    projectInfo() {
      return this.$store.state.project.projectInfo;
    },
    projectId() {
      return parseInt(this.$route.params.proj_id);
    },
    usedDelete() {
      return this.isUpdateMode && this.board.isWriter;
    },
    usedRecalled() {
      return this.isUpdateMode && this.board.isWriter && this.board.statusCode === "registered";
    },
    usedTempsave() {
      return !this.isUpdateMode || (this.board.isWriter && this.board.statusCode === "temp");
    },
    isUpdateMode() {
      return this.$route.params.postId;
    },
    getClasses() {
      if (this.toggleSide) {
        return "fix-grid";
      }
      return "hide-grid";
    },
    isMobile()  {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    }
  },
  watch: {
    projectInfo(value) {
      if (value) {
        this.board.projectTitle = value.field_name;
      }
    },
    docInfo(doc) {
      const myId = this.myInfo.id;
      this.board.slug = doc.slug;
      this.board.statusCode = doc.status.code;
      this.board.writer = doc.writer;
      this.board.turnApprovalId = doc.turn_approval_id;
      this.board.isWriter = this.board.writer.id === myId;
      this.board.isTurnApproval = this.board.turnApprovalId === myId && (this.board.statusCode === "registered" || this.board.statusCode === "ongoing");
      this.board.readonly = !(this.board.statusCode === "temp" || this.board.statusCode === "rejected");

      if (!this.board.readonly) {
        // 다른 프로젝트에서 불러왔을 경우에는 읽기전용으로
        if (this.tab.byCurrentLocation && this.projectId !== this.docProjectId) {
          this.board.readonly = true;
        }
      }

      // 작성권한이 없을 경우 읽기전용으로 변경
      if (!this.permission.c) {
        this.board.readonly = true;
      }

      this.board.resend = this.board.isWriter && this.board.statusCode === "rejected";
      this.board.isCompleteApproval = this.board.statusCode === "approved" || this.board.statusCode === "rejected";
      this.board.savable = this.board.isWriter && this.board.statusCode === "temp";
      this.board.collection = this.board.isWriter && this.board.statusCode === "registered";
      this.board.approvalLine = doc.line.slice(); // 모듈 표기용
    },

    board: {
      immediate: true,
      deep: true,
      handler(value) {
        this.$emit("board", value, JSON.stringify(this.lineToSendLine(this.board.approvalLine)));
      },
    },
  },
  data() {
    return {
      // TODO : 글쓰기 정보 및 권한
      board: {
        slug: "",
        projectTitle: this.$store.state.project.projectInfo.field_name,
        statusCode: "", // 문서 상태코드
        writer: {}, //작성자 정보
        turnApprovalId: 0, // 결재자 ID
        isWriter: true, // 작성자인가
        readonly: false, // 읽기전용인가
        savable: true, // 임시저장이 가능하나
        isCompleteApproval: false, // 결재완료된 문서인가
        isTurnApproval: false, // 결재할 차례인가
        approvalLine: [], // 결재라인
        commentList: [], // 댓글리스트
      },

      // TODO : 얼럿데이터
      alert: {
        show: false,
        message: "결재하시겠습니까?",
        buttons: [
          { label: "승인", action: "ok" },
          { label: "취소", action: "cancel" },
        ],
      },

      toggleSide: true,
      isPrint: false,
    };
  },
  async beforeMount() {
    await this.init();
  },
  methods: {
    async init() {
      await this.$store.dispatch("USER_INFO");
      await this.$store.dispatch("company/LOAD_COMPANY", {
        companyId: this.$store.state.auth.userInfo.company_id,
      });

      if (this.board.writer.id) {
      } else {
        this.board.writer = {
          id: this.$store.state.auth.userInfo.id,
          name: this.$store.state.auth.userInfo.name,
          company_id: this.$store.state.auth.userInfo.company_id,
          department: this.$store.state.auth.userInfo.department,
          section: this.$store.state.auth.userInfo.section,
          com_name: "",
          rank: this.$store.state.auth.userInfo.rank,
        };
        this.board.writer.com_name = this.$store.state.company.companyInfo.com_name;
      }

      this.oldForm = this.form;
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
            elementType: member.type_code,
          });
        }
      }
      return approvalList;
    },

    //
    // ===== ui event =====
    //
    onClickToggleSide() {
      this.toggleSide = !this.toggleSide;
    },
    onClickUpload() {
      this.$emit("upload", JSON.stringify(this.lineToSendLine(this.board.approvalLine)));
    },
    onClickOk() {
      this.$emit("approval", this.form);
    },
    onClickNo(text) {
      this.$emit("reject", text);
    },

    //
    // ===== button group =====
    //
    onClickDelete() {
      if (confirm("정말 삭제하시겠습니까?")) {
        this.$emit("delete");
      }
    },
    printLandscape() {
      this.print("@media print {@page { size: a3 landscape; }}");
    },
    printPortrait() {
      this.print("@media print {@page { size: a3 portrait; }}");
    },
    /**
     * 사진대지처럼 이미지의 용량이 큰 경우, 인쇄가 안되는 경우가 있어서
     * 다음과 같은 처리를 해준다.
     * 새로운 창을 연 후, DOMContentLoaded 이벤트가 발생하면, 현재 창에서 출력하고자 하는 내용을 새로운 창으로 넘겨준다.
     * 이 후, load 이벤트가 발생하면, 새로운 창에서 인쇄를 실행한다.
     * >> DOMContentLoaded : DOM 트리가 완성되면 호출됨
     * >> load : 모든 리소스가 로드되면 호출됨 (이미지가 모두 로딩된 후 호출됨)
     */
    print(css) {
      // 프린트
      this.isPrint = true;
      this.board.isPrint = true;

      if (this.tab) {
        document.getElementById("hidePrintTitle").value = this.tab.hidePrintTitle ? "true" : "false";
      }
      document.getElementById("isPrint").value = "true";

      const winPrint = window.open(this.$route.fullPath, "_blank");
      winPrint.addEventListener("DOMContentLoaded", () => {
        const printTextarea = document.getElementsByClassName("print-textarea");
        for (let i = 0; i < printTextarea.length; i++) {
          const pt_r = printTextarea[i].innerHTML.trimStart().trimEnd().replace(/\r\n/gi, "<br>").replace(/\\n/gi, "<br>").replace(/\n/gi, "<br>");
          document.getElementsByClassName("print-textarea")[i].innerHTML = pt_r;
        }
        const isPrint = document.getElementById("isPrint").value === "true";
        const hidePrintTitle = document.getElementById("hidePrintTitle").value === "true";

        const g_label = document.getElementById("print-label") && this.usePrintTitle ? document.getElementById("print-label").innerHTML : "";
        const g_oBeforeBody = document.getElementById("print-report").innerHTML;

        winPrint.document.body.style.backgroundColor = "#fff";
        winPrint.document.body.innerHTML = "";
        if (g_label && isPrint && !hidePrintTitle) {
          winPrint.document.body.innerHTML += `${g_label}<br>`;
        }
        winPrint.document.body.innerHTML += g_oBeforeBody;
        winPrint.document.body.style.padding = "16px";
        const head = winPrint.document.head || winPrint.document.getElementsByTagName("head")[0],
          style = winPrint.document.createElement("style");

        style.type = "text/css";
        style.media = "print";

        if (style.styleSheet) {
          style.styleSheet.cssText = css;
        } else {
          style.appendChild(winPrint.document.createTextNode(css));
        }
        head.appendChild(style);
      })
      winPrint.addEventListener("load", function () {
        winPrint.print();
      });
      winPrint.onbeforeprint = function () {
        // 부모가 프린트 화면이므로 새로고침
        window.location.reload();
      };
      winPrint.onafterprint = function () {
        // 부모가 프린트 화면이므로 새로고침
        window.location.reload();
      };
      winPrint.onbeforeunload = function () {
        // 부모가 프린트 화면이므로 새로고침
        window.location.reload();
      };

    },
    onClickPrint() {
      if (this.printDirection === 'portrait') {
        return this.printPortrait()
      }
      if (this.printDirection === 'landscape') {
        return this.printLandscape()
      }

      const customAlert = new CustomEvent("customAlert", {
        detail: {
          title: "레이아웃 선택",
          messageIcon: "AlertCircleIcon",
          message: "인쇄 방향을 선택해 주세요.",
          useConfirm: true,
          confirmBtn: "세로 방향",
          cancelBtn: "가로 방향",
          confirmFunction: () => this.printPortrait(),
          cancelFunction: () => this.printLandscape(),
          size: "small",
          btnPosition: "center",
          confirmBtnStyle: {
            type: "border",
            icon: { type: "image", name: "icon-print-layout-vertical.svg" },
            style: "",
          },
          cancelBtnStyle: {
            type: "border",
            icon: { type: "image", name: "icon-print-layout-horizontal.svg" },
            style: "",
          },
        },
      });
      window.dispatchEvent(customAlert);

      return;
    },
    onClickClose() {
      this.$emit("close");
    },
    onClickRecall() {
      this.$emit("recall", JSON.stringify(this.lineToSendLine(this.board.approvalLine)));
    },
    onClickTempsave() {
      if (this.isUpdateMode) {
        this.$emit("update", JSON.stringify(this.lineToSendLine(this.board.approvalLine)));
      } else {
        this.$emit("save", JSON.stringify(this.lineToSendLine(this.board.approvalLine)));
      }
    },
    onClickReTempsave() {
      this.$emit("retempsave", JSON.stringify(this.lineToSendLine(this.board.approvalLine)));
    },

    //
    // ===== approval-process-module =====
    //
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
        { label: "취소", action: "cancel", type: "border" },
      ];
      this.alert.show = true;
    },
    _onClickApprovalNo() {
      this.alert.html = "<p>반려하시겠습니까?</p><p>아래에 사유를 작성해주세요.</p>";
      this.alert.message = "";
      this.alert.isConfirm = true;
      this.alert.buttons = [
        { label: "반려", action: "no" },
        { label: "취소", action: "cancel", type: "border" },
      ];
      this.alert.show = true;
    },
    _onChangeApproval(process) {
      this.board.approvalLine = process;
    },
  },
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
