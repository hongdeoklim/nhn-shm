<template>
  <vs-popup
    :title="title"
    :active.sync="showPopup"
    id="AlertDialog"
    :class="size"
  >
    <div class="flex items-center gap-2">
      <feather-icon
        v-if="!!messageIcon"
        :icon="messageIcon"
        style="width: 18px; height: 18px"
      />
      <span>
        {{ message }}
      </span>
    </div>
    <vs-row>
      <vs-col
        class="mt-4 flex"
        vs-align="center"
        :vs-justify="!!btnPosition ? btnPosition : 'flex-end'"
      >
        <vs-button
          v-if="useConfirm"
          class="mr-4"
          color="secondary"
          :type="confirmBtnStyle.type || 'filled'"
          :style="confirmBtnStyle.style"
          @click="handleClickConfirm"
        >
          <img
            v-if="
              !!confirmBtnStyle.icon &&
              confirmBtnStyle.icon.type &&
              confirmBtnStyle.icon.type === 'image'
            "
            :src="require(`@/assets/images/icon/${confirmBtnStyle.icon.name}`)"
          />
          <feather-icon
            v-else-if="
              !!confirmBtnStyle.icon &&
              confirmBtnStyle.icon.type &&
              confirmBtnStyle.icon.type === 'feather'
            "
            :icon="confirmBtnStyle.icon.name"
            style="width: 18px; height: 18px"
          />
          <div>
            {{ confirmBtn }}
          </div>
        </vs-button>
        <vs-button
          color="secondary"
          :type="cancelBtnStyle.type || 'border'"
          :style="cancelBtnStyle.style"
          @click="handleClickClose"
        >
          <img
            v-if="
              !!cancelBtnStyle.icon &&
              cancelBtnStyle.icon.type &&
              cancelBtnStyle.icon.type === 'image'
            "
            :src="require(`@/assets/images/icon/${cancelBtnStyle.icon.name}`)"
          />
          <feather-icon
            v-else-if="
              !!cancelBtnStyle.icon &&
              cancelBtnStyle.icon.type &&
              cancelBtnStyle.icon.type === 'feather'
            "
            :icon="cancelBtnStyle.icon.name"
            style="width: 18px; height: 18px"
          />
          <div>
            {{ cancelBtn }}
          </div>
        </vs-button>
      </vs-col>
    </vs-row>
  </vs-popup>
</template>

<script>
export default {
  data() {
    return {
      showPopup: false,
      useConfirm: false,
      title: "",
      messageIcon: null,
      message: "",
      confirmBtn: "확인",
      cancelBtn: "닫기",
      confirmFunction: null,
      cancelFunction: null,
      size: null,
      btnPosition: null,
      confirmBtnStyle: {
        type: null,
        icon: null,
        style: null,
      },
      cancelBtnStyle: {
        type: null,
        icon: null,
        style: null,
      },
    };
  },
  mounted() {
    window.addEventListener("customAlert", this.openCustomAlert);
  },
  beforeDestroy() {
    window.removeEventListener("customAlert", this.openCustomAlert);
  },
  methods: {
    openCustomAlert(event) {
      const {
        title,
        messageIcon,
        message,
        useConfirm,
        confirmBtn,
        cancelBtn,
        confirmFunction,
        cancelFunction,
        size,
        btnPosition,
        confirmBtnStyle,
        cancelBtnStyle,
      } = event.detail;

      this.title = title;
      this.messageIcon = messageIcon || null;
      this.message = message;

      this.useConfirm = useConfirm || false;
      this.confirmBtn = confirmBtn || "확인";
      this.cancelBtn = cancelBtn || "닫기";

      this.confirmFunction = confirmFunction || null;
      this.cancelFunction = cancelFunction || null;

      this.size = size || null;
      this.btnPosition = btnPosition || null;
      this.confirmBtnStyle = confirmBtnStyle || {};
      this.cancelBtnStyle = cancelBtnStyle || {};

      this.showPopup = true;
    },
    handleClickConfirm() {
      if (this.confirmFunction) this.confirmFunction();

      this.showPopup = false;
      this.resetData();
    },
    handleClickClose() {
      if (this.cancelFunction) this.cancelFunction();

      this.showPopup = false;
      this.resetData();
    },

    resetData() {
      this.useConfirm = false;
      this.title = "";
      this.messageIcon = null;
      this.message = "";
      this.confirmBtn = "확인";
      this.cancelBtn = "닫기";
      this.confirmFunction = null;
      this.cancelFunction = null;

      this.size = null;
      this.btnPosition = null;
      this.confirmBtnStyle = {};
      this.cancelBtnStyle = {};
    },
  },
};
</script>

<style lang="scss" scoped>
#AlertDialog.small::v-deep {
  .vs-popup {
    width: 300px;
  }
}
</style>
