<template>
  <div>
    <div class="header">재 발 방 지 조 치 &nbsp; 보 고 서</div>
    <div class="content">
      <div class="content-table">
        <table>
          <tbody>
            <tr>
              <th>현장명</th>
              <td colspan="5">{{ form.stdInfo.field_name }}</td>
              <th>담당자</th>
              <td>{{ form.stdInfo.writer_name }}</td>
            </tr>
            <tr>
              <th>재해자 성명</th>
              <td>{{ form.inputB_1 }}</td>
              <th>연령</th>
              <td>{{ form.inputB_2 }}</td>
              <th>하수급인<br />승인여부</th>
              <td>{{ form.inputB_4 }}</td>
              <th>소속사</th>
              <td>{{ form.companyName }}</td>
            </tr>

            <tr>
              <th>주소, 연락처</th>
              <td v-if="form.inputB_5 || form.inputB_6" colspan="7">{{ `${form.inputB_5}${form.inputB_5 && form.inputB_6 ? ", " : ""}` }}{{ form.inputB_6 }}</td>
              <td v-else colspan="7" style="color: #9ca0a4">(직영근로자인 경우에만 기재)</td>
            </tr>

            <tr>
              <th>사고일시</th>
              <td colspan="7">{{ form.inputB_7 }}, {{ form.inputB_8 }}</td>
            </tr>

            <tr>
              <th>재해장소</th>
              <td colspan="7">{{ form.inputB_9 }}</td>
            </tr>

            <tr>
              <th>사고원인</th>
              <td colspan="7">
                <span class="w-full" style="min-height: 350px; padding: 7px; text-align: start; float: inline-start;" v-html="text(form.inputB_11)" />
              </td>
            </tr>

            <tr>
              <th>재발방지조치</th>
              <td colspan="7">
                <span class="w-full" style="min-height: 350px; padding: 7px; text-align: start; float: inline-start;" v-html="text(form.inputB_12)" />
              </td>
            </tr>

            <tr>
              <th>잔존 유해<br />위험 요인<br />조치 계획</th>
              <td colspan="7">
                <span class="w-full" style="min-height: 350px; padding: 7px; text-align: start; float: inline-start;" v-html="text(form.inputB_13)" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 사진대지 -->
    <photo-upload-grid-module v-model="form.photoList" :is-print="true" :customTitle="true" section-title="사진대지" placeholder="점검 현장 사진">
      <template #customTitle>
        <div style="font-size: 24px; font-weight: 700; line-height: 35px; padding-bottom: 16px">□ 사진대지</div>
      </template>
    </photo-upload-grid-module>
  </div>
</template>

<script>
export default {
  name: "Print308",
  props: {
    form: Object,
    board: Object,
  },
  methods: {
    getCheckBoxUrl(checked) {
      if (checked) {
        return `@/assets/images/print/print_check_checked.svg`;
      } else {
        return `@/assets/images/print/print_check_unchecked.svg`;
      }
    },

    // 들여쓰기등 변환
    text(value) {
      return value.replaceAll(/(\n|\r\n)/g, "<br>");
    },
  },
};
</script>

<style lang="scss" scoped>
$border-color: #cdcdcd;
.header {
  font-size: 24px;
  font-weight: bold;
  color: #000;
  text-align: center;
  padding: 20px 0;
}
.content {
  margin-top: 20px;

  .content-title {
    font-size: 24px;
    font-weight: 700;
    line-height: 35px;
    margin-bottom: 16px;
  }
  .content-table {
    table {
      width: 100%;
      table-layout: fixed;
      border-collapse: collapse;
      margin-bottom: 40px;

      th,
      td {
        border: 1px solid #757575;
        text-align: center;
        min-height: 60px;
        height: 60px;
        font-size: 18px;
      }
      th {
        background-color: #ececec;
        font-weight: 500;
        padding: 0;
        word-break: keep-all;
      }
      td {
        min-width: 50px;
        word-break: keep-all;
        img {
          display: inline-block;
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
  .textareaCell {
    min-height: 190px;
    display: inline-flex;
    align-items: center;
  }
  .signCell {
    background-position: center center;
    background-size: contain;
    background-repeat: no-repeat;
  }
  .photoWrap {
    .photoContainer {
      display: flex;
      justify-content: center;
      width: 100%;
      border-radius: 6px;
      border: dashed 1px $border-color;
      break-inside: avoid;
    }
  }
}
.print-break {
  break-inside: avoid;
}
.print-break-page {
  page-break-before: always;
}
</style>
