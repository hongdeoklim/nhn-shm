<template>
  <div>
    <label style="display: flex; position: relative; align-items: center">
      <ml-input class="w-full h-full" style="border-radius: 5px" :readonly="readonly" :value="!!selectCompany ? selectCompany.name : ''" @click="handleClickInput" />
      <vs-icon v-if="!readonly" icon-pack="feather" icon="icon-home" style="padding-left: 6px; padding-right: 6px; position: absolute; top: auto; right: 0; bottom: auto; font-size: 24px; border-left: 1px solid #cdcdcd"></vs-icon>
    </label>

    <popup-search-company v-model="showPopup" :listOnly="listOnly" :selectId="!!selectCompany ? selectCompany.id : ''" :field-id="fieldId" @handleClickSelect="handleClickSelect" />
  </div>
</template>

<script>
import PopupSearchCompany from "@/popup/PopupSearchCompany";

export default {
  name: "CompanySelectorObj",
  components: { PopupSearchCompany },
  props: {
    value: [Object, String],
    readonly: Boolean,
    listOnly: {
      type: Boolean,
      default: () => true,
    },
    fieldId: Number,
  },
  data() {
    return {
      showPopup: false,
      selectCompany: this.value,
    };
  },
  watch: {
    value: {
      handler(value) {
        this.selectCompany = value;
      },
    },
    selectCompany: {
      immediate: true,
      deep: true,
      handler(value) {
        this.$emit("input", value);
      },
    },
  },
  methods: {
    handleClickInput() {
      if (!this.readonly) {
        this.showPopup = true;
      }
    },

    handleClickSelect(company) {
      if (this.readonly) {
        // 읽기 전용일 때에는 선택 동작으로 넘어가지 않게 한다.
        return;
      }
      const data = { id: company.id, name: company.com_name };
      this.selectCompany = data;
      this.$emit("select", company);
    },
  },
};
</script>

<style scoped></style>
