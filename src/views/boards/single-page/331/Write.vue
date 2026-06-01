<template>
  <div>
    <!-- 기본정보 -->
    <field-select-module
      v-model="form.stdInfo"
      :board="this.board"
      :is-print="isPrint"
    />

    <!-- 파일첨부 -->
    <file-upload-module
      id="fileList"
      class="w-full mt-4"
      v-model="form.fileList"
      :is-print="isPrint"
      :readonly="board.readonly"
    ></file-upload-module>
  </div>
</template>

<script>
import FileUploadModule from "@/views/modules/FileUploadModule";
import FieldSelectModule from "@/views/modules/FieldSelectModule";

export default {
  components: {
    FieldSelectModule,
    FileUploadModule,
  },
  props: {
    isPrint: Boolean,
    board: Object,
    value: Object,
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler(value) {
        const keys = Object.keys(this.form);
        for (const key of keys) {
          if (value[key]) {
            this.form[key] = value[key];
          }
        }
      },
    },
    form: {
      immediate: true,
      deep: true,
      handler(value) {
        value.title = this.board.writer.department;
        this.$emit("input", value);
      },
    },
  },
  data() {
    return {
      form: {
        stdInfo: {},
        fileList: [],
      },
    };
  },
  methods: {},
};
</script>

<style scoped lang="scss">
</style>
