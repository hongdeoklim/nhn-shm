<template>
  <vs-popup id="popupMultiPrintViewer" title="선택 후 인쇄" :active.sync="showPopup">
    <div class="popup-multi-print-viewer">
      <div class="left" v-if="showPopup">
        <table-list-page
          v-if="isApproval"
          :board-id="boardId"
          :download="false"
          :create="false"
          :approval="true"
          :move-project="false"
          :move-detail="false"
          :nav="popupNav"
          :heads="heads"
          :getCol="getCol"
          :query-search-mode="false"
          :select-list="printDatas"
          @load="onLoadData"
          @detail="onClickDetail"
          @selectAll="onSelectAll"
          @selectPrint="onClickPrint"
        >
          <template #search>
            <component :is="searchComponent" :value="popupNav.value" @input="onChangeSearch" />
          </template>
        </table-list-page>
        <table-list-page
          v-else
          :board-id="boardId"
          :download="false"
          :create="false"
          :approval="false"
          :move-project="false"
          :move-detail="false"
          :nav="popupNav"
          :heads="heads"
          :getCol="getCol"
          :query-search-mode="false"
          :select-list="printDatas"
          @load="onLoadData"
          @detail="onClickDetail"
          @selectAll="onSelectAll"
          @selectPrint="onClickPrint"
        >
          <template #search>
            <component :is="searchComponent" :value="popupNav.value" @input="onChangeSearch" />
          </template>
        </table-list-page>
      </div>
<!--      <div class="right" style="position: absolute; top: 54px; right: 34px; bottom: 18px; z-index: 10;">-->
<!--        <vx-card id="subCard" class="h-full" style="width: 250px;">-->
<!--          <div class="grid h-full" style="grid-template-rows: auto 1fr auto;">-->
<!--            <h3>선택된 문서 : {{ printDatas.length }}</h3>-->
<!--            <div class="w-full border-top border-bottom my-4 py-2 overflow-auto">-->
<!--              <draggable v-model="printDatas">-->
<!--                <div class="print-card mb-1 cursor-move" v-for="(data, i) in printDatas">-->
<!--                  <div class="handle"></div>-->
<!--                  <div style="border: 1px solid rgba(var(&#45;&#45;vs-secondary), 1);">-->
<!--                    <h4 class="p-1 grid items-center" style="border-bottom: 1px solid rgba(var(&#45;&#45;vs-secondary), 1); grid-template-columns: 140px 42px;">-->
<!--                      <span class="flex items-center" style="overflow-wrap: anywhere;">문서번호: {{data.id}}</span>-->
<!--                      <vs-button class="ml-auto py-1 px-2" color="secondary" @click="onClickDelete(i, data.id)">삭제</vs-button>-->
<!--                    </h4>-->
<!--                    <div class="print-card-body p-1">-->
<!--                      <p v-for="(head, hi) in heads">-->
<!--                        {{head.name}} : {{getCol(hi, data)}}-->
<!--                      </p>-->
<!--                    </div>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </draggable>-->
<!--            </div>-->
<!--            <vs-button color="secondary" @click="onClickPrint">모두인쇄</vs-button>-->
<!--          </div>-->
<!--        </vx-card>-->
<!--      </div>-->

      <input type="hidden" id="isPrint" value="false" />
      <input type="hidden" id="hidePrintTitle" value="false" />
      <div id="popup-print-report">
        <component
          v-for="(form, i) in printDatas"
          :is="componentWrite"
          class="print-break-page"
          :board="{
              projectTitle: '',
              writer: {}, //작성자 정보
              readonly: true, // 읽기전용인가
              isPrint: true,
              viewSaveBtn: false,
            }"
          :is-print="true"
          :value="getContent(form).body"
          :postId="form.id"
        />
      </div>
    </div>
  </vs-popup>
</template>

<script>
import draggable     from 'vuedraggable'
import SearchNav from '@/components/nav/SearchNav'
import tabItems from "@/views/boards/tab/tab-items";
import singlePageList from '@/views/boards/single-page/listIndex'
import TableListPage from '@/views/list/TableListPage'
import singlePageWrite from '@/views/boards/single-page/writeIndex'
export default {
  components: {TableListPage, SearchNav, draggable},
  props: {
    value: Boolean,
    isApproval: Boolean,
    boardId: [Number, String],
    searchComponent: Object,
    nav: Object,
    method: Object,
  },
  computed: {
    showPopup:{
      get () {
        return this.value
      },
      set (value) {
        if (!value) {
          this.printDatas = [];
        }
        this.$emit("input", value)
      }
    },

    componentWrite() {
      return singlePageWrite[`${this.boardId}_write`];
    },

    heads() {
      if (singlePageList[`${this.boardId}_list`]) {
        return singlePageList[`${this.boardId}_list`].getHead();
      }
      return [];
    },
  },
  watch: {
    nav (value) {
      this.popupNav = value
    },
    showPopup(value) {
      const body = document.querySelector('body');
      if (value) {
        body.style.overflow = 'hidden'
      } else {
        body.style.overflow = 'auto'
      }
    },
  },
  data () {
    return {
      tabItems,
      printDatas: [],
      isPrint: false,
      popupNav: {
        projectId: 0,
        orderTarget: "created_at",
        orderDirection: "desc",
        date: { year: new Date().getFullYear(), month: "" },
        value: {},
        page: {},
        keyword: [],
      },
    }
  },
  methods: {
    getCol(index, value) {
      if (singlePageList[`${this.boardId}_list`]) {
        return singlePageList[`${this.boardId}_list`].getCol(index, value, {
          getContent: this.method.getContent,
          getCreatedDate: this.method.getCreatedDate,
          getCompanyName: this.method.getCompanyName,
          getContentTargetList: this.method.getContentTargetList,
          onNameBlur: this.method.onNameBlur,
          getContentRiskList: this.method.getContentRiskList,
          getContentStringList: this.method.getContentStringList,
          comma: this.method.comma,
        });
      }
      return "";
    },
    getContent (data) {
      if (data.post_content) {
        const content = JSON.parse(data.post_content)
        return content
      }
    },


    handleClickClose() {
      this.showPopup = false
    },

    onChangeSearch (value) {
      this.popupNav.value = value;
    },

    onLoadData (data) {
    },

    async onSelectAll (list) {
      const boardId = this.boardId
      for (const data of list) {
        const postId = data.postId
        if (!postId) {
          continue
        }
        const findIndex = this.printDatas.findIndex((item) => item.id === postId)
        if (findIndex > -1) {
          continue;m
        }
        if (this.isApproval) {
          await this.loadApprovalPost(`board-${boardId}`, postId);
        } else {
          await this.loadBoardPost(boardId, postId);
        }
      }
    },
    onClickDetail (data) {
      const boardId = this.boardId
      const postId = data.postId
      const findIndex = this.printDatas.findIndex((item) => item.id === postId)
      if (findIndex > -1) {
        this.onClickDelete(findIndex, postId)
        return;
      }

      if (this.isApproval) {
        this.loadApprovalPost(`board-${boardId}`, postId);
      } else {
        this.loadBoardPost(boardId, postId);
      }
    },

    onClickDelete (id, postId) {
      this.printDatas.splice(id, 1);
    },

    async loadBoardPost(boardId, postId) {
      await this.$store.dispatch("board/LOAD_POST", {
        boardId,
        postId,
      });

      // 내용
      const post = this.$store.state.board.postInfo;
      this.docProjectId = post.project_id;

      if (post.post_content) {
        const form = JSON.parse(post.post_content);
        if (!form.body["fileList"]) {
          form.body.fileList = [];
        }
        if (!form.body["formList"]) {
          form.body.formList = [];
        }
        form.body.createdAt = post.created_at;

        this.printDatas.push(post);
      }

    },
    async loadApprovalPost(boardSlug, postId) {
      let post = {};
      await this.$store.dispatch("approval/LOAD_POST", { boardSlug, postId }).then((value) => {
        post = value.post;
        this.docProjectId = post.id;
        return value;
      });

      if (!this.$store.state.approval.postInfo) {
        alert("열람 권한이 없습니다.");
        this.oldForm = JSON.parse(JSON.stringify(this.form));
        this.onMoveNormalPage('list');
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

      this.printDatas.push(post);
    },


    onClickPrint() {
      const tab = this.tabItems[Number(`${this.boardId}`)]
      if (tab.printDirection === "portrait") {
        return this.printPortrait();
      }
      if (tab.printDirection === "landscape") {
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
        document.getElementById("popup-print-report").style.display = 'block';
        const g_oBeforeBody = document.getElementById("popup-print-report").innerHTML;
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
      });
      winPrint.addEventListener("load", function () {
        winPrint.print();
      });

      winPrint.onbeforeprint = function () {
        document.getElementById("popup-print-report").style.display = 'none';
      }
      winPrint.onafterprint = function(){
        document.getElementById("popup-print-report").style.display = 'none';
      }
      winPrint.onbeforeunload = function () {
        document.getElementById("popup-print-report").style.display = 'none';
      };
    },
  }
}
</script>
<style scoped lang="scss">
.popup-multi-print-viewer {
  display: grid;
  /* grid-template-columns: 1fr 270px; */
}
#popup-print-report,
#print-preview {
  display: none;
}
</style>
<style lang="scss">
#popupMultiPrintViewer.con-vs-popup {
  z-index: 53000;

  .vs-popup {
    width: 1300px !important;
    height: auto;

    position: relative;
  }
  .vs-popup--content {
    width: auto !important;
    padding: 1rem;
    font-size: 1rem;
  }
}

#subCard {
  .vx-card__collapsible-content.vs-con-loading__container,
  .vx-card__collapsible-content.vs-con-loading__container > .vx-card__body{
    height: 100%;
  }
}

.print-card {
  display: grid;
  grid-template-columns: 16px 1fr;

  -ms-user-select: none;
  -moz-user-select: -moz-none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  user-select: none;

  .handle {
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    background: rgba(var(--vs-secondary),1);
  }
}
.print-card-body {
  padding-left: 0.75rem;
  font-size: 0.8rem;
}
</style>
