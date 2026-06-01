<template>
  <print v-if="isPrint" :form="form" :board="board" />
  <div v-else>
    <!-- 기본정보 -->
    <field-select-module
      v-model="form.stdInfo"
      :options="[
        { type: 'date', label: '점검일' },
        { type: 'text', label: '점검장소' },
        { type: 'disaster', label: '재해형태' },
      ]"
      :board="this.board"
      :is-print="isPrint"
    />

    <div class="mt-28px">
      <h5 class="mb-4"><i class="dot"></i> 확인자</h5>
      <div class="writeGridContainer">
        <template v-if="projectId !== 7">
          <div>
            <div>확인자</div>
            <p v-if="isPrint" class="print-input">{{ form.inputB_1 }}</p>
            <ml-input v-else v-model="form.inputB_1" :readonly="board.readonly" />
          </div>
          <div>
            <div>서명</div>
            <sign-field v-if="!isPrint && !board.readonly" v-model="form.inputB_2" class="flex-1 justify-self-start sign-module" />
            <div v-else class="w-full flex-1 p-1">
              <img v-if="form.inputB_2" :src="form.inputB_2" width="100%" alt="Signature" class="signatureImg" />
              <div v-else class="signatureImg"></div>
            </div>
          </div>
          <div></div>
        </template>

        <div>
          <div>관리감독자</div>
          <p v-if="isPrint" class="print-input">{{ form.inputB_3 }}</p>
          <ml-input v-else v-model="form.inputB_3" :readonly="board.readonly" />
        </div>
        <div>
          <div>서명</div>
          <sign-field v-if="!isPrint && !board.readonly" v-model="form.inputB_4" class="flex-1 justify-self-start sign-module" />
          <div v-else class="w-full flex-1 p-1">
            <img v-if="form.inputB_4" :src="form.inputB_4" width="100%" alt="Signature" class="signatureImg" />
            <div v-else class="signatureImg"></div>
          </div>
        </div>
        <div></div>

        <div>
          <div>관리책임자</div>
          <p v-if="isPrint" class="print-input">{{ form.inputB_5 }}</p>
          <ml-input v-else v-model="form.inputB_5" :readonly="board.readonly" />
        </div>
        <div>
          <div>서명</div>
          <sign-field v-if="!isPrint && !board.readonly" v-model="form.inputB_6" class="flex-1 justify-self-start sign-module" />
          <div v-else class="w-full flex-1 p-1">
            <img v-if="form.inputB_6" :src="form.inputB_6" width="100%" alt="Signature" class="signatureImg" />
            <div v-else class="signatureImg"></div>
          </div>
        </div>
        <div></div>
      </div>
    </div>

    <!-- table 1 -->
    <vs-row class="mt-4">
      <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
        <h5><i class="dot"></i> 작업 전</h5>
      </vs-col>
    </vs-row>
    <div class="content-table mt-4">
      <table>
        <thead>
        <tr>
          <th style="width: 100%;" rowspan="2">
            <div class="flex justify-center">
              <span>밀폐공간 확인 내용 (적합</span>
              <div style="background: #200c63" class="w-5 h-5 rounded-sm text-white flex justify-center items-center mr-2" >
                <vs-icon icon="check" size="x-small"></vs-icon>
              </div>
              부적합
              <div style="border: 1px solid #200c63" class="w-5 h-5 rounded-sm text-white flex justify-center items-center mr-2" >
<!--                <vs-icon icon="check" size="x-small"></vs-icon>-->
              </div>
              )
            </div>
          </th>
          <th style="width: 200px">관리감독자<br/>(종료 시간)</th>
          <th style="width: 200px">관리책임자<br/>(확인 시간)</th>
<!--          <th style="width: 200px">안전관리자(점검시간)</th>-->
        </tr>
        <tr>
          <th style="padding-left: 2px; padding-right: 2px;"><time-selector class="w-full" v-model="form.inputC_1" :readonly="board.readonly"/></th>
          <th style="padding-left: 2px; padding-right: 2px;"><time-selector class="w-full" v-model="form.inputC_2" :readonly="board.readonly"/></th>
<!--          <th style="padding-left: 2px; padding-right: 2px;"><time-selector class="w-full" v-model="form.inputC_3" :readonly="board.readonly"/></th>-->
        </tr>
        </thead>

        <tbody>
        <tr v-for="(data, index) in form.tableList1" :key="index">
          <td style="text-align: start;">
            <span>· {{ data.title }}</span>
          </td>
          <td>
            <vs-checkbox
              class="align-center justify-center"
              :readonly="board.readonly"
              v-model="data.check1"
            />
          </td>
          <td>
            <vs-checkbox
              class="align-center justify-center"
              :readonly="board.readonly"
              v-model="data.check2"
            />
          </td>
<!--          <td>-->
<!--            <vs-checkbox-->
<!--              class="align-center justify-center"-->
<!--              :readonly="board.readonly"-->
<!--              v-model="data.check3"-->
<!--            />-->
<!--          </td>-->

        </tr>
        </tbody>
      </table>
    </div>

    <!-- table 2 -->
    <vs-row class="mt-4">
      <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
        <h5><i class="dot"></i> 작업 중</h5>
      </vs-col>
    </vs-row>
    <div class="content-table mt-4">
      <table>
        <thead>
        <tr>
          <th style="width: 100%;">
            <div class="flex justify-center">
              <span>밀폐공간 확인 내용 (적합</span>
              <div style="background: #200c63" class="w-5 h-5 rounded-sm text-white flex justify-center items-center mr-2" >
                <vs-icon icon="check" size="x-small"></vs-icon>
              </div>
              부적합
              <div style="border: 1px solid #200c63" class="w-5 h-5 rounded-sm text-white flex justify-center items-center mr-2" >
                <!--                <vs-icon icon="check" size="x-small"></vs-icon>-->
              </div>
              )
            </div>
          </th>
          <th style="width: 200px">관리감독자</th>
          <th style="width: 200px">관리책임자</th>
<!--          <th style="width: 200px">안전관리자</th>-->
        </tr>
        </thead>

        <tbody>
        <tr v-for="(data, index) in form.tableList2" :key="index">
          <td style="text-align: start;">
            <span>· {{ data.title }}</span>
          </td>
          <td>
            <vs-checkbox
              class="align-center justify-center"
              :readonly="board.readonly"
              v-model="data.check1"
            />
          </td>
          <td>
            <vs-checkbox
              class="align-center justify-center"
              :readonly="board.readonly"
              v-model="data.check2"
            />
          </td>
<!--          <td>-->
<!--            <vs-checkbox-->
<!--              class="align-center justify-center"-->
<!--              :readonly="board.readonly"-->
<!--              v-model="data.check3"-->
<!--            />-->
<!--          </td>-->

        </tr>
        </tbody>
      </table>
    </div>

    <!-- table 3 -->
    <vs-row class="mt-4">
      <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
        <h5><i class="dot"></i> 작업 후</h5>
      </vs-col>
    </vs-row>
    <div class="content-table mt-4">
      <table>
        <thead>
        <tr>
          <th style="width: 100%;" rowspan="2">
            <div class="flex justify-center">
              작업 종료 후 확인
            </div>
          </th>
          <th style="width: 200px">관리감독자<br/>(종료 시간)</th>
          <th style="width: 200px">관리책임자<br/>(확인 시간)</th>
        </tr>
        <tr>
          <th style="padding-left: 2px; padding-right: 2px;"><time-selector class="w-full" v-model="form.inputE_1" :readonly="board.readonly"/></th>
          <th style="padding-left: 2px; padding-right: 2px;"><time-selector class="w-full" v-model="form.inputE_2" :readonly="board.readonly"/></th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="(data, index) in form.tableList3" :key="index">
          <td style="text-align: start;">
            <span>· {{ data.title }}</span>
          </td>
          <td>
            <vs-checkbox
              class="align-center justify-center"
              :readonly="board.readonly"
              v-model="data.check1"
            />
          </td>
          <td>
            <vs-checkbox
              class="align-center justify-center"
              :readonly="board.readonly"
              v-model="data.check2"
            />
          </td>

        </tr>
        </tbody>
      </table>
    </div>

    <div class="writeGridLineItem">
      <div>부적합의견</div>
      <p v-if="isPrint" class="print-input flex-1">{{ form.inputF_1 }}</p>
      <ml-textarea
        :readonly="board.readonly"
        v-else
        v-model="form.inputF_1"
        class="flex-1 w-full"
        rows="5"
      />
    </div>

    <!-- 파일첨부 -->
    <file-upload-module id="fileList" class="w-full mt-8" v-model="form.fileList" :is-print="isPrint" :readonly="board.readonly"></file-upload-module>

  </div>
</template>

<script>
import FileUploadModule from "@/views/modules/FileUploadModule";
import FieldSelectModule from "@/views/modules/FieldSelectModule";
import DateSelector from "@/components/selector/DateSelector.vue";
import Print from "@/views/boards/single-page/530/Print.vue";
import SignField from "@/components/SignField.vue";
import TimeSelector from "@/components/selector/TimeSelector.vue";

export default {
  components: {
    TimeSelector,
    SignField,
    Print,
    DateSelector,
    FieldSelectModule,
    FileUploadModule,
  },
  props: {
    isPrint: Boolean,
    board: Object,
    value: Object,
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler(value) {
        const keys = Object.keys(this.form);
        for (const key of keys) {
          if (value[key]) {
            this.form[key] = value[key];
          }
        }
      },
    },
    form: {
      immediate: true,
      deep: true,
      handler(value) {
        value.title = this.board.writer.department;
        this.$emit("input", value);
      },
    },
  },
  computed: {
    projectId () {
      return parseInt(this.$route.params.proj_id)
    },
    postId () {
      return this.$route.params.postId
    },
  },
  created () {
    const keys = Object.keys(this.form);
    for (const key of keys) {
      if (this.value[key]) {
        this.form[key] = this.value[key];
      }
    }
  },
  methods: {
    inputEquipment(text) {
      this.form.equipment = text
    },
    checkEquipment (id) {
      for (const data of this.form.equipmentList) {
        if (data.id !== id) {
          data.check = false
        } else {
          this.form.equipment = data.label === '직접입력' ? data.value : data.label
        }
      }
    },

  },
  data() {
    return {
      form: {
        stdInfo: {},
        fileList: [],

        inputB_1: "",
        inputB_2: "",
        inputB_3: "",
        inputB_4: "",
        inputB_5: "",
        inputB_6: "",

        inputC_1: "",
        inputC_2: "",
        inputC_3: "",

        inputE_1: "",
        inputE_2: "",

        inputF_1: "",

        tableList1: [
          {id : 1, title: "작업 투입 30 분 전 배풍기 가동 실시(장소 체적당 5 회 이상 환기 )", check1: false, check2: false, check3: false},
          {id : 2, title: "TBM 시 당일 작업 구간 비상상황 시 대피요령 등 교육 실시 여부", check1: false, check2: false, check3: false},
          {id : 3, title: "출입 전 복합가스농도 측정 실시", check1: false, check2: false, check3: false},
          {id : 4, title: "출입 전 라이터 등 화기용품 반납여부", check1: false, check2: false, check3: false},
          {id : 5, title: "개인보호구 (방독/방진 ) 착용 및 필터 적정성 여부", check1: false, check2: false, check3: false},
          {id : 6, title: "상하 및 주위 화기 양중 작업 등 간섭 여부", check1: false, check2: false, check3: false},
        ],
        tableList2: [
          {id : 1, title: "작업자 건강상태 확인\n고령자 (60세) 및 건강상태 이상자 투입 불가", check1: false, check2: false, check3: false},
          {id : 2, title: "장소 체적 당 시간당 20 회 이상 환기 실시", check1: false, check2: false, check3: false},
          {id : 3, title: "배풍기 및 가설 전원상태 상시 확인", check1: false, check2: false, check3: false},
          {id : 4, title: "무전 (육성)으로 내/외부 소통 확인(최소 30 분 단위 )", check1: false, check2: false, check3: false},
          {id : 5, title: "60 분 간격으로 복합가스 농도 측정(60 분 내라도 밀폐공간 시건 후 재출입 시 재측정 실시 )", check1: false, check2: false, check3: false},
          {id : 6, title: "시건 장치 후 휴식 및 휴식시간 준수여부(휴식시간 복귀 시 화기용품 반납 확인 )", check1: false, check2: false, check3: false},
        ],
        tableList3: [
          {id : 1, title: "밀폐 공간 내부 작업 종료 후 출입기록 확인 인원 파악", check1: false, check2: false, check3: false},
          {id : 2, title: "밀폐 공간 내부 인화성 물질 보관 여부", check1: false, check2: false, check3: false},
          {id : 3, title: "밀폐 공간 근로자 전원 퇴실 여부", check1: false, check2: false, check3: false},
          {id : 4, title: "밀폐 공간 시건장치 잠금 여부", check1: false, check2: false, check3: false},
          {id : 5, title: "밀폐 공간 작업자 건강 이상 여부", check1: false, check2: false, check3: false},
        ],
      },
    };
  },
};
</script>

<style scoped lang="scss">
$border: 1px solid #cdcdcd;

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: $border;
  padding: 15px;
  text-align: center;
  font-weight: 500;
  font-size: 14px;
}

tr:nth-child(1) {
  //background-color: #FAFAFA;
}

tr:nth-child(2n+1) td {
  border-top: none;
}

tr:nth-child(2n) td {
  border-bottom: none;
}

tr:first-child th:first-child,
tr:first-child td:first-child {
  //border-left: none;
}

tr:first-child th:last-child,
tr:first-child td:last-child {
  //border-right: none;
}


.content-table {
  table {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
    margin-bottom: 20px;

    th,
    td {
      border: 1px solid #cdcdcd;
      text-align: center;
      min-height: 43px;
      height: 43px;
      //font-size: 18px;
    }
    th {
      width: 140px;
      background-color: #ececec;
      //font-weight: 500;
      padding: 0;
      word-break: keep-all;
    }
    td {
      min-width: 50px;
      word-break: keep-all;
      padding: 2px;
      img {
        display: inline-block;
      }
      span {
        padding-left: 10px;
        padding-right: 10px;
      }
    }
    .th-background {
      background-color: #ececec;
      white-space: nowrap;
    }
    .check-container {
      padding: 10px 14px 0 14px;
      text-align: left;

      div {
        margin-bottom: 8px;
      }
      img {
        display: inline-block;
        margin-right: 8px;
      }
    }
    .text-left {
      text-align: left;
      padding: 10px 14px;
    }
  }
}
</style>
