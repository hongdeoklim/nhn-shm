<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h5 class="flex items-center"><i class="dot"></i>위험성평가</h5>
      <div v-if="!readonly && !isPrint">
        <vs-button v-if="this.checkData.length > 1" class="mr-4" color="secondary" @click="handleAllCopy"> 일괄입력 </vs-button>
        <vs-button color="secondary" type="border" @click="handleAddRow"> 항목추가 </vs-button>
        <vs-button class="ml-4" color="secondary" @click="handleRemoveRow"> 선택삭제 </vs-button>
      </div>
    </div>

    <table>
      <colgroup>
        <col v-if="!readonly" width="36" />
        <col />
        <col />
        <col width="240" />
        <col />
        <col width="46" />
        <col width="46" />
        <col width="46" />
        <col width="240" />
        <col />
        <col width="182" />
        <col width="182" />
      </colgroup>
      <thead>
        <tr>
          <th v-if="!readonly" rowspan="3">
            <vs-checkbox :value="checkData.length === list.length && 0 < list.length" class="justify-center mx-0" @click.native="onClickAllCheck" />
          </th>
          <th rowspan="3"><div class="w-full text-center">①공종분류</div></th>
          <th rowspan="3"><div class="w-full text-center">②단위작업</div></th>
          <th rowspan="3"><div class="w-full text-center">③위험요인</div></th>
          <th rowspan="3"><div class="w-full text-center">재해형태</div></th>
          <th colspan="3" class="text-center">④위험성 결정</th>
          <th rowspan="3">
            <div class="flex items-center justify-center gap-2">
              <span>⑤위험방지대책</span>
              <feather-icon icon="AlertCircleIcon" style="cursor: pointer; width: 18px; color: #7e72f2; margin-right: 3px" @click="showPopup = true" />
            </div>
          </th>
          <th rowspan="3">
            <div class="w-full text-center">⑥개선조치 담당자<br />(조치예정일)</div>
          </th>
          <th rowspan="2" colspan="2">
            <div class="w-full text-center">➉이행확인<br />(조치한 경우 √)</div>
          </th>
        </tr>
        <tr>
          <th colspan="3" class="text-center">위험도 등급</th>
        </tr>
        <tr>
          <th class="text-center">상</th>
          <th class="text-center">중</th>
          <th class="text-center">하</th>
          <th class="text-center">협력회사</th>
          <th class="text-center">안전관리자</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in list" :key="item.id">
          <td v-if="!readonly" style="background: #f9f9f9"><vs-checkbox v-model="checkData" :vs-value="item.id" /></td>
          <td><ml-input :readonly="readonly" v-model="item.input1" class="w-full" placeholder="철근작업" /></td>
          <td><ml-input :readonly="readonly" v-model="item.input2" class="w-full" placeholder="철근조립" /></td>
          <td><ml-textarea :readonly="readonly" rows="3" v-model="item.input3" placeholder="8층 기둥철근조립 중 틀비계 안전난간대 미 설치로 인한 추락위험" class="w-full mb-0" /></td>
          <td>
            <disaster-class-selector class="disaster" :multiple="true" :readonly="readonly" placeholder="입력필드" v-model="item.input4" />
          </td>
          <td>
            <PrintRadio v-if="readonly" :value="item.input5 === '상'" class="justify-center" />
            <vs-radio v-else :vs-name="item.id" vs-value="상" v-model="item.input5" />
          </td>
          <td>
            <PrintRadio v-if="readonly" :value="item.input5 === '중'" class="justify-center" />
            <vs-radio v-else :vs-name="item.id" vs-value="중" v-model="item.input5" />
          </td>
          <td>
            <PrintRadio v-if="readonly" :value="item.input5 === '하'" class="justify-center" />
            <vs-radio v-else :vs-name="item.id" vs-value="하" v-model="item.input5" />
          </td>
          <td>
            <ml-textarea :readonly="readonly" rows="3" v-model="item.input6" placeholder="- 이동식비계 3 SET 반입 시 안전난간대 수량 확인(부족분 작업전 반입)  - 이동식비계 안전난간대 4개소 설치(상부 및 하부 난간대)" class="w-full mb-0" />
          </td>
          <td>
            <ml-input :readonly="readonly" v-model="item.input7" class="w-full mb-2" placeholder="홍길동 반장" />
            <date-selector :readonly="readonly" v-model="item.input8" class="w-full" placeholder="날짜선택" />
          </td>
          <td>
            <sign-field v-if="!isPrint" v-model="item.input9" class="flex-1 justify-self-start" :style="{ minWidth: '170px' }" />
            <div v-else class="w-full flex-1 p-1">
              <img v-if="item.input9" :src="item.input9" width="100%" alt="Signature" class="signatureImg" />
              <div v-else class="signatureImg"></div>
            </div>
          </td>
          <td>
            <sign-field v-if="!isPrint" v-model="item.input10" class="flex-1 justify-self-start" :style="{ minWidth: '170px' }" />
            <div v-else class="w-full flex-1 p-1">
              <img v-if="item.input9" :src="item.input10" width="100%" alt="Signature" class="signatureImg" />
              <div v-else class="signatureImg"></div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <vs-popup :active.sync="showPopup" title="위험성 결정에 따른 위험방지대책 우선 순위">
      <p><b>상 등급 : </b>대책 우선 순위 : 공법변경→작업변경→안전시설물→개인보호구 순</p>
      <p><b>중 등급 : </b>대책 우선 순위 : 관리자 배치(신호수 등) → 위험저감 교육 등</p>
    </vs-popup>
  </div>
</template>

<script>
import DisasterClassSelector from "@/components/selector/DisasterClassSelector.vue";
import DateSelector from "@/components/selector/DateSelector.vue";
import PrintRadio from "@/components/print/PrintRadio.vue";
import PrintCheckbox from "@/components/print/PrintCheckbox.vue";
import SignField from "@/components/SignField.vue";
export default {
  components: {
    SignField,
    DisasterClassSelector,
    DateSelector,
    PrintRadio,
    PrintCheckbox,
  },
  props: {
    readonly: { type: Boolean, default: false },
    isPrint: { type: Boolean, default: false },
    value: { type: Array, default: () => [] },
  },
  data() {
    return {
      checkData: [],
      list: this.value,
      showPopup: false,
    };
  },
  watch: {
    value: {
      handler(value) {
        this.list = value;
      },
    },
    list: {
      immediate: true,
      deep: true,
      handler(value) {
        this.$emit("input", value);
      },
    },
  },
  methods: {
    // All 체크박스 클릭
    onClickAllCheck() {
      if (this.checkData.length === this.list.length) this.checkData = [];
      else this.checkData = this.list.map((item) => item.id);
    },
    // 항목추가
    handleAddRow() {
      const generateId = Date.now().toString(12) + Math.random().toString(12);
      const addData = { id: generateId, input10: "" };
      this.list.push(addData);
    },
    // 선택삭제
    handleRemoveRow() {
      this.list = this.list.filter((item) => !this.checkData.includes(item.id));
      this.checkData = [];
    },
    // 일괄입력
    handleAllCopy() {
      if (this.checkData.length > 1) {
        const firstData = this.list.find((item) => item.id === this.checkData[0]);
        this.list = this.list.map((item) => {
          if (this.checkData.includes(item.id)) {
            return {
              ...item,
              input7: firstData.input7,
              input8: firstData.input8,
              input9: firstData.input9,
              input10: firstData.input10,
            };
          }
          return item;
        });
      }
    }
  },
};
</script>

<style lang="scss" scoped>
table {
  table-layout: fixed;
  border-collapse: collapse;
  width: 100%;
  th,
  td {
    border: 1px solid #cdcdcd;
    padding: 5px;

    &::v-deep .con-vs-checkbox {
      justify-content: center !important;
      margin: 0;
      span {
        margin: 0;
      }
    }
    &::v-deep .con-vs-radio {
      width: 100%;
      justify-content: center !important;
    }
  }
  th {
    font-size: 14px;
    font-weight: 700;
    line-height: 18px;
    text-align: center;

    background: #f9f9f9;
    padding: 7px;
  }
}

.disaster::v-deep {
  .con-select {
    width: 100%;
  }
}
</style>
