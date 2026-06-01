<template>
  <div>
    <quill-editor ref="qEditor" class="vx-col flex-1 ql-edit-text" v-model="inputValue" :options="options" @change="onEditorChange($event)"></quill-editor>
    <div style="padding: 2px 10px; text-align: right; color: gray; font-size: 12px">{{ inputLength }} / {{ max }}</div>
  </div>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";

export default {
  name: "MaxLengthEditor",
  components: { quillEditor },
  props: {
    value: { type: String | Number, default: "" },
    placeholder: String,
    readonly: Boolean,
    rows: { type: Number | String, default: 5 },
    max: { type: Number, default: 2000 },
    options: Object,
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
        if (!!this.$refs.qEditor) this.inputLength = this.$refs.qEditor.quill.getText().length - 1;
      },
    },
  },
  data() {
    return {
      inputValue: this.value,
      inputLength: 0,
    };
  },
  mounted() {
    if (!!this.value) this.inputLength = this.$refs.qEditor.quill.getText().length - 1;
  },
  methods: {
    onEditorChange({ quill, html, text }) {
      if (text.length - 1 > this.max) {
        const delta = this.$refs.qEditor.quill.clipboard.convert(this.value);
        this.$refs.qEditor.quill.setContents(delta, "silent");

        alert(`${this.max}자까지 작성할 수 있습니다.`);
      } else {
        this.$emit("input", html);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.ql-edit-text::v-deep .ql-editor {
  overflow-y: scroll;
  resize: vertical;
  min-height: 20em;
}
</style>
