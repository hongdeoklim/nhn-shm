<!-- =========================================================================================
  File Name: VerticalNavMenuGroup.vue
  Description: Vertical NavMenu Group Component. Extends vuesax framework's 'vs-sidebar-group' component
  Component Name: VerticalNavMenuGroup
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div class="vs-sidebar-group" :class="[{ 'vs-sidebar-group-open': openItems }, { 'vs-sidebar-group-active': open }, { 'disabled-item pointer-events-none': group.isDisabled }]" @mouseover="mouseover" @mouseout="mouseout">
    <!-- Group Label -->
    <div @click="clickGroup" class="group-header w-full">
      <span class="flex items-center w-full">
        <p v-if="isCount" class="mr-3">{{ icon }}.</p>
        <menu-icon v-else :icon="icon" />

        <!-- Group Name -->
        <span v-show="!verticalNavMenuItemsMin" class="truncate mr-3 select-none" style="white-space: initial !important; word-break: keep-all">
          {{ group.name }}
        </span>

        <!-- Group Tag -->
        <vs-chip class="ml-auto mr-4" :color="group.tagColor" v-if="group.tag && !verticalNavMenuItemsMin">
          {{ group.tag }}
        </vs-chip>
      </span>

      <!-- Group Collapse Icon -->
      <feather-icon v-show="!verticalNavMenuItemsMin" :class="[{ rotate90: openItems }, 'feather-grp-header-arrow']" :icon="$vs.rtl ? 'ChevronLeftIcon' : 'ChevronRightIcon'" svg-classes="w-4 h-4" />

      <!-- Group Tooltip -->
      <span class="vs-sidebar--tooltip">{{ group.name }}</span>
    </div>
    <!-- /Group Label -->

    <!-- Group Items -->
    <ul ref="items" :style="styleItems" class="vs-sidebar-group-items ml-2">
      <li v-for="(groupItem, index) in group.submenu" :key="index">
        <!-- If item is group -->
        <v-nav-menu-group v-if="groupItem.submenu && groupItem.submenu.length > 0" :group="groupItem" :groupIndex="Number(`${groupIndex}.${index + 1}`)" :open="isGroupActive(groupItem)" :openHover="openHover" />

        <!-- Else: Item -->
        <v-nav-menu-item
          v-else-if="!groupItem.hide && (!groupItem.onlySystemAdmin || (groupItem.onlySystemAdmin && parseInt($store.state.auth.userInfo.is_superuser) > 0))"
          icon-small
          :index="groupIndex + '.' + index"
          :to="!isExternal(groupItem.url) ? groupItem.url : null"
          :href="isExternal(groupItem.url) ? groupItem.url : null"
          :activeCode="groupItem.activeCode"
          :groupName="groupItem.groupName"
          :isCount="!!groupItem.icon && groupItem.icon === 'count'"
          :icon="!!groupItem.icon && groupItem.icon === 'count' ? `${index + 1}` : groupItem.icon"
          :target="isExternal(groupItem.url) ? '_blank' : '_self'"
        >
          <span class="truncate" style="white-space: initial !important; word-break: keep-all">
            {{ groupItem.name }}
          </span>
          <vs-chip class="ml-auto" :color="groupItem.tagColor" v-if="groupItem.tag">{{ groupItem.tag }}</vs-chip>
        </v-nav-menu-item>
      </li>
    </ul>
    <!-- /Group Items -->
  </div>
</template>

<script>
import VNavMenuItem from "./VerticalNavMenuItem.vue";
import MenuIcon from "./MenuIcon.vue";

export default {
  name: "v-nav-menu-group",
  props: {
    openHover: { type: Boolean, default: false },
    open: { type: Boolean, default: false },
    group: { type: Object },
    groupIndex: { type: Number },
    isCount: { type: Boolean, default: false },
    icon: { type: String, default: "" },
  },
  components: {
    VNavMenuItem,
    MenuIcon,
  },
  data: () => ({
    maxHeight: "0px",
    openItems: false,
  }),
  computed: {
    isSystemUser() {
      return parseInt(this.$store.state.auth.userInfo.is_superuser) === 1;
    },
    verticalNavMenuItemsMin() {
      return this.$store.state.verticalNavMenuItemsMin;
    },
    styleItems() {
      return { maxHeight: this.maxHeight };
    },
    itemIcon() {
      return (index) => {
        console.log(index, (index.match(/\./g) || []).length);
        if (!((index.match(/\./g) || []).length > 1)) return "child-icon";
      };
    },
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
  },
  watch: {
    // OPEN & CLOSES DROPDOWN ON ROUTE CHANGE
    $route() {
      if (this.verticalNavMenuItemsMin) return;

      const scrollHeight = this.scrollHeight;

      // Collapse Group
      if (this.openItems && !this.open) {
        this.maxHeight = `${scrollHeight}px`;
        setTimeout(() => {
          this.maxHeight = `${0}px`;
        }, 50);

        // Expand Group
      } else if (this.open) {
        this.maxHeight = `${scrollHeight}px`;
        setTimeout(() => {
          this.maxHeight = "none";
        }, 300);
      }
    },
    open: {
      immediate: true,
      handler() {
        this.initMenuInfo();
      },
    },
    maxHeight() {
      this.openItems = this.maxHeight !== "0px";
    },
    // OPEN AND CLOSES DROPDOWN MENU ON NavMenu COLLAPSE AND DEFAULT VIEW
    "$store.state.verticalNavMenuItemsMin"(val) {
      const scrollHeight = this.$refs.items.scrollHeight;

      if (!val && this.open) {
        this.maxHeight = `${scrollHeight}px`;
        setTimeout(() => {
          this.maxHeight = "none";
        }, 300);
      } else {
        this.maxHeight = `${scrollHeight}px`;
        setTimeout(() => {
          this.maxHeight = "0px";
        }, 50);
      }
      if (val && this.open) {
        this.maxHeight = `${scrollHeight}px`;
        setTimeout(() => {
          this.maxHeight = "0px";
        }, 250);
      }
    },
  },
  methods: {
    initMenuInfo() {
      this.openItems = this.open;
      if (this.open) {
        this.maxHeight = "none";
      } else {
        this.maxHeight = "0px";
      }
    },
    clickGroup() {
      if (!this.openHover) {
        const thisScrollHeight = this.$refs.items.scrollHeight;

        if (this.maxHeight === "0px") {
          this.maxHeight = `${thisScrollHeight}px`;
          setTimeout(() => {
            this.maxHeight = "none";
          }, 300);
        } else {
          this.maxHeight = `${thisScrollHeight}px`;
          setTimeout(() => {
            this.maxHeight = `${0}px`;
          }, 50);
        }

        this.$parent.$children.map((child) => {
          if (child.isGroupActive) {
            if (child !== this && !child.open && child.maxHeight !== "0px") {
              setTimeout(() => {
                child.maxHeight = `${0}px`;
              }, 50);
            }
          }
        });
      }
    },
    mouseover() {
      if (this.openHover) {
        const scrollHeight = this.$refs.items.scrollHeight;
        this.maxHeight = `${scrollHeight}px`;
      }
    },
    mouseout() {
      if (this.openHover) {
        const scrollHeight = 0;
        this.maxHeight = `${scrollHeight}px`;
      }
    },

    // groupItem.slug 설정과 상관없이 url이 http, https로 시작하는 경우 외부 링크로 연결해주기 위함.
    isExternal(url) {
      return url && (url.indexOf("http") === 0 || url.indexOf("https") === 0);
    },
  },
  mounted() {
    this.initMenuInfo();
  },
};
</script>

<style lang="scss">
@import "@/assets/scss/vuexy/components/verticalNavMenuGroup.scss";
</style>
