<template>
  <vx-card>
    <vs-row class="mb-4">
      <vs-col class="flex" vs-justify="flex-end">
        <vs-button class="mr-2" color="secondary" type="border" @click="back">{{$t('button.목록')}}</vs-button>
        <vs-button class="" color="secondary" @click="register">{{$t('button.등록')}}</vs-button>
      </vs-col>
    </vs-row>

    <vs-row>
      <vs-col class="">
        <h5 class="mb-4"><i class="dot"></i>{{$t('content.community.businessnews.create.CEO 메세지')}}</h5>
      </vs-col>
    </vs-row>

    <vs-row class="mb-8">
      <vs-col class="flex flex-wrap">
        <vs-row class="w-1/2 mb-4 grid" vs-align="center" vs-justify="center" style="grid-template-columns: 129px 1fr;">
          <vs-col >{{$t('content.community.businessnews.create.제목')}}</vs-col>
          <vs-col>
            <ml-input class="w-full" v-model="form.post_title"/>
          </vs-col>
        </vs-row>
        <vs-row class="w-1/2 mb-4 grid" vs-align="center" vs-justify="center" style="grid-template-columns: 129px 1fr;">
          <vs-col class="text-center">{{$t('content.community.businessnews.create.작성자')}}</vs-col>
          <vs-col>
            <ml-input class="w-full" v-model="form.writer" :readonly="true"/>
          </vs-col>
        </vs-row>

        <vs-row class="w-full mb-4 grid" vs-align="center" vs-justify="center" style="grid-template-columns: 129px 1fr;">
          <vs-col>{{$t('content.community.businessnews.create.내용')}}</vs-col>
          <vs-col>
            <quill-editor class="vx-col flex-1 ql-edit-text" v-model="form.content" :options="quillOption"></quill-editor>
          </vs-col>
        </vs-row>


        <file-upload-module class="w-full" v-model="fileList"></file-upload-module>

      </vs-col>
    </vs-row>


  </vx-card>
</template>

<script>

import FileUploadModule from '@/views/modules/FileUploadModule'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import {quillEditor} from 'vue-quill-editor'

export default {
  name: 'CommunityBusinesssnewsCreate',
  components: {
    FileUploadModule,
    quillEditor
  },
  computed: {
    projectId () {
      return this.$route.params.proj_id
    },
  },
  data () {
    return {
      boardSlug: 'news',
      boardId: 16,

      quillOption: {
        placeholder: '내용을 입력해주세요'
      },

      form: {
        post_title: '', //현장명
        writer: '', //작성자
        content: '',
        parentId: ''
      },
      fileList: []
    }
  },

  created () {
    this.init()
  },

  methods:{
    back () {
      this.$router.back()
    },

    async init () {
      await this.$store.dispatch('USER_INFO')
      this.form.writer = this.$store.state.auth.userInfo.name
    },

    async register () {
      const projectId = this.projectId
      const boardId = this.boardId
      const title = this.form.post_title

      let uploads = ''
      const listUploads = []
      const uploadFileIds = []

      if (this.fileList.length > 0) {
        for (const file of this.fileList) {
          listUploads.push(file)
          uploadFileIds.push(file.id)
        }
        uploads = JSON.stringify(uploadFileIds)
      }

      this.form.parentId = 0
      const content = JSON.stringify(this.form)

      if (this.formCheck()) {
        await this.$store.dispatch('board/CREATE_POST', {
          projectId,
          boardId,
          title,
          content,
          uploads
        })

        this.$router.back()
      }

    },

    formCheck () {
      if (this.form.post_title.trim().length <= 0) {
        alert('제목을 입력해주세요')
        return false
      }

      return true
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
