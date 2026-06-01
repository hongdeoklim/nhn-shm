<template>
  <div>
    <vs-row class="">
      <vs-col class="mb-2 flex" vs-justify="flex-end" style="align-items: center;">
        <h5 v-if="isShowTitle"><i class="dot"></i>{{$t('file_upload_module.첨부파일')}}</h5>
        <vs-spacer/>
        <vs-button v-if="!readonly" class="small mr-2" color="secondary" type="border" @click="handleClickAddFileButton">{{$t('file_upload_module.파일추가')}}</vs-button>
        <vs-button v-if="!readonly" class="small" color="secondary" @click="handleRemoveFile">{{$t('file_upload_module.항목삭제')}}</vs-button>
      </vs-col>
      <vs-col class="flex">
        <vs-col class="mb-2" style="border:1px solid #cdcdcd; border-radius: 8px;">

          <vs-col v-if="fileList.length === 0" class="p-2" style="height:120px; overflow-y: auto">
            <label class="block pt-2 text-center" @dragenter="onDrag" @dragover="onDrag" @drop="onDrop">
              <svg  width="36" height="32" viewBox="0 0 36 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_12136_288649)">
                  <path d="M35.05 20.6125L29.1375 15.0688C28.9875 14.925 28.75 14.9375 28.6063 15.0875L27.7563 16C27.6125 16.15 27.625 16.3875 27.775 16.5312L31.4813 20.0063H24.2625L22.2625 24.0063H13.7375L11.7375 20.0063H4.525L8.23125 16.5312C8.38125 16.3875 8.3875 16.15 8.25 16L7.39375 15.0875C7.25 14.9375 7.0125 14.9313 6.8625 15.0688L0.95 20.6125C0.34375 21.175 0 21.9688 0 22.8V29C0 30.6562 1.34375 32 3 32H33C34.6562 32 36 30.6562 36 29V22.8C36 21.9688 35.6562 21.175 35.05 20.6125ZM34 29C34 29.55 33.55 30 33 30H3C2.45 30 2 29.55 2 29V23C2 22.45 2.45 22 3 22H10.5L12.5 26H23.5L25.5 22H33C33.55 22 34 22.45 34 23V29ZM26 8H22V1.5C22 0.675 21.325 0 20.5 0H15.5C14.675 0 14 0.675 14 1.5V8H10C8.225 8 7.325 10.1562 8.5875 11.4125L16.5875 19.4125C17.3687 20.1938 18.6375 20.1938 19.4188 19.4125L27.4188 11.4125C28.6688 10.1562 27.7812 8 26 8ZM18 18L10 10H16V2H20V10H26L18 18Z" fill="#7E72F2"/>
                </g>
                <defs>
                  <clipPath id="clip0_12136_288649">
                    <rect width="36" height="32" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
              <p class="mt-1" style="font-size:16px; color:#3C3C3C; font-weight: 700;">파일 업로드</p>
              <p class="mt-1" >파일을 드롭하거나 여기를 클릭하여 업로드하세요.</p>
            </label>
          </vs-col>

          <vs-col v-else class="p-2" style="height:120px; overflow-y: auto">
            <label class="flex" v-for="(file, index) in fileList" :key="index">
              <vs-checkbox class="mb-2" v-model="fileSelect[file.id]" @change="()=>{ handleChangeCheckBox(file) }">
                {{ file.fileName }} <span style="font-size:0.85rem; color:#cdcdcd;">({{file.fileSize}} bytes)</span>
              </vs-checkbox>
              <a :href="file.path" target="_blank" style="color:#6670CB">{{$t('file_upload_module.보기')}}</a>
            </label>
          </vs-col>
          <vs-col class="p-2" style="border-top:1px solid #cdcdcd; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; background-color:#F9F9F9;">
            선택 {{ selectedFileInfo ? selectedFileInfo.length : 0}}개 ({{selectFileSize}} Bytes), 전체 {{ fileList ? fileList.length : 0}}개 ({{totalFileSize}} Bytes)
          </vs-col>
        </vs-col>
      </vs-col>

    </vs-row>


  </div>
</template>

<script>

export default {
  name: 'TemplateFileUploadCheckListCol',
  props: {
    isShowTitle: Boolean,
    fileList: Array,
    readonly: Boolean,
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

    handleRemoveFile () {
      this.$emit('handleRemoveFile', this.selectedFileInfo)
      this.selectedFileInfo = []
      this.selectFileSize = this.getSelectFileSize()
      this.allCheck = (this.selectedFileInfo.length !== 0 && (this.selectedFileInfo.length === this.fileList.length))
    },

    onDrop (evt) {
      if (evt && evt.dataTransfer && evt.dataTransfer.files) {
        this.$emit("dragFile", evt.dataTransfer.files)
      }
      evt.preventDefault()
    },

    onDrag (evt) {
      evt.preventDefault()
    },
  }
}
</script>

<style scoped>

</style>
