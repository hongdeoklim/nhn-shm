<template>
  <label class="w-full h-full only-image" @click="onClickImage" @dragenter="onDrag" @dragover="onDrag" @drop="onDrop" :style="{ backgroundImage: `url(${!!file ? file.path : ''})` }">
    <div v-if="!!file">
      <div class="delete-button-container" @click.stop="deleteImage" v-if="!readonly">
        <img src="@/assets/images/icon/icon-close.svg" alt="close" />
      </div>
    </div>
    <div v-else class="upload-info-container">
      <div class="upload-icon mb-2"></div>
      <span class="upload-info-title">이미지 업로드</span>
      <span class="upload-info-subtitle">이미지를 드롭하거나 여기를 클릭하여 업로드하세요.</span>
      <input v-if="!readonly" :id="id" type="file" @change="handleChangeFile" style="display: none" accept="image/png, image/jpeg" />
    </div>
  </label>
</template>

<script>
export default {
  name: "FileUploaderTransparent2",
  props: {
    value: Object,
    readonly: Boolean,
  },
  data() {
    return { id: "file_upload", file: this.value };
  },
  watch: {
    value: {
      handler(value) {
        this.file = value;
      },
    },
    file: {
      immediate: true,
      deep: true,
      handler(value) {
        this.$emit("input", value);
      },
    },
  },
  created() {
    this.id = `file_input_${Math.floor(Math.random() * 10000)}`;
  },
  methods: {
    async file_upload(files) {
      if (files.length > 0) {
        this.$emit('progress', 'start')
        await this.$store.dispatch("file/FILE_UPLOAD", files[0]).then((data) => {
          this.$emit('progress', 'success', data)
        }).catch((err) => {
          this.$emit('progress', 'fail', err)
        });
        const data = this.$store.state.file.uploadedFile;
        this.file = data;
      }
    },

    deleteImage(evt) {
      this.file = null;
      evt.preventDefault();
    },

    onClickImage() {
      if (!!this.file) {
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

    handleChangeFile(event) {
      this.changeFile(event.target.files);
    },

    changeFile(files) {
      this.file_upload(files);
    },
  },
};
</script>

<style lang="scss" scoped>
.upload-info-container {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(8px);

  .upload-icon {
    width: 36px;
    height: 32px;
    background-image: url("~@/assets/images/icon/icon-file-upload.svg");
    background-size: contain;
  }

  .upload-info-title {
    font-size: 0.9em;
    font-weight: bold;
  }

  .upload-info-subtitle {
    font-size: 0.8em;
    font-weight: normal;
  }
}

.only-image {
  cursor: pointer;
  position: relative;

  background-color: rgba(255, 255, 255, 0.6);
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;

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

  .delete-button-container {
    position: absolute;
    top: -8px;
    right: -8px;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 24px;
    height: 24px;
    border-radius: 999px;
    border: 1px solid #222;

    > img {
      position: relative;
      width: 12px;
      height: 12px;
    }
  }
}
</style>
