<template>
  <label v-if="type === 'only-image'" class="w-full h-full only-image" @click="onClickImage" @dragenter="onDrag" @dragover="onDrag" @drop="onDrop">
    <div v-if="!file.path" style="display: grid; justify-items: center">
      <img class="pb-2" style="width: 36px; height: 32px; position: relative" src="@/assets/images/icon/icon-file-upload.svg" />
      <span style="font-size: 16px; font-weight: bold">이미지 업로드</span>
      <span style="font-size: 14px; font-weight: normal">이미지를 드롭하거나 여기를 클릭하여 업로드하세요.</span>
    </div>
    <input v-if="!readonly && !file.path" ref="fileInput" :id="id" type="file" @change="handleChangeFile" style="display: none" accept="image/png, image/jpeg" />
    <div v-if="file.path">
      <img :src="file.path" />
      <div
        style="position: absolute; top: -8px; right: -8px; background-color: #fff; display: flex; justify-content: center; align-items: center; width: 24px; height: 24px; border-radius: 999px; border: 1px solid #222"
        @click.stop="deleteImage"
      >
        <img style="position: relative; width: 12px; height: 12px" src="@/assets/images/icon/icon-close.svg" />
      </div>
    </div>
  </label>
  <label v-else style="display: flex; position: relative">
    <input ref="fileInput" :id="id" type="file" @change="handleChangeFile" style="display: none" />
    <ml-input
      class="w-full file-input layout-input"
      :class="file.id > 0 ? 'file-input--has-file' : ''"
      readonly
      :value="file.fileName"
      @click="handleClickAddFileButton" />
    <vs-icon
      v-if="!readonly"
      icon-pack="feather"
      icon="icon-upload"
      style="margin-top: 6px; margin-bottom: 6px; padding-left: 6px; padding-right: 6px; position: absolute; top: 0; right: 0; bottom: 0; font-size: 24px; border-left: 1px solid #cdcdcd"
      :style="file.id > 0 ? 'right:40px' : ''"
    ></vs-icon>
    <a v-if="file.id > 0" :href="file.path" target="_blank" style="position: absolute; top: 0; right: 0; bottom: 0; border-left: 1px solid #cdcdcd; margin-top: 6px; margin-bottom: 6px; padding-left: 6px; padding-right: 6px; color: #6670cb"
      >보기</a
    >
  </label>
</template>

<script>
export default {
  name: "FileUploader",
  props: {
    value: Object,
    readonly: Boolean,
    type: {
      type: String,
      default: "",
    },
  },
  watch: {
    value(data) {
      if (data) {
        this.file = {
          id: data.id,
          fileName: data.fileName,
          fileSize: data.fileSize,
          path: data.path,
          thumb: data.thumb,
        };
      }
    },
  },
  data() {
    return {
      id: "file_upload",
      file: {},
    };
  },
  created() {
    this.id = `file_input_${Math.floor(Math.random() * 10000)}`;

    if (this.value) {
      this.file = {
        id: this.value.id,
        fileName: this.value.fileName,
        fileSize: this.value.fileSize,
        path: this.value.path,
        thumb: this.value.thumb,
      };
    }
  },
  methods: {
    async file_upload(files) {
      if (files.length > 0) {
        await this.$store.dispatch("file/FILE_UPLOAD", files[0]);
        this.file = this.$store.state.file.uploadedFile;
        this.$emit("input", {
          id: this.file.id,
          fileName: this.file.fileName,
          fileSize: this.file.fileSize,
          path: this.file.path,
          thumb: this.file.thumb,
        });
      }
    },

    deleteImage(evt) {
      this.file = {};
      this.$emit("input");
      this.$emit("change");
      evt.preventDefault();
    },

    onClickImage() {
      if (this.file.path) {
        window.open(this.file.path, "_blank");
      }
    },

    onDrop(evt) {
      if (evt && evt.dataTransfer && evt.dataTransfer.files) {
        this.changeFile(evt.dataTransfer.files);
      }
      evt.preventDefault();
    },

    onDrag(evt) {
      evt.preventDefault();
    },

    handleClickAddFileButton() {
      if (this.readonly === false) {
        const inputFile = document.getElementById(this.id);
        inputFile.click();
      }
    },
    handleChangeFile(event) {
      this.changeFile(event.target.files);
    },
    changeFile(files) {
      this.file_upload(files);
      this.$emit("change");
      this.$refs.fileInput.value = null;
    },
  },
};
</script>

<style lang="scss" scoped>
.only-image {
  cursor: pointer;
  position: relative;

  border: 2px dashed #cdcdcd;
  border-radius: 6px;
  background-color: #f5f5f5;

  color: #3c3c3c;
  font-size: 18px;
  font-weight: bold;

  display: flex;
  align-items: center;
  justify-content: center;

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 6px;
  }
}
</style>

<style lang="scss">
.layout-input {
  & > div > input.vs-input--input.normal {
    padding-right: 45px !important;
  }

  &.file-input--has-file {
    & > div > input.vs-input--input.normal {
      padding-right: 85px !important;
    }
  }
}
</style>
