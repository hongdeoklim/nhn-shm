<template>
    <div>

      <vx-card class="p-6 mb-4">
        <div class="w-full flex" slot="no-body">
          <h5 class="mr-auto flex items-center" ><b>결재문서 상세보기</b></h5>
        </div>
      </vx-card>

      <vx-card>

        <div class="vx-row">
          <div class="vx-col w-full">

<!--            결재라인-->
            <div class="">

              <div class="approvalWrap">
                <div class="approvalTitle v-center">결<br/><br/>재</div>

                <div v-for="(item, indexItem) in line" class="approvalCell">
                  <span class="approvalHeader v-center">{{item.element_type_name}}</span>
                  <div class="approvalContent v-center">
                    <span>{{item.element_user_name}}</span>

<!--                    상태-->
                    <span v-if="currentStatus==='reject' && item.element_status_code==='wait'" class="approvalStatus">
                      -
                    </span>
                    <span v-else class="approvalStatus">{{item.element_status_name}}</span>
                    <span v-if="item.element_status_code!=='wait'">{{getApprovalDate(item.element_updated_at)}}</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>


        <!--    제목-->
        <div class="vx-row">
          <div class="vx-col content-head">
            <span>제목</span>
          </div>
          <div class="vx-col">
            <span class="ql-font-serif float-left">{{post.post_title}}</span>
          </div>
        </div>

        <!--    작성자-->
        <div class="vx-row mt-3">
          <div class="vx-col content-head">
            <span>작성자</span>
          </div>
          <div class="vx-col">
            <span>{{post.author.name}}</span>
          </div>
        </div>

        <!--    작성일-->
        <div class="vx-row mt-3">
          <div class="vx-col content-head">
            <span>작성일</span>
          </div>
          <div class="vx-col">
            <span>{{document.document_created_at}}</span>
          </div>
        </div>

        <!--    중요도-->
        <div class="vx-row mt-3">
          <div class="vx-col content-head">
            <span>중요도</span>
          </div>
          <div class="vx-col">
            <span>{{document.document_priority_name}}</span>
          </div>
        </div>

        <!--    보안등급-->
        <div class="vx-row mt-3">
          <div class="vx-col content-head">
            <span>보안등급</span>
          </div>
          <div class="vx-col">
            <span>{{document.document_security_name}}</span>
          </div>
        </div>

        <!--    내용-->
        <div class="vx-row mt-3">
          <div class="vx-col content-head">
            <span>내용</span>
          </div>
          <div class="vx-col">
            <div class="content-read" v-html="post.post_content"></div>
          </div>
        </div>

        <vs-divider></vs-divider>

<!--        첨부파일-->
        <div class="vx-row mt-3">
          <vs-upload class="read-vs-upload" ref="vs_upload" :show-upload-button="false" disabled></vs-upload>
        </div>


        <div v-if="currentStatus==='approvalReady' || currentStatus==='consultationReady'" class="flex flex-wrap items-center justify-center">
          <vs-button v-if="currentStatus==='approvalReady'" class="my-5" color="success" @click="onClickConfirm">승인</vs-button>
          <vs-button v-else-if="currentStatus==='consultationReady'" class="my-5" color="success" @click="onClickConfirm">합의</vs-button>

          <vs-button class="ml-5" @click="onClickReject" color="danger">반려</vs-button>
          <vs-button class="ml-5" @click="onClickBack" color="gray">닫기</vs-button>
        </div>

        <div v-else class="flex flex-wrap items-center justify-center">
          <vs-button class="my-5" @click="onClickBack" color="gray">닫기</vs-button>
        </div>

        <div class="vx-row">
          <!--      <vs-upload action="http://3.34.172.199:8080/api/v1/file" @on-success="successUpload" automatic file-name="file_data" :headers="headerToken"/>-->
<!--          <file-input class="w-full" v-for="(file, index) of attachment" :fileIndex="index" :files="file" :key="index"></file-input>-->
        </div>

      </vx-card>

    </div>
</template>

<script>
import moduleDataList from '@/store/approval-data-list/moduleApprovalList.js'
import VueCookie from 'vue-cookie'
import HttpRequest from '@/util/HttpRequest'
export default {
  name: 'ApprovalRead',
  data () {
    return {
      document:{},
      line:{},
      post:{},

      activeUserInfo:{}, // 유저정보
      currentStatus:'close' // approvalReady, consultationReady, reject, close
    }
  },
  async created () {
    if (!this.$store.hasModule('approvalList')) {
      this.$store.registerModule('approvalList', moduleDataList)
    }

    const noticeId = VueCookie.get('current_id')
    // notice id 가 없을떄 처리
    if (!noticeId) {
      this.$router.go(-1)
      return
    }


    await this.$store.dispatch('approvalList/LOAD_APPROVAL_DETAIL', noticeId)
    // 내용 불러오기
    const content = await this.$store.state.approvalList.approvalContent
    this.document = content.document
    this.line = content.line
    this.post = content.post

    // 첨부파일
    if (this.post.post_attachment) {
      for (let i = 0; i < this.post.post_attachment.length; i++) {
        this.setVsUploadImage(this, this.post.post_attachment[i].path)
      }
    }

    // 유저정보
    let userInfo = this.$store.state.auth.userInfo
    if (!userInfo.email || !userInfo.is_activated) {
      const loginResult = await this.$store.dispatch('USER_INFO')
      if (typeof loginResult.error !== 'undefined' && loginResult.error !== null) {
        alert(loginResult.error)
      } else {
        userInfo = this.$store.state.auth.userInfo
        this.activeUserInfo = userInfo
      }
    } else {
      this.activeUserInfo = userInfo
    }

    // 결재라인
    this.currentStatus = 'close'
    for (const obj of this.line) {
      // 대기인 경우 검색
      if (obj.element_status_code === 'wait') {

        // 결재 또는 합의자가 본인인경우
        if (this.activeUserInfo.id === obj.element_user_id) {
          // 결재인경우
          if (obj.element_type_code === 'approval') {
            this.currentStatus = 'approvalReady'
          }
          // 합의인 경우
          else {
            this.currentStatus = 'consultationReady'
          }
        }
        break
      }
      // 반려인 경우 확인 버튼만
      else if (obj.element_status_code === 'reject') {
        this.currentStatus = 'reject'
        break
      }
    }

  },
  methods: {
    // 기안날짜포멧
    getApprovalDate (date) {
      return date.substring(5, date.length - 3)
    },

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
          src:this.src,
          orientation,
          type:'image',
          percent:null,
          error:false,
          remove:false
        })
      }
    },

    // 합의 or 결재
    async onClickConfirm () {
      if (!this.document) {
        alert('error')
        return
      }

      return new Promise((resolve, reject) => {
        HttpRequest.post(`/api/v1/approval/${  this.document.document_id  }/approve`)
          .then(response => {
            this.$router.go(-1) // 뒤로
            resolve(response)
          }).catch(err => reject(err))
      })

    },

    // 반려
    async onClickReject () {
      if (!this.document) {
        alert('error')
        return
      }

      return new Promise((resolve, reject) => {
        HttpRequest.post(`/api/v1/approval/${  this.document.document_id  }/reject`)
          .then(response => {
            this.$router.go(-1) // 뒤로
            resolve(response)
          }).catch(err => reject(err))
      })
    },

    onClickBack () {
      this.$router.go(-1) // 뒤로
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

  .read-vs-upload .btn-x-file {
    visibility: hidden;
  }
</style>
