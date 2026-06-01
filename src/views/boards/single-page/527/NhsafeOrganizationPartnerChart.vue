<template>
  <div class="mt-component-form">
    <vs-row class="my-4">
      <h5><i class="dot"></i>{{ title }}</h5>
    </vs-row>

    <div class="nhsafe-grid row-header">
      <div class="row-header__item">No.</div>
      <div class="row-header__item">업체명</div>
      <div class="row-header__item">직책</div>
      <div class="row-header__item">공종</div>
      <div class="row-header__item">이름</div>
      <div class="row-header__item">연락처</div>
      <div class="row-header__item">임무 및 역할</div>
    </div>
    <!-- rows -->
    <div class="nhsafe-grid row-content" v-for="(rows, indexRows) in targetList" :key="indexRows">
      <!--      No-->
      <div class="no none-border-center">{{ rows.no }}</div>

      <!--      업체명-->
      <div class="item-area">
        <ml-input v-if="!isPrint" rows="1" v-model="rows.target" class="w-full flex-1" style="padding: 6px" :readonly="isReadonly" placeholder="입력" />
        <span v-else class="print-input">{{ rows.target }}</span>
      </div>

      <!--      직책-->
      <div class="item-area">
        <vs-select v-if="!isPrint" autocomplete class="w-full flex-1" style="padding: 6px" v-model="rows.type" @change="handleTypeChange(rows)">
          <vs-select-item v-for="(item, index) in typeOptions" :key="index" :text="item.text" :value="item.value" />
        </vs-select>
        <span v-else class="print-input">{{ rows.type }}</span>
      </div>

      <!--      공종-->
      <div class="item-area">
        <CustomSelector :options="['전기', '통신', '수장', '금속', '도장', '철거', '조적', '마감', '직접입력']" v-model="rows.task" :isPrint="isPrint" :readonly="isReadonly" class="w-full flex-1" style="padding: 6px" />
      </div>

      <!--      이름-->
      <div class="item-area">
        <ml-input v-if="!isPrint" rows="1" v-model="rows.name" class="w-full flex-1" style="padding: 6px" :readonly="isReadonly" placeholder="입력" />
        <span v-else class="print-input">{{ rows.name }}</span>
      </div>

      <!--      연락처-->
      <div class="item-area">
        <ml-input v-if="!isPrint" rows="1" v-model="rows.phone" class="w-full flex-1" style="padding: 6px" :readonly="isReadonly" placeholder="입력" />
        <span v-else class="print-input">{{ rows.phone }}</span>
      </div>

      <!--      업무 및 역할-->
      <div class="item-area" style="padding: 6px">
        <ml-textarea v-if="!isPrint" rows="4" v-model="rows.note" class="w-full flex-1 mb-4 resize-y" :readonly="isReadonly" spellcheck="false" />
        <span v-else class="print-textarea">{{ rows.note }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import CustomSelector from "@/components/selector/CustomSelector.vue";
export default {
  name: "NhsafeOrganizationPartnerChart",
  components: {
    CustomSelector,
  },
  props: {
    title: String,
    list: Array,
    positionList: Array,
    noteList: Object,
    isPrint: Boolean,
    isReadonly: Boolean,
  },
  watch: {
    list: {
      immediate: true,
      deep: true,
      handler(value) {
        if (value && value.length > 0) {
          this.targetList = value;
        }
      },
    },
  },
  methods: {
    handleTypeChange(data) {
      const type = data.type;

      if (type === "관리책임자") {
        data.note = `■ 안전보건관리책임자(산업안전보건법 제15조)
① 사업주는 현장을 실질적으로 총괄하여 관리하는 사람에게 해당 현장의 다음 각 호의 업무를 총괄하여 관리하도록 하여야 한다.
1. 현장의 산업재해 예방계획의 수립에 관한 사항
2. 제25조 및 제26조에 따른 안전보건관리규정의 작성 및 변경에 관한 사항
3. 제29조에 따른 안전보건교육에 관한 사항
4. 작업환경측정 등 작업환경의 점검 및 개선에 관한 사항
5. 제129조부터 제132조까지에 따른 근로자의 건강진단 등 건강관리에 관한 사항
6. 산업재해의 원인 조사 및 재발 방지대책 수립에 관한 사항
7. 산업재해에 관한 통계의 기록 및 유지에 관한 사항
8. 안전장치 및 보호구 구입 시 적격품 여부 확인에 관한 사항
9. 그 밖에 근로자의 유해ㆍ위험 방지조치에 관한 사항으로서 고용노동부령으로 정하는 사항
② 제1항 각 호의 업무를 총괄하여 관리하는 사람(이하 “안전보건관리책임자”라 한다)은 제17조에 따른 안전관리자와 제18조에 따른 보건관리자를 지휘ㆍ감독한다.
③ 안전보건관리책임자를 두어야 하는 사업의 종류와 현장의 상시근로자 수, 그 밖에 필요한 사항은 대통령령으로 정한다.`;
      } else if (type === "관리감독자") {
        data.note = `■ 관리감독자의 업무 등(산업안전보건법 시행령 제15조)
① 법 제16조제1항에서 “대통령령으로 정하는 업무”란 다음 각 호의 업무를 말한다.  <개정 2021. 11. 19.>
1. 현장 내 법 제16조제1항에 따른 관리감독자(이하 “관리감독자”라 한다)가 지휘ㆍ감독하는 작업(이하 이 조에서 “해당작업”이라 한다)과 관련된 기계ㆍ기구 또는 설비의 안전ㆍ보건 점검 및 이상 유무의 확인
2. 관리감독자에게 소속된 근로자의 작업복ㆍ보호구 및 방호장치의 점검과 그 착용ㆍ사용에 관한 교육ㆍ지도
3. 해당작업에서 발생한 산업재해에 관한 보고 및 이에 대한 응급조치
4. 해당작업의 작업장 정리ㆍ정돈 및 통로 확보에 대한 확인ㆍ감독
5. 현장의 다음 각 목의 어느 하나에 해당하는 사람의 지도ㆍ조언에 대한 협조
가. 법 제17조제1항에 따른 안전관리자(이하 “안전관리자”라 한다) 또는 같은 조 제5항에 따라 안전관리자의 업무를 같은 항에 따른 안전관리전문기관(이하 “안전관리전문기관”이라 한다)에 위탁한 현장의 경우에는 그 안전관리전문기관의 해당 현장 담당자
나. 법 제18조제1항에 따른 보건관리자(이하 “보건관리자”라 한다) 또는 같은 조 제5항에 따라 보건관리자의 업무를 같은 항에 따른 보건관리전문기관(이하 “보건관리전문기관”이라 한다)에 위탁한 현장의 경우에는 그 보건관리전문기관의 해당 현장 담당자
다. 법 제19조제1항에 따른 안전보건관리담당자(이하 “안전보건관리담당자”라 한다) 또는 같은 조 제4항에 따라 안전보건관리담당자의 업무를 안전관리전문기관 또는 보건관리전문기관에 위탁한 현장의 경우에는 그 안전관리전문기관 또는 보건관리전문기관의 해당 현장 담당자
라. 법 제22조제1항에 따른 산업보건의(이하 “산업보건의”라 한다)
6. 법 제36조에 따라 실시되는 위험성평가에 관한 다음 각 목의 업무
가. 유해ㆍ위험요인의 파악에 대한 참여
나. 개선조치의 시행에 대한 참여
7. 그 밖에 해당작업의 안전 및 보건에 관한 사항으로서 고용노동부령으로 정하는 사항
② 관리감독자에 대한 지원에 관하여는 제14조제2항을 준용한다. 이 경우 “안전보건관리책임자”는 “관리감독자”로, “법 제15조제1항”은 “제1항”으로 본다.`;
      } else {
        data.note = "-";
      }
    },
  },
  data() {
    return {
      equipAllCheck: false,
      typeOptions: [
        { text: "선택", value: "" },
        { text: "관리책임자", value: "관리책임자" },
        { text: "관리감독자", value: "관리감독자" },
      ],
      targetList: [],
    };
  },
};
</script>

<style scoped lang="scss">
$border: 1px solid #cdcdcd;
$bg: #f9f9f9;

.nhsafe-grid {
  display: grid;
  grid-template-columns: 60px repeat(6, 1fr);
}

.center-flex {
  display: flex;
  justify-content: center;
  align-items: center;
}

.label-text {
  width: 127px;
  font-weight: 500;
  font-size: 14px;
}
.mt-component-form {
  margin-top: 25px;
}
.vs-checkbox-default {
  margin: 0;
}
.ml-group-checkBox ~ .ml-group-checkBox {
  /*margin-left: 15px;*/
  margin: 0;
}

/* Table */
.row-header {
  background-color: $bg;
  text-align: center;

  &__checkbox-title {
    height: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: $border;
    width: 100%;
  }
  &__checkboxs {
    display: flex;
    height: 50%;
    width: 100%;
    div {
      flex: 1;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    div:nth-child(2) {
      border-left: $border;
      border-right: $border;
    }
  }
}
.row-header__item {
  border-top: $border;
  border-bottom: $border;
  border-left: none;
  border-right: none;
  padding-top: 10px;
  padding-bottom: 10px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.row-header__item.item-col {
  flex-direction: column;
}
.row-header__item:last-child {
  border-right: none;
}

.none-border-center {
  padding-top: 10px;
  padding-bottom: 10px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* row data */
.row-content {
  border-bottom: $border;

  .no {
    background-color: $bg;
    border-right: 1px solid #cdcdcd;
  }
  &__title {
    background-color: $bg;
    height: 100%;
  }
  &__body {
  }
}
.row-content__body-item {
  .item-content {
    padding: 15px;
    border-left: $border;

    pre {
      font-family: "Noto Sans KR", "Montserrat", Helvetica, Arial, sans-serif;
      white-space: pre-wrap;
    }
  }
  .item-box {
    border-left: $border;
    border-right: $border;
    display: flex;
    .item-box-check {
      flex: 1;
      justify-content: center !important;
    }
    .item-box-check:nth-child(2) {
      border-left: $border;
      border-right: $border;
    }
  }
  .item-area {
    padding: 5px;
    align-self: center;
  }
}
.row-content__body-item ~ .row-content__body-item {
  border-top: $border;
}
.vs-component.vs-con-textarea.vs-textarea-primary {
  margin: 0;
}
.row-content-none-data {
  height: 120px;
  border-bottom: $border;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
