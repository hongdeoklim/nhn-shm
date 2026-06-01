<template>
  <div class="search-base search-container">
    <search-label-body :label="label" :label-hidden="!label" :columns="options['gridTemplateColumns']">
      <div>
        <vs-select class="w-full xl:w-32" autocomplete v-model="head" @change="onChangeData" :disabled="readonly">
          <vs-select-item v-for="(item, index) in list" :key="index" :text="item" :value="item" />
        </vs-select>
      </div>
    </search-label-body>
    <search-label-body label="검색어" :label-hidden="keywordLabelHidden" :columns="options['gridTemplateColumns']">
      <div>
        <ml-input
          class="w-full xl:w-48"
          icon-pack="feather"
          icon="icon-search"
          placeholder="검색어를 입력하세요."
          v-model="keyword"
          @change="onChangeData"
          @keyup.enter="onKeyup"
        />
      </div>
    </search-label-body>
  </div>
</template>

<script>
import singlePageList from "@/views/boards/single-page/listIndex";
import "./scss/base.scss";
import SearchLabelBody from "@/views/list/components/base/SearchLabelBody.vue";

export default {
  name: "SearchColumnKeyword",
  components: {
    SearchLabelBody
  },
  props: {
    label: {
      default: "검색조건",
      type: String,
    },
    value: Object | String,
    readonly: Boolean,
    query: {
      type: Object,
      default: () => {
        return {
          '_ck_type': '',
          '_ck_keyword': '',
        }
      },
    },
    options: Object,
    onClickSearch: Function,
  },
  computed: {
    isMobile () {
      return !(this.$store.state.verticalNavMenuWidth === 'default')
    },
    projectId() {
      return this.$route.params.proj_id;
    },
    boardId() {
      return this.$route.params.boardId;
    },
    list() {
      const hiddenList = this.options ? (this.options.hiddenList || []) : [];
      const list = singlePageList[`${this.boardId}_list`].getHead(this.projectId);
      if (list && list.length > 0) {
        const _list = [];
        for (const item of list) {
          if (hiddenList.indexOf(item.name) === -1) {
            _list.push(item.name)
          }
        }
        return _list;
      }
      return [];
    },
    initData() {
      const _query_keys = Object.keys(this.query)
      const query = this.$route.query;
      const query_head = query[_query_keys[0]];
      const query_keyword = query[_query_keys[1]];
      const data = {
        head: query_head || "",
        keyword: query_keyword || "",
      }
      if (!data.head && this.list && this.list.length > 0) {
        data.head = this.list[0];
      }
      return data;
    },

    keywordLabelHidden() {
      return !this.isMobile
    },
  },
  watch: {
    value(value) {
      const { head, keyword } = value;
      this.head = head;
      this.keyword = keyword;
    },
  },
  data() {
    return {
      head: "",
      keyword: "",
    };
  },
  created() {
    this.head = this.initData.head;
    this.keyword = this.initData.keyword;
    this.$emit("input", { head: this.head, keyword: this.keyword });
  },
  methods: {
    onChangeData() {
      this.$emit("input", { head: this.head, keyword: this.keyword });
      this.$emit("change", { head: this.head, keyword: this.keyword });
    },
    onKeyup() {
      this.onChangeData();
      if (this.onClickSearch) {
        this.onClickSearch();
      }
    }
  },
};
</script>
