<template>
  <div>
    <div>
      <input type="hidden" id="isPrint" value="false" />
      <input type="hidden" id="hidePrintTitle" value="false" />

      <vs-tabs v-if="1 < tabList.length || showOneTab" :value="tabIndex"> <vs-tab v-for="tab in tabList" :key="`tab_${tab.label}`" :label="tab.label" @click="moveTab(tab.boardId, tab.key)"></vs-tab></vs-tabs>
      <div>
        <component v-if="tab.exception" :is="tab.component" />
        <ApprovalDocument2
          v-else-if="tab.isApproval"
          :tab="tab"
          :doc-info="docInfo"
          :docProjectId="docProjectId"
          :permission="getPermission"
          :usePrevPost="tab.usePrevPost"
          :use-print="tab.usePrint === true || tab.usePrint === false ? tab.usePrint : true"
          :print-direction="tab.printDirection"
          :use-delete="typeof tab.useDelete === 'boolean' ? tab.useDelete : true"
          :print-label="tab.printLabel"
          @delete="onClickApprovalDelete"
          @print="onClickApprovalPrint"
          @close="onClickApprovalClose"
          @recall="onClickApprovalRecall"
          @upload="onClickApprovalUpload"
          @update="onClickApprovalSave"
          @save="onClickApprovalSave"
          @approval="onClickApprovalOk"
          @reject="onClickApprovalNo"
          @retempsave="onClickReTempsave"
          @prevPost="onClickPrevPost"
          @board="updateBoard"
        >
          <template #header="props">
            <div v-if="tab.useHeaderDate" class="h4 flex" style="align-items: center">
              <div id="print-label">
                <p v-if="!(props.isPrint && tab.hidePrintTitle)" class="h4 flex" style="align-items: center">
                  {{ tab.label }}
                </p>
              </div>
              <ml-input class="ml-8 mr-2" style="width: 100px" v-model="form.header.year" :readonly="true" />년 <ml-input type="number" class="ml-8 mr-2" style="width: 100px" v-model="form.header.month" :readonly="props.board.readonly" />월
            </div>

            <div v-else id="print-label">
              <p v-if="!(props.isPrint && tab.hidePrintTitle)" class="h4 flex" style="align-items: center">{{ tab.label }}</p>
            </div>
          </template>

          <template #body="props">
            <component :is="tab.component" :board="props.board" :header="form.header" :is-print="props.isPrint" v-model="form.body" :docProjectId="docProjectId" @EnableSave="handleEnableSave" />
            <FileDownload v-if="!props.isPrint && !tab.hideFileDownload" />
          </template>
        </ApprovalDocument2>
        <NormalDocument
          v-else
          ref="refNormalDocument"
          :tab="tab"
          :created="useCreated"
          :docProjectId="docProjectId"
          :permission="getPermission"
          :usePrevPost="tab.usePrevPost"
          :use-print="typeof tab.usePrint === 'boolean' ? tab.usePrint : true"
          :print-direction="tab.printDirection"
          :use-print-title="typeof tab.usePrintTitle === 'boolean' ? tab.usePrintTitle : true"
          :use-delete="typeof tab.useDelete === 'boolean' ? tab.useDelete : true"
          :print-label="tab.printLabel"
          @move="onMoveNormalPage"
          @remove="onClickNormalRemove"
          @save="onClickNormalSave"
          @prevPost="onClickPrevPost"
          @board="updateBoard"
        >
          <template #header="props">
            <div v-if="tab.useHeaderDate" class="h4 flex" style="align-items: center">
              <div id="print-label">
                <p v-if="!(props.isPrint && tab.hidePrintTitle)" class="h4 flex" style="align-items: center">
                  {{ !!tab.detailLable ? tab.detailLable : tab.label }}
                </p>
              </div>
              <ml-input class="ml-8 mr-2" style="width: 100px" v-model="form.header.year" :readonly="true" />년 <ml-input type="number" class="ml-8 mr-2" style="width: 100px" v-model="form.header.month" :readonly="props.board.readonly" />월
            </div>
            <div v-else id="print-label">
              <p v-if="!(props.isPrint && tab.hidePrintTitle)" class="h4 flex" style="align-items: center">{{ !!tab.detailLable ? tab.detailLable : tab.label }}</p>
            </div>
          </template>
          <template #body="props">
            <component
              ref="normalDocument"
              :is="tab.component"
              :board="props.board"
              :is-print="props.isPrint"
              :header="form.header"
              v-model="form.body"
              :docProjectId="docProjectId"
              @saveButtonControl="(value) => saveButtonControl(value)"
              @EnableSave="handleEnableSave"
            />
            <FileDownload v-if="!props.isPrint && !tab.hideFileDownload" />
          </template>
        </NormalDocument>
      </div>
    </div>

    <PopupLoadPrevBoard v-model="showLoadPrevBoardPopup" @selectRowData="updatePrevForm" />
  </div>
</template>

<script>
import breadcrumb from "@/views/boards/tab/breadcrumb";
import tabItems from "@/views/boards/tab/tab-items";
import Exception01 from "@/views/boards/exception/Exception01";
import Exception02 from "@/views/boards/exception/Exception02";
import Exception03 from "@/views/boards/exception/Exception03";
import Exception04 from "@/views/boards/exception/Exception04";

import ApprovalDocument2 from "@/views/write/document/ApprovalDocument2";
import NormalDocument from "@/views/write/document/NormalDocument";

import FileDownload from "@/components/FileDownload.vue";
import singlePageWrite from "@/views/boards/single-page/writeIndex";
import PopupLoadPrevBoard from "@/popup/PopupLoadPrevBoard.vue";

export default {
  name: "Write",
  components: {
    NormalDocument,
    ApprovalDocument2,
    Exception01,
    Exception02,
    Exception03,
    Exception04,
    FileDownload,
    PopupLoadPrevBoard,
  },
  data() {
    return {
      tabItems,
      breadcrumb,
      tabIndex: 0,
      tabList: [],

      oldForm: {},
      form: {
        header: {
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
        },
        body: {},
      },
      board: {},
      approval: {},
      docInfo: {},
      docProjectId: "",

      isApproval: false,
      isPrint: false,
      enableSave: true,
      showLoadPrevBoardPopup: false,
    };
  },
  computed: {
    projectInfo() {
      return this.$store.state.project.projectInfo;
    },
    projectId() {
      return parseInt(this.$route.params.proj_id);
    },
    boardId() {
      return parseInt(this.$route.params.boardId);
    },
    boardSlug() {
      for (const tab of this.tabList) {
        if (`${tab.boardId}` === `${this.boardId}`) {
          return tab.slug;
        }
      }
      return "";
    },
    postId() {
      return parseInt(this.$route.params.postId);
    },
    myInfo() {
      return this.$store.state.auth.userInfo;
    },
    useCreated() {
      // if (this.boardId === ) {
      //
      // }
      return this.enableSave;
    },
    header() {
      return this.form.header;
    },

    memberInfoBoards() {
      return this.$store.state.member.memberInfo.boards;
    },

    getPermission() {
      const boards = this.memberInfoBoards;
      if (boards) {
        let permission = boards.find((b) => parseInt(b.id) === parseInt(this.boardId) && parseInt(b.pivot.project_id) === parseInt(this.projectId));
        if (permission) {
          const pivot = { ...permission.pivot };
          return {
            c: pivot.c,
            r: pivot.r,
            u: pivot.u,
            d: pivot.d,
            v: pivot.v,
          };
        } else {
          // 프로젝트 ID에 매칭된 데이터가 없으면 레거시 형식이므로, 프로젝트 ID를 제외하고 조회한다
          permission = boards.find((b) => parseInt(b.id) === parseInt(this.boardId));
          if (typeof permission.pivot !== "undefined") {
            const pivot = { ...permission.pivot };
            return {
              c: pivot.c,
              r: pivot.r,
              u: pivot.u,
              d: pivot.d,
              v: pivot.v,
            };
          }
        }
      }
      return {
        c: false,
        r: false,
        u: false,
        d: false,
        v: false,
      };
    },
    tab() {
      return this.tabList[this.tabIndex];
    },
    showOneTab() {
      const enabledIds = [];

      // 탭이 노출되기 원하는 boardId인 경우
      // true를 반환시켜준다.
      return !!enabledIds.find((id) => id === this.boardId);
    },
  },
  watch: {
    header: {
      immediate: true,
      deep: true,
      handler(value) {
        if (value) {
          this.form.header.full = `${value.year}-${value.month}-01`;
        }
      },
    },
  },
  beforeMount() {
    this.oldForm = JSON.parse(JSON.stringify(this.form));
    this.initBreadcrumb();
    this.initBackButtonRouteGuard();
    this.initTab();
  },
  async mounted() {
    // 게시판 권한 체크로 사용하기 위해 호출.
    await this.$store.dispatch("member/LOAD_MEMBER_DETAIL");

    if (this.postId) {
      if (this.isApproval) {
        await this.loadApprovalPost();
      } else {
        await this.loadBoardPost();
      }
    }
  },
  methods: {
    initBreadcrumb() {
      let breadcrumb = [{ title: "Home" }];
      let key = `${this.boardId}`;

      // 브래드크럼의 이름이 프로젝트 번호와 연결되어 있으면, 해당 정보를 가져온다
      if (this.breadcrumb[`${this.projectId}.${this.boardId}`]) {
        key = `${this.projectId}.${this.boardId}`;
      }
      breadcrumb.push(...this.breadcrumb[key]);

      if (Number(`${this.projectId}`) === 1) {
        if (this.boardId === 119) {
          breadcrumb = [{ title: "Home" }, { title: "현장 총괄 등록" }, { title: "안전보건총괄책임자 선임" }];
        } else if (this.boardId === 120) {
          breadcrumb = [{ title: "Home" }, { title: "현장 총괄 등록" }, { title: "안전보건책임자 선임" }];
        } else if (this.boardId === 121) {
          breadcrumb = [{ title: "Home" }, { title: "현장 총괄 등록" }, { title: "안전보건조정자 선임" }];
        } else if (this.boardId === 122) {
          breadcrumb = [{ title: "Home" }, { title: "현장 총괄 등록" }, { title: "안전보건관리자 및 산업보건의 선임" }];
        } else if (this.boardId === 123) {
          breadcrumb = [{ title: "Home" }, { title: "현장 총괄 등록" }, { title: "안전보건관리자 및 산업보건의(건설업) 선임" }];
        } else if (this.boardId === 124) {
          breadcrumb = [{ title: "Home" }, { title: "현장 총괄 등록" }, { title: "안전보건담당자 선임" }];
        } else if (this.boardId === 125) {
          breadcrumb = [{ title: "Home" }, { title: "현장 총괄 등록" }, { title: "관리감독자 선임" }];
        }
      }

      if (breadcrumb.length > 0) breadcrumb[breadcrumb.length - 1].active = true;
      this.$store.commit("menu/UPDATE_PAGE_LIST", breadcrumb);
    },
    initBackButtonRouteGuard() {
      const backButtonRouteGuard = this.$router.beforeEach(async (to, from, next) => {
        if (!this.isApproval && this.$refs.refNormalDocument.getSaveButtonControl() === false) {
          document.querySelectorAll(".con-vs-popup").forEach((el) => {
            el.style.display = "none";
          })
          next(true);
          return;
        }

        let confirmText = "저장 하시겠습니까?";
        if (this.postId) {
          if (this.isApproval) {
            confirmText = "임시저장 하시겠습니까?";
          }
        }
        const keys = Object.keys(this.form.body);

        let eq = true;
        if (eq) {
          for (const key of keys) {
            const old = this.oldForm.body[key];
            const now = this.form.body[key];

            if (JSON.stringify(old) !== JSON.stringify(now)) {
              eq = false;
              break;
            }
          }
        }

        if (eq || this.board.readonly || !this.myInfo) {
          next(true);
        } else if (confirm(confirmText)) {
          if (this.postId) {
            if (this.isApproval) {
              await this.saveApprovalPost("update", this.approval);
            } else {
              await this.saveBoardPost("update");
            }
          } else if (this.isApproval) {
            await this.saveApprovalPost("create", this.approval);
          } else {
            await this.saveBoardPost("create");
          }
          document.querySelectorAll(".con-vs-popup").forEach((el) => {
            el.style.display = "none";
          })
          next(true);
        } else {
          document.querySelectorAll(".con-vs-popup").forEach((el) => {
            el.style.display = "none";
          })
          next(true);
        }
      });
      this.$once("hook:destroyed", () => {
        backButtonRouteGuard();
      });
    },
    initTab() {
      if (this.boardId === 53 || this.boardId === 54 || this.boardId === 55) {
        this.addTab(53);
        this.addTab(54);
        this.addTab(55);
        if (this.boardId === 53) this.tabIndex = 0;
        else if (this.boardId === 54) this.tabIndex = 1;
        else if (this.boardId === 55) this.tabIndex = 2;
      } else if (this.boardId === 58 || this.boardId === 59 || this.boardId === 60) {
        this.addTab(58);
        this.addTab(59);
        this.addTab(60);
        if (this.boardId === 58) this.tabIndex = 0;
        else if (this.boardId === 59) this.tabIndex = 1;
        else if (this.boardId === 60) this.tabIndex = 2;
      } else if (this.boardId === 62 || this.boardId === 63) {
        this.addTab(62);
        this.addTab(63);
        this.addSubTab("아차사고D/B");
        if (this.boardId === 62) this.tabIndex = 0;
        else if (this.boardId === 63) this.tabIndex = 1;
      } else if (this.boardId === 64 || this.boardId === 65 || this.boardId === 66 || this.boardId === 67 || this.boardId === 68 || this.boardId === 69) {
        this.addTab(64);
        this.addTab(65);
        this.addTab(66);
        this.addTab(67);
        this.addTab(68);
        this.addTab(69);
        if (this.boardId === 64) this.tabIndex = 0;
        else if (this.boardId === 65) this.tabIndex = 1;
        else if (this.boardId === 66) this.tabIndex = 2;
        else if (this.boardId === 67) this.tabIndex = 3;
        else if (this.boardId === 68) this.tabIndex = 4;
        else if (this.boardId === 69) this.tabIndex = 5;
      } else if (this.boardId === 71 || this.boardId === 72 || this.boardId === 73 || this.boardId === 74 || this.boardId === 75) {
        this.addTab(74);
        this.addTab(75);
        this.addTab(71);
        this.addTab(72);
        this.addTab(73);
        if (this.boardId === 74) this.tabIndex = 0;
        else if (this.boardId === 75) this.tabIndex = 1;
        else if (this.boardId === 71) this.tabIndex = 2;
        else if (this.boardId === 72) this.tabIndex = 3;
        else if (this.boardId === 73) this.tabIndex = 4;
      } else if (this.boardId === 76 || this.boardId === 77) {
        this.addTab(76);
        this.addTab(77);
        this.addSubTab("형태별분류");
        if (this.boardId === 76) this.tabIndex = 0;
        else if (this.boardId === 77) this.tabIndex = 1;
      } else if (this.boardId === 78 || this.boardId === 79 || this.boardId === 87) {
        this.addTab(78);
        this.addTab(79);
        this.addTab(87);
        if (this.boardId === 78) this.tabIndex = 0;
        else if (this.boardId === 79) this.tabIndex = 1;
        else if (this.boardId === 87) this.tabIndex = 2;
      } else if (this.boardId === 80 || this.boardId === 81 || this.boardId === 88) {
        this.addTab(80);
        this.addTab(81);
        this.addTab(88);
        if (this.boardId === 80) this.tabIndex = 0;
        else if (this.boardId === 81) this.tabIndex = 1;
        else if (this.boardId === 88) this.tabIndex = 2;
      } else if (this.boardId === 82 || this.boardId === 83) {
        this.addTab(82);
        this.addTab(83);
        if (this.boardId === 82) this.tabIndex = 0;
        else if (this.boardId === 83) this.tabIndex = 1;
      } else if (this.boardId === 84 || this.boardId === 85) {
        this.addTab(84);
        this.addTab(85);
        if (this.boardId === 84) this.tabIndex = 0;
        else if (this.boardId === 85) this.tabIndex = 1;
      } else if (this.boardId === 89) {
        this.addTab(89);
        this.addSubTab("조직도");
        if (this.boardId === 89) this.tabIndex = 0;
      } else if (this.boardId === 102 || this.boardId === 127 || this.boardId === 128 || this.boardId === 129 || this.boardId === 130) {
        this.addTab(102);
        this.addTab(127);
        this.addTab(128);
        this.addTab(129);
        this.addTab(130);
        if (this.boardId === 102) this.tabIndex = 0;
        if (this.boardId === 127) this.tabIndex = 1;
        if (this.boardId === 128) this.tabIndex = 2;
        if (this.boardId === 129) this.tabIndex = 3;
        if (this.boardId === 130) this.tabIndex = 4;
      } else if (this.boardId === 119 || this.boardId === 120 || this.boardId === 121 || this.boardId === 122 || this.boardId === 123 || this.boardId === 124 || this.boardId === 125) {
        this.addTab(119);
        this.addTab(120);
        this.addTab(121);
        this.addTab(122);
        this.addTab(123);
        this.addTab(124);
        this.addTab(125);
        if (this.boardId === 119) this.tabIndex = 0;
        else if (this.boardId === 120) this.tabIndex = 1;
        else if (this.boardId === 121) this.tabIndex = 2;
        else if (this.boardId === 122) this.tabIndex = 3;
        else if (this.boardId === 123) this.tabIndex = 4;
        else if (this.boardId === 124) this.tabIndex = 5;
        else if (this.boardId === 125) this.tabIndex = 6;
      } else if (this.boardId === 161 || this.boardId === 333) {
        this.addTab(161);
        this.addTab(333);
        if (this.boardId === 161) this.tabIndex = 0;
        if (this.boardId === 333) this.tabIndex = 1;
      } else if (this.boardId === 162 || this.boardId === 523 || this.boardId === 334 || this.boardId === 510) {
        if (`${this.projectId}` === "7") {
          this.addTab(523);
          this.addTab(334);
          if (this.boardId === 523) this.tabIndex = 0;
          if (this.boardId === 334) this.tabIndex = 1;
        } else {
          this.addTab(162);
          this.addTab(334);
          this.addTab(510);
          if (this.boardId === 162) this.tabIndex = 0;
          if (this.boardId === 334) this.tabIndex = 1;
          if (this.boardId === 510) this.tabIndex = 2;
        }
      } else if (this.boardId === 216 || this.boardId === 217 || this.boardId === 218) {
        this.addTab(216);
        this.addTab(217);
        this.addTab(218);
        if (this.boardId === 216) this.tabIndex = 0;
        if (this.boardId === 217) this.tabIndex = 1;
        if (this.boardId === 218) this.tabIndex = 2;
      } else if (this.boardId === 239 || this.boardId === 240 || this.boardId === 241) {
        this.addTab(239);
        this.addTab(240);
        this.addTab(241);
        if (this.boardId === 239) this.tabIndex = 0;
        if (this.boardId === 240) this.tabIndex = 1;
        if (this.boardId === 241) this.tabIndex = 2;
      } else if (this.boardId === 246 || this.boardId === 524 || this.boardId === 525 || this.boardId === 219 || this.boardId === 529) {
        if (Number(`${this.projectId}`) === 7) {
          this.addTabInLabel(529, "안전작업계획서");
          this.addTab(524);
          this.addTab(525);
          if (this.boardId === 529) this.tabIndex = 0;
          if (this.boardId === 524) this.tabIndex = 1;
          if (this.boardId === 525) this.tabIndex = 2;
        } else if (Number(`${this.projectId}`) === 4) {
          this.addTab(246);
          this.addTab(219);
          this.addTab(524);
          this.addTab(525);
          if (this.boardId === 246) this.tabIndex = 0;
          if (this.boardId === 219) this.tabIndex = 1;
          if (this.boardId === 524) this.tabIndex = 2;
          if (this.boardId === 525) this.tabIndex = 3;
        } else {
          this.addTab(246);
          this.addTab(524);
          this.addTab(525);
          this.addTab(219);
          if (this.boardId === 246) this.tabIndex = 0;
          if (this.boardId === 524) this.tabIndex = 1;
          if (this.boardId === 525) this.tabIndex = 2;
          if (this.boardId === 219) this.tabIndex = 3;
        }
      } else if (this.boardId === 253 || this.boardId === 254 || this.boardId === 255) {
        this.addTab(253);
        this.addTab(254);
        this.addTab(255);
        if (this.boardId === 253) this.tabIndex = 0;
        if (this.boardId === 254) this.tabIndex = 1;
        if (this.boardId === 255) this.tabIndex = 2;
      } else if (this.boardId === 257 || this.boardId === 220 || this.boardId === 530 || this.boardId === 526 || this.boardId === 846 || this.boardId === 847) {
        if (Number(`${this.projectId}`) === 7) {
          this.addTab(257);
          this.addTab(530);
          this.addTab(526);
          if (this.boardId === 257) this.tabIndex = 0;
          if (this.boardId === 530) this.tabIndex = 1;
          if (this.boardId === 526) this.tabIndex = 2;
        } else if (Number(`${this.projectId}`) === 4) {
          this.addTab(257);
          this.addTab(220);
          this.addTab(846);
          this.addTab(847);
          if (this.boardId === 257) this.tabIndex = 0;
          if (this.boardId === 220) this.tabIndex = 1;
          if (this.boardId === 846) this.tabIndex = 2;
          if (this.boardId === 847) this.tabIndex = 3;
        } else {
          this.addTab(257);
          this.addTab(220);
          this.addTab(530);
          if (this.boardId === 257) this.tabIndex = 0;
          if (this.boardId === 220) this.tabIndex = 1;
          if (this.boardId === 530) this.tabIndex = 2;
        }
      } else if (this.boardId === 285 || this.boardId === 282 || this.boardId === 491) {
        if (Number(`${this.projectId}`) === 7) {
          this.addTab(285);
          this.addTab(282);
          if (this.boardId === 285) this.tabIndex = 0;
          if (this.boardId === 282) this.tabIndex = 1;
        } else {
          this.addTab(285);
          this.addTab(282);
          this.addTab(491);
          if (this.boardId === 285) this.tabIndex = 0;
          if (this.boardId === 282) this.tabIndex = 1;
          if (this.boardId === 491) this.tabIndex = 2;
        }
      } else if (this.boardId === 294 || this.boardId === 295) {
        this.addTab(294);
        this.addTab(295);
        if (this.boardId === 294) this.tabIndex = 0;
        if (this.boardId === 295) this.tabIndex = 1;
      } else if (this.boardId === 299 || this.boardId === 358 || this.boardId === 456) {
        if (Number(`${this.projectId}`) === 1) {
          this.addTabInLabel(358, "내부종사자");
          this.addTabInLabel(299, "도급·용역·위탁");
          this.addTabInLabel(456, "발주사업");
          if (this.boardId === 358) this.tabIndex = 0;
          if (this.boardId === 299) this.tabIndex = 1;
          if (this.boardId === 456) this.tabIndex = 2;
        } else {
          this.addTab(this.boardId);
        }
      } else if (this.boardId === 326 || this.boardId === 327 || this.boardId === 328) {
        this.addTab(326);
        this.addTab(327);
        this.addTab(328);
        if (this.boardId === 326) this.tabIndex = 0;
        if (this.boardId === 327) this.tabIndex = 1;
        if (this.boardId === 328) this.tabIndex = 2;
      } /*else if ( this.boardId === 250 || this.boardId === 329 ) {
        this.addTab(250);
        this.addTab(329);
        if (this.boardId === 250) this.tabIndex = 0;
        if (this.boardId === 329) this.tabIndex = 1;
      }*/ else if (this.boardId === 256 || this.boardId === 522 || this.boardId === 332 || this.boardId === 509) {
        if (`${this.projectId}` === "7") {
          this.addTab(522);
          this.addTab(332);
          if (this.boardId === 522) this.tabIndex = 0;
          if (this.boardId === 332) this.tabIndex = 1;
        } else {
          this.addTab(256);
          this.addTab(332);
          this.addTab(509);
          if (this.boardId === 256) this.tabIndex = 0;
          if (this.boardId === 332) this.tabIndex = 1;
          if (this.boardId === 509) this.tabIndex = 2;
        }
      } else if (this.boardId === 259 || this.boardId === 330) {
        this.addTab(259);
        this.addTab(330);
        if (this.boardId === 259) this.tabIndex = 0;
        if (this.boardId === 330) this.tabIndex = 1;
      } else if (this.$route.params.boardId === "관리책임자_안전보건_경영방침" || this.boardId === 284) {
        this.addSubTab("관리책임자_안전보건_경영방침");
        this.addTab(284);
        if (this.$route.params.boardId === "관리책임자_안전보건_경영방침") this.tabIndex = 0;
        if (this.boardId === 284) this.tabIndex = 1;
      } else {
        this.addTab(this.boardId);
      }

      for (const tab of this.tabList) {
        if (`${tab.boardId}` === `${this.boardId}`) {
          this.isApproval = tab.isApproval;
        }
      }
    },
    addTab(_boardId) {
      const slug = `board-${_boardId}`;
      const component = singlePageWrite[`${_boardId}_write`];
      const boardId = `${_boardId}`;
      const item = this.tabItems[boardId];
      if (item) {
        this.tabList.push({ boardId, slug, component, ...item });
      }
    },
    addTabInLabel(_boardId, label) {
      const slug = `board-${_boardId}`;
      const component = singlePageWrite[`${_boardId}_write`];
      const boardId = `${_boardId}`;
      const item = this.tabItems[boardId];
      if (item) {
        this.tabList.push({ boardId, slug, component, ...item });
        this.tabList[this.tabList.length - 1].label = label;
      }
    },
    addSubTab(key) {
      if (key === "아차사고D/B") this.tabList.push({
        key: "아차사고D/B",
        label: "아차사고 D/B",
        component: "exception01",
        exception: true,
      });
      if (key === "형태별분류") this.tabList.push({
        key: "형태별분류",
        label: "형태별 분류",
        component: "exception02",
        exception: true,
      });
      if (key === "조직도") this.tabList.push({
        key: "조직도",
        label: "조직도",
        component: "exception03",
        exception: true,
      });
      if (key === "관리책임자_안전보건_경영방침") this.tabList.push({ key: "관리책임자_안전보건_경영방침", label: "관리책임자 안전보건 경영방침", component: "exception04", exception: true });
    },
    moveTab(boardId, key) {
      if (boardId) {
        if (this.projectId) {
          this.$router.push({ name: "list|tab", params: { boardId } });
        } else {
          this.$router.push({ name: "root|list|tab", params: { boardId } });
        }
      }
      if (key) {
        if (key === "아차사고D/B") {
          const breadcrumb = [{ title: "아차사고" }, { title: "아차사고관리" }, { title: "아차사고 D/B" }];
          if (breadcrumb.length > 0) breadcrumb[breadcrumb.length - 1].active = true;
          this.$store.commit("menu/UPDATE_PAGE_LIST", breadcrumb);
        } else if (key === "관리책임자_안전보건_경영방침") {
          this.$router.push({ name: "list|tab", params: { boardId: "관리책임자_안전보건_경영방침" } });
        }
      }
    },

    // ===== API =====
    async loadBoardPost() {
      const boardId = this.boardId;
      const postId = this.$route.params.postId;
      await this.$store.dispatch("board/LOAD_POST", {
        boardId,
        postId,
      });

      // 내용
      const post = this.$store.state.board.postInfo;
      this.docProjectId = post.project_id;
      if (post.post_content) {
        this.form = JSON.parse(post.post_content);
        if (!this.form.body["fileList"]) {
          this.form.body.fileList = [];
        }
        if (!this.form.body["formList"]) {
          this.form.body.formList = [];
        }
      }
      this.form.body.createdAt = post.created_at;
      this.oldForm = JSON.parse(JSON.stringify(this.form));
    },
    async saveBoardPost(type) {
      const normalDocument = this.$refs.normalDocument;
      if (normalDocument.validate) {
        const validated = normalDocument.validate();
        if (validated) {
          this.errorAlert(validated);
          return;
        }
      }

      const form = this.form;
      form.header.full = `${form.header.year}-${form.header.month}-01`;
      form.summary = this.form.body.summary;

      // 작성자 이름이 비어있는지 확인한다
      if (!form.body.stdInfo.writer_name) {
        this.errorAlert("작성자 이름을 입력해주세요.");
        return;
      }

      const projectId = this.projectId;
      const boardId = this.boardId;
      const title = this.form.body.title;
      const content = JSON.stringify(form);

      try {
        if (type === "create") {
          await this.$store.dispatch("board/CREATE_POST", {
            projectId,
            boardId,
            title,
            content,
          });
        } else if (type === "update") {
          const postId = this.postId;
          await this.$store.dispatch("board/UPDATE_POST", {
            projectId,
            boardId,
            postId,
            title,
            content,
          });
        }
      } catch (e) {
        this.loading(false);
        return;
      }
      this.oldForm = JSON.parse(JSON.stringify(this.form));

      this.onMoveNormalPage("list");
    },
    loadApprovalPostContent(form) {
      const body = form.body;
      if (this.boardId === 126) {
        let i = 0;
        if (body.group1 && body.group1.length > 0) {
          for (i = 0; i < body.group1.length; i++) {
            const data = body.group1[i];
            data.name = form.enc.group1[i].name;
            data.phone = form.enc.group1[i].phone;
          }
        }

        i = 0;
        if (body.group2 && body.group2.length > 0) {
          for (i = 0; i < body.group2.length; i++) {
            const data = body.group2[i];
            data.name = form.enc.group2[i].name;
            data.phone = form.enc.group2[i].phone;
          }
        }
      } else if (this.boardId === 136) {
        let i = 0;
        if (body.group1 && body.group1.length > 0) {
          for (i = 0; i < body.group1.length; i++) {
            const data = body.group1[i];
            data.name = form.enc.group1[i].name;
            data.phone = form.enc.group1[i].phone;
          }
        }

        i = 0;
        if (body.group2 && body.group2.length > 0) {
          for (i = 0; i < body.group2.length; i++) {
            const data = body.group2[i];
            data.name = form.enc.group2[i].name;
            data.phone = form.enc.group2[i].phone;
          }
        }
      } else if (this.boardId === 138) {
        let i = 0;
        if (body.group1 && body.group1.length > 0) {
          for (i = 0; i < body.group1.length; i++) {
            const data = body.group1[i];
            data.name = form.enc.group1[i].name;
            data.phone = form.enc.group1[i].phone;
          }
        }

        i = 0;
        if (body.group2 && body.group2.length > 0) {
          for (i = 0; i < body.group2.length; i++) {
            const data = body.group2[i];
            data.name = form.enc.group2[i].name;
            data.phone = form.enc.group2[i].phone;
          }
        }
      } else if (this.boardId === 141) {
        let i = 0;
        if (body.group1 && body.group1.length > 0) {
          for (i = 0; i < body.group1.length; i++) {
            const data = body.group1[i];
            data.name = form.enc.group1[i].name;
            data.phone = form.enc.group1[i].phone;
          }
        }
      }
      return form;
    },
    async loadApprovalPost() {
      const boardSlug = this.boardSlug;
      const postId = this.$route.params.postId;
      let post = {};
      await this.$store.dispatch("approval/LOAD_POST", { boardSlug, postId }).then((value) => {
        post = value.post;
        this.docProjectId = post.id;
        return value;
      });

      if (!this.$store.state.approval.postInfo) {
        alert("열람 권한이 없습니다.");
        this.oldForm = JSON.parse(JSON.stringify(this.form));
        this.onMoveNormalPage("list");
        return;
      }
      // 내용
      if (post.post_content) {
        let form = JSON.parse(post.post_content);

        if (!form.body["fileList"]) {
          form.body.fileList = [];
        }
        if (!form.body["formList"]) {
          form.body.formList = [];
        }

        // enc 내용을 본문에 추가하기
        form = this.loadApprovalPostContent(form);
        this.form = form;
      }

      // TODO : 결재프로세스
      const doc = this.$store.state.approval.document;
      this.docInfo = doc;
      this.docInfo.slug = this.boardSlug;
    },
    async saveApprovalPost(type, approvalLine) {
      let form = this.form;
      form.header.full = `${form.header.year}-${form.header.month}-01`;
      form.summary = this.form.body.summary;
      form = this.saveApprovalPostContent(form);

      const projectId = this.projectId;
      const boardSlug = this.boardSlug;
      const title = this.form.body.title;
      const content = JSON.stringify(form);

      if (type === "create") {
        await this.$store.dispatch("approval/CREATE_POST", {
          isTemp: 1,
          boardSlug,
          projectId,
          title,
          content,
          approvalLine,
          security: "normal",
          priority: "medium",
        });
        alert("임시저장 되었습니다");
      } else if (type === "update") {
        const postId = this.postId;
        await this.$store.dispatch("approval/UPDATE_POST", {
          postId,
          unTemp: "n",
          boardSlug,
          projectId,
          title,
          content,
          approvalLine,
          security: "normal",
          priority: "medium",
        });
        alert("임시저장 되었습니다");
      } else if (type === "create_upload") {
        await this.$store.dispatch("approval/CREATE_POST", {
          boardSlug,
          projectId,
          title,
          content,
          approvalLine,
          security: "normal",
          priority: "medium",
        });
        alert("상신 되었습니다");
      } else if (type === "upload") {
        const postId = this.postId;
        await this.$store.dispatch("approval/UPDATE_POST", {
          postId,
          unTemp: "y",
          boardSlug,
          projectId,
          title,
          content,
          approvalLine,
          security: "normal",
          priority: "medium",
        });
        alert("상신 되었습니다");
      }
      this.oldForm = JSON.parse(JSON.stringify(this.form));
    },
    saveApprovalPostContent(form) {
      const body = form.body;

      // 86
      if (this.boardId === 86) {
        let i = 0;
        if (body.inputB) {
          for (i = 0; i < body.inputB.length; i++) {
            const data = body.inputB[i];
            data.value1 = this.removeComma(data.value1);
            data.value2 = this.removeComma(data.value2);
            data.value3 = this.removeComma(data.value3);
          }
        }
        if (body.inputC) {
          for (i = 0; i < body.inputC.length; i++) {
            const data = body.inputC[i];
            data.value1 = this.removeComma(data.value1);
            data.value2 = this.removeComma(data.value2);
            data.value3 = this.removeComma(data.value3);
          }
        }
      }

      // 106
      else if (this.boardId === 106) {
        let i = 0;
        if (body.inputB) {
          for (i = 0; i < body.inputB.length; i++) {
            const data = body.inputB[i];
            data.value1 = this.removeComma(data.value1);
            data.value2 = this.removeComma(data.value2);
            data.value3 = this.removeComma(data.value3);
          }
        }
      }

      // 126
      else if (this.boardId === 126) {
        form = this.saveApprovalPostContent126(form);
      }

      // 136
      else if (this.boardId === 136) {
        form = this.saveApprovalPostContent136(form);
      }

      // 138
      else if (this.boardId === 138) {
        form = this.saveApprovalPostContent138(form);
      }

      // 141
      else if (this.boardId === 141) {
        form = this.saveApprovalPostContent141(form);
      }

      // 154
      else if (this.boardId === 154) {
        let i = 0;
        if (body.inputB) {
          for (i = 0; i < body.inputB.length; i++) {
            const data = body.inputB[i];
            data.value1 = this.removeComma(data.value1);
            data.value2 = this.removeComma(data.value2);
            data.value3 = this.removeComma(data.value3);
          }
        }
        if (body.inputC) {
          for (i = 0; i < body.inputC.length; i++) {
            const data = body.inputC[i];
            data.value1 = this.removeComma(data.value1);
            data.value2 = this.removeComma(data.value2);
            data.value3 = this.removeComma(data.value3);
          }
        }
      }

      // 155
      else if (this.boardId === 155) {
        let i = 0;
        if (body.inputB) {
          for (i = 0; i < body.inputB.length; i++) {
            const data = body.inputB[i];
            data.value1 = this.removeComma(data.value1);
            data.value2 = this.removeComma(data.value2);
            data.value3 = this.removeComma(data.value3);
          }
        }
      }

      // 250
      else if (this.boardId === 250) {
        let i = 0;
        if (body.inputB) {
          for (i = 0; i < body.inputB.length; i++) {
            const data = body.inputB[i];
            data.value1 = this.removeComma(data.value1);
            data.value2 = this.removeComma(data.value2);
            data.value3 = this.removeComma(data.value3);
          }
        }
      }

      return form;
    },

    saveApprovalPostContent126(form) {
      const body = form.body;
      // 암호화
      form.enc = {
        group1: [],
        group2: [],
      };
      if (body.group1) {
        for (const data of body.group1) {
          form.enc.group1.push({
            name: data.name,
            phone: data.phone,
          });
        }
      }
      if (body.group2) {
        for (const data of body.group2) {
          form.enc.group2.push({
            name: data.name,
            phone: data.phone,
          });
        }
      }

      // enc 에 사용하는 내용을 본문에서 제거
      let i = 0;
      if (body.group1 && body.group1.length > 0) {
        for (i = 0; i < body.group1.length; i++) {
          const data = body.group1[i];
          data.name = "";
          data.phone = "";
        }
      }

      i = 0;
      if (body.group2 && body.group2.length > 0) {
        for (i = 0; i < body.group2.length; i++) {
          const data = body.group2[i];
          data.name = "";
          data.phone = "";
        }
      }
      form.body = body;
      return form;
    },
    saveApprovalPostContent136(form) {
      const body = form.body;
      // 암호화
      form.enc = {
        group1: [],
        group2: [],
      };
      if (body.group1) {
        for (const data of body.group1) {
          form.enc.group1.push({
            name: data.name,
            phone: data.phone,
          });
        }
      }
      if (body.group2) {
        for (const data of body.group2) {
          form.enc.group2.push({
            name: data.name,
            phone: data.phone,
          });
        }
      }

      // enc 에 사용하는 내용을 본문에서 제거
      let i = 0;
      if (body.group1 && body.group1.length > 0) {
        for (i = 0; i < body.group1.length; i++) {
          const data = body.group1[i];
          data.name = "";
          data.phone = "";
        }
      }

      i = 0;
      if (body.group2 && body.group2.length > 0) {
        for (i = 0; i < body.group2.length; i++) {
          const data = body.group2[i];
          data.name = "";
          data.phone = "";
        }
      }
      form.body = body;
      return form;
    },
    saveApprovalPostContent138(form) {
      const body = form.body;
      // 암호화
      form.enc = {
        group1: [],
        group2: [],
      };
      if (body.group1) {
        for (const data of body.group1) {
          form.enc.group1.push({
            name: data.name,
            phone: data.phone,
          });
        }
      }
      if (body.group2) {
        for (const data of body.group2) {
          form.enc.group2.push({
            name: data.name,
            phone: data.phone,
          });
        }
      }

      // enc 에 사용하는 내용을 본문에서 제거
      let i = 0;
      if (body.group1 && body.group1.length > 0) {
        for (i = 0; i < body.group1.length; i++) {
          const data = body.group1[i];
          data.name = "";
          data.phone = "";
        }
      }

      i = 0;
      if (body.group2 && body.group2.length > 0) {
        for (i = 0; i < body.group2.length; i++) {
          const data = body.group2[i];
          data.name = "";
          data.phone = "";
        }
      }
      form.body = body;
      return form;
    },
    saveApprovalPostContent141(form) {
      const body = form.body;
      // 암호화
      form.enc = {
        group1: [],
      };
      if (body.group1) {
        for (const data of body.group1) {
          form.enc.group1.push({
            name: data.name,
            phone: data.phone,
          });
        }
      }

      // enc 에 사용하는 내용을 본문에서 제거
      let i = 0;
      if (body.group1 && body.group1.length > 0) {
        for (i = 0; i < body.group1.length; i++) {
          const data = body.group1[i];
          data.name = "";
          data.phone = "";
        }
      }
      form.body = body;
      return form;
    },

    removeComma(str) {
      if (str) {
        const noneComma = `${str}`.replaceAll(",", "");
        return `${Number(noneComma)}`;
      }
      return "0";
    },

    onClickApprovalClose() {
      // 닫기
      this.onMoveNormalPage("list");
    },

    //
    // ===== Approval Doc Method =====
    //
    async onClickApprovalSave(approvalLine) {
      if (this.postId) {
        await this.saveApprovalPost("update", approvalLine);
        this.onMoveNormalPage("list");
      } else {
        await this.saveApprovalPost("create", approvalLine);
        this.onMoveNormalPage("list");
      }
    },
    async onClickApprovalUpload(approvalLine) {
      // 상신
      if (this.postId) {
        await this.saveApprovalPost("upload", approvalLine);
        this.onMoveNormalPage("list");
      } else {
        await this.saveApprovalPost("create_upload", approvalLine);
        this.onMoveNormalPage("list");
      }
    },
    async onClickApprovalRecall(approvalLine) {
      // 결재문서 회수
      if (confirm("회수 후 임시저장 상태로 변경하시겠습니까?")) {
        await this.saveApprovalPost("update", approvalLine);
        this.onMoveNormalPage("list");
      }
    },
    async onClickApprovalDelete() {
      // 삭제
      if (confirm("삭제하시겠습니까?")) {
        const boardSlug = this.boardSlug;
        const postId = this.$route.params.postId;
        await this.$store.dispatch("approval/DELETE_POST", {
          boardSlug,
          postId,
        });
        this.oldForm = JSON.parse(JSON.stringify(this.form));
        this.onClickApprovalClose();
      }
    },
    onClickApprovalPrint() {
      // 프린트
      this.isPrint = true;

      setTimeout(() => {
        const g_oBeforeBody = document.getElementById("print-report").innerHTML;
        const g_oBeforeApproval = document.getElementById("print-approval").innerHTML;
        // 프린트를 보이는 그대로 나오기위한 셋팅
        window.onbeforeprint = function () {
          document.body.style.backgroundColor = "#fff";
          document.body.innerHTML = `${g_oBeforeBody}<br>${g_oBeforeApproval}`;
        };
        window.print();
        location.reload();
      }, 300);
    },
    async onClickApprovalOk() {
      // 승인
      const postId = this.$route.params.postId;
      await this.$store.dispatch("approval/APPROVE_OK", { postId });
      this.oldForm = JSON.parse(JSON.stringify(this.form));
      this.onClickApprovalClose();
    },
    async onClickApprovalNo(text) {
      // 반려
      const postId = parseInt(this.$route.params.postId);
      const comment = text;
      await this.$store.dispatch("approval/APPROVE_NO", { postId, comment });
      this.oldForm = JSON.parse(JSON.stringify(this.form));
      this.onClickApprovalClose();
    },
    async onClickReTempsave(approvalLine) {
      if (confirm("재상신을 할 경우,\n기존 문서는 유지 되고, 내용이 복사되어 임시저장됩니다.\n재상신 하시겠습니까?")) {
        await this.saveApprovalPost("create", approvalLine);
        this.onMoveNormalPage("list");
      }
    },
    onClickPrevPost() {
      this.showLoadPrevBoardPopup = true;
    },
    updatePrevForm(data) {
      if (this.boardId === 261) {
        delete data.headerDate;
        delete data.stdInfo;
        delete data.fieldInfo;

        delete data.hideBudgetDay1;
        delete data.hideBudgetDay2;
        delete data.budgetDay1Total;
        delete data.budgetDay2Total;

        const budgetDay1 = data.budgetDay1.map((_day) => {
          return { ..._day, readonly: false, yesterday: 0, total: 0 };
        });
        const budgetDay2 = data.budgetDay2.map((_day) => {
          return { ..._day, readonly: false, yesterday: 0, total: 0 };
        });

        this.form.body = { ...this.form.body, ...data, budgetDay1, budgetDay2 };

        const setBudgetDayOldData = new CustomEvent("setBudgetDayOldData");
        window.dispatchEvent(setBudgetDayOldData);
      } else {
        this.form.body = data;
      }
    },

    //
    // ===== Normal Doc Method =====
    //
    async onClickNormalSave() {
      this.loading(true);
      if (this.postId) {
        await this.saveBoardPost("update");
      } else {
        await this.saveBoardPost("create");
      }
      this.loading(false);
    },
    async onClickNormalRemove() {
      this.oldForm = JSON.parse(JSON.stringify(this.form));
      const boardId = this.boardId;
      const postId = this.postId;
      await this.$store.dispatch("board/DELETE_POST", { boardId, postId });
      this.oldForm = JSON.parse(JSON.stringify(this.form));
      this.onMoveNormalPage("list");
    },
    onMoveNormalPage(type) {
      const proj_id = `${this.projectId}`;
      const boardId = `${this.boardId}`;
      const query = this.$route.query;

      if (type === "list") {
        this.$router.push({ name: "list|tab", params: { proj_id, boardId }, query });
      }
    },
    saveButtonControl(value) {
      if (this.$refs.refNormalDocument) {
        this.$refs.refNormalDocument.saveButtonControl(value);
      }
    },
    handleEnableSave(enableSave) {
      this.enableSave = enableSave;
    },
    updateBoard(board, approval) {
      this.board = board;
      this.approval = approval;
    },
    errorAlert(message) {
      const customAlert = new CustomEvent("customAlert", {
        detail: {
          title: "오류가 발생했습니다",
          message,
        },
      });
      window.dispatchEvent(customAlert);
    },
    loading(open) {
      const loadingDialog = new CustomEvent("loadingDialog", {
        detail: {
          open,
        },
      });
      window.dispatchEvent(loadingDialog);
    },
  },
};
</script>

<style scoped></style>
