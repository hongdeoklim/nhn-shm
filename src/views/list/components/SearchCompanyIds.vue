<template>
  <div class="search-base search-container">
    <search-label-body :label="label" :label-hidden="!label" :columns="gridTemplateColumns">
      <div class="pt-3">
        <search-nav-company-ids label="" v-model="companies" @input="change"/>
      </div>
    </search-label-body>
  </div>
</template>

<script>
import SearchNavCompanyIds from "@/components/nav/SearchNavCompanyIds.vue";
import SearchLabelBody from "@/views/list/components/base/SearchLabelBody.vue";

export default {
  name: "SearchCompanyIds",
  components: {
    SearchNavCompanyIds,
    SearchLabelBody
  },
  props: {
    label: {
      default: "관련부서",
      type: String,
    },
    value: Array,
    options: Object,
  },
  watch: {
    value(value) {
      this.companies = value;
    },
  },
  computed: {
    isMobile () {
      return !(this.$store.state.verticalNavMenuWidth === 'default')
    },
    initData() {
      const defaultValue = this.options && this.options['default'] ? this.options['default'] : [];
      return {
        companies: defaultValue,
      };
    },
    gridTemplateColumns() {
      return (this.options && this.options['gridTemplateColumns']) || 'auto auto'
    },
  },
  data() {
    return {
      companies: "",
    };
  },
  created() {
    this.companies = this.initData.companies;
    this.$emit("input", this.companies);
  },
  methods: {
    change(data) {
      this.$emit("input", data);
    },
  },

}
</script>

<style scoped>

</style>
