<template>
  <label v-if="type === 'only-image'" class="w-full h-full only-image " @click="onClickImage">
    <input v-if="!readonly && !file.path" :id="id" type="file" @change="handleChangeFile" style="display: none;" accept="image/png, image/jpeg">
    <img v-if="file.path" :src="file.path" class="img"/>
    <div v-if="!file.path" class="content-upload">
      <vs-icon icon-pack="feather" icon="icon-image" style="font-size: 30px; margin-bottom: 8px;"></vs-icon>
      <p>이미지 업로드</p>
      <p>이미지를 드롭하거나 여기를 클릭하여 업로드하세요.</p>
    </div>
  </label>
  <label v-else style="display: flex; position: relative">
    <input :id="id" type="file" @change="handleChangeFile" style="display: none;" accept="image/png, image/jpeg">
    <ml-input class="w-full file-input" readonly :value="file.fileName" @click="handleClickAddFileButton"/>
    <vs-icon icon-pack="feather" icon="icon-upload"
             style="margin-top:6px; margin-bottom:6px; padding-left:6px; padding-right:6px; position: absolute; top:0; right:0; bottom:0; font-size:24px; border-left: 1px solid #cdcdcd;"
             :style="(file.id > 0) ? 'right:40px' : ''"
    ></vs-icon>
    <a v-if="file.id > 0" :href="file.path" target="_blank"
       style="position: absolute; top:0; right:0; bottom:0; border-left: 1px solid #cdcdcd; margin-top:6px; margin-bottom:6px; padding-left:6px; padding-right:6px; color:#6670CB"
    >보기</a>
  </label>
</template>

<script>
export default {
  name: 'FileUploaderImg',
  props:{
    value:Object,
    readonly:Boolean,
    type:{
      type: String,
      default: ''
    }
  },
  watch : {
    value (data) {

      if (data) {
        this.file = {
          id:data.id,
          fileName:data.fileName,
          fileSize:data.fileSize,
          path:data.path,
          thumb:data.thumb
        }
      }

    }
  },
  data () {
    return {
      id:'file_upload',
      file:{}
    }
  },
  created () {
    this.id = `file_input_${Math.floor(Math.random() * 10000)}`

    if (this.value) {
      this.file = {
        id:this.value.id,
        fileName:this.value.fileName,
        fileSize:this.value.fileSize,
        path:this.value.path,
        thumb:this.value.thumb
      }
    }
  },
  methods: {
    async file_upload (files) {
      if (files.length > 0) {
        await this.$store.dispatch('file/FILE_UPLOAD', files[0])
        this.file = this.$store.state.file.uploadedFile
        this.$emit('input', {
          id:this.file.id,
          fileName:this.file.fileName,
          fileSize:this.file.fileSize,
          path:this.file.path,
          thumb:this.file.thumb
        })
      }
    },

    onClickImage () {
      if (this.file.path) {
        window.open(this.file.path, '_blank')
      }
    },

    handleClickAddFileButton () {
      if (this.readonly === false) {
        const inputFile = document.getElementById(this.id)
        inputFile.click()
      }
    },
    handleChangeFile (event) {
      this.file_upload(event.target.files)
      this.$emit('change')
    }
  }
}
</script>

<style lang="scss" scoped>
.only-image {
  cursor:pointer;
  position: relative;

  border: 2px dashed #cdcdcd;
  border-radius: 6px;
  background-color: transparent;

  color: #3c3c3c;
  font-size: 18px;
  font-weight: bold;

  display: flex;
  align-items: center;
  justify-content: center;

  .img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 6px;
  }
  .content-upload{
    display: grid;
    place-content: center;
    text-align: center;
    .img-icon{
      margin: 0 auto;
      width: 30px;
      height: 30px;
    }
  }
}
</style>
