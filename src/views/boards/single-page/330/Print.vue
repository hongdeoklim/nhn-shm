<template>
  <div class="print">
    <div class="contents">
      <div class="title">
        <span style="text-decoration: underline; text-decoration-thickness: 3px; text-underline-offset: 6px;">위 임 장</span>
      </div>
      <div style="margin-top: 20px; text-align: center;">
        <span style="font-size: 28px;">(안전 및 보건에 관한 협의체 참석)</span>
      </div>

      <div class="table-container">
        <table>
          <thead>
          <tr>
            <th width="33%">구 분</th>
            <th width="33%">직 책</th>
            <th width="33%" colspan="2">성 명</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>위임받는 자</td>
            <td>{{ form.inputC_2 }}</td>
            <td style="border-right: none;">{{ form.inputC_3 }}</td>
            <td width="12%" style="border-left: none;" class="sign-cell" :style="{backgroundImage: form.inputC_4 ? `url(${form.inputC_4})` : ''}"></td>
          </tr>
          <tr>
            <td>위임하는 자</td>
            <td>{{ form.inputD_2 }}</td>
            <td style="border-right: none;">{{ form.inputD_3 }}</td>
            <td style="border-left: none;" class="sign-cell" :style="{backgroundImage: form.inputD_4 ? `url(${form.inputD_4})` : ''}"></td>
          </tr>
          </tbody>
        </table>
      </div>

      <div class="message" style="padding-top: 30px; margin-bottom: 580px;">
        <p>위 사람을 본인의 대리인으로 정하여 「안전 및 보건에 관한 협의체」에 참석하고자 합니다.</p>
      </div>


      <div class="sign">
        <div class="yyyyMMdd p-8" >
          <span class="year pr-6">{{ form.headerYear }} 년</span>
          <span class="month pr-6">{{ form.headerMonth }} 월</span>
          <span class="day">{{ form.headerDay }} 일</span>
        </div>

        <div class="body">
          <p>{{ form.companyName }} {{ form.inputB_2 }} <span class=" px-8">{{ form.inputB_3 }}</span> <span class="sign-container">(서명 또는 인) <img :src="form.inputB_4" width="100" /></span></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Print330',
  props: {
    border: Object,
    form: Object,
  }
}
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

  display: grid;
  align-items: center;
  justify-content: center;

  font-size: 3rem;
  font-weight: bold;
}

.table-container {
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;

    th, td {
      height: 64px;
      text-align: center;
      border: 1px solid #757575;
      font-size: 24px;
    }
    th {
      background-color: #ececec;
    }
  }
}
.sign-cell {
  background-size: contain;
  background-position: left center;
  background-repeat: no-repeat;
}
.sign-container {
  position: relative;

  img {
    position: absolute;
    right: 0;
    bottom: 0;
    transform: translateX(100%);
  }
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
</style>
