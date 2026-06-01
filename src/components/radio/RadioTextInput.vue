<template>
  <div style="padding: 10px">
    <p v-if="!!title" style="font-size: 16px" class="font-medium mb-2">{{ title }}</p>
    <div class="flex flex-wrap items-center gap-y-2 gap-x-5">
      <div v-for="(rd, rd_i) in renderData" :key="`radio_text_input_${rd_i}`">
        <div v-if="isPrint" class="print-radio flex items-center gap-2">
          <i><feather-icon v-if="returnValue.value === rd.value" svgClasses="w-4 w-5" icon="CheckIcon" /></i>
          <p>{{ rd.value }}</p>
          <div v-if="rd.textInput">
            <p v-if="returnValue.value === rd.value" style="width: 280px" class="print-input">{{ returnValue.text }}</p>
            <p v-else style="width: 280px" class="print-input"></p>
          </div>
        </div>
        <vs-radio v-else :vs-name="radioName" v-model="returnValue.value" :vs-value="rd.value" @change="onChangeRadioValue">
          <div class="flex items-center gap-2 px-2">
            <p>{{ rd.value }}</p>
            <div v-if="rd.textInput">
              <ml-input v-if="returnValue.value === rd.value" v-model="returnValue.text" placeholder="입력" style="width: 280px" />
              <ml-input v-else disabled style="width: 280px" />
            </div>
          </div>
        </vs-radio>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isPrint: Boolean,
    readonly: Boolean,
    title: String,
    radioName: { type: String, default: "radios" },
    renderData: { type: Array, default: () => [{ textInput: false, value: "변화없음" }] },
    value: Object,
  },
  watch: {
    value: {
      handler(value) {
        this.returnValue = value;
      },
    },
    returnValue: {
      immediate: true,
      deep: true,
      handler(value) {
        if (!value.hasOwnProperty("value")) {
          value = { value: "", text: "" };
        }
        this.$emit("input", value);
      },
    },
  },
  data() {
    return {
      returnValue: this.value,
    };
  },
  methods: {
    onChangeRadioValue() {
      this.returnValue.text = "";
    },
  },
};
</script>

<style lang="scss" scoped>
.print-radio,
.print-checkbox {
  display: flex;
  align-items: center;

  & > i {
    width: 20px;
    height: 20px;
    border: 2px solid #cdcdcd;
    position: relative;
    margin-right: 6px;
  }
  & .feather-icon {
    transform: translateY(-4px);
  }
}

.print-radio {
  & > i {
    border-radius: 20px;
  }
}
</style>
