<!-- =========================================================================================
  File Name: TheNavbar.vue
  Description: Navbar component
  Component Name: TheNavbar
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div class="relative">
    <!-- ========================================== PC ============================================== -->
    <div v-if="this.verticalNavMenuWidth === 'default'" class="vx-navbar-wrapper" :class="classObj">
      <vs-navbar class="vx-navbar navbar-custom navbar-skelton" :color="navbarColorLocal" :class="textColor">
        <!-- SM - OPEN SIDEBAR BUTTON -->
        <!--        <feather-icon class="sm:inline-flex xl:hidden cursor-pointer p-2" icon="MenuIcon" @click.stop="showSidebar" />-->

        <!--        <bookmarks :navbarColor="navbarColor" v-if="windowWidth >= 992" />-->

        <!--<vs-button class="px-3 mr-3" color="primary" type="border" @click="openLink">현장 센서 모니터링</vs-button>-->

        <!--        <feather-icon class="sm:inline-flex cursor-pointer p-2" icon="UserIcon" @click.stop="handleUserIcon" />-->

        <feather-icon class="sm:inline-flex cursor-pointer p-2" icon="HomeIcon" @click.stop="handleHomeIcon" />

        <label class="proj-name">
          <div>{{ projectName }}</div>

          <!--소규모 현장에서, 선택된 사업장 정보를 헤더에 표시하는데 사용됨-->
          <template v-if="selectedField">
            <feather-icon icon="ChevronsRightIcon" svgClasses="h-5 w-5" class="px-2" />
            <div style="font-weight: 500; font-size: 18px;">{{ selectedField.field_name || '-'}}</div>

            <!-- 현장변경 -->
            <div class="flex cursor-pointer" style="color: rgba(var(--vs-secondary), 1)" @click.stop.prevent="onClickOpenFieldSelect">
              <feather-icon icon="RepeatIcon" svgClasses="h-5 w-5" class="pl-3 pr-1" />
              <div style="font-size: 13px;">현장변경</div>
            </div>

            <!-- 현장정보 -->
            <div class="flex cursor-pointer" style="color: rgba(var(--vs-secondary), 1)" @click.stop.prevent="onClickOpenFieldInfo">
              <feather-icon icon="AlertCircleIcon" svgClasses="h-5 w-5" class="pl-3 pr-1" />
              <div style="font-size: 13px;">현장정보</div>
            </div>

            <field-select-popup :active.sync="showFieldSelectPopup" @select="onSelectField"/>
            <field-detail-popup :active.sync="showFieldInfoPopup" :field-id="selectedField.id" />
          </template>
        </label>
        <vs-spacer />

        <!--<search-bar class="mr-4" />-->

        <notification-drop-down />

        <profile-drop-down />

        <i18n-drop-down v-if="hostname == 'miras.maot.co.kr' || hostname == '3.34.172.199'" />
        <label v-if="hostname == 'miras.maot.co.kr' || hostname == '3.34.172.199'" class="mr-1" style="cursor: pointer" @click="onChangeWorkType">
          <feather-icon :icon="`${selectWorkType}Icon`" />
        </label>
      </vs-navbar>
    </div>
    <!-- ========================================== MOBILE ============================================== -->
    <div v-else class="" :class="classObj">
      <div v-if="$route.meta.topBanner" class="m-top-banner">
        <div class="m-top-banner-contents">
          <!-- Logo -->
          <router-link tag="div" class="pl-2 vx-logo cursor-pointer flex items-center" to="/home">
            <img class="fill-current" src="@/assets/images/logo/NH_SNB1.svg" style="height: 100%" />
          </router-link>
          <!-- /Logo -->
          <profile-drop-down />
        </div>
      </div>
      <vs-navbar class="vx-navbar navbar-custom navbar-skelton" :color="navbarColorLocal" :class="textColor">
        <feather-icon class="sm:inline-flex xl:hidden cursor-pointer p-2" icon="MenuIcon" @click.stop="showSidebar" />
        <label class="proj-name">{{ projectName }}</label>
        <!-- <vs-spacer /> -->

        <feather-icon class="sm:inline-flex cursor-pointer p-2" icon="HomeIcon" @click.stop="handleHomeIcon" />
        <notification-drop-down />

        <i18n-drop-down v-if="hostname == 'miras.maot.co.kr' || hostname == '3.34.172.199'" />
        <label v-if="hostname == 'miras.maot.co.kr' || hostname == '3.34.172.199'" class="mr-1" style="cursor: pointer" @click="onChangeWorkType">
          <feather-icon :icon="`${selectWorkType}Icon`" />
        </label>
      </vs-navbar>
    </div>
  </div>
</template>

<script>
import Bookmarks from "./components/Bookmarks.vue";
import SearchBar from "./components/SearchBar.vue";
import NotificationDropDown from "./components/NotificationDropDown.vue";
import ProfileDropDown from "./components/ProfileDropDown.vue";
import I18nDropDown from "./components/I18n.vue";
import config from "../../../../public/config";
import TableCustom from "@/components/TableCustom.vue";
import FieldDetailPopup from "@/layouts/components/navbar/components/FieldDetailPopup.vue";
import FieldSelectPopup from "@/layouts/components/navbar/components/FieldSelectPopup.vue";

export default {
  name: "the-navbar-vertical",
  props: {
    navbarColor: {
      type: String,
      default: "#fff",
    },
    isSideMenu: {
      type: Boolean,
      default: false,
    },
    selectedFieldData: {
      type: Object,
      default: null,
    }
  },
  components: {
    FieldSelectPopup,
    FieldDetailPopup,
    TableCustom,
    Bookmarks,
    SearchBar,
    NotificationDropDown,
    ProfileDropDown,
    I18nDropDown,
  },
  computed: {
    navbarColorLocal() {
      return this.$store.state.theme === "dark" && this.navbarColor === "#fff" ? "#10163a" : this.navbarColor;
    },
    verticalNavMenuWidth() {
      return this.$store.state.verticalNavMenuWidth;
    },
    textColor() {
      return { "text-white": (this.navbarColor !== "#10163a" && this.$store.state.theme === "dark") || (this.navbarColor !== "#fff" && this.$store.state.theme !== "dark") };
    },
    windowWidth() {
      return this.$store.state.windowWidth;
    },

    // NAVBAR STYLE
    classObj() {
      if (this.verticalNavMenuWidth === "default") return "navbar-default";
      else if (this.verticalNavMenuWidth === "reduced") return "navbar-reduced";
      else if (this.verticalNavMenuWidth) return "navbar-full";
    },
    projectId() {
      return this.$route.params.proj_id;
    },
    projectInfo() {
      return this.$store.state.project.projectInfo;
    },
    projectName() {
      if (this.projectId) {
        return this.projectInfo.field_name;
      }
      return "";
    },
    memberInfo() {
      return this.$store.state.member.memberInfo;
    },
    /**
     * 사용자가 현재 프로젝트에서 선택하고 있는 현장의 ID를 반환합니다.
     */
    selectedField() {
      const metaKey = `selected_field_${this.projectId}`;

      if (this.memberInfo && this.memberInfo.meta) {
        const metaValue = this.memberInfo.meta[metaKey];
        if (metaValue) {
          return JSON.parse(metaValue);
        }
      }

      return null;
    },
  },
  data() {
    return {
      hostname: config.HOST_NAME,
      selectWorkType: "Coffee",
      showFieldSelectPopup: false,
      showFieldInfoPopup: false,
    };
  },
  async mounted() {
    const _locale = await localStorage.getItem("i18n_locale");
    this.$i18n.locale = _locale;

    if (_locale) {
      const _tempList = _locale.split("_");
      if (_tempList[1] === "construct") {
        this.selectWorkType = "Tool";
      } else if (_tempList[1] === "produce") {
        this.selectWorkType = "Filter";
      } else if (_tempList[1] === "education") {
        this.selectWorkType = "Book";
      } else if (_tempList[1] === "maot") {
        this.selectWorkType = "Coffee";
      }
    }
  },
  methods: {
    showSidebar() {
      this.$store.commit("TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE", true);
    },

    handleHomeIcon() {
      if (this.projectId) {
        this.$router.push(`/project/${this.projectId}`).catch(() => {});
      } else {
        this.$router.push("/").catch(() => {});
      }
    },

    handleUserIcon() {
      this.$router.push("/mypage/workstatus");
    },

    openLink() {
      const url = "https://wipco.senceive.com/Monitor/SiteMonitor.aspx";
      window.open(url, "_blank");
    },

    async onChangeWorkType() {
      if (this.selectWorkType === "Book") {
        this.selectWorkType = "Tool";
      } else if (this.selectWorkType === "Tool") {
        this.selectWorkType = "Filter";
      } else if (this.selectWorkType === "Filter") {
        this.selectWorkType = "Coffee";
      } else {
        this.selectWorkType = "Book";
      }

      const locale = this.$i18n.locale;
      if (locale) {
        const _tempList = locale.split("_");
        if (this.selectWorkType === "Tool") {
          await this.updateLocale(`${_tempList[0]}_construct`);
        } else if (this.selectWorkType === "Filter") {
          await this.updateLocale(`${_tempList[0]}_produce`);
        } else if (this.selectWorkType === "Book") {
          await this.updateLocale(`${_tempList[0]}_education`);
        } else if (this.selectWorkType === "Coffee") {
          await this.updateLocale(`${_tempList[0]}_maot`);
        }
      }
    },
    async updateLocale(locale) {
      if (this.$i18n.locale !== locale) {
        this.$i18n.locale = locale;
        await localStorage.setItem("i18n_locale", locale);
      }
    },

    onClickOpenFieldSelect () {
      this.showFieldSelectPopup = true;
    },
    onClickOpenFieldInfo() {
      this.showFieldInfoPopup = true;
    },
    onSelectField (field) {
      this.updateSelectedField(field)
    },

    /**
     * 현재 프로젝트에 대해서 기본 값으로 선택하는 사업장 정보를 업데이트합니다.
     * @param field
     */
    async updateSelectedField(field) {
      const param = {
        userId: this.memberInfo.id,
        metas: [
          {
            key: `selected_field_${this.projectId}`,
            value: JSON.stringify({
              id: field.id,
              field_name: field.field_name,
              field_code: field.field_code,
              field_type: field.field_type,
              address: field.address,
              be_completed_at: field.be_completed_at,
              start_work_at: field.start_work_at,
              deposit_amount: field.deposit_amount,
              director_name: field.director_name,
              facility_category_id: field.facility_category_id,
              facility_category: field.facility_category,
              manager_name: field.manager_name,
              safety_manager_name: field.safety_manager_name,
              work_begin_at: field.work_begin_at,
              work_end_at: field.work_end_at,
            }),
          }
        ]
      };
      await this.$store.dispatch('member/MODIFY_MEMBER', param)
        .then((/*response*/) => {
          // 사용자 정보를 업데이트하고, 변경된 사용자 정보를 새로 불러오도록 한다
          this.$store.dispatch("member/LOAD_MEMBER_DETAIL");
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.proj-name {
  border-left: 1px solid #dae1e7;
  padding-left: 8px;
  font-size: 18px;
  display: flex;
  align-items: center;
}

.navbar-full {
  header {
    border-radius: 0px;

    label.proj-name {
      flex: 1;
      color: #606060;
      font-weight: 500;
      text-align: center;
      border: none;
      padding: 0;
    }
  }
}

.m-top-banner {
  padding: .8rem 1rem;
  background: #1E0D61;
  color: #fff;
}
.m-top-banner-contents {
  display: flex;
  justify-content: space-between;
}
</style>

