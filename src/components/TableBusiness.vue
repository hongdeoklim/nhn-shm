<template>
  <div class="mt-component-form">
    <vs-row class="my-4">
      <vs-col
        ><h5><i class="dot"></i>{{ title ? title : '업무 수행 여부'}}</h5></vs-col
      >
    </vs-row>
    <div class="grid grid-cols-12 row-header">
      <div class="col-span-12 grid grid-cols-12">
      <div class="col-span-6 row-header__item">점검항목</div>
      <div class="col-span-3 row-header__item item-col">
        <div class="row-header__checkboxs">
          <div>Yes</div>
          <div>No</div>
          <div>N/A</div>
        </div>
      </div>
      <div class="col-span-3 row-header__item">개선요망 사항(비고)</div>

      </div>
    </div>
    <!-- rows -->
    <div class="row-content-none-data" v-if="dataTable.length === 0">
      작업을 선택해주세요.
    </div>
    <div
      class="grid grid-cols-12 row-content"
      v-for="(row, indexRows) in dataTable"
      :key="indexRows"
    >
      <div class="col-span-12 grid grid-cols-12 row-content__body-item">
        <div class="col-span-6 item-content">
          <pre>&bull; {{ row.text }}</pre>
        </div>
        <div class="col-span-3 item-box">
          <template v-if="isPrint">
            <div
              class="item-box-check"
              style="text-align: center;  align-self: center;"
            >
              <vs-icon icon="check" size="medium"></vs-icon>
            </div>
          </template>
          <vs-checkbox
            v-else
            class="item-box-check"
            :readonly="isReadonly"
            :checked="list[row.index - 1].is_checked === '양호'"
            @change="checkForm($event, row.index, '양호')"
          ></vs-checkbox>

          <template v-if="isPrint">
            <div
              class="item-box-check"
              style="text-align: center;  align-self: center;"
            >
              <vs-icon icon="check" size="medium"></vs-icon>
            </div>
          </template>
          <vs-checkbox
            v-else
            class="item-box-check"
            :readonly="isReadonly"
             :checked="list[row.index - 1].is_checked === '보통'"
            @change="checkForm($event, row.index, '보통')"
          ></vs-checkbox>

          <template v-if="isPrint">
            <div
              class="item-box-check"
              style="text-align: center;  align-self: center;"
            >
              <vs-icon icon="check" size="medium"></vs-icon>
            </div>
          </template>
          <vs-checkbox
            v-else
            class="item-box-check"
            :readonly="isReadonly"
             :checked="list[row.index - 1].is_checked === '불량'"
            @change="checkForm($event, row.index, '불량')"
          ></vs-checkbox>
        </div>
        <div class="col-span-3 item-area">
          <ml-textarea v-if="!isPrint" rows="1"  v-model="list[row.index - 1].note" />
          <span v-else class="print-textarea">{{ list[row.index - 1].note }}</span>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-12 row-footer">
      <div class="col-span-12 ">
        <slot name="footer"/>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'TableBusiness',
  props: ['dataTable', 'list', 'isPrint', 'isReadonly', 'title'],
  methods: {
    checkForm (value, indexRows, text) {
      if (value.target.checked) {
        this.$emit('update-list-check', indexRows - 1, text)
      } else {
        this.$emit('update-list-check', indexRows - 1, '')
      }
    }
  },
  data () {
    return {}
  }
}
</script>
<style scoped lang="scss">
$border: 1px solid #cdcdcd;
$bg: #f9f9f9;

.mt-component-form {
  margin-top: 25px;
  font-weight: 500;
  font-size: 14px;
  .center-flex {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .vs-checkbox-default {
    margin: 0;
  }

  .ml-group-checkBox ~ .ml-group-checkBox {
    /*margin-left: 15px;*/
    margin: 0;
  }

  /* Header */
  .row-header {
    background-color: $bg;
    text-align: center;
    height: 50px;

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
      height: 100%;
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

    .row-header__item {
      border: $border;
      border-left: none;
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
  }

  /* row data */
  .row-content {
    border-bottom: $border;

    &__title {
      background-color: $bg;
      height: 100%;
    }

    .row-content__body-item {
      ~ .row-content__body-item {
        border-top: $border;
      }
      .item-content {
        padding: 15px;
        border-left: $border;

        pre {
          font-family: "Noto Sans KR", "Montserrat", Helvetica, Arial,
            sans-serif;
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
        border-right: $border;
      }
    }
  }

  .row-footer {
    padding: 15px 20px;
    border: $border;
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
}
</style>
