<template>
  <td colspan="11" class="expand">
    <!-- =========================== Control =========================== -->
    <div class="flex justify-between items-center p-2">
      <p class="title text-sm">시스템 사용자 정보</p>
      <div>
        <vs-button color="secondary" @click="addRow"> 항목추가 </vs-button>
        <vs-button color="secondary" type="border" class="ml-2" @click="deleteRow"> 선택삭제 </vs-button>
      </div>
    </div>
    <!-- =========================== Expand Content =========================== -->
    <table>
      <thead>
        <th><vs-checkbox :value="this.expand.length !== 0 && this.expand.length === this.checked.length" @change="onChangeAllCheck" /></th>
        <th>No.</th>
        <th>사용자명</th>
        <th>사용자 ID</th>
        <th>연락처</th>
        <th>이메일</th>
      </thead>
      <tbody>
        <tr v-for="(_expand, _expand_i) in expand" :key="`expand_${parentsI}_${_expand_i}`">
          <td><vs-checkbox v-model="checked" :vs-value="_expand_i" /></td>
          <td class="text-center">{{ parentsI + 1 }} - {{ _expand_i + 1 }}</td>
          <td>
            <ml-input class="w-full flex-1" v-model="_expand.input_1" placeholder="내용" />
          </td>
          <td>
            <ml-input class="w-full flex-1" v-model="_expand.input_2" placeholder="내용" />
          </td>
          <td>
            <ml-input class="w-full flex-1" v-model="_expand.input_3" placeholder="내용" />
          </td>
          <td>
            <ml-input class="w-full flex-1" v-model="_expand.input_4" placeholder="내용" />
          </td>
        </tr>
      </tbody>
    </table>
  </td>
</template>

<script>
export default {
  props: {
    parentsI: Number,
    value: Array,
  },
  watch: {
    value: {
      handler(value) {
        this.expand = value;
      },
    },
    expand: {
      immediate: true,
      deep: true,
      handler(value) {
        this.$emit("input", value);
      },
    },
  },
  data() {
    return {
      expand: this.value,
      checked: [],
    };
  },
  methods: {
    addRow() {
      this.expand.push({});
    },
    deleteRow() {
      // this.expand.splice(index, 1);
    },
    onChangeAllCheck() {
      if (this.checked.length !== this.expand.length) {
        this.checked = this.expand.map((e, i) => i);
      } else this.checked = [];
    },
  },
};
</script>

<style scoped lang="scss">
.title {
  font-weight: 500;
  font-size: 16px;
  height: 17px;
  line-height: 17px;
  position: relative;
  padding-left: 18px;

  &::before {
    content: "";
    width: 8px;
    height: 8px;
    background: #7e72f2;
    display: block;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 0px;
    border-radius: 100%;
  }

  & > span {
    color: #696d71;
  }
}

.label-text {
  width: 114px;
  font-weight: 500;
  font-size: 14px;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: #f9f9f9;

  &,
  th,
  td {
    border-top: solid 1px #cdcdcd;
    border-bottom: solid 1px #cdcdcd;
  }

  th {
    text-align: center;
    padding: 16px 6px;
  }

  td {
    padding: 6px;
  }
}

.expand {
  background: #fff;
  padding: 0px;
  padding-bottom: 30px;
  table tbody {
    background: #fff;
  }
}
</style>
