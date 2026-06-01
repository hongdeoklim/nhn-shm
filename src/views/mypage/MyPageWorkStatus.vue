<template>
  <div class="w-full">
    <vs-row>
      <vs-col class="w-full">

        <vx-card >
          <div>

            <!-- 참여 프로젝트 -->
            <vs-row class="mb-4">
              <vs-col><h5><i class="dot"></i>참여 분야</h5></vs-col>
            </vs-row>

            <vs-row class="mb-8 w-full">
              <vs-col v-for="(project, index) in myProjectList" :key="index" class="w-3/12 pr-2 pb-2" >
                <router-link :to="`/project/${project.id}/home`">
                  <div class="border p-4">
                    <vs-row class="mt-2">분야명 : {{project.field_name}}</vs-row>
                    <vs-row class="mt-2 mb-4">
                      {{ $t('content.mypage.workstatus.대상기간') }}
                      : {{project.date_work_start ? project.date_work_start.substring(0, 10) : ''}}
                      ~ {{project.date_complete ? project.date_complete.substring(0, 10) : ''}}
                    </vs-row>
                  </div>
                </router-link>
              </vs-col>
            </vs-row>


            <!-- 참여 프로젝트 -->
            <vs-row class="mb-4">
              <vs-col class="w-1/2 pr-2">
                <vs-row class="w-full mb-4">
                  <vs-col><h5><i class="dot"></i>{{ $t('content.mypage.workstatus.결재현황') }}</h5></vs-col>
                </vs-row>

                <vs-row class="border p-4">
                  <vs-row class="mt-2" vs-align="center">
                    <vs-col class="w-1/2 title">{{ $t('content.mypage.workstatus.결재요청 문서') }}: <a>{{request.total}}</a>개</vs-col>
                    <vs-col class="w-1/2 title">{{ $t('content.mypage.workstatus.결재진행 문서') }}: <a>{{ongoing.total}}</a>개</vs-col>
                  </vs-row>
                  <vs-row class="mt-2 mb-4" vs-align="center">
                    <vs-col class="w-1/2 title">{{ $t('content.mypage.workstatus.결재대기 문서') }}: <a>{{wait.total}}</a>개</vs-col>
                    <vs-col class="w-1/2 title">{{ $t('content.mypage.workstatus.참조회람 문서') }}: <a>{{reference.total}}</a>개</vs-col>
                  </vs-row>
                </vs-row>

                <vs-row class="border-bottom p-6">
                  <vs-col class="w-full title pl-4">
                    {{ $t('content.mypage.workstatus.최근 결재요청 문서') }} :
                    <router-link v-if="request.latest" :to="moveBoard(request.latest)" style="color:#6670CB">{{ (request.latest) ? getBoardName(request.latest) : ''}}</router-link>
                    <span v-else> (없음) </span>
                  </vs-col>
                </vs-row>
                <vs-row class="border-bottom p-6">
                  <vs-col class="w-full title pl-4">
                    {{ $t('content.mypage.workstatus.최근 결재진행 문서') }} :
                    <router-link v-if="ongoing.latest" :to="moveBoard(ongoing.latest)" style="color:#6670CB">{{ (ongoing.latest) ? getBoardName(ongoing.latest) : ''}}</router-link>
                    <span v-else> (없음) </span>
                  </vs-col>
                </vs-row>
                <vs-row class="border-bottom p-6">
                  <vs-col class="w-full title pl-4">
                    {{ $t('content.mypage.workstatus.최근 결재대기 문서') }} :
                    <router-link v-if="wait.latest" :to="moveBoard(wait.latest)" style="color:#6670CB">{{ (wait.latest) ?  getBoardName(wait.latest) : ''}}</router-link>
                    <span v-else> (없음) </span>
                  </vs-col>
                </vs-row>
                <vs-row class="border-bottom p-6">
                  <vs-col class="w-full title pl-4">
                    {{ $t('content.mypage.workstatus.최근 참조회람 문서') }} :
                    <router-link v-if="reference.latest" :to="moveBoard(reference.latest)" style="color:#6670CB">{{ (reference.latest) ?  getBoardName(reference.latest) : ''}}</router-link>
                    <span v-else> (없음) </span>
                  </vs-col>
                </vs-row>

              </vs-col>

              <vs-col class="w-1/2 pl-2">
                <vs-row class="w-full flex flex-wrap mb-4" vs-align="center">
                  <vs-col class="w-1/2"><h5><i class="dot"></i>{{ $t('content.mypage.workstatus.알림') }}</h5></vs-col>
                  <vs-col class="w-1/2" style="text-align: right; cursor: pointer;" ><a @click="handleMoveAlert">{{ $t('content.mypage.workstatus.더보기') }}</a></vs-col>
                </vs-row>

                <div class="border p-6 mb-2" style="background-color: white; cursor: pointer;" v-for="(item, index) in unread.list" :key="`unread_${index}`"
                     @click="()=>{handleItemClickDetail(item, false)}">
                  <vs-row >
                    <p style="font-size:14px;">{{ item.message }} : {{ getProjectNameWithJSON(item.data)}}{{getBoardNameWithJSON(item.data)}}</p>
                  </vs-row>
                </div>
                <p v-if="unread.list.length === 0" style="text-align: center;">{{ $t('content.mypage.workstatus.미확인 알림이 없습니다') }}</p>

              </vs-col>

            </vs-row>


          </div>
        </vx-card>

      </vs-col>
    </vs-row>
  </div>
</template>

<script>
export default {
  name: 'MyPageWorkStatus',
  computed:{
    projectId () {
      return this.$route.params.proj_id
    },
  },
  data () {
    return {
      myProjectList:[],
      ongoing:{},
      reference:{},
      request:{},
      wait:{},
      unread:{list:[]},
    }
  },
  async mounted () {
    await this.loadProjectList()
    await this.loadApprovalStatus()
    // await this.loadAlertList()
  },
  methods:{
    async loadProjectList () {
      const page = (this.currentPage) ? this.currentPage : 1
      const perPage = this.perPage
      const onlyMe = 1


      await this.$store.dispatch('project/LOAD_PROJECT_LIST', {
        page,
        perPage,
        onlyMe
      })

      // 게시물 불러오기
      const projectListInfo = this.$store.state.project.projectListInfo
      this.myProjectList = projectListInfo.data
    },

    async loadApprovalStatus () {
      const projectId = this.projectId

      await this.$store.dispatch('approval/LOAD_APPROVAL_STATUS', {projectId})
      const ongoing = this.$store.state.approval.status.ongoing
      const reference = this.$store.state.approval.status.reference
      const request = this.$store.state.approval.status.request
      const wait = this.$store.state.approval.status.wait

      this.ongoing = ongoing
      this.reference = reference
      this.request = request
      this.wait = wait
    },

    async loadAlertList () {
      await this.$store.dispatch('approval/LOAD_NOTIFICATION_LIST', {
        page: 1,
        per_page: 6,
        days_before_unread: 30,
      })

      this.unread = this.$store.state.approval.alertReadInfo
      this.unread.list = this.$store.state.approval.alertUnReadList
    },

    handleItemClickDetail (data, isRead) {
      const ids = [data.id]
      const json = JSON.parse(data.data)
      const projectId = json.project_id
      const boardId = json.board_id
      const postId = json.post_id

      if (ids > 0) {
        if (!isRead) this.$store.dispatch('approval/READ_NOTIFICATION', {ids})
        this.$router.push({path: this.movePost(projectId, boardId, postId)});
      }
    },


    handleMoveAlert () {
      this.$router.push('/mypage/alert')
    },

    moveProject (project) {
      this.$router.push({path: `/project/${project.id}/home`})
    },

    moveBoard (doc) {
      if (doc) {
        const projectId = doc.project_id
        const boardId = doc.board_id
        const postId = doc.post_id
        const url = {path: `/project/${projectId}/tab/${boardId}/write/${postId}`}
        return url
      }

      return ''
    },

    getBoardName (board) {
      const boardId = board.board_id
      const boardName = board.post.board.board_title
      /* 안전·보건예산 현황 */
      if (boardId === 3) { return '안전·보건예산 현황' }
      /* 최초 위험성평가 */
      if (boardId === 6) { return '최초 위험성평가' }
      /* 정기위험성평가 */
      if (boardId === 7) { return '정기 위험성평가' }
      /* 위험성평가협의회 */
      if (boardId === 8) { return '정기 위험성평가협의회' }
      /* 산업안전보건위원회 */
      if (boardId === 9) { return '산업안전보건위원회' }
      /* 작업허가서 */
      if (boardId === 10) { return '작업허가서' }
      /* 작업허가서(외부용) */
      if (boardId === 11) { return '작업허가서(외부용)' }
      /* 안전점검일지 */
      if (boardId === 13) { return '안전점검일지' }
      /* 안전점검일지 */
      if (boardId === 14) { return '안전점검일지' }
      /* 산업재해무재해 */
      if (boardId === 22) { return '산업재해무재해' }
      /* 안전용품 현황 */
      if (boardId === 23) { return '안전용품 현황' }
      /* 건설장비관리 */
      if (boardId === 24) { return '건설장비관리' }
      /* 환경일일점검 */
      if (boardId === 28) { return '환경일일점검' }
      /* 환경월간점검 */
      if (boardId === 29) { return '환경월간점검' }
      /* 환경지원 */
      if (boardId === 30) { return '환경지원' }
      /* 환경평가 */
      if (boardId === 31) { return '환경평가' }
      /* 환경이슈보고 */
      if (boardId === 32) { return '환경이슈보고' }
      /* 환경사고보고 */
      if (boardId === 33) { return '환경사고보고' }
      /* HSE 교육관리 */
      if (boardId === 35) { return 'HSE 교육관리' }
      /* 안전요청 */
      if (boardId === 36) { return '안전요청' }
      /* 환경요청 */
      if (boardId === 39) { return '환경요청' }
      /* 보건요청 */
      if (boardId === 40) { return '보건요청' }
      if (boardId === 40) { return '보건요청' }

      return boardName
    },
    getBoardNameWithJSON (data) {
      if (!data) {
        return ''
      }
      const json = JSON.parse(data)
      const board_slug = json.board_slug
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
    getProjectNameWithJSON (data) {
      if (!data) {
        return ''
      }
      const json = JSON.parse(data)
      const project_name = (json.project_name) ? json.project_name : '{프로젝트 이름 없음}'
      return `${project_name} | `
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
      if (boardId >= 100) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`});  }


    },
  },

}
</script>

<style scoped>

</style>
