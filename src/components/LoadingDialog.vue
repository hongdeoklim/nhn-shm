<template>
  <vs-popup :active.sync="showPopup" id="LoadingDialog">
    <div class="flex items-center justify-center">
      <img src="@/assets/icons/loading.svg" class="spin" />
      <p>처리중입니다..</p>
    </div>
    <div class="w-screen h-screen absolute top-0 left-0 z-50" @click.stop></div>
  </vs-popup>
</template>

<script>
export default {
  data() {
    return {
      showPopup: false,
    };
  },
  mounted() {
    window.addEventListener("loadingDialog", this.loadingDialog);
  },
  beforeDestroy() {
    window.removeEventListener("loadingDialog", this.loadingDialog);
  },
  methods: {
    loadingDialog(event) {
      const { open } = event.detail;
      this.showPopup = open;
    },
  },
};
</script>

<style lang="scss" scoped>
#LoadingDialog::v-deep {
  header {
    display: none;
  }
  .vs-popup {
    position: unset;
    width: 252px;
  }
}
p {
  font-weight: 400;
  font-size: 18px;
  line-height: 18px;
  color: #757575;
  padding: 0 20px;
}
.spin {
  animation: lds-spinner 1s infinite steps(12);
}
@keyframes lds-spinner {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
