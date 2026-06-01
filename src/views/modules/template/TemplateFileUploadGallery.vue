<template>
  <div>
    <vs-row class="">
      <vs-col v-if="!isPrint" class="mb-2 flex" style="align-items: center;">
        <vs-button v-if="!readonly" class=" mr-2" color="secondary"  @click="handleClickAddFileButton">{{$t('file_upload_module.파일추가')}}</vs-button>
      </vs-col>
      <vs-col class="grid" style="gap:8px;" :style="getStyle">
        <div v-for="(file, index) in fileList" :key="index"
             style="position: relative;  "
              :class="isPrint ? '' : 'border'">
          <a :href="file.path" target="_blank" style="width:100%;">
            <img :src="file.path" style="width:100%;"/>
          </a>
          <label v-if="!readonly" style="position: absolute; top:0; right:0; width: 32px; height:32px; cursor: pointer;
                      color: #fff; background-color: rgb(102,112,203);
                      display: flex; align-items: center; justify-content: center; "

                      @click="handleRemoveFile(file)">
            <feather-icon icon="XIcon" />
          </label>
        </div>
      </vs-col>

    </vs-row>


  </div>
</template>

<script>

export default {
  name: 'TemplateFileUploadGallery',
  props: {
    isShowTitle: Boolean,
    fileList: Array,
    readonly: Boolean,
    multiStage: Number,
    isPrint: Boolean
  },
  watch : {
    fileList () {
      this.initFileList(this.fileList)
      this.selectFileSize = this.getSelectFileSize()
    }
  },
  computed: {
    totalFileSize () {
      let totalFileSize = 0

      if (this.fileList) {
        for (const file of this.fileList) {
          totalFileSize += file.fileSize
        }
      }
      return totalFileSize
    },
    getStyle () {
      const multiStage = this.multiStage > 0 ? this.multiStage : 1
      return {
        gridTemplateColumns: `repeat(${multiStage}, 1fr)`
      }
    }
  },
  data () {
    return {
      selectFileSize: 0,
      fileSelect: [], // 파일체크 여부 (v-model용)
      selectedFileInfo: [], //체크한 파일정보
      allCheck: false
    }
  },
  created () {
    this.initFileList(this.fileList)
  },
  methods:{

    initFileList (fileList) {
      if (fileList) {
        const list = []
        for (const file of fileList) {
          list[file.id] = 0
        }
        this.fileSelect = list
      }
    },

    getSelectFileSize () {
      let totalFileSize = 0
      for (const file of this.selectedFileInfo) {
        totalFileSize += file.fileSize
      }

      return totalFileSize
    },

    handleChangeAllCheckBox () {
      this.selectedFileInfo = []
      this.fileSelect = []
      this.selectFileSize = 0

      if (this.allCheck) {

        for (const file of this.fileList) {
          this.fileSelect[file.id] = true
          this.selectedFileInfo[this.selectedFileInfo.length] = file
          this.selectFileSize += file.fileSize
        }

      }
    },
    handleChangeCheckBox (file) {

      if (this.selectedFileInfo.indexOf(file) >= 0) {
        this.selectedFileInfo.remove(file)
      } else {
        this.selectedFileInfo[this.selectedFileInfo.length] = file
      }
      this.selectFileSize = this.getSelectFileSize()

      this.allCheck = (this.selectedFileInfo.length !== 0 && (this.selectedFileInfo.length === this.fileList.length))

    },
    handleClickAddFileButton () {
      this.$emit('handleClickAddFileButton')
    },

    handleChangeFile () {
      this.$emit('handleChangeFile')
    },

    handleRemoveFile (object) {
      this.$emit('handleRemoveFile', [object])
    }
  }
}
</script>

<style scoped>
.border {
  border: 1px solid #cdcdcd;
}
</style>
