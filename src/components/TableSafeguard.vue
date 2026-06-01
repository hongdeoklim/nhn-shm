<template>
  <div class="mt-component-form">
    <vs-row class="my-4">
      <vs-col
        ><h5><i class="dot"></i>안전조치 요구사항</h5></vs-col
      >
    </vs-row>
    <div class="grid grid-cols-12 row-header">
      <div class="col-span-2 row-header__item">구분</div>
      <div class="col-span-10 grid grid-cols-10">
        <div class="col-span-5 row-header__item">점검내용</div>
        <div class="col-span-2 row-header__item item-col">
          <div class="row-header__checkbox-title">
            점검결과
          </div>
          <div class="row-header__checkboxs">
            <div>적정</div>
            <div>부적정</div>
            <div>N/A</div>
          </div>
        </div>
        <div class="col-span-3 row-header__item">비고</div>
      </div>
    </div>
    <!-- rows -->
    <div class="row-content-none-data" v-if="dataRequest.length === 0">
      작업을 선택해주세요.
    </div>
    <div
      class="grid grid-cols-12 row-content"
      v-for="(rows, indexRows) in dataRequest"
      :key="indexRows"
    >
      <div class="col-span-2 row-content__title center-flex">
        {{ rows.title }}
      </div>
      <div class="col-span-10 row-content__body">
        <div
          class="grid grid-cols-10 row-content__body-item"
          v-for="(row, indexRow) in rows.data"
          :key="indexRow"
        >
          <div class="col-span-5 item-content"><pre>&bull; {{ row.text }}</pre></div>
          <div class="col-span-2 item-box">
            <template
            v-if="isPrint"
            >
              <div class="item-box-check" v-if="list[row.index - 1].is_checked === '적정'" style="text-align: center;  align-self: center;">
                <vs-icon icon="check" size="medium"  ></vs-icon>
              </div>
              <div v-else class="item-box-check">
              </div>
            </template>
            <vs-checkbox
              v-else
              class="item-box-check"
              :readonly="isReadonly"
              :checked="
                list[row.index - 1].is_checked === '적정' ? true : false
              "
              @change="checkForm($event, row.index, '적정')"
            ></vs-checkbox>
            
            <template
            v-if="isPrint"
            >
              <div class="item-box-check" v-if="list[row.index - 1].is_checked === '부적정'" style="text-align: center;  align-self: center;">
                <vs-icon icon="check" size="medium" ></vs-icon>
              </div>
              <div v-else class="item-box-check">
              </div>
            </template>
            <vs-checkbox
              v-else
              class="item-box-check"
              :readonly="isReadonly"
              :checked="
                list[row.index - 1].is_checked === '부적정' ? true : false
              "
              @change="checkForm($event, row.index, '부적정')"
            ></vs-checkbox>

            <template
            v-if="isPrint"
            >
              <div class="item-box-check" v-if="list[row.index - 1].is_checked === 'N/A'" style="text-align: center;  align-self: center;">
                <vs-icon icon="check" size="medium" ></vs-icon>
              </div>
              <div v-else class="item-box-check">
              </div>
            </template>
            <vs-checkbox
              v-else
              class="item-box-check"
              :readonly="isReadonly"
              :checked="list[row.index - 1].is_checked === 'N/A' ? true : false"
              @change="checkForm($event, row.index, 'N/A')"
            ></vs-checkbox>

            <!-- <vs-icon v-if="isPrint && list[row.index - 1].is_checked === 'N/A'" icon="check" size="medium" ></vs-icon>
            <vs-checkbox
              v-else
              class="item-box-check"
              :checked="list[row.index - 1].is_checked === 'N/A' ? true : false"
              @change="checkForm($event, row.index, 'N/A')"
            ></vs-checkbox> -->
          </div>
          <div class="col-span-3 item-area">
            <ml-textarea v-if="!isPrint" rows="1" placeholder="text area" v-model="list[row.index - 1].note" />
            <span v-else >{{ list[row.index - 1].note }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "TableSafeguard",
  props: ["dataRequest", "list", "isPrint", "isReadonly"],
  methods: {
    checkForm(value, indexRows, text) {
      if (value.target.checked) {
        this.$emit("update-list-check", indexRows - 1, text);
      } else {
        this.$emit("update-list-check", indexRows - 1, "");
      }
    }
  },
  data() {
    return {};
  }
};
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
  margin-left: 15px;
  margin: 0;
}

/* Table */
.row-header {
  background-color: $bg;
  text-align: center;
  height: 100px;

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
  .item-content {
    padding: 15px;
    border-left: $border;

    pre {
      font-family: "Noto Sans KR", "Montserrat", Helvetica, Arial, sans-serif;
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
  }
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
</style>
