<template>
  <div v-if="isPrint || readonly" class="fileupload-print print-container pb-8">
    <h5 class="mb-5" v-if="!customTitle"><i class="dot"></i> {{ title }}</h5>
    <ul>
      <li
        v-for="file of fileList"
        :key="file.id"
        class="flex flex-row items-center px-3 py-2"
        style="border-top: 1px solid #cdcdcd"
      >
        <a :href="file.path" target="_blank" style="color:#6670CB"><p>{{ file.fileName }}</p></a>
        <p style="color: #9ca0a4" class="text-xs ml-2">
          ({{ file.fileSize }} bytes)
        </p>
      </li>
      <li
        style="
          background-color: #f9f9f9;
          border-top: 1px solid #cdcdcd;
          border-bottom: 1px solid #cdcdcd;
        "
        class="all-filelist px-3 py-2"
      >
        전체 {{ fileList.length }}개 ({{ allBytes }} Bytes)
      </li>
    </ul>
  </div>
  <div v-else>
    <input
      :id="'file_input' + id"
      type="file"
      multiple
      @change="handleChangeFile"
      style="display: none"
      :accept="
        fileTypeAll
          ? ''
          : 'application/msword, .docx, application/vnd.ms-excel, .xlsx, application/vnd.ms-powerpoint,\n' +
            'text/plain, application/pdf, image/png, image/gif, image/jpeg, .hwp, .csv'
      "
      :disabled="readonly"
    />
    <template-file-upload-check-list
      v-if="type === 'check_list'"
      :title="title"
      :file-list="fileList"
      :visible-title="visibleTitle"
      :readonly="readonly"
      @dragFile="handleDragFile"
      @handleClickAddFileButton="handleClickAddFileButton"
      @handleRemoveFile="handleRemoveFile"
    ></template-file-upload-check-list>

    <template-file-upload-check-list-col
      v-if="type === 'check_list_col'"
      :title="title"
      :is-show-title="isShowTitle"
      :file-list="fileList"
      :readonly="readonly"
      @dragFile="handleDragFile"
      @handleClickAddFileButton="handleClickAddFileButton"
      @handleRemoveFile="handleRemoveFile"
    ></template-file-upload-check-list-col>

    <template-file-upload-gallery
      v-if="type === 'gallery'"
      :title="title"
      :is-show-title="isShowTitle"
      :file-list="fileList"
      :readonly="readonly"
      :multi-stage="multiStage"
      :is-print="isPrint"
      @handleClickAddFileButton="handleClickAddFileButton"
      @handleRemoveFile="handleRemoveFile"
    ></template-file-upload-gallery>
  </div>
</template>

<script>
import TemplateFileUploadCheckList from "@/views/modules/template/TemplateFileUploadCheckList";
import TemplateFileUploadCheckListCol from "@/views/modules/template/TemplateFileUploadCheckListCol";
import TemplateFileUploadGallery from "@/views/modules/template/TemplateFileUploadGallery";
export default {
  name: "FileUploadModule",
  components: {
    TemplateFileUploadGallery,
    TemplateFileUploadCheckListCol,
    TemplateFileUploadCheckList,
  },
  props: {
    type: {
      type: String,
      default: "check_list",
    },
    title:{
      type: String,
      default: "파일첨부",
    },
    customTitle: Boolean,
    fileTypeAll: Boolean,
    isShowTitle: Boolean,
    isPrint: Boolean,
    visibleTitle: {
      type: Boolean,
      default: true,
    },
    readonly: Boolean,
    id: String,
    value: Array, //{ id:0, fileName:'test1.txt', fileSize:1234, path:'', thumb:'' }
    multiStage: Number,
  },
  watch: {
    value: {
      deep: true,
      handler(value) {
        if (value) {
          // 무한 루프 방지: 외부에서 업데이트 중임을 표시
          this.isUpdatingFromParent = true;
          this.fileList = value;
          this.$nextTick(() => {
            this.isUpdatingFromParent = false;
          });
        }
      },
    },
  },
  computed: {
    allBytes() {
      return this.fileList.reduce((bytes, file) => {
        return bytes + file.fileSize;
      }, 0);
    },
  },
  data() {
    return {
      fileList: [],
      isUpdatingFromParent: false, // 무한 루프 방지 플래그
    };
  },
  created() {
    if (this.value) {
      this.fileList = this.value;
    }
  },
  methods: {
    async file_upload(files) {
      if (files.length > 0) {
        for (const file of files) {
          await this.$store.dispatch("file/FILE_UPLOAD", file);
          this.addFile(this.$store.state.file.uploadedFile);
        }
      }
      const inputFile = document.getElementById(`file_input${this.id}`);
      inputFile.value = "";
    },

    addFile(fileObject) {
      if (fileObject) {
        this.fileList.push(fileObject);
      }

      this.handleFileList(this.fileList);
    },

    handleClickAddFileButton() {
      const inputFile = document.getElementById(`file_input${this.id}`);
      inputFile.click();
    },

    handleDragFile(files) {
      this.file_upload(files);
    },

    handleChangeFile(event) {
      this.file_upload(event.target.files);
    },

    handleRemoveFile(fileList) {
      for (const file of fileList) {
        this.fileList.remove(file);
      }
      const inputFile = document.getElementById(`file_input${this.id}`);
      inputFile.value = "";

      this.handleFileList(this.fileList);
    },

    handleFileList(files) {
      // 부모로부터 업데이트 중이면 emit 안 함
      if (this.isUpdatingFromParent) return;
      this.$emit("input", files);
    },
  },
};
</script>

<style scoped></style>
