<template>
  <vs-row>
    <!--  PC -->
    <vs-col v-if="this.verticalNavMenuWidth === 'default'">
      <!--      <div class="flex mb-4" style="justify-content: end;">-->
      <!--        <vs-button color="secondary" @click="()=>{-->
      <!--          this.$router.push({name:'smart-report'})-->
      <!--        }">스마트보고서</vs-button>-->
      <!--      </div>-->
      <div class="dashboard-layout-2">
        <home-notification-card title="농협네트웍스 안전·보건 경영 시스템 " :disabled="myInfo.is_superuser >= 1 ? false : true"/>
        <community-healthinfo-card />
        <community-business-news-card />
        <community-work-news-card />
      </div>
      <div class="dashboard-layout-auto">
        <donut-chart01 dataType="project" />
        <!--<donut-chart02 dataType="project"/>-->
        <!--        <donut-chart03 dataType="project"/>-->
        <!--        <donut-chart04 dataType="project"/>-->
        <donut-chart05 dataType="project" />
        <heath-safety-budget-execution-rate-chart dataType="project" />
        <donut-chart06 dataType="project" />
        <!--        <donut-chart07 dataType="project"/>-->
        <!--        <donut-chart08 dataType="project"/>-->
        <donut-chart09 dataType="project" />
        <donut-chart10 dataType="project" />
        <!--        <donut-chart11 dataType="project"/>-->
        <donut-chart12 dataType="project" />
        <!--        <donut-chart13 dataType="project"/>-->
        <donut-chart14 dataType="project" />
      </div>
    </vs-col>


    <!--  Mobile -->
    <vs-col v-else>
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
    </vs-col>
  </vs-row>
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
      mobileCardMenus: [
        {
          url: {name: 'project-home', params:{proj_id: 1}},
          name: '안전·보건 지원실',
          icon: 'ActivityIcon',
          activeCode: '',
          project_type: '안전·보건 지원실',
        },
        {
          url: {name: 'project-home', params:{proj_id: 4}},
          name: '신축공사현장',
          icon: 'HomeIcon',
          activeCode: '',
          project_type: '신축공사현장',
        },
        {
          url: {name: 'project-home', params:{proj_id: 7}},
          name: '소규모 사업장',
          icon: 'UsersIcon',
          activeCode: '',
          project_type: '소규모 사업장',
        },
      ],
      successLoadGraph: false,
      alertList: [],
    };
  },
  computed: {
    verticalNavMenuWidth() {
      return this.$store.state.verticalNavMenuWidth;
    },
    myInfo () {
      return this.$store.state.auth.userInfo
    },
    username() {
      return this.$store.state.auth.userInfo.username;
    },
  },
  async created() {},
  mounted() {},
  methods: {
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
    },
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
    padding: 0;
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
