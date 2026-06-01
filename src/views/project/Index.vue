<template>
  <!--  PC -->
  <div v-if="this.verticalNavMenuWidth === 'default'">
    <div class="dashboard-layout-2">
      <home-notification-card title="농협네트웍스 안전·보건 경영 시스템 " :disabled="myInfo.is_superuser >= 1 ? false : true"/>
      <community-healthinfo-card />
      <community-business-news-card />
      <community-work-news-card />
    </div>
    <div class="dashboard-layout-auto">
      <donut-chart01 :dataType="dataType" />
      <!--<donut-chart02 :dataType="dataType"/>-->
      <!--      <donut-chart03 :dataType="dataType"/>-->
      <!--      <donut-chart04 :dataType="dataType"/>-->
      <donut-chart05 :dataType="dataType" />
      <heath-safety-budget-execution-rate-chart :dataType="dataType" />
      <donut-chart06 :dataType="dataType" />
      <!--      <donut-chart07 :dataType="dataType"/>-->
      <!--      <donut-chart08 :dataType="dataType"/>-->
      <donut-chart09 :dataType="dataType" />
      <donut-chart10 :dataType="dataType" />
      <!--      <donut-chart11 :dataType="dataType"/>-->
      <donut-chart12 :dataType="dataType" />
      <!--      <donut-chart13 :dataType="dataType"/>-->
      <donut-chart14 :dataType="dataType" />
    </div>
  </div>

  <div v-else>
    <div class="m-dashboard-menu px-4 mb-4">
      <router-link v-for="menu in mobileCardMenus" :to="menu.url" class="item" style="background: #fff;">
        <div>
          <div class="mt-4 mb-2 flex justify-center">
            <feather-icon :icon="menu.icon" />
          </div>
          <div class="text-center">
            <span style="font-size:0.92rem; font-weight: 500; color: #353535;">{{menu.name}}</span>
          </div>
        </div>
      </router-link>

    </div>
    <vs-card class="m-alarm-list mx-4">
      <div>
        <h5><i class="dot"></i>알림현황 <span>(최근 {{alertList.length}}건)</span> </h5>
      </div>
      <div v-for="alert in alertList" class="mt-3 p-3 board" @click="onClickAlert(alert)">
        <p style="font-size: 13px; color: #000; font-weight: 400">{{alert.message}}</p>
        <p class="mt-2" style="font-size: 12px; color: #696D71; font-weight: 400">{{alert.created_at}}</p>
      </div>
      <div v-if="alertList.length === 0" class="mt-3 p-6 board">
        <p style="font-size: 13px; color: #000; font-weight: 400">미확인 알림이 없습니다</p>
      </div>
    </vs-card>
  </div>
</template>

<script>
import DonutChartCard from "@/components/DonutChartCard";
import HomeNotificationCard from "@/components/HomeNotificationCard";
import CommunityHealthinfoCard from "@/components/CommunityHealthinfoCard";
import CommunityWorkNewsCard from "@/components/CommunityWorkNewsCard";
import CommunityBusinessNewsCard from "@/components/CommunityBusinessNewsCard";
import DonutChart01 from "@/views/graph/DonutChart01";
import DonutChart02 from "@/views/graph/DonutChart02";
import DonutChart03 from "@/views/graph/DonutChart03";
import DonutChart04 from "@/views/graph/DonutChart04";
import DonutChart05 from "@/views/graph/DonutChart05";
import DonutChart06 from "@/views/graph/DonutChart06";
import DonutChart07 from "@/views/graph/DonutChart07";
import DonutChart08 from "@/views/graph/DonutChart08";
import DonutChart09 from "@/views/graph/DonutChart09";
import DonutChart10 from "@/views/graph/DonutChart10";
import DonutChart11 from "@/views/graph/DonutChart11";
import DonutChart12 from "@/views/graph/DonutChart12";
import DonutChart13 from "@/views/graph/DonutChart13";
import DonutChart14 from "@/views/graph/DonutChart14";
import HeathSafetyBudgetExecutionRateChart from '@/views/graph/HeathSafetyBudgetExecutionRateChart.vue'

export default {
  components: {
    HeathSafetyBudgetExecutionRateChart,
    DonutChart14,
    DonutChart13,
    DonutChart12,
    DonutChart11,
    DonutChart10,
    DonutChart09,
    DonutChart08,
    DonutChart07,
    DonutChart06,
    DonutChart05,
    DonutChart04,
    DonutChart03,
    DonutChart02,
    DonutChart01,
    CommunityBusinessNewsCard,
    CommunityWorkNewsCard,
    CommunityHealthinfoCard,
    HomeNotificationCard,
    DonutChartCard,
  },
  data() {
    return {
      rootPath: "",
      alertList: [],
    };
  },
  async created() {
    const paths = this.$route.path.split("/");
    this.rootPath = `/${paths[1]}/${paths[2]}`;
  },
  computed: {
    verticalNavMenuWidth() {
      return this.$store.state.verticalNavMenuWidth;
    },
    mobileCardMenus() {
      if (Number(`${this.projectId}`) === 4) {
        return [
          {
            url: "tab/107/write",
            name: "안전·보건 교육",
            icon: "BookOpenIcon",
            boardId: '107',
          },
          {
            url: "tab/161/write",
            name: "정기 위험성평가",
            icon: "AlertTriangleIcon",
            boardId: '161',
          },
          {
            url: "tab/162/write",
            name: "수시 위험성평가",
            icon: "AlertTriangleIcon",
            boardId: '161',
          },
          {
            url: "tab/246/write",
            name: "안전작업계획서(고위험작업)",
            icon: "EditIcon",
            boardId: '246',
          },
          {
            url: "tab/219/write",
            name: "건설기계·장비별 안전점검표",
            icon: "CheckSquareIcon",
            boardId: '219',
          },
          {
            url: "tab/257/write",
            name: "작업허가서",
            icon: "UserCheckIcon",
            boardId: '257',
          },
          {
            url: "tab/220/write",
            name: "보건 순회점검표",
            icon: "CheckSquareIcon",
            boardId: '220',
          },
        ]
      }
      else if (Number(`${this.projectId}`) === 7) {
        return [
          {
            url: "tab/107/write",
            name: "안전·보건 교육",
            icon: "BookOpenIcon",
            boardId: '107',
          },
          {
            url: "tab/552/write",
            name: "최초 위험성평가",
            icon: "AlertTriangleIcon",
            boardId: '552',
          },
          {
            url: "tab/162/write",
            name: "수시 위험성평가",
            icon: "AlertTriangleIcon",
            boardId: '161',
          },
          {
            url: "tab/100/write",
            name: "합동 안전점검",
            icon: "UsersIcon",
            boardId: '100',
          },
          {
            url: "tab/163/write",
            name: "작업장 순회점검일지",
            icon: "PocketIcon",
            boardId: '163',
          },
        ]
      }
      return []
    },
    projectId() {
      return this.$route.params.proj_id;
    },
    myLv() {
      return parseInt(`${this.$store.state.auth.userInfo.position}`);
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
    companyInfo() {
      return this.$store.state.auth.companyInfo;
    },
    rootCompanyList() {
      const list = [];
      for (const company of this.$store.state.company.companyList) {
        if (company.com_type === "head") {
          list.push(company);
        }
      }
      return list;
    },
    myInfo () {
      return this.$store.state.auth.userInfo
    },
    isAdmin() {
      let isAdmin = false;
      const myInfo = this.$store.state.auth.userInfo;
      isAdmin = isAdmin || parseInt(myInfo.is_superuser) > 0;
      return isAdmin;
    },
    comGroupList() {
      const companyTree = this.$store.state.company.companyTree;
      let maxDepth = 0;
      const list = [];
      let hasRootHead = false;
      const headList = [];

      if (companyTree && companyTree.length > 0) {
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
    dataType() {
      if (Number(`${this.getLevel}`) <= 2) {
        return "field";
      }
      if (Number(`${this.comGroupList.maxDepth}`) === 0) {
        return "detail";
      }
      return "company";
    },
  },
  async mounted() {
    await this.$store.dispatch("member/LOAD_MEMBER_DETAIL");
    await this.loadCompanyList();

    if (this.verticalNavMenuWidth !== 'default') {
      await this.loadAlertList()
    }
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

    async loadAlertList () {

      const options = {
        page_unread: 1,
        per_page_unread: 5,
        days_before_unread: 30,

        page_read: 1,
        per_page_read: 5,
        days_before_read: 30,
      }
      if (JSON.stringify(options) === JSON.stringify(this.apiLastLoadOptions)) {
        // 이전과 동일한 옵션으로 리스트를 불러옵니다.
        return;
      }
      this.apiLastLoadOptions = JSON.parse(JSON.stringify(options));
      await this.$store.dispatch('approval/LOAD_NOTIFICATION_LIST', options)

      const readList = this.$store.state.approval.alertReadList
      const unreadList = this.$store.state.approval.alertUnReadList

      this.alertList = unreadList
    },

    onClickAlert (alert) {
      const data = JSON.parse(alert.data)
      if (data && data.project_id && data.board_id && data.post_id) {
        const projectId = data.project_id
        const boardId = data.board_id
        const postId = data.post_id
        this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`});
      }
    }
  },
};
</script>
<style lang="scss" scoped>
.dashboard-layout-2 {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-bottom: 16px;
  padding: 0 12px;

  @media (min-width: 960px) {
    grid-template-columns: 1fr 1fr;
  }
  @media (min-width: theme("screens.xl")) {
    padding: 0;
  }
}
.dashboard-layout-auto {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  padding: 0 12px;

  @media (min-width: 960px) {
    grid-template-columns: 1fr 1fr;
  }
  @media (min-width: 1310px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
  @media (min-width: 1660px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }

  @media (min-width: theme("screens.xl")) {
    padding: 0;
  }
}

.m-dashboard-menu {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  .item {
    padding: 0.5rem;
    min-height: 100px;
    margin-bottom: 0.0rem;
    box-shadow: 0px 2px 8px 0px #00000021;
    border-radius: 8px;
  }
}
.m-alarm-list {
  width: auto;
  .board {border: 1px solid #CDCDCD;}
}
</style>
