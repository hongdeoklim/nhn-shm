<template>

  <div class="centerx">
    <vx-card class="p-6 mb-4">
      <div class="w-full flex" slot="no-body">
        <h5 class="mr-auto flex items-center"><b>공지사항</b></h5>
      </div>
    </vx-card>

    <vx-card>

      <div class="flex flex-wrap items-center justify-between">
        <ml-input class="my-5 w-full" v-model="titleInput" @keyup.enter="titleInput = ''" label="제목"/>
      </div>


      <div class="flex flex-wrap items-center vx-row mt-5">
        <quill-editor class="vx-col flex-1 ql-edit-text" v-model="contentInput" :options="quillOption"></quill-editor>
      </div>
      <!--    파일첨부-->
      <div>
        <vs-upload ref="vs_upload" :action="`${baseAPIUrl}/api/v1/file`"
                   :headers="headerToken" @change="changeFiles" @on-success="successUpload" @on-delete="deleteUpload"
                   automatic file-name="file_data" :show-upload-button="false" limit="5"></vs-upload>
        <!--      <file-input v-for="(file, index) of files" :fileIndex="index" :files="file" @addFile="addFile" @delFile="delFile" :key="index"></file-input>-->
      </div>

      <div class="flex flex-wrap items-center justify-center">
        <vs-button class="my-5" @click="onClickConfirm">작성</vs-button>
        <vs-button class="ml-5" @click="onClickWriteCancel" type="border">취소</vs-button>
      </div>

    </vx-card>
  </div>

</template>

<script>
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import config from '/public/config'
import {quillEditor} from 'vue-quill-editor'
import VueCookie from 'vue-cookie'
import HttpRequest from '@/util/HttpRequest'

export default {
  components: {
    // FileInput,
    quillEditor
  },
  data () {
    return {
      baseAPIUrl: config.BASE_API_URL,
      titleInput: '',
      fileName: '',
      summary: '',
      author: '',
      contentInput: '',
      quillOption: {
        placeholder: '내용을 입력해주세요 ...'
      },

      files: [], // vs-upload files
      uploadFiles: [], // {id, isRemove}

      headerToken: {}
    }
  },

  created () {
    // file upload 시  xmlrequest에서 헤더를 붙이기 위함
    this.headerToken = {
      Authorization: `Bearer ${  VueCookie.get('token')}`
    }
  },

  methods: {
    // file upload 완료시 이빈트
    successUpload (event) {
      // response
      let response = event.currentTarget.response
      response = JSON.parse(response)
      const uploadFileID = response.id

      this.uploadFiles.push(uploadFileID)
    },

    deleteUpload () {
      this.changeFiles('', this.$refs.vs_upload.filesx)
    },

    // upload시 파일
    changeFiles (path, files) {
      this.files = files
    },


    async sendWriteData () {

      const params = {
        title: this.titleInput,
        content: this.contentInput
      }

      if (this.files.length > 0) {

        const upload = []
        for (let i = 0; i < this.files.length; i++) {
          // remove 되지 않은 파일만 추가
          if (!this.files[i].remove || this.files[i].remove === false) {
            upload.push(this.uploadFiles[i])
          }

        }

        params.uploads = JSON.stringify(upload)
      }

      const boardId = this.$constant.BOARD_ID_NOTICE
      return new Promise((resolve, reject) => {
        HttpRequest.put(`/api/v1/board/post/${  boardId}`, params)
          .then(response => {
            this.$router.push({path: 'notice'})
            resolve(response)
          }).catch(err => reject(err))
      })
    },

    onClickConfirm () {
      this.sendWriteData()
    },
    onClickWriteCancel () {
      this.$router.go(-1) // 뒤로
    },


    addFile (file, index) {
      this.files[index] = file[0]

      for (let i = 0; i < this.files.length; i++) {
        if (this.files[i].name === undefined) {
          return
        }
      }

      this.files.push({})
    },

    delFile (index) {
      this.files.splice(index, 1)

      for (let i = 0; i < this.files.length; i++) {
        if (this.files[i].name === undefined) {
          return
        }
      }

      this.files.push({})
    }
  }
}
</script>

<style>
  .ql-edit-text .ql-editor {
    overflow-y: scroll;
    resize: vertical;
    min-height: 20em;
  }
</style>

