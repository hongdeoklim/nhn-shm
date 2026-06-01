<template>
  <div>
    <vs-row class="my-4">
      <vs-col><h5><i class="dot"></i>직원 안전사고 조사보고서</h5></vs-col>
    </vs-row>

    <!-- 사고자 정보 -->
    <vs-row
      style="border:1px solid #cdcdcd; border-bottom: none; border-right:none; display: grid; grid-template-columns: auto 1fr;">
      <vs-col class="p-4 font-bold flex border-right header-bg"
              style="width:125px;" vs-justify="center" vs-align="center">
        사고자 정보
      </vs-col>
      <vs-col class="w-full">
        <vs-row class="w-full border-bottom">
          <vs-col class="w-4/12 table-item">
            <div class="h-full header-bg">성명</div>
            <div class="p-1">
              <span v-if="isPrint"> {{ form.accidentPersonInformation.name }} </span>
              <ml-input v-else class="w-full" v-model="form.accidentPersonInformation.name"
                        :readonly="board.readonly || isCheck"/>
            </div>
          </vs-col>
          <vs-col class="w-4/12 table-item">
            <div class="h-full header-bg">성별</div>
            <div class="p-1 justify-center">
              <span v-if="isPrint">{{ form.accidentPersonInformation.gender }}</span>
              <div v-else class="flex justify-center" style="gap: 16px;">
                <vs-radio v-model="form.accidentPersonInformation.gender" vs-value="남"
                          :disabled="board.readonly || isCheck">남
                </vs-radio>
                <vs-radio v-model="form.accidentPersonInformation.gender" vs-value="여"
                          :disabled="board.readonly || isCheck">여
                </vs-radio>
              </div>
            </div>
          </vs-col>
          <vs-col class="w-4/12 table-item">
            <div class="h-full header-bg">입사일(나이)</div>
            <div class="p-0">
              <div class="p-1 border-bottom">
                <span v-if="isPrint">{{ form.accidentPersonInformation.joinDate }}</span>
                <date-selector v-else v-model="form.accidentPersonInformation.joinDate"
                               :readonly="board.readonly || isCheck"/>
              </div>
              <div class="p-1">
                <span v-if="isPrint">{{ form.accidentPersonInformation.age }}</span>
                <ml-input v-else class="w-full" v-model="form.accidentPersonInformation.age"
                          :readonly="board.readonly || isCheck"/>
              </div>
            </div>
          </vs-col>
        </vs-row>
        <vs-row class="w-full border-bottom">
          <vs-col class="w-4/12 table-item">
            <div class="h-full header-bg">직종</div>
            <div class="p-1">
              <span v-if="isPrint">{{ form.accidentPersonInformation.occupation }}</span>
              <occupation-selector v-else class="w-full" v-model="form.accidentPersonInformation.occupation"
                                   :disabled="board.readonly || isCheck"/>
            </div>
          </vs-col>
          <vs-col class="w-4/12 table-item">
            <div class="h-full header-bg">업무분류</div>
            <div class="p-1 flex justify-center">
              <span v-if="isPrint">{{ form.accidentPersonInformation.task }}</span>
              <business-class-selector v-else class="w-full" v-model="form.accidentPersonInformation.task"
                                       :disabled="board.readonly || isCheck"/>
            </div>
          </vs-col>
          <vs-col class="w-4/12 table-item">
            <div class="h-full header-bg">보상현황</div>
            <div class="p-1">
              <span v-if="isPrint">{{ form.accidentPersonInformation.compensationStatus }}</span>
              <ml-input v-else-if="!isCheck" class="w-full" v-model="form.accidentPersonInformation.compensationStatus"
                        :readonly="true"/>
              <compensation-status-selector v-else class="w-full"
                                            v-model="form.accidentPersonInformation.compensationStatus"
                                            :disabled="board.readonly"/>
            </div>
          </vs-col>
        </vs-row>
        <vs-row class="w-full">
          <vs-col class="w-4/12 grid">
            <vs-row class="border-bottom">
              <vs-col class="table-item">
                <div class="h-full header-bg">재해구분</div>
                <div class="p-1">
                  <span v-if="isPrint">{{ form.accidentPersonInformation.disasterClass }}</span>
                  <disaster-class-selector v-else class="w-full" v-model="form.accidentPersonInformation.disasterClass"
                                           :disabled="board.readonly || isCheck"/>
                </div>
              </vs-col>
            </vs-row>
            <vs-row>
              <vs-col class="table-item">
                <div class="h-full header-bg">상해종류</div>
                <div class="p-1">
                  <span v-if="isPrint">{{ form.accidentPersonInformation.shanghai }}</span>
                  <shanghai-class-selector v-else class="w-full" v-model="form.accidentPersonInformation.shanghai"
                                           :disabled="board.readonly || isCheck"/>
                </div>
              </vs-col>
            </vs-row>
          </vs-col>
          <vs-col class="w-8/12 table-item">
            <div class="h-full header-bg">현재상태</div>
            <div class="p-1">
              <span v-if="isPrint">{{ form.accidentPersonInformation.currentStatus }}</span>
              <ml-textarea v-else class="w-full m-0 p-0" rows="3" v-model="form.accidentPersonInformation.currentStatus"
                           :readonly="board.readonly || isCheck"/>
            </div>
          </vs-col>
        </vs-row>
      </vs-col>
    </vs-row>

    <!-- 사전 안전조치 현황 -->
    <vs-row
      style="border:1px solid #cdcdcd; border-bottom: none; border-right:none; display: grid; grid-template-columns: auto 1fr;">
      <vs-col class="p-4 font-bold flex border-right header-bg"
              style="width:125px; justify-content: center; text-align: center;" vs-justify="center" vs-align="center">
        사전 안전조치 현황
      </vs-col>
      <vs-col class="w-full">
        <vs-row class="w-full border-bottom">
          <vs-col class="w-4/12 table-item">
            <div class="h-full header-bg">작업지시자</div>
            <div class="p-1">
              <span v-if="isPrint">{{ form.precautions.workOrder }}</span>
              <ml-input v-else class="w-full" v-model="form.precautions.workOrder"
                        :readonly="board.readonly || isCheck"/>
            </div>
          </vs-col>
          <vs-col class="w-4/12 table-item">
            <div class="h-full header-bg">안전교육자</div>
            <div class="p-1">
              <span v-if="isPrint">{{ form.precautions.safetyEducator }}</span>
              <ml-input v-else class="w-full" v-model="form.precautions.safetyEducator"
                        :readonly="board.readonly || isCheck"/>
            </div>
          </vs-col>
          <vs-col class="w-4/12 table-item">
            <div class="h-full header-bg">교육일시</div>
            <div class="p-1">
              <span v-if="isPrint">{{ form.precautions.educationDay }}</span>
              <date-selector v-else v-model="form.precautions.educationDay" :readonly="board.readonly || isCheck"/>
            </div>
          </vs-col>
        </vs-row>
        <vs-row class="w-full border-bottom">
          <vs-col class="w-4/12 table-item">
            <div class="h-full header-bg">작업인원</div>
            <div class="p-1 grid" style="grid-template-columns: auto 1fr auto; align-items: center; ">
              <span class="mr-2">총</span>
              <span v-if="isPrint">{{ form.precautions.numberOfWorkers }}</span>
              <ml-input v-else class="w-full" v-model="form.precautions.numberOfWorkers"
                        :readonly="board.readonly || isCheck"/>
              <span class="ml-2">명</span>
            </div>
          </vs-col>
          <vs-col class="w-4/12 table-item">
            <div class="h-full header-bg">작업반장</div>
            <div class="p-1">
              <span v-if="isPrint">{{ form.precautions.workgroupLeader }}</span>
              <ml-textarea v-else class="w-full p-0 m-0" rows="3" v-model="form.precautions.workgroupLeader"
                           :readonly="board.readonly || isCheck"/>
            </div>
          </vs-col>
          <vs-col class="w-4/12 table-item">
            <div class="h-full header-bg">작업조원</div>
            <div class="p-1">
              <span v-if="isPrint">{{ form.precautions.workgroupMember }}</span>
              <ml-textarea v-else class="w-full p-0 m-0" rows="3" v-model="form.precautions.workgroupMember"
                           :readonly="board.readonly || isCheck"/>
            </div>
          </vs-col>
        </vs-row>
        <vs-row class="w-full border-bottom">
          <vs-col class="w-12/12 table-item">
            <div class="h-full header-bg">작업전 안전교육내용</div>
            <div class="p-0 grid">
              <div class="p-1 border-bottom">
                <span v-if="isPrint">{{ form.precautions.beforeWork1 }}</span>
                <ml-textarea v-else class="w-full p-0 m-0" rows="3" v-model="form.precautions.beforeWork1"
                             :readonly="board.readonly || isCheck"
                             placeholder="작업에 따른 주요 위험요인 및 예상피해 교육내용 요약, 미시행이면 미시행 기록"/>
              </div>
              <div class="p-1">
                <span v-if="isPrint">{{ form.precautions.beforeWork2 }}</span>
                <ml-textarea v-else class="w-full p-0 m-0" rows="3" v-model="form.precautions.beforeWork2"
                             :readonly="board.readonly || isCheck"
                             placeholder="예방방법 및 안전수칙 준수 교육내용 및 요약, 미시행이면 미시행 기록"/>
              </div>
            </div>
          </vs-col>
        </vs-row>
        <vs-row class="w-full ">
          <vs-col class="w-12/12 table-item">
            <div class="h-full header-bg"> 안전보호구 체크</div>
            <div class="p-0 grid">
              <div class="p-1">
                <span v-if="isPrint">{{ form.precautions.safetyEquipmentCheck }}</span>
                <ml-textarea v-else class="w-full p-0 m-0" rows="3" v-model="form.precautions.safetyEquipmentCheck"
                             :readonly="board.readonly || isCheck"
                             placeholder="보호구 착용상태, 준비 여부 확인, 미확인이면 미확인 기록"/>
              </div>
            </div>
          </vs-col>
        </vs-row>
      </vs-col>
    </vs-row>

    <!-- 사고 발생 개요 및 원인 -->
    <vs-row
      style="border:1px solid #cdcdcd; border-bottom: none; border-right:none; display: grid; grid-template-columns: auto 1fr;">
      <vs-col class="p-4 font-bold flex border-right header-bg"
              style="width:125px; justify-content: center; text-align: center;" vs-justify="center" vs-align="center">
        사고 발생 개요 및 원인
      </vs-col>
      <vs-col class="w-full">
        <vs-row class="w-full border-bottom">
          <vs-col class="w-12/12 table-item">
            <div class="h-full header-bg ">발생개요</div>
            <div>
              <vs-row class="border-bottom">
                <vs-col class="w-12/12 table-item" style="border-right:none;">
                  <div class="h-full header-bg">언제<br>(사고발생일시)</div>
                  <div class="p-1">
                    <div v-if="isPrint">
                      {{ form.overviewAndAnalyze.overview.when.date }}
                      {{ form.overviewAndAnalyze.overview.when.time }}
                    </div>
                    <div v-else class="flex" style="gap:1rem;">
                      <date-selector style="width:160px;" v-model="form.overviewAndAnalyze.overview.when.date"
                                     :readonly="board.readonly || isCheck"/>
                      <time-selector style="width:160px;" v-model="form.overviewAndAnalyze.overview.when.time"
                                     :readonly="board.readonly || isCheck"/>
                    </div>
                  </div>
                </vs-col>
              </vs-row>
              <vs-row class="border-bottom">
                <vs-col class="w-12/12 table-item" style="border-right:none;">
                  <div class="h-full header-bg">어디서<br>(지역, 공간 등<br>사고발생장소)</div>
                  <div class="p-1">
                    <span v-if="isPrint">{{ form.overviewAndAnalyze.overview.where }}</span>
                    <ml-textarea v-else class="m-0 p-0 w-full" rows="3" v-model="form.overviewAndAnalyze.overview.where"
                                 :readonly="board.readonly || isCheck"/>
                  </div>
                </vs-col>
              </vs-row>
              <vs-row class="border-bottom">
                <vs-col class="w-12/12 table-item" style="border-right:none;">
                  <div class="h-full header-bg">누가<br>(사고자)</div>
                  <div class="p-1">
                    <span v-if="isPrint">{{ form.overviewAndAnalyze.overview.who }}</span>
                    <ml-textarea v-else class="m-0 p-0 w-full" rows="3" v-model="form.overviewAndAnalyze.overview.who"
                                 :readonly="board.readonly || isCheck"/>
                  </div>
                </vs-col>
              </vs-row>
              <vs-row class="border-bottom">
                <vs-col class="w-12/12 table-item" style="border-right:none;">
                  <div class="h-full header-bg">무엇을 사용,<br>어떤 환경에서<br>(작업여건)</div>
                  <div class="p-1">
                    <span v-if="isPrint">{{ form.overviewAndAnalyze.overview.what }}</span>
                    <ml-textarea v-else class="m-0 p-0 w-full" rows="3" v-model="form.overviewAndAnalyze.overview.what"
                                 :readonly="board.readonly || isCheck"/>
                  </div>
                </vs-col>
              </vs-row>
              <vs-row class="border-bottom">
                <vs-col class="w-12/12 table-item" style="border-right:none;">
                  <div class="h-full header-bg">어떻게 하다가<br>(사고자의 동작)</div>
                  <div class="p-1">
                    <span v-if="isPrint">{{ form.overviewAndAnalyze.overview.howAction }}</span>
                    <ml-textarea v-else class="m-0 p-0 w-full" rows="3"
                                 v-model="form.overviewAndAnalyze.overview.howAction"
                                 :readonly="board.readonly || isCheck"/>
                  </div>
                </vs-col>
              </vs-row>
              <vs-row>
                <vs-col class="w-12/12 table-item" style="border-right:none;">
                  <div class="h-full header-bg">어떻게 <br>사고를 당함<br>(발생형태)</div>
                  <div class="p-1">
                    <span v-if="isPrint">{{ form.overviewAndAnalyze.overview.howEnvironment }}</span>
                    <ml-textarea v-else class="m-0 p-0 w-full" rows="3"
                                 v-model="form.overviewAndAnalyze.overview.howEnvironment"
                                 :readonly="board.readonly || isCheck"/>
                  </div>
                </vs-col>
              </vs-row>
            </div>
          </vs-col>
        </vs-row>
        <vs-row class="w-full ">
          <vs-col class="w-12/12 table-item">
            <div class="h-full header-bg ">발생원인분석</div>
            <div>
              <vs-row class="border-bottom">
                <vs-col class="w-12/12 table-item" style="border-right:none;">
                  <div class="h-full header-bg">인적원인</div>
                  <div class="p-1">
                    <span v-if="isPrint">{{ form.overviewAndAnalyze.analyze.humanCause }}</span>
                    <ml-textarea v-else class="m-0 p-0 w-full" rows="3" placeholder="안전조치 소홀, 과신, 과실 등"
                                 v-model="form.overviewAndAnalyze.analyze.humanCause"
                                 :readonly="board.readonly || isCheck"/>
                  </div>
                </vs-col>
              </vs-row>
              <vs-row class="border-bottom">
                <vs-col class="w-12/12 table-item" style="border-right:none;">
                  <div class="h-full header-bg">물적원인</div>
                  <div class="p-1">
                    <span v-if="isPrint">{{ form.overviewAndAnalyze.analyze.materialCause }}</span>
                    <ml-textarea v-else class="m-0 p-0 w-full" rows="3" placeholder="작업환경 및 여건이 불량, 장비 오작동 및 불량"
                                 v-model="form.overviewAndAnalyze.analyze.materialCause"
                                 :readonly="board.readonly || isCheck"/>
                  </div>
                </vs-col>
              </vs-row>
              <vs-row>
                <vs-col class="w-12/12 table-item" style="border-right:none;">
                  <div class="h-full header-bg">관리적원인</div>
                  <div class="p-1">
                    <span v-if="isPrint">{{ form.overviewAndAnalyze.analyze.administrativeCause }}</span>
                    <ml-textarea v-else class="m-0 p-0 w-full" rows="3" placeholder="장비불량, 경험부족, 교육불충분, 인원부족 등"
                                 v-model="form.overviewAndAnalyze.analyze.administrativeCause"
                                 :readonly="board.readonly || isCheck"/>
                  </div>
                </vs-col>
              </vs-row>
            </div>
          </vs-col>
        </vs-row>
      </vs-col>
    </vs-row>

    <!-- 사고 후 경과 -->
    <vs-row
      style="border:1px solid #cdcdcd; border-bottom: none; border-right:none; display: grid; grid-template-columns: auto 1fr;">
      <vs-col class="p-4 font-bold flex border-right header-bg"
              style="width:125px; justify-content: center; text-align: center;" vs-justify="center" vs-align="center">
        사고 후 경과
      </vs-col>
      <vs-col class="w-full border-right p-1">
        <span v-if="isPrint">{{ form.path }}</span>
        <ml-textarea v-else class="m-0 p-0 w-full" rows="3" v-model="form.path" :readonly="board.readonly || isCheck"
                     placeholder="사고발생(00:00) → 00부상(부상정도) 구조요청(00:00) 및 응급처치(00:00) → 119구조대(헬기) 후송(00:00) → ... → 00병원 치료중(00:00), 입원중"/>
      </vs-col>
    </vs-row>

    <!-- 확인자 -->
    <vs-row
      style="border:1px solid #cdcdcd; border-bottom:none; border-right:none; display: grid; grid-template-columns: auto 1fr;">
      <vs-col class="p-4 font-bold flex border-right header-bg"
              style="width:125px; justify-content: center; text-align: center;" vs-justify="center" vs-align="center">
        확인자
      </vs-col>
      <vs-col class="w-full ">
        <vs-row class="border-bottom">
          <vs-col class="table-item" style="grid-template-columns: 200px 1fr;">
            <div class="h-full header-bg">사고발생 현장 목격 작업조원</div>
            <div class="p-1">
              <span v-if="isPrint">{{ form.checker.eyewitnessWorker }}</span>
              <ml-textarea v-else class="m-0 p-0 w-full" rows="3" v-model="form.checker.eyewitnessWorker"
                           :readonly="board.readonly || isCheck"/>
            </div>
          </vs-col>
        </vs-row>
        <vs-row>
          <vs-col class="table-item" style="grid-template-columns: 200px 1fr;">
            <div class="h-full header-bg">사고경위 확인자</div>
            <div class="p-1">
              <span v-if="isPrint">{{ form.checker.checker }}</span>
              <ml-textarea v-else class="m-0 p-0 w-full" rows="3" v-model="form.checker.checker"
                           :readonly="board.readonly || isCheck"/>
            </div>
          </vs-col>
        </vs-row>
      </vs-col>
    </vs-row>

    <!-- 사고 상황도 (현장사진) -->
    <vs-row style="border:1px solid #cdcdcd; border-right:none;
                  display: grid; grid-template-columns: auto 1fr;">
      <vs-col class="p-4 font-bold flex border-right header-bg"
              style="width:125px; justify-content: center; text-align: center;" vs-justify="center" vs-align="center">
        사고 상황도<br>(현장사진)
      </vs-col>
      <vs-col class="w-full border-right p-1">
        <file-upload-module type="gallery" :isPrint="isPrint" v-model="form.images" :multi-stage="1"
                            :readonly="board.readonly || isCheck"/>
      </vs-col>
    </vs-row>
  </div>
</template>

<script>
import DateSelector from '@/components/selector/DateSelector'
import OccupationSelector from '@/components/selector/OccupationSelector'
import BusinessClassSelector from '@/components/selector/BusinessClassSelector'
import CompensationStatusSelector from '@/components/CompensationStatusSelector'
import DisasterClassSelector from '@/components/selector/DisasterClassSelector'
import ShanghaiClassSelector from '@/components/ShanghaiClassSelector'
import TimeSelector from '@/components/selector/TimeSelector'
import FileUploadModule from '@/views/modules/FileUploadModule'
import config from '../../../../../public/config'
import VueCookie from 'vue-cookie'

export default {
  name: 'WorkerSafetyAccidentInvestigationReport',
  components: {
    FileUploadModule,
    TimeSelector,
    ShanghaiClassSelector,
    DisasterClassSelector,
    CompensationStatusSelector,
    BusinessClassSelector,
    OccupationSelector,
    DateSelector
  },
  props: {
    isCheck: Boolean,
    isPrint: Boolean,
    readonly: Boolean,
    value: Object,
    board: Object
  },
  watch: {
    value (value) {
      this.form = value
    },
    form () {
      if (this.form !== this.value) {
        this.$emit('input', this.form)
      }
    },
    'form.accidentPersonInformation.disasterClass': {
      deep: true,
      immediate: true,
      handler (value) {
        const list = []
        if (value) {
          const obj = {}
          obj[value] = 1
          list.push(obj)
        }

        if (!this.form.summary) {
          this.form.summary = {
            disasterClass: []
          }
        }
        this.form.summary.disasterClass = list

        this.$emit('input', this.form)
      }
    }
  },
  data () {
    return {
      // form:{
      //   accidentPersonInformation: {
      //     name: '',
      //     gender: '',
      //     joinDate: '',
      //     age: '',
      //     occupation:'',
      //     task: '',
      //     compensationStatus: '',
      //     disasterClass: '',
      //     shanghai: '',
      //     currentStatus: '',
      //   },
      //   precautions: {
      //     workOrder: '',
      //     safetyEducator: '',
      //     educationDay: '',
      //     numberOfWorkers: '',
      //     workgroupLeader: '',
      //     workgroupMember: '',
      //     beforeWork1: '',
      //     beforeWork2: '',
      //     safetyEquipmentCheck:'',
      //   },
      //   overviewAndAnalyze: {
      //     overview: {
      //       when:{date:'', time:''},
      //       where:'',
      //       who:'',
      //       what:'',
      //       howAction:'',
      //       howEnvironment:''
      //     },
      //     analyze: {
      //       humanCause: '',
      //       materialCause: '',
      //       administrativeCause: ''
      //     }
      //   },
      //   path: '',
      //   checker: {
      //     eyewitnessWorker: '',
      //     checker:''
      //   },
      //   images:[]
      // }
      form: this.value
    }
  },
  created () {
    if (!this.form.images) {
      this.form.images = []
    }

    if (!this.form.summary) {
      this.form.summary = {
        disasterClass: []
      }
    }

  },
  mounted () {
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.header-bg {
  background-color: #F9F9F9
}

.table-item {
  display: grid;
  grid-template-columns: 100px 1fr;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-right: 1px solid #cdcdcd;

  .header-bg {
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    border-right: 1px solid #cdcdcd;
  }
}
</style>
