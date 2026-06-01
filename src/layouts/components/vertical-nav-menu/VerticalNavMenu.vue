<!-- =========================================================================================
  File Name: VerticalNavMenu.vue
  Description: Vertical NavMenu Component
  Component Name: VerticalNavMenu
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
    Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div class="parentx">
    <vs-sidebar
      :class="[verticalNavMenuWidth !== 'default' ? 'smallMenu' : '']"
      class="v-nav-menu items-no-padding"
      v-model="isVerticalNavMenuActive"
      ref="verticalNavMenu"
      default-index="-1"
      :click-not-close="clickNotClose"
      :reduce-not-rebound="reduceNotRebound"
      :parent="parent"
      :hiddenBackground="clickNotClose"
      :reduce="reduce"
      v-hammer:swipe="onMenuSwipe"
    >
      <div @mouseenter="mouseEnter" @mouseleave="mouseLeave" style="background-color: #1e0d61; height: 100%">
        <!-- Header -->
        <div class="header-sidebar flex items-end justify-between" slot="header">
          <!-- Logo -->
          <router-link tag="div" class="vx-logo cursor-pointer flex items-center" to="/home">
            <img class="fill-current" src="@/assets/images/logo/NH_SNB1.svg" style="height: 100%" />
            <!--            <span class="vx-logo-text text-primary" v-show="isMouseEnter || !reduce" v-if="title">{{ title }}</span>-->
          </router-link>
          <!-- /Logo -->
        </div>
        <!-- /Header -->

        <!-- Header Shadow -->
        <!--        <div class="shadow-bottom" v-show="showShadowBottom" />-->

        <!-- Menu Items -->
        <component :is="scrollbarTag" ref="verticalNavMenuPs" class="scroll-area-v-nav-menu pt-2" :settings="settings" @ps-scroll-y="psSectionScroll" @scroll="psSectionScroll" :key="$vs.rtl">
          <template v-for="(item, index) in menuItemsUpdated">
            <!-- Group Header -->
            <span v-if="item.header && !verticalNavMenuItemsMin" class="navigation-header truncate" style="white-space: initial !important" :key="`header-${index}`">
              {{ item.header }}
            </span>
            <!-- /Group Header -->

            <template v-else-if="!item.header">
              <!-- Nav-Item -->
              <v-nav-menu-item
                v-if="!item.submenu"
                :key="`item-${index}`"
                :index="index"
                :to="(item.url && typeof item.url === 'object') || item.single ? item.url : null"
                :href="item.url && typeof item.url === 'string' ? item.url : null"
                :isCount="!!item.icon && item.icon === 'count'"
                :icon="!!item.icon && item.icon === 'count' ? koreanLabel[index] : item.icon"
                :target="isExternal(item.url) ? '_blank' : '_self'"
                :isDisabled="item.isDisabled"
                :group-name="item.groupName"
                :activeCode="item.activeCode"
              >
                <span v-show="!verticalNavMenuItemsMin" class="truncate" style="white-space: initial !important; word-break: keep-all">{{ item.name }}</span>
                <vs-chip class="ml-auto" :color="item.tagColor" v-if="item.tag && (isMouseEnter || !reduce)">{{ item.tag }}</vs-chip>
              </v-nav-menu-item>

              <!-- Nav-Group -->
              <template v-else>
                <v-nav-menu-group
                  v-if="!item.onlySystemAdmin || (item.onlySystemAdmin && parseInt($store.state.auth.userInfo.is_superuser) > 0)"
                  :key="`group-${index}`"
                  :openHover="openGroupHover"
                  :group="item"
                  :isCount="!!item.icon && item.icon === 'count'"
                  :icon="!!item.icon && item.icon === 'count' ? koreanLabel[index] : item.icon"
                  :groupIndex="index"
                  :open="isGroupActive(item)"
                />
              </template>
              <!-- /Nav-Group -->
            </template>
          </template>
        </component>
        <!-- /Menu Items -->
      </div>
    </vs-sidebar>

    <!-- Swipe Gesture -->
    <div v-if="!isVerticalNavMenuActive" class="v-nav-menu-swipe-area" v-hammer:swipe="onSwipeAreaSwipe" />
    <!-- /Swipe Gesture -->
  </div>
</template>

<script>
import config from "/public/config";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import VNavMenuGroup from "./VerticalNavMenuGroup.vue";
import VNavMenuItem from "./VerticalNavMenuItem.vue";

import Logo from "../Logo.vue";

export default {
  name: "v-nav-menu",
  components: {
    VNavMenuGroup,
    VNavMenuItem,
    VuePerfectScrollbar,
    Logo,
  },
  props: {
    logo: { type: String },
    openGroupHover: { type: Boolean, default: false },
    parent: { type: String },
    reduceNotRebound: { type: Boolean, default: true },
    navMenuItems: { type: Array, required: true },
    title: { type: String },
  },
  data: () => ({
    hostname: config.HOST_NAME,
    clickNotClose: false, // disable close navMenu on outside click
    isMouseEnter: false,
    reduce: false, // determines if navMenu is reduce - component property
    showCloseButton: false, // show close button in smaller devices
    settings: {
      // perfectScrollbar settings
      maxScrollbarLength: 60,
      wheelSpeed: 1,
      swipeEasing: true,
    },
    showShadowBottom: false,
    koreanLabel: ["", "가", "나", "다", "라", "마", "바", "사", "아", "자", "차", "카", "타", "파", "하"],
  }),
  computed: {
    isGroupActive() {
      return (item) => {
        const path = this.$route.fullPath;
        const pathList = this.$route.path.split("/");
        const activeCode = this.$route.meta ? this.$route.meta.activeCode : undefined;
        let open = false;

        const func = (item) => {
          if (item.submenu) {
            item.submenu.forEach((itemSubmenu) => {
              if (itemSubmenu.url && (path === itemSubmenu.url || (itemSubmenu.activeCode && activeCode === itemSubmenu.activeCode))) {
                open = true;
              } else if (itemSubmenu.submenu) {
                func(itemSubmenu);
              }

              if (itemSubmenu.activeCode) {
                const __index_field = pathList.indexOf('field');
                const __check_field_code = (pathList.length > __index_field + 1) ? pathList[__index_field + 1] : '_none_';
                if (`field-${__check_field_code}` === itemSubmenu.activeCode) open = true;
              }

              if (itemSubmenu.groupName) {
                itemSubmenu.groupName.map((boardId) => {
                  const __index_tab = pathList.indexOf('tab');
                  const __check_tab_code = (pathList.length > __index_tab + 1) ? pathList[__index_tab + 1] : '_none_';
                  if (__check_tab_code === boardId) open = true;

                  const __index_normal = pathList.indexOf('normal');
                  const __check_normal_code = (pathList.length > __index_normal + 1) ? pathList[__index_normal + 1] : '_none_';
                  if (__check_normal_code === boardId) open = true;

                  const __index_approval = pathList.indexOf('approval');
                  const __check_approval_code = (pathList.length > __index_approval + 1) ? pathList[__index_approval + 1] : '_none_';
                  if (__check_approval_code === boardId) open = true;
                });
              }
            });
          }
        };
        func(item);
        return open;
      };
    },
    menuItemsUpdated() {
      if (this.navMenuItems) {
        const clone = this.navMenuItems.slice();

        // 선택된 사업장이 없을 경우, 사업장을 선택하는 메뉴만 남길지 여부를 판단한다
        if (!this.selectedField) {
          // 메뉴를 순환하면서 showFieldNotSelected 속성이 정의되어 있는지 확인한다.
          // 이 속성이 정의되어 있는 경우, 사업장 선택되지 않으면 해당 속성이 정의된 메뉴만 노출시켜야 한다.
          // children 속성이 정의되어 있는 경우, 해당 메뉴의 children 속성을 순환하면서 showFieldNotSelected 속성이 정의되어 있는지 확인한다.
          let hasShowFieldNotSelected = false;
          for (const item of clone) {
            if (this.nodeHasShowFieldNotSelected(item)) {
              hasShowFieldNotSelected = true;
              break;
            }
          }

          // 만약 해당 속성이 정의되어 있다면, 해당 속성이 정의되지 않은 메뉴는 제거한다.
          // children 속성이 정의되어 있는 경우, 해당 메뉴의 children 속성을 순환하면서 showFieldNotSelected 속성이 정의되어 있는지 확인한다.
          if (hasShowFieldNotSelected) {
            return clone.filter((item) => {
              if (item.showFieldNotSelected) {
                return true;
              }

              if (this.nodeHasShowFieldNotSelected(item)) {
                if (item.submenu) {
                  item.submenu = item.submenu.filter((child) => this.nodeHasShowFieldNotSelected(child));
                }
                return true;
              }
              return false;
            });
          }
        }


        for (const [index, item] of this.navMenuItems.entries()) {
          if (item.header && item.items.length && (index || 1)) {
            const i = clone.findIndex((ix) => ix.header === item.header);
            for (const [subIndex, subItem] of item.items.entries()) {
              clone.splice(i + 1 + subIndex, 0, subItem);
            }
          }
        }
        return clone;
      }

      return [];
    },
    isVerticalNavMenuActive: {
      get() {
        return this.$store.state.isVerticalNavMenuActive;
      },
      set(val) {
        this.$store.commit("TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE", val);
      },
    },
    layoutType() {
      return this.$store.state.mainLayoutType;
    },
    reduceButton: {
      get() {
        return this.$store.state.reduceButton;
      },
      set(val) {
        this.$store.commit("TOGGLE_REDUCE_BUTTON", val);
      },
    },
    isVerticalNavMenuReduced() {
      return Boolean(this.reduce && this.reduceButton);
    },
    verticalNavMenuItemsMin() {
      return this.$store.state.verticalNavMenuItemsMin;
    },
    scrollbarTag() {
      return this.$store.getters.scrollbarTag;
    },
    windowWidth() {
      return this.$store.state.windowWidth;
    },
    verticalNavMenuWidth() {
      return this.$store.state.verticalNavMenuWidth;
    },
    projectId() {
      return this.$route.params.proj_id;
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
  watch: {
    $route() {
      if (this.isVerticalNavMenuActive && this.showCloseButton) this.$store.commit("TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE", false);
    },
    reduce(val) {
      const verticalNavMenuWidth = val ? "reduced" : this.$store.state.windowWidth < 1200 ? "no-nav-menu" : "default";
      this.$store.dispatch("updateVerticalNavMenuWidth", verticalNavMenuWidth);

      setTimeout(function () {
        window.dispatchEvent(new Event("resize"));
      }, 100);
    },
    layoutType() {
      this.setVerticalNavMenuWidth();
    },
    reduceButton() {
      this.setVerticalNavMenuWidth();
    },
    windowWidth() {
      this.setVerticalNavMenuWidth();
    },
  },
  methods: {
    onMenuSwipe(event) {
      if (event.direction === 4 && this.$vs.rtl) {
        // Swipe Right
        if (this.isVerticalNavMenuActive && this.showCloseButton) this.isVerticalNavMenuActive = false;
      } else if (event.direction === 2 && !this.$vs.rtl) {
        // Swipe Left
        if (this.isVerticalNavMenuActive && this.showCloseButton) this.isVerticalNavMenuActive = false;
      }
    },
    onSwipeAreaSwipe(event) {
      if (event.direction === 4 && !this.$vs.rtl) {
        // Swipe Right
        if (!this.isVerticalNavMenuActive && this.showCloseButton) this.isVerticalNavMenuActive = true;
      } else if (event.direction === 2 && this.$vs.rtl) {
        // Swipe Left
        if (!this.isVerticalNavMenuActive && this.showCloseButton) this.isVerticalNavMenuActive = true;
      }
    },
    psSectionScroll() {
      const scroll_el = this.$refs.verticalNavMenuPs.$el || this.$refs.verticalNavMenuPs;
      this.showShadowBottom = scroll_el.scrollTop > 0;
    },
    mouseEnter() {
      if (this.reduce) this.$store.commit("UPDATE_VERTICAL_NAV_MENU_ITEMS_MIN", false);
      this.isMouseEnter = true;
    },
    mouseLeave() {
      if (this.reduce) this.$store.commit("UPDATE_VERTICAL_NAV_MENU_ITEMS_MIN", true);
      this.isMouseEnter = false;
    },
    setVerticalNavMenuWidth() {
      if (this.windowWidth > 1200) {
        if (this.layoutType === "vertical") {
          // Set reduce
          this.reduce = !!this.reduceButton;

          // Open NavMenu
          this.$store.commit("TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE", true);

          // Set Menu Items Only Icon Mode
          const verticalNavMenuItemsMin = !!(this.reduceButton && !this.isMouseEnter);
          this.$store.commit("UPDATE_VERTICAL_NAV_MENU_ITEMS_MIN", verticalNavMenuItemsMin);

          // Menu Action buttons
          this.clickNotClose = true;
          this.showCloseButton = false;

          const verticalNavMenuWidth = this.isVerticalNavMenuReduced ? "reduced" : "default";
          this.$store.dispatch("updateVerticalNavMenuWidth", verticalNavMenuWidth);

          return;
        }
      }

      // Close NavMenu
      this.$store.commit("TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE", false);

      // Reduce button
      if (this.reduceButton) this.reduce = false;

      // Menu Action buttons
      this.showCloseButton = true;
      this.clickNotClose = false;

      // Update NavMenu Width
      this.$store.dispatch("updateVerticalNavMenuWidth", "no-nav-menu");

      // Remove Only Icon in Menu
      this.$store.commit("UPDATE_VERTICAL_NAV_MENU_ITEMS_MIN", false);

      // if(this.layoutType === 'vertical' || (this.layoutType === 'horizontal' && this.windowWidth < 1200))
      // if (this.windowWidth < 1200) {

      //   // Close NavMenu
      //   this.$store.commit('TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE', false)

      //   // Reduce button
      //   if (this.reduceButton) this.reduce = false

      //   // Menu Action buttons
      //   this.showCloseButton = true
      //   this.clickNotClose   = false

      //   // Update NavMenu Width
      //   this.$store.dispatch('updateVerticalNavMenuWidth', 'no-nav-menu')

      //   // Remove Only Icon in Menu
      //   this.$store.commit('UPDATE_VERTICAL_NAV_MENU_ITEMS_MIN', false)

      // } else {

      //   // Set reduce
      //   this.reduce = this.reduceButton ? true : false

      //   // Open NavMenu
      //   this.$store.commit('TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE', true)

      //   // Set Menu Items Only Icon Mode
      //   const verticalNavMenuItemsMin = (this.reduceButton && !this.isMouseEnter) ? true : false
      //   this.$store.commit('UPDATE_VERTICAL_NAV_MENU_ITEMS_MIN', verticalNavMenuItemsMin)

      //   // Menu Action buttons
      //   this.clickNotClose   = true
      //   this.showCloseButton = false

      //   const verticalNavMenuWidth   = this.isVerticalNavMenuReduced ? "reduced" : "default"
      //   this.$store.dispatch('updateVerticalNavMenuWidth', verticalNavMenuWidth)
      // }
    },
    toggleReduce(val) {
      this.reduceButton = val;
      this.setVerticalNavMenuWidth();
    },

    // groupItem.slug 설정과 상관없이 url이 http, https로 시작하는 경우 외부 링크로 연결해주기 위함.
    isExternal(url) {
      return typeof url === "string" && (url.indexOf("http") === 0 || url.indexOf("https") === 0);
    },
    nodeHasShowFieldNotSelected(node) {
      if (node.showFieldNotSelected) {
        return true;
      }
      // children 속성이 있을 경우 재귀적으로 순환하면서 showFieldNotSelected 속성이 정의되어 있는지 확인한다.
      if (node.submenu) {
        for (const child of node.submenu) {
          if (this.nodeHasShowFieldNotSelected(child)) {
            return true;
          }
        }
      }
      return false;
    },
  },
  mounted() {
    this.setVerticalNavMenuWidth();
  },
};
</script>

<style lang="scss">
@import "@/assets/scss/vuexy/components/verticalNavMenu.scss";

.smallMenu {
  .vs-sidebar {
    max-width: 70%;
  }
}
</style>
