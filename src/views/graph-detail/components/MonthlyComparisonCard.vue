<template>
  <vx-card style="height: 100%">
    <div class="flex flex-col lg:flex-row justify-between gap-y-3">
      <span class="font-bold" style="font-size: 14px"><i class="dot"></i>{{ title }}</span>
      <div class="flex" style="gap: 12px">
        <vs-select style="width: 80px" v-model="selectYear" autocomplete @change="onChangeYear">
          <vs-select-item v-for="n in nowYear - 2020 + 1" :key="`graph2_year_${n}`" :value="nowYear - (n - 1)" :text="`${nowYear - (n - 1)}년`" />
        </vs-select>
        <vs-select style="width: 80px" v-model="selectMonth" autocomplete @change="onChangeMonth">
          <vs-select-item v-for="n in 12" :key="`graph2_month_${n}`" :value="n" :text="`${n}월`" />
        </vs-select>
      </div>
    </div>
    <div class="grid lg:flex flex-wrap grid-cols-3 gap-2 mt-6 lg:mt-2">
      <slot name="tools"></slot>
    </div>

    <table-list-page
      bodyStyle="none"
      :base-column="false"
      :create="false"
      :move-detail="false"
      :approval="false"
      :showNav="false"
      :download="false"
      :list="list"
      :use-list="true"
      :heads="heads"
      :getCol="getGraphCol"
      @detail="onClickDetail"
    />
  </vx-card>
</template>

<script>
import TableListPage from "@/views/list/TableListPage";

export default {
  name: "MonthlyComparisonCard",
  components: { TableListPage },
  props: {
    title: String,
    year: Number,
    month: Number,
    graphId: Number,
    unit: String,
    heads: Array,
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
    getCol: Function,
  },
  computed: {
    projectId() {
      return this.$route.params.proj_id;
    },

    nowYear() {
      return new Date().getFullYear();
    },

    nowMonth() {
      return new Date().getMonth() + 1;
    },
  },
  data() {
    return {
      selectYear: this.year,
      selectMonth: this.month,
    };
  },
  mounted() {},
  methods: {
    onChangeYear(year) {
      this.$emit("change", year, this.month);
    },
    onChangeMonth(month) {
      this.$emit("change", this.year, month);
    },
    getGraphCol(index, value) {
      return this.getCol(index, value);
    },

    onClickDetail(value, target, route) {
      const fieldName = value.현장명;

      if (fieldName) {
        this.$store
          .dispatch("project/LOAD_PROJECT_LIST", {
            page: 1,
            perPage: 100,
          })
          .then((res) => {
            if (res.data) {
              const boardId = this.$route.params.boardId;
              const list = res.data;
              for (const project of list) {
                if (project.field_name === fieldName) {
                  if (boardId === "3") this.$router.push({ name: "list|approval_list", params: { proj_id: project.id, boardSlug: "project_monthly_report" } });
                  else if (boardId === "45") this.$router.push({ name: "list|approval_tab_list|accident", params: { proj_id: project.id, boardSlug: "accident_report" } });
                  else if (boardId === "35") this.$router.push({ name: "project-hse-list-tab", params: { proj_id: project.id, tab: "safety" } });
                  else if (boardId === "50") this.$router.push({ name: "project-plan-partners", params: { proj_id: project.id, tab: "list" } });
                  else if (boardId === "7") this.$router.push({ name: "project-risk-assessment-tab", params: { proj_id: project.id, tab: "first" } });
                  else if (boardId === "10") this.$router.push({ name: "project-risk-permit-tab", params: { proj_id: project.id, tab: "work" } });
                  else if (boardId === "48") this.$router.push({ name: "list|approval_tab_list|safety_check", params: { proj_id: project.id, boardSlug: "safety_check_444" } });
                  else if (boardId === "36") this.$router.push({ name: "project-prevention-request-tab", params: { proj_id: project.id, tab: "safety" } });
                  break;
                }
              }
            }
          });
      }
    },

    comma(str) {
      str = `${str}`;
      if (str && str.length > 0) {
        return str.replace(/,/gi, "").replace(/\B(?=(\d{3})+(?!\d))/gi, ",");
      }
    },
  },
};
</script>

<style scoped></style>
