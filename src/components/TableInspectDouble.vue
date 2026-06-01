<template>
  <div v-if="isPrint" class="print">
    <table>
      <colgroup>
        <col v-if="isTableNumbering" width="54" />
        <col />
        <fragment v-for="(titles, titles_i) in tableCheckTitles" :key="`col_${titles.title}`">
          <col width="80" />
          <col width="80" />
          <col width="80" :style="{ borderRight: tableCheckTitles.length - 1 !== titles_i ? `solid 2px #757575` : `solid 1px #757575` }" />
        </fragment>
      </colgroup>
      <thead>
        <tr>
          <th v-if="isTableNumbering" rowspan="2" class="p-2">{{ tableNumberingTitle }}</th>
          <th rowspan="2">{{ tableHeaderTitle }}</th>
          <th v-for="titles in tableCheckTitles" :key="`1_titles_${titles.title}`" colspan="3">{{ titles.title }}</th>
        </tr>
        <tr>
          <fragment v-for="titles in tableCheckTitles" :key="`2_titles_${titles.title}`">
            <th>{{ titles.yes }}</th>
            <th>{{ titles.no }}</th>
            <th>{{ titles.na }}</th>
          </fragment>
        </tr>
      </thead>
      <tbody>
        <fragment v-for="(item, item_i) in list" :key="item_i">
          <!-- Title  (중복될 경우 무시한다) -->
          <tr v-if="!!item.title && (item_i === 0 || list[item_i].title !== list[item_i - 1].title)" class="title-tr">
            <td :colspan="titleColspan">
              {{ item.title }}
            </td>
          </tr>
          <tr>
            <!-- Content -->
            <td v-if="isTableNumbering" class="text-center">{{ item_i + 1 }}</td>
            <td class="content">
              <div style="white-space: pre-line; align-items: start">
                <p v-html="item.content"></p>
                <div class="flex items-center" v-for="_sign in item.sign" :key="`${item_i}_sign_${_sign.name}`">
                  <span>{{ _sign.name }} : </span>
                  <ml-input v-model="_sign.value" />
                </div>
              </div>
            </td>

            <fragment v-for="titles in tableCheckTitles" :key="`td_check_${titles.title}`">
              <!-- Checkbox YES -->
              <td>
                <RadioTypeCheck :isPrint="true" :readonly="isReadonly" :name="`td_check_${titles.title}_${item_i}`" :checkValue="titles.yes" v-model="item[titles.title]" />
              </td>
              <!-- Checkbox NO -->
              <td>
                <RadioTypeCheck :isPrint="true" :readonly="isReadonly" :name="`td_check_${titles.title}_${item_i}`" :checkValue="titles.no" v-model="item[titles.title]" />
              </td>
              <!-- Checkbox N/A -->
              <td>
                <RadioTypeCheck :isPrint="true" :readonly="isReadonly" :name="`td_check_${titles.title}_${item_i}`" :checkValue="titles.na" v-model="item[titles.title]" />
              </td>
            </fragment>
          </tr>
        </fragment>
      </tbody>
    </table>
  </div>

  <div v-else>
    <div v-if="!!title" class="flex items-center mb-4">
      <h5><i class="dot"></i> {{ title }}</h5>
    </div>

    <!-- PC -->
    <div class="pc hidden xl:block">
      <!-- 테이블 헤더 -->
      <table>
        <colgroup>
          <col v-if="isTableNumbering" width="80" />
          <col />
          <fragment v-for="(titles, titles_i) in tableCheckTitles" :key="`col_${titles.title}`">
            <col width="80" />
            <col width="80" />
            <col width="80" :style="{ borderRight: tableCheckTitles.length - 1 !== titles_i ? `solid 2px #cdcdcd` : `solid 1px #cdcdcd` }" />
          </fragment>
        </colgroup>
        <thead>
          <tr>
            <th v-if="isTableNumbering" rowspan="2">{{ tableNumberingTitle }}</th>
            <th rowspan="2">{{ tableHeaderTitle }}</th>
            <th v-for="titles in tableCheckTitles" :key="`1_titles_${titles.title}`" colspan="3">{{ titles.title }}</th>
          </tr>
          <tr>
            <fragment v-for="titles in tableCheckTitles" :key="`2_titles_${titles.title}`">
              <th>{{ titles.yes }}</th>
              <th>{{ titles.no }}</th>
              <th>{{ titles.na }}</th>
            </fragment>
          </tr>
        </thead>
        <tbody>
          <fragment v-for="(item, item_i) in list" :key="item_i">
            <!-- Title  (중복될 경우 무시한다) -->
            <tr v-if="!!item.title && (item_i === 0 || list[item_i].title !== list[item_i - 1].title)" class="title-tr">
              <td :colspan="titleColspan" :style="{ backgroundColor: item.titleColor || tableTitleColor }">
                {{ item.title }}
              </td>
            </tr>
            <tr>
              <!-- Content -->
              <td v-if="isTableNumbering" class="text-center">{{ item_i + 1 }}</td>
              <td class="content">
                <div style="white-space: pre-line; align-items: start">
                  <p v-html="item.content"></p>
                  <div class="flex items-center" v-for="_sign in item.sign" :key="`${item_i}_sign_${_sign.name}`">
                    <span>{{ _sign.name }} : </span>
                    <ml-input v-model="_sign.value" />
                  </div>
                </div>
              </td>

              <fragment v-for="titles in tableCheckTitles" :key="`td_check_${titles.title}`">
                <!-- Checkbox YES -->
                <td>
                  <RadioTypeCheck :readonly="isReadonly" :name="`td_check_${titles.title}_${item_i}`" :checkValue="titles.yes" v-model="item[titles.title]" />
                </td>
                <!-- Checkbox NO -->
                <td>
                  <RadioTypeCheck :readonly="isReadonly" :name="`td_check_${titles.title}_${item_i}`" :checkValue="titles.no" v-model="item[titles.title]" />
                </td>
                <!-- Checkbox N/A -->
                <td>
                  <RadioTypeCheck :readonly="isReadonly" :name="`td_check_${titles.title}_${item_i}`" :checkValue="titles.na" v-model="item[titles.title]" />
                </td>
              </fragment>
            </tr>
          </fragment>
        </tbody>
      </table>
    </div>

    <!-- Mobile -->
    <!-- <div class="mobile xl:hidden">
      <ul>
        <li>{{ tableHeaderTitle }}</li>
        <li v-for="(item, item_i) in list" :key="item_i">
          <p v-if="!!item.title" style="font-weight: 500; font-size: 16px; line-height: 23px" class="mb-3">{{ item.title }}</p>
          <p v-html="item.content"></p>
          <div class="btn-container">
            <button type="button" :class="[item.isChecked === 'Yes' && 'active']" @click="item.isChecked = 'Yes'">{{ tableHeaderYes }}</button>
            <button type="button" :class="[item.isChecked === 'No' && 'active']" @click="item.isChecked = 'No'">{{ tableHeaderNo }}</button>
            <button type="button" :class="[item.isChecked === 'N/A' && 'active']" @click="item.isChecked = 'N/A'">{{ tableHeaderNa }}</button>
          </div>
        </li>
      </ul>
    </div> -->
  </div>
</template>

<script>
import RadioTypeCheck from "@/components/radio/RadioTypeCheck.vue";
import PrintCheckbox from "@/components/print/PrintCheckbox.vue";
export default {
  name: "TableInspectDouble",
  components: { RadioTypeCheck, PrintCheckbox },
  props: {
    isPrint: Boolean,
    isReadonly: Boolean,
    title: String,
    isTableNumbering: {
      type: Boolean,
      default: false,
    },
    tableNumberingTitle: {
      type: String,
      default: "",
    },
    tableHeaderTitle: {
      type: String,
      default: "점검내용",
    },
    tableCheckTitles: {
      type: Array,
      default: () => [{ title: "점검", yes: "양호", no: "미흡", na: "해당없음" }],
    },
    tableTitleColor: {
      type: String,
      default: null,
    },
    value: Array,
  },
  data() {
    return {
      list: this.value,
    };
  },
  computed: {
    titleColspan() {
      const colspan = this.isTableNumbering ? 2 : 1;
      return colspan + this.tableCheckTitles.length * 3;
    },
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
  },
};
</script>

<style scoped lang="scss">
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
        div {
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

.print table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;

  th,
  td {
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    border: 1px solid #757575;
    padding: 0 14px;
  }

  th {
    text-align: center;
    background: #ececec;
  }
  .title-tr td {
    font-weight: 700;
    font-size: 14px;
    line-height: 20px;
    background: #ececec;
    padding: 0 14px;
  }
}
</style>
