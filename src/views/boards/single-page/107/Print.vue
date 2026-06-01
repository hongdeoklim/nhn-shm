<template>
  <div>
    <table>
      <tbody>
        <tr>
          <td rowspan="2" class="title">안전·보건 교육일지</td>
          <td rowspan="2" class="titleCell bordered" style="width: 33px; border-bottom: 0">결<br /><br /><br />재</td>
          <td class="titleCell signTitle bordered">{{ approval1 }}</td>
          <td class="titleCell signTitle bordered">{{ approval2 }}</td>
        </tr>
        <tr>
          <td class="signBody bordered p-1">
            <img v-if="form.sign1" :src="form.sign1.sign" class="w-full" />
          </td>
          <td class="signBody bordered p-1">
            <img v-if="form.sign1" :src="form.sign2.sign" class="w-full" />
          </td>
        </tr>
      </tbody>
    </table>
    <table class="contentTable" style="page-break-after: always">
      <tbody>
        <tr>
          <td colspan="2" class="titleCell">현장명</td>
          <td colspan="5">{{ form.stdInfo && form.stdInfo.field_name }}</td>
          <td colspan="2" class="titleCell">교육일시</td>
          <td colspan="5">{{ form.inputA_4 }}, {{ form.inputA_5 }} ~ {{ form.inputA_6 }}</td>
        </tr>
        <tr>
          <td colspan="2" class="titleCell">교육구분</td>
          <td colspan="5">{{ form.inputA_1 && form.inputA_1.value }}</td>
          <td colspan="2" class="titleCell">교육대상자</td>
          <td colspan="5">{{ form.교육대상자 }}</td>
        </tr>
        <tr>
          <td colspan="2" class="titleCell">대상(작업명)</td>
          <td colspan="12">{{ form.inputA_2 && form.inputA_2.value }}</td>
        </tr>
        <tr>
          <td class="titleCell" rowspan="4" colspan="2">교육인원</td>
          <td colspan="3" class="titleCell">구분</td>
          <td colspan="3" class="titleCell">계</td>
          <td colspan="3" class="titleCell">남</td>
          <td colspan="3" class="titleCell">여</td>
        </tr>
        <tr v-for="data in form.교육인원">
          <td colspan="3" class="titleCell">{{ data.type }}</td>
          <td colspan="3" style="text-align: center;">{{ data.sum | comma }}</td>
          <td colspan="3" style="text-align: center;">{{ data.male | comma }}</td>
          <td colspan="3" style="text-align: center;">{{ data.female | comma }}</td>
        </tr>
        <tr class="print-container">
          <td class="titleCell" colspan="2">교육내용</td>
          <td colspan="12">
            <div style="min-height: 300px">
              <p class="print-textarea border-0 rounded-none p-0 mb-0 min-h-0">
                {{ form.inputA_15 }}
              </p>
            </div>
          </td>
        </tr>
        <tr>
          <td class="titleCell" rowspan="2" colspan="2">교육강사명 및 장소</td>
          <td colspan="3" class="titleCell">직책</td>
          <td colspan="3" class="titleCell">성명</td>
          <td colspan="3" class="titleCell">교육장소</td>
          <td colspan="3" class="titleCell">비고</td>
        </tr>
        <tr>
          <td colspan="3" style="text-align: center;">{{ form.inputA_11 }}</td>
          <td colspan="3" style="text-align: center;">{{ form.inputA_9 }}</td>
          <td colspan="3" style="text-align: center;">{{ form.inputA_7 }}</td>
          <td colspan="3" style="text-align: center;">{{ form.inputA_17 }}</td>
        </tr>
        <tr class="print-container">
          <td class="titleCell" colspan="2">특이사항</td>
          <td colspan="12">
            <div style="min-height: 300px">
              <p class="print-textarea border-0 rounded-none p-0 mb-0 min-h-0">
                {{ form.inputA_18 }}
              </p>
            </div>
          </td>
        </tr>

        <tr>
          <td style="height: 0; border: 0">
            <!--colspan 깨지지 않도록 하기 위한 빈칸-->
          </td>
          <td style="height: 0; border: 0">
            <!--colspan 깨지지 않도록 하기 위한 빈칸-->
          </td>
          <td style="height: 0; border: 0">
            <!--colspan 깨지지 않도록 하기 위한 빈칸-->
          </td>
          <td style="height: 0; border: 0">
            <!--colspan 깨지지 않도록 하기 위한 빈칸-->
          </td>
          <td style="height: 0; border: 0">
            <!--colspan 깨지지 않도록 하기 위한 빈칸-->
          </td>
          <td style="height: 0; border: 0">
            <!--colspan 깨지지 않도록 하기 위한 빈칸-->
          </td>
          <td style="height: 0; border: 0">
            <!--colspan 깨지지 않도록 하기 위한 빈칸-->
          </td>
          <td style="height: 0; border: 0">
            <!--colspan 깨지지 않도록 하기 위한 빈칸-->
          </td>
          <td style="height: 0; border: 0">
            <!--colspan 깨지지 않도록 하기 위한 빈칸-->
          </td>
          <td style="height: 0; border: 0">
            <!--colspan 깨지지 않도록 하기 위한 빈칸-->
          </td>
          <td style="height: 0; border: 0">
            <!--colspan 깨지지 않도록 하기 위한 빈칸-->
          </td>
          <td style="height: 0; border: 0">
            <!--colspan 깨지지 않도록 하기 위한 빈칸-->
          </td>
          <td style="height: 0; border: 0">
            <!--colspan 깨지지 않도록 하기 위한 빈칸-->
          </td>
          <td style="height: 0; border: 0">
            <!--colspan 깨지지 않도록 하기 위한 빈칸-->
          </td>
        </tr>
      </tbody>
    </table>

    <!--참석자 명단-->
    <h1 class="titleFull">안전·보건교육 참석자 명단</h1>
    <div class="label-text" style="width: 100%">현장명 : {{ form.stdInfo.field_name }}</div>
    <div class="label-text" style="width: 100%">일　시 : {{ form.inputA_4 }}, {{ form.inputA_5 }} ~ {{ form.inputA_6 }}</div>
    <div class="label-text" style="width: 100%">장　소 : {{ form.inputA_7 }}</div>

    <table style="margin-top: 24px" class="pageBreak">
      <tr>
        <td style="width: 50%; padding-right: 5px">
          <table class="attendeeTable">
            <tbody>
            <tr>
              <td colspan="6">도 급 인</td>
            </tr>
              <tr>
                <td class="titleCell">No.</td>
                <td class="titleCell">소속</td>
                <td class="titleCell">직책</td>
                <td class="titleCell">성명</td>
                <td class="titleCell">서명</td>
                <td class="titleCell">비고</td>
              </tr>
              <tr v-for="index in 20" :key="index">
                <td>{{ index }}</td>
                <td>
                  {{ typeof form.signatureList[index - 1] !== "undefined" ? form.signatureList[index - 1].target : "" }}
                </td>
                <td>
                  {{ signatureList(form.signatureList, index-1, 'type') }}
                </td>
                <td>
                  {{ typeof form.signatureList[index - 1] !== "undefined" ? form.signatureList[index - 1].name : "" }}
                </td>
                <td style="width: 1%; white-space: nowrap; min-width: 90px; padding: 2px">
                  <img v-if="!!form.signatureList[index - 1]" height="50" :src="form.signatureList[index - 1].sign" />
                </td>
                <td>
                  {{ typeof form.signatureList[index - 1] !== "undefined" ? form.signatureList[index - 1].note : "" }}
                </td>
              </tr>
            </tbody>
          </table>
        </td>
        <!-- <td style="width: 10px;"></td> -->
        <td style="width: 50%; padding-left: 5px">
          <table class="attendeeTable">
            <tbody>
            <tr>
              <td colspan="6">수 급 인</td>
            </tr>
              <tr>
                <td class="titleCell">No.</td>
                <td class="titleCell">소속</td>
                <td class="titleCell">직책</td>
                <td class="titleCell">성명</td>
                <td class="titleCell">서명</td>
                <td class="titleCell">비고</td>
              </tr>
              <tr v-for="index in 20" :key="index">
                <td>{{ index }}</td>
                <td>
                  {{ !!form.signatureList2[index - 1] ? form.signatureList2[index - 1].target : "" }}
                </td>
                <td>
                  {{ signatureList(form.signatureList2, index-1, 'type') }}
                </td>
                <td>
                  {{ !!form.signatureList2[index - 1] ? form.signatureList2[index - 1].name : "" }}
                </td>
                <td style="width: 1%; white-space: nowrap; min-width: 90px; padding: 2px">
                  <img v-if="!!form.signatureList2[index - 1]" height="50" :src="form.signatureList2[index - 1].sign" />
                </td>
                <td>
                  {{ !!form.signatureList2[index - 1] ? form.signatureList2[index - 1].note : "" }}
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </table>

    <!-- 사진대지 -->
    <photo-upload-grid-module v-model="form.photoList" :is-print="true" :customTitle="true" section-title="사진대지" placeholder="점검 현장 사진">
      <template #customTitle>
        <div style="font-size: 24px; font-weight: bold; text-align: center; line-height: 110px">안전교육 사진대지</div>
      </template>
    </photo-upload-grid-module>
  </div>
</template>

<script>
export default {
  name: "Print107",
  props: {
    board: Object,
    form: Object,
  },
  filters: {
    comma(val) {
      return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
  computed: {
    projectId() {
      return parseInt(this.$route.params.proj_id);
    },
    approval1() {
      return this.projectId !== 7 ? "안전관리자" : "관리감독자";
    },
    approval2() {
      return this.projectId !== 7 ? "관리책임자" : "관리책임자";
    },
  },
  methods: {
    signatureList(list, index, key) {
      if (list.length === 0) return ''
      const data = list[index]
      if (data) {
        return data[`${key}_${data[key]}`] ? data[`${key}_${data[key]}`] : data[key];
      }
      return ''
    },
  }
};
</script>

<style lang="scss" scoped>
$border-color: #cdcdcd;
$approval-border: 2px solid #cdcdcd;
$title-bg-color: #f9f9f9;
.bordered {
  border: 1px solid $border-color;
}
.titleCell {
  background-color: $title-bg-color;
  text-align: center;
}
.title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
}
.titleFull {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  width: 100%;
  height: 110px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;

  .signTitle {
    width: 125px;
    height: 38px;
  }
  .signBody {
    height: 100px;
    border-bottom: 0;
  }
}
.contentTable {
  td {
    border: 1px solid $border-color;
    padding: 19px 14px;
  }
  .titleCell {
    width: 180px;
    padding: 19px 0;
    font-size: 14px;
    font-weight: 500;
  }
}
.label-text {
  width: 114px;
  font-weight: 500;
  font-size: 14px;
}

.attendeeTable {
  td {
    height: 55px;
    border: 1px solid $border-color;
    text-align: center;
  }
}

.photoWrap {
  .photoContainer {
    display: flex;
    justify-content: center;
    width: 100%;
    border-radius: 6px;
    border: solid 1px $border-color;
  }
}
.photoWrap:nth-child(2n) {
  page-break-after: always;
}
img {
  -webkit-print-color-adjust: exact;
}
.pageBreak {
  page-break-after: always;
}
</style>
