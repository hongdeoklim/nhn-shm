<template>
  <div class="print">
    <div class="contents">
      <div class="title">
        <span>관 리 감 독 자<span class="mx-6"></span>지 정 서</span>
      </div>

      <div class="userInfo">
        <p>소 속 : {{ form.inputE_2 }}</p>
        <p>직 책 : {{ form.inputE_3 }}</p>
        <p>성 명 : {{ form.inputE_1 }}</p>
      </div>

      <div class="message">
        <p class="mb-8">위 사람을 산업안전보건법 제16조 및 동법 시행령 제15조에 의거 아래와 같은 안전관리에 대한 업무를 수행할 수 있도록 당사의 관리감독자로 지정합니다.</p>
        <p class="mt-8">※ 관리감독자 업무</p>
        <p>1. 기계 또는 설비의 안전·보건점검 및 이상유무의 확인</p>
        <p>2. 소속 근로자의 작업복·보호구 및 방호장치의 점검과 그 착용·사용에 관한 교육·지도</p>
        <p>3. 발생한 산업재해에 관한 보고 및 이에 대한 조치</p>
        <p>4. 소속 작업장의 정리정돈 및 통로확보의 확인·감독</p>
        <p>5. 당사 안전관리자, 보건관리자, 산업보건의의 지도·조언에 대한 협조</p>
        <p>6. 위험성평가에 관한 다음 각 목의 업무</p>
        <p class="sub">1) 유해·위험요인의 파악에 대한 참여</p>
        <p class="sub">2) 개선조치의 시행에 대한 참여</p>
        <p>7. 해당 업체 근로자의 안전보건교육 이수여부(건설업 기초교육이수증)의 감독</p>
        <p>8. 그 밖에 해당작업의 안전 및 보건에 관한 사항으로서 고용노동부령으로 정하는 사항</p>
      </div>

      <div class="sign">
        <div class="yyyyMMdd p-8">
          <span class="year pr-6">{{ new Date(form.inputE_5).format("yyyy") }} 년</span>
          <span class="month pr-6">{{ new Date(form.inputE_5).format("MM") }} 월</span>
          <span class="day">{{ new Date(form.inputE_5).format("dd") }} 일</span>
        </div>

        <div class="body flex items-center">
          {{ form.inputD_2 }} {{ form.inputD_3 }} <span class="px-8">{{ form.inputD_1 }}</span>
          <div class="flex items-center justify-center relative">
            <span class="signContainer1" style="color: #999999">(서명 또는 인) </span>
            <img v-if="!!form.inputD_6" :src="form.inputD_6" width="160" class="absolute" style="object-fit: contain" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Print",
  props: {
    border: Object,
    form: Object,
  },
};
</script>

<style lang="scss" scoped>
.print {
  padding: 2rem 1rem;

  & > .contents {
    display: grid !important;
    width: 100%;
    height: auto;

    border: 1px solid #cdcdcd;

    padding: 2rem;
  }
}
.title {
  padding-top: 2rem;
  padding-bottom: 2rem;
  margin-bottom: 2rem;

  display: grid;
  align-items: center;
  justify-content: center;

  font-size: 3rem;
  font-weight: bold;
}

.userInfo {
  display: grid;
  justify-content: flex-end;
  margin-bottom: 1.25rem;

  & > p {
    width: 400px;

    font-size: 1.5rem;
    font-weight: 500;

    padding: 1rem 0;
    margin-bottom: 1rem;
  }
}

.message {
  p {
    font-size: 1.5rem;
    font-weight: 500;
    line-height: 3.125rem;

    &.sub {
      padding-left: 1.5rem;
      font-size: 1.375rem;
      font-weight: 400 !important;
      line-height: 2.875rem;
    }
  }
}

.sign {
  padding-top: 32px;

  display: grid;
  justify-content: center;

  .yyyyMMdd {
    display: flex;
    justify-content: center;
    font-size: 1.6875rem;

    margin-bottom: 4rem;
  }

  .body {
    font-size: 1.75rem;
    color: #3c3c3c;
    text-align: center;
    line-height: 2.75rem;
  }

  .etc {
    margin-top: 2rem;
    text-align: center;

    font-size: 1.125rem;
    color: #3c3c3c;
    line-height: 2rem;
    text-decoration: underline;
  }
}

.signContainer1 {
  position: relative;

  img {
    position: absolute;
    right: 0;
    bottom: 0;
    transform: translate(100%, 0);
  }
}
.signContainer2 {
  position: relative;

  img {
    position: absolute;
    right: 0;
    top: 0;
    transform: translate(100%, 0);
  }
}
</style>
