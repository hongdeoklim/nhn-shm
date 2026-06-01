<template>
<div class="w-full">
  <vs-row>
    <vs-col class="w-full">

      <vx-card >
        <div>
          <vs-row class="mb-8">
            <div class="w-full flex">
              <a href="javascript:;" style="color:#6670CB" @click="()=>{handleHeaderMenu(1)}">{{ $t('content.mypage.alert.오늘') }}</a>
              <span class="mx-3" style="color:#CDCDCD;">|</span>
              <a href="javascript:;" style="color:#6670CB" @click="()=>{handleHeaderMenu(7)}">{{ $t('content.mypage.alert.최근1주일') }}</a>
              <span class="mx-3" style="color:#CDCDCD;">|</span>
              <a href="javascript:;" style="color:#6670CB" @click="()=>{handleHeaderMenu(30)}">{{ $t('content.mypage.alert.최근30일') }}</a>
              <span class="flex ml-6" style="color:#757575; font-size: 14px;">
                <img src="@/assets/images/icon/icon-warning.svg" alt="login" class="mr-2" style="margin-top:3px;">
                {{ $t('content.mypage.alert.tip') }}
              </span>
            </div>
          </vs-row>

          <!-- 참여 프로젝트 -->
          <vs-row class="mb-4 ">
            <vs-col class="flex">
              <h5><i class="dot"></i>{{ $t('content.mypage.alert.알림') }}</h5>
              <vs-spacer></vs-spacer>
              <a href="javascript:;" style="color:#1E0D61;font-weight: 500;" @click="handleClickRemoveNotice">{{ $t('content.mypage.alert.선택 알림 삭제') }}</a>
            </vs-col>
          </vs-row>

          <vs-row class="grid" style="grid-template-columns: 1fr 1px 1fr; align-items: flex-start">
            <vs-col class="pr-3">
              <div class="title mb-2">{{ $t('content.mypage.alert.미확인') }} ({{ (unread.total) ? unread.total : '0' }})</div>
              <div class="mb-4 p-2" style="border:1px solid #cdcdcd; cursor: pointer" v-for="(item, index) in unread.list" :key="`unread_${index}`">
                <div class="grid" style="grid-template-columns: 45px 1fr;" >
                  <label class="flex" >
                    <div class="flex" style="margin-right: 10px; padding:0 7px 0 2px; justify-content: center; align-items: center; border-right:1px solid #ededed;">
                      <vs-checkbox v-model="item.is_checked" @change="()=>{changeCheck(item)}"></vs-checkbox>
                    </div>
                  </label>
                  <div class="ml-2" @click="()=>{handleItemClickDetail(item, false)}">
                    <h5 class="mb-4" style="font-size:14px;">{{ item.message }}</h5>
                    <p style="color:#1E0D61; font-width: bold;">{{ getProjectName(item.data)}}{{getBoardName(item.data)}}</p>
                    <p style="font-size:13px;">{{ item.created_at }}</p>
                  </div>
                </div>
              </div>
              <p v-if="unread.list.length === 0" style="text-align: center;">{{ $t('content.mypage.alert.미확인 알림이 없습니다') }}</p>
              <div class="vs-con-table">
                <div class="con-pagination-table vs-table--pagination">
                  <k-pagination
                    :total="(unread.lastPage) ? unread.lastPage : 1"
                    v-model="unread.currentPage" @change="handleUnReadChangePage"></k-pagination>
                </div>
              </div>
            </vs-col>
            <div class="h-full" style="background-color: rgba(205, 205, 205, 0.35)"></div>
            <vs-col class="pl-3">
              <div class="title mb-2 ">{{ $t('content.mypage.alert.확인') }} ({{ (read.total) ? read.total : '0' }})</div>
              <div class="mb-4 p-2" style="border:1px solid #cdcdcd; cursor: pointer" v-for="(item, index) in read.list" :key="`read_${index}`">
                <div class="grid" style="grid-template-columns: 45px 1fr;" >
                  <label class="flex" >
                    <div class="flex" style="margin-right: 10px; padding:0 7px 0 2px; justify-content: center; align-items: center; border-right:1px solid #ededed;">
                      <vs-checkbox v-model="item.is_checked" @change="()=>{changeCheck(item)}"></vs-checkbox>
                    </div>
                  </label>
                  <div class="ml-2" style="opacity: 0.6;" @click="()=>{handleItemClickDetail(item, true)}">
                    <h5 class="mb-4" style="font-size:14px;">{{ item.message }}</h5>
                    <p>{{getBoardName(item.data)}}</p>
                    <p style="font-size:13px;">{{ item.created_at }}</p>
                  </div>
                </div>
              </div>
              <p v-if="read.list.length === 0" style="text-align: center;">{{ $t('content.mypage.alert.확인 알림이 없습니다') }}</p>
              <div class="vs-con-table">
                <div class="con-pagination-table vs-table--pagination">
                  <k-pagination
                    :total="(read.lastPage) ? read.lastPage : 1"
                    v-model="read.currentPage" @change="handleReadChangePage"></k-pagination>
                </div>
              </div>
            </vs-col>
          </vs-row>

        </div>
      </vx-card>

    </vs-col>
  </vs-row>
</div>
</template>

<script>
import KPagination from '@/components/kPagination/kPagination'
export default {
  name: 'MyPageAlert',
  components: {KPagination},
  data () {
    return {
      read:{
        list:[],
        total:0,
        lastPage:1,
        currentPage:1,
        perPage:10
      },
      unread:{
        list:[],
        total:0,
        lastPage:1,
        currentPage:1,
        perPage:10
      },
      days_before:1,
      removeAlertList:[],

      // 마지막 api 호출시 사용한 옵션
      apiLastLoadOptions: null,
    }
  },

  async created () {

    await this.loadAlertList()
  },

  methods :{
    async loadAlertList () {

      const options = {
        page_unread: this.unread.currentPage,
        per_page_unread: this.unread.perPage,
        days_before_unread: this.days_before,
        page_read: this.read.currentPage,
        per_page_read: this.read.perPage,
        days_before_read:this.days_before,
      }
      if (JSON.stringify(options) === JSON.stringify(this.apiLastLoadOptions)) {
        // 이전과 동일한 옵션으로 리스트를 불러옵니다.
        return;
      }
      this.apiLastLoadOptions = JSON.parse(JSON.stringify(options));
      await this.$store.dispatch('approval/LOAD_NOTIFICATION_LIST', options)

      this.read.list = this.$store.state.approval.alertReadList
      const readList = []
      for (const alert of this.read.list) {
        alert.is_checked = false
        readList.push(alert)
      }
      this.read.list = readList
      this.read.total = this.$store.state.approval.alertReadInfo.total_count
      this.read.lastPage = this.$store.state.approval.alertReadInfo.last_page

      this.unread.list = this.$store.state.approval.alertUnReadList
      const unReadList = []
      for (const alert of this.unread.list) {
        alert.is_checked = false
        unReadList.push(alert)
      }
      this.unread.list = unReadList
      this.unread.total = this.$store.state.approval.alertUnReadInfo.total_count
      this.unread.lastPage = this.$store.state.approval.alertUnReadInfo.last_page

    },

    handleHeaderMenu (day) {
      this.days_before = day
      this.unread.currentPage = 1
      this.read.currentPage = 1
      this.loadAlertList()
    },

    handleUnReadChangePage (page) {
      this.unread.currentPage = page
      this.loadAlertList()
    },
    handleReadChangePage (page) {
      this.read.currentPage = page
      this.loadAlertList()
    },
    getBoardName (data) {
      if (!data) {
        return ''
      }
      const json = JSON.parse(data)
      const board_id = json.board_id
      const board_slug = json.board_slug

      if (board_id === 53) return '사고조사 보고서'
      if (board_id === 54) return '사고경위서'
      if (board_id === 55) return '목격자 진술서'
      if (board_id === 56) return '실험실 안전사고 보고'
      if (board_id === 57) return '산업재해조사표'
      if (board_id === 58) return '산업안전보건위원회'
      if (board_id === 59) return '안전경영위원회'
      if (board_id === 60) return '안전근로협의체'
      if (board_id === 61) return '안전보건협의체'
      if (board_id === 62) return '아차사고 사례 카드'
      if (board_id === 63) return '아차사고 사례 개선 확인 카드'
      if (board_id === 64) return '실험실 일상 점검표'
      if (board_id === 65) return '실험실 정기 점검표'
      if (board_id === 66) return 'TAC 안전관리 점검표'
      if (board_id === 67) return '밀폐공간 작업프로그램 평가표'
      if (board_id === 68) return '밀폐공간 작업 전 체크리스트'
      if (board_id === 69) return '고압가스 충전실 안전점검표'
      if (board_id === 70) return '한수단 2호 안전점검표'
      if (board_id === 71) return '잠수 운용 계획서'
      if (board_id === 72) return '잠수작업 전 안전점검표'
      if (board_id === 73) return '잠수 운용 결과서'
      if (board_id === 74) return '중량물·운반기계 안전점검표'
      if (board_id === 75) return '작업장 안전점검표'
      if (board_id === 76) return '부적합 및 시정조치 - 안전'
      if (board_id === 77) return '부적합 및 시정조치 - 보건'
      if (board_id === 78) return '작업중지보고서 - 임직원'
      if (board_id === 79) return '작업중지보고서 - 근로자'
      if (board_id === 80) return '작업중지 조치결과서 - 임직원'
      if (board_id === 81) return '작업중지 조치결과서 - 근로자'
      if (board_id === 82) return '정기 위험성 평가'
      if (board_id === 83) return '수시 위험성 평가'
      if (board_id === 84) return '안전작업허가 - 작업수행부서'
      if (board_id === 85) return '안전작업허가 - 하도급업체'
      if (board_id === 86) return '안전·보건예산 현황'
      if (board_id === 87) return '작업중지보고서 - 기타'
      if (board_id === 88) return '작업중지 조치결과서 - 기타'

      if (board_slug === 'notice') return '공지사항'
      if (board_slug === 'approval') return '결재 문서함'
      if (board_slug === 'project_monthly_report') return '안전·보건예산 현황'
      if (board_slug === 'project_safety_plan') return '현장 개요'
      if (board_slug === 'first_risk') return '최초 위험성평가'
      if (board_slug === 'periodical_risk') return '정기 위험성평가'
      if (board_slug === 'risk_evaluation_association') return '정기 위험성평가협의회'
      if (board_slug === 'industry_safety_health_association') return '산업안전보건협의회'
      if (board_slug === 'work_permit') return '작업허가서'
      if (board_slug === 'special_work_permit') return '작업허가서(외부용)'
      if (board_slug === 'daily_safety_check_table') return '일일안전점검표'
      if (board_slug === 'daily_safety_check_diary') return '안전점검일지'
      if (board_slug === 'joint_check_diary') return '합동점검일지'
      if (board_slug === 'plan_management') return '현장 개요'
      if (board_slug === 'news') return 'CEO 메세지'
      if (board_slug === 'qna') return 'Q&A'
      if (board_slug === 'safety_info') return '안전보건 주요일정'
      if (board_slug === 'field_news') return '구성원 요청사항'
      if (board_slug === 'safety_chief') return '안전보건책임자'
      if (board_slug === 'manpower') return '출역인원'
      if (board_slug === 'industrial_accident') return '산업재해/무재해'
      if (board_slug === 'safety_supplies') return '안전용품 현황'
      if (board_slug === 'construction_equipment') return '건설장비관리'
      if (board_slug === 'state_director') return '환경책임자선임'
      if (board_slug === 'construction_equipment_detail') return '건설장비안전점검결과'
      if (board_slug === 'state_government') return '대관인허가신고'
      if (board_slug === 'environment_check_daily') return '환경일일점검'
      if (board_slug === 'environment_check_monthly') return '환경월간점검'
      if (board_slug === 'environment_support') return '환경지원보고'
      if (board_slug === 'environment_evaluation') return '환경평가'
      if (board_slug === 'environment_report_issue') return '환경이슈보고'
      if (board_slug === 'environment_report_accident') return '환경사고보고'
      if (board_slug === 'state_government_checklist') return '대관신고종류'
      if (board_slug === 'hse_management') return '안전요청' //HSE 교육관리
      if (board_slug === 'safety_request') return '안전요청'
      if (board_slug === 'photo-album') return '사진첩'
      if (board_slug === 'work_news') return 'CEO 메세지'
      if (board_slug === 'environment_request') return '환경요청'
      if (board_slug === 'health_request') return '보건요청'

      if (board_slug === 'always_risk') return '수시위험성평가'
      if (board_slug === 'risk_evaluation_association_always') return '수시 위험성평가협의회'
      if (board_slug === 'daily_safety_always_check_table') return '수시 일일안전점검표'
      if (board_slug === 'daily_safety_check_diary_always') return '수시 일일점검일지'
      if (board_slug === 'accident_report') return '사고보고'
      if (board_slug === 'accident_review') return '사고검토'
      if (board_slug === 'safety_check_444') return '444점검'
      if (board_slug === 'equipment_power') return '출역장비'
      if (board_slug === 'partner_agreement') return '파트너사 계약현황'
      if (board_slug === 'safety_check_partner_444') return '4.4.4 점검'
    },
    getProjectName (data) {
      if (!data) {
        return ''
      }
      const json = JSON.parse(data)
      const project_name = (json.project_name) ? json.project_name : '{프로젝트 이름 없음}'
      return `${project_name} | `
    },

    handleItemClickDetail (data, isRead) {
      const ids = [data.id]
      const json = JSON.parse(data.data)
      const projectId = json.project_id
      const boardId = json.board_id
      const postId = json.post_id

      if (ids > 0) {
        if (!isRead) this.$store.dispatch('approval/READ_NOTIFICATION', {ids})
        this.movePost(projectId, boardId, postId)
      }
    },

    changeCheck (data) {
      if (this.removeAlertList.indexOf(data) == -1) {
        this.removeAlertList.push(data)
      } else {
        this.removeAlertList.remove(data)
      }
    },

    handleClickRemoveNotice () {
      const ids = []
      for (const data of this.removeAlertList) {
        ids.push(data.id)
      }
      if (ids.length > 0) {
        this.$store.dispatch('approval/DELETE_NOTIFICATION', {ids})

        alert('알림이 삭제되었습니다.')
        location.reload()
      } else {
        alert('삭제할 알림을 선택해주세요.')
      }
    },

    movePost (projectId, boardId, postId) {

      /* 안전·보건예산 현황 */
      if (boardId === 3) { this.$router.push({path: `/project/${projectId}/write/report/project_monthly_report/${postId}`}); return }
      /* 최초 위험성평가 */
      if (boardId === 6) { this.$router.push({path: `/project/${projectId}/risk/assessment/first/${postId}`}); return }
      /* 정기위험성평가 */
      if (boardId === 7) { this.$router.push({path: `/project/${projectId}/risk/assessment/regular/${postId}`}); return }
      /* 수시위험성평가 */
      if (boardId === 41) { this.$router.push({path: `/project/${projectId}/risk/assessment/always/${postId}`}); return }
      /* 위험성평가협의회 */
      if (boardId === 8) { this.$router.push({path: `/project/${projectId}/risk/conference/warning/${postId}`}); return }
      /* 수시 위험성평가협의회 */
      if (boardId === 42) { this.$router.push({path: `/project/${projectId}/risk/conference/warning-always/${postId}`}); return }
      /* 산업안전보건위원회 */
      if (boardId === 9) { this.$router.push({path: `/project/${projectId}/risk/conference/safety/${postId}`}); return }
      /* 작업허가서(내부용) */
      if (boardId === 10) { this.$router.push({path: `/project/${projectId}/risk/permit/work/${postId}`}); return }
      /* 작업허가서(외부용) */
      if (boardId === 11) { this.$router.push({path: `/project/${projectId}/risk/permit/work_export/${postId}`}); return }

      /* 안전점검일지 */
      if (boardId === 13) { this.$router.push({path: `/project/${projectId}/risk/check/checklog/${postId}`}); return }
      /* 안전점검일지 */
      if (boardId === 14) { this.$router.push({path: `/project/${projectId}/risk/check/checklogall/${postId}`}); return }
      /* 산업재해무재해 */
      if (boardId === 22) { this.$router.push({path: `/project/${projectId}/safety/accident/report/${postId}`}); return }
      /* 안전용품 현황 */
      if (boardId === 23) { this.$router.push({path: `/project/${projectId}/safety/supplies/${postId}`}); return }
      /* 건설장비관리 */
      if (boardId === 24) { this.$router.push({path: `/project/${projectId}/safety/equipment/plan/${postId}`}); return }
      /* 환경일일점검 */
      if (boardId === 28) { this.$router.push({path: `/project/${projectId}/state/check/daily/${postId}`}); return }
      /* 환경월간점검 */
      if (boardId === 29) { this.$router.push({path: `/project/${projectId}/state/check/monthly/${postId}`}); return }
      /* 환경지원 */
      if (boardId === 30) { this.$router.push({path: `/project/${projectId}/state/support/${postId}`}); return }
      /* 환경평가 */
      if (boardId === 31) { this.$router.push({path: `/project/${projectId}/state/evaluation/${postId}`}); return }
      /* 환경이슈보고 */
      if (boardId === 32) { this.$router.push({path: `/project/${projectId}/state/report/issue/${postId}`}); return }
      /* 환경사고보고 */
      if (boardId === 33) { this.$router.push({path: `/project/${projectId}/state/report/accident/${postId}`}); return }

      /* HSE 교육관리 */
      if (boardId === 35) { this.$router.push({path: `/project/${projectId}/hse/list/safety/${postId}`}); return }
      /* 안전요청 */
      if (boardId === 36) { this.$router.push({path: `/project/${projectId}/prevention/request/safety/${postId}`}); return }
      /* 환경요청 */
      if (boardId === 39) { this.$router.push({path: `/project/${projectId}/prevention/request/environment/${postId}`}); return }
      /* 보건요청 */
      if (boardId === 40) { this.$router.push({path: `/project/${projectId}/prevention/request/health/${postId}`}); return }

      /* 사고보고 */
      if (boardId === 45) { this.$router.push({path: `/project/${projectId}/write/accident/accident_report/${postId}`}); return }
      /* 산재검토 */
      if (boardId === 46) { this.$router.push({path: `/project/${projectId}/write/accident/accident_review/${postId}`}); return }

      /* 444점검 */
      if (boardId === 48) { this.$router.push({path: `/project/${projectId}/write/safety_check/safety_check_444/${postId}`}); return }
      /* 출역장비 */
      if (boardId === 49) { this.$router.push({path: `/project/${projectId}/write/safety_check/safety_check_444/${postId}`}); return }
      /* 파트너사 계약현황 */
      if (boardId === 50) { this.$router.push({path: `/project/${projectId}/plan/partners`}); return }
      /* 444점검 */
      if (boardId === 51) { this.$router.push({path: `/project/${projectId}/write/safety_check_partner/safety_check_partner_444/${postId}`}); return }

      /* 사고조사 보고서 */
      if (boardId === 53) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 사고경위서 */
      if (boardId === 54) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 목격자 진술서 */
      if (boardId === 55) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 실험실 안전사고 보고 */
      if (boardId === 56) { this.$router.push({path: `/project/${projectId}/approval/${boardId}/write/${postId}`}); return }
      /* 산업재해조사표 */
      if (boardId === 57) { this.$router.push({path: `/project/${projectId}/normal/${boardId}/write/${postId}`}); return }
      /* 산업안전보건위원회 */
      if (boardId === 58) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 안전경영위원회 */
      if (boardId === 59) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 안전근로협의체 */
      if (boardId === 60) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 안전보건협의체 */
      if (boardId === 61) { this.$router.push({path: `/project/${projectId}/normal/${boardId}/write/${postId}`}); return }
      /* 아차사고 사례 카드 */
      if (boardId === 62) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 아차사고 사례 개선 확인 카드 */
      if (boardId === 63) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 실험실 일상 점검표 */
      if (boardId === 64) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 실험실 정기 점검표 */
      if (boardId === 65) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* TAC 안전관리 점검표 */
      if (boardId === 66) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 밀폐공간 작업프로그램 평가표 */
      if (boardId === 67) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 밀폐공간 작업 전 체크리스트 */
      if (boardId === 68) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 고압가스 충전실 안전점검표 */
      if (boardId === 69) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 한수단 2호 안전점검표 */
      if (boardId === 70) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 잠수 운용 계획서 */
      if (boardId === 71) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 잠수작업 전 안전점검표 */
      if (boardId === 72) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 잠수 운용 결과서 */
      if (boardId === 73) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 중량물·운반기계 안전점검표 */
      if (boardId === 74) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 작업장 안전점검표 */
      if (boardId === 75) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 부적합 및 시정조치 - 안전 */
      if (boardId === 76) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 부적합 및 시정조치 - 보건 */
      if (boardId === 77) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 작업중지보고서 - 임직원 */
      if (boardId === 78) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 작업중지보고서 - 근로자 */
      if (boardId === 79) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 작업중지 조치결과서 - 임직원 */
      if (boardId === 80) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 작업중지 조치결과서 - 근로자 */
      if (boardId === 81) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 정기 위험성 평가 */
      if (boardId === 82) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 수시 위험성 평가 */
      if (boardId === 83) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 안전작업허가 - 작업수행부서 */
      if (boardId === 84) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 안전작업허가 - 하도급업체 */
      if (boardId === 85) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 안전·보건예산 현황 */
      if (boardId === 86) { this.$router.push({path: `/project/${projectId}/approval/${boardId}/write/${postId}`}); return }
      /* 작업중지보고서 - 기타 */
      if (boardId === 87) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 작업중지 조치결과서 - 기타 */
      if (boardId === 88) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }

      // BS
      if (boardId >= 100) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }


    },
  }
}
</script>

<style scoped>
.active {
  background-color: #FBFBFF !important;
}
.normal {
  background-color: white !important;
}
</style>
