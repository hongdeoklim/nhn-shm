<template>
  <!-- 수급업체 정보 -->
  <div>
    <!-- =========================== Control =========================== -->
    <div>
      <div class="flex justify-between items-center">
        <p class="title mt-5 mb-5">수급업체 정보</p>
        <div v-if="!readonly && !isPrint">
          <vs-button color="secondary" @click="addRow"> 항목추가 </vs-button>
          <vs-button color="secondary" type="border" class="ml-2" @click="deleteRow"> 선택삭제 </vs-button>
        </div>
      </div>
    </div>
    <table id="infoTable">
      <!-- =========================== THEAD =========================== -->
      <thead>
        <th v-if="!readonly && !isPrint"><vs-checkbox :value="this.infoDatas.length !== 0 && this.infoDatas.length === this.checked.length" @change="onChangeAllCheck" /></th>
        <th>No.</th>
        <th>업체명</th>
        <th>대표자</th>
        <th>사업자등록번호</th>
        <th>사업자등록주소</th>
        <th>업태</th>
        <th>업종</th>
        <th>업체담당자</th>
        <th>시설물 점검자</th>
        <th>연락처</th>
        <th style="width: 130px">시스템 사용자 정보</th>
      </thead>
      <!-- =========================== TBODY =========================== -->
      <tbody v-for="(_info, _info_i) in infoDatas" :key="_info_i">
        <tr>
          <td v-if="!readonly && !isPrint"><vs-checkbox v-model="checked" :vs-value="_info_i" /></td>
          <td class="text-center">{{ _info_i + 1 }}</td>
          <td>
            <p v-if="isPrint" class="print-input">{{ _info.input_1 }}</p>
            <ml-input v-else :readonly="readonly" class="w-full flex-1" v-model="_info.input_1" placeholder="내용" />
          </td>
          <td>
            <p v-if="isPrint" class="print-input">{{ _info.input_2 }}</p>
            <ml-input v-else :readonly="readonly" class="w-full flex-1" v-model="_info.input_2" placeholder="내용" />
          </td>
          <td>
            <p v-if="isPrint" class="print-input">{{ _info.input_3 }}</p>
            <ml-input v-else :readonly="readonly" class="w-full flex-1" v-model="_info.input_3" placeholder="내용" />
          </td>
          <td>
            <p v-if="isPrint" class="print-input">{{ _info.input_4 }}</p>
            <ml-input v-else :readonly="readonly" class="w-full flex-1" v-model="_info.input_4" placeholder="내용" />
          </td>
          <td>
            <p v-if="isPrint" class="print-input">{{ _info.input_5 }}</p>
            <ml-input v-else :readonly="readonly" class="w-full flex-1" v-model="_info.input_5" placeholder="내용" />
          </td>
          <td>
            <p v-if="isPrint" class="print-input">{{ _info.input_6 }}</p>
            <ml-input v-else :readonly="readonly" class="w-full flex-1" v-model="_info.input_6" placeholder="내용" />
          </td>
          <td>
            <p v-if="isPrint" class="print-input">{{ _info.input_7 }}</p>
            <ml-input v-else :readonly="readonly" class="w-full flex-1" v-model="_info.input_7" placeholder="내용" />
          </td>
          <td>
            <p v-if="isPrint" class="print-input">{{ _info.input_9 }}</p>
            <ml-input v-else :readonly="readonly" class="w-full flex-1" v-model="_info.input_9" placeholder="내용" />
          </td>
          <td>
            <p v-if="isPrint" class="print-input">{{ _info.input_8 }}</p>
            <ml-input v-else :readonly="readonly" class="w-full flex-1" v-model="_info.input_8" placeholder="내용" />
          </td>
          <!-- 시스템 사용자 정보 버튼 -->
          <td>
            <div class="h-12 flex justify-center items-center cursor-pointer select-none ease-out duration-200" :style="{ transform: _info.arcc ? 'rotate(180deg)' : 'rotate(0deg)' }" @click="() => (_info.arcc = !_info.arcc)">
              <svg width="15" height="8" viewBox="0 0 15 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.167 7.1665L7.50033 0.499838L0.83366 7.16651L14.167 7.1665Z" fill="black" />
              </svg>
            </div>
          </td>
        </tr>
        <tr v-if="_info.arcc">
          <FieldWorkplaceTableExpand :readonly="readonly" :isPrint="isPrint" :parentsI="_info_i" v-model="_info.expand" />
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import FieldWorkplaceTableExpand from "./FieldWorkplaceTableExpand.vue";
export default {
  components: { FieldWorkplaceTableExpand },
  props: {
    readonly: Boolean,
    isPrint: Boolean,
    value: Array,
  },
  watch: {
    value: {
      handler(value) {
        this.infoDatas = value;
      },
    },
    infoDatas: {
      immediate: true,
      deep: true,
      handler(value) {
        this.$emit("input", value);
      },
    },
  },
  data() {
    return {
      infoDatas: this.value,
      checked: [],
    };
  },
  methods: {
    addRow() {
      this.infoDatas.push({ arcc: false, expand: [] });
    },
    deleteRow() {},
    onChangeAllCheck() {
      if (this.checked.length !== this.infoDatas.length) {
        this.checked = this.infoDatas.map((e, i) => i);
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
    trans_info: translateY(-50%);
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
