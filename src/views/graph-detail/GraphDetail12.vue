<template>
  <vs-row class="px-3 xl:px-0">
    <!-- 그래프 1 -->
    <vs-col class="w-full pb-4">
      <monthly-chart-card :title="graph1.title" :year="graph1.year" :data1="graph1.data1" :data2="graph1.data2" @change="yearChangeForGraph1" />
    </vs-col>

    <div class="w-full grid grid-cols-1 lg:grid-cols-2 gap-x-2 gap-y-4 mb-4">
      <!-- 그래프 2-->
      <vs-col>
        <monthly-comparison-card :title="graph2.title" :year="graph2.year" :month="graph2.month" :unit="graph2.unit" :heads="graph2.heads" :list="graph2.list" :getCol="getColForGraph2" @change="dateChangeForGraph2">
          <template v-if="projectId" slot="tools" :set="(lv = getLevel)">
            <vs-button v-if="lv === 1 || lv === 2 || lv === 3" class="py-3 px-0 lg:px-8" type="border" color="secondary" @click="dataTypeChangeForGraph2('company')">{{ lv === 3 ? "하도급업체" : "공사관리부" }}</vs-button>
            <vs-button v-if="lv === 1 || lv === 2" class="py-3 px-0 lg:px-8" type="border" color="secondary" @click="dataTypeChangeForGraph2('field')">현장</vs-button>
            <vs-button class="py-3 px-0 lg:px-8" type="border" color="secondary" @click="dataTypeChangeForGraph2('detail')">점검대상</vs-button>
          </template>
        </monthly-comparison-card>
      </vs-col>

      <!-- 그래프 3 -->
      <vs-col>
        <daily-comparison-card :title="graph3.title" :unit="graph3.unit" :begin-date="graph3.beginDate" :end-date="graph3.endDate" :list="graph3.list" @change="dateRangeChangeForGraph3">
          <template v-if="projectId" slot="tools" :set="(lv = getLevel)">
            <vs-button v-if="lv === 1 || lv === 2 || lv === 3" class="py-3 px-0 lg:px-8" type="border" color="secondary" @click="dataTypeChangeForGraph3('company')">{{ lv === 3 ? "하도급업체" : "공사관리부" }}</vs-button>
            <vs-button v-if="lv === 1 || lv === 2" class="py-3 px-0 lg:px-8" type="border" color="secondary" @click="dataTypeChangeForGraph3('field')">현장</vs-button>
            <vs-button class="py-3 px-0 lg:px-8" type="border" color="secondary" @click="dataTypeChangeForGraph3('detail')">점검대상</vs-button>
          </template>
        </daily-comparison-card>
      </vs-col>
    </div>
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
  name: "GraphDetail12",
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
      boardIds: [100, 112, 163, 216, 217, 218, 219, 220, 221, 326, 327, 328, 391], //[110, 164],
      summaryKey: ["안전보건점검_점검표", "count"],
      graph1: {
        title: "전체 안전보건 점검 현황",
        year: new Date().getFullYear(),
        data1: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 선택한 년도
        data2: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 선택한 년도의 이전 년도
      },
      graph2: {
        title: "월별 안전보건 점검 현황",
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        unit: "",
        heads: [{ name: "No." }, { name: "분야명" }, { name: "건" }, { name: "전월대비 증감" }],
        list: [],
        dataType: this.$route.params.proj_id ? "detail" : "project",
      },
      graph3: {
        title: "기간별 안전보건 점검 현황",
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
      const summaryKey = this.summaryKey;
      const dataList = []
      for (const boardId of this.boardIds) {
        const data = await this.loadGraph1Piece(boardId, summaryKey)
        dataList.push(data)
      }
      //const data1 = await this.loadGraph1Piece(this.boardIds[0], summaryKey);
      //const data2 = await this.loadGraph1Piece(this.boardIds[1], summaryKey);

      let value = {
        data1: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        data2: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }
      for (const data of dataList) {
        value = GraphUtil.combine월별총합막대그래프(value, data)
      }
      //const value = GraphUtil.combine월별총합막대그래프(data1, data2);
      this.graph1.data1 = value.data1;
      this.graph1.data2 = value.data2;
    },
    async loadGraph1Piece(boardId, summaryKey) {
      const summaryKey1 = summaryKey;
      const value = await this.$store
        .dispatch("summary/FIRA_LOAD_SUMMARY", {
          boardId,
          projectIds: this.projectId ? [this.projectId] : [],
          beginAt: `${this.graph1.year - 1}-01-01 00:00:00`,
          endAt: `${this.graph1.year}-12-31 23:59:59`,
        })
        .then((value) => {
          return GraphUtil.getDataMonthlyBarGraph(value, this.graph1.year, summaryKey1);
        });
      return value;
    },
    yearChangeForGraph1(year) {
      this.graph1.year = year;
      this.loadGraph1();
    },

    // 그래프 2
    async loadGraph2() {
      const dataType = this.graph2.dataType;
      let summaryKey = ["안전보건점검_점검표", "count"];
      if (dataType === "field") {
        summaryKey = ["안전보건점검_현장명", "count"];
      }
      const dataList = []
      for (const boardId of this.boardIds) {
        const data = await this.loadGraph2Piece(boardId, summaryKey)
        dataList.push(data)
      }
      //const data1 = await this.loadGraph2Piece(this.boardIds[0], summaryKey);
      //const data2 = await this.loadGraph2Piece(this.boardIds[1], summaryKey);


      let value = {}
      for (const data of dataList) {
        value = MonthlyComparisonUtil.sumValueFromEachCompany(value, data)
      }
      //const value = MonthlyComparisonUtil.sumValueFromEachCompany(data1, data2);

      if (dataType === "company") {
        this.graph2.heads = [{ name: "No." }, { name: "관련부서" }, { name: "건(명)" }, { name: "전월대비 증감" }];

        // 현장의 경우 부서명 변경
        if (this.getLevel === 3) {
          this.graph2.heads[1] = { name: "하도급업체명" };
        }
      } else if (dataType === "field") {
        this.graph2.heads = [{ name: "No." }, { name: "현장명" }, { name: "건(명)" }, { name: "전월대비 증감" }];
      } else if (dataType === "detail") {
        this.graph2.heads = [{ name: "No." }, { name: "점검대상" }, { name: "건(명)" }, { name: "전월대비 증감" }];
      }

      this.graph2.list = MonthlyComparisonUtil.moduleWithData(value);
    },
    async loadGraph2Piece(boardId, summaryKey) {
      const value = await this.$store
        .dispatch("summary/FIRA_LOAD_SUMMARY", {
          boardId,
          projectIds: this.projectId ? [this.projectId] : [],
          beginAt: `${this.graph2.year}-01-01 00:00:00`,
          endAt: `${this.graph2.year}-12-31 23:59:59`,
        })
        .then((value) => {
          if (this.graph2.dataType === "project") {
            return MonthlyComparisonUtil.getProjectFromEachProject(value, this.graph2.year, this.graph2.month, summaryKey);
          } else if (this.graph2.dataType === "company") {
            return MonthlyComparisonUtil.getCompanyFromEachCompany(value, this.graph2.year, this.graph2.month, summaryKey);
          } else {
            return MonthlyComparisonUtil.getColumnFromEachCompany(value, this.graph2.year, this.graph2.month, summaryKey);
          }
        });
      return value;
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
      let summaryKey = ["안전보건점검_점검표", "count"];
      if (this.graph3.dataType === "field") {
        summaryKey = ["안전보건점검_현장명", "count"];
      }
      const dataList = []
      for (const boardId of this.boardIds) {
        const data = await this.loadGraph3Piece(boardId, summaryKey)
        dataList.push(data)
      }
      //const data1 = await this.loadGraph3Piece(this.boardIds[0], summaryKey);
      //const data2 = await this.loadGraph3Piece(this.boardIds[1], summaryKey);

      let value = {}
      for (const data of dataList) {
        value = DailyComparisonUtil.sumValueFromEachCompany(value, data)
      }
      //const value = DailyComparisonUtil.sumValueFromEachCompany(data1, data2);

      this.graph3.list = GraphUtil.moduleWithData(value);
    },
    async loadGraph3Piece(boardId, summaryKey) {
      const beginAt = new Date(this.graph3.beginDate).format("yyyy-MM-dd 00:00:00");
      const endAt = new Date(this.graph3.endDate).format("yyyy-MM-dd 23:59:59");

      const value = await this.$store
        .dispatch("summary/FIRA_LOAD_SUMMARY", {
          boardId,
          projectIds: this.projectId ? [this.projectId] : [],
          beginAt,
          endAt,
        })
        .then((value) => {
          if (this.graph3.dataType === "project") {
            return DailyComparisonUtil.getProjectFromEachProject(value, summaryKey);
          } else if (this.graph3.dataType === "company") {
            return DailyComparisonUtil.getCompanyFromEachCompany(value, summaryKey);
          } else {
            return DailyComparisonUtil.getColumnFromEachCompany(value, summaryKey);
          }
        });

      return value;
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
