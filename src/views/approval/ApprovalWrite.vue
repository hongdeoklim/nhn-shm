<template>

  <div class="centerx">

    <vx-card class="p-6 mb-4">
      <div class="w-full flex" slot="no-body">
        <h5 class="mr-auto flex items-center" ><b>결재문서 작성</b></h5>
      </div>
    </vx-card>


    <vx-card>

      <div class="vx-row">
        <div class="vx-col w-full">

          <!--            결재라인-->
          <div class="">

            <div class="approvalWrap">
              <div class="approvalTitle v-center">결<br/><br/>재</div>

              <div class="approvalCell">
                <span class="approvalHeader v-center">상신</span>
                <div class="approvalContent v-center">
                  <span>{{author.name}}</span>
                </div>
              </div>

              <div v-for="(item, indexItem) in approvalLine" class="approvalCell">
                <span v-if="item.elementType==='approval'" class="approvalHeader v-center">결재</span>
                <span v-else class="approvalHeader v-center">합의</span>
                <div class="approvalContent v-center">
                  <span>{{item.name}}</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      <div class="flex flex-wrap items-center justify-between">
        <ml-input class="my-5 w-full" v-model="titleInput" @keyup.enter="titleInput = ''" label="제목" />
      </div>

      <div class="flex flex-wrap items-center vx-row">
        <ml-input class="vx-col w-1/2" label="기안일자" v-model="approvalDate" disabled="true"/>

        <ml-input class="vx-col w-1/2" label="기안자" v-model="author.name" disabled="true"/>
      </div>

<!--      보안 및 중요도-->
      <div class="flex flex-wrap items-center vx-row mt-3">
        <vs-select id="tableSelect1" autocomplete label="보안등급" v-model="selectSecurity" class="vx-col w-1/2"
                   @change="handleChangeSecurity">
          <vs-select-item :key="index" :value="item.code" :text="item.name"
                          v-for="(item,index) in securityArray"/>
        </vs-select>

        <vs-select id="tableSelect2" autocomplete label="중요도" v-model="selectPriority" class="vx-col w-1/2"
                   @change="handleChangePriority">
          <vs-select-item :key="index" :value="item.code" :text="item.name"
                          v-for="(item,index) in priorityArray"/>
        </vs-select>
      </div>


<!--      본문-->
      <div class="flex flex-wrap items-center vx-row mt-5">
        <quill-editor class="vx-col flex-1 ql-edit-text" v-model="contentInput" :options="quillOption"></quill-editor>
      </div>

      <!--    파일첨부-->
      <div class="mt-3">
        <vs-upload ref="vs_upload" :action="`${baseAPIUrl}/api/v1/file`"
                   :headers="headerToken" @change="changeFiles" @on-success="successUpload" @on-delete="deleteUpload"
                   automatic file-name="file_data" :show-upload-button="false" limit="5"></vs-upload>
      </div>

      <div class="flex flex-wrap items-center justify-center">
        <vs-button class="" @click="popupActive=true" type="border">결재선</vs-button>
        <vs-button class="ml-5" @click="onClickConfirm">결재요청</vs-button>
<!--        <vs-button class="ml-5" @click="onClickWriteCancel" type="border">취소</vs-button>-->
      </div>

    </vx-card>

    <popup-approval-process
      v-model="approvalLine"
      :show-popup="popupActive"
      @closePopup="handleCloseApprovalPopup" />
  </div>


<!--    <vs-button @click="popupActive=true" color="primary" type="filled">Open Popup</vs-button>-->

</template>

<script>
import config from '/public/config'
import moduleDataList from '@/store/approval-data-list/moduleApprovalList.js'
import VueCookie from 'vue-cookie'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
import PopupApprovalProcess from '@/views/approval/PopupApprovalProcess'
import HttpRequest from '@/util/HttpRequest'
export default {
  name: 'ApprovalWrite',
  components: {PopupApprovalProcess, quillEditor},
  data () {
    return {
      baseAPIUrl: config.BASE_API_URL,
      popupActive: false, // 기안 결재선

      titleInput: '',
      fileName:'',
      summary:'',
      contentInput: '',
      quillOption : {
        placeholder : '내용을 입력해주세요 ...'
      },

      files: [], // 파일첨부
      uploadFiles: [], // {id, isRemove}

      // 결재라인
      approvalLine:[],
      approvalDate:'',
      author: '',

      // 보안 및 중요도
      securityArray:[],
      priorityArray:[],
      selectSecurity:{},
      selectPriority:{},

      headerToken:{}
    }
  },

  async created () {
    // file upload 시  xmlrequest에서 헤더를 붙이기 위함
    this.headerToken = {
      Authorization: `Bearer ${  VueCookie.get('token')}`
    }

    // 작성일
    const currentDate = new Date()
    const month = Number(currentDate.getMonth()) + 1
    this.approvalDate = `${currentDate.getFullYear()  }.${  month  }.${  currentDate.getDate()}`

    // 유저정보
    this.author = this.$store.state.auth.userInfo
    if (!this.author.email || !this.author.is_activated) {
      const loginResult = await this.$store.dispatch('USER_INFO')
      if (typeof loginResult.error !== 'undefined' && loginResult.error !== null) {
        alert(loginResult.error)
      } else {
        this.author = this.$store.state.auth.userInfo
      }
    }

    // 보안 및 중요도 얻기
    if (!this.$store.hasModule('approvalList')) {
      this.$store.registerModule('approvalList', moduleDataList)
    }

    await this.$store.dispatch('approvalList/LOAD_APPROVAL_SECURITYLIST')
    await this.$store.dispatch('approvalList/LOAD_APPROVAL_PRIORITYLIST')

    this.securityArray = await this.$store.state.approvalList.securityList
    this.priorityArray = await this.$store.state.approvalList.priorityList

    if (this.securityArray.length > 0) {
      this.selectSecurity = this.securityArray[0].code
    }
    if (this.priorityArray.length > 0) {
      this.selectPriority = this.priorityArray[0].code
    }
  },

  methods: {
    // 결재 팝업 싱크
    popupActiveSync (newValue) {
      this.popupActive = newValue
    },

    // 결재 선택 전송
    handleCloseApprovalPopup (data) {
      this.popupActive = false
    },

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

    // select
    handleChangeSecurity (value) {
      this.selectSecurity = value
    },
    handleChangePriority (value) {
      this.selectPriority = value
    },

    onClickConfirm () {

      if (!this.approvalLine || this.approvalLine.length == 0) {
        alert('결재선이 지정되지 않았습니다.')
        return
      }

      const params = {
        title: this.titleInput, // 게시글 제목
        content: this.contentInput, // 게시글 내용
        approvalLine: JSON.stringify(this.approvalLine), // 결재선 정의
        security: this.selectSecurity, // 문서보안 등급
        priority: this.selectPriority // 문서 중요도
      }

      // 파일첨부시
      if (this.files.length > 0) {

        const upload = []
        for (let i = 0; i < this.files.length; i++) {
          // remove 되지 않은 파일만 추가
          if (this.files[i].remove === undefined || this.files[i].remove === false) {
            upload.push(this.uploadFiles[i])
          }
        }

        if (upload.length > 0) {
          params.uploads = JSON.stringify(upload)
        }
      }


      // 보드id
      const boardId = this.$constant.BOARD_ID_APPROVAL

      return new Promise((resolve, reject) => {
        HttpRequest.put(`/api/v1/approval/document/${  boardId}`, params)
          .then(response => {
            this.$router.go(-1)
            resolve(response)
          }).catch(err => {
            reject(err)
          })
      })
    },
    onClickWriteCancel () {
      // this.$router.push({ path: 'notice' });
    }

  }
}
</script>

<style scoped>
  .approvalWrap {
    display: flex;
    text-align: center;
    justify-content: flex-end;
  }
  .approvalTitle {
    width: 30px;
    font-weight: bold;
    border: 1px solid #333;
    background-color: #efefef;
  }
  .approvalWrap>.approvalCell {
    width:100px;
    border : 1px solid #333;
    border-left: none;
    display: grid;
    grid-template-rows : 30px auto;
  }
  .approvalHeader {
    border-bottom: 1px solid #333;
    background-color: #efefef;
    font-weight: bold;
  }
  .approvalContent {
    height: 80px;
  }
  .v-center {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .approvalStatus {
    font-weight: bold;
  }
</style>

<style>
  .ql-edit-text .ql-editor {
    overflow-y: scroll;
    resize: vertical;
    min-height: 20em;
  }
</style>
