<template>
  <vs-card class="col-span-4 px-3 py-3" style="border: 1px solid #eee; margin-bottom: 0;">
    <div class="flex justify-between items-center gap-x-4" style="margin-bottom: -15px;">
      <div class="flex flex-col gap-y-2 w-full">
        <div class="card-title title" :title="title">{{ title }}</div>
        <div class="flex flex-col gap-y-1">
          <table class="full-width description" style="">
            <tbody>
            <tr>
              <td valign="top">주소 : </td>
              <td>{{ address || '-' }}</td>
            </tr>
            <tr>
              <td>사업기간 : </td>
              <td>{{ projectPeriod }}</td>
            </tr>
            <tr>
              <td>사업금액 : </td>
              <td>{{ formattedAmount }}{{ amountUnit }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="grid gap-y-2 whitespace-no-wrap">
        <div :class="[isSelectedField ? 'cursor-not-allowed': '']">
          <vs-button class="w-full" color="secondary" @click.prevent.stop="onClickSelect" :disabled="isSelectedField">{{ isSelectedField ? '선택됨' : '선택하기'}}</vs-button>
        </div>
        <div>
          <vs-button color="#dcdfe2" text-color="#3c3c3c" @click.prevent.stop="onClickInfo">현장정보</vs-button>
        </div>
      </div>
    </div>
  </vs-card>
</template>
<script>

export default {
  props: {
    fieldId: {
      type: Number,
      required: false,
    },
    selectedFieldId: {
      type: Number,
      required: false,
      default: 0,
    },
    title: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    startDate: {
      type: String,
      required: false,
    },
    endDate: {
      type: String,
      required: false,
    },
    amount: {
      type: String,
      required: false,
    },
    amountUnit: {
      type: String,
      required: false,
      default: '원',
    }
  },
  emits: ['on-click-select', 'on-click-info'],
  computed: {
    isSelectedField() {
      return this.fieldId === this.selectedFieldId;
    },
    // 사업기간을 반환한다
    projectPeriod() {
      if (this.startDate) {
        if (this.endDate) {
          return `${this.startDate} ~ ${this.endDate}`;
        } else {
          return `${this.startDate} ~ `;
        }
      } else if (this.endDate) {
        return ` ~ ${this.endDate}`;
      } else {
        return '-'
      }
    },
    // 사업금액에 천단위 콤마를 추가한다
    formattedAmount() {
      if (!this.amount) return '-'
      return new Intl.NumberFormat().format(Number(this.amount));
    },
  },
  methods: {
    onClickInfo() {
      this.$emit('on-click-info', {id: this.fieldId});
    },
    onClickSelect() {
      this.$emit('on-click-select', {id: this.fieldId});
    }
  }
}
</script>

<style scoped lang="scss">
.title {
  display: -webkit-box;
  font-size: 20px;
  line-height: 26px;
  height: 52px;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: keep-all;
}
.description {
  font-size: 14px;
  font-weight: 400;
  line-height: 18px;

  tr {
    td:first-child {
      white-space: nowrap;
      width: 1%;
      padding-right: 7px;
    }
  }
  tr:not(:last-child) {
    td {
      padding-bottom: 7px;
    }
  }
}
</style>
