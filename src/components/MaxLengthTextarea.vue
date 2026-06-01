<template>
  <p v-if="isPrint" class="print-textarea">
    {{ inputValue }}
  </p>
  <div v-else>
    <div @click="showPopup = true" class="fake-textarea" :class="readonly && 'readonly'" v-html="text"></div>
    <vs-popup :title="popupTitle" :active.sync="showPopup">
      <vs-textarea ref="mlTextarea" :counter="max" v-model="inputValue" :readonly="readonly" :placeholder="placeholder" class="popup-textarea" />
      <vs-button class="float-right mt-4" color="secondary" @click="showPopup = false">확인</vs-button>
    </vs-popup>
  </div>
</template>

<script>
export default {
  name: "MaxLengthTextarea",
  props: {
    value: { type: String | Number, default: "" },
    placeholder: String,
    isPrint: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    max: { type: Number, default: 2000 },
  },
  computed: {
    popupTitle() {
      if (this.$store.state.menu.pagePath) {
        return this.$store.state.menu.pagePath[this.$store.state.menu.pagePath.length - 1].title;
      }
      return "";
    },
    text() {
      return this.inputValue.replaceAll(/(\n|\r\n)/g, "<br>");
    },
  },
  watch: {
    value: {
      handler(value) {
        this.inputValue = value;
      },
    },
    inputValue: {
      immediate: true,
      deep: true,
      handler(value) {
        if (value.length > this.max) {
          this.inputValue = this.value;
          alert(`${this.max}자까지 작성할 수 있습니다.`);
          // this.$refs.mlTextarea.focus();
        } else {
          this.$emit("input", value);
        }
      },
    },
  },
  data() {
    return {
      showPopup: false,
      inputValue: this.value,
    };
  },
};
</script>

<style lang="scss" scoped>
.fake-textarea {
  height: 100px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  padding: 0.7rem;
  border-radius: 5px;
  cursor: pointer;
  overflow-y: auto;

  &.readonly {
    background: #fafafa;
  }
}

.popup-textarea {
  height: 60vh;
  &::v-deep .vs-textarea {
    height: 100%;
    resize: none !important;
  }
}
</style>
