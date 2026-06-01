<template>
  <div>

    <vs-row>
      <vs-col class="header-tool mb-8" vs-type="flex" vs-justify="flex-end">
        <router-link to="#" class="mr-4">&lt; 이전글</router-link>|
        <router-link to="#" class="ml-4">다음글 &gt;</router-link>
      </vs-col>
    </vs-row>

    <vx-card class="mb-8">

      <!--    제목-->
      <vs-row class="read-layout">
        <vs-col class="read-layout-title">제목</vs-col>
        <vs-col>
          <ml-input v-if="isFixedMode" class="w-full" v-model="titleInput" @keyup.enter="titleInput = ''"
                    placeholder="Title"/>
          <span v-else class="ql-font-serif float-left">{{notice.post_title}}</span>
        </vs-col>
      </vs-row>

      <!--    작성자-->
      <vs-row class="read-layout-2">
        <vs-col class="read-layout-title">작성자</vs-col>
        <vs-col class="mr-8">
          <span v-if="author" class="text-sm">{{author.username}}</span>
          <span v-else class="text-sm">비회원</span>
        </vs-col>
        <vs-col class="read-layout-title">작성일</vs-col>
        <vs-col>
          <span class="text-sm">{{notice.created_at}}</span>
        </vs-col>
      </vs-row>

      <!--    구분선 -->
      <vs-divider></vs-divider>

      <!--    내용-->
      <vs-row class="read-layout">
        <vs-col class="read-layout-title top">내용</vs-col>
        <vs-col>
          <quill-editor class="ql-edit-text" v-if="isFixedMode" v-model="contentInput"
                        :options="quillOption"></quill-editor>
          <div class="content-read" v-else v-html="notice.post_content"></div>
        </vs-col>
      </vs-row>

      <!--    구분선 -->
      <vs-divider></vs-divider>


      <!--    첨부파일-->
      <vs-row class="read-layout">
        <vs-col class="read-layout-title top">첨부파일</vs-col>
        <vs-col>
          <vs-upload v-if="isFixedMode" class="fix-vs-upload" ref="vs_upload"
                     :action="`${baseAPIUrl}/api/v1/file`"
                     :headers="headerToken" @change="changeFiles" @on-success="successUpload" @on-delete="deleteUpload"
                     automatic file-name="file_data" :show-upload-button="false" limit="5"></vs-upload>
          <vs-upload v-else class="read-vs-upload" ref="vs_upload" :show-upload-button="false" disabled></vs-upload>
        </vs-col>
      </vs-row>

      <vs-row v-if="!isFixedMode && prevPostId !== 0" class="read-layout-footer">
        <vs-col class="read-layout-title">이전글</vs-col>
        <vs-col class="h-full pl-8">
          <span @click="movePrevPost">{{prevPostTitle}}</span>
        </vs-col>
      </vs-row>

      <vs-row v-if="!isFixedMode && nextPostId !== 0" class="read-layout-footer">
        <vs-col class="read-layout-title">다음글</vs-col>
        <vs-col class="h-full pl-8">
          <span @click="moveNextPost">{{nextPostTitle}}</span>
        </vs-col>
      </vs-row>

    </vx-card>

    <!-- 댓글 달기 -->
    <vx-card class="add-comment mb-wide">
      <vs-row>
        <vs-col class="">
          <ml-textarea class="mb-0" rows="3" />
        </vs-col>
        <vs-col class="col-fix-buttons" vs-type="flex" vs-justify="center" vs-align="center">
          <vs-button color="secondary">등록하기</vs-button>
        </vs-col>
      </vs-row>
    </vx-card>

    <!--
      버튼 리스트 (수정페이지)
          본인 : 저장 / 취소
          그외 : 접근 불가
     -->
    <vs-row v-if="isFixedMode" class="mb-wide">
      <vs-col >
        <vs-button class="my-5" @click="onClickFixConfirm">저장</vs-button>
        <vs-button class="ml-5" @click="onClickFixCancel" type="border">취소</vs-button>
      </vs-col>
    </vs-row>

    <!--
      버튼 리스트 (상세페이지)
          본인 : 수정 / 삭제 / 목록
          그외 : 목록
    -->
    <vs-row v-else class="mb-big-wide" vs-type="flex">
      <vs-col class="vs-button-list-left">
        <vs-row >
          <!-- 작성자인 경우 -->
          <vs-col v-if="isAuthor">
            <vs-button class="mr-2" color="secondary" type="border" @click="sendDeleteData">삭제</vs-button>
          </vs-col>
        </vs-row>
      </vs-col>
      <vs-col class="vs-button-list-right">
        <vs-row >
          <!-- 작성자인 경우 -->
          <vs-col v-if="isAuthor">
            <vs-button class="mr-2" type="border" @click="onClickBack">목록</vs-button>
            <vs-button class="mr-2" type="border" >글쓰기</vs-button>
            <vs-button class="mr-2" type="border" >답글</vs-button>
            <vs-button class="" color="secondary" @click="onClickFix">수정</vs-button>
          </vs-col>

          <!-- 작성자가 아닌 경우 -->
          <vs-col v-else>
            <vs-button class="" type="border" @click="onClickBack">목록</vs-button>
          </vs-col>
        </vs-row>
      </vs-col>
    </vs-row>

    <!--  댓글  -->
    <vx-card class="p-6 mb-wide">
      <div class="w-full flex" slot="no-body">
        <h5 class="mr-auto flex items-center">
          <b>댓글목록</b>
          <b class="ml-2 secondary">3</b>
        </h5>
      </div>
    </vx-card>

    <vx-card v-if="!isFixedMode" >

      <div class="comment-item comment-item-0">
        <vs-row class="comment-view mb-4">
          <vs-col>
            <vs-row class="comment-view-body">
              <vs-col class="col-img" >
                <vs-images hover="zoom" >
                  <vs-image class="w-full h-full" src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQvEN7nrZtF_Alf0hUaaPnNSS3tGlffJFbjBA&usqp=CAU"></vs-image>
                </vs-images>
              </vs-col>
              <vs-col class="pl-4" vs-type="grid" vs-align="center">
                <vs-col >
                  <span>작성자</span>
                  <span class="ml-8">2020-02-02</span>
                  <span class="ml-8">20:20</span>
                </vs-col>
                <vs-col>마엇의 관리자 페이지가 오픈했습니다. 편리하게 이용하는 방법을 소개합니다!</vs-col>
              </vs-col>

            </vs-row>
          </vs-col>
          <vs-col class="col-fix-buttons " vs-type="flex" vs-align="center" vs-justify="flex-end">
            <vs-button class="mr-2" color="#eaeaea" text-color="black" @click="(event)=>{ openWrite(event, '0') }">답글</vs-button>
            <vs-button class="mr-2" type="border" text-color="black" @click="(event)=>{ openWrite(event, '0') }">수정</vs-button>
            <vs-button class="" color="#eaeaea" text-color="black">삭제</vs-button>
          </vs-col>
        </vs-row>

        <vs-row class="comment-write" vs-type="flex">
          <ml-textarea class="w-full" rows="2" />
          <vs-button class="ml-auto mr-2" color="secondary" >등록</vs-button>
          <vs-button type="border" @click="(event)=>{ closeWrite(event, '0') }">취소</vs-button>
        </vs-row>

      </div>

      <div class="comment-item comment-item-1 sub-1">
        <vs-row class="comment-view mb-4">
          <vs-col>
            <vs-row class="comment-view-body">
              <vs-col class="col-img" >
                <vs-images hover="zoom" >
                  <vs-image class="w-full h-full" src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQvEN7nrZtF_Alf0hUaaPnNSS3tGlffJFbjBA&usqp=CAU"></vs-image>
                </vs-images>
              </vs-col>
              <vs-col class="pl-4" vs-type="grid" vs-align="center">
                <vs-col >
                  <span>작성자</span>
                  <span class="ml-8">2020-02-02</span>
                  <span class="ml-8">20:20</span>
                </vs-col>
                <vs-col>마엇의 관리자 페이지가 오픈했습니다. 편리하게 이용하는 방법을 소개합니다!</vs-col>
              </vs-col>

            </vs-row>
          </vs-col>
          <vs-col class="col-fix-buttons " vs-type="flex" vs-align="center" vs-justify="flex-end">
            <vs-button class="mr-2" color="#eaeaea" text-color="black" @click="(event)=>{ openWrite(event, '1') }">답글</vs-button>
            <vs-button class="mr-2" type="border" text-color="black" @click="(event)=>{ openWrite(event, '1') }">수정</vs-button>
            <vs-button class="" color="#eaeaea" text-color="black">삭제</vs-button>
          </vs-col>
        </vs-row>

        <vs-row class="comment-write" vs-type="flex">
          <ml-textarea class="w-full" rows="2" />
          <vs-button class="ml-auto mr-2" color="secondary" >등록</vs-button>
          <vs-button type="border" @click="(event)=>{ closeWrite(event, '1') }">취소</vs-button>
        </vs-row>

      </div>

      <div class="comment-item comment-item-2 sub-2">
        <vs-row class="comment-view mb-4">
          <vs-col>
            <vs-row class="comment-view-body">
              <vs-col class="col-img" >
                <vs-images hover="zoom" >
                  <vs-image class="w-full h-full" src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQvEN7nrZtF_Alf0hUaaPnNSS3tGlffJFbjBA&usqp=CAU"></vs-image>
                </vs-images>
              </vs-col>
              <vs-col class="pl-4" vs-type="grid" vs-align="center">
                <vs-col >
                  <span>작성자</span>
                  <span class="ml-8">2020-02-02</span>
                  <span class="ml-8">20:20</span>
                </vs-col>
                <vs-col>마엇의 관리자 페이지가 오픈했습니다. 편리하게 이용하는 방법을 소개합니다!</vs-col>
              </vs-col>

            </vs-row>
          </vs-col>
          <vs-col class="col-fix-buttons " vs-type="flex" vs-align="center" vs-justify="flex-end">
            <vs-button class="mr-2" color="#eaeaea" text-color="black" @click="(event)=>{ openWrite(event, '2') }">답글</vs-button>
            <vs-button class="mr-2" type="border" text-color="black" @click="(event)=>{ openWrite(event, '2') }">수정</vs-button>
            <vs-button class="" color="#eaeaea" text-color="black">삭제</vs-button>
          </vs-col>
        </vs-row>

        <vs-row class="comment-write" vs-type="flex">
          <ml-textarea class="w-full" rows="2" />
          <vs-button class="ml-auto mr-2" color="secondary" >등록</vs-button>
          <vs-button type="border" @click="(event)=>{ closeWrite(event, '2') }">취소</vs-button>
        </vs-row>

      </div>

    </vx-card>

  </div>
</template>

<script>
import config from '/public/config'
import moduleDataList from '@/store/notice-data-list/moduleNoticeList.js'
import VueCookie from 'vue-cookie'
import HttpRequest from '@/util/HttpRequest'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import {quillEditor} from 'vue-quill-editor'
import FileInput from '../../../components/custom/FileInput'

export default {
  name: 'NoticeContent',
  components: {
    FileInput,
    quillEditor
  },
  data () {
    return {
      baseAPIUrl: config.BASE_API_URL,
      notice: {},
      author: {},

      isFixedMode: false,
      titleInput: '',
      contentInput: '',
      quillOption: {
        placeholder: '내용을 입력해주세요 ...'
      },
      attachment: [],
      headerToken: {
        authorization: 'Bearer '
      },

      files: [], // vs-upload files
      uploadFiles: [], // {id, isRemove}

      activeUserInfo: {}, // 유저정보
      isAuthor: false,

      boardId:0, // 게시판 번호
      postId:0, // 공지사항 번호
      prevPostId:0, // 이전 공지사항 번호
      prevPostTitle:'', // 이전 공지사항 제목
      nextPostId:0, // 다음 공지사항 번호
      nextPostTitle:'', // 다음 공지사항 제목

      // 이전글 id, 다음글 id를 구하기 위해서 사용됨
      tableCurrentPage:0, // 현재 페이지 번호
      tablePerPage:0, // 페이지당 노출되는 게시물 개수
      tableSearchKeyword:'', // 검색어
      tablePrevPage:0,
      tableNextPage:0
    }
  },

  created () {
    if (!this.$store.hasModule('dataList')) {
      this.$store.registerModule('dataList', moduleDataList)
    }

    this.loadData()
  },
  methods: {
    // vs-upload에 초기 이미지 넣기
    setVsUploadImage (_t, src) {
      let orientation = 'h'
      const image = new Image()
      image.src = src
      image.onload = function () {
        if (this.width > this.height) {
          orientation = 'w'
        }
        _t.$refs.vs_upload.srcs.push({
          src: this.src,
          orientation,
          type: 'image',
          percent: null,
          error: false,
          remove: false
        })
        _t.$refs.vs_upload.filesx.push({
          src: this.src,
          orientation,
          type: 'image',
          percent: null,
          error: false,
          remove: false
        })
      }
    },

    // 수정모드로 변경
    onClickFix () {
      this.isFixedMode = !this.isFixedMode
      if (this.isFixedMode) {
        this.titleInput = this.notice.post_title
        this.contentInput = this.notice.post_content
      }
    },

    async sendFixedData () {
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


      const boardID = this.$constant.BOARD_ID_NOTICE
      return new Promise((resolve, reject) => {
        HttpRequest.post(`/api/v1/board/post/${  boardID  }/${  this.notice.id}`, params)
          .then(response => {
            // this.$router.go(this.$router.currentRoute); // 본문 갱신
            this.$router.go(-1) //  back
            resolve(response)
          }).catch(err => reject(err))
      })
    },

    async sendDeleteData () {
      const boardID = this.$constant.BOARD_ID_NOTICE
      return new Promise((resolve, reject) => {
        HttpRequest.delete(`/api/v1/board/post/${  boardID  }/${  this.notice.id}`)
          .then(response => {
            this.$router.push({path: 'notice'})
            resolve(response)
          }).catch(err => reject(err))
      })
    },

    // 쿠키에 저장된 데이터를 불러온다.
    loadCookieBoard () {
      this.boardId = VueCookie.get('current_board_id')
      this.postId = VueCookie.get('current_post_id')
      this.tableCurrentPage = VueCookie.get('table_current_page')
      this.tablePerPage = VueCookie.get('table_per_page')
      this.tableSearchKeyword = VueCookie.get('table_search_keyword')
    },

    // 현재 페이지에 대한 정보를 불러온다.
    async loadData () {
      // cookie 정보를 가져온다.
      this.loadCookieBoard()

      // notice id 가 없을떄 처리
      if (!this.postId) {
        await this.$router.push({path: 'notice'})
        return
      }

      // 유저정보
      let userInfo = this.$store.state.auth.userInfo
      if (!userInfo.email || !userInfo.is_activated) {
        const loginResult = await this.$store.dispatch('USER_INFO')
        if (typeof loginResult.error !== 'undefined' && loginResult.error !== null) {
          let msg = this.$constant.ALERT_MSG_UNDEFINED
          msg = `${msg  }\n${  loginResult.error}`
          alert(msg)
        } else {
          userInfo = this.$store.state.auth.userInfo
          this.activeUserInfo = userInfo
        }
      } else {
        this.activeUserInfo = userInfo
      }

      // 내용불러오기
      await this.$store.dispatch('dataList/LOAD_NOTICE_DETAIL', this.postId)
      this.notice = this.$store.state.dataList.noticeContent
      this.author = this.notice.author
      this.attachment = this.notice.post_attachment

      this.headerToken = {
        Authorization: `Bearer ${  VueCookie.get('token')}`
      }

      // 첨부파일
      for (let i = 0; i < this.attachment.length; i++) {
        this.setVsUploadImage(this, this.attachment[i].path)
      }
      Object.assign(this.files, this.attachment)

      for (const obj of this.files) {
        this.uploadFiles.push(obj.id)
      }

      // 버튼타입
      if (this.activeUserInfo.id === this.author.id) {
        this.isAuthor = true
      }

      // 이전글 / 다음글
      await this.settingPrevNextPostId()
    },
    onClickFixConfirm () {
      this.sendFixedData()
    },
    onClickFixCancel () {
      this.isFixedMode = false
    },
    onClickBack () {
      this.$router.go(-1)
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

      // 기존 업로드된 파일
      // Object.assign(this.files, this.attachment);
      // for(const obj of files) {
      //     this.files.push(obj);
      // }
    },

    //이전글/다음글 설정
    async settingPrevNextPostId () {
      const page = parseInt(this.tableCurrentPage)
      const perPage = parseInt(this.tablePerPage)
      const keyword = this.tableSearchKeyword

      this.prevPostId = 0
      this.nextPostId = 0
      this.tablePrevPage = page
      this.tableNextPage = page

      // 현재 페이지의 공지사항을 불러온다.
      await this.$store.dispatch('dataList/LOAD_NOTICE_LIST', {page, perPage, keyword})
      const notices = this.$store.state.dataList.noticeList
      const noticeData = notices.data
      const postIndex = this.getListIndexNotice(noticeData)
      const lastPage = parseInt(notices.last_page)

      if (postIndex === -1) {
        // 현재 페이지가 없을 경우
        return
      }

      if (postIndex === 0) {
      // 현재페이지의 첫번째 게시글인 경우


        // 현재페이지가 첫번째 페이지인 경우 이전글 없음
        // 현재페이지가 첫번째 페이지가 아닌 경우 이전페이지의 마지막 게시글이 이전글
        if (page === 1) {
          this.prevPostId = 0

        } else {
          await this.$store.dispatch('dataList/LOAD_NOTICE_LIST', {page:(page - 1), perPage, keyword})
          const prevNotices = this.$store.state.dataList.noticeList
          this.prevPostId = prevNotices.data[prevNotices.data.length - 1].id
          this.prevPostTitle = prevNotices.data[prevNotices.data.length - 1].post_title
          this.tablePrevPage = page - 1
        }

        this.nextPostId = noticeData[postIndex + 1].id
        this.nextPostTitle = noticeData[postIndex + 1].post_title

      } else if (postIndex === (noticeData.length - 1)) {
      // 현재페이지의 마지막 게시글인 경우

        this.prevPostId = noticeData[postIndex - 1].id
        this.prevPostTitle = noticeData[postIndex - 1].post_title


        // 현재페이지가 마지막 페이지인 경우 이전글 없음
        // 현재페이지가 마지막 페이지가 아닌 경우 다음페이지의 첫번째 게시글이 다음글
        if (page === lastPage) {
          this.nextPostId = 0
        } else {
          await this.$store.dispatch('dataList/LOAD_NOTICE_LIST', {page:(page + 1), perPage, keyword})
          const nextNotices = this.$store.state.dataList.noticeList
          this.nextPostId = nextNotices.data[0].id
          this.nextPostTitle = nextNotices.data[0].post_title
          this.tableNextPage = page + 1
        }

      } else {
      // 현재페이지의 중간 게시글 인경우

        this.prevPostId = noticeData[postIndex - 1].id
        this.nextPostId = noticeData[postIndex + 1].id
        this.prevPostTitle = noticeData[postIndex - 1].post_title
        this.nextPostTitle = noticeData[postIndex + 1].post_title

      }
    },

    // 현재 페이지 인덱스 찾기
    getListIndexNotice (noticeData) {
      let notice = null
      for (let i = 0; i < noticeData.length; i++) {
        notice = noticeData[i]
        if (parseInt(notice.id) === parseInt(this.postId)) {
          return i
        }
      }

      return -1
    },

    // 이전페이지로 이동
    movePrevPost () {
      VueCookie.set('current_post_id', this.prevPostId)
      VueCookie.set('table_current_page', this.tablePrevPage)
      location.reload()
    },

    // 다음페이지로 이동
    moveNextPost () {
      VueCookie.set('current_post_id', this.nextPostId)
      VueCookie.set('table_current_page', this.tableNextPage)
      location.reload()
    },

    openWrite (event, id) {
      document.getElementsByClassName(`comment-item-${id}`)[0].children[1].classList.add('open')
    },

    closeWrite (event, id) {
      document.getElementsByClassName(`comment-item-${id}`)[0].children[1].classList.remove('open')
    }
  }
}
</script>

<style scoped>
  .content-head {
    width: 100px;
    font-weight: bold;
  }

  .content-read {
    min-height: 20em;
    line-height: 1.6;
  }

  .read-layout,
  .read-layout-2 {
    margin-bottom:1.5rem;
  }

  .read-layout {
    display: grid !important;
    grid-template-columns: 60px 1fr;
  }
  .read-layout-2 {
    display: grid !important;
    grid-template-columns: 60px auto 60px 1fr;
  }
  .read-layout-title {
    font-weight: bold;
    display: flex;
    align-items: center;
  }
  .read-layout-title.top{
    align-items: start;
  }

  .read-layout-footer{
    width: auto !important;
    height:50px;
    display:  grid !important;
    grid-template-columns: 120px 1fr;
    align-items: center;

    margin-left:-1.5rem;
    margin-right:-1.5rem;
    border-top:1px solid #f2f2f2 !important;
  }
  .read-layout-footer .read-layout-title{
    height:100%;
    justify-content: center;

    background-color: #EDEDED;
  }
  .read-layout-footer span {
    height:100%;
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  .read-layout-footer:last-child {
    margin-bottom:-1.5rem;
  }

  .add-comment .vs-row {
    display: grid !important;
    margin-right:-1.5rem;
    grid-template-columns: minmax(0%, 100%) 12rem;
  }

  .mb-wide { margin-bottom:1.5rem !important;}
  .mb-big-wide { margin-bottom:4.5rem !important; }
  .vs-button-list-left { width:auto !important; }
  .vs-button-list-right { width:auto !important; margin-left:auto !important;}

  b.secondary { color: rgb(102,112,203)}

  .comment-item {
    border-bottom: 1px solid #EAEAEA;
    margin-bottom: 1.5rem;
  }
  .comment-item:last-child{
    border-bottom:none;
    margin-bottom: 0;
  }
  .comment-item.sub-1 {
    padding-left: 4.5rem;
  }
  .comment-item.sub-2 {
    padding-left: 9rem;
  }
  .comment-view {
    display: grid !important;
    grid-template-columns: minmax(0%,100%) 300px;
  }
  .comment-view-body {
    display: grid !important;
    grid-template-columns: 70px minmax(0%,100%);
    grid-template-rows:70px;
  }
  .comment-write{
    margin-top:1.5rem;
    margin-bottom:1.5rem;

    display: none !important;
  }
  .comment-write.open{
    display: flex !important;
  }

</style>

<style>
  .ql-edit-text .ql-editor {
    overflow-y: scroll;
    resize: vertical;
    min-height: 20em;
  }

  .read-vs-upload .btn-x-file {
    visibility: hidden;
  }

  .add-comment .vx-card__collapsible-content .vx-card__body {
    padding-right:0px !important;
  }

  .col-img .vs-image--img{
    background-color: #C4C4C4 !important;
  }
</style>
