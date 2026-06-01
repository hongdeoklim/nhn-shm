<!-- =========================================================================================
    File Name: VerticalNavMenuItem.vue
    Description: Vertical NavMenu item component. Extends vuesax framework's 'vs-sidebar-item' component
    Component Name: VerticalNavMenuItem
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div class="vs-sidebar--item" :class="[{ 'vs-sidebar-item-active': activeLink }, { 'disabled-item pointer-events-none': isDisabled }]">
    <router-link tabindex="-1" v-if="to" exact :class="[{ 'router-link-active': activeLink }]" style="position: sticky" :to="to" :target="target">
      <p v-if="isCount" class="text-white mr-3">{{ icon }}.</p>
      <menu-icon v-else :featherIcon="featherIcon" :icon="icon" :iconSmall="iconSmall" />
      <slot />
    </router-link>

    <a v-else :target="target" :href="href" tabindex="-1">
      <p v-if="isCount" class="text-white mr-3">{{ icon }}.</p>
      <menu-icon v-else :featherIcon="featherIcon" :icon="icon" :iconSmall="iconSmall" />
      <slot />
    </a>
  </div>
</template>

<script>
import MenuIcon from "./MenuIcon.vue";
export default {
  name: "v-nav-menu-item",
  components: {
    MenuIcon,
  },
  props: {
    icon: { type: String, default: "" },
    isCount: { type: Boolean, default: false },
    iconSmall: { type: Boolean, default: false },
    iconPack: { type: String, default: "material-icons" },
    href: { type: [String, null], default: "#" },
    to: { type: [String, Object, null], default: null },
    activeCode: { type: String, default: null },
    index: { type: [String, Number], default: null },
    featherIcon: { type: Boolean, default: true },
    target: { type: String, default: "_self" },
    isDisabled: { type: Boolean, default: false },
    groupName: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  computed: {
    activeLink() {
      let active = !!((this.to === this.$route.path || this.$route.meta.activeCode === this.activeCode) && this.to);
      const pathList = this.$route.path.split("/");

      if (this.activeCode) {
        const activeCode = this.activeCode
        const __index_field = pathList.indexOf('field');
        const __check_field_code = (pathList.length > __index_field + 1) ? pathList[__index_field + 1] : '_none_';
        if (`field-${__check_field_code}` === activeCode) active = true;
      }

      if (this.groupName) {
        this.groupName.map((boardId) => {
          const __index_tab = pathList.indexOf('tab');
          const __check_tab_code = (pathList.length > __index_tab + 1) ? pathList[__index_tab + 1] : '_none_';
          if (__check_tab_code === boardId) active = true;

          const __index_normal = pathList.indexOf('normal');
          const __check_normal_code = (pathList.length > __index_normal + 1) ? pathList[__index_normal + 1] : '_none_';
          if (__check_normal_code === boardId) active = true;

          const __index_approval = pathList.indexOf('approval');
          const __check_approval_code = (pathList.length > __index_approval + 1) ? pathList[__index_approval + 1] : '_none_';
          if (__check_approval_code === boardId) active = true;
        });
      }

      if (this.href === this.$route.path) {
        active = true;
      }

      return active;
    },
  },
};
</script>

<style>
.vs-sidebar-item-active > a {
  background-color: #7367f0;
  color: #fff;
  border-radius: 0.5rem;
}
</style>
