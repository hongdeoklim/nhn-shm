<template>
  <div class="search-base search-container">
    <search-label-body :label="label" :label-hidden="!label" :columns="options['gridTemplateColumns']">
      <div>
        <vs-select class="w-full xl:w-32" autocomplete v-model="disaster" @change="change" :disabled="readonly">
          <vs-select-item v-for="(disaster, index) in disasterList" :key="index" :text="disaster.text || disaster.value" :value="disaster.value" />
        </vs-select>
      </div>
    </search-label-body>
  </div>
</template>

<script>
import SearchLabelBody from "@/views/list/components/base/SearchLabelBody.vue";
import {valueDisasters} from "@/util/DisasterDataUtil";

export default {
  name: "SearchDisasterTypes",
  components: {
    SearchLabelBody,
  },
  props: {
    label: {
      default: "재해형태",
      type: String,
    },
    value: String,
    readonly: Boolean,
    query: {
      type: Object,
      default: () => {
        return {
          'dty': '',
        }
      },
    },
    options: Object,
  },
  watch: {
    value(value) {
      this.disaster = value;
    },
  },
  computed: {
    isMobile () {
      return !(this.$store.state.verticalNavMenuWidth === 'default')
    },
    initData() {
      const defaultDisaster = this.options && this.options['default'] ? this.options['default'] : "";
      const _query_keys = Object.keys(this.query)
      const query = this.$route.query;
      const disaster = query[_query_keys[0]];
      if (disaster) {
        try {
          return {
            disaster: disaster || defaultDisaster,
          };
        } catch (e) {}
      }

      return {
        disaster: defaultDisaster,
      };
    },
    disasterList() {
      return [
        {
          text: '전체선택',
          value: ''
        }, ...valueDisasters()
      ];
    },
  },
  data() {
    return {
      disaster: "",
    };
  },
  created() {
    this.disaster = this.initData.disaster;
    this.$emit("input", this.disaster);
  },
  methods: {
    change(data) {
      this.$emit("input", data);
    },
  },
};
</script>
