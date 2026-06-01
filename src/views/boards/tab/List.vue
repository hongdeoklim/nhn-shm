<template>
  <div>
    <vs-tabs v-if="1 < tabList.length || showOneTab" :value="tabIndex">
      <vs-tab v-for="tab in tabList" :key="`tab_${tab.label}`" :label="tab.label" @click="moveTab(tab.boardId, tab.key)"></vs-tab>
    </vs-tabs>
    <div>
      <component v-if="tab.exception" :is="tab.component" />
      <component v-else-if="tab.listType" :is="tab.listType" />
      <table-list-page
        v-else-if="tab.isApproval"
        :board-id="tab.boardId"
        :board-slug="tab.slug"
        route-c="write|tab"
        route-u="write|update|tab"
        :download="tab.label"
        :create="useCreate"
        :approval="true"
        :move-project="!(projectId > 0)"
        :by-current-location="tab.byCurrentLocation"
        :nav="nav"
        :heads="heads"
        :getCol="getCol"
        :query-search-mode="true"
        @load="onLoadData"
        :multi-print="false"
        @clickMultiPrint="onClickMultiPrint"
      >
        <template #search>
          <component :is="searchComponent" :value="nav.value" @input="onChangeSearch" />
        </template>
      </table-list-page>
      <table-list-page
        v-else
        :board-id="tab.boardId"
        route-c="write|tab"
        route-u="write|update|tab"
        :download="tab.label"
        :create="useCreate"
        :approval="false"
        :move-project="!(projectId > 0)"
        :by-current-location="tab.byCurrentLocation"
        :nav="nav"
        :heads="heads"
        :getCol="getCol"
        :query-search-mode="true"
        :multi-print="true"
        @clickMultiPrint="onClickMultiPrint"
      >
        <template #search>
          <component :is="searchComponent" :value="nav.value" @input="onChangeSearch" />
        </template>
      </table-list-page>
    </div>

    <!-- multiPrintPopup -->
    <popup-multi-print-viewer
      v-model="popup.multiPrintViewer"
      :boardId="tab.boardId"
      :isApproval="tab.isApproval"
      :searchComponent="searchComponent"
      :nav="nav"
      :method="{
        getContent: this.getContent,
        getCreatedDate: this.getCreatedDate,
        getCompanyName: this.getCompanyName,
        getContentTargetList: this.getContentTargetList,
        onNameBlur: this.onNameBlur,
        getContentRiskList: this.getContentRiskList,
        getContentStringList: this.getContentStringList,
        comma: this.comma,
        comNumber: this.comNumber,
      }"
    ></popup-multi-print-viewer>
  </div>
</template>

<script>
import breadcrumb from "@/views/boards/tab/breadcrumb";
import tabItems from "@/views/boards/tab/tab-items";
import TableListPage from "@/views/list/TableListPage";
import SearchNavYearMonth from "@/components/nav/SearchNavYearMonth.vue";
import SearchNavItemProject from "@/components/nav/SearchNavItemProject";
import Exception01 from "@/views/boards/exception/Exception01";
import Exception02 from "@/views/boards/exception/Exception02";
import Exception03 from "@/views/boards/exception/Exception03";
import Exception04 from "@/views/boards/exception/Exception04";
import Exception05 from "@/views/boards/exception/Exception05";
import moment from "moment";

import normalSearchNav from "@/views/boards/components";
import singlePageList from "@/views/boards/single-page/listIndex";
import PopupMultiPrintViewer from "@/popup/PopupMultiPrintViewer";

export default {
  name: "List",
  components: {
    PopupMultiPrintViewer,
    SearchNavItemProject,
    SearchNavYearMonth,
    TableListPage,
    Exception01,
    Exception02,
    Exception03,
    Exception04,
    Exception05,
    List137: () => import("@/views/boards/single-page/137/List137"),
  },
  data() {
    return {
      breadcrumb,
      tabItems,
      tabIndex: 0,
      tabList: [],
      nav: {
        projectId: 0,
        dateTarget: "created_at",
        orderTarget: "created_at",
        orderDirection: "desc",
        date: { year: new Date().getFullYear(), month: "" },
        value: {},
        page: {},
        keyword: [],
      },
      popup: {
        multiPrintViewer: false,
      },
      create: true,
      companyList: [],
    };
  },
  computed: {
    useCreate() {
      return this.projectId > 0 && this.create;
    },
    myInfo() {
      return this.$store.state.auth.userInfo;
    },
    boardId() {
      return parseInt(this.$route.params.boardId);
    },
    projectId() {
      return this.$route.params.proj_id;
    },
    searchComponent() {
      return normalSearchNav[`NormalSearchNav${this.boardId}`];
    },
    heads() {
      if (singlePageList[`${this.boardId}_list`]) {
        const heads = singlePageList[`${this.boardId}_list`].getHead(this.projectId);

        // table-list-page 에서 sort-key 로 사용하기 위해 keyName 을 추가해준다.
        if (heads.length > 0) {
          for (const head of heads) {
            head.keyName = head.name;
          }
        }

        return heads;
      }

      return [];
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
  beforeMount() {
    this.nav.projectId = this.projectId;
    this.initBreadcrumb();
    this.initBackButtonRouteGuard();
    this.initTab();
  },
  async mounted() {
    await this.loadCompanyList();
  },
  methods: {
    initBackButtonRouteGuard() {
      const backButtonRouteGuard = this.$router.beforeEach((to, from, next) => {
        document.querySelectorAll(".con-vs-popup").forEach((el) => {
          el.style.display = "none";
        });
        next(true);
      });
      this.$once("hook:destroyed", () => {
        backButtonRouteGuard();
      });
    },
    async loadCompanyList() {
      const projectId = this.projectId;

      if (this.tab && this.tab.useListGetCompanyName) {
        const page = 1;
        const perPage = 10000;
        await this.$store.dispatch("company/LOAD_COMPANY_LIST", {
          page,
          perPage,
          projectId,
        });
        this.companyList = this.$store.state.company.companyList;
      }

      await this.$store.dispatch("company/LOAD_COMPANY_TREE", { projectId });
    },
    getCompanyName(comId) {
      for (const com of this.companyList) {
        if (com.id === comId) {
          return com.com_name;
        }
      }
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
      } else if (this.boardId === 161 || this.boardId === 333 || this.boardId === 1050) {
        if (`${this.projectId}` === "4") {
          this.addTab(1050);
          this.addTab(161);
          this.addTab(333);
          if (this.boardId === 1050) this.tabIndex = 0;
          if (this.boardId === 161) this.tabIndex = 1;
          if (this.boardId === 333) this.tabIndex = 2;
        } else {
          this.addTab(161);
          this.addTab(333);
          if (this.boardId === 161) this.tabIndex = 0;
          if (this.boardId === 333) this.tabIndex = 1;
        }
      } else if (this.boardId === 162 || this.boardId === 523 || this.boardId === 334 || this.boardId === 510 || this.boardId === 1051) {
        if (`${this.projectId}` === "4") {
          this.addTab(1051);
          this.addTab(162);
          this.addTab(334);
          if (this.boardId === 1051) this.tabIndex = 0;
          if (this.boardId === 162) this.tabIndex = 1;
          if (this.boardId === 334) this.tabIndex = 2;
        } else if (`${this.projectId}` === "7") {
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
      } else if (this.boardId === 256 || this.boardId === 522 || this.boardId === 332 || this.boardId === 509 || this.boardId === 1049) {
        if (`${this.projectId}` === "4") {
          this.addTab(1049);
          this.addTab(256);
          this.addTab(332);
          if (this.boardId === 1049) this.tabIndex = 0;
          if (this.boardId === 256) this.tabIndex = 1;
          if (this.boardId === 332) this.tabIndex = 2;
        } else if (`${this.projectId}` === "7") {
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
      } /*else if (this.boardId === 250 || this.boardId === 329) {
        this.addTab(250)
        this.addTab(329)
        if (this.boardId === 250) this.tabIndex = 0
        if (this.boardId === 329) this.tabIndex = 1
      }*/ else if (this.boardId === 259 || this.boardId === 330) {
        this.addTab(259);
        this.addTab(330);
        if (this.boardId === 259) this.tabIndex = 0;
        if (this.boardId === 330) this.tabIndex = 1;
      } else if (this.$route.params.boardId === "본사_안전보건_경영방침" || this.$route.params.boardId === "관리책임자_안전보건_경영방침" || this.boardId === 284) {
        this.addSubTab("본사_안전보건_경영방침");
        //this.addSubTab('관리책임자_안전보건_경영방침')
        this.addTab(284);
        if (this.$route.params.boardId === "본사_안전보건_경영방침") this.tabIndex = 0;
        //if (this.$route.params.boardId === '관리책임자_안전보건_경영방침') this.tabIndex = 1
        if (this.boardId === 284) this.tabIndex = 1;
      } else if (this.myInfo.can_risk_assessment_bulk_register && (this.boardId === 450 || this.$route.params.boardId === "riskassessment450")) {
        this.addTab(450);
        this.addSubTab("riskassessment450");
        if (this.boardId === 450) this.tabIndex = 0;
        if (this.$route.params.boardId === "riskassessment450") this.tabIndex = 1;
      } else if (this.myInfo.can_risk_assessment_bulk_register && (this.boardId === 460 || this.$route.params.boardId === "riskassessment460")) {
        this.addTab(460);
        this.addSubTab("riskassessment460");
        if (this.boardId === 460) this.tabIndex = 0;
        if (this.$route.params.boardId === "riskassessment460") this.tabIndex = 1;
      } else {
        this.addTab(this.boardId);
      }
      // 2022.12.16
      // https://app.clickup.com/t/3eh97nz
      // else if (this.boardId === 108 || this.boardId === 156 || this.boardId === 157 || this.boardId === 158 || this.boardId === 159) {
      //   this.addTab(108)
      //   this.addTab(156)
      //   this.addTab(157)
      //   this.addTab(158)
      //   this.addTab(159)
      //   if (this.boardId === 108) this.tabIndex = 0
      //   if (this.boardId === 156) this.tabIndex = 1
      //   if (this.boardId === 157) this.tabIndex = 2
      //   if (this.boardId === 158) this.tabIndex = 3
      //   if (this.boardId === 159) this.tabIndex = 4
      //
      // }
    },
    initBreadcrumb() {
      const breadcrumb = [{ title: "Home" }];
      let key = `${this.boardId}`;

      // 브래드크럼의 이름이 프로젝트 번호와 연결되어 있으면, 해당 정보를 가져온다
      if (this.breadcrumb[`${this.projectId}.${this.boardId}`]) {
        key = `${this.projectId}.${this.boardId}`;
      }
      if (isNaN(this.boardId)) {
        breadcrumb.push(...this.breadcrumb[`${this.$route.params.boardId}`]);
      } else {
        breadcrumb.push(...this.breadcrumb[key]);
      }

      if (breadcrumb.length > 0) breadcrumb[breadcrumb.length - 1].active = true;

      this.$store.commit("menu/UPDATE_PAGE_LIST", breadcrumb);
    },
    addTab(_boardId) {
      const slug = `board-${_boardId}`;
      const component = `singlePage${_boardId}`;
      const boardId = `${_boardId}`;
      const item = this.tabItems[boardId];
      if (item) {
        this.tabList.push({ boardId, slug, component, ...item });
      }
    },
    addTabInLabel(_boardId, label) {
      const slug = `board-${_boardId}`;
      const component = `singlePage${_boardId}`;
      const boardId = `${_boardId}`;
      const item = this.tabItems[boardId];
      if (item) {
        this.tabList.push({ boardId, slug, component, ...item });
        this.tabList[this.tabList.length - 1].label = label;
      }
    },
    addSubTab(key) {
      if (key === "아차사고D/B") this.tabList.push({ key: "아차사고D/B", label: "아차사고 D/B", component: "exception01", exception: true });
      if (key === "형태별분류") this.tabList.push({ key: "형태별분류", label: "형태별 분류", component: "exception02", exception: true });
      if (key === "조직도") this.tabList.push({ key: "조직도", label: "조직도", component: "exception03", exception: true });
      if (key === "관리책임자_안전보건_경영방침") this.tabList.push({ key: "관리책임자_안전보건_경영방침", label: "관리책임자 안전보건 경영방침", component: "exception04", exception: true });
      if (key === "본사_안전보건_경영방침") this.tabList.push({ key: "본사_안전보건_경영방침", label: "본사 안전보건 경영방침", component: "exception05", exception: true });
      if (key === "riskassessment450") this.tabList.push({ key: "riskassessment450", label: "위험성평가 엑셀 업로드", exception: true });
      if (key === "riskassessment460") this.tabList.push({ key: "riskassessment460", label: "위험성평가 엑셀 업로드", exception: true });
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
        } else if (key === "본사_안전보건_경영방침") {
          this.$router.push({ name: "list|tab", params: { boardId: "본사_안전보건_경영방침" } });
        } else if (key === "관리책임자_안전보건_경영방침") {
          this.$router.push({ name: "list|tab", params: { boardId: "관리책임자_안전보건_경영방침" } });
        } else if (key === "riskassessment450") {
          this.$router.push({ name: "riskassessment450" });
        } else if (key === "riskassessment460") {
          this.$router.push({ name: "riskassessment460" });
        }
      }
    },

    getCol(index, value) {
      if (singlePageList[`${this.boardId}_list`]) {
        return singlePageList[`${this.boardId}_list`].getCol(index, value, {
          getContent: this.getContent,
          getHeader: this.getHeader,
          getCreatedDate: this.getCreatedDate,
          getCompanyName: this.getCompanyName,
          getContentTargetList: this.getContentTargetList,
          onNameBlur: this.onNameBlur,
          getContentRiskList: this.getContentRiskList,
          getContentStringList: this.getContentStringList,
          comma: this.comma,
          comNumber: this.comNumber,
        });
      }

      return "";
    },

    getContent(data) {
      if (data.post_content) {
        const content = JSON.parse(data.post_content);
        return content.body;
      }
    },
    getHeader(data) {
      if (data.post_content) {
        const content = JSON.parse(data.post_content);
        return content.header;
      }
    },
    getCreatedDate(data) {
      if (data === "") return "";
      return moment(data).format("YYYY-MM-DD");
    },
    getContentStringList(list) {
      return list.join(", ");
    },
    getContentRiskTypeList(list) {
      let result = "";
      for (const data of list) {
        if (!result.includes(data.input_1)) {
          result += `${data.input_1},`;
        }
      }
      return result.substring(0, result.length - 1);
    },
    getContentRiskList(list) {
      let result = "";
      for (const data of list) {
        if (data.input_3) {
          if (typeof data.input_3 === "string") {
            if (!result.includes(data.input_3)) {
              result += `${data.input_3},`;
            }
          }

          if (typeof data.input_3 === "object") {
            const temp = data.input_3.toString().split(",");
            for (const t of temp) {
              if (t && !result.includes(t)) {
                result += `${t},`;
              }
            }
          }
        }
      }
      return result.substring(0, result.length - 1);
    },
    getContentTargetList(list) {
      let result = "";
      for (const data of list) {
        if (!result.includes(data.target)) {
          result += `${data.target},`;
        }
      }
      return result.substring(0, result.length - 1);
    },

    onChangeSearch(value) {
      this.nav.value = value;
    },

    checkCreatable(list) {
      const nowMonth = new Date().getMonth() + 1;
      let maxMonth = 0;
      for (const data of list) {
        if (data.user.company_id === this.myInfo.company_id) {
          if (maxMonth < Number(`${this.getHeader(data).month}`)) {
            maxMonth = Number(`${this.getHeader(data).month}`);
          }
        }
      }
      return maxMonth < nowMonth;
    },

    onLoadData(list) {
      if (this.boardId === 86 || this.boardId === 106 || this.boardId === 154 || this.boardId === 155 || this.boardId === 250 || this.boardId === 329) {
        this.create = this.checkCreatable(list);
      }
    },

    comma(str) {
      return `${str}`.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    comNumber(value) {
      try {
        const regex = /[^0-9]/g;
        const result = value.replace(regex, "");
        return result.replace(/(\d{3})(\d{2})(\d{5})/, "$1-$2-$3");
      } catch (err) {}
      return value;
    },

    onNameBlur(name) {
      const length = name.length;
      if (2 < length) {
        const first = name[0];
        const last = name[name.length - 1];
        let star = "";
        for (let index = 0; index < length - 2; index++) {
          star += "*";
        }
        name = first + star + last;
      } else if (length === 2) {
        const first = name[0];
        name = `${first}*`;
      }
      return name;
    },

    onClickMultiPrint() {
      this.popup.multiPrintViewer = true;
    },
  },
};
</script>

<style scoped></style>
