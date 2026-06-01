<template>
  <vs-row class="px-3 xl:px-0">
    <!-- 그래프 1 -->
    <vs-col class="w-full pb-4">
      <monthly-chart-card :title="graph1.title" :year="graph1.year" :data1="graph1.data1" :data2="graph1.data2" @change="yearChangeForGraph1" />
    </vs-col>

    <!-- 그래프 2-->
    <vs-col class="w-1/2 pr-2 pb-4">
      <monthly-comparison-card :title="graph2.title" :year="graph2.year" :month="graph2.month" :unit="graph2.unit" :heads="graph2.heads" :list="graph2.list" :getCol="getColForGraph2" @change="dateChangeForGraph2">
        <template v-if="projectId" slot="tools" :set="(lv = getLevel)">
          <vs-button v-if="lv === 1 || lv === 2 || lv === 3" type="border" color="secondary" @click="dataTypeChangeForGraph2('company')">{{ lv === 3 ? "하도급업체" : "공사관리부" }}</vs-button>
          <vs-button v-if="lv === 1 || lv === 2" class="ml-2" type="border" color="secondary" @click="dataTypeChangeForGraph2('field')">현장</vs-button>
          <vs-button class="ml-2" type="border" color="secondary" @click="dataTypeChangeForGraph2('detail')">상세항목</vs-button>
        </template>
      </monthly-comparison-card>
    </vs-col>

    <!-- 그래프 3 -->
    <vs-col class="w-1/2 pl-2 pb-4">
      <daily-comparison-card :title="graph3.title" :unit="graph3.unit" :begin-date="graph3.beginDate" :end-date="graph3.endDate" :list="graph3.list" @change="dateRangeChangeForGraph3">
        <template v-if="projectId" slot="tools" :set="(lv = getLevel)">
          <vs-button v-if="lv === 1 || lv === 2 || lv === 3" type="border" color="secondary" @click="dataTypeChangeForGraph3('company')">{{ lv === 3 ? "하도급업체" : "공사관리부" }}</vs-button>
          <vs-button v-if="lv === 1 || lv === 2" class="ml-2" type="border" color="secondary" @click="dataTypeChangeForGraph3('field')">현장</vs-button>
          <vs-button class="ml-2" type="border" color="secondary" @click="dataTypeChangeForGraph3('detail')">상세항목</vs-button>
        </template>
      </daily-comparison-card>
    </vs-col>
  </vs-row>
</template>

<script>
import GraphUtil from "@/util/GraphUtil";
import MonthlyComparisonUtil from "@/util/MonthlyComparisonUtil";
import MonthlyChartCard from "@/views/graph-detail/components/MonthlyChartCard";
import MonthlyComparisonCard from "@/views/graph-detail/components/MonthlyComparisonCard";
import DailyComparisonCard from "@/views/graph-detail/components/DailyComparisonCard";
import DailyComparisonUtil from "@/util/DailyComparisonUtil";
export default {
  name: "GraphDetail03",
  components: {
    DailyComparisonCard,
    MonthlyComparisonCard,
    MonthlyChartCard,
  },
  props: {
    comGroupList: Object,
  },
  computed: {
    projectId() {
      return this.$route.params.proj_id;
    },
    graphId() {
      return Number(this.$route.params.graphId);
    },
    getLevel() {
      const projects = this.$store.state.member.memberInfo.projects;
      if (projects) {
        for (const proj of projects) {
          if (proj.id == this.projectId && proj.company.length > 0) {
            const path = proj.company[0].pivot.company_path;
            const lv = path.split("/").length - 1;
            return lv;
          }
        }
      }
    },
  },
  data() {
    return {
      boardId: 152,
      summaryKey: ["산업안전보건위원회_구분", "count"],
      graph1: {
        title: "전체 산업안전보건위원회 구성 현황",
        year: new Date().getFullYear(),
        data1: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 선택한 년도
        data2: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 선택한 년도의 이전 년도
      },
      graph2: {
        title: "월별 산업안전보건위원회 구성 현황",
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        unit: "",
        heads: [{ name: "No." }, { name: "분야명" }, { name: "건(명)" }, { name: "전월대비 증감" }],
        list: [],
        summaryKey1: "",
        dataType: this.$route.params.proj_id ? "detail" : "project",
      },
      graph3: {
        title: "기간별 안전보건 예산 현황",
        unit: "",
        beginDate: new Date().format("yyyy-MM-dd"),
        endDate: new Date().format("yyyy-MM-dd"),
        list: [],
        dataType: this.$route.params.proj_id ? "detail" : "project",
      },
    };
  },
  created() {},
  async mounted() {
    await this.$store.dispatch("member/LOAD_MEMBER_DETAIL");
    await this.loadGraph1();
    await this.loadGraph2();
    await this.loadGraph3();
  },
  methods: {
    // 그래프 1
    async loadGraph1() {
      const summaryKey1 = this.summaryKey;
      const value = await this.$store
        .dispatch("summary/FIRA_LOAD_SUMMARY", {
          boardId: this.boardId,
          projectIds: this.projectId ? [this.projectId] : [],
          beginAt: `${this.graph1.year - 1}-01-01 00:00:00`,
          endAt: `${this.graph1.year}-12-31 23:59:59`,
        })
        .then((value) => {
          return GraphUtil.getDataMonthlyBarGraph(value, this.graph1.year, summaryKey1);
        });
      this.graph1.data1 = value.data1;
      this.graph1.data2 = value.data2;
    },
    yearChangeForGraph1(year) {
      this.graph1.year = year;
      this.loadGraph1();
    },

    // 그래프 2
    async loadGraph2() {
      const dataType = this.graph2.dataType; // 'project', 'company', 'field', 'detail'
      let summaryKey1 = ["산업안전보건위원회_구분", "count"];
      if (dataType === "field") {
        summaryKey1 = ["산업안전보건위원회_현장명", "count"];
      }

      const value = await this.$store
        .dispatch("summary/FIRA_LOAD_SUMMARY", {
          boardId: this.boardId,
          projectIds: this.projectId ? [this.projectId] : [],
          beginAt: `${this.graph2.year}-01-01 00:00:00`,
          endAt: `${this.graph2.year}-12-31 23:59:59`,
        })
        .then((value) => {
          if (dataType === "project") {
            return MonthlyComparisonUtil.getProjectFromEachProject(value, this.graph2.year, this.graph2.month, summaryKey1);
          } else if (dataType === "company") {
            return MonthlyComparisonUtil.getCompanyFromEachCompany(value, this.graph2.year, this.graph2.month, summaryKey1);
          } else {
            return MonthlyComparisonUtil.getColumnFromEachCompany(value, this.graph2.year, this.graph2.month, summaryKey1);
          }
        });

      this.graph2.list = MonthlyComparisonUtil.moduleWithData(value);
    },
    getColForGraph2(index, value) {
      if (index === 0) return value.no;
      if (index === 1) return value.name;
      if (index === 2) return value.value;
      if (index === 3) {
        let updown = "default";
        if (value.gap > 0) updown = "up";
        else if (value.gap < 0) updown = "down";
        return { type: updown, value: value.gap };
      }
      return "";
    },
    dateChangeForGraph2(year, month) {
      this.graph2.year = year;
      this.graph2.month = month;
      this.loadGraph2();
    },
    dataTypeChangeForGraph2(dataType) {
      if (this.projectId) {
        this.graph2.dataType = dataType;
        this.loadGraph2();
      }
    },

    // 그래프 3
    async loadGraph3() {
      const dataType = this.graph3.dataType;
      let summaryKey1 = ["산업안전보건위원회_구분", "count"];
      if (dataType === "field") {
        summaryKey1 = ["산업안전보건위원회_현장명", "count"];
      }

      const beginAt = new Date(this.graph3.beginDate).format("yyyy-MM-dd 00:00:00");
      const endAt = new Date(this.graph3.endDate).format("yyyy-MM-dd 23:59:59");

      const value = await this.$store
        .dispatch("summary/FIRA_LOAD_SUMMARY", {
          boardId: this.boardId,
          projectIds: this.projectId ? [this.projectId] : [],
          beginAt,
          endAt,
        })
        .then((value) => {
          if (dataType === "project") {
            return DailyComparisonUtil.getProjectFromEachProject(value, summaryKey1);
          } else if (dataType === "company") {
            return DailyComparisonUtil.getCompanyFromEachCompany(value, summaryKey1);
          } else {
            return DailyComparisonUtil.getColumnFromEachCompany(value, summaryKey1);
          }
        });
      this.graph3.list = GraphUtil.moduleWithData(value);
    },
    dateRangeChangeForGraph3(beginDate, endDate) {
      this.graph3.beginDate = beginDate;
      this.graph3.endDate = endDate;
      this.loadGraph3();
    },
    dataTypeChangeForGraph3(dataType) {
      if (this.projectId) {
        this.graph3.dataType = dataType;
        this.loadGraph3();
      }
    },
  },
};
</script>

<style scoped></style>
