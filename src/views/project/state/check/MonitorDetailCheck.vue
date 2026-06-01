<template>
  <div>
    <vs-row>
      <vs-col class="w-9/12">

        <vx-card>
          <div>
            <vs-row class="mb-4">
              <vs-col class="mb-6 flex" vs-justify="flex-end">
                <vs-button class="mr-4" color="secondary" type="border" @click="handleBackMenu">목록</vs-button>
                <vs-button class="mr-4" color="secondary" @click="handleClickRegister">임시저장</vs-button>
              </vs-col>
            </vs-row>

            <!-- 기본정보 -->
            <vs-row class="mb-8">
              <vs-col><h5><i class="dot"></i>기본정보</h5></vs-col>
            </vs-row>
            <vs-col class="flex flex-wrap mb-4">

              <vs-row class="w-1/3  mb-4 flex" vs-align="center">
                <vs-col class="w-3/12 title">현장명</vs-col>
                <vs-col class="w-9/12">
                  <ml-input class="w-full" disabled="true"/>
                </vs-col>
              </vs-row>
              <vs-row class="w-1/3  mb-4 flex" vs-align="center">
                <vs-col class="w-3/12 title pr-4" style="text-align: right">대상기간</vs-col>
                <vs-col class="w-4/12">
                  <date-selector class="w-full"></date-selector>
                </vs-col>
                <vs-col class="w-1/12" style="text-align: center">-</vs-col>
                <vs-col class="w-4/12">
                  <date-selector class="w-full"></date-selector>
                </vs-col>
              </vs-row>
              <vs-row class="w-1/3  mb-4 flex" vs-align="center">
                <vs-col class="w-3/12 title pr-4" style="text-align: right">작성자</vs-col>
                <vs-col class="w-9/12">
                  <ml-input class="w-full" disabled="true"/>
                </vs-col>
              </vs-row>


              <vs-row class="w-1/3  mb-4 flex" vs-align="center">
                <vs-col class="w-3/12 title pr-4">지원일</vs-col>
                <vs-col class="w-9/12">
                  <date-selector class="w-full"></date-selector>
                </vs-col>
              </vs-row>
              <vs-row class="w-1/3  mb-4 flex" vs-align="center">
                <vs-col class="w-3/12 title pr-4" style="text-align: right">지원구분</vs-col>
                <vs-col class="w-9/12">
                  <vs-select
                      class="selectExample w-full">
                    <vs-select-item :key="index" :value="item.value" :text="item.text"
                                    v-for=" (item, index) in checkList"/>
                  </vs-select>
                </vs-col>
              </vs-row>
            </vs-col>

            <!-- 지원결과 -->
            <vs-row class="mb-4">
              <vs-col><h5><i class="dot"></i>지원결과</h5></vs-col>
            </vs-row>
            <vs-col class="flex flex-wrap mb-4">

              <vs-row class="w-1/3  mb-4 flex" vs-align="center">
                <vs-col class="w-3/12 title">지원자</vs-col>
                <vs-col class="w-9/12">
                  <ml-input class="w-full"/>
                </vs-col>
              </vs-row>

              <vs-row class="w-full  mb-4 flex" vs-align="center">
                <vs-col class="w-1/12 title">지원범위</vs-col>
                <vs-col class="w-11/12">
                  <ml-input class="w-full"/>
                </vs-col>
              </vs-row>

              <vs-row class="w-full  mb-4 flex" vs-align="center">
                <vs-col class="w-1/12 title">환경관리</vs-col>
                <vs-col class="w-11/12">
                  <ml-textarea/>
                </vs-col>
              </vs-row>


              <vs-row class="w-full  mb-4 flex" vs-align="center">
                <vs-col class="w-1/12 title">향후지원 필요사항</vs-col>
                <vs-col class="w-11/12">
                  <ml-textarea/>
                </vs-col>
              </vs-row>
            </vs-col>


            <!-- 첨부파일 -->
            <vs-row class="mb-4">
              <vs-col class="w-9/12"><h5><i class="dot"></i>첨부파일</h5></vs-col>
            </vs-row>


            <vs-row class="mb-8">
              <vs-col class="flex">
                <vs-col class="w-auto pr-4">
                  <vs-button class="" style="min-width:115px;" color="secondary" type="border">파일첨부</vs-button>
                </vs-col>
                <vs-col class="mb-2" style="border:1px solid #cdcdcd; border-radius: 8px;">
                  <vs-col class="p-2  flex"
                          style="border-bottom:1px solid #cdcdcd; border-top-left-radius: 8px; border-top-right-radius: 8px; ">
                    <vs-checkbox>전체선택</vs-checkbox>
                    <a class="ml-auto">선택삭제</a>
                  </vs-col>
                  <vs-col class="p-2" style="height:120px; overflow-y: auto">
                    <vs-checkbox class="mb-2">Report.xlsx</vs-checkbox>
                    <vs-checkbox class="mb-2">Report.xlsx</vs-checkbox>
                  </vs-col>
                  <vs-col class="p-2"
                          style="border-top:1px solid #cdcdcd; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; background-color:#F9F9F9;">
                    선택 1개 (0 Bytes), 전체 2개 (0 Bytes)
                  </vs-col>
                </vs-col>
              </vs-col>

            </vs-row>

          </div>
        </vx-card>

      </vs-col>
      <vs-col class="w-3/12 pl-6">
        <approval-process-module
            :board="board"
            @handleClickUpload="handleClickUpload"
            @handleClickOk="handleClickOk"
            @handleClickNo="handleClickNo"
            @handleSendApprovalProcess="handleSendApprovalProcess"
        ></approval-process-module>
      </vs-col>
    </vs-row>

    <!-- TODO : 얼럿데이터 -->
    <popup-alert v-model="alert.show"
                 :message="alert.message"
                 :buttons="alert.buttons"

                 @upload="alertUpload"
    ></popup-alert>
  </div>
</template>

<script>
import ApprovalProcessModule from '../../../modules/ApprovalProcessModule'
import PopupAlert from '../../../../popup/PopupAlert'
import DateSelector from '../../../../components/selector/DateSelector'

export default {
  name: 'MonitorDetailCheck',
  components: {DateSelector, PopupAlert, ApprovalProcessModule},
  data () {
    return {
      // TODO : 글쓰기 정보 및 권한
      board: {
        slug: 'first_risk',
        statusCode: '', // 문서 상태코드
        writer: {}, //작성자 정보
        turnApprovalId: 0, // 결재자 ID
        readonly: false, // 읽기전용인가
        isWriter: true, // 작성자인가
        savable: true, // 임시저장이 가능하나
        isCompleteApproval: false, // 결재완료된 문서인가
        isTurnApproval: false, // 결재할 차례인가
        approvalLine: [], // 결재라인
        commentList: [] // 댓글리스트
      },

      // TODO : 얼럿데이터
      alert: {
        show: false,
        message: '결재하시겠습니까?',
        buttons: [
          {label: '승인', action: 'ok'},
          {label: '취소', action: 'cancel'}
        ]
      },

      checkList: 2
    }
  },

  methods: {

    handleBackMenu () {
      this.$emit('handleBackMenu', 'monitoring')
    },
    handleClickRegister () {

    },
    handleClickUpload () {

    },
    handleClickOk () {

    },
    handleClickNo () {

    },
    handleSendApprovalProcess () {

    },
    alertUpload () {

    }
  }
}
</script>

<style scoped>
</style>
