<template>
  <div>
    <div class="lg:hidden absolute top-0 left-0 flex items-center gap-2 px-3 xl:px-0" style="background: #fafafa" @click="$router.go(-1)">
      <img src="@/assets/icons/arrow_left_black.svg" />
      <h2 style="color: #3c3c3c">{{ getTitle }}</h2>
    </div>

    <component :is="getComponent" :comGroupList="comGroupList" />
  </div>
</template>

<script>
import ComparisonBarGraph from "@/components/ComparisonBarGraph";
import TableListPage from "@/views/list/TableListPage";
import BasicBarGraph from "@/components/BasicBarGraph";
import KPagination from "@/components/kPagination/kPagination";
import DateSelector from "@/components/selector/DateSelector";
import SearchNavItemSelect from "@/components/nav/SearchNavItemSelect";

export default {
  name: "Index",
  components: {
    SearchNavItemSelect,
    DateSelector,
    KPagination,
    BasicBarGraph,
    TableListPage,
    ComparisonBarGraph,
    GraphDetailNone: () => import("@/views/graph-detail/GraphDetailNone"),
    GraphDetail01: () => import("@/views/graph-detail/GraphDetail01"),
    GraphDetail02: () => import("@/views/graph-detail/GraphDetail02"),
    GraphDetail03: () => import("@/views/graph-detail/GraphDetail03"),
    GraphDetail04: () => import("@/views/graph-detail/GraphDetail04"),
    GraphDetail05: () => import("@/views/graph-detail/GraphDetail05"),
    GraphDetail06: () => import("@/views/graph-detail/GraphDetail06"),
    GraphDetail07: () => import("@/views/graph-detail/GraphDetail07"),
    GraphDetail08: () => import("@/views/graph-detail/GraphDetail08"),
    GraphDetail09: () => import("@/views/graph-detail/GraphDetail09"),
    GraphDetail10: () => import("@/views/graph-detail/GraphDetail10"),
    GraphDetail11: () => import("@/views/graph-detail/GraphDetail11"),
    GraphDetail12: () => import("@/views/graph-detail/GraphDetail12"),
    GraphDetail13: () => import("@/views/graph-detail/GraphDetail13"),
    GraphDetail14: () => import("@/views/graph-detail/GraphDetail14"),
    GraphDetail15: () => import("@/views/graph-detail/GraphDetail15"),
  },
  async created() {
    await this.loadCompanyList();
  },
  computed: {
    getTitle(){
      const nId = Number(`${this.graphId}`);
      switch (nId) {
        case 5: return '안전보건 예산 현황';
        case 6: return '안전보건 교육';
        case 9: return '정기 위험성평가 현황';
        case 10: return '수시 위험성평가 현황';
        case 12: return '안전보건 점검 현황';
        case 14: return '중대재해 발생 현황';
        default: return '';
      }
    },
    getComponent() {
      let nId = 0;
      try {
        nId = Number(`${this.graphId}`);
      } catch (e) {
        nId = 0;
      }

      if (nId > 0) {
        const id = nId >= 10 ? nId : `0${nId}`;
        return `GraphDetail${id}`;
      } else {
        return "GraphDetailNone";
      }
    },
    comGroupList() {
      const companyTree = this.$store.state.company.companyTree;
      let maxDepth = 0;
      const list = {};
      let hasRootHead = false;
      const headList = [];

      if (companyTree.length > 0) {
        for (const com of companyTree) {
          if (com.descendant) {
            if (com.descendant.com_type === "head") {
              hasRootHead = true;
              headList.push(com.descendant.com_name);
            }
            if (com.depth > maxDepth) {
              maxDepth = com.depth;
            }

            const parentId = com.descendant.parent_id ? com.descendant.parent_id : com.descendant.id;
            //const com_name =
            if (list[`com_${parentId}`]) {
              list[`com_${parentId}`][com.descendant.id] = com.descendant.com_name;
            } else {
              list[`com_${parentId}`] = { [com.descendant.id]: com.descendant.com_name };
            }
          }
        }
      }

      return {
        maxDepth,
        hasRootHead,
        headList,
        list,
      };
    },
    graphId() {
      return Number(this.$route.params.graphId);
    },
    projectList() {
      const list = this.$store.state.project.projectListInfo.data;
      const projectList = [];
      if (list && list.length > 0) {
        for (const proj of list) {
          projectList.push(proj.field_name);
        }
      }
      return projectList;
    },
  },
  methods: {
    async loadCompanyList() {
      const page = 1;
      const perPage = 10000;
      const projectId = this.projectId;
      await this.$store.dispatch("company/LOAD_COMPANY_TREE", { projectId });
      await this.$store.dispatch("company/LOAD_COMPANY_LIST", {
        page,
        perPage,
        comType: "head",
        projectId,
      });
    },
  },
};
</script>

<style lang="scss">
[dir] .vx-card.graph2 .vx-card__collapsible-content .vx-card__body {
  padding: 0 0 1.5rem 0;
}
</style>
