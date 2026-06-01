<template>
  <div class="flex gap-2 w-full">
    <span v-if="label" class="title">{{ label }}</span>
    <div class="flex-1 flex flex-wrap gap-5">
      <vs-checkbox v-model="isAll" @change="onChangeAll">전체</vs-checkbox>
      <vs-checkbox v-for="item in checkItems" :key="item.value" v-model="checked" :vs-value="item.value" @change="onChangeItem">{{ item.label }}</vs-checkbox>
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchNavCompanyIds",
  props: {
    label: { type: String, default: "관련부서" },
    value: Array,
  },
  computed: {
    boardSlug() {
      return `board-${this.$route.params.boardId}`;
    },
  },
  watch: {
    value: {
      handler(value) {
        this.checked = value;
      },
    },
    checked: {
      immediate: true,
      deep: true,
      handler(value) {
        this.$emit("input", value);
      },
    },
  },
  data() {
    return {
      checkItems: [],
      isAll: false,
      checked: [],
    };
  },
  async created() {
    await this.$store.dispatch("board/LOAD_BOARD", {
      boardId: this.boardSlug,
    });
    const boardData = this.$store.state.board.boardData;
    if (boardData) {
      this.checkItems = boardData.filter_companies.map((_com) => {
        return { label: _com.com_name, value: _com.id };
      });
    }
  },
  methods: {
    onChangeAll() {
      if (this.isAll) this.checked = this.checkItems.map((_item) => _item.value);
      else this.checked = [];
    },
    onChangeItem() {
      this.isAll = this.checkItems.length === this.checked.length;
    },
  },
};
</script>
<style lang="scss" scoped>
.title {
  width: 114px;

  font-weight: 500;
  line-height: 38px;
  text-align: left;
  white-space: nowrap;
}
</style>
