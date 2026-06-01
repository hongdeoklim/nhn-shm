<!-- =========================================================================================
    File Name: MainLayout.vue
    Description: Main layout
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
    Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div class="layout--main" :class="[layoutTypeClass, navbarClasses, footerClasses, { 'no-scroll': isAppPage }]">
    <v-nav-menu :navMenuItems="navMenuItems" title="Vuexy" parent=".layout--main" />

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
                <div class="content-area__heading" :class="{ 'pr-4 border-0 md:border-r border-solid border-grey-light': $route.meta.breadcrumb }">
                  <h2 class="mb-1">{{ routeTitle }}</h2>
                </div>

                <!-- BREADCRUMB -->
                <vx-breadcrumb v-if="$route.meta.breadcrumb" class="ml-4 md:block hidden" :route="$route" :breadcrumb="breadcrumb" :isRTL="$vs.rtl" />
              </div>

              <div v-else-if="loadBreadCrumb.length > 0" class="router-header flex flex-wrap items-center mb-6">
                <div class="content-area__heading pr-4 border-0 md:border-r border-solid border-grey-light">
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
import config from "/public/config";
import BackToTop from "vue-backtotop";
import TheNavbarVertical from "@/layouts/components/navbar/TheNavbarVertical.vue";
import TheFooter from "@/layouts/components/TheFooter.vue";
import themeConfig from "../../themeConfig.js";
import VNavMenu from "@/layouts/components/vertical-nav-menu/VerticalNavMenu.vue";
import sidebarItems from "@/layouts/sidemenu/main";

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
      routerTransition: themeConfig.routerTransition || "none",
      routeTitle: this.$t(this.$route.meta.pageTitle),
    };
  },
  watch: {
    $route() {
      this.routeTitle = this.$t(this.$route.meta.pageTitle);
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
    navMenuItems() {
      const projects = this.myProjectList;
      const items = [];
      for (const menu of sidebarItems) {
        let use = false;
        for (const proj of projects) {
          if (menu.project_type === proj.project_type) {
            use = true;
            break;
          }
        }

        if (use) {
          items.push(menu);
        }
      }

      return items;
    },
    breadcrumb() {
      const breadcrumb = JSON.parse(JSON.stringify(this.$route.meta.breadcrumb));
      for (let i = 0; i < breadcrumb.length; i++) {
        breadcrumb[i].title = this.$t(breadcrumb[i].title);
      }
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
    locale() {
      return this.$i18n.locale;
    },
    isConstruct() {
      return this.locale === "ko_construct" || this.locale === "en_construct";
    },
    myProjectList() {
      try {
        return this.$store.state.member.memberInfo.projects ? this.$store.state.member.memberInfo.projects : [];
      } catch (e) {
        return [];
      }
    },
  },
  methods: {
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
    renameKey(obj, oldKey, newKey) {
      obj[newKey] = obj[oldKey];
      delete obj[oldKey];
    },
    async loadAlertList() {
      await this.$store.dispatch("approval/LOAD_NOTIFICATION_UNREAD_LIST", {
        page_unread: 1,
        per_page_unread: 5,
        days_before_unread: 30,
      });
    },
  },
  async beforeCreate() {
    //const data = this.$store.state.auth.userInfo
    const hostname = config.HOST_NAME;

    const locale = localStorage.getItem("i18n_locale");

    if (locale) {
      this.$i18n.locale = locale;
    } else {
      this.$i18n.locale = "ko_maot";
    }

    const userId = this.$store.state.auth.userInfo.id;
    await this.$store.dispatch("member/LOAD_MEMBER", { userId });
  },
  created() {
    const color = this.navbarColor === "#fff" && this.isThemeDark ? "#10163a" : this.navbarColor;
    this.updateNavbarColor(color);
    this.setNavMenuVisibility(this.$store.state.mainLayoutType);
  },
  async mounted() {
    await this.loadAlertList();

    //const data = this.$store.state.auth.userInfo
    const hostname = config.HOST_NAME;

    const locale = await localStorage.getItem("i18n_locale");

    if (locale) {
      this.$i18n.locale = locale;
    } else {
      this.$i18n.locale = "ko_maot";
    }
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
  border-left: 1px solid #cdcdcd;
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
  border: 1px solid #cdcdcd;
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
