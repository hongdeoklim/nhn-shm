<template>
  <div>
    <!-- Page 1-->
    <div>
      <h1 class="titleFull">Tool Box Meeting 회의록</h1>
      <table>
        <colgroup>
          <col width="180" />
          <col />
          <col width="180" />
          <col />
        </colgroup>
        <tr>
          <th>TBM 일시</th>
          <td colspan="3">
            {{ form.inputB_1 | moment("YYYY년 MM월 DD일") }}<span v-if="!!form.inputB_1 && (!!form.inputB_2 || !!form.inputB_3)">, </span> {{ form.inputB_2 | time }}<span v-if="!!form.inputB_2 || !!form.inputB_3">~</span
            >{{ form.inputB_3 | time }}
          </td>
        </tr>
        <tr>
          <th>해당기간</th>
          <td colspan="3">{{ form.inputB_8.sDate }} <span v-if="!!form.inputB_8.sDate || !!form.inputB_8.eDate">~</span> {{ form.inputB_8.eDate }}</td>
        </tr>
        <tr>
          <th>작업명</th>
          <td colspan="3">{{ form.inputB_4 }}</td>
        </tr>
        <tr>
          <th>작업내용</th>
          <td colspan="3">{{ form.inputB_5 }}</td>
        </tr>
        <tr>
          <th>TBM 장소</th>
          <td>{{ form.inputB_6 }}</td>
          <th>위험성평가 실시여부</th>
          <td>
            <div class="flex items-center justify-center gap-4">
              <PrintRadio label="예" :value="form.inputB_7 === '예'" class="justify-center" />
              <PrintRadio label="아니오" :value="form.inputB_7 === '아니오'" class="justify-center" />
            </div>
          </td>
        </tr>
      </table>
      <table v-if="0 < form.risk_factors.length" class="print-container">
        <colgroup>
          <col width="60" />
          <col width="" />
          <col width="" />
        </colgroup>
        <tr>
          <th>연변</th>
          <th>잠재위험요인</th>
          <th>대책 (제거→대체→통제 순서고려)</th>
        </tr>

        <tr v-for="(item, item_i) in form.risk_factors" :key="`risk_factors_${item_i}`">
          <td>{{ item.id }}</td>
          <td>{{ item.input1 }}</td>
          <td>{{ item.input2 }}</td>
        </tr>
      </table>
      <table v-if="form.중점위험요인" class="print-container">
        <colgroup>
          <col width="120" />
          <col width="180" />
          <col />
        </colgroup>
        <tr>
          <th rowspan="2">
            중점<br />
            위험요인
          </th>
          <th>선정</th>
          <td>{{ form.중점위험요인.선정 }}</td>
        </tr>
        <tr>
          <th>대책</th>
          <td>{{ form.중점위험요인.대책 }}</td>
        </tr>
      </table>
      <table v-if="form.작업전안전조치확인" class="print-container">
        <colgroup>
          <col width="60" />
          <col width="" />
          <col width="150" />
          <col width="" />
        </colgroup>
        <tr>
          <th class="text-left p-" colspan="4">작업 전 안전조치 확인</th>
        </tr>
        <tr>
          <th>연번</th>
          <th>잠재위험요소</th>
          <th>조치 여부</th>
          <th>‘아니오’인 경우 조치 내용</th>
        </tr>
        <tr v-for="(item, item_i) in form.작업전안전조치확인.list" :key="`작업전안전조치확인_${item_i}`">
          <td>{{ item_i + 1 }}</td>
          <td class="text-left">{{ item.잠재위험요소 }}</td>
          <td>
            <div class="py-3 flex justify-center items-center gap-3">
              <PrintRadio :value="item.조치여부 === 'Y'" class="justify-center" label="예" />
              <PrintRadio :value="item.조치여부 === 'N'" class="justify-center" label="아니오" />
            </div>
          </td>
          <td class="text-left">{{ item.아니오_조치내용 }}</td>
        </tr>
      </table>
      <table v-if="form.작업전안전조치확인" class="print-container">
        <colgroup>
          <col width="1" />
          <col width="1" />
        </colgroup>
        <tr>
          <th class="text-left">교육 내용</th>
          <th class="text-left">기타 특이사항</th>
        </tr>
        <tr>
          <td>
            <div class="pre" style="min-height: 150px; text-align: left">{{ form.작업전안전조치확인.교육내용 }}</div>
          </td>
          <td>
            <div class="pre" style="min-height: 150px; text-align: left">{{ form.작업전안전조치확인.기타특이사항 }}</div>
          </td>
        </tr>
      </table>
      <table v-if="0 < form.participant.length" class="print-container">
        <tr>
          <th colspan="6">참석자 명단</th>
        </tr>
        <tr>
          <th>공종</th>
          <th>이름</th>
          <th>서명</th>
          <th>공종</th>
          <th>이름</th>
          <th>서명</th>
        </tr>
        <tr v-for="(item, item_i) in Math.ceil(form.participant.length / 2)" :key="`participant_${item_i}`">
          <td>{{ form.participant[item_i * 2].type }}</td>
          <td>{{ form.participant[item_i * 2].name }}</td>
          <td class="relative">
            <img v-if="!!form.participant[item_i * 2].sign" :src="form.participant[item_i * 2].sign" class="absolute w-full h-full top-0 left-0 object-contain" />
          </td>
          <td>{{ !!form.participant[item_i * 2 + 1] ? form.participant[item_i * 2 + 1].type : "" }}</td>
          <td>{{ !!form.participant[item_i * 2 + 1] ? form.participant[item_i * 2 + 1].name : "" }}</td>
          <td class="relative">
            <img v-if="!!form.participant[item_i * 2 + 1] && !!form.participant[item_i * 2 + 1].sign" :src="form.participant[item_i * 2 + 1].sign" class="absolute w-full h-full top-0 left-0 object-contain" />
          </td>
        </tr>
      </table>
    </div>

    <!-- Page 2-->
    <div>
      <!--      <h1 class="titleFull">TBM 회의 사진대지</h1>-->
      <div v-if="showPhotoList" class="print-container">
        <!-- TBM 회의 사진대지 -->
        <photo-upload-grid-module :row-count="2" :grid-count="2" v-model="form.photoList" :is-print="true" section-title="-" placeholder="신축현장 점검" :customTitle="true" withDatePicker>
          <template #customTitle>
            <h1 class="mb-4 text-left no-underline" style="font-size: 22px">□ TBM 회의 사진대지</h1>
          </template>
        </photo-upload-grid-module>

        <!--    위험요인 조치 사진대지 -->
        <photo-upload-grid-module
          class="mt-28px"
          section-title="위험요인 조치 사진대지"
          :add-count="2"
          :row-count="2"
          :grid-count="2"
          v-model="form.위험요인조치사진대지"
          :is-print="true"
          :customTitle="true"
          useDeleteLatestItem
          placeholder="신축현장 점검"
        >
          <template #customTitle>
            <h1 class="mb-4 text-left no-underline" style="font-size: 22px">□ 위험요인 조치 사진대지</h1>
          </template>
          <template #footer="{ file, fileIndex }">
            <div class="flex items-center" style="border-right: 1px solid #757575; border-bottom: 1px solid #757575; font-size: 18px">
              <span v-if="fileIndex % 2 === 0" class="p-2" style="border-right: 1px solid #757575; width: 140px; text-align: center">조치 전</span>
              <span v-else class="p-2" style="border-right: 1px solid #757575; width: 140px; text-align: center">조치 후</span>
              <span class="p-2" style="border-right: 1px solid #757575">내 용</span>
              <span class="p-2 flex-1">{{ file.input }}</span>
            </div>
          </template>
        </photo-upload-grid-module>
      </div>
    </div>
  </div>
</template>

<script>
import PrintRadio from "@/components/print/PrintRadio.vue";
import PhotoUploadGridModule from "@/views/modules/PhotoUploadGridModule";
import moment from "moment";
export default {
  name: "Print528",
  components: {
    PrintRadio,
    PhotoUploadGridModule,
  },
  props: {
    form: Object,
  },
  filters: {
    time(val) {
      if (val) return moment(val, "HH:mm:ss").format("HH:mm");
      else return "";
    },
  },
  computed: {
    showPhotoList() {
      return this.form.photoList.reduce((acc, cur) => {
        return acc || !!cur.path;
      }, false);
    },
  },
};
</script>

<style lang="scss" scoped>
$border-color: #cdcdcd;
$approval-border: 2px solid #cdcdcd;
$bg-color: #ececec;

.titleFull {
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  text-decoration: underline;
  padding: 30px 0;
}
table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;

  &:nth-child(n + 2) {
    margin-top: -1px;
  }

  th,
  td {
    height: 65px;

    font-size: 16px;
    font-weight: 400;
    text-align: center;

    border: 1px solid $border-color;
    padding: 14px;
  }

  th {
    font-weight: 500;

    background: $bg-color;
  }
}
</style>
