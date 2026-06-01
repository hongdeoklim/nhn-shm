<template>
  <div class="search-base search-container">
    <search-label-body :label="label" :label-hidden="!label" :columns="options['gridTemplateColumns']">
      <div>
        <company-selector class="w-full xl:w-48" v-model="companyId" @select="onChangeCompany" />
      </div>
    </search-label-body>
  </div>
</template>

<script>
import SearchLabelBody from "@/views/list/components/base/SearchLabelBody.vue";
import CompanySelector from "@/components/selector/CompanySelector.vue";

export default {
  name: "SearchSelectCompany",
  components: {
    CompanySelector,
    SearchLabelBody,
  },
  props: {
    label: {
      default: "사업장명",
      type: String,
    },
    value: Object,
    readonly: Boolean,
    query: {
      type: Object,
      default: () => {
        return {
          'fId': '',
          'fName': '',
        }
      },
    },
    options: Object,
  },
  watch: {
    value(value) {
      const { companyId, companyName } = value;
      this.companyId = companyId;
      this.companyName = companyName;
    },
  },
  computed: {
    isMobile () {
      return !(this.$store.state.verticalNavMenuWidth === 'default')
    },
    initData() {
      const defaultValue = this.options && this.options['default'] ? this.options['default'] : {companyId: '', companyName: ''};
      const _query_keys = Object.keys(this.query)
      const query = this.$route.query;
      const companyId = query[_query_keys[0]];
      const companyName = query[_query_keys[1]];
      const data = {
        companyId: companyId || defaultValue.companyId,
        companyName: companyName || defaultValue.companyName,
      }
      return data;
    },
  },
  data() {
    return {
      companyId: "",
      companyName: "",
    };
  },
  created() {
    this.companyId = this.initData.companyId;
    this.companyName = this.initData.companyName;
    this.change({
      companyId: this.companyId,
      companyName: this.companyName,
    })
  },
  methods: {
    change(data) {
      this.$emit("input", data);
    },
    onChangeCompany (company) {
      const data = {
        companyId: company.id,
        companyName: company.com_name,
      }
      this.change(data)
    }
  },
};
</script>
