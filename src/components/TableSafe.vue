<template>
  <div class="mt-component-form">
    <vs-row class="my-4">
      <vs-col><h5><i class="dot"></i>안전조치 요구사항</h5></vs-col
      >
    </vs-row>
    <!-- header -->
    <div class="grid grid-cols-12 row-header">
      <div class="col-span-2 row-header__item">작업구분</div>
      <div class="col-span-10 grid grid-cols-10">
            <div class="col-span-5 grid grid-cols-5">
                <div class="col-span-3 row-header__item">점검내용</div>
                <div class="col-span-1 row-header__item">조치필요</div>
                <div class="col-span-1 row-header__item">확인</div>
            </div>
            <div class="col-span-5 grid grid-cols-5">
                <div class="col-span-3 row-header__item">점검내용</div>
                <div class="col-span-1 row-header__item">조치필요</div>
                <div class="col-span-1 row-header__item">확인</div>
            </div>
      </div>
    </div>
    <!-- rows -->
    <div class="row-content-none-data" v-if="!dataCheckbox || !this.dataCheckbox.dataTable">
      작업을 선택해주세요.
    </div>
    <div class="grid grid-cols-12 row-content">
      <div class="col-span-2 row-content__title center-flex">
        {{ dataCheckbox.label }}
      </div>
      <div class="col-span-10 row-content__body">
        <div
          class="grid grid-cols-10 row-content__body-item"
          v-for="(row, index) in records"
          :key="index">
          <div class="col-span-5 grid grid-cols-5" v-for="(ro, indexRow) in row"
            :key="indexRow">
            <div class="col-span-3 item-content">&bull; {{ ro.text }}</div>
            <div class="col-span-1 item-box">
              <template v-if="isPrint">
                <div class="item-box-check" v-if="list[ro.index - 1].is_checked === '조치필요'" style="text-align: center;  align-self: center;">
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
                  list[ro.index - 1].is_checked === '조치필요' ? true : false
                "
                @change="checkForm($event, ro.index, '조치필요')"
              ></vs-checkbox>
            </div>
            <div class="col-span-1 item-box">
              <template v-if="isPrint">
                <div class="item-box-check" v-if="list[ro.index - 1].is_checked === '확인'" style="text-align: center;  align-self: center;">
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
                  list[ro.index - 1].is_checked === '확인' ? true : false
                "
                @change="checkForm($event, ro.index, '확인')"
              ></vs-checkbox>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: "TableSafe",
  props: ["dataCheckbox", "list", "isPrint", "isReadonly"],
  computed: {
    records () {
      if (!this.dataCheckbox || !this.dataCheckbox.dataTable) return []
      let k = -1;
      return this.dataCheckbox.dataTable.reduce((e, i) => {
        if ((i.index - 1) % 2 === 0) {
          k++;
          e[k] = [];
        }
        e[k].push(i);
        return e;
      }, []);
    }
  },
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
    return {
    };
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

/* row data */
.row-content {
  border-bottom: $border;
  &__title {
    background-color: $bg;
    height: 100%;
    border-right: $border;
  }
  &__body {
  }
}
.row-content__body-item {
  .item-content {
    padding: 15px;
    border-right: $border;
  }
  .item-box {
    display: flex;
    .item-box-check {
      flex: 1;
      justify-content: center !important;
      border-right: $border;
      &.last{
        border-right: none;
      }
    }
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
