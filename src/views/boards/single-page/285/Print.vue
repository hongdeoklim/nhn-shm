<template>
  <div class="print">
    <div class="contents">
      <div class="title">
        <span>안전보건관리(총괄)책임자 선임(지정)보고서</span>
      </div>

      <div class="data">
        <!-- 본사 -->
        <div class="label row-span-2">본사</div>
        <div class="label">① 사 업 장 명</div>
        <div class="col-span-2">{{ form.inputB_1 }}</div>
        <div class="label">② 사업주 또는 대표자</div>
        <div class="col-span-2">{{ form.inputB_2 }}</div>
        <div class="label">③ 소 재 지</div>
        <div class="col-span-5">{{ form.inputB_4 }}</div>

        <!-- 현장개요 -->
        <div class="label row-span-7">현장개요</div>
        <div class="label">④ 현 장 명</div>
        <div class="col-span-2">{{ form.selectField ? form.selectField.field_name : '' }}</div>
        <div class="label">⑤ 발주자 또는 도급인</div>
        <div class="col-span-2">{{ form.inputC_2 }}</div>
        <div class="label">⑥ 소 재 지</div>
        <div class="col-span-5">{{ form.inputC_3 }}</div>
        <div class="label">⑦ 공 사 기 간</div>
        <div class="col-span-2">{{ form.inputC_5 }} ~ {{ form.inputC_6 }}</div>
        <div class="label">⑧ 공사금액 (상시근로자수)</div>
        <div class="col-span-2">{{ form.inputC_10 }}</div>
        <div class="label">⑨ 굴착깊이(M)</div>
        <div class="col-span-2">{{ form.inputC_11 }}</div>
        <div class="label">
          <div class="flex items-start">
            <span>⑩</span><span class="w-full pl-1">건축물·공작물의<br>최대높이(M)</span>
          </div>
        </div>
        <div class="col-span-2">{{ form.inputC_12 }}</div>
        <div class="label">⑪ 건축물의 연면적(㎡)</div>
        <div class="col-span-2">{{ form.inputC_13 }}</div>
        <div class="label">⑫ 건축물의 최대층고(M)</div>
        <div class="col-span-2">{{ form.inputC_14 }}</div>
        <div class="label">⑬ PC조립작업 유무</div>
        <div class="col-span-2">{{ form.inputC_15 }}</div>
        <div class="label">⑭ 교량의 최대 지간길이(M)</div>
        <div class="col-span-2">{{ form.inputC_16 }}</div>
        <div class="label">⑮ 터널길이(M)</div>
        <div class="col-span-2">{{ form.inputC_17 }}</div>
        <div class="label">
          <div class="flex items-start">
            <span>⑩</span><span class="w-full pl-1">댐의 용도 및<br>저수용량(TON)</span>
          </div>
        </div>
        <div class="col-span-2">{{ form.inputC_18 }}</div>

        <!-- 구분 / 내역 -->
        <div class="label col-span-2">구분 / 내역</div>
        <div class="label">⑰ 성 명</div>
        <div class="label">⑱ 자격/면허번호</div>
        <div class="label">⑲ 선임 등 연월일</div>
        <div class="label">⑳ 직위 및 직책</div>
        <div class="label">㉑ 전담·겸임구분</div>

        <!-- ㉒ 안전보건관리(총괄)책임자 -->
        <div class="label col-span-2">㉒ 안전보건관리(총괄)책임자</div>
        <div class="">{{ form.inputD_1 }}</div>
        <div class="">{{ form.inputD_4 }}</div>
        <div class="">{{ form.inputD_5 }}</div>
        <div class="">{{ form.inputD_3 }}</div>
        <div class="">{{ form.inputD_6 }}</div>
      </div>

      <div class="sign">
        <div class="body">
          <div class="px-8 text-center sign-info">
            「산업안전보건법 시행령」 제14조, 동법 제52조에 따라 위와 같이<br>
            안전보건관리(총괄)책임자를 선임(지정)합니다.
          </div>
          <div class="yyyyMMdd p-8" >
            <span class="year pr-6 sign-info">{{ new Date(form.inputD_5).format('yyyy') }} 년</span>
            <span class="month pr-6 sign-info">{{ new Date(form.inputD_5).format('MM') }} 월</span>
            <span class="day sign-info">{{ new Date(form.inputD_5).format('dd') }} 일</span>
          </div>
          <div class="sign-bar">
            <span class="sign-info" style="margin-right: 20px;">보고인(사업주 또는 대표자)</span>
            <span style="font-size: 23px; font-weight: 500; margin-right: 42px;">{{form.companyInfo.com_name ? form.companyInfo.com_name : form.inputB_1 }}</span>
<!--            <span style="font-size: 20px; font-weight: 500; margin: 0 42px;">{{form.companyInfo.com_ceo}}</span>-->
            <div class="sign-info" style="position: relative;">
              <span>(서명 또는 인)</span>
              <img :src="form.inputB_5" width="80" />
            </div>
          </div>
        </div>
      </div>

      <div class="etc p-8">
        <div class="item">
          <span class="mr-2">※ 첨부서류</span><span>1. 자격ㆍ학력 또는 경력 등을 증명할 수 있는 서류</span><br>
          <span class="mr-2 opacity-0">※ 첨부서류</span><span>2. 재직증명서</span><br>
          <span class="mr-2 opacity-0">※ 첨부서류</span><span>3. 직무교육 이수증(안전보건관리책임자 교육이수증)</span>
        </div>
        <div>
          ※ ⑨～⑯란은 원수급인인 경우에만 해당합니다.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Print',
  props: {
    form: Object,
  }
}
</script>

<style lang="scss" scoped>
.row-span-7 {
  grid-row: span 7 / span 7 !important;
}
.print {
  & > .contents {
    display: grid !important;
    width: 100%;
    height: auto;

    border: 1px solid #cdcdcd;
    border-right: none;

    & > .data{
      display: grid;
      grid-template-columns: 180px 180px minmax(100px, 1fr) minmax(140px, 1fr) 200px minmax(140px, 1fr) minmax(140px, 1fr);
      grid-template-rows: repeat(11, 70px);

      align-items: center;

      & > div {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;

        padding-left: 16px;
        padding-right: 16px;

        border-bottom: 1px solid #cdcdcd;
        border-right: 1px solid #cdcdcd;
      }
    }

    & > .etc {
      border-top: 1px solid #cdcdcd;
    }
  }
}
.label {
  background: #f9f9f9;
}
.title {
  padding-top: 32px;
  padding-bottom: 32px;
  border-bottom: 1px solid #cdcdcd;
  border-right: 1px solid #cdcdcd;

  display: grid;
  align-items: center;
  justify-content: center;

  font-size: 32px;
  font-weight: bold;
}
.sign {
  padding-top: 32px;
  padding-bottom: 32px;

  border-right: 1px solid #cdcdcd;

  display: grid;
  justify-content: center;

  .body {
    color: #3c3c3c;
    font-weight: 500;

    .yyyyMMdd {
      display: flex;
      justify-content: center;
    }

    .sign-bar {
      display: flex;
      align-items: baseline;

      img {
        position: absolute;
        left: 0;
        top: 0;
        transform: translate(30%, -30%);
      }
    }
  }
}
.etc {
  border-right: 1px solid #cdcdcd;
}
.sign-info {
  font-size: 17px;
}
</style>
