<template>
  <div>
    <FileDownload title="이미지 업로드" type="image" :isChange="hasAdminPermission" />

    <!-- 파일첨부 -->
    <file-upload-module id="fileList" class="w-full mt-4" v-model="form.fileList" :is-print="isPrint" :readonly="board ? board.readonly : false"></file-upload-module>
  </div>
</template>

<script>
import FileDownload from "@/components/FileDownload.vue";
import FileUploadModule from "@/views/modules/FileUploadModule";
import FieldSelectModule from "@/views/modules/FieldSelectModule";
import PhotoUploadGridModule from "@/views/modules/PhotoUploadGridModule";

export default {
  components: {
    FileDownload,
    PhotoUploadGridModule,
    FieldSelectModule,
    FileUploadModule,
  },
  props: {
    isPrint: Boolean,
    board: Object,
    value: Object,
    docProjectId: String | Number,
  },
  computed: {
    projectId() {
      return parseInt(this.$route.params.proj_id);
    },
    hasAdminPermission() {
      return parseInt(this.$store.state.auth.userInfo.is_superuser) === 1;
    },
  },
  watch: {
    board: {
      immediate: true,
      deep: true,
      handler(/*value*/) {},
    },
    value: {
      immediate: true,
      deep: true,
      handler(value) {
        if (this.form && value) {
          const keys = Object.keys(this.form);
          for (const key of keys) {
            if (value[key]) {
              this.form[key] = value[key];
            }
          }
        }
      },
    },
    form: {
      immediate: true,
      deep: true,
      handler(value) {
        this.$emit("input", value);
      },
    },
    EnableSave: {
      immediate: true,
      handler() {
        this.$emit("EnableSave", this.EnableSave);
      },
    },
  },
  mounted() {
    this.init();
    console.log(this.projectId);
  },
  data() {
    return {
      EnableSave: false,
      form: {
        fileList: [],
      },
    };
  },
  methods: {
    async init() {
      if (this.projectId == 1) {
        this.EnableSave = true;
      }
    },
    save() {},
  },
};
</script>

<style scoped lang="scss"></style>
