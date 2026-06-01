<template>
  <div class="search-base search-container">
    <search-label-body :label="label" :label-hidden="!label" :columns="options['gridTemplateColumns']">
      <div>
        <vs-select class="w-full xl:w-48" autocomplete v-model="company0" @change="onChange1" :disabled="readonly">
          <vs-select-item v-for="(company, index) in companyDepth0" :key="index" :text="company.text" :value="company.value" />
        </vs-select>
      </div>
    </search-label-body>
    <search-label-body
      v-if="company0 && company0 !== '전체'"
      label="2차 분류">
      <div>
        <vs-select class="w-full xl:w-48" autocomplete v-model="company1" @change="onChange2" :disabled="readonly">
          <vs-select-item v-for="(company, index) in companyDepth1" :key="index" :text="company.text" :value="company.value" />
        </vs-select>
      </div>
    </search-label-body>
    <search-label-body
      v-if="company1 && company1 !== '전체'"
      label="3차 분류">
      <div>
        <vs-select class="w-full xl:w-48" autocomplete v-model="company2" @change="onChange3" :disabled="readonly">
          <vs-select-item v-for="(company, index) in companyDepth2" :key="index" :text="company.text" :value="company.value" />
        </vs-select>
      </div>
    </search-label-body>
  </div>
</template>

<script>
import SearchLabelBody from "@/views/list/components/base/SearchLabelBody.vue";

export default {
  name: "SearchSelectCompanyTree",
  components: {
    SearchLabelBody,
  },
  props: {
    label: {
      default: "분기",
      type: String,
    },
    value: Object,
    readonly: Boolean,
    query: {
      type: Object,
      default: () => {
        return {
          'c0': '',
          'c1': '',
          'c2': '',
        }
      },
    },
    options: Object,
  },
  watch: {
    value(value) {
      const { company0, company1, company2 } = value;
      this.company0 = company0;
      this.company1 = company1;
      this.company2 = company2;
    },
  },
  computed: {
    projectId() {
      return parseInt(this.$route.params.proj_id);
    },
    isMobile () {
      return !(this.$store.state.verticalNavMenuWidth === 'default')
    },
    initData() {
      const defaultValue = this.options && this.options['default'] ? this.options['default'] : { company0: null, company1: null, company2: null };
      const _query_keys = Object.keys(this.query)
      const query = this.$route.query;
      const company0 = query[_query_keys[0]];
      const company1 = query[_query_keys[1]];
      const company2 = query[_query_keys[2]];
      const data = {
        company0: company0 || defaultValue.company0,
        company1: company1 || defaultValue.company1,
        company2: company2 || defaultValue.company2,
      }
      return data;
    },
    companyDepth0() {
      const depth = this.companyTree
        .filter((item) => item.depth === 0)
        .map((item) => {
          return {
            value: item.descendant_id,
            text: item.descendant.com_name,
          };
        });
      return [{ value: null, text: "전체" }, ...depth];
    },
    companyDepth1() {
      if (!!this.company0 && this.company0 !== "전체") {
        const depth = this.companyTree
          .filter((item) => {
            return item.depth === 1 && item.company_path.indexOf(`${this.company0}/`) === 0;
          })
          .map((item) => {
            return {
              value: item.descendant_id,
              text: item.descendant.com_name,
            };
          });
        return [{ value: null, text: "전체" }, ...depth];
      } else {
        return [];
      }
    },
    companyDepth2() {
      if (!!this.company1 && this.company1 !== "전체") {
        const depth = this.companyTree
          .filter((item) => {
            return item.depth === 2 && item.company_path.indexOf(`${this.company0}/${this.company1}/`) === 0;
          })
          .map((item) => {
            return {
              value: item.descendant_id,
              text: item.descendant.com_name,
            };
          });
        return [{ value: null, text: "전체" }, ...depth];
      } else {
        return [];
      }
    },
  },
  data() {
    return {
      companyTree: [],
      company0: null,
      company1: null,
      company2: null,
    };
  },
  async created() {
    this.company0 = this.initData.company0;
    this.company1 = this.initData.company1;
    this.company2 = this.initData.company2;
    this.change(this.company0, this.company1, this.company2);

    await this.$store.dispatch("company/LOAD_COMPANY_TREE", { projectId: this.projectId, new: true }).then((result) => {
      this.companyTree = result;
    });
  },
  methods: {
    change(company0, company1, company2) {

      let path = '';
      if (company0) path += `${company0  }/`;
      if (company1) path += `${company1  }/`;
      if (company2) path += `${company1  }/`;

      this.$emit("input", {
        company0,
        company1,
        company2,
        path,
      });
    },
    onChange1 (value1) {
      if (!value1) {
        this.company1 = null;
        this.company2 = null;
      }
      this.change(this.company0, this.company1, this.company2);
    },
    onChange2 (value2) {
      if (!value2) {
        this.company2 = null;
      }
      this.change(this.company0, this.company1, this.company2);
    },
    onChange3 (value3) {
      this.change(this.company0, this.company1, this.company2);
    }
  },
};
</script>
