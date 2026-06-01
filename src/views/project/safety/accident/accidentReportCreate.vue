<template>
  <div>
    <vs-row>
      <vs-col class="w-9/12">

        <vx-card>
          <div>
            <vs-row class="mb-4">
              <vs-col class="flex" vs-justify="flex-end">
                <vs-button class="mr-4" color="secondary" type="border" @click="handleBackMenu">목록</vs-button>
                <vs-button class="" color="secondary" @click="handleClickRegister">임시저장</vs-button>
              </vs-col>
            </vs-row>

            <!-- 기본정보 -->
            <vs-row class="mb-4">
              <vs-col><h5><i class="dot"></i>기간별 출역인원</h5></vs-col>
            </vs-row>
            <vs-col class="flex flex-wrap mb-4">

              <vs-row class="w-1/3  mb-4 flex" vs-align="center">
                <vs-col class="w-3/12 title">재해구분</vs-col>
                <vs-col class="w-9/12">
                  <vs-select autocomplete class="w-full" v-model="form.accidentType">
                    <vs-select-item v-for="(item, index) in accidentList" :key="index" :text="item.text"
                                    :value="item.value"/>
                  </vs-select>
                </vs-col>
              </vs-row>
              <vs-row class="w-1/3  mb-4 flex" vs-align="center">
                <vs-col class="w-3/12 title pr-4" style="text-align: right">현장명</vs-col>
                <vs-col class="w-9/12">
                  <ml-input class="w-full" :value="projectInfo.field_name" :readonly="true"/>
                </vs-col>
              </vs-row>
              <vs-row class="w-1/3  mb-4 flex" vs-align="center">
                <vs-col class="w-3/12 title pr-4" style="text-align: right">물적손실</vs-col>
                <vs-col class="w-9/12">
                  <ml-input class="w-full" v-model="form.physical_loss"/>
                </vs-col>
              </vs-row>

              <vs-row class="w-1/3  mb-4 flex" vs-align="center">
                <vs-col class="w-3/12 title">재해일</vs-col>
                <vs-col class="w-9/12">
                  <date-selector class="w-full" v-model="form.disaster_date"></date-selector>
                </vs-col>
              </vs-row>
              <vs-row class="w-1/3  mb-4 flex" vs-align="center">
                <vs-col class="w-3/12 title pr-4" style="text-align: right">사고확정일</vs-col>
                <vs-col class="w-9/12">
                  <date-selector class="w-full" v-model="form.accident_date"></date-selector>
                </vs-col>
              </vs-row>
              <vs-row class="w-1/3  mb-4 flex" vs-align="center">
                <vs-col class="w-3/12 title pr-4" style="text-align: right">작성일</vs-col>
                <vs-col class="w-9/12">
                  <date-selector class="w-full" v-model="form.write_date"></date-selector>
                </vs-col>
              </vs-row>

              <vs-row class="w-1/3  mb-4 flex" vs-align="center">
                <vs-col class="w-3/12 title">재해시간</vs-col>
                <vs-col class="w-9/12" vs-align="center">
                  <time-selector class="w-full" v-model="form.disaster_time"/>
                </vs-col>

              </vs-row>
              <vs-row class="w-1/3  mb-4 flex" vs-align="center">
                <vs-col class="w-3/12 title pr-4" style="text-align: right">날씨</vs-col>
                <vs-col class="w-9/12">
                  <ml-input class="w-full" v-model="form.weather"/>
                </vs-col>
              </vs-row>
              <vs-row class="w-1/3  mb-4 flex" vs-align="center">
                <vs-col class="w-3/12 title pr-4" style="text-align: right">대상기간</vs-col>
                <vs-col class="w-9/12">
                  <ml-input class="w-full" v-model="form.reporting_period"/>
                </vs-col>
              </vs-row>

              <vs-row class="w-1/3  mb-4 flex" vs-align="center">
                <vs-col class="w-3/12 title">사망여부</vs-col>
                <vs-col class="w-9/12">
                  <vs-select autocomplete class="w-full" v-model="form.decease">
                    <vs-select-item text="아니오" value="live"/>
                    <vs-select-item text="네" value="decease"/>
                  </vs-select>
                </vs-col>
              </vs-row>
              <vs-row class="w-1/3  mb-4 flex" vs-align="center">
                <vs-col class="w-3/12 title pr-4" style="text-align: right">환산건수</vs-col>
                <vs-col class="w-9/12">
                  <ml-input class="w-full" v-model="form.conversion"/>
                </vs-col>
              </vs-row>
              <vs-row class="w-1/3  mb-4 flex" vs-align="center">
                <vs-col class="w-3/12 title pr-4" style="text-align: right">지분률</vs-col>
                <vs-col class="w-9/12">
                  <ml-input class="w-full" v-model="form.stake_rate"/>
                </vs-col>
              </vs-row>

            </vs-col>

            <!-- 표 -->
            <vs-row class="mb-4">
              <vs-col>

                <div class="border-right table-display">
                  <span class="title border-top border-left table-center "
                        style="grid-row: 1; grid-column: 1; ">재해장소</span>
                  <span class="title border-top border-left table-center " style="grid-row: 1; grid-column: 2/6; ">
                    <ml-input class="w-full pl-2 pr-2" v-model="form.disaster_place"/>
                  </span>

                  <span class="title border-top border-left table-center " style="grid-row: 2/7; grid-column: 1; ">재해자 인적사항</span>
                  <span class="title border-top border-left table-center "
                        style="grid-row: 2; grid-column: 2; ">주소</span>
                  <span class="title border-top border-left table-center " style="grid-row: 2; grid-column: 3; ">
                    <ml-input class="w-full pl-2 pr-2" v-model="form.victim.address"/>
                  </span>
                  <span class="title border-top border-left table-center "
                        style="grid-row: 2; grid-column: 4; ">가족사항</span>
                  <span class="title border-top border-left table-center " style="grid-row: 2; grid-column: 5; ">
                    <ml-input class="w-full pl-2 pr-2" v-model="form.victim.family"/>
                  </span>

                  <span class="title border-top border-left table-center "
                        style="grid-row: 3; grid-column: 2; ">성명</span>
                  <span class="title border-top border-left table-center " style="grid-row: 3; grid-column: 3; ">
                    <ml-input class="w-full pl-2 pr-2" v-model="form.victim.name"/>
                  </span>
                  <span class="title border-top border-left table-center "
                        style="grid-row: 3; grid-column: 4; ">평균임금</span>
                  <span class="title border-top border-left table-center " style="grid-row: 3; grid-column: 5; ">
                    <ml-input class="w-full pl-2 pr-2" v-model="form.victim.average_wage"/>
                  </span>

                  <span class="title border-top border-left table-center "
                        style="grid-row: 4; grid-column: 2; ">주민번호</span>
                  <span class="title border-top border-left table-center " style="grid-row: 4; grid-column: 3; ">
                    <ml-input class="w-full pl-2 pr-2" v-model="form.victim.rrn"/>
                  </span>
                  <span class="title border-top border-left table-center "
                        style="grid-row: 4; grid-column: 4; ">채용일</span>
                  <span class="title border-top border-left table-center " style="grid-row: 4; grid-column: 5; ">
                    <ml-input class="w-full pl-2 pr-2" v-model="form.victim.hiring_date"/>
                  </span>

                  <span class="title border-top border-left table-center " style="grid-row: 5; grid-column: 2; ">직종</span>
                  <span class="title border-top border-left table-center " style="grid-row: 5; grid-column: 3; ">
                    <vs-select autocomplete class="w-full pl-2 pr-2" v-model="form.victim.workType">
                      <vs-select-item v-for="(item, index) in workTypeList" :key="index" :text="item.text" :value="item.value"/>
                    </vs-select>
                  </span>
                  <span class="title border-top border-left table-center " style="grid-row: 5; grid-column: 4; ">소속</span>
                  <span class="title border-top border-left table-center " style="grid-row: 5; grid-column: 5; ">
                    <ml-input class="w-full pl-2 pr-2" v-model="form.victim.affiliation"/>
                  </span>

                  <span class="title border-top border-left table-center " style="grid-row: 6; grid-column: 2; ">일당</span>
                  <span class="title border-top border-left table-center " style="grid-row: 6; grid-column: 3; ">
                    <ml-input class="w-full pl-2 pr-2" v-model="form.victim.daily_wage"/>
                  </span>
                  <span class="title border-top border-left table-center " style="grid-row: 6; grid-column: 4; ">동종경력</span>
                  <span class="title border-top border-left table-center " style="grid-row: 6; grid-column: 5; ">
                    <ml-input class="w-full pl-2 pr-2" v-model="form.victim.personal_history"/>
                  </span>


                  <span class="title border-top border-left table-center " style="grid-row: 7/9; grid-column: 1; ">재해 발생 개요</span>
                  <span class="title border-top border-left table-center " style="grid-row: 7/9; grid-column: 2/6; ">
                    <ml-textarea class="w-full m-0 table-content"  v-model="form.summary"/>
                  </span>

                  <span class="title border-top border-left table-center " style="grid-row: 9/11; grid-column: 1; ">원인 및 대책</span>
                  <span class="title border-top border-left table-center " style="grid-row: 9/11; grid-column: 2/6; ">
                    <ml-textarea class="w-full m-0 table-content" v-model="form.cause"/>
                  </span>

                  <span class="title border-top border-left table-center " style="grid-row: 11/13; grid-column: 1; ">재해처리 경과 F/U (본사)</span>
                  <span class="title border-top border-left table-center " style="grid-row: 11/13; grid-column: 2/6; ">
                    <ml-textarea class="w-full m-0 table-content" v-model="form.lapse"/>
                  </span>

                  <span class="title border-top border-left table-center " style="grid-row: 13/17; grid-column: 1; ">상병정도</span>
                  <span class="title border-top border-left table-center " style="grid-row: 13; grid-column: 2; ">상해부위</span>
                  <span class="title border-top border-left table-center " style="grid-row: 13; grid-column: 3; ">
                    <vs-select autocomplete class="w-full pl-2 pr-2" v-model="form.disease.site">
                      <vs-select-item v-for="(item, index) in woundSiteList" :key="index" :text="item.text" :value="item.value"/>
                    </vs-select>
                  </span>
                  <span class="title border-top border-left table-center " style="grid-row: 13; grid-column: 4; ">지병</span>
                  <span class="title border-top border-left table-center table-content" style="grid-row: 13; grid-column: 5; ">
                    <vs-radio class="mr-4" v-model="form.disease.is_chronic_disease" vs-value="chronic_disease">있음</vs-radio>
                    <vs-radio v-model="form.disease.is_chronic_disease" vs-value="none_chronic_disease">없음</vs-radio>
                  </span>

                  <span class="title border-top border-left table-center " style="grid-row: 14; grid-column: 2; ">상해종류</span>
                  <span class="title border-top border-left table-center " style="grid-row: 14; grid-column: 3; ">
                    <vs-select autocomplete class="w-full pl-2 pr-2" v-model="form.disease.type">
                      <vs-select-item v-for="(item, index) in woundTypeList" :key="index" :text="item.text" :value="item.value"/>
                    </vs-select>
                  </span>
                  <span class="title border-top border-left table-center " style="grid-row: 14; grid-column: 4; ">장애잔존여부</span>
                  <span class="title border-top border-left table-center table-content" style="grid-row: 14; grid-column: 5; ">
                    <vs-radio class="mr-4" v-model="form.disease.is_obstacle" vs-value="obstacle">있음</vs-radio>
                    <vs-radio v-model="form.disease.is_obstacle" vs-value="none_obstacle">없음</vs-radio>
                  </span>

                  <span class="title border-top border-left table-center " style="grid-row: 15; grid-column: 2; ">상해명</span>
                  <span class="title border-top border-left table-center " style="grid-row: 15; grid-column: 3; ">
                    <vs-select autocomplete class="w-full pl-2 pr-2" v-model="form.disease.name">
                      <vs-select-item v-for="(item, index) in diseaseNameList" :key="index" :text="item.text" :value="item.value"/>
                    </vs-select>
                  </span>
                  <span class="title border-top border-left table-center " style="grid-row: 15; grid-column: 4; ">비고</span>
                  <span class="title border-top border-left table-center " style="grid-row: 15; grid-column: 5; ">
                    <ml-input class="w-full pl-2 pr-2" v-model="form.disease.remark"/>
                  </span>

                  <span class="title border-top border-left table-center " style="grid-row: 16; grid-column: 2; ">치료예상기간</span>
                  <span class="title border-top border-left table-center " style="grid-row: 16; grid-column: 3; ">
                    <date-selector class="w-full ml-2 mr-2" v-model="form.disease.treatment_period"></date-selector>
                  </span>
                  <span class="title border-top border-left table-center " style="grid-row: 16; grid-column: 4; "></span>
                  <span class="title border-top border-left table-center table-content" style="grid-row: 16; grid-column: 5; "></span>

                  <span class="title border-top border-left table-center " style="grid-row: 17; grid-column: 1; ">기인물</span>
                  <span class="title border-top border-left table-center table-content" style="grid-row: 17; grid-column: 2/6; ">
                    <vs-select autocomplete class="w-full pl-2 pr-2" v-model="form.harmful">
                      <vs-select-item v-for="(item, index) in harmfulList" :key="index" :text="item.text" :value="item.value"/>
                    </vs-select>
                  </span>


                  <span class="title border-top border-left table-center " style="grid-row: 18/21; grid-column: 1; ">관리자 정보</span>
                  <span class="title border-top border-left table-center " style="grid-row: 18; grid-column: 2; ">사용자배상책임 증권번호</span>
                  <span class="title border-top border-left table-center " style="grid-row: 18; grid-column: 3; ">
                    <ml-input class="w-full pl-2 pr-2" v-model="form.manager.stock_number"/>
                  </span>
                  <span class="title border-top border-left table-center " style="grid-row: 18; grid-column: 4; ">공사팀장</span>
                  <span class="title border-top border-left table-center " style="grid-row: 18; grid-column: 5; ">
                    <ml-input class="w-full pl-2 pr-2" v-model="form.manager.name"/>
                  </span>
                  <span class="title border-top border-left table-center " style="grid-row: 19; grid-column: 2; ">사용자배상책임 가입회사명</span>
                  <span class="title border-top border-left table-center " style="grid-row: 19; grid-column: 3; ">
                    <ml-input class="w-full pl-2 pr-2" v-model="form.manager.stock_name"/>
                  </span>
                  <span class="title border-top border-left table-center " style="grid-row: 19; grid-column: 4; ">안전관리팀장명</span>
                  <span class="title border-top border-left table-center " style="grid-row: 19; grid-column: 5; ">
                    <ml-input class="w-full pl-2 pr-2" v-model="form.manager.biz_p_name"/>
                  </span>

                  <span class="title border-top border-left table-center " style="grid-row: 20; grid-column: 2; ">안전보건부서장명</span>
                  <span class="title border-top border-left table-center " style="grid-row: 20; grid-column: 3; ">
                    <ml-input class="w-full pl-2 pr-2" v-model="form.manager.construction"/>
                  </span>
                  <span class="title border-top border-left table-center " style="grid-row: 20; grid-column: 4; ">파트너사 소장명</span>
                  <span class="title border-top border-left table-center " style="grid-row: 20; grid-column: 5; ">
                    <ml-input class="w-full pl-2 pr-2" v-model="form.manager.supervisor"/>
                  </span>


                  <span class="title border-top border-left border-bottom table-center " style="grid-row: 21/24; grid-column: 1; ">첨부서류</span>
                  <div class="border-top border-left border-bottom table-content pl-2" style="grid-row: 21/24; grid-column: 2/4;">
                    <vs-row class="mt-2">
                      <vs-checkbox v-model="form.document.attach_1">재해원인분석 및 방지대책서</vs-checkbox>
                    </vs-row>
                    <vs-row class="mt-2">
                      <vs-checkbox v-model="form.document.attach_2">재발방지대책협의회 실시</vs-checkbox>
                    </vs-row>
                    <vs-row class="mt-2">
                      <vs-checkbox v-model="form.document.attach_3">관리감독자(기사, 공구장, 십장, 하도자) 진술 및 대책서</vs-checkbox>
                    </vs-row>
                    <vs-row class="mt-2">
                      <vs-checkbox v-model="form.document.attach_4">재해자(가해자) 진술서</vs-checkbox>
                    </vs-row>
                    <vs-row class="mt-2">
                      <vs-checkbox v-model="form.document.attach_5">목격자 진술서</vs-checkbox>
                    </vs-row>
                  </div>
                  <div class="border-top border-left border-bottom table-content pl-2" style="grid-row: 21/24; grid-column: 4/6;">
                    <vs-row class="mt-2">
                      <vs-checkbox v-model="form.document.attach_6">재해원인분석 및 방지대책서</vs-checkbox>
                    </vs-row>
                    <vs-row class="mt-2">
                      <vs-checkbox v-model="form.document.attach_7">재해발생 상황도 및 조직도</vs-checkbox>
                    </vs-row>
                    <vs-row class="mt-2">
                      <vs-checkbox v-model="form.document.attach_8">초진 소견서</vs-checkbox>
                    </vs-row>
                    <vs-row class="mt-2">
                      <vs-checkbox v-model="form.document.attach_9">재해발생 보고 지연사유서</vs-checkbox>
                    </vs-row>
                  </div>

                </div>

              </vs-col>
            </vs-row>


            <!-- 첨부파일 -->
            <file-upload-module v-model="fileList"></file-upload-module>

          </div>
        </vx-card>

      </vs-col>
      <vs-col class="w-3/12 pl-6">
        <approval-process-module
          id="safety_accident_report_create"
          :board="board"
          :commentabled="!(board.isCompleteApproval || board.savable)"

          @handleClickUpload="handleClickUpload"
          @handleSendApprovalProcess="handleSendApprovalProcess"
        ></approval-process-module>
      </vs-col>
    </vs-row>

    <!-- TODO : 얼럿데이터 -->
    <popup-alert v-model="alert.show" :message="alert.message" :buttons="alert.buttons" @upload="alertUpload"/>
  </div>
</template>

<script>
import DateSelector from '../../../../components/selector/DateSelector'
import TimeSelector from '@/components/selector/TimeSelector'
import FileUploadModule from '@/views/modules/FileUploadModule'
import ApprovalProcessModule from '@/views/modules/ApprovalProcessModule'
import PopupAlert from '@/popup/PopupAlert'

export default {
  name: 'accidentReportCreate',
  components: {
    PopupAlert,
    ApprovalProcessModule,
    FileUploadModule,
    TimeSelector,
    DateSelector
  },
  computed: {
    projectInfo () {
      return this.$store.state.project.projectInfo
    }
  },
  data () {
    return {
      boardId: '22',
      boardSlug: 'industrial_accident',

      // TODO : 글쓰기 정보 및 권한
      board: {
        slug: 'industrial_accident',
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

      // 재해구분
      accidentList: [
        {
          text: '미정',
          value: 'none'
        },
        {
          text: '사고',
          value: 'accident'
        },
        {
          text: '경미재해',
          value: 'minor_disaster'
        },
        {
          text: '통신사고',
          value: 'communication'
        },
        {
          text: 'OEM사고',
          value: 'oem'
        },
        {
          text: '불승인',
          value: 'disapproved'
        },
        {
          text: '확정건',
          value: 'confirmed_case'
        },
        {
          text: '업무상',
          value: 'business_damage'
        },
        {
          text: '질병',
          value: 'disease'
        }
      ],

      // 직종
      workTypeList: [
        {
          text: '직종선택',
          value: ''
        },
        {
          text: '[목공]도목수',
          value: 'wood|carpenter'
        },
        {
          text: '[목공]건축목공',
          value: 'wood|architecture'
        },
        {
          text: '[목공]형틀목공',
          value: 'wood|concrete'
        },
        {
          text: '[목공]창호목공',
          value: 'wood|window'
        },
        {
          text: '[철근공]철근공',
          value: 'steel|bar_bender'
        },
        {
          text: '[용역/일반공]특별인부',
          value: 'normal,service|special'
        },
        {
          text: '[용역/일반공]보통인부(잡부-남)',
          value: 'normal,service|male'
        },
        {
          text: '[용역/일반공]보통인부(잡부-여)',
          value: 'normal,service|female'
        }
      ],

      // 상해부위
      woundSiteList: [
        {
          text: '부위선택',
          value: ''
        },
        {
          text: '[머리]정수리',
          value: 'head|parietal'
        },
        {
          text: '[머리]뒷통수',
          value: 'head|backhead'
        },
        {
          text: '[안면부]이마',
          value: 'face|forehead'
        },
        {
          text: '[안면부]광대뼈',
          value: 'face|clown'
        },
        {
          text: '[눈]눈두덩이',
          value: 'eye|eyelid'
        },
        {
          text: '[눈]눈썹',
          value: 'eye|eyebrow'
        }
      ],

      // 상해종류
      woundTypeList: [
        {
          text: '종류선택',
          value: ''
        },
        {
          text: '추락',
          value: 'human_downfall'
        },
        {
          text: '전도',
          value: 'plane_fall'
        },
        {
          text: '충돌',
          value: 'crash'
        },
        {
          text: '낙하/비래',
          value: 'stuff_downfail'
        },
        {
          text: '붕괴/도괴',
          value: 'collapse'
        },
        {
          text: '협착',
          value: 'narrow'
        },
        {
          text: '감전',
          value: 'electric_shock'
        },
        {
          text: '무리한동작',
          value: 'overwork_motion'
        },
        {
          text: '지병',
          value: 'chronic'
        },
        {
          text: '화상',
          value: 'burns'
        },
        {
          text: '매몰/질식',
          value: 'choke'
        },
        {
          text: '교통사고',
          value: 'traffic'
        },
        {
          text: '기타',
          value: 'etc'
        }
      ],

      // 상해이름
      diseaseNameList: [
        {
          text: '상병선택',
          value: ''
        },
        {
          text: '타박상',
          value: 'bruise'
        },
        {
          text: '염좌',
          value: 'sprain'
        },
        {
          text: '탈구',
          value: 'dislocation'
        },
        {
          text: '골절',
          value: 'fracture'
        },
        {
          text: '찰과상',
          value: 'abrasion'
        },
        {
          text: '절상',
          value: 'cut'
        },
        {
          text: '자상',
          value: 'stab'
        },
        {
          text: '일사병',
          value: 'sunstroke'
        },
        {
          text: '뇌진탕',
          value: 'concussion'
        },
        {
          text: '열상',
          value: 'laceration'
        },
        {
          text: '심장마비',
          value: 'heart_attack'
        },
        {
          text: '근육좌상',
          value: 'muscle_strain'
        },
        {
          text: '지병',
          value: 'chronic_disease'
        },
        {
          text: '창상',
          value: 'hack'
        }
      ],

      // 기인물
      harmfulList: [
        {
          text: '기인물선택',
          value: ''
        },
        {
          text: '건설자재',
          value: 'building_material'
        },
        {
          text: '가시설',
          value: 'temporary_facilities'
        },
        {
          text: '장비',
          value: 'equipment'
        },
        {
          text: '작업공구',
          value: 'work_tools'
        },
        {
          text: '유해가스',
          value: 'harmful_gas'
        },
        {
          text: '기타',
          value: 'etc'
        }
      ],

      fileList:[],
      form: {
        accidentType: 'none', //재해구분
        field_name: '', //현장명
        physical_loss: '', //물적손실
        disaster_date: '', //재해일
        accident_date: '', //사고확정일
        write_date: '', //작성일
        disaster_time: '', //재해시간
        weather: '', //날씨
        reporting_period: '', //대상기간
        decease: 'live', //사망여부
        conversion: '', //환산건수
        stake_rate: '', //지분률

        disaster_place: '', //재해장소

        victim: {
          address: '', //주소
          family: '', //가족사항
          name: '', //성명
          average_wage: '', //평균임금
          rrn:'', //주민등록번호
          hiring_date:'', //채용일
          workType: '', //직종
          affiliation:'', //소속
          daily_wage:'', //일당
          personal_history: '' //동종경력
        },

        summary: '', //재해 발생 개요
        cause:'', //원인 및 대책
        lapse:'', //재해처리 경과

        disease:{
          site: '', //상해부위
          type: '', //상해종류
          name: '', //상해명
          treatment_period: '', //치료예상기간
          is_chronic_disease:'', //지병
          is_obstacle: '', //장애잔존여부
          remark: '' //비고
        },

        harmful: '', //기인물

        manager:{
          stock_number: '', //사용자배상책임 증권번호
          name: '', //공사팀장
          stock_name: '', //사용자배상책임 가입회사명
          biz_p_name: '', //안전관리팀장명
          construction:'', //안전보건부서장명
          supervisor:'' //감독자명
        },

        document: {
          attach_1:false,
          attach_2:false,
          attach_3:false,
          attach_4:false,
          attach_5:false,
          attach_6:false,
          attach_7:false,
          attach_8:false,
          attach_9:false
        },

        preview:{
          field_name: '', //현장명
          accidentType:'', //재해구분
          workType:'', //직종
          disease_type:'', //상해종류
          disease_name:'', //상해명
          victim_name:'', //재해자
          biz_p_name:'', //파트너사
          supervisor:'', //관리감독자
          disaster_date:'' //재해일
        }
      },
      oldForm:{},

      // TODO : 얼럿데이터
      alert: {
        show: false,
        message: '결재하시겠습니까?',
        buttons: [
          {
            label: '승인',
            action: 'ok'
          },
          {
            label: '취소',
            action: 'cancel'
          }
        ]
      },
      approvalLine: [], // 결재선 등록
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

  async created () {
    // 초기화
    await this.init()
  },
  methods: {

    async init () {
      await this.$store.dispatch('USER_INFO')
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
      this.form.com_number = this.$store.state.company.companyInfo.com_number

      this.oldForm = JSON.parse(JSON.stringify(this.form))
    },

    async register (isUploaded) {
      if (isUploaded && (!this.approvalLine || this.approvalLine.length === 0)) {
        alert('결재선을 지정해주세요')
        return
      }

      const projectId = this.$route.params.proj_id
      const boardSlug = this.boardSlug
      const title = this.projectInfo.field_name
      const approvalLine = JSON.stringify(this.lineToSendLine(this.approvalLine))
      const security = 'normal' // 문서보안 등급 ['일반', 대외비 1급, 대외비 2급, 인비, 극비] [normal,confidential1,confidential2,personally,confidential0]
      const priority = 'medium' // 문서 중요도 [매우낮음, 낮음, 보통, 높음, 매우 높음] [lowest,low,medium,high,highest]
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

      this.form.field_name = this.projectInfo.field_name
      this.form.preview.field_name = this.form.field_name
      this.form.preview.accidentType = this.form.accidentType
      this.form.preview.workType = this.form.victim.workType
      this.form.preview.disease_type = this.form.disease.type
      this.form.preview.disease_name = this.form.disease.name
      this.form.preview.victim_name = this.form.victim.name
      this.form.preview.biz_p_name = this.form.manager.biz_p_name
      this.form.preview.supervisor = this.form.manager.supervisor
      this.form.preview.disaster_date = this.form.disaster_date
      this.form.preview.com_number = this.form.com_number

      const content = JSON.stringify(this.form)

      try {
        if (isUploaded) {
          // 바로 상신하기
          await this.$store.dispatch('approval/CREATE_POST', {
            projectId,
            boardSlug,
            title,
            content,
            approvalLine,
            security,
            priority,
            uploads
          })
          alert('상신되었습니다.')

          this.oldForm = JSON.parse(JSON.stringify(this.form))
          this.$router.back()
        } else {
          // 임시 저장하기
          const isTemp = 1
          await this.$store.dispatch('approval/CREATE_POST', {
            projectId,
            boardSlug,
            title,
            content,
            approvalLine,
            security,
            priority,
            uploads,
            isTemp
          })
          alert('임시저장되었습니다.')

          this.oldForm = JSON.parse(JSON.stringify(this.form))
          this.$router.back()
        }

      } catch (e) {
        if (this.$store.state.approval.error_data.title) {
          alert('현장명이 없습니다')
        } else {
          console.log(this.$store.state.approval.error_code)
        }
      }
    },

    handleBackMenu () {
      this.$emit('handleBackMenu', 'report')
    },

    handleClickRegister () {
      if (confirm('저장하시겠습니까?')) {
        this.register(false)
      }
    },

    handleClickUpload () {
      this.alert.buttons = [
        {
          label: '상신',
          action: 'upload'
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
      this.approvalLine = process
    },

    // TODO : 얼럿데이터
    alertUpload () {
      this.register(true)
    },

    // TODO : 결재프로세스
    // ApprovalProcessModule 에서 사용하는 line 방식에서 전송용 line 으로 변경
    lineToSendLine (data) {
      const approvalList = []

      for (const member of data) {
        if (member.type_code !== 'register') {
          approvalList.push({
            id: member.user_id,
            name: member.user_name,
            elementType: member.type_code
          })
        }
      }

      return approvalList
    },
  }
}
</script>

<style scoped>
.table-display {
  display: grid;
  grid-template-rows: repeat(23, minmax(52px, 100%));
  grid-template-columns: 200px 1fr 2fr 1fr 2fr;
  background-color: #F9F9F9;
}

.table-content {
  background-color: white;
}

.table-center {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
}
</style>
