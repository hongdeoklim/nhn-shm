<template>
  <vx-card id="daily-comparison-card">
    <div style="width: 100%; height: 100%; display: grid; grid-template-rows: auto auto minmax(auto, 1fr); align-items: flex-start">
      <div class="flex" style="justify-content: space-between">
        <span class="font-bold" style="font-size: 14px"><i class="dot"></i>{{ title }}</span>

        <div v-if="dateType === 'yyyy-mm'" class="flex" style="gap: 12px">
          <vs-select style="width: 80px" v-model="selectYear" autocomplete @change="onChangeYear">
            <vs-select-item v-for="n in nowYear - 2020 + 1" :key="`graph2_year_${n}`" :value="nowYear - (n - 1)" :text="`${nowYear - (n - 1)}년`" />
          </vs-select>
          <vs-select style="width: 80px" v-model="selectMonth" autocomplete @change="onChangeMonth">
            <vs-select-item v-for="n in 12" :key="`graph2_month_${n}`" :value="n" :text="`${n}월`" />
          </vs-select>
        </div>

        <div v-else class="flex" style="gap: 12px">
          <date-selector v-model="selectBeginDate" @change="onChangeDate" />
          <span class="flex" style="align-items: center">~</span>
          <date-selector v-model="selectEndDate" @change="onChangeDate" />
        </div>
      </div>

      <div class="grid lg:flex flex-wrap grid-cols-3 gap-2 mt-6 lg:mt-2">
        <slot name="tools"></slot>
      </div>

      <div class="w-full flex mt-6 flex-col" style="">
        <div v-for="index in perPage" class="flex flex-col" style="margin-top: 15px" :key="index" :set="(item = graphList[index - 1])">
          <div class="flex w-full justify-between" style="">
            <div>{{ item ? item.name : "" }}</div>
            <div>{{ item ? item.budgetExeRate : "&nbsp;" }}</div>
          </div>
          <div class="relative w-full" style="background-color: #f2f2f2; height: 7px; margin-top: 7px" :style="{ visibility: item ? 'visible' : 'hidden' }">
            <div class="absolute h-full" :style="{ backgroundColor: '#26d6eb', width: `${item ? getPercent(item.budgetExeRate) : '0%'}` }"></div>
          </div>
        </div>
      </div>

      <div class="vs-con-table">
        <div class="con-pagination-table vs-table--pagination">
          <k-pagination :total="Math.floor(list.length / perPage) + 1" v-model="page" @change="onChangePage" />
        </div>
      </div>
    </div>
  </vx-card>
</template>

<script>
import TableListPage from "@/views/list/TableListPage";
import DailyComparisonUtil from "@/util/DailyComparisonUtil";
import BasicBarGraph from "@/components/BasicBarGraph";
import KPagination from "@/components/kPagination/kPagination";
import DateSelector from "@/components/selector/DateSelector";
export default {
  name: "BudgetExecutionRateCard",
  components: {
    DateSelector,
    KPagination,
    BasicBarGraph,
    TableListPage,
  },
  props: {
    title: String,
    unit: String,
    year: Number,
    month: Number,
    beginDate: String,
    endDate: String,
    list: {
      type: Array,
      default: () => [],
    },
    dateType: String,
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

    graphMax() {
      const unit = 5;

      let max = unit;
      if (this.list.length > 0) {
        for (const data of this.list) {
          max = Math.max(data.value, max);
        }
      }
      return (Math.floor((max - 1) / unit) + 1) * unit;
    },

    graphList() {
      const perPage = this.perPage;
      const index = (this.page - 1) * perPage;
      const list = JSON.parse(JSON.stringify(this.list));
      return list.splice(index, perPage);
    },
  },
  data() {
    return {
      page: 1,
      perPage: 10,

      selectBeginDate: this.beginDate,
      selectEndDate: this.endDate,
      selectYear: this.year,
      selectMonth: this.month,
    };
  },
  methods: {
    onChangeYear(year) {
      this.$emit("change", year, this.month);
    },
    onChangeMonth(month) {
      this.$emit("change", this.year, month);
    },
    onChangeDate(beginDate) {
      this.$emit("change", this.selectBeginDate, this.selectEndDate);
    },

    getGraphCol(index, value) {
      if (index === 0) return value.no;
      if (index === 1) return value.name;
      if (index === 2) return `${this.comma(value.value)} ${this.unit}`;

      if (index === 3) {
        if (this.$route.params.boardId === "50") {
          return `${value.sum ? this.comma(value.sum) : "0"} 원`;
        } else if (this.$route.params.boardId === "35") {
          return `${value.sum ? this.comma(value.sum) : "0"} 명`;
        } else {
          return {
            value: `${this.comma(value.gap)} ${this.unit}`,
            type: value.gap > 0 ? "up" : value.gap < 0 ? "down" : "forward",
          };
        }
      }

      return "";
    },

    onClickDetail(value, target, route) {
      const fieldName = value.사업장명;

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
    getPercent(str) {
      const num = parseFloat(str);
      if (num > 100) {
        return "100%";
      }
      return `${num}%`;
    },

    onChangePage(page) {},
  },
};
</script>

<style>
#daily-comparison-card,
#daily-comparison-card .vx-card__collapsible-content,
#daily-comparison-card .vx-card__collapsible-content .vx-card__body {
  height: 100% !important;
}
</style>
