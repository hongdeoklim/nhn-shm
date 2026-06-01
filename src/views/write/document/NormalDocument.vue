<template>
  <div>
    <vx-card class="w-full">
      <vs-row class="mb-6">
        <vs-col class="flex flex-col xl:flex-row gap-y-5" vs-justify="flex-end">
          <div class="mr-auto" style="display: grid; align-items: center">
            <slot name="header" :board="board" :isPrint="isPrint" />
          </div>

          <div class="button-container w-full xl:w-auto grid grid-cols-2 xl:flex gap-2 xl:gap-4 ml-auto">
            <vs-button v-if="!isUpdateMode && usePrevPost" color="secondary" type="border" @click="$emit('prevPost')" class="hidden xl:block">이전 문서 불러오기</vs-button>
            <vs-button v-if="isUpdateMode && usePrint" color="secondary" @click="onClickPrint" class="hidden md:block">{{ printLabel }}</vs-button>
            <vs-button v-if="(useDelete && created && !board.readonly && permission && permission.d && isUpdateMode) || (isAdmin && isUpdateMode)" color="secondary" type="border" @click="onClickRemove">삭제</vs-button>
            <vs-button color="secondary" type="border" @click="onClickMoveList">목록</vs-button>
            <vs-button v-if="(created && !board.readonly && board.viewSaveBtn) || (isAdmin && board.viewSaveBtn)" color="secondary" id="saveButton" @click="onClickSave">저장</vs-button>
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
  </div>
</template>

<script>
export default {
  name: "NormalDocument",
  components: {},
  props: {
    docProjectId: String | Number,
    usePrevPost: {
      type: Boolean,
      default: false,
    },
    usePrint: {
      type: Boolean,
      default: true,
    },
    printDirection: {
      type: String,
      default: "all", // portrait landscape
    },
    usePrintTitle: {
      type: Boolean,
      default: true,
    },
    printLabel: {
      type: String,
      default: () => "인쇄",
    },
    useDelete: {
      type: Boolean,
      default: true,
    },
    created: {
      type: Boolean,
      default: true,
    },
    tab: Object,
    permission: Object | undefined,
  },
  computed: {
    projectInfo() {
      return this.$store.state.project.projectInfo;
    },
    boardInfo() {
      return this.$store.state.board.postInfo;
    },
    projectId() {
      return parseInt(this.$route.params.proj_id);
    },
    boardId() {
      return parseInt(this.$route.params.boardId);
    },
    postId() {
      return parseInt(this.$route.params.postId);
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
    isAdmin() {
      let isAdmin = false;
      const myInfo = this.$store.state.auth.userInfo;
      isAdmin = isAdmin || parseInt(myInfo.is_superuser) > 0;
      return isAdmin;
    },
    isMobile() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
  },
  watch: {
    projectInfo(value) {
      if (value) {
        this.board.projectTitle = value.field_name;
      }
    },

    boardInfo(boardInfo) {
      // 권한체크
      this.checkPermission();
    },

    permission(value) {
      // 권한체크
      this.checkPermission();
    },

    board: {
      immediate: true,
      deep: true,
      handler(value) {
        this.$emit("board", value);
      },
    },
  },
  data() {
    return {
      isPrint: false,
      // TODO : 글쓰기 정보 및 권한
      board: {
        projectTitle: this.$store.state.project.projectInfo.field_name,
        writer: {}, //작성자 정보
        readonly: false, // 읽기전용인가
        isPrint: false,
        viewSaveBtn: true,
      },
    };
  },
  async mounted() {
    await this.init();
  },

  methods: {
    async init() {
      await this.$store.dispatch("USER_INFO");
      this.board.writer = {
        id: this.$store.state.auth.userInfo.id,
        name: this.$store.state.auth.userInfo.name,
        company_id: this.$store.state.auth.userInfo.company_id,
        department: this.$store.state.auth.userInfo.department,
        section: this.$store.state.auth.userInfo.section,
        rank: this.$store.state.auth.userInfo.rank,
        com_name: "",
      };

      await this.$store.dispatch("company/LOAD_COMPANY", {
        companyId: this.board.writer.company_id,
      });
      this.board.writer.com_name = this.$store.state.company.companyInfo.com_name;

      // 권한체크
      await this.checkPermission();
    },

    async checkPermission() {
      this.board.readonly = false;
      if (this.$store.state.board.postInfo.author) {
        this.board.author = {
          id: this.$store.state.board.postInfo.author.id,
          name: this.$store.state.board.postInfo.author.name,
          company_id: this.$store.state.board.postInfo.author.company_id,
          department: this.$store.state.board.postInfo.author.department,
          rank: this.$store.state.board.postInfo.author.rank,
          com_name: "",
        };
        await this.$store.dispatch("company/LOAD_COMPANY", {
          companyId: this.$store.state.board.postInfo.author.company_id,
        });
        this.board.author.com_name = this.$store.state.company.companyInfo.com_name;

        // 글 작성자와 접속자의 정보가 다를 경우, 읽기 전용으로
        if (this.postId && this.board.author.id !== this.board.writer.id) {
          this.board.readonly = true;
        } else {
          // 다른 프로젝트에서 불러왔을 경우에는 읽기전용으로
          if (this.tab.byCurrentLocation) {
            if (this.projectId !== this.docProjectId) {
              this.board.readonly = true;
            }
          }
        }
      }

      // 작성권한이 없을 경우 읽기전용으로 변경
      // 수정권한이 없을 경우 읽기전용으로 변경
      if (!this.permission.c || !this.permission.u) {
        this.board.readonly = true;
      }

      if (this.isAdmin) {
        this.board.readonly = false;
      }
    },

    async onClickSave() {
      this.$emit("save");
    },

    onClickMoveList() {
      this.$emit("move", "list");
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
      if (this.printDirection === "portrait") {
        return this.printPortrait();
      }
      if (this.printDirection === "landscape") {
        return this.printLandscape();
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
    },
    onClickRemove() {
      if (confirm("정말 삭제하시겠습니까?")) {
        this.$emit("remove");
      }
    },
    saveButtonControl(value) {
      this.board.viewSaveBtn = value;
    },
    getSaveButtonControl() {
      return this.board.viewSaveBtn;
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
