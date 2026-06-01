<template>
  <div>
    <table>
      <colgroup>
        <col width="140" />
        <col />
        <col width="140" />
        <col />
        <col width="102" />
        <col width="38" />
        <col />
      </colgroup>
      <tr>
        <td rowspan="2" colspan="5" class="border-0">
          <h1>비상사태훈련 결과보고서</h1>
        </td>
        <td rowspan="2" class="gray">
          <p style="writing-mode: vertical-lr">결&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;재</p>
        </td>
        <td class="gray">관리감독자</td>
        <td class="gray">안전관리자</td>
        <td class="gray">관리책임자</td>
      </tr>
      <tr>
        <td>
          <div class="p-1" style="height: 80px">
            <img v-if="!!form.sign_1_data" :src="form.sign_1_data" class="w-full h-full object-contain" />
          </div>
        </td>
        <td>
          <div class="p-1" style="height: 80px">
            <img v-if="!!form.sign_2_data" :src="form.sign_2_data" class="w-full h-full object-contain" />
          </div>
        </td>
        <td>
          <div class="p-1" style="height: 80px">
            <img v-if="!!form.sign_3_data" :src="form.sign_3_data" class="w-full h-full object-contain" />
          </div>
        </td>
      </tr>
    </table>

    <!-- ========================================================================================================== -->
    <!-- ================================================= 기본정보 ================================================ -->
    <!-- ========================================================================================================== -->
    <h4 class="mt-4 py-4">□ 기본정보</h4>
    <table v-if="form.stdInfo">
      <colgroup>
        <col width="140" />
        <col />
        <col width="140" />
        <col />
        <col width="140" />
        <col />
      </colgroup>
      <tr>
        <td class="gray font-bold">현장명</td>
        <td>{{ form.stdInfo.field_name }}</td>
        <td class="gray font-bold">소속명</td>
        <td>{{ form.stdInfo.department }}</td>
        <td class="gray font-bold" >부서명</td>
        <td>{{ form.stdInfo.com_name }}</td>
      </tr>
      <tr>
        <td class="gray font-bold">직책</td>
        <td>{{ form.stdInfo.rank }}</td>
        <td class="gray font-bold">작성자</td>
        <td>{{ form.stdInfo.writer_name }}</td>
        <td class="gray font-bold" >작성일</td>
        <td>{{ form.stdInfo.date }}</td>
      </tr>
      <tr>
        <td class="gray font-bold">훈련일</td>
        <td>{{ form.inputA_1 }}</td>
        <td class="gray font-bold">훈령장소</td>
        <td>{{ form.inputA_2 }}</td>
        <td class="gray font-bold" >훈련명</td>
        <td>{{ form.inputA_3 }}</td>
      </tr>
    </table>


    <!-- ========================================================================================================== -->
    <!-- ================================================ 훈련실시 현황 =============================================== -->
    <!-- ========================================================================================================== -->
    <h4 class="mt-4 py-4">□ 훈련실시 현황</h4>
    <table>
      <colgroup>
        <col width="220" />
        <col />
        <col />
        <col width="140" />
      </colgroup>
      <tr>
        <td class="gray font-bold">훈련시간</td>
        <td class="gray font-bold">상황내용</td>
        <td class="gray font-bold">대응조치</td>
        <td class="gray font-bold">조치자</td>
      </tr>
      <tr v-for="data in form.currentSituationList">
        <td>{{data.input1.sTime | dateHHmm }} ~ {{data.input1.eTime | dateHHmm }}</td>
        <td class="text-left whitespace-pre-wrap">{{data.input2}}</td>
        <td class="text-left whitespace-pre-wrap">{{data.input3}}</td>
        <td>{{data.input4}}</td>
      </tr>
    </table>


    <!-- ========================================================================================================== -->
    <!-- ================================================ 문제점 및 개선방안 =============================================== -->
    <!-- ========================================================================================================== -->
    <h4 class="mt-4 py-4">□ 문제점 및 개선방안</h4>
    <table>
      <colgroup>
        <col width="220" />
        <col />
        <col />
        <col width="140" />
      </colgroup>
      <tr>
        <td class="gray font-bold">구분</td>
        <td class="gray font-bold">문제점</td>
        <td class="gray font-bold">개선방안</td>
        <td class="gray font-bold">조치자</td>
      </tr>
      <tr v-for="data in form.improvementList">
        <td>{{data.input1 }}</td>
        <td class="text-left whitespace-pre-wrap">{{data.input2}}</td>
        <td class="text-left whitespace-pre-wrap">{{data.input3}}</td>
        <td>{{data.input4}}</td>
      </tr>
    </table>

    <!-- ========================================================================================================== -->
    <!-- ================================================ 훈련결과 =============================================== -->
    <!-- ========================================================================================================== -->
    <h4 class="mt-4 py-4">□ 훈련결과</h4>
    <table>
      <colgroup>
        <col width="220" />
        <col />
      </colgroup>
      <tr>
        <td class="gray font-bold">점검대상</td>
        <td >
          <div class="flex">
            <div class="checkbox">
              <div class="box" style="text-align: center;  align-self: center;">
                <vs-icon v-if="form.inputB_1 === '적합'" icon="check" size="small"></vs-icon>
              </div>
              적합
            </div>
            <div class="checkbox">
              <div class="box" style="text-align: center;  align-self: center;">
                <vs-icon v-if="form.inputB_1 === '보완'" icon="check" size="small"></vs-icon>
              </div>
              보완
            </div>
            <div class="checkbox">
              <div class="box" style="text-align: center;  align-self: center;">
                <vs-icon v-if="form.inputB_1 === '부적합'" icon="check" size="small"></vs-icon>
              </div>
              부적합
            </div>
          </div>
        </td>
      </tr>
    </table>

    <!-- ========================================================================================================== -->
    <!-- ================================================ 비상사태훈련 평가표 =============================================== -->
    <!-- ========================================================================================================== -->
    <div>
      <table-inspect-custom
        class="mt-5"
        :is-print="true"
        :is-readonly="true"
        title="비상조치훈련 평가표"
        check-title="평가결과(점)"
        main-grid-style="90px 1fr 324px 320px"
        check-grid-style="50px 50px 50px 50px 50px 1fr"
        :check-list="['1', '2', '3', '4', '5', { label: '해당없음', value: '' }]"
        check-key="is_checked"
        :list="form.inspectList">
        <template slot="title">
          <h1 >비상사태훈련 평가표</h1>
          <h4 class="mt-4 py-4">□ 평가항목</h4>
        </template>
        <template slot="footer">
          <div class="row-header" style="white-space: pre-wrap;"> 평가 </div>
          <div class="col-span-2 grid p-0" style="grid-template-columns: 100px 1fr;">
            <div class="row-header border-right"> 총평 </div>
            <div class="p-2">
              <span class="print-input whitespace-pre-wrap"> {{ form.command }} </span>
            </div>
          </div>
          <div class="grid p-0" style="grid-template-columns: 100px 1fr;">
            <div class="row-header border-right"> 평가점수 </div>
            <div class="p-2" style="display: flex; justify-content: center; align-items: center;">
              {{ inspectTotal }}
            </div>
          </div>
        </template>
      </table-inspect-custom>
    </div>



    <!-- ========================================================================================================== -->
    <!-- ================================================ 비상사태 훈련 참석자 명단 =============================================== -->
    <!-- ========================================================================================================== -->
    <div class="print-break-page">
      <h1 >비상사태 훈련 참석자 명단</h1>
      <h4 class="mt-8 py-4">□ 현장명: <span style="font-weight: 400">{{ form.stdInfo.field_name }}</span></h4>
      <h4 class="py-4">□ 일 시: <span style="font-weight: 400">{{ trainingDateTime }}</span></h4>

      <table class="mb-8">
        <tr>
          <td class="p-0" style="width: 50%; padding-right:5px !important; border:none;">
            <table class="h-full attendeeTable">
              <tbody>
              <tr>
                <td class="gray">소속</td>
                <td class="gray">직종</td>
                <td class="gray">직책</td>
                <td class="gray">이름</td>
                <td class="gray">서명</td>
              </tr>
              <tr v-for="index in 10" :key="index">
                <td class="p-0">
                  <div>
                    {{ typeof form.participant[index - 1] !== "undefined" ? form.participant[index - 1].input1 : "" }}
                  </div>
                </td>
                <td class="p-0">
                  <div>
                    {{ typeof form.participant[index - 1] !== "undefined" ? form.participant[index - 1].input2 : "" }}
                  </div>
                </td>
                <td class="p-0">
                  <div>
                    {{ typeof form.participant[index - 1] !== "undefined" ? form.participant[index - 1].input3 : "" }}
                  </div>
                </td>
                <td class="p-0">
                  <div>
                    {{ typeof form.participant[index - 1] !== "undefined" ? form.participant[index - 1].input4 : "" }}
                  </div>
                </td>
                <td style="width: 1%; white-space: nowrap; min-width: 90px; padding: 2px">
                  <img class="mx-auto" v-if="!!form.participant[index - 1]" height="50" :src="form.participant[index - 1].input5" />
                </td>
              </tr>
              </tbody>
            </table>
          </td>
          <!-- <td style="width: 10px;"></td> -->

          <td class="p-0" style="width: 50%; padding-left:5px !important; border:none;">
            <table class="h-full attendeeTable">
              <tbody>
              <tr>
                <td class="gray">소속</td>
                <td class="gray">직종</td>
                <td class="gray">직책</td>
                <td class="gray">이름</td>
                <td class="gray">서명</td>
              </tr>
              <tr v-for="index in 10" :key="index + 10">
                <td class="p-0">
                  <div>
                    {{ !!form.participant[index + 10 - 1] ? form.participant[index + 10 - 1].input1 : "" }}
                  </div>
                </td>
                <td class="p-0">
                  <div>
                    {{ !!form.participant[index + 10 - 1] ? form.participant[index + 10 - 1].input2 : "" }}
                  </div>
                </td>
                <td class="p-0">
                  <div>
                    {{ !!form.participant[index + 10 - 1] ? form.participant[index + 10 - 1].input3 : "" }}
                  </div>
                </td>
                <td class="p-0">
                  <div>
                    {{ !!form.participant[index + 10 - 1] ? form.participant[index + 10 - 1].input4 : "" }}
                  </div>
                </td>
                <td style="width: 1%; white-space: nowrap; min-width: 90px; padding: 2px">
                  <img class="mx-auto" v-if="!!form.participant[index + 10 - 1]" height="50" :src="form.participant[index + 10 - 1].input5" />
                </td>
              </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </table>

      <photo-upload-grid-module
        class="mt-4"
        v-model="form.photoList"
        :is-print="true"
        :customTitle="true"
        section-title="사진대지"
        placeholder="점검 현장 사진"
        printImageHeight="400px"
        :custom-title-style="{}"
        :show-footer-input="false"
      >
        <template #customTitle>
          <div style="font-size: 24px; font-weight: 700; line-height: 35px; padding-bottom: 16px">□ 사진대지</div>
        </template>
      </photo-upload-grid-module>
    </div>


  </div>
</template>

<script>
import TableInspectCustom from '@/components/TableInspectCustom.vue'

export default {
  name: "Print221",
  components: {TableInspectCustom},
  props: {
    form: Object,
  },
  filters: {
    comma(val) {
      return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    dateHHmm (val) {
      try {
        return new Date(`2000-01-01 ${val}`).format('HH:mm')
      } catch (e) {
        return val
      }
    }
  },
  computed: {
    inspectTotal () {
      let sum = 0;
      for (const item of this.form.inspectList) {
        if (this.isNumber(item.is_checked)) {
          sum += Number(`${item.is_checked}`)
        }
      }
      return sum
    },

    trainingDateTime () {
      const date = this.form.inputA_1
      const timeList = [];
      for (const cs of this.form.currentSituationList) {
        if (cs.input1.sTime) timeList.push(cs.input1.sTime)
        if (cs.input1.eTime) timeList.push(cs.input1.eTime)
      }

      const newList = timeList.sort()
      const start = new Date(`${date} ${newList[0]}`).format('HH:mm')
      const end = new Date(`${date} ${newList[newList.length - 1]}`).format('HH:mm')


      return `${new Date(date).format('yyyy년 MM월 dd일')} ( ${start} ~ ${end} )`
    }
  },
  methods:{
    isNumber (num) {
      try {
        return Number(num)
      } catch (err) {
        return false
      }
    }
  }
};
</script>

<style lang="scss" scoped>
$border: 1px solid #cdcdcd;
h1 {
  font-weight: 700;
  font-size: 32px;
  line-height: 46px;
  text-align: center;
  padding: 25px 0px;
}

h4 {
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 35px;
}

img.check {
  margin: auto;
  margin-top: -1px;
}

.before-label {
  display: list-item;
  list-style-type: "·";
  padding-left: 6px;
  margin-left: 6px;
}

table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;

  td {
    text-align: center;
    border: 1px solid #757575;
    padding: 10px 8px;
    word-break: keep-all;

    box-sizing: border-box !important;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
  }
  td.gray {
    background: #f0f0f0;
  }

  td > div.print-textarea {
    min-height: 0;
    text-align: left !important;
    border: 0 !important;
    padding: 0 !important;
    margin: 0 !important;
  }
}


.checkbox {
  display: flex;
  margin-right: 10px;
  .box {
    margin-right: 4px;
    width: 20px;
    height: 20px;
    border: $border;

    display: flex;
    justify-content: center;
    align-items: center;

    .vs-icon {
      scale: 0.7;
    }
  }
}
.attendeeTable {
  td > div {
    min-height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

</style>
