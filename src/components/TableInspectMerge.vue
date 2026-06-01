<template>
  <div>
    <div v-if="!!title" class="flex items-center mb-4">
      <h5><i class="dot"></i> {{ title }}</h5>
      <span v-if="!!popupTitle" class="infoBtn" @click="showPopup = true"> <feather-icon icon="InfoIcon" svgClasses="h-5 w-5" />{{ popupTitle }}</span>
    </div>

    <!-- PC -->
    <div class="pc hidden xl:block">
      <!-- 테이블 헤더 -->
      <table>
        <colgroup>
          <col v-if="numbering" width="50" />
          <fragment v-if="typeof tableHeaderTitle === 'string'">
            <col width="100" />
            <col />
          </fragment>
          <fragment v-else>
            <fragment v-for="col in tableHeaderTitle" :key="`col-${col.text}`">
              <col v-for="(cs, _cs_i) in col.colspan || 1" :key="`cs-${col.text}-${_cs_i}`" :width="!!col.widths ? col.widths[_cs_i] : col.width" />
            </fragment>
          </fragment>
          <col v-for="col in tableHeaderCheck" :key="`col-${col.text}`" :width="!!col.width ? col.width : '82'" />
          <col v-if="isNote" :width="!!tableHeaderNote.width ? tableHeaderNote.width : '388'" />
        </colgroup>
        <thead>
          <tr>
            <th v-if="numbering">No.</th>
            <th v-if="typeof tableHeaderTitle === 'string'" colspan="2">{{ tableHeaderTitle }}</th>
            <fragment v-else>
              <th v-for="th in tableHeaderTitle" :key="`th-${th.text}`" :colspan="th.colspan ? th.colspan : 1">{{ th.text }}</th>
            </fragment>
            <th v-for="th in tableHeaderCheck" :key="`th-${th.text}`">{{ th.text }}</th>
            <th v-if="isNote">{{ tableHeaderNote.text }}</th>
          </tr>
        </thead>
        <tbody>
          <fragment v-for="(item, item_i) in list" :key="item_i">
            <!-- Title  (중복될 경우 무시한다) -->
            <tr v-if="!!item.title && (item_i === 0 || list[item_i].title !== list[item_i - 1].title)" class="title-tr">
              <td :colspan="getColspan" :style="{ backgroundColor: item.titleColor || tableTitleColor }">
                {{ item.title }}
              </td>
            </tr>
            <!-- SubTitle / Content -->
            <tr>
              <td v-if="numbering" class="text-center">{{ ++item_i }}</td>
              <!-- SubTitle 있을 때 -->
              <td v-if="!!item.subTitle && list[item_i].subTitle !== (!!list[item_i - 1] && list[item_i - 1].subTitle)" :rowspan="getRowSpan(item)" :style="{ backgroundColor: item.subTitleColor }" class="sub-title">{{ item.subTitle }}</td>
              <!-- Content : STRING -->
              <td v-if="typeof item.content === 'string'" :colspan="!!item.subTitle ? 1 : 2" class="content" :style="!!item.sign && 'padding: 10px 14px;'">
                <div style="white-space: pre-line; align-items: start">
                  <span v-if="!!contentBefore">{{ contentBefore }}</span>
                  <p v-html="item.content"></p>
                  <div v-for="_sign in item.sign" :key="`${item_i}_sign_${_sign.name}`" class="flex items-center gap-1">
                    <span style="width: max-content">{{ _sign.name }} : </span>
                    <ml-input v-model="_sign.value" />
                  </div>
                </div>
              </td>
              <!-- Content : ARRAY -->
              <td v-else v-for="(content, content_i) in item.content" :key="`content_${content_i}`" class="content" :style="!!item.sign && 'padding: 10px 14px;'">
                <div style="white-space: pre-line" :style="tableHeaderTitle[content_i].style">
                  <span v-if="!!contentBefore">{{ contentBefore }}</span>
                  <p v-if="typeof content === 'string'" v-html="content"></p>
                  <div v-else class="flex flex-wrap items-center gap-x-2 gap-y-4">
                    <div v-for="cc in content" :key="cc.content" style="min-width: 130px">
                      <PrintCheckbox v-if="isPrint" :label="cc.content" :value="cc.check" color style="width: fit-content" class="mx-auto" />
                      <vs-checkbox v-else :disabled="isReadonly" v-model="cc.check">{{ cc.content }}</vs-checkbox>
                    </div>
                  </div>
                  <fragment v-if="!!item.sign && signColIndex === content_i">
                    <div v-for="_sign in item.sign" :key="`${item_i}_sign_${_sign.name}`" class="flex items-center gap-1" :class="_sign.valueWidth === '100%' && 'w-full'">
                      <span :style="{ width: _sign.nameWidth }" style="width: max-content">{{ _sign.name }} :</span>
                      <ml-input v-model="_sign.value" :style="{ width: _sign.valueWidth }" />
                    </div>
                  </fragment>
                </div>
              </td>

              <!-- Checkbox -->
              <td v-for="cb in tableHeaderCheck" :key="`cb-${cb.text}`">
                <PrintCheckbox v-if="isPrint" label="" :value="item.isChecked === cb.text" color style="width: fit-content" class="mx-auto" />
                <vs-checkbox v-else :disabled="isReadonly" :checked="item.isChecked === cb.text" @change="item.isChecked = cb.text" class="i-check justify-center" />
              </td>
              <!-- Checkbox Note -->
              <td v-if="isNote" class="px-1">
                <span v-if="isPrint" class="print-input"> {{ item.note }} </span>
                <ml-input v-else class="w-full flex-1" v-model="item.note" :readonly="isReadonly" />
              </td>
            </tr>
          </fragment>

          <!-- TrFooter -->
          <tr v-if="!!trFooter || $slots.trFooter" class="title-tr">
            <td :colspan="getColspan">{{ trFooter }} <slot name="trFooter" /></td>
          </tr>
        </tbody>
      </table>

      <div v-if="isBottomNote" class="flex items-center mt-4">
        <div class="label-text mr-4">{{ bottomNoteTitle }}</div>
        <p v-if="isPrint" class="w-full flex-1">{{ bottomNote }}</p>
        <ml-textarea v-else class="flex-1 w-full" rows="5" :readonly="isReadonly" v-model="bottomNote" @change="updateBottomNote()" />
      </div>

      <!-- footer 지정된 경우, 표시한다 (중복될 경우 무시한다) -->
      <div v-if="!!footer" class="font-bold px-2">{{ footer }}</div>
    </div>

    <!-- Mobile -->
    <div class="mobile xl:hidden">
      <ul>
        <li v-if="typeof tableHeaderTitle === 'string'">{{ tableHeaderTitle }}</li>
        <li v-else>{{ mobileTitle(tableHeaderTitle) }}</li>
        <li v-for="(item, item_i) in list" :key="item_i">
          <p v-if="!!item.title" style="font-weight: 500; font-size: 16px; line-height: 23px" class="mb-3">{{ item.title }}</p>
          <p v-if="typeof item.content === 'string'" v-html="item.content"></p>
          <div v-else v-for="(content, content_i) in item.content" :key="`content_mobile_${content_i}`">
            <p v-if="typeof content === 'string'" v-html="content" class="mb-6"></p>
            <div v-else class="grid grid-cols-2 gap-6 mb-6">
              <div v-for="cc in content" :key="cc.content">
                <PrintCheckbox v-if="isPrint" :label="cc.content" :value="cc.check" color style="width: fit-content" class="mx-auto" />
                <vs-checkbox v-else :disabled="isReadonly" v-model="cc.check">{{ cc.content }}</vs-checkbox>
              </div>
            </div>
          </div>
          <div v-for="_sign in item.sign" :key="`${item_i}_sign_${_sign.name}`" class="flex items-center gap-3">
            <span style="width: max-content">{{ _sign.name }} : </span>
            <ml-input v-model="_sign.value" class="flex-1" />
          </div>
          <div class="btn-container">
            <button v-for="cb in tableHeaderCheck" :key="`mobile-cb-${cb.text}`" type="button" :class="[item.isChecked === cb.text && 'active']" @click="item.isChecked = cb.text">{{ cb.text }}</button>
            <!-- <button type="button" :class="[item.isChecked === 'No' && 'active']" @click="item.isChecked = 'No'">{{ tableHeaderNo }}</button>
            <button type="button" :class="[item.isChecked === 'N/A' && 'active']" @click="item.isChecked = 'N/A'">{{ tableHeaderNa }}</button> -->
          </div>
          <ml-input v-if="isNote" class="w-full mt-3" v-model="item.note" :readonly="isReadonly" />
        </li>
      </ul>
    </div>

    <!-- POPUP -->
    <vs-popup v-if="!!popupTitle" :title="popupTitle" :active.sync="showPopup">
      <slot name="popup"></slot>
    </vs-popup>
  </div>
</template>

<script>
import PrintCheckbox from "@/components/print/PrintCheckbox.vue";
export default {
  name: "TableInspectMerge",
  components: { PrintCheckbox },
  props: {
    isPrint: Boolean,
    isReadonly: Boolean,
    title: String,
    numbering: {
      type: Boolean,
      default: false,
    },
    tableHeaderTitle: {
      type: String | Array,
      default: "점검내용",
    },
    tableHeaderCheck: {
      type: Array,
      default: () => [
        { text: "양호", width: "82" },
        { text: "미흡", width: "82" },
        { text: "해당없음", width: "82" },
      ],
    },
    isNote: {
      type: Boolean,
      default: true,
    },
    tableHeaderNote: {
      type: Object,
      default: () => ({ text: "비고(보완계획)", width: "388" }),
    },
    contentBefore: String,
    footer: String,
    trFooter: String,
    isBottomNote: {
      type: Boolean,
      default: false,
    },
    bottomNoteTitle: {
      type: String,
      default: "기타의견",
    },
    initBottomNote: {
      type: String,
      default: "",
    },
    tableTitleColor: {
      type: String,
      default: null,
    },
    signColIndex: {
      type: Number,
      default: 0,
    },
    popupTitle: String,
    value: Array,
  },
  computed: {
    getColspan() {
      let col = 0;
      if (typeof this.tableHeaderTitle === "string") col = col + 2;
      else col = col + this.tableHeaderTitle.length;

      col = col + this.tableHeaderCheck.length;

      if (this.isNote) ++col;
      if (this.numbering) ++col;

      return col;
    },
  },
  data() {
    return {
      bottomNote: this.initBottomNote,
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
    getRowSpan(data) {
      const _row = this.list.filter((item) => item.title === data.title && item.subTitle === data.subTitle);
      return _row.length;
    },
    mobileTitle(data) {
      return data.map((item) => item.text).join(" / ");
    },
  },
};
</script>

<style scoped lang="scss">
.infoBtn {
  display: inline-flex;
  column-gap: 7px;
  color: #7e72f2;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  margin-left: 8px;
}
.i-check::v-deep .vs-checkbox {
  margin: 0;
}
.pc {
  table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;

    th,
    td {
      border: 1px solid #cdcdcd;
    }

    thead {
      th {
        font-weight: 500;
        font-size: 14px;
        line-height: 20px;
        text-align: center;
        color: #3c3c3c;
        background: #f9f9f9;
        padding: 16px 0;
      }
    }

    tbody {
      .title-tr td {
        font-weight: 700;
        font-size: 14px;
        line-height: 20px;

        background: #f9f9f9;
        padding: 14px;
      }
      .sub-title {
        text-align: center;
        font-weight: 500;
        font-size: 14px;
        line-height: 20px;

        background: #f9f9f9;
        padding: 14px 0;
      }

      .content {
        font-weight: 500;
        font-size: 14px;
        line-height: 20px;
        padding: 14px;
        & > div {
          display: flex;
          flex-wrap: nowrap;
          align-items: center;
          gap: 8px;
        }
      }
    }
  }
}

.mobile {
  ul {
    li {
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;

      border: 1px solid #cdcdcd;
      padding: 15px;

      &:first-child {
        text-align: center;
        background: #f9f9f9;
      }
      &:nth-child(n + 2) {
        border-top: 0;
      }

      .btn-container {
        display: flex;
        align-items: center;
        border: 1px solid #cdcdcd;
        border-radius: 8px;
        overflow: hidden;
        margin-top: 20px;

        button {
          flex: 1;
          font-family: "Noto Sans KR";
          font-style: normal;
          font-weight: 400;
          font-size: 14px;
          line-height: 18px;
          color: #2c2c2c;
          background: none;
          border: 0;
          border-right: 1px solid #cdcdcd;
          outline: 0;
          padding: 11px 0;
          &:last-child {
            border-right: 0;
          }

          &.active {
            color: white;
            background: #200c63;
          }
        }
      }
    }
  }
}
</style>
