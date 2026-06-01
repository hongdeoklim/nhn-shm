<template>
  <vx-card>
    <vs-row class="mb-4">
      <vs-col class="flex" vs-justify="flex-end">
        <vs-button class="mr-2" color="secondary" type="border" @click="back">{{$t('button.목록')}}</vs-button>
        <vs-button class="" color="secondary" @click="register">수정</vs-button>
      </vs-col>
    </vs-row>

    <vs-row>
      <vs-col class="">
        <h5 class="mb-4"><i class="dot"></i>{{$t('content.community.qna.update.Q&A')}}</h5>
      </vs-col>
    </vs-row>

    <vs-row class="mb-8">
      <vs-col class="flex flex-wrap">

        <vs-row class="w-4/12 mb-4 grid" vs-align="center" style="grid-template-columns: 129px 1fr;">
          <vs-col >{{$t('content.community.qna.create.제목')}}</vs-col>
          <vs-col class="pr-4">
            <ml-input class="w-full" v-model="form.post_title"/>
          </vs-col>
        </vs-row>

        <vs-row class="w-4/12 mb-4 grid" vs-align="center" style="grid-template-columns: 129px 1fr;">
          <vs-col >문의분류</vs-col>
          <vs-col class="pr-4">
            <vs-select autocomplete class="w-full m-0" v-model="form.qna_type">
              <vs-select-item text="오류 및 버그 신고" value="error"/>
              <vs-select-item text="계정 문의" value="account"/>
              <vs-select-item text="협력업체 등록 문의" value="add_partner"/>
              <vs-select-item text="기술지원" value="support"/>
              <vs-select-item text="건의사항" value="suggestion"/>
              <vs-select-item text="기타" value="etc"/>
            </vs-select>
          </vs-col>
        </vs-row>

        <vs-row class="w-4/12">
          <vs-col>

          </vs-col>
        </vs-row>

        <vs-row class="w-4/12 mb-4 grid" vs-align="center" style="grid-template-columns: 129px 1fr;">
          <vs-col >{{$t('content.community.qna.create.작성자')}}</vs-col>
          <vs-col class="pr-4">
            <ml-input class="w-full" v-model="form.writer" :readonly="true"/>
          </vs-col>
        </vs-row>

        <vs-row class="w-4/12 mb-4 grid" vs-align="center" style="grid-template-columns: 129px 1fr;">
          <vs-col >연락처</vs-col>
          <vs-col class="pr-4">
            <ml-input class="w-full" v-model="form.phone" />
          </vs-col>
        </vs-row>

        <vs-row class="w-4/12 mb-4 grid" vs-align="center" style="grid-template-columns: 129px 1fr;">
          <vs-col >이메일</vs-col>
          <vs-col class="pr-4">
            <ml-input class="w-full" v-model="form.email" />
          </vs-col>
        </vs-row>

        <vs-row class="w-full mb-4 grid" vs-align="center" style="grid-template-columns: 129px 1fr;">
          <vs-col>{{$t('content.community.qna.create.내용')}}</vs-col>
          <vs-col class="pr-4">
            <quill-editor class="vx-col flex-1 ql-edit-text" v-model="form.content" :options="quillOption"></quill-editor>
          </vs-col>
        </vs-row>

      </vs-col>
    </vs-row>
    <vs-row>
      <vs-col>
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
  name: 'CommunityQnaUpdate',
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
      boardSlug: 'qna',
      boardId: 17,

      quillOption: {
        placeholder: '내용을 입력해주세요'
      },

      form: {
        post_title: '', //현장명
        writer: '', //작성자
        content: ''
      },
      fileList: []
    }
  },

  created () {
    this.loadPost()
  },

  methods:{
    back () {
      this.$router.back()
    },

    async loadPost () {
      const projectId = this.projectId
      const boardId = this.boardId
      const postId = this.$route.params.postId
      await this.$store.dispatch('board/LOAD_POST', {projectId, boardId, postId})

      // 내용
      const post = this.$store.state.board.postInfo
      this.form = JSON.parse(post.post_content)
      this.form.post_title = post.post_title
      const files = post.post_attachment
      if (files) {
        for (const file of files) {
          this.fileList.push({
            id: file.id,
            fileName: file.file_name,
            fileSize: file.file_size,
            path: file.path,
            thumb: file.thumb
          })
        }
      }
    },

    async register () {
      const boardId = this.boardId
      const postId = this.$route.params.postId
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

      const content = JSON.stringify(this.form)

      if (this.formCheck()) {
        await this.$store.dispatch('board/UPDATE_POST', {boardId, postId, title, content, uploads})

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
