<template>
  <div class="search-base search-container">
    <search-label-body :label="label" :label-hidden="labelHidden" :columns="options['gridTemplateColumns']">
      <div class="search-check-group-body flex flex-wrap items-center gap-4 flex-1">
        <vs-checkbox v-for="(item, index) in list"
                     class="m-0"
                     color="secondary"
                     :vs-value="item.value"
                     :checked="checkList.indexOf(item.value) !== -1"
                     @change="onChangeCheck">{{ item.text || item.value }}</vs-checkbox>
      </div>
    </search-label-body>
  </div>
</template>
<script>
import SearchLabelBody from "@/views/list/components/base/SearchLabelBody.vue";

export default {
  name: "SearchCheckGroup",
  components: {
    SearchLabelBody,
  },
  props: {
    label: String,
    value: Array,
    query: {
      type: Object,
      default: () => {
        return {
          'ck_l': '',
        }
      },
    },
    options: Object,
  },
  watch: {
    value(value) {
      this.checkList = value;
    },
  },
  computed: {
    isMobile () {
      return !(this.$store.state.verticalNavMenuWidth === 'default')
    },
    initData() {
      const defaultYear = this.options && this.options['default'] ? this.options['default'] : "";
      const _query_keys = Object.keys(this.query)
      const query = this.$route.query;
      const checkList = query[_query_keys[0]];
      if (checkList) {
        try {
          return {
            checkList: typeof checkList === 'string' ? [checkList] : checkList,
          };
        } catch (e) {}
      }
      return {
        checkList: defaultYear,
      };
    },
    list() {
      return this.options.list || [];
    },
    selectMaxCount() {
      return this.options ? this.options.selectMaxCount : 1;
    },
    labelHidden () {
      return !(this.isMobile || this.label);
    }
  },
  data() {
    return {
      checkList: this.value || [],
    };
  },
  created() {
    const list = this.initData.checkList
    for (let i = 0; i<list.length; i++) {
      this.onChangeCheck(list[i])
    }
  },
  mounted() {
    // CheckBox 를 선택 후 다시 해제하여 검색하면, 검색이 되지 않는 문제가 있어서 추가함.
    this.$emit("input", this.checkList);
  },
  methods: {
    onChangeCheck(value) {
      const index = this.checkList.indexOf(value);
      if (index === -1) {
        this.checkList.push(value);
      } else {
        this.checkList.splice(index, 1);
      }

      if (this.selectMaxCount > 0 && this.checkList.length > this.selectMaxCount) {
        this.checkList.shift();
      }

      this.$emit("input", this.checkList);
    },
  }
}
</script>
<style lang="scss" scoped>
.search-check-group-body {
  line-height: 38px;
}
</style>
