<template>
  <div class="mt-component-form print-container">
    <vs-row  v-if="isShowTitle">
      <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
        <h5 style="display: inline-flex; align-items: center;"><i class="dot"></i> {{title}} <span v-if="isShowDialog" class="ml-4 infoBtn" @click="openDialog"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M0 9C0 4.03318 4.02707 0.00250244 9 0.00250244C13.9729 0.00250244 18 4.03318 18 9C18 13.9668 13.9729 17.9975 9 17.9975C4.02707 17.9975 0 13.9668 0 9ZM9 1.99749C5.13637 1.99749 2 5.13026 2 9C2 12.8697 5.13637 16.0025 9 16.0025C12.8636 16.0025 16 12.8697 16 9C16 5.13026 12.8636 1.99749 9 1.99749Z" fill="#7E72F2"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M9 3.27307C9.55228 3.27307 10 3.71966 10 4.27057V9.25803C10 9.80893 9.55228 10.2555 9 10.2555C8.44772 10.2555 8 9.80893 8 9.25803V4.27057C8 3.71966 8.44772 3.27307 9 3.27307Z" fill="#7E72F2"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M9 11.253C9.55228 11.253 10 11.6996 10 12.2505L10 13.248C10 13.7989 9.55228 14.2455 9 14.2455C8.44772 14.2455 8 13.7989 8 13.248L8 12.2505C8 11.6996 8.44772 11.253 9 11.253Z" fill="#7E72F2"/>
</svg>
 자체평가 시 작성요령</span></h5>
      </vs-col>
    </vs-row>

    <table style="width:100%;" id="formTable" class="mt-4">
      <thead>
      <tr>
        <th>{{tableHeaderColumn1}}</th>
        <th>{{tableHeaderColumn2}}</th>
        <th>{{tableHeaderTitle}}</th>
        <th>{{tableHeaderYes}}</th>
        <th>{{tableHeaderNo}}</th>
        <th>{{tableHeaderNa}}</th>
        <th v-if="isNote">{{tableHeaderNote}}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(row, indexRows) in tableRows" :key="indexRows">
        <td v-if="row.isTitle" colspan="7" class="title">{{row.label}}</td>

        <td v-if="!row.isTitle" class="center" >{{row.num}}</td>
        <td v-if="!row.isTitle" class="center" >{{row.subLabel}}</td>
        <td v-if="!row.isTitle" >{{row.label}}</td>
        <td v-if="!row.isTitle" class="center" >
          <div class="item-box">
            <template v-if="isPrint">
              <div class="item-box-check" v-if="row.is_checked === 'Yes'" style="text-align: center;  align-self: center;">
                <vs-icon icon="check" size="small"  ></vs-icon>
              </div>
              <div v-else class="item-box-check">
              </div>
            </template>
            <vs-checkbox
              v-else
              class="item-box-check"
              :disabled="isReadonly"
              :checked="row.is_checked === 'Yes'"
              @change="checkForm($event, row.listIndex, 'Yes')"
            ></vs-checkbox>
          </div>
        </td>
        <td v-if="!row.isTitle" class="center" >
          <div class="item-box">
            <template v-if="isPrint">
              <div class="item-box-check" v-if="row.is_checked === 'No'" style="text-align: center;  align-self: center;">
                <vs-icon icon="check" size="small"  ></vs-icon>
              </div>
              <div v-else class="item-box-check">
              </div>
            </template>
            <vs-checkbox
              v-else
              class="item-box-check"
              :disabled="isReadonly"
              :checked="row.is_checked === 'No'"
              @change="checkForm($event, row.listIndex, 'No')"
            ></vs-checkbox>
          </div>
        </td>
        <td v-if="!row.isTitle" class="center" >
          <div class="item-box">
            <template v-if="isPrint">
              <div class="item-box-check" v-if="row.is_checked === 'N/A'" style="text-align: center;  align-self: center;">
                <vs-icon icon="check" size="small"  ></vs-icon>
              </div>
              <div v-else class="item-box-check">
              </div>
            </template>
            <vs-checkbox
              v-else
              class="item-box-check"
              :disabled="isReadonly"
              :checked="row.is_checked === 'N/A'"
              @change="checkForm($event, row.listIndex, 'N/A')"
            ></vs-checkbox>
          </div>
        </td>
        <td v-if="!row.isTitle" class="item-note" style="padding: 5px !important;" >
          <span v-if="isPrint" class="print-input"> {{row.note}} </span>
          <ml-input v-else class="w-full flex-1" v-model="row.note" @change="updateNote($event, row.listIndex, row.note)"  :readonly="isReadonly"/>
        </td>
      </tr>
      <tr v-if="footer">
        <td colspan="7" class="title">{{footer}}</td>
      </tr>
      </tbody>
    </table>

    <vs-popup class="popupSearchField" title="자체평가 시 작성요령" :active.sync="showPopup">
      <table style="border-collapse: collapse; width: 100%;">
        <tbody>
        <tr><th>증빙자료 첨부</th></tr>
        <tr><td><strong>반드시 증빙자료 첨부한 사항에 대해서만 자체평가 점수 인정</strong></td></tr>
        <tr><td>
          <strong>인정 가능한 증빙자료</strong>
          <ol>
            <li>연번 1~3 : 대상 기계·기구 보유현황 및 점검일지, 안전검사필증, 점검활동 사진 등</li>
            <li>연번 4~6 : 보호구지급대장, 대상 기계·기구 보유현황, 보호구 착용 등 활동 사진 등</li>
            <li>연번 7~9 : 산업재해 발생 대응 매뉴얼(담당자 표시된 것), 산업재해조사표 등의 기록 등</li>
            <li>연번 10~11 : 현장순회활동 사진, 비상구 안전보건표지 부착 사진 등</li>
            <li>연번 12 : 지도·조언 시 조치결과 보고서 등 (12번항목은 중대재해예방실에서 업무협조도를 참조하여 평가)</li>
            <li>연번 13~18 : 위험성평가 실무 교육 참석사진, 사후조치 자료사진 등</li>
            <li>연번 19~20 : 업무분장 등 안전보건업무담당자를 알 수 있는 자료</li>
            <li>연번 22 : 서류철 사진 등</li>
            <li>연번 23~29 : 해당 세부내용 자체점검</li>
            <li>연번 30~33 : 교육일지, 교육 이수증</li>
            <li>연번 35 : 사후관리 관련하여 보고서 등</li>
            <li>연번 36~38 : 개선조치 결과보고서(사진첨부)</li>
            <li>연번 39 : 근골격계 유해요인조사 결과보고서</li>
            <li>연번 40 : 보건조치 관련 사진, 기록, 보고서 등</li>
            <li>연번 41~43 : 개선조치 관련 사진 또는 결과보고서 등</li>
            <li>연번 44 : 작업측정결과보고서, 작업측정 사후조치 보고서(관련 사진 첨부) 등</li>
          </ol>
        </td></tr>
        </tbody>
      </table>
    </vs-popup>
  </div>


</template>

<script>
export default {
  name: 'TableInspectColumn7',
  props: {
    isPrint: Boolean,
    isReadonly: Boolean,
    /**
     * 테이블 상단에 동그라미(●) 제목을 표시할지 여부
     */
    isShowTitle: Boolean,
    isShowDialog: Boolean,
    /**
     * 가장 오른쪽 열에 "비고" 칸을 표시할지 여부
     */
    isNote: Boolean,
    title: String,
    tableHeaderColumn1: {
      type: String,
      default: 'No.',
    },
    tableHeaderColumn2: {
      type: String,
      default: '관계법령',
    },
    tableHeaderTitle: { type: String, default: '점검내용' },
    tableHeaderYes: { type: String, default: 'Yes' },
    tableHeaderNo: { type: String, default: 'No' },
    tableHeaderNa: { type: String, default: 'N/A' },
    tableHeaderNote: { type: String, default: '비고' },
    footer: String,
    value: Array
  },
  data() {
    return {
      tableRows: [],
      showPopup: false,
    }
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler(value) {
        if (value) {
          let lastTitle = '';
          let index = 0;
          this.tableRows = [];
          for (const row of value) {
            if (lastTitle !== row.title) {
              lastTitle = row.title;
              this.tableRows.push({
                listIndex: index,
                isTitle: true,
                label: row.title,
              });
            }

            this.tableRows.push({
              listIndex: index,
              isTitle: false,
              label: row.label,
              num: row.col1,
              subLabel: row.col2,
              is_checked: row.is_checked,
              note: row.note,
            });
            index += 1;
          }
        }
      },
    },
  },
  methods: {
    checkForm (event, indexRows, text) {
      const row = this.value[indexRows];
      row.is_checked = event.target.checked ? text : '';
      this.$set(this.value, indexRows, row);
    },

    updateNote (value, indexRows, text) {
      const row = this.value[indexRows];
      row.note = text;
      this.$set(this.value, indexRows, row);
    },

    openDialog() {
      this.showPopup = true;
    }
  },
}
</script>

<style scoped lang="scss">
$border: 1px solid #cdcdcd;
$bg: #f9f9f9;
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
  margin: 0;
}

#formTable {
  border-collapse: collapse;

  th, td {
    border: $border;
    padding: 14px !important;
    font-size: 14px;
    color: #3c3c3c;

    &.title {
      background-color: $bg;
      font-weight: bold;
    }
  }
  tr td:nth-child(2) {
    white-space: pre;
  }
  tr td:nth-child(3) {
    white-space: pre-line;
    word-break: keep-all;
  }

  th {
    background-color: $bg;
    text-align: center;
  }

  .center {
    text-align: center;
  }

  .item-box {
    display: flex;

    .row-title {
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      padding-left: 10px;
    }

    .item-box-check {
      flex: 1;
      justify-content: center !important;


    }
    .item-box-check:nth-child(2) {
      border-left: $border;
      border-right: $border;
    }
  }

  .item-note {
    min-width: 300px;
  }
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
  border: $border;
  //border-left: none;
  border-right: none;
  padding-top: 10px;
  padding-bottom: 10px;
  height: 100%;
  display: flex;
  font-weight: bold;
  justify-content: center;
  align-items: center;
}
.row-header__item.item-col {
  flex-direction: column;
}
.row-header__item:last-child {
  border-right: $border;
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
  &__title {
    background-color: $bg;
    height: 100%;
  }
  &__body {
  }
}
.row-content__body-item {
  border-left: $border;

  .item-title {
    padding: 10px;
    border-right: $border;
    border-bottom: $border;
  }

  .item-content {
    padding: 10px;
    align-self: center;
    color: #3c3c3c;

    pre {
      font-family: "Noto Sans KR", "Montserrat", Helvetica, Arial, sans-serif;
      white-space: pre-wrap;
    }

    .row-title {
      font-weight: 500;
      display: inline-flex;
    }
    /*.row-title:before {
      content: "•";
      display: inline-block;
      width: 1em;
      margin-left: 1em;
    }*/
  }
  .item-box {
    border-left: $border;
    //border-right: $border;
    display: flex;

    .row-title {
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      padding-left: 10px;
    }

    .item-box-check {
      flex: 1;
      justify-content: center !important;


    }
    .item-box-check:nth-child(2) {
      border-left: $border;
      border-right: $border;
    }
  }
  .item-box:last-child {
    border-right: $border;
  }
  .item-area {
    padding: 5px;
    align-self: center;
  }

  .item-note {
    padding: 5px;
    border-left: $border;
    height: 100%;
    display: inline-flex;
    align-items: center;
  }
}

.row-content__body-item:last-child {
  border-bottom: $border;
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

/*체크박스 중앙 정렬을 위함.. scope style 내에서는 적용이 안되서 외부로 뺐음*/
.item-box .vs-checkbox {
  margin-right: 0;
}

.infoBtn {
  display:  inline-flex;
  column-gap: 7px;
  color: #7e72f2;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}
.popupSearchField {
  th, td {
    padding: 10px;
    border: $border;
    color: #3c3c3c;
    font-size: 14px;
    min-height: 45px;
    line-height: 24px;
  }
  th {
    text-align: center;
    font-size: 16px;
    font-weight: 700;
    background-color: #f9f9f9;
  }
  ol {
    padding-left: 30px;
    li {
      list-style: disc;
    }
  }
}
</style>
