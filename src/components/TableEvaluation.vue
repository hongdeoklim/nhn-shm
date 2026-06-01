<template>
  <div class="print-container table-eval mt-component-form">
    <vs-row v-if="!!title">
      <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
        <h5><i class="dot"></i> {{ title }}</h5>
      </vs-col>
    </vs-row>

    <div class="mt-4 grid grid-cols-12 row-header">
      <div class="col-span-10 row-header__item">평가 내용</div>
      <div class="col-span-1 row-header__item">배점</div>
      <div class="col-span-1 row-header__item">점수</div>
    </div>
    <!--    rows-->
    <div v-for="(rows, indexRows) in list" :key="indexRows">
      <div v-if="rows.label" class="list-title">
        <b>{{ rows.label }}</b>
      </div>

      <div
        v-for="(child, indexChild) in rows.childs"
        :key="indexChild"
        class="w-full grid grid-cols-12 row-content__body-item"
      >
        <div class="col-span-10 item-content">
          <span v-text="child.label" style="white-space: pre-line"> </span>
        </div>

        <div class="col-span-1 item-box flex justify-center items-center">
          <span>
            {{ child.max }}
          </span>
        </div>
        <div class="col-span-1 item-box p-1">
          <span v-if="isPrint" class="print-input">{{ child.value }}</span>
          <ml-input
            v-else
            class="w-full text-center"
            :value="child.value"
            @input="(score) => scoreInputFilter(score, child)"
            v-model="child.value"
          />
        </div>
      </div>
    </div>
    <div
      class="w-full grid grid-cols-12 row-content__body-item"
      style="background: #f9f9f9"
    >
      <div class="col-span-10 item-content flex items-center justify-center">
        <span>평가 점수</span>
      </div>
      <div class="col-span-1 item-content flex items-center justify-center">
        <span>{{ allScore }}</span>
      </div>
      <div class="col-span-1 item-content p-1">
        <ml-input
          class="w-full text-center"
          :readonly="true"
          :value="userScore"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TableInspect',
  props: {
    isShowTitle: Boolean,
    title: String,
    list: Array,
    isPrint:Boolean,
  },
  computed: {
    allScore () {
      if (this.list.length < 1) return 0
      const _arr = this.list.reduce((prev, item) => {
        return prev.concat(item.childs)
      }, [])

      const allMaxScore = _arr.reduce((score, child) => {
        return score + child.max
      }, 0)

      return allMaxScore
    },
    userScore () {
      if (this.list.length < 1) return 0
      const _arr = this.list.reduce((prev, item) => {
        return prev.concat(item.childs)
      }, [])

      const allValueScore = _arr.reduce((score, child) => {
        return score + Number(child.value)
      }, 0)

      this.$emit('userScore', allValueScore)
      return allValueScore
    },
  },
  methods: {
    scoreInputFilter (data, child) {
      const inputNum = Number(
        data.replace(/[^0-9]/g, '').replace(/(\..*)\./g, '$1')
      )

      if (inputNum < 0) child.value = 0
      else child.value = child.max < inputNum ? child.max : inputNum
    },
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
  margin-left: 15px;
  margin: 0;
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

.list-title {
  border-left: 1px solid #cdcdcd;
  border-right: 1px solid #cdcdcd;
  border-bottom: 1px solid #cdcdcd;
  padding: 10px;
}

.row-content__body-item {
  .item-title {
    padding: 10px;
    border-left: $border;
    border-right: $border;
    border-bottom: $border;
  }

  .item-content {
    padding: 10px;
    border-left: $border;

    pre {
      font-family: "Noto Sans KR", "Montserrat", Helvetica, Arial, sans-serif;
      white-space: pre-wrap;
    }
  }
  .item-box {
    border-left: $border;
    //border-right: $border;
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

.table-eval::v-deep .vs-input--input {
  text-align: center;
}
</style>
