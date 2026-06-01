<template>
  <div>
    <!-- head -->
    <div class="flex justify-between items-center p-2">
      <h5 style="line-height: 40px">
        <i class="dot" style="width: 8px; height: 8px"></i>
        {{ title }}
      </h5>
      <div v-if="!isPrint && !readonly">
        <slot name="buttons" />
        <vs-button color="secondary" @click="addRow"> 항목추가 </vs-button>
        <vs-button color="secondary" type="border" class="ml-2" @click="deleteRow"> 선택삭제 </vs-button>
      </div>
    </div>
    <table>
      <colgroup>
        <col v-if="!isPrint && !readonly" width="4%" />
        <col v-if="!isPrint && !readonly" width="4%" />
        <col v-for="infoH in infoHeader.length + 3" :key="getHead(infoH)" :width="`${(isPrint || readonly ? 96 : 88) / (infoHeader.length + 3)}%`" />
      </colgroup>
      <thead>
        <tr>
          <th v-if="!isPrint && !readonly" class="select-none">
            <div class="flex justify-center items-center w-full">
              <vs-checkbox :value="0 < list.length && list.length === checkData.length" @click.native="onClickAllCheckBox" />
            </div>
          </th>
          <th v-if="!isPrint && !readonly" class="select-none">순서</th>
          <th v-for="infoH in infoHeader" :key="getHead(infoH)">{{ getHead(infoH) }}</th>
          <th>전일누계</th>
          <th>금일</th>
          <th>누계</th>
        </tr>
      </thead>

      <draggable
        v-model="list"
        tag="tbody"
        :disabled="isPrint || readonly"
        handle=".drag-handle"
        @end="onDragEnd"
      >
        <tr v-for="(item, item_i) in list" :key="item.id">
          <td v-if="!isPrint && !readonly" class="select-none">
            <div class="flex justify-center items-center w-full">
              <vs-checkbox v-if="!item.readonly" v-model="checkData" :vs-value="item.id" />
            </div>
          </td>
          <td v-if="!isPrint && !readonly" class="select-none">
            <div class="flex justify-center items-center w-full">
              <i class="feather icon-move drag-handle cursor-move text-gray-500" title="드래그하여 순서 변경"></i>
            </div>
          </td>
          <td v-for="infoH in infoHeader" :key="getHead(infoH)">
            <p v-if="isPrint" class="print-input my-1">{{ item[getHead(infoH)] }}</p>
            <!-- yesterday가 0보다 크면 읽기 전용으로 표시 -->
            <template v-else-if="typeof infoH === 'object' && infoH.type === 'select' && Number(item.yesterday || 0) > 0">
              <!-- 기타인 경우 구분_기타 값을 표시 -->
              <ml-input
                v-if="item[getHead(infoH)] === '기타' && item[`${getHead(infoH)}_기타`]"
                rows="1"
                class="w-full flex-1 p-1"
                readonly
                :value="item[`${getHead(infoH)}_기타`]"
              />
              <!-- 기타가 아닌 경우 구분 값을 표시 -->
              <ml-input
                v-else
                rows="1"
                class="w-full flex-1 p-1"
                readonly
                :value="item[getHead(infoH)]"
              />
            </template>
            <!-- yesterday가 0이면 기존 방식대로 select 표시 -->
            <template v-else-if="typeof infoH === 'object' && infoH.type === 'select'">
              <CustomOptionSelector
                autocomplete
                class="w-full flex-1 p-1"
                v-model.lazy="item[getHead(infoH)]"
                :options="infoH.option"
                :readonly="item.readonly || readonly"
                @input="changeOption(item_i, item, getHead(infoH))"
              />
              <ml-input
                v-if="item[getHead(infoH)] === '기타'"
                rows="1"
                class="w-full flex-1 p-1"
                placeholder="입력"
                :readonly="item.readonly || readonly"
                v-model.lazy="item[`${getHead(infoH)}_기타`]"
                @input="changeOption(item_i, item, getHead(infoH))"
              />
            </template>
            <ml-input v-else rows="1" class="w-full flex-1 p-1" placeholder="입력" :readonly="item.readonly || readonly" v-model.lazy="item[getHead(infoH)]" />
          </td>
          <td>
            <p v-if="isPrint" class="print-input my-1">{{ item.yesterday }}</p>
            <comma-input v-else readonly class="w-full flex-1 p-1" :placeholder="colPlaceholders[0]" v-model.lazy="item.yesterday" />
          </td>
          <td>
            <p v-if="isPrint" class="print-input my-1">{{ item.today }}</p>
            <comma-input v-else :readonly="readonly" class="w-full flex-1 p-1" :placeholder="colPlaceholders[1]" v-model.lazy="item.today" @input="rowTotal(item)" />
          </td>
          <td>
            <p v-if="isPrint" class="print-input my-1">{{ item.total }}</p>
            <comma-input v-else readonly class="w-full flex-1 p-1" :placeholder="colPlaceholders[2]" v-model.lazy="item.total" />
          </td>
        </tr>
      </draggable>

      <!-- 계  -->
      <tbody>
        <tr>
          <td :colspan="!isPrint && !readonly ? 2 + infoHeader.length : infoHeader.length" style="background: #f9f9f9" class="text-center">계</td>
          <td>
            <p v-if="isPrint" class="print-input my-1">
              {{ allYesterday | comma }}
            </p>
            <CommaInput v-else class="w-full flex-1 p-1" :placeholder="totalPlaceholders[0]" :value="allYesterday" readonly />
          </td>
          <td>
            <p v-if="isPrint" class="print-input my-1">
              {{ allToday | comma }}
            </p>
            <CommaInput v-else class="w-full flex-1 p-1" :placeholder="totalPlaceholders[1]" :value="allToday" readonly />
          </td>
          <td>
            <p v-if="isPrint" class="print-input my-1">{{ total | comma }}</p>
            <CommaInput v-else class="w-full flex-1 p-1" :placeholder="totalPlaceholders[2]" readonly :value="total" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import CustomOptionSelector from "@/components/selector/CustomOptionSelector.vue";
import draggable from 'vuedraggable';

export default {
  components: {
    CustomOptionSelector,
    draggable
  },
  props: {
    title: String,
    isPrint: Boolean,
    infoHeader: Array,
    value: Array,
    colPlaceholders: {
      type: Array,
      default: () => ["", "", ""],
    },
    totalPlaceholders: {
      type: Array,
      default: () => ["", "", ""],
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    // 최대 아이템 개수, 0일 경우 무제한
    maxLength: {
      type: Number,
      default: 0,
    },
    hideBudgetDay: {
      type: Array,
      default: () => [],
    },
  },
  filters: {
    comma(str) {
      return `${str}`.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
  data() {
    return {
      list: this.value,
      checkData: [],
      isUpdatingFromValue: false,
    };
  },
  computed: {
    allYesterday() {
      const _yd = this.list.reduce((prev, data) => {
        if (data.yesterday) return prev + Number(data.yesterday);
        else return prev;
      }, 0);
      return _yd;
    },
    allToday() {
      const _td = this.list.reduce((prev, data) => {
        if (data.today) return prev + Number(data.today);
        else return prev;
      }, 0);
      return _td;
    },
    total() {
      // const _tt = this.list.reduce((prev, data) => {
      //   if (!!data.total) return prev + Number(data.total);
      //   else return prev;
      // }, 0);
      // return _tt;
      return this.allYesterday + this.allToday;
    },
  },
  watch: {
    value: {
      deep: true,
      handler(value) {
        // 길이와 ID를 비교하여 실제로 변경되었는지 확인
        if (value && this.list && value.length === this.list.length) {
          const isSame = value.every((item, idx) => {
            return item.id === (this.list[idx] ? this.list[idx].id : null);
          });
          if (isSame) {
            return; // 동일한 항목들이면 업데이트하지 않음
          }
        }

        // 데이터 업데이트가 부모(value prop)로부터 시작되었음을 알리는 플래그를 설정합니다.
        this.isUpdatingFromValue = true;

        // value prop을 기반으로 내부 list를 업데이트하며, index 속성을 보존하거나 추가합니다.
        this.list = value.map((item, idx) => ({
          ...item,
          index: item.index || idx + 1,
        }));

        // list 업데이트가 완료된 후, 다음 틱에서 플래그를 해제하여 사용자 입력에 의한 변경을 감지할 수 있도록 합니다.
        this.$nextTick(() => {
          this.isUpdatingFromValue = false;
        });
      },
    },
    list: {
      deep: true,
      handler(value) {
        // 부모로부터 데이터가 업데이트되는 중이면, 다시 부모로 이벤트를 보내지 않아 무한 루프를 방지합니다.
        if (this.isUpdatingFromValue) {
          return;
        }
        this.$emit("input", value); // 내부 list의 변경사항을 부모 컴포넌트로 전파합니다.
        this.$emit("budgetTotal", {
          yesterday: this.allYesterday,
          today: this.allToday,
          total: this.total,
        });
      },
    },
  },
  mounted() {
    window.addEventListener("setBudgetDayOldData", this.setBudgetDayOldData);
  },
  beforeDestroy() {
    window.removeEventListener("setBudgetDayOldData", this.setBudgetDayOldData);
  },
  methods: {
    getHead(infoH) {
      if (typeof infoH === "object") {
        return infoH.label;
      }
      return infoH;
    },
    // 항목추가
    addRow() {
      if (this.maxLength > 0 && this.list.length >= this.maxLength) {
        alert(`${this.title} 데이터를 더 추가할 수 없습니다`);
        return;
      }

      // isUpdatingFromValue 플래그를 일시적으로 해제하여 list watcher가 실행되도록 함
      this.isUpdatingFromValue = false;

      // 일단 항목을 추가한 뒤, 전체 리스트의 index를 재정렬하여 순서를 보장합니다.
      this.list.push({ id: this.generateRandomString(6), index: 0, yesterday: 0, today: 0, total: 0 });
      this.list.forEach((item, index) => {
        item.index = index + 1;
      });

      // nextTick에서 listChanged 이벤트 발생
      this.$nextTick(() => {
        this.$emit('listChanged', this.list);
      });
    },
    // 선택삭제
    deleteRow() {
      // isUpdatingFromValue 플래그를 일시적으로 해제하여 list watcher가 실행되도록 함
      this.isUpdatingFromValue = false;

      this.list = this.list.filter((item) => {
        if (item.readonly) return true;
        return !this.checkData.includes(item.id);
      });
      // 삭제 후에도 순서가 1, 2, 3... 으로 이어지도록 재정렬합니다.
      this.list.forEach((item, index) => {
        item.index = index + 1;
      });

      this.checkData = [];

      // nextTick에서 listChanged 이벤트 발생
      this.$nextTick(() => {
        this.$emit('listChanged', this.list);
      });
    },
    rowTotal(item) {
      if (item.yesterday) item.total = Number(item.yesterday) + Number(item.today);
      else item.total = Number(item.today);
    },
    onClickAllCheckBox() {
      if (this.list.length === this.checkData.length) this.checkData = [];
      else this.checkData = this.list.map((item) => item.id);
    },
    generateRandomString(num) {
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      let result = "";
      const charactersLength = characters.length;
      for (let i = 0; i < num; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    },
    changeOption(index, item, key) {
      if (!item[key]) return;
      let findItem = null;

      if (item[key] !== "기타") {
        // "기타"가 아닌 경우: 일반적인 검색
        findItem = this.hideBudgetDay.find((_day) => _day[key] === item[key]);
      } else if (item[key] === "기타" && item[`${key}_기타`]) {
        // "기타"이고 구분_기타 값이 있는 경우: 구분_기타로 검색
        findItem = this.hideBudgetDay.find((_day) => {
          if (_day[key] === "기타" && _day[`${key}_기타`] && item[`${key}_기타`]) {
            return _day[`${key}_기타`] === item[`${key}_기타`];
          }
          return false;
        });
      }
      // "기타"이지만 구분_기타 값이 없는 경우: findItem은 null로 유지 (새로 추가하는 항목)

      this.$set(this.list[index], "yesterday", findItem ? findItem.yesterday : 0);
      this.$set(this.list[index], "total", findItem ? Number(item.today || 0) + Number(findItem.yesterday || 0) : item.today || 0);
    },
    setBudgetDayOldData() {
      this.$nextTick(() => {
        this.list.map((item, item_i) => {
          this.changeOption(item_i, item, this.infoHeader[0].label);
        });
      });
    },

    // 드래그 완료 시 호출되는 메서드
    onDragEnd(evt) {
      // 드래그가 완료되면, 리스트의 모든 아이템에 대해 index 값을 업데이트합니다.
      this.list.forEach((item, index) => {
        this.$set(item, 'index', index + 1);
      });
      this.$emit('listChanged', this.list);
      this.$emit('orderChanged', {
        oldIndex: evt.oldIndex,
        newIndex: evt.newIndex,
        list: this.list
      });
    },
  },
};
</script>

<style lang="scss" scoped>
table {
  width: 100%;

  text-align: left;
  font-size: 14px;
  font-weight: 500;
  line-height: 17px;

  border-collapse: collapse;
  margin-bottom: 28px;

  thead {
    th {
      text-align: center;
      font-size: 14px;
      font-weight: 500;
      line-height: 17px;

      background: #f9f9f9;
      border: solid #cdcdcd 1px;
      padding: 16px 6px;
    }
  }
  tbody {
    tr {
      td {
        font-size: 14px;
        font-weight: 500;
        line-height: 17px;
        border: solid #cdcdcd 1px;
      }
    }
  }
}

.drag-handle {
  font-size: 16px;

  &:hover {
    color: #007bff;
  }
}

.sortable-ghost {
  opacity: 0.5;
  background-color: #f0f0f0;
}

.sortable-chosen {
  background-color: #e3f2fd;
}
</style>
