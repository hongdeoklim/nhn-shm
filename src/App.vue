<!-- =========================================================================================
  File Name: App.vue
  Description: Main vue file - APP
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div id="app" :class="vueAppClasses">
    <router-view @setAppClasses="setAppClasses" :key="$route.fullPath" />
    <alert-dialog />
    <loading-dialog />
  </div>
</template>

<script>
import themeConfig from "@/../themeConfig.js";
import AlertDialog from "@/components/AlertDialog.vue";
import LoadingDialog from "@/components/LoadingDialog.vue";

export default {
  components: {
    AlertDialog,
    LoadingDialog,
  },
  data() {
    return {
      vueAppClasses: [],
    };
  },
  watch: {
    "$store.state.theme"(val) {
      this.toggleClassInBody(val);
    },
    "$vs.rtl"(val) {
      document.documentElement.setAttribute("dir", val ? "rtl" : "ltr");
    },
  },
  methods: {
    toggleClassInBody(className) {
      if (className === "dark") {
        if (document.body.className.match("theme-semi-dark")) document.body.classList.remove("theme-semi-dark");
        document.body.classList.add("theme-dark");
      } else if (className === "semi-dark") {
        if (document.body.className.match("theme-dark")) document.body.classList.remove("theme-dark");
        document.body.classList.add("theme-semi-dark");
      } else {
        if (document.body.className.match("theme-dark")) document.body.classList.remove("theme-dark");
        if (document.body.className.match("theme-semi-dark")) document.body.classList.remove("theme-semi-dark");
      }
    },
    setAppClasses(classesStr) {
      this.vueAppClasses.push(classesStr);
    },
    handleWindowResize() {
      this.$store.commit("UPDATE_WINDOW_WIDTH", window.innerWidth);

      // Set --vh property
      document.documentElement.style.setProperty(
        "--vh",
        `${window.innerHeight * 0.01}px`
      );
    },
    handleScroll() {
      this.$store.commit("UPDATE_WINDOW_SCROLL_Y", window.scrollY);
    },
  },
  mounted() {
    this.toggleClassInBody(themeConfig.theme);
    this.$store.commit("UPDATE_WINDOW_WIDTH", window.innerWidth);

    const vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  },
  async created() {
    const dir = this.$vs.rtl ? "rtl" : "ltr";
    document.documentElement.setAttribute("dir", dir);

    window.addEventListener("resize", this.handleWindowResize);
    window.addEventListener("scroll", this.handleScroll);

    // i18n 초기설정
    this.$i18n.locale = "ko_maot";
  },
  destroyed() {
    window.removeEventListener("resize", this.handleWindowResize);
    window.removeEventListener("scroll", this.handleScroll);
  },
};
</script>

<style>
.vs-textarea-primary textarea {
  resize: vertical !important;
}

.vs-popup {
  position: fixed;
}

/*재해형태 멀티 선택 폼*/
.multiselect__tags {
  border-color: rgba(0, 0, 0, 0.2) !important;
}
.multiselect__option--highlight {
  background: rgba(var(--vs-secondary),1) !important;
}
.multiselect__option--highlight.multiselect__option--selected {
  background: rgba(var(--vs-danger),1) !important;
}
.multiselect__tag-icon:hover {
  background: rgba(var(--vs-danger),1) !important;
}
.multiselect__option {
  white-space: normal !important;
  line-height: 1.3 !important;
}
.vs-table--tbody {
  z-index: 4 !important;
}
</style>
