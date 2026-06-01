<template>
  <div>
    <vs-row :class="getClasses" id="print-report">
      <vs-col style="position: relative">
        <vx-card style="width:calc(100% - 40px)" :style="isPrint ? {width: '100%', boxShadow: 'none', borderRadius: '0'} : {}">
          <vs-row class="mb-8">
            <vs-col v-if="!isPrint" class="mb-6 flex" vs-justify="flex-end">
              <vs-button class="mr-4" color="secondary" @click="handlePrint">인쇄</vs-button>
              <vs-button class="mr-4" color="secondary" type="border" @click="handleBackMenu">목록</vs-button>
              <vs-button v-if="board.savable" class="mr-4" color="secondary" @click="handleClickRegister">임시저장</vs-button>
              <vs-button v-if="board.resend" class="ml-2" color="secondary" @click="handleClickRegister">임시저장 후 재상신</vs-button>
              <vs-button v-if="board.savable && isUpdateMode" class="mr-2" color="secondary" type="border" @click="handleDeletePost">삭제</vs-button>
            </vs-col>

            <!-- 작업허가서 구분 -->
            <vs-row class="mb-4">
              <vs-col><h5><i class="dot"></i>작업허가서 구분</h5></vs-col>
            </vs-row>

            <vs-row class="flex flex-wrap">
              <vs-row class="mb-4 flex" vs-align="center">
                <vs-col class="w-1/12 title">부분</vs-col>
                <vs-col class="w-11/12">
                  <span v-if="isPrint">{{form.type}}</span>
                  <ml-input v-else v-model="form.type" :readonly="true"/>
<!--                  <vs-select autocomplete v-model="form.type" @change="onChangeType">-->
<!--                    <vs-select-item-->
<!--                      v-for="(item, index) in typeList" :key="index"-->
<!--                      :text="item.text"-->
<!--                      :value="item.value"/>-->
<!--                  </vs-select>-->
                </vs-col>
              </vs-row>

              <vs-row class="mb-4 flex" vs-align="center">
                <vs-col class="w-1/12 title">허가일자</vs-col>
                <vs-col class="w-11/12 flex" vs-align="center">
                  <span v-if="isPrint">{{form.permitDate}}</span>
                  <date-selector v-else v-model="form.permitDate" :readonly="board.readonly"/>
                </vs-col>
              </vs-row>

              <vs-row class="mb-4 flex" vs-align="center">
                <vs-col class="w-1/12 title">작업구분</vs-col>
                <vs-col class="w-11/12 flex" style="flex-wrap: wrap;" vs-align="center">
                  <span v-for="(item, index) in form.workTypeB_title_list" :key="`workTypeB_${index}`">
                    <span v-if="isPrint" :class="{'ml-4' : form.workTypeB[index]}">{{ form.workTypeB[index] ? `${item}, ` : '' }} </span>
                    <vs-checkbox v-else v-model="form.workTypeB[index]"
                                 class="mr-4"
                                 :disabled="board.readonly"
                    >{{ item }}</vs-checkbox>
                  </span>
                </vs-col>
              </vs-row>

              <vs-row class="mb-4 flex" vs-align="center">
                <vs-col class="w-1/12 title">신청인</vs-col>
                <vs-col class="w-11/12 flex" style="flex-wrap: wrap;" vs-align="center">
                  <div class="flex mr-4" vs-align="center">
                    <span class="mr-2" style="align-self: center">{{ tagKey === 'work' ? '부서' : '업체명' }}:</span>
                    <span v-if="isPrint">{{form.applicant.department}}</span>
                    <ml-input v-else v-model="form.applicant.department" :readonly="board.readonly"/>
                  </div>
                  <div class="flex mr-4" vs-align="center">
                    <span class="mr-2" style="align-self: center">직책:</span>
                    <span v-if="isPrint">{{form.applicant.position}}</span>
                    <ml-input v-else v-model="form.applicant.position" :readonly="board.readonly" />
                  </div>
                  <div class="flex mr-4" vs-align="center">
                    <span class="mr-2" style="align-self: center">성명:</span>
                    <span v-if="isPrint">{{form.applicant.name}}</span>
                    <ml-input v-else v-model="form.applicant.name" :readonly="board.readonly" />
                  </div>

                </vs-col>
              </vs-row>

              <vs-row class="mb-4 flex" vs-align="center">
                <vs-col class="w-1/12 title">작업조원</vs-col>
                <vs-col class="w-11/12">
                  <span v-if="isPrint">{{form.work_members}}</span>
                  <ml-input v-else class="w-8/12" v-model="form.work_members" :readonly="board.readonly"/>
                </vs-col>
              </vs-row>

              <vs-row class="mb-4 flex" vs-align="center">
                <vs-col class="w-1/12 title">작업기간</vs-col>
                <vs-col class="w-6/12 flex" vs-align="center">
                  <span v-if="isPrint">{{form.work_sdate}} ~ {{ form.work_edate }}</span>
                  <div v-else>
                    <date-selector style="width:140px;" v-model="form.work_sdate" :readonly="board.readonly"/>
                    <span class="mx-4">~</span>
                    <date-selector style="width:140px;" v-model="form.work_edate" :readonly="board.readonly"/>
                  </div>
                </vs-col>
              </vs-row>

              <vs-row class="mb-4" vs-align="center">
                <vs-col class="w-1/12 title">작업시간</vs-col>
                <vs-col class="w-6/12 flex" vs-align="center">
                  <span v-if="isPrint">{{form.work_stime}} ~ {{ form.work_etime }}</span>
                  <div v-else class="flex" style="align-items: center;">
                    <time-selector style="width:140px;" v-model="form.work_stime"></time-selector>
                    <span class="mx-4">~</span>
                    <time-selector style="width:140px;" v-model="form.work_etime"></time-selector>
                  </div>
                </vs-col>
              </vs-row>

              <vs-row class="mb-4" vs-align="center">
                <vs-col class="w-1/12 title">작업장소</vs-col>
                <vs-col class="w-5/12 flex" vs-align="center">
                  <span v-if="isPrint">{{form.work_place}}</span>
                  <ml-input v-else class="w-full" v-model="form.work_place" :readonly="board.readonly"/>
                </vs-col>
                <vs-col class="w-2/12 title text-right pr-2">기계·기구·설비명</vs-col>
                <vs-col class="w-4/12 flex" vs-align="center">
                  <span v-if="isPrint">{{form.work_equipage_name}}</span>
                  <ml-input v-else class="w-full" v-model="form.work_equipage_name" :readonly="board.readonly"/>
                </vs-col>
              </vs-row>

              <vs-row class="mb-4 flex" vs-align="center">
                <vs-col class="w-1/12 title" style="align-self: flex-start">작업개요</vs-col>
                <vs-col class="w-11/12">
                  <span v-if="isPrint">{{form.work_content}}</span>
                  <ml-textarea v-else v-model="form.work_content" rows="5" :readonly="board.readonly"/>
                </vs-col>
              </vs-row>

              <vs-row class="mb-4 flex" vs-align="center">
                <vs-col class="w-1/12 title" style="align-self: flex-start">추가 위험요소</vs-col>
                <vs-col class="w-11/12">
                  <span v-if="isPrint">{{form.work_add_risk}}</span>
                  <ml-textarea v-else v-model="form.work_add_risk" rows="5" :readonly="board.readonly"/>
                </vs-col>
              </vs-row>


            </vs-row>
          </vs-row>

          <!-- 안전조치 -->
          <vs-row class="mb-4">
            <vs-col><h5><i class="dot"></i>안전조치 요구사항</h5></vs-col>
          </vs-row>
          <vs-row class="mb-8">
            <vs-col>
              <safety-measures-header/>
              <safety-measures-item v-for="(item, index) in form.workTypeB" :key="`safety-measures_${index}`"
                                    v-if="item"
                                    :title="form.workTypeB_title_list[index]"
                                    :is-print="isPrint"
                                    :readonly="board.readonly"
                                    v-model="form.workTypeB_check_list[index]"/>
              <safety-measures-none v-if="!isMoreThanOneCheckTypeB"/>
            </vs-col>
          </vs-row>

          <!-- 가스측정결과(작업 시 기록) -->
          <vs-row v-if="form.workTypeB[1]" class="mb-4">
            <vs-col><h5><i class="dot"></i>가스측정결과(작업 시 기록)</h5></vs-col>
          </vs-row>
          <vs-row v-if="form.workTypeB[1]" class="mb-8">
            <vs-col class="w-4/12">
              <vs-row style="height:51px;">
                <vs-col class="w-5/12 gas-item gas-item-title border-top border-bottom border-right "><i class="small-dot"/>구분</vs-col>
                <vs-col class="w-7/12 gas-item gas-item-title border-top border-bottom border-right "></vs-col>
              </vs-row>
              <vs-row style="height:51px;">
                <vs-col class="w-5/12 gas-item gas-item-title border-bottom border-right "><i class="small-dot"/>측정일시(1회)</vs-col>
                <vs-col class="w-7/12 gas-item border-bottom border-right">
                  <span v-if="isPrint">{{form.gas.date1}}</span>
                  <ml-input v-else class="w-full" v-model="form.gas.date1" :readonly="board.readonly"/>
                </vs-col>
              </vs-row>
              <vs-row style="height:51px;">
                <vs-col class="w-5/12 gas-item gas-item-title border-bottom border-right " ><i class="small-dot"/>가스명(1회)</vs-col>
                <vs-col class="w-7/12 gas-item border-bottom border-right">
                  <span v-if="isPrint">{{form.gas.name1}}</span>
                  <ml-input v-else class="w-full" v-model="form.gas.name1" :readonly="board.readonly"/>
                </vs-col>
              </vs-row>
            </vs-col>
            <vs-col class="w-4/12">
              <vs-row style="height:51px;">
                <vs-col class="w-5/12 gas-item gas-item-title border-top border-right border-bottom"><i class="small-dot"/>구분</vs-col>
                <vs-col class="w-7/12 gas-item gas-item-title border-top border-bottom border-right "></vs-col>
              </vs-row>
              <vs-row style="height:51px;">
                <vs-col class="w-5/12 gas-item gas-item-title border-bottom border-right "><i class="small-dot"/>측정일시(2회)</vs-col>
                <vs-col class="w-7/12 gas-item border-bottom border-right">
                  <span v-if="isPrint">{{form.gas.date2}}</span>
                  <ml-input v-else class="w-full" v-model="form.gas.date2" :readonly="board.readonly"/>
                </vs-col>
              </vs-row>
              <vs-row style="height:51px;">
                <vs-col class="w-5/12 gas-item gas-item-title border-bottom border-right "><i class="small-dot"/>가스명(2회)</vs-col>
                <vs-col class="w-7/12 gas-item border-bottom border-right">
                  <span v-if="isPrint">{{form.gas.name2}}</span>
                  <ml-input v-else class="w-full" v-model="form.gas.name2" :readonly="board.readonly"/>
                </vs-col>
              </vs-row>
            </vs-col>
            <vs-col class="w-4/12">
              <vs-row style="height:51px;">
                <vs-col class="w-5/12 gas-item gas-item-title border-top border-right border-bottom"><i class="small-dot"/>구분</vs-col>
                <vs-col class="w-7/12 gas-item gas-item-title border-top border-bottom"></vs-col>
              </vs-row>
              <vs-row style="height:51px;">
                <vs-col class="w-5/12 gas-item gas-item-title border-bottom border-right "><i class="small-dot"/>측정일시(3회)</vs-col>
                <vs-col class="w-7/12 gas-item border-bottom ">
                  <span v-if="isPrint">{{form.gas.date3}}</span>
                  <ml-input v-else class="w-full" v-model="form.gas.date3" :readonly="board.readonly"/>
                </vs-col>
              </vs-row>
              <vs-row style="height:51px;">
                <vs-col class="w-5/12 gas-item gas-item-title border-bottom border-right "><i class="small-dot"/>가스명(3회)</vs-col>
                <vs-col class="w-7/12 gas-item border-bottom ">
                  <span v-if="isPrint">{{form.gas.name3}}</span>
                  <ml-input v-else class="w-full" v-model="form.gas.name3" :readonly="board.readonly"/>
                </vs-col>
              </vs-row>
            </vs-col>
          </vs-row>

          <!-- 사용기기 작동 확인 및 추가 안전조치 요구사항 -->
          <vs-row class="mb-4">
            <vs-col><h5><i class="dot"></i>사용기기 작동 확인 및 추가 안전조치 요구사항</h5></vs-col>
          </vs-row>
          <safety-measures-device-verification-and-requirements class="mb-8" v-model="form.deviceVerificationAndRequirements" :is-print="isPrint" :readonly="board.readonly"/>

          <!-- 담당자 -->
          <vs-row class="mb-4">
            <vs-col><h5><i class="dot"></i>담당자</h5></vs-col>
          </vs-row>
          <vs-row class="mb-4">
            <vs-col class="w-2/12 title">안전보건담당자</vs-col>
            <vs-col class="w-10/12 flex" style="flex-wrap: wrap;" vs-align="center">
              <div class="flex mr-4" vs-align="center">
                <span class="mr-2" style="align-self: center">이름</span>
                <span v-if="isPrint">{{form.manager.safetyOfficer}}</span>
                <ml-input v-else v-model="form.manager.safetyOfficer" :readonly="board.readonly"/>
              </div>
            </vs-col>
          </vs-row>
          <vs-row>
            <vs-col class="w-2/12 title">승인자</vs-col>
            <vs-col class="w-10/12 flex" style="flex-wrap: wrap;" vs-align="center">
              <div class="flex mr-4 mb-4" vs-align="center">
                <span class="mr-2" style="align-self: center">부서</span>
                <span v-if="isPrint">{{form.manager.department}}</span>
                <ml-input v-else v-model="form.manager.department" :readonly="board.readonly"/>
              </div>
              <div class="flex mr-4 mb-4" vs-align="center">
                <span class="mr-2" style="align-self: center">직책</span>
                <span v-if="isPrint">{{form.manager.position}}</span>
                <ml-input v-else v-model="form.manager.position" :readonly="board.readonly" />
              </div>
              <div class="flex mr-4 mb-4" vs-align="center">
                <span class="mr-2" style="align-self: center">성명</span>
                <span v-if="isPrint">{{form.manager.name}}</span>
                <ml-input v-else v-model="form.manager.name" :readonly="board.readonly" />
              </div>
            </vs-col>
          </vs-row>

        </vx-card>

        <div v-if="!isPrint" style="position: absolute; top: 0px; right: 0px; bottom:0; z-index:20;">
          <label class="toggle-btn" @click="onClickToggleSide">
            <feather-icon v-if="this.toggleSide" icon="ChevronRightIcon" style="width:18px; height:18px;"/>
            <feather-icon v-else icon="ChevronLeftIcon" style="width:18px; height:18px;"/>
          </label>
        </div>
      </vs-col>
      <vs-col style="min-width:220px;">
        <approval-process-module
          :board="board"
          :isPrint="isPrint"
          :commentabled="!(board.isCompleteApproval || board.savable)"

          @handleClickUpload="handleClickUpload"
          @handleClickOk="handleClickOk"
          @handleClickNo="handleClickNo"
          @handleSendApprovalProcess="handleSendApprovalProcess"
        ></approval-process-module>
      </vs-col>
    </vs-row>

    <!-- TODO : 얼럿데이터 -->
    <popup-alert v-model="alert.show"
                 :is-confirm="alert.isConfirm"
                 :html="alert.html"
                 :message="alert.message"
                 :buttons="alert.buttons"

                 @upload="alertUpload"
                 @ok="alertOk"
                 @no="alertNo"
                 @print="alertPrint"
    ></popup-alert>


  </div>
</template>
<script>
import DateSelector from '@/components/selector/DateSelector'
import TimeSelector from '@/components/selector/TimeSelector'
import WarningLvSelector from '@/components/selector/WarningLvSelector'
import SafetyMeasuresHeader from '@/views/project/risk/permit/components/SafetyMeasuresHeader'
import SafetyMeasuresNone from '@/views/project/risk/permit/components/SafetyMeasuresNone'
import SafetyMeasuresItem from '@/views/project/risk/permit/components/SafetyMeasuresItem'
import SafetyMeasuresDeviceVerificationAndRequirements
  from '@/views/project/risk/permit/components/SafetyMeasuresDeviceVerificationAndRequirements'
import ApprovalProcessModule from '@/views/modules/ApprovalProcessModule'
import PopupAlert from '@/popup/PopupAlert'

export default {
  name: 'RiskPermitWorkDocWrite',
  props: {
    isUpdateMode: Boolean,
    boardId: Number,
    boardSlug: String,
    tagKey: String
  },
  components: {
    PopupAlert,
    ApprovalProcessModule,
    SafetyMeasuresDeviceVerificationAndRequirements,
    SafetyMeasuresItem,
    SafetyMeasuresNone,
    SafetyMeasuresHeader,
    WarningLvSelector,
    TimeSelector,
    DateSelector
  },
  watch:{
    'form.workTypeB' (value) {
      const data = ['화기작업', '밀폐공간작업', '정전작업', '위험기계 사용 작업', '고소작업', '중장비작업', '헬기작업', '일반작업']

      this.form.summary.workTypeB = []
      for (let i = 0; i < 8; i++) {
        if (this.form.workTypeB[i]) {
          const obj = {}
          obj[data[i]] = 1
          this.form.summary.workTypeB.push(obj)
        }
      }
    }
  },

  computed: {
    projectInfo () {
      return this.$store.state.project.projectInfo
    },

    // typeB 리스트 중 선택이 하나라도 있는지 체크
    isMoreThanOneCheckTypeB () {
      for (const check of this.form.workTypeB) {
        if (check) {
          return true
        }
      }
      return false
    },
    myInfo () {
      if (this.$store.state.auth.userInfo) {
        return {
          department: this.$store.state.auth.userInfo.department,
          name: this.$store.state.auth.userInfo.name
        }
      }

      return {
        department: '',
        name: ''
      }
    },
    getClasses () {
      if (this.toggleSide) {
        return 'fix-grid'
      }
      return 'hide-grid'
    }
  },

  data () {
    return {
      // TODO : 글쓰기 정보 및 권한
      board:{
        id: this.boardId,
        slug: this.boardSlug,
        statusCode: '', // 문서 상태코드
        writer: {}, //작성자 정보
        turnApprovalId: 0, // 결재자 ID
        readonly: false, // 읽기전용인가
        isWriter: true, // 작성자인가
        savable: true, // 임시저장이 가능하나
        isCompleteApproval: false, // 결재완료된 문서인가
        isTurnApproval: false, // 결재할 차례인가
        approvalLine:[], // 결재라인
        commentList:[] // 댓글리스트
      },

      // TODO : 얼럿데이터
      alert:{
        show:false,
        message:'결재하시겠습니까?',
        buttons:[
          { label:'승인', action:'ok' },
          { label:'취소', action:'cancel' }
        ]
      },

      form: {
        gas: {
          date1: '',
          date2: '',
          date3: '',
          name1: '',
          name2: '',
          name3: ''
        },
        manager: {
          safetyOfficer: '',
          department: '',
          position: '',
          name: ''
        },
        applicant: {
          department: '',
          position: '',
          name: ''
        },
        project_title: '',
        type: '1',
        permitDate:'', // 허가일자
        workTypeA: [false, false, false, false, false], //특별작업 { 타워크레인 설치/연장/해체 작업, 외부로프 작업, 곤도라 작업, 호이스트 설치/연장/해체 작업, 밀폐공간 작업 }
        workTypeA_check_list: [],
        workTypeB: [false, false, false, false, false, false, false, false], //일반작업 { 시스템 동바리 작업, 이동식 장비작업, 갱폼 설치/해제, 가설비계 설치/해제, 대형 판넬 설치/해제, 지하층 용접 및 용단 작업 }
        workTypeB_title_list: ['화기작업', '밀폐공간작업', '정전작업', '위험기계 사용 작업', '고소작업', '중장비작업', '헬기작업', '일반작업'], //일반작업 { 시스템 동바리 작업, 이동식 장비작업, 갱폼 설치/해제, 가설비계 설치/해제, 대형 판넬 설치/해제, 지하층 용접 및 용단 작업 }
        workTypeB_check_list: [],
        workTypeC: [false], //일반작업
        workTypeC_check_list: [],
        com_name: '', // 파트너사
        work_place: '', // 장소/위치
        work_members: '', // 작업조원
        work_equipage_name: '', // 기계 기구 설비명
        member_am: '', // 주간인원
        member_pm: '', // 야간인원
        work_content: '', // 작업내용
        work_add_risk: '', // 추가 위험요소
        work_sdate: '', // 작업시작 날짜
        work_edate: '', // 작업시작 종료날짜
        work_stime: '', // 작업시작 시간
        work_etime: '', // 작업시작 종료시간
        deviceVerificationAndRequirements: {
          deviceName: '', // 사용기기명
          work_manager: '', //작업담당자
          safety_training_contents: '', // 안전 교육 내용
          etc: '' // 기타 당부 및 조치사항
        },
        preview: {
          title: '',
          place: '',
          type: '',
          work: ''
        },

        summary: {
          workTypeB: []
        }
      },
      oldForm:{},

      typeList: [
        { text:'단위현장 1', value:'1' },
        { text:'단위현장 2', value:'2' },
        { text:'단위현장 3', value:'3' },
        { text:'단위현장 4', value:'4' },
        { text:'단위현장 5', value:'5' }
      ],

      toggleSide: true,
      isPrint: false,
    }
  },

  created () {
    if (this.isUpdateMode) {
      this.loadPost()
    } else {
      this.init()
    }

  },

  mounted () {
    const backButtonRouteGuard = this.$router.beforeEach((to, from, next) => {

      if (JSON.stringify(this.oldForm) === JSON.stringify(this.form)) {
        next(true)
      } else if (confirm('저장하지 않은 데이터는 삭제됩니다. 닫으시겠습니까?')) {
        next(true)
      }

    })
    this.$once('hook:destroyed', () => {
      backButtonRouteGuard()
    })

  },

  methods: {
    onClickToggleSide () {
      this.toggleSide = !this.toggleSide
    },
    async init () {
      this.board.writer = {
        id: this.$store.state.auth.userInfo.id,
        name: this.$store.state.auth.userInfo.name,
        company_id: this.$store.state.auth.userInfo.company_id,
        company_name: this.$store.state.auth.userInfo.company_name
      }
      await this.$store.dispatch('company/LOAD_COMPANY', {companyId:this.board.writer.company_id})
      this.board.writer.company_name = this.$store.state.company.companyInfo.com_name
      this.form.writer = this.board.writer.name
      this.form.company = this.board.writer.company_name

      const project_id = this.$route.params.proj_id
      await this.$store.dispatch('project/LOAD_PROJECT', {project_id})

      this.form.type = this.$store.state.project.projectInfo.field_name
      this.form.project_title = this.$store.state.project.projectInfo.field_name

      // eslint-disable-next-line no-unused-vars
      this.form.workTypeB_check_list.push(this.initSafetyMeasuresFire())
      this.form.workTypeB_check_list.push(this.initSafetyMeasuresCloseness())
      this.form.workTypeB_check_list.push(this.initSafetyMeasuresBlackout())
      this.form.workTypeB_check_list.push(this.initSafetyMeasuresDangerousMachine())
      this.form.workTypeB_check_list.push(this.initSafetyMeasuresPlaint())
      this.form.workTypeB_check_list.push(this.initSafetyMeasuresHeavyEquipment())
      this.form.workTypeB_check_list.push(this.initSafetyMeasuresHeli())
      this.form.workTypeB_check_list.push(this.initSafetyMeasuresNormal())

      this.oldForm = JSON.parse(JSON.stringify(this.form))

      this.form.applicant.department = this.myInfo.department
      this.form.applicant.name = this.myInfo.name

      if (this.tagKey === 'work_export') {
        this.form.applicant.department = this.form.company
      }
    },

    // 화기작업
    initSafetyMeasuresFire () {
      return [
        { text: '작업구역 설정(출입경고 표지)',  isAction: false, isCheck: false},
        { text: '비산불티차단막 설치',  isAction: false, isCheck: false},
        { text: '가스농도 측정',  isAction: false, isCheck: false},
        { text: '정전/잠금/표지부착',  isAction: false, isCheck: false},
        { text: '밸브차단 및 차단표지 부착',  isAction: false, isCheck: false},
        { text: '환기장비',  isAction: false, isCheck: false},
        { text: '맹판설치 및 표지부착',  isAction: false, isCheck: false},
        { text: '조명장비',  isAction: false, isCheck: false},

        { text: '용기개방 및 압력방출',  isAction: false, isCheck: false},
        { text: '소화기',  isAction: false, isCheck: false},
        { text: '위험물질방출 및 처리',  isAction: false, isCheck: false},
        { text: '안전장구',  isAction: false, isCheck: false},
        { text: '용기내부 세정 및 처리',  isAction: false, isCheck: false},
        { text: '안전교육',  isAction: false, isCheck: false},
        { text: '불활성가스 치환 및 환기',  isAction: false, isCheck: false},
        { text: '방폭형 기기 또는 도구',  isAction: false, isCheck: false}
      ]
    },

    // 밀폐공간작업
    initSafetyMeasuresCloseness () {
      return [
        { text: '벨브차단 및 차단표식부착',  isAction: false, isCheck: false},
        { text: '정전/잠금/표지부착',  isAction: false, isCheck: false},
        { text: '산소 및 가스농도 측정',  isAction: false, isCheck: false},
        { text: '환기정비',  isAction: false, isCheck: false},
        { text: '통신수단',  isAction: false, isCheck: false},
        { text: '안전교육',  isAction: false, isCheck: false},
        { text: '맹판설치 및 표지부착',  isAction: false, isCheck: false},
        { text: '안전보호구(송기마스크 등)',  isAction: false, isCheck: false},
        { text: '공기/물 치환 및 환기',  isAction: false, isCheck: false},
        { text: '조명장비',  isAction: false, isCheck: false},
        { text: '압력방출',  isAction: false, isCheck: false},
        { text: '소화기',  isAction: false, isCheck: false}
      ]
    },

    // 정전작업
    initSafetyMeasuresBlackout () {
      return [
        { text: '주 차단 스위치 내림 ',  isAction: false, isCheck: false},
        { text: '잔류전하 방전',  isAction: false, isCheck: false},
        { text: '제어차단기 내림',  isAction: false, isCheck: false},
        { text: '검전기로 충전여부 확인',  isAction: false, isCheck: false},
        { text: '잠금장치',  isAction: false, isCheck: false},
        { text: '단락접지기구 설치',  isAction: false, isCheck: false},
        { text: '시험전원 차단',  isAction: false, isCheck: false},
        { text: '현장스위치 내림',  isAction: false, isCheck: false},
        { text: '차단표지판 부착',  isAction: false, isCheck: false},
        { text: '',  isAction: false, isCheck: false}
      ]
    },

    // 위험기계 사용 작업
    initSafetyMeasuresDangerousMachine () {
      return [
        { text: '사용 기계·기구·설비 방호조치',  isAction: false, isCheck: false},
        { text: '보호구 착용',  isAction: false, isCheck: false},
        { text: '작업구역 설정(출입경고 표지)',  isAction: false, isCheck: false},
        { text: '안전교육',  isAction: false, isCheck: false},
        { text: '인화성액체 사용시 소화기 비치',  isAction: false, isCheck: false},
        { text: '외부인 접근금지 조치',  isAction: false, isCheck: false},
        { text: '화기작업시 인화물질 제거',  isAction: false, isCheck: false},
        { text: '정전조치시 잠금 및 표지부착',  isAction: false, isCheck: false},
        { text: '화기작업시 불꽃방지막 사용',  isAction: false, isCheck: false},
        { text: '조명장비  ',  isAction: false, isCheck: false}
      ]
    },

    // 고소작업
    initSafetyMeasuresPlaint () {
      return [
        { text: '작업에 적합한 작업발판 및 안전난간설치 여부',  isAction: false, isCheck: false},
        { text: '안전모, 안전대 착용 및 부착 여부',  isAction: false, isCheck: false},
        { text: '추락 방지용 방망 설치 여부',  isAction: false, isCheck: false},
        { text: '개구부 조치',  isAction: false, isCheck: false}
      ]
    },

    // 중장비작업
    initSafetyMeasuresHeavyEquipment () {
      return [
        { text: '작업구역 설정(출입경고 표지)',  isAction: false, isCheck: false},
        { text: '조명장비',  isAction: false, isCheck: false},
        { text: '사용장비 방호조치',  isAction: false, isCheck: false},
        { text: '보호구 착용',  isAction: false, isCheck: false},
        { text: '소화기 비치',  isAction: false, isCheck: false},
        { text: '안전교육',  isAction: false, isCheck: false},
        { text: '외부인 통제 조치',  isAction: false, isCheck: false},
        { text: '헬기유도 요원 배치',  isAction: false, isCheck: false}
      ]
    },

    // 헬기작업
    initSafetyMeasuresHeli () {
      return [
        { text: '작업구역 설정(출입경고 표지)',  isAction: false, isCheck: false},
        { text: '조명장비',  isAction: false, isCheck: false},
        { text: '사용장비 방호조치',  isAction: false, isCheck: false},
        { text: '보호구 착용',  isAction: false, isCheck: false},
        { text: '소화기 비치',  isAction: false, isCheck: false},
        { text: '안전교육',  isAction: false, isCheck: false},
        { text: '외부인 통제 조치',  isAction: false, isCheck: false},
        { text: '헬기유도 요원 배치',  isAction: false, isCheck: false}
      ]
    },

    // 일반작업
    initSafetyMeasuresNormal () {
      return [
        { text: '작업구역 설정(출입경고 표지)',  isAction: false, isCheck: false},
        { text: '조명장비',  isAction: false, isCheck: false},
        { text: '사용장비 방호조치',  isAction: false, isCheck: false},
        { text: '보호구 착용',  isAction: false, isCheck: false},
        { text: '소화기 비치',  isAction: false, isCheck: false},
        { text: '안전교육',  isAction: false, isCheck: false},
        { text: '외부인 통제 조치',  isAction: false, isCheck: false},
        { text: '헬기유도 요원 배치',  isAction: false, isCheck: false}
      ]
    },

    async loadPost () {
      // 내용불러오기
      const boardSlug = this.board.slug
      const postId = this.$route.params.postId
      await this.$store.dispatch('approval/LOAD_POST', {boardSlug, postId})

      if (!this.$store.state.approval.postInfo) {
        alert('열람 권한이 없습니다.')
        this.oldForm = this.form
        this.$router.back()
        return
      }
      const post = JSON.parse(this.$store.state.approval.postInfo.post_content)
      this.form = post

      this.form.project_title = post.project_title
      this.form.preview = {
        title: '',
        place: '',
        sdate: '',
        edate: '',
        type: '',
        work: ''
      }

      if (!this.form.summary) {
        this.form.summary = {
          workTypeB: []
        }
      }

      const list = []
      const data = ['화기작업', '밀폐공간작업', '정전작업', '위험기계 사용 작업', '고소작업', '중장비작업', '헬기작업', '일반작업']
      for (let i = 0; i < 8; i++) {
        if (this.form.workTypeB[i]) {
          const obj = {}
          obj[data[i]] = 1
          list.push(obj)
        }
      }
      this.form.summary.workTypeB = list

      // TODO : 결재프로세스
      await this.$store.dispatch('USER_INFO')
      const myId = this.$store.state.auth.userInfo.id
      const doc = this.$store.state.approval.document
      this.board.statusCode = doc.status.code
      this.board.writer = doc.writer
      this.board.turnApprovalId = doc.turn_approval_id
      this.board.isWriter = (this.board.writer.id === myId)
      this.board.isTurnApproval = (this.board.turnApprovalId === myId && (this.board.statusCode === 'registered' || this.board.statusCode === 'ongoing'))
      this.board.readonly = !((this.board.isWriter && (this.board.statusCode === 'temp' || this.board.statusCode === 'rejected')) || this.board.isTurnApproval)
      this.board.resend = (this.board.isWriter && this.board.statusCode === 'rejected')
      this.board.isCompleteApproval = (this.board.statusCode === 'approved' || this.board.statusCode === 'rejected')
      this.board.savable = this.board.isWriter && (this.board.statusCode === 'temp')
      this.board.collection = this.board.isWriter && (this.board.statusCode === 'registered')
      this.board.approvalLine = doc.line.slice()

      this.oldForm = JSON.parse(JSON.stringify(this.form))
    },

    async register (_isTemp) {
      const projectId = this.$route.params.proj_id
      const boardSlug = this.board.slug
      const title = this.form.project_title
      const approvalLine = JSON.stringify(this.lineToSendLine(this.board.approvalLine))
      const security = 'normal' // 문서보안 등급 ['일반', 대외비 1급, 대외비 2급, 인비, 극비] [normal,confidential1,confidential2,personally,confidential0]
      const priority = 'medium' // 문서 중요도 [매우낮음, 낮음, 보통, 높음, 매우 높음] [lowest,low,medium,high,highest]

      this.form.preview.type = this.form.type
      this.form.preview.title = this.form.project_title
      this.form.preview.work_place = this.form.work_place
      this.form.preview.work_sdate = this.form.work_sdate
      this.form.preview.work_edate = this.form.work_edate

      let work = ''
      for (let i = 0; i < this.form.workTypeA.length; i++) {
        if (this.form.workTypeA[i]) {
          work += `sw_${i},`
        }
      }

      for (let i = 0; i < this.form.workTypeB.length; i++) {
        if (this.form.workTypeB[i]) {
          work += `w_${i},`
        }
      }

      for (let i = 0; i < this.form.workTypeC.length; i++) {
        if (this.form.workTypeC[i]) {
          work += `gw_${i},`
        }
      }
      this.form.preview.work = work
      this.form.search = {
        workTypeB:[]
      }
      if ( this.form.workTypeB[0] ) this.form.search.workTypeB.push('화기작업')
      if ( this.form.workTypeB[1] ) this.form.search.workTypeB.push('밀폐공간작업')
      if ( this.form.workTypeB[2] ) this.form.search.workTypeB.push('정전작업')
      if ( this.form.workTypeB[3] ) this.form.search.workTypeB.push('위험기계 사용 작업')
      if ( this.form.workTypeB[4] ) this.form.search.workTypeB.push('고소작업')
      if ( this.form.workTypeB[5] ) this.form.search.workTypeB.push('중장비작업')
      if ( this.form.workTypeB[6] ) this.form.search.workTypeB.push('헬기작업')
      if ( this.form.workTypeB[7] ) this.form.search.workTypeB.push('일반작업')

      this.form.date = this.form.permitDate
      const content = JSON.stringify(this.form)

      try {

        if (this.isUpdateMode) {
          const postId = this.$route.params.postId

          if (_isTemp) {
            // 바로 상신하기
            const unTemp = 'y'
            await this.$store.dispatch('approval/UPDATE_POST', {boardSlug, postId, title, content, approvalLine, projectId, unTemp})
            alert('상신되었습니다.')
          } else {
            // 임시 저장하기
            const unTemp = 'n'
            await this.$store.dispatch('approval/UPDATE_POST', {boardSlug, postId, title, content, approvalLine, projectId, unTemp})
            alert('임시저장되었습니다.')
          }
        } else {

          let isTemp = 0 // else if 를 쓰지 않으면 생기는 eslint error 를 없애기 위해 isTemp 변수를 밖으로 뺌
          if (_isTemp) {
            // 바로 상신하기
            await this.$store.dispatch('approval/CREATE_POST', {boardSlug, title, content, approvalLine, security, priority, projectId})
            alert('상신되었습니다.')
          } else {
            // 임시 저장하기
            isTemp = 1
            await this.$store.dispatch('approval/CREATE_POST', {boardSlug, title, content, approvalLine, security, priority, projectId, isTemp})
            alert('임시저장되었습니다.')
          }
        }

        this.oldForm = JSON.parse(JSON.stringify(this.form))
        this.$router.back()

      } catch (e) {
        if (this.$store.state.approval.error_data.title) {
          alert('현장명이 없습니다')
        } else {
          console.log(this.$store.state.approval.error_code)
        }
      }

    },

    handleBackMenu () {
      this.$emit('handleBackMenu', 'work')
    },

    handleClickRegister () {
      if (confirm('저장하시겠습니까?')) {
        this.register()
      }
    },

    onChangeType (a) {
    },

    handleClickUpload () {
      this.alert.buttons = [
        { label:'상신', action:'upload' },
        { label:'취소', action:'cancel', type:'border' }
      ]
      this.alert.show = true
    },

    handleClickNo () {
      this.alert.html = '<p>반려하시겠습니까?</p><p>아래에 사유를 작성해주세요.</p>'
      this.alert.message = ''
      this.alert.isConfirm = true
      this.alert.buttons = [
        {
          label: '반려',
          action: 'no'
        },
        {
          label: '취소',
          action: 'cancel',
          type: 'border'
        }
      ]
      this.alert.show = true
    },
    async handleClickOk () {
      this.alert.html = ''
      this.alert.message = '승인하시겠습니까?'
      this.alert.isConfirm = false
      this.alert.buttons = [
        {
          label: '승인',
          action: 'ok'
        },
        {
          label: '취소',
          action: 'cancel',
          type: 'border'
        }
      ]
      this.alert.show = true
    },

    handleSendApprovalProcess (process) {
      this.board.approvalLine = process
    },

    // TODO : 얼럿데이터
    alertUpload () {
      this.register(true)
    },

    // TODO : 얼럿데이터
    async alertOk () {

      // 리스트 노출 정보
      this.form.preview.title = this.form.title
      this.form.preview.project_title = this.form.project_title
      this.form.preview.checkDate = this.form.checkDate
      this.form.preview.writer = this.form.writer
      const content = JSON.stringify(this.form)


      const postId = this.$route.params.postId
      await this.$store.dispatch('approval/APPROVE_OK', {postId, content})
      document.location.reload()
    },

    async alertNo (text) {
      const postId = this.$route.params.postId
      const comment = text
      await this.$store.dispatch('approval/APPROVE_NO', {
        postId,
        comment
      })
      document.location.reload()
    },

    // TODO : 결재프로세스
    // ApprovalProcessModule 에서 사용하는 line 방식에서 전송용 line 으로 변경
    lineToSendLine (data) {
      const approvalList = []
      for (const member of data) {
        if (member.type_code !== 'register') {
          approvalList.push({
            id : member.user_id,
            name : member.user_name,
            elementType : member.type_code
          })
        }
      }
      return approvalList
    },

    // 글 삭제
    async handleDeletePost () {
      if (confirm('삭제하시겠습니까?')) {
        const boardSlug = this.board.slug
        const postId = this.$route.params.postId
        await this.$store.dispatch('approval/DELETE_POST', {boardSlug, postId})
        this.oldForm = this.form
        this.$router.back()
      }
    },

    alertPrint () {
      this.print()
    },

    print () {
      this.isPrint = true
      setTimeout(() => {
        var g_oBeforeBody = document.getElementById('print-report').innerHTML
        // 프린트를 보이는 그대로 나오기위한 셋팅
        window.onbeforeprint = function (ev) {
          document.body.innerHTML = g_oBeforeBody
        }
        window.print()
        //location.reload()
      }, 300)
    },

    handlePrint () {
      this.alert.html = '<p>인쇄후 페이지가 새로고침됩니다. 저장하지 않은 데이터는 삭제 됩니다</p><p>인쇄하시겠습니까?</p>'
      this.alert.message = ''
      this.alert.isConfirm = false
      this.alert.buttons = [
        { label: '인쇄', action: 'print' },
        { label: '취소', action: 'cancel', type: 'border' }
      ]
      this.alert.show = true
    }
  }
}
</script>

<style lang="scss" scoped>
.vs-row.border {
  border-left: none;
  border-right: none;
}

ul.table li.space {
  background-color: #fff;
  height: 16px;
}

ul.table li span.list {
  width: 100%;
  height: 100%;
  padding: 0;

  display: flex;
  flex-flow: wrap;
}

ul.table li span.list p {
  width: 100% !important;
  height: 52px;
  padding-left: 15px;
  padding-right: 15px;

  display: inline-flex;
  justify-content: flex-start;
  align-items: center;
}

ul.table li span.left {
  justify-content: left;
}


ul.table-1-a-1-1 li {
  grid-template-columns: 8.33% 1fr 8.33% 8.33%;
}

ul.table-1-1-1-1-a-a-a li {
  grid-template-columns: 8.33% 8.33% 8.33% 8.33% 1fr 1fr 1fr;
}

.gas-item {
  display:flex; justify-content: center; align-items: center;
}

.gas-item-title {
  background-color: #F9F9F9;
}


</style>

<style lang="scss" scoped>
.fix-grid {
  display: grid !important;
  grid-template-columns: 9fr 3fr;
}
.hide-grid {
  display: grid !important;
  grid-template-columns: 9fr 0px;
}
.toggle-btn {
  padding: 0.5rem !important;
  height: 100%;
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  background-color: lightgray;
  color:#fff;
}
</style>
<style>
.con-vs-tabs .con-slot-tabs {
  overflow: initial;
}
</style>

