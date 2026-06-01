<!-- =========================================================================================
    File Name: ProjectLayout.vue
    Description: Index layout
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
    Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div class="layout--index" :class="[layoutTypeClass, navbarClasses, footerClasses, { 'no-scroll': isAppPage }]">
    <v-nav-menu :navMenuItems="navMenuItems" title="Vuexy" parent=".layout--index" />

    <div id="content-area" :class="[contentAreaClass, { 'show-overlay': bodyOverlay }]">
      <div id="content-overlay" />

      <!-- Navbar -->
      <template>
        <the-navbar-vertical :navbarColor="navbarColor" :class="[{ 'text-white': isNavbarDark && !isThemeDark }, { 'text-base': !isNavbarDark && isThemeDark }]" />
      </template>
      <!-- /Navbar -->

      <div class="content-wrapper">
        <div class="router-view">
          <div class="router-content">
            <transition v-if="this.verticalNavMenuWidth === 'default'" :name="routerTransition">
              <div v-if="$route.meta.breadcrumb || $route.meta.pageTitle" class="router-header flex flex-wrap items-center mb-6">
                <div class="content-area__heading flex items-center gap-3" :class="{ 'pr-4 border-0 md:border-r border-solid border-grey-light': $route.meta.breadcrumb }" @click="backRouter">
                  <img v-if="isWritePage" src="@/assets/icons/arrow_left_black.svg" class="xl:hidden" />
                  <h2 class="mb-1">{{ routeTitle }}</h2>
                </div>

                <!-- BREADCRUMB -->
                <vx-breadcrumb v-if="$route.meta.breadcrumb" class="ml-4 md:block hidden" :route="$route" :breadcrumb="breadcrumb" :isRTL="$vs.rtl" />
              </div>

              <div v-else-if="loadBreadCrumb.length > 0" class="router-header flex flex-wrap items-center mb-6">
                <div class="content-area__heading flex items-center gap-3 pr-4 border-0 md:border-r border-solid border-grey-light" @click="backRouter">
                  <img v-if="isWritePage" src="@/assets/icons/arrow_left_black.svg" class="xl:hidden" />
                  <h2 class="mb-1">{{ loadBreadCrumbTitle }}</h2>
                </div>

                <!-- BREADCRUMB -->
                <vx-breadcrumb class="ml-4 md:block" :breadcrumb="loadBreadCrumb" />
              </div>
            </transition>

            <!-- mobile -->
            <transition v-else>
              <div class="content-area__heading pr-4 border-0 md:border-r border-solid border-grey-light">
                <h2 class="ml-4 mb-4">{{ loadBreadCrumbTitle }}</h2>
              </div>
            </transition>

            <div class="content-area__content">
              <back-to-top bottom="5%" :right="$vs.rtl ? 'calc(100% - 2.2rem - 38px)' : '30px'" visibleoffset="500" v-if="!hideScrollToTop">
                <vs-button icon-pack="feather" icon="icon-arrow-up" class="shadow-lg btn-back-to-top" />
              </back-to-top>

              <transition :name="routerTransition" mode="out-in">
                <router-view @changeRouteTitle="changeRouteTitle" @setAppClasses="(classesStr) => $emit('setAppClasses', classesStr)" />
              </transition>
            </div>
          </div>
        </div>
      </div>
      <the-footer />
    </div>
  </div>
</template>

<script>
import BackToTop from "vue-backtotop";
import navMenuItem1 from "@/layouts/sidemenu/project_1";
import navMenuItem4 from "@/layouts/sidemenu/project_4";
import navMenuItem7 from "@/layouts/sidemenu/project_7";
import TheNavbarVertical from "@/layouts/components/navbar/TheNavbarVertical.vue";
import TheFooter from "@/layouts/components/TheFooter.vue";
import themeConfig from "../../themeConfig.js";
import VNavMenu from "@/layouts/components/vertical-nav-menu/VerticalNavMenu.vue";

export default {
  components: {
    BackToTop,
    TheFooter,
    TheNavbarVertical,
    VNavMenu,
  },
  data() {
    return {
      footerType: themeConfig.footerType || "static",
      hideScrollToTop: themeConfig.hideScrollToTop,
      isNavbarDark: false,
      navbarColor: themeConfig.navbarColor || "#fff",
      navbarType: themeConfig.navbarType || "floating",
      navMenuItem: {
        1: navMenuItem1,
        4: navMenuItem4,
        7: navMenuItem7,
      },
      routerTransition: themeConfig.routerTransition || "none",
      routeTitle: this.$route.meta.pageTitle,
    };
  },
  watch: {
    $route() {
      this.routeTitle = this.$route.meta.pageTitle;
    },
    isThemeDark(val) {
      const color = this.navbarColor === "#fff" && val ? "#10163a" : "#fff";
      this.updateNavbarColor(color);
    },
    "$store.state.mainLayoutType"(val) {
      this.setNavMenuVisibility(val);
    },
  },
  computed: {
    projectId() {
      return this.$route.params.proj_id;
    },
    isWritePage() {
      return this.$route.name === "write|tab";
    },
    keyLocalStorageBoardIds() {
      const username = localStorage.getItem("login_username");
      const projectId = this.$route.params.proj_id;
      return `${username}_${projectId}_boardIds`;
    },
    navMenuItems() {
      const projectId = this.$route.params.proj_id;
      /** 메뉴 권한이 있는 메뉴 */
      const boardIds = this.boardIds ? this.boardIds : [];
      /** 모든 메뉴 */
      const urlObject = JSON.parse(JSON.stringify(this.navMenuItem[projectId]));

      // 통합 메뉴 이동 여부
      const useBackMenu = true;
      if (useBackMenu) {
      } else {
        urlObject.splice(0, 1);
      }

      // 메뉴권한 처리
      if (urlObject) {
        for (let i = 0; i < urlObject.length; i++) {
          let useMenu = this.__useMenu__(urlObject[i], boardIds);
          if (!useMenu) {
            urlObject.splice(i, 1);
            i--;
          }
        }
      }

      const path = this.$route.path;
      const pathArray = path.split("/");
      const rootPath = pathArray.length > 2 ? `${pathArray[0]}/${pathArray[1]}/${pathArray[2]}` : "";
      this.changeRootUrl(urlObject, rootPath);
      return urlObject;
    },
    breadcrumb() {
      const breadcrumb = JSON.parse(JSON.stringify(this.$route.meta.breadcrumb));
      return breadcrumb;
    },
    loadBreadCrumb() {
      if (this.$store.state.menu.pagePath) {
        return this.$store.state.menu.pagePath;
      }
      return [];
    },
    loadBreadCrumbTitle() {
      if (this.loadBreadCrumb.length > 0) {
        return this.loadBreadCrumb[this.loadBreadCrumb.length - 1].title;
      }
      return "";
    },
    bodyOverlay() {
      return this.$store.state.bodyOverlay;
    },
    contentAreaClass() {
      if (this.mainLayoutType === "vertical") {
        if (this.verticalNavMenuWidth === "default") return "content-area-reduced";
        else if (this.verticalNavMenuWidth === "reduced") return "content-area-lg";
        else return "content-area-full";
      } else return "content-area-full";
    },
    footerClasses() {
      return {
        "footer-hidden": this.footerType === "hidden",
        "footer-sticky": this.footerType === "sticky",
        "footer-static": this.footerType === "static",
      };
    },
    isAppPage() {
      return this.$route.meta.no_scroll;
    },
    isThemeDark() {
      return this.$store.state.theme === "dark";
    },
    layoutTypeClass() {
      return `main-${this.mainLayoutType}`;
    },
    mainLayoutType() {
      return this.$store.state.mainLayoutType;
    },
    navbarClasses() {
      return {
        "navbar-hidden": this.navbarType === "hidden",
        "navbar-sticky": this.navbarType === "sticky",
        "navbar-static": this.navbarType === "static",
        "navbar-floating": this.navbarType === "floating",
      };
    },
    verticalNavMenuWidth() {
      return this.$store.state.verticalNavMenuWidth;
    },
    windowWidth() {
      return this.$store.state.windowWidth;
    },
    boardIds() {
      const boardIds = JSON.parse(localStorage.getItem(this.keyLocalStorageBoardIds));

      if (!boardIds) {
        const boardIds = [];
        //await this.$store.dispatch("member/LOAD_MEMBER_DETAIL", { project_id: this.projectId });
        if (this.$store.state.member.memberInfo) {

          const boards = this.$store.state.member.memberInfo.boards;
          if (boards && boards.length > 0) {
            for (const board of boards) {
              if (board.pivot.v === 1
                && Number(`${board.pivot.project_id}`) === Number(`${this.projectId}`)) {

                boardIds.push(board.id);
              }
            }
            const newBoardIds = [...new Set(boardIds)];

            localStorage.setItem(this.keyLocalStorageBoardIds, JSON.stringify(newBoardIds));
            return newBoardIds;
          } else {
            this.$store.dispatch("member/LOAD_MEMBER_DETAIL");
          }

          return boardIds;
        }

        return boardIds;
      }

      return boardIds;
    },
  },
  methods: {
    async loadAlertList() {
      await this.$store.dispatch("approval/LOAD_NOTIFICATION_UNREAD_LIST", {
        page_unread: 1,
        per_page_unread: 5,
        days_before_unread: 30,
      });
    },
    async loadProjectMember() {
      const page = 1;
      const perPage = 10000;
      const projectId = this.$route.params.proj_id;

      await this.$store.dispatch("project/LOAD_PROJECT_USER", {
        page,
        perPage,
        projectId,
      });
    },
    changeRouteTitle(title) {
      this.routeTitle = title;
    },
    updateNavbarColor(val) {
      this.navbarColor = val;
      if (val === "#fff") this.isNavbarDark = false;
      else this.isNavbarDark = true;
    },
    setNavMenuVisibility(layoutType) {
      if ((layoutType === "horizontal" && this.windowWidth >= 1200) || (layoutType === "vertical" && this.windowWidth < 1200)) {
        this.$store.commit("TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE", false);
        this.$store.dispatch("updateVerticalNavMenuWidth", "no-nav-menu");
      } else {
        this.$store.commit("TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE", true);
      }
    },
    changeRootUrl(list, rootUrl) {
      if (list && list.length > 0) {
        for (const item of list) {
          if (item.url) {
            if (typeof item.url === "string" && item.url.indexOf(rootUrl) < 0) {
              item.url = `${rootUrl}${item.url}`;
            }
          }

          if (item.submenu && item.submenu.length > 0) {
            this.changeRootUrl(item.submenu, rootUrl);
          }
        }
      }
    },
    backRouter() {
      if (this.isWritePage) this.$router.go(-1);
    },

    __useMenu__(urlObject, boardIds) {
      let enabled = false

      if (urlObject) {

        // submenu 가 있는 경우
        if (urlObject.submenu) {
          let allDisabledSubMenu = true;
          for (let i = 0; i < urlObject.submenu.length; i++) {
            let enabledSubMenu = this.__useMenu__(urlObject.submenu[i], boardIds);
            if (!enabledSubMenu) {
              urlObject.submenu.splice(i, 1);
              i--;
            } else {
              allDisabledSubMenu = false;
            }
          }

          // 하나라도 활성화된 메뉴가 있으면 상위 메뉴 활성화
          enabled = !allDisabledSubMenu;
        }

        // groupName 이 있는 경우
        else if (urlObject.groupName && urlObject.groupName.length > 0) {
          for (const boardId of urlObject.groupName) {
            // TODO : this.boardIds 가 undefined 뜨는 이유를 찾아봐야함함
            try {
              if (boardIds.indexOf(Number(`${boardId}`)) >= 0) {
                enabled = true;
                break;
              }
            } catch (e) { /*ignore*/ }

          }
        } else {
          enabled = true;
        }
      }

      return enabled;
    }
  },

  async created() {
    const color = this.navbarColor === "#fff" && this.isThemeDark ? "#10163a" : this.navbarColor;
    this.updateNavbarColor(color);
    this.setNavMenuVisibility(this.$store.state.mainLayoutType);

    // <member-selector> / <table-list> 의 getMemberName / <table-page-list> 의 getMemberName 에서 사용됨
    // await this.$store.dispatch("member/LOAD_MEMBERS_ALL", {
    //   projectId: this.$route.params.proj_id,
    // });

    await this.$store.dispatch("project/LOAD_PROJECT", { project_id: this.projectId });
  },
  mounted() {
    this.loadAlertList();
    // 사용하지 않은 것으로 확인되어 주석처리
    // this.loadProjectMember();
  },
};
</script>

<style lang="scss">
[dir] input[readonly="readonly"] {
  background-color: #fafafa;
}

[dir] textarea[readonly="readonly"] {
  background-color: #fafafa;
}

[dir] .file-input .vs-con-input .vs-inputx {
  background-color: #ffffff;
}

[dir] .con-select .vs-select--input {
  background-color: #ffffff;
}

[dir] .vdp-datepicker input[readonly="readonly"] {
  background-color: #ffffff;
}

/* 페이지네이션 중앙 정렬 */
[dir] .vs-con-table .vs-table--pagination .vs-row .vs-col:nth-child(1) {
  display: none !important;
}

[dir] .vs-con-table .vs-table--pagination .vs-row .vs-col:nth-child(2) {
  width: 100% !important;
  justify-content: center !important;
}

/* 페이지네이션 현재페이지 색상 */
[dir] .vs-con-table .vs-table--pagination .vs-pagination-primary .effect,
[dir] .vs-con-table .vs-table--pagination .vs-pagination-primary .vs-pagination--buttons:hover {
  background: rgba(var(--vs-secondary), 1) !important;
}

/* 리스트 스타일 */
.dot {
  width: 10px;
  height: 10px;
  margin-right: 8px;
  border-radius: 10px;
  display: inline-block;
  background-color: #6670cb;
}

.dot.red {
  background-color: #fb0000;
}

.dot.yellow {
  background-color: #ffd600;
}

/* 테이블 스타일 */
ul.table {
  width: 100%;
}

ul.table > li {
  display: grid;
  text-align: center;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #cdcdcd;
  grid-template-rows: minmax(52px, 100%);
}

ul.table > li.tbody {
  background-color: #fff;
}

ul.table > li.tbody > span {
  font-weight: normal !important;
}

ul.table > li > span {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  font-weight: 500;
}

ul.table > li > span:first-child {
  border-left: none;
}

ul.table.table-2 > li {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

ul.table.table-3 > li {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

ul.table.table-4 > li {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

ul.table.table-5 > li {
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

ul.table.table-6 > li {
  grid-template-columns: repeat(6, minmax(0, 1fr));
}

ul.table.table-7 > li {
  grid-template-columns: repeat(7, minmax(0, 1fr));
}

ul.table.table-8 > li {
  grid-template-columns: repeat(8, minmax(0, 1fr));
}

ul.table.table-9 > li {
  grid-template-columns: repeat(9, minmax(0, 1fr));
}

ul.table.table-10 > li {
  grid-template-columns: 50px repeat(9, minmax(0, 1fr));
}

ul.table.table-no > li {
  grid-template-columns: 60px minmax(0, 100%);
}

ul.table > li.table-2-li {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

ul.table > li.table-3-li {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

ul.table > li.table-4-li {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

ul.table > li.table-5-li {
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

ul.table > li.table-6-li {
  grid-template-columns: repeat(6, minmax(0, 1fr));
}

ul.table > li.table-7-li {
  grid-template-columns: repeat(7, minmax(0, 1fr));
}

ul.table > li.table-8-li {
  grid-template-columns: repeat(8, minmax(0, 1fr));
}

ul.table > li.table-9-li {
  grid-template-columns: repeat(9, minmax(0, 1fr));
}

ul.table > li.table-10-li {
  grid-template-columns: 50px repeat(9, minmax(0, 1fr));
}

ul.table > li.table-no-li {
  grid-template-columns: 60px minmax(0, 100%);
}

.vs-row .border {
  text-align: center;
  background-color: #f9f9f9;
}

.bg-fff {
  background-color: #fff;
}

.border-left {
  border-left: 1px solid #cdcdcd !important;
}

.border-right {
  border-right: 1px solid #cdcdcd !important;
}

.border-bottom {
  border-bottom: 1px solid #cdcdcd !important;
}

.border-top {
  border-top: 1px solid #cdcdcd !important;
}

.title {
  font-weight: 500;
}

.router-header {
  padding: 0 16px;

  @media (min-width: theme("screens.xl")) {
    padding: 0;
  }
}
</style>
