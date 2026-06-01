<template>
  <div class="search-base search-container">
    <search-label-body :label="label" :label-hidden="!label" :columns="options['gridTemplateColumns']">
      <div>
        <field-selector class="w-full xl:w-48" v-model="fieldId" @select="onChangeField" />
      </div>
    </search-label-body>
  </div>
</template>

<script>
import SearchLabelBody from "@/views/list/components/base/SearchLabelBody.vue";
import FieldSelector from "@/components/selector/FieldSelector.vue";

export default {
  name: "SearchSelectField",
  components: {
    FieldSelector,
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
      const { fieldId, fieldName } = value;
      this.fieldId = fieldId;
      this.fieldName = fieldName;
    },
  },
  computed: {
    isMobile () {
      return !(this.$store.state.verticalNavMenuWidth === 'default')
    },
    initData() {
      const defaultValue = this.options && this.options['default'] ? this.options['default'] : {fieldId: '', fieldName: ''};
      const _query_keys = Object.keys(this.query)
      const query = this.$route.query;
      const fieldId = query[_query_keys[0]];
      const fieldName = query[_query_keys[1]];
      const data = {
        fieldId: fieldId || defaultValue.fieldId,
        fieldName: fieldName || defaultValue.fieldName,
      }
      return data;
    },
  },
  data() {
    return {
      fieldId: "",
      fieldName: "",
    };
  },
  created() {
    this.fieldId = this.initData.fieldId;
    this.fieldName = this.initData.fieldName;
    this.change({
      fieldId: this.fieldId,
      fieldName: this.fieldName,
    })
  },
  methods: {
    change(data) {
      this.$emit("input", data);
    },
    onChangeField (field) {
      const data = {
        fieldId: field.id,
        fieldName: field.field_name,
      }
      this.change(data)
    }
  },
};
</script>
