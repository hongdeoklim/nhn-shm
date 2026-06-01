<template>
  <div>
    <label style="display: flex; position: relative; align-items: center">
      <ml-input class="w-full h-full" style="border-radius: 5px" :readonly="readonly" :value="selectCompany.id ? selectCompany.com_name : selectCompanyName" @click="handleClickInput" />
      <vs-icon v-if="!readonly || useCompanyPopup" icon-pack="feather" icon="icon-home" style="padding-left: 6px; padding-right: 6px; position: absolute; top: auto; right: 0; bottom: auto; font-size: 24px; border-left: 1px solid #cdcdcd"></vs-icon>
    </label>

    <popup-search-company v-model="showPopup" :title="popupTitle" :listOnly="listOnly" :selectId="selectCompany.id ? selectCompany.id : selectCompanyId" :field-id="fieldId" :onlyRelated="onlyRelated" @handleClickSelect="handleClickSelect" />
    <popup-edit-company v-model="showEditPopup" :company-id="value" :title="'업체 정보 수정'" @saved="handleEditSaved" @close="handleEditClose" @error="handleEditError" />
  </div>
</template>

<script>
import PopupSearchCompany from "@/popup/PopupSearchCompany";
import PopupEditCompany from "@/popup/PopupEditCompany";

export default {
  name: "CompanySelector",
  components: { PopupSearchCompany, PopupEditCompany },
  props: {
    value: [Number, String],
    useName: Boolean,
    readonly: Boolean,
    listOnly: {
      type: Boolean,
      default: true,
    },
    onlyRelated: {
      type: Boolean,
      default: false,
    },
    fieldId: Number,
    popupTitle: {
      type: String,
      default: "업체검색",
    },
    // 업체 정보를 수정하는 팝업을 표시할지 여부
    useCompanyPopup: {
      type: Boolean,
      default: false,
    }
  },
  watch: {
    value(data) {
      this.value = data;
      if (data && !this.selectCompany.id) {
        this.fetchCompanyDetail(data);
      }
    },
  },
  computed: {
    selectCompany() {
      const list = this.$store.state.company.companyList;
      for (const company of list) {
        if (company.id === this.value) {
          return company;
        }
      }
      return { id: null, com_name: this.selectCompanyName };
    },
  },
  data() {
    return {
      showPopup: false,
      showEditPopup: false,
      selectCompanyName: "",
      selectCompanyId: "",
    };
  },
  created() {
    if (this.value && !this.selectCompany.id) {
      this.fetchCompanyDetail(this.value);
    }
  },
  methods: {
    fetchCompanyDetail(companyId) {
      if (!companyId) return;

      this.$store.dispatch("company/LOAD_COMPANY", { companyId })
        .then(response => {
          if (response) {
            this.selectCompanyName = response.com_name;
            this.selectCompanyId = response.id;
          }
        })
        .catch(error => {
          console.error("업체 정보 조회 실패:", error);
        });
    },

    handleClickInput() {
      if (!this.readonly) {
        this.showPopup = true;
      } else if (this.useCompanyPopup) {
        // 업체 정보를 수정하는 팝업을 표시한다
        this.showEditPopup = true;
      }
    },

    handleClickSelect(company) {
      if (this.readonly) {
        // 읽기 전용일 때에는 선택 동작으로 넘어가지 않게 한다
        return;
      }
      this.selectCompanyName = company.com_name;
      this.selectCompanyId = company.id;
      if (this.useName) {
        this.$emit("input", company.com_name);
      } else {
        this.$emit("input", company.id);
      }
      this.$emit("select", company);
    },

    handleEditSaved() {
      // 업체 정보가 업데이트 되었을 때 최신 정보를 다시 로드
      this.fetchCompanyDetail(this.value);
      this.$emit("company-updated");
    },

    handleEditClose() {
      this.showEditPopup = false;
    },

    handleEditError(message) {
      this.$emit("error", message);
    }
  },
};
</script>

<style scoped></style>
