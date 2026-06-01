<template>
  <vx-card class="search-nav mb-4">
    <vs-row class="flex flex-col xl:flex-row gap-y-4" :class="align">
      <vs-col class="flex-1 flex xl:inline-flex flex-wrap gap-4" vs-align="center">
        <vs-button color="secondary" type="border" icon-pack="feather" icon="icon-filter" @click.prevent.stop="toggleFilterDialog">필터</vs-button>
      </vs-col>
      <div class="flex items-center">
        <div>
          <ml-input class="shadow mr-2" icon-pack="feather" icon="icon-search" icon-after="true"  placeholder="검색 키워드" v-model="keyword" @keyup.enter="onSearchKeyword"/>
        </div>
        <div>
          <vs-button color="secondary" type="border" icon-pack="feather" icon="icon-search" @click.prevent="onSearchKeyword"></vs-button>
        </div>
      </div>
    </vs-row>
    <vs-popup :active.sync="openFilterDialog" title="검색 필터">
      <div class="dialog-body">
        <div v-for="item of setting" :key="item.label">
          <div>{{ item.label }}</div>
          <template>
            <div v-if="item.type === 'select'">
              <vs-select v-model="item.value" autocomplete class="w-full px-1" no-data="일치하는 옵션이 없습니다." @input="updateData">
                <vs-select-item v-for="option in item.options" :key="option" :value="option" :text="option" />
              </vs-select>
            </div>
            <div v-else-if="item.type === 'date'">
              <date-selector v-model="item.value" class="w-full px-1" @change="updateData" />
            </div>
            <div v-else-if="item.type === 'date-range'">
              <date-selector-rang v-model="item.value" class="w-full px-1" />
            </div>
            <div v-else-if="item.type === 'number'" class="flex justify-between">
              <div class="w-full">
                <number-input v-model="item.value.number" class="w-full px-1" @change="updateData" @enter="applyFilter" />
              </div>
              <div>
                <vs-select v-model="item.value.operator" style="width: 100px;" @input="updateData">
                  <vs-select-item v-for="operator in numberOperators" :key="operator.value" :value="operator.value" :text="operator.text" />
                </vs-select>
              </div>
            </div>
            <div v-else>
              <ml-input v-model="item.value" class="w-full px-1" placeholder="검색어를 입력해주세요." @chang="updateData" @keyup.enter="applyFilter" />
            </div>
          </template>
          <div>
            <vs-button color="primary" type="flat" class="p-2" @click="resetFilter(item)" :disabled="isValueEmpty(item.value)">
              <vs-icon class="p-0" icon-pack="feather" icon="icon-trash-2" size="small" color="secondary" />
            </vs-button>
          </div>
        </div>

        <div class="mt-4 flex justify-end">
          <vs-button color="secondary" type="border" @click="toggleFilterDialog">취소</vs-button>
          <vs-button color="secondary" type="border" @click="resetFilterAll">초기화</vs-button>
          <vs-button color="secondary" @click="applyFilter" :disabled="!isSettingChanged">적용</vs-button>
        </div>
      </div>
    </vs-popup>
  </vx-card>
</template>

<script>
import DateSelector from "@/components/selector/DateSelector.vue";
import DateSelectorRang from "@/components/selector/DateSelectorRang.vue";
import NumberInput from "@/components/NumberInput.vue";

export default {
  name: "SearchFilter",
  components: {NumberInput, DateSelectorRang, DateSelector},
  emits: ["update:filter-setting", "on-search", 'on-search-keyword'],
  props: {
    align: String,
    size: String,
    filterSetting: {
      type: Array,
      default: () => [],
    }
  },
  data() {
    return {
      openFilterDialog: false,
      initialSetting: [],
      numberOperators: [
        {text: "같음", value: ""},
        {text: "이상", value: ">="},
        {text: "초과", value: ">"},
        {text: "이하", value: "<="},
        {text: "미만", value: "<"},
        {text: "다름", value: "!="},
      ],
      keyword: "",
    }
  },
  computed: {
    setting: {
      get() {
        for (const item of this.filterSetting) {
          if (item.type) {
            if (item.type === "date-range" && !item.value) {
              item.value = {sDate: "", eDate: ""}
            } else if (item.type === "number" && !item.value) {
              item.value = {number: "", operator: ""}
            }
          }
        }

        return this.filterSetting;
      },
      set(value) {
        this.$emit("update:filter-setting", value);
      }
    },
    isSettingChanged() {
      return JSON.stringify(this.initialSetting) !== JSON.stringify(this.setting);
    }
  },
  // watch: {
  //   setting: {
  //     immediate: true,
  //     deep: true,
  //     handler(value) {
  //       console.log("watch", value);
  //       this.$emit("update:filterSetting", value);
  //     },
  //   },
  // },
  methods: {
    toggleFilterDialog() {
      this.openFilterDialog = !this.openFilterDialog;
      if (this.openFilterDialog) {
        this.initialSetting = JSON.parse(JSON.stringify(this.filterSetting));
      } else {
        this.setting = JSON.parse(JSON.stringify(this.initialSetting));
      }
    },
    updateData() {
      // this.setting = [...this.setting];
      this.setting = JSON.parse(JSON.stringify(this.setting)); // 깊은 복사
    },
    onSearchKeyword() {
      console.log("onSearchKeyword", this.keyword);
      this.$emit('on-search-keyword', this.keyword);
    },
    resetFilter(item) {
      if (typeof item.value === "object") {
        const keys = Object.keys(item.value);
        keys.forEach((key) => {
          item.value[key] = "";
        });
      } else {
        item.value = "";
      }
      this.updateData();
    },
    /**
     * value 값이 비어있는지 확인한다.
     */
    isValueEmpty(value) {
      if (typeof value === "object") {
        return Object.values(value).every((v) => {
          if (typeof v === "string") {
            return v.trim() === "";
          } else if (v === "") {
            return true;
          } else if (typeof v === 'number') {
            return isNaN(v);
          } else {
            return !v;
          }
        });
      }
      return value === "";
    },
    applyFilter() {
      this.toggleFilterDialog();
      this.$emit("on-search", this.setting);
    },
    resetFilterAll() {
      this.setting.forEach((item) => {
        this.resetFilter(item);
      });

      this.$emit('on-search', this.setting);
    }
  },
};
</script>

<style lang="scss" scoped>
.search-nav {
  border-radius: 0;

  @media (min-width: theme("screens.xl")) {
    border-radius: theme("borderRadius.lg");
  }
}
.dialog-body {
  >div {
    display: grid;
    grid-template-columns: 3fr 7fr auto;
    gap: 1rem;
    align-items: center;
  }
  >div:not(:last-child) {
    margin-bottom: 8px;
  }
}
</style>
