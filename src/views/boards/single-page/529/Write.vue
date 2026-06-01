<template>
  <print v-if="isPrint" :form="form" :board="board" />
  <div v-else>
    <!-- 기본정보 -->
    <field-select-module
      v-model="form.stdInfo"
      :board="this.board"
      :is-print="isPrint"
    />

    <!-- 장비명 -->
    <vs-row class="mt-6">
      <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
        <h5><i class="dot" /> 장비명</h5>
      </vs-col>
    </vs-row>
    <div class="grid grid-cols-12 gap-x-6 gap-y-4 mt-4">
      <div class="col-span-1 flex items-center"
           v-for="checkbox in form.equipmentList"
      >
        <div v-if="isPrint || board.readonly" class="flex">
          <div v-if="checkbox.check" style="background: #200c63" class="w-5 h-5 rounded-sm text-white flex justify-center items-center mr-2" >
            <vs-icon icon="check" size="x-small"></vs-icon>
          </div>
          <div v-else style="border: 1px solid #200c63" class="w-5 h-5 rounded-sm text-white flex justify-center items-center mr-2" >
            <vs-icon icon="check" size="x-small"></vs-icon>
          </div>
          {{ checkbox.label==='직접입력'? checkbox.value : checkbox.label }}
        </div>
        <label v-else class="flex" style="align-items: center;">
          <vs-checkbox
            :readonly="board.readonly"
            v-model="checkbox.check"
            @change="checkEquipment(checkbox.id)">
          </vs-checkbox>
          <span style="width: 90px;">{{ checkbox.label }}</span>

          <ml-input
            :readonly="board.readonly"
            v-if="checkbox.label === '직접입력' && checkbox.check"
            v-model="checkbox.value"
            @change="inputEquipment(checkbox.value)"
          />
        </label>
      </div>
    </div>

<!--    작업개요-->
    <vs-row class="mt-8">
      <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
        <h5><i class="dot"></i> 작업개요</h5>
      </vs-col>
    </vs-row>
    <div class="writeGridContainer mt-4">
      <div>
        <div>업체명</div>
        <p v-if="isPrint" class="print-input flex-1">{{ form.inputA_0 }}</p>
        <ml-input
          :readonly="board.readonly"
          v-else
          v-model="form.inputA_0"
        />
      </div>
      <div>
        <div>공종</div>
        <p v-if="isPrint" class="print-input flex-1">{{ form.inputA_1 }}</p>
        <ml-input
          :readonly="board.readonly"
          v-else
          v-model="form.inputA_1"
        />
      </div>
      <div>
        <div>작업위치</div>
        <p v-if="isPrint" class="print-input flex-1">{{ form.inputA_2 }}</p>
        <ml-input
          :readonly="board.readonly"
          v-else
          v-model="form.inputA_2"
        />
      </div>
      <div>
        <div>작업기간</div>
        <p v-if="isPrint" class="print-input">
          {{ form.inputA_3 }} ~ {{ form.inputA_4 }}
        </p>
        <div v-else class="flex-1 flex items-center">
          <date-selector
            class="w-full flex-1"
            v-model="form.inputA_3"
            :readonly="board.readonly"
          />
          <p class="px-2">~</p>
          <date-selector
            class="w-full flex-1"
            v-model="form.inputA_4"
            :readonly="board.readonly"
          />
        </div>
      </div>
      <div>
        <div>조종원 - 성명</div>
        <p v-if="isPrint" class="print-input flex-1">{{ form.inputA_5 }}</p>
        <ml-input
          :readonly="board.readonly"
          v-else
          v-model="form.inputA_5"
        />
      </div>
      <div>
        <div>조종원 - 면허</div>
        <p v-if="isPrint" class="print-input flex-1">{{ form.inputA_6 }}</p>
        <ml-input
          :readonly="board.readonly"
          v-else
          v-model="form.inputA_6"
        />
      </div>
      <div>
        <div>작업지휘자</div>
        <p v-if="isPrint" class="print-input flex-1">{{ form.inputA_7 }}</p>
        <ml-input
          :readonly="board.readonly"
          v-else
          v-model="form.inputA_7"
        />
      </div>
      <div>
        <div>신호수/유도자</div>
        <p v-if="isPrint" class="print-input flex-1">{{ form.inputA_8 }}</p>
        <ml-input
          :readonly="board.readonly"
          v-else
          v-model="form.inputA_8"
        />
      </div>
      <div class="writeGridLineItem">
        <div>작업목적</div>
        <p v-if="isPrint" class="print-input flex-1">{{ form.inputA_9 }}</p>
        <ml-input
          :readonly="board.readonly"
          v-else
          v-model="form.inputA_9"
        />
      </div>
      <div class="writeGridLineItem">
        <div>작업순서</div>
        <p v-if="isPrint" class="print-input flex-1">{{ form.inputA_10 }}</p>
        <ml-textarea
          :readonly="board.readonly"
          v-else
          v-model="form.inputA_10"
          class="flex-1 w-full"
          rows="5"
          @input="updateInputA_10"
        />
      </div>
    </div>

    <vs-row class="mt-4">
      <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
        <h5><i class="dot"></i> 작업 전 점검사항</h5>
      </vs-col>
    </vs-row>
    <div class="content-table mt-4">
      <table>
        <thead>
        <tr>
          <th style="width: 70px">선택</th>
          <th style="width: 240px">위험요인</th>
          <th style="width: 100%;">안전대책</th>
          <th style="width: 300px">비고</th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="(data, index) in form.tableList" :key="index">
          <td v-if="data.rowspan" style="width: 70px" :rowspan="data.rowspan">
            <vs-checkbox
              class="align-center justify-center"
              :readonly="board.readonly"
              v-model="data.check"
              @change="checkRisk"
            />
          </td>
          <td v-if="data.rowspan" style="width: 240px" :rowspan="data.rowspan">
            <span>{{ data.title }}</span>
          </td>
          <td style="width: 100%; text-align: start;">
            <span>{{ data.content }}</span>
          </td>
          <td style="width: 300px">
            <ml-input
              class="w-full"
              :readonly="board.readonly"
              v-model="data.note"
            />
          </td>
        </tr>
        </tbody>
      </table>
      <span style="font-weight: bold;">※ 첨부 : 사업자등록증, 건설기계등록증, 보험가입증명서, 조종사면허증, 교육이수증, 장비제원표</span>
    </div>

    <!-- 파일첨부 -->
    <file-upload-module id="fileList" class="w-full mt-8" v-model="form.fileList" :is-print="isPrint" :readonly="board.readonly"></file-upload-module>

  </div>
</template>

<script>
import FileUploadModule from "@/views/modules/FileUploadModule";
import FieldSelectModule from "@/views/modules/FieldSelectModule";
import DateSelector from "@/components/selector/DateSelector.vue";
import Print from "@/views/boards/single-page/529/Print.vue";

export default {
  components: {
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
    checkRisk() {
      this.form.risk = [];
      this.form.tableList.forEach((item) => {
        if (item.check) {
          this.form.risk.push(item.title);
        }
      });
    },
    updateInputA_10() {
      this.form.printA_10 = this.form.inputA_10.replace(new RegExp('\n', 'gim') , "<br>")
      this.form.inputA_10 = this.form.inputA_10.replace(new RegExp('(\n){2,}', 'gim') , "\t")
    },
  },
  data() {
    return {
      form: {
        stdInfo: {},
        fileList: [],
        equipment: "",
        equipmentList: [
          {id: 1, label: "고소작업대", check: false, value: ''},
          {id: 2, label: "사다리차", check: false, value: ''},
          {id: 3, label: "지게차", check: false, value: ''},
          {id: 4, label: "직접입력", check: false, value: ''},
        ],

        inputA_0: "",
        inputA_1: "",
        inputA_2: "",
        inputA_3: "",
        inputA_4: "",
        inputA_5: "",
        inputA_6: "",
        inputA_7: "",
        inputA_8: "",
        inputA_9: "",
        inputA_10: "",
        printA_10: "",

        tableList: [
          {id : 1, rowspan:3, check: false, title: "추락", content: "① 안전시설물 (안전난간대, 안전휀스, 라바콘 등) 설치", note: ""},
          {id : 2, content: "② 장비점검시 안전보호구 착용 후 장비점검 실시", note: ""},
          {id : 3, content: "③ 장비이동로 안전울타리 설치", note: ""},
          {id : 4, rowspan:3, check: false, title: "낙하", content: "① 하역 / 운반 / 적재시 과적금지", note: ""},
          {id : 5, content: "② 건설기계 유압누수 및 각 연결부재 고정상태 확인", note: ""},
          {id : 6, content: "③ 운전석 이탈시 엔진 정지 및 브레이크 고정", note: ""},
          {id : 7, rowspan:2, check: false, title: "전도", content: "① 건설기계의 구조 및 사용상 안전도, 최대사용하중 준수", note: ""},
          {id : 8, content: "② 건설기계의 주용도 외 사용제한 조치", note: ""},
          {id : 9, rowspan:3, check: false, title: "협착/충돌", content: "① 차량운행 경로 내 근로자 접근금지", note: ""},
          {id : 10, content: "② 차량 경광등 및 후진경보음의 작동유무 확인", note: ""},
          {id : 11, content: "③ 후방카메라 설치하여 후방경계 조치", note: ""},
        ],
        risk: [],


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
