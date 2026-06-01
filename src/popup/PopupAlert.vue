<template>
  <vs-popup id="popAlert" :title="title" :active.sync="showPopup" @keyup="handleKeyup">
    <vs-row :classs="{ 'mb-6': buttons.length > 0 }">
      <vs-col class="grid" vs-justify="center">
        <p v-html="html"></p>
        <p v-if="message">{{ message }}</p>
      </vs-col>
    </vs-row>
    <vs-row v-if="isConfirm" class="mb-6">
      <vs-col>
        <ml-textarea rows="5" v-model="text" />
      </vs-col>
    </vs-row>
    <vs-row>
      <vs-col class="flex" vs-justify="center">
        <vs-button
          v-for="(button, index) in buttons"
          :key="index"
          class="ml-2"
          :type="button.type ? button.type : 'filled'"
          :color="button.color ? button.color : 'secondary'"
          @click="
            () => {
              handleClickButton(button.action);
            }
          "
          >{{ button.label }}</vs-button
        >
      </vs-col>
    </vs-row>
  </vs-popup>
</template>

<script>
export default {
  name: "PopupAlert",
  props: {
    value: Boolean,
    title: {
      type: String,
      default: "System",
    },
    message: String,
    html: String,
    isConfirm: Boolean,
    buttons: {
      type: Array,
      default() {
        return [
          { label: "확인", action: "ok" },
          { label: "닫기", action: "cancel", type: "border" },
        ];
      },
    },
  },

  watch: {
    value(data) {
      this.showPopup = data;
    },
    showPopup(value) {
      const body = document.querySelector('body');
      if (value) {
        body.style.overflow = 'hidden'
      } else {
        body.style.overflow = 'auto'
      }
      this.$emit('input', value)
    },
  },

  data() {
    return {
      showPopup: false,
      text: "",
    };
  },

  mounted() {
    const backButtonRouteGuard = this.$router.beforeEach((to, from, next) => {
      if (this.showPopup) {
        this.showPopup = false;
        next(false);
        return;
      }
      next(true);
    });
    this.$once("hook:destroyed", () => {
      backButtonRouteGuard();
    });
  },

  created() {
    this.showPopup = this.value;
    window.addEventListener("keyup", this.handleKeyup);
  },

  beforeDestroy() {
    window.removeEventListener("keyup", this.handleKeyup);
  },

  methods: {
    handleClickButton(action) {
      this.$emit(action, this.text);
      this.showPopup = false;
    },
    handleKeyup(e) {
      if (this.showPopup && e.code === "Escape") {
        this.showPopup = false;
      }
    },
  },
};
</script>

<style>
#popAlert .vs-popup {
  width: auto !important;
}
</style>
