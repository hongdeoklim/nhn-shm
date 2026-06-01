<template>
  <div class="px-3 xl:px-0">
    <!-- 그래프 1 -->
    <vs-col class="w-full pb-4">
      <monthly-chart-card :title="graph1.title" :year="graph1.year" :data1="graph1.data1" :data2="graph1.data2" @change="yearChangeForGraph1" />
    </vs-col>
  </div>
</template>

<script>
import GraphUtil from "@/util/GraphUtil";
import MonthlyChartCard from "@/views/graph-detail/components/MonthlyChartCard";

export default {
  name: "GraphDetail01",
  components: { MonthlyChartCard },
  data() {
    return {
      graph1: {
        title: "전체 내부종사자 현황",
        year: new Date().getFullYear(),
        data1: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 선택한 년도
        data2: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 선택한 년도의 이전 년도
      },
    };
  },
  computed: {
    projectId() {
      return this.$route.params.proj_id;
    },
  },
  async mounted() {
    await this.loadGraph1();
  },
  methods: {
    async loadGraph1() {
      const projectId = this.projectId;
      const data = await this.$store.dispatch("summary/LOAD_SUMMARY_FIELD_COMPANY", { projectId });
      console.log("loadGraph1", data);
    },

    yearChangeForGraph1() {},
  },
};
</script>

<style scoped></style>
