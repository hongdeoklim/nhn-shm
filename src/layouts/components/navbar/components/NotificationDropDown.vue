<template>
  <!-- NOTIFICATIONS -->
  <vs-dropdown vs-custom-content vs-trigger-click class="cursor-pointer">
    <feather-icon
      icon="BellIcon"
      class="cursor-pointer mt-1"
      :class="this.verticalNavMenuWidth === 'default' ? 'sm:mr-6 mr-2' : 'mr-2'"
      :badge="unreadAlert.total_count" />

    <vs-dropdown-menu class="notification-dropdown dropdown-custom vx-navbar-dropdown">
      <div class="notification-top text-center p-5 bg-primary text-white">
        <h3 class="text-white">{{ unreadAlert.total }}</h3>
        <p class="opacity-75">새로운 알림</p>
      </div>

      <component :is="scrollbarTag" ref="mainSidebarPs" class="scroll-area--nofications-dropdown p-0 mb-10" :settings="settings" :key="$vs.rtl">
        <ul class="bordered-items">
          <li
            v-for="ntf in unreadAlert.data"
            :key="ntf.index"
            class="flex justify-between px-4 py-4 notification cursor-pointer"
            @click="
              () => {
                handleClickAlertDetail(ntf);
              }
            "
          >
            <div class="flex items-start">
              <feather-icon :icon="ntf.icon" :svgClasses="[`text-${ntf.category}`, 'stroke-current mr-1 h-6 w-6']"></feather-icon>
              <div class="mx-2">
                <span class="font-medium block notification-title" v-html="messageTitle(ntf.title)"></span>
                <small>{{ ntf.msg }}</small>
              </div>
            </div>
            <small class="mt-1 whitespace-no-wrap">{{ elapsedTime(ntf.time) }}</small>
          </li>
        </ul>
      </component>

      <div class="checkout-footer fixed bottom-0 rounded-b-lg text-primary w-full p-2 font-semibold text-center border border-b-0 border-l-0 border-r-0 border-solid d-theme-border-grey-light cursor-pointer" @click="handleMoveAlert">
        <span>모든 알림 보기</span>
      </div>
    </vs-dropdown-menu>
  </vs-dropdown>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";

export default {
  components: {
    VuePerfectScrollbar,
  },
  data() {
    return {
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.6,
      },
    };
  },
  computed: {
    projectId() {
      return this.$route.params.proj_id;
    },
    verticalNavMenuWidth() {
      return this.$store.state.verticalNavMenuWidth;
    },
    scrollbarTag() {
      return this.$store.getters.scrollbarTag;
    },
    unreadAlert() {
      let readInfo = this.$store.state.approval.mainAlertUnReadInfo;
      if (readInfo) {
        readInfo = JSON.parse(JSON.stringify(this.$store.state.approval.mainAlertUnReadInfo));

        const list = [];
        if (readInfo.data) {
          for (const alert of readInfo.data) {
            list.push({
              index: alert.id,
              title: alert.message,
              msg: `${this.getProjectName(alert.data)}`,
              icon: "AlertOctagonIcon",
              time: alert.created_at,
              category: "danger",
              data: alert.data,
            });
          }

          readInfo.data = list;

          return readInfo;
        }
      }
      return {
        data: [],
        total_count: 0,
      };
    },
  },
  methods: {
    messageTitle(title) {
      return title.split('"').reduce((prev, _t, _t_i) => {
        if (_t_i % 2) return prev + `<span class="text-danger">"${_t}"</span>`;
        else return prev + _t;
      }, "");
    },
    elapsedTime(startTime) {
      const x = new Date(startTime);
      const now = new Date();
      let timeDiff = now - x;
      timeDiff /= 1000;

      const seconds = Math.round(timeDiff);
      timeDiff = Math.floor(timeDiff / 60);

      const minutes = Math.round(timeDiff % 60);
      timeDiff = Math.floor(timeDiff / 60);

      const hours = Math.round(timeDiff % 24);
      timeDiff = Math.floor(timeDiff / 24);

      const days = Math.round(timeDiff % 365);
      timeDiff = Math.floor(timeDiff / 365);

      const years = timeDiff;

      // 영문
      // if (years > 0) {
      //   return `${years + (years > 1 ? ' Years ' : ' Year ')}ago`
      // } else if (days > 0) {
      //   return `${days + (days > 1 ? ' Days ' : ' Day ')}ago`
      // } else if (hours > 0) {
      //   return `${hours + (hours > 1 ? ' Hrs ' : ' Hour ')}ago`
      // } else if (minutes > 0) {
      //   return `${minutes + (minutes > 1 ? ' Mins ' : ' Min ')}ago`
      // } else if (seconds > 0) {
      //   return seconds > 1 ? `${seconds} sec ago` : 'Just now'
      // }
      // return 'Just Now'

      if (years > 0) {
        return `${years}년 전`;
      } else if (days > 0) {
        return `${days}일 전`;
      } else if (hours > 0) {
        return `${hours}시간 전`;
      } else if (minutes > 0) {
        return `${minutes}분 전`;
      } else if (seconds > 0) {
        return seconds > 1 ? `${seconds}초 전` : "방금";
      }

      return "방금";
    },
    // Method for creating dummy notification time
    randomDate({ hr, min, sec }) {
      const date = new Date();

      if (hr) date.setHours(date.getHours() - hr);
      if (min) date.setMinutes(date.getMinutes() - min);
      if (sec) date.setSeconds(date.getSeconds() - sec);

      return date;
    },

    handleMoveAlert() {
      if (this.projectId) {
        this.$router.push({ name: "project-mypage-alert" });
      } else {
        this.$router.push("/mypage/alert");
      }
    },

    getProjectName(data) {
      if (!data) {
        return "";
      }
      const json = JSON.parse(data);
      const project_name = json.project_name ? json.project_name : "{프로젝트 이름 없음}";
      return `${project_name}`;
    },

    handleClickAlertDetail(data) {
      if (data.data) {
        const ids = [data.index];
        const postInfo = JSON.parse(data.data);
        const projectId = postInfo.project_id;
        const boardId = postInfo.board_id;
        const postId = postInfo.post_id;
        this.$store.dispatch("approval/READ_NOTIFICATION", { ids });
        this.movePost(projectId, boardId, postId);
      }
    },

    movePost(projectId, boardId, postId) {
      /* 안전·보건예산 현황 */
      if (boardId === 3) {
        this.$router.push({ path: `/project/${projectId}/write/report/project_monthly_report/${postId}` });
        return;
      }
      /* 최초 위험성평가 */
      if (boardId === 6) {
        this.$router.push({ path: `/project/${projectId}/risk/assessment/first/${postId}` });
        return;
      }
      /* 정기위험성평가 */
      if (boardId === 7) {
        this.$router.push({ path: `/project/${projectId}/risk/assessment/regular/${postId}` });
        return;
      }
      /* 수시위험성평가 */
      if (boardId === 41) {
        this.$router.push({ path: `/project/${projectId}/risk/assessment/always/${postId}` });
        return;
      }
      /* 위험성평가협의회 */
      if (boardId === 8) {
        this.$router.push({ path: `/project/${projectId}/risk/conference/warning/${postId}` });
        return;
      }
      /* 수시 위험성평가협의회 */
      if (boardId === 42) {
        this.$router.push({ path: `/project/${projectId}/risk/conference/warning-always/${postId}` });
        return;
      }
      /* 산업안전보건위원회 */
      if (boardId === 9) {
        this.$router.push({ path: `/project/${projectId}/risk/conference/safety/${postId}` });
        return;
      }
      /* 작업허가서(내부용) */
      if (boardId === 10) {
        this.$router.push({ path: `/project/${projectId}/risk/permit/work/${postId}` });
        return;
      }
      /* 작업허가서(외부용) */
      if (boardId === 11) {
        this.$router.push({ path: `/project/${projectId}/risk/permit/work_export/${postId}` });
        return;
      }

      /* 안전점검일지 */
      if (boardId === 13) {
        this.$router.push({ path: `/project/${projectId}/risk/check/checklog/${postId}` });
        return;
      }
      /* 안전점검일지 */
      if (boardId === 14) {
        this.$router.push({ path: `/project/${projectId}/risk/check/checklogall/${postId}` });
        return;
      }
      /* 산업재해무재해 */
      if (boardId === 22) {
        this.$router.push({ path: `/project/${projectId}/safety/accident/report/${postId}` });
        return;
      }
      /* 안전용품 현황 */
      if (boardId === 23) {
        this.$router.push({ path: `/project/${projectId}/safety/supplies/${postId}` });
        return;
      }
      /* 건설장비관리 */
      if (boardId === 24) {
        this.$router.push({ path: `/project/${projectId}/safety/equipment/plan/${postId}` });
        return;
      }
      /* 환경일일점검 */
      if (boardId === 28) {
        this.$router.push({ path: `/project/${projectId}/state/check/daily/${postId}` });
        return;
      }
      /* 환경월간점검 */
      if (boardId === 29) {
        this.$router.push({ path: `/project/${projectId}/state/check/monthly/${postId}` });
        return;
      }
      /* 환경지원 */
      if (boardId === 30) {
        this.$router.push({ path: `/project/${projectId}/state/support/${postId}` });
        return;
      }
      /* 환경평가 */
      if (boardId === 31) {
        this.$router.push({ path: `/project/${projectId}/state/evaluation/${postId}` });
        return;
      }
      /* 환경이슈보고 */
      if (boardId === 32) {
        this.$router.push({ path: `/project/${projectId}/state/report/issue/${postId}` });
        return;
      }
      /* 환경사고보고 */
      if (boardId === 33) {
        this.$router.push({ path: `/project/${projectId}/state/report/accident/${postId}` });
        return;
      }

      /* HSE 교육관리 */
      if (boardId === 35) {
        this.$router.push({ path: `/project/${projectId}/hse/list/safety/${postId}` });
        return;
      }
      /* 안전요청 */
      if (boardId === 36) {
        this.$router.push({ path: `/project/${projectId}/prevention/request/safety/${postId}` });
        return;
      }
      /* 환경요청 */
      if (boardId === 39) {
        this.$router.push({ path: `/project/${projectId}/prevention/request/environment/${postId}` });
        return;
      }
      /* 보건요청 */
      if (boardId === 40) {
        this.$router.push({ path: `/project/${projectId}/prevention/request/health/${postId}` });
        return;
      }

      /* 사고보고 */
      if (boardId === 45) {
        this.$router.push({ path: `/project/${projectId}/write/accident/accident_report/${postId}` });
        return;
      }
      /* 산재검토 */
      if (boardId === 46) {
        this.$router.push({ path: `/project/${projectId}/write/accident/accident_review/${postId}` });
        return;
      }

      /* 444점검 */
      if (boardId === 48) {
        this.$router.push({ path: `/project/${projectId}/write/safety_check/safety_check_444/${postId}` });
        return;
      }
      /* 출역장비 */
      if (boardId === 49) {
        this.$router.push({ path: `/project/${projectId}/write/safety_check/safety_check_444/${postId}` });
        return;
      }
      /* 파트너사 계약현황 */
      if (boardId === 50) {
        this.$router.push({ path: `/project/${projectId}/plan/partners` });
        return;
      }
      /* 444점검 */
      if (boardId === 51) {
        this.$router.push({ path: `/project/${projectId}/write/safety_check_partner/safety_check_partner_444/${postId}` });
        return;
      }

      /* 사고조사 보고서 */
      if (boardId === 53) {
        this.$router.push({ path: `/project/${projectId}/tab/${boardId}/write/${postId}` });
        return;
      }
      /* 사고경위서 */
      if (boardId === 54) {
        this.$router.push({ path: `/project/${projectId}/tab/${boardId}/write/${postId}` });
        return;
      }
      /* 목격자 진술서 */
      if (boardId === 55) {
        this.$router.push({ path: `/project/${projectId}/tab/${boardId}/write/${postId}` });
        return;
      }
      /* 실험실 안전사고 보고 */
      if (boardId === 56) {
        this.$router.push({ path: `/project/${projectId}/approval/${boardId}/write/${postId}` });
        return;
      }
      /* 산업재해조사표 */
      if (boardId === 57) {
        this.$router.push({ path: `/project/${projectId}/normal/${boardId}/write/${postId}` });
        return;
      }
      /* 산업안전보건위원회 */
      if (boardId === 58) {
        this.$router.push({ path: `/project/${projectId}/tab/${boardId}/write/${postId}` });
        return;
      }
      /* 안전경영위원회 */
      if (boardId === 59) {
        this.$router.push({ path: `/project/${projectId}/tab/${boardId}/write/${postId}` });
        return;
      }
      /* 안전근로협의체 */
      if (boardId === 60) {
        this.$router.push({ path: `/project/${projectId}/tab/${boardId}/write/${postId}` });
        return;
      }
      /* 안전보건협의체 */
      if (boardId === 61) {
        this.$router.push({ path: `/project/${projectId}/normal/${boardId}/write/${postId}` });
        return;
      }
      /* 아차사고 사례 카드 */
      if (boardId === 62) {
        this.$router.push({ path: `/project/${projectId}/tab/${boardId}/write/${postId}` });
        return;
      }
      /* 아차사고 사례 개선 확인 카드 */
      if (boardId === 63) {
        this.$router.push({ path: `/project/${projectId}/tab/${boardId}/write/${postId}` });
        return;
      }
      /* 실험실 일상 점검표 */
      if (boardId === 64) {
        this.$router.push({ path: `/project/${projectId}/tab/${boardId}/write/${postId}` });
        return;
      }
      /* 실험실 정기 점검표 */
      if (boardId === 65) {
        this.$router.push({ path: `/project/${projectId}/tab/${boardId}/write/${postId}` });
        return;
      }
      /* TAC 안전관리 점검표 */
      if (boardId === 66) {
        this.$router.push({ path: `/project/${projectId}/tab/${boardId}/write/${postId}` });
        return;
      }
      /* 밀폐공간 작업프로그램 평가표 */
      if (boardId === 67) {
        this.$router.push({ path: `/project/${projectId}/tab/${boardId}/write/${postId}` });
        return;
      }
      /* 밀폐공간 작업 전 체크리스트 */
      if (boardId === 68) {
        this.$router.push({ path: `/project/${projectId}/tab/${boardId}/write/${postId}` });
        return;
      }
      /* 고압가스 충전실 안전점검표 */
      if (boardId === 69) {
        this.$router.push({ path: `/project/${projectId}/tab/${boardId}/write/${postId}` });
        return;
      }
      /* 한수단 2호 안전점검표 */
      if (boardId === 70) {
        this.$router.push({ path: `/project/${projectId}/tab/${boardId}/write/${postId}` });
        return;
      }
      /* 잠수 운용 계획서 */
      if (boardId === 71) {
        this.$router.push({ path: `/project/${projectId}/tab/${boardId}/write/${postId}` });
        return;
      }
      /* 잠수작업 전 안전점검표 */
      if (boardId === 72) {
        this.$router.push({ path: `/project/${projectId}/tab/${boardId}/write/${postId}` });
        return;
      }
      /* 잠수 운용 결과서 */
      if (boardId === 73) {
        this.$router.push({ path: `/project/${projectId}/tab/${boardId}/write/${postId}` });
        return;
      }
      /* 중량물·운반기계 안전점검표 */
      if (boardId === 74) {
        this.$router.push({ path: `/project/${projectId}/tab/${boardId}/write/${postId}` });
        return;
      }
      /* 작업장 안전점검표 */
      if (boardId === 75) {
        this.$router.push({ path: `/project/${projectId}/tab/${boardId}/write/${postId}` });
        return;
      }
      /* 부적합 및 시정조치 - 안전 */
      if (boardId === 76) {
        this.$router.push({ path: `/project/${projectId}/tab/${boardId}/write/${postId}` });
        return;
      }
      /* 부적합 및 시정조치 - 보건 */
      if (boardId === 77) {
        this.$router.push({ path: `/project/${projectId}/tab/${boardId}/write/${postId}` });
        return;
      }
      /* 작업중지보고서 - 임직원 */
      if (boardId === 78) {
        this.$router.push({ path: `/project/${projectId}/tab/${boardId}/write/${postId}` });
        return;
      }
      /* 작업중지보고서 - 근로자 */
      if (boardId === 79) {
        this.$router.push({ path: `/project/${projectId}/tab/${boardId}/write/${postId}` });
        return;
      }
      /* 작업중지 조치결과서 - 임직원 */
      if (boardId === 80) {
        this.$router.push({ path: `/project/${projectId}/tab/${boardId}/write/${postId}` });
        return;
      }
      /* 작업중지 조치결과서 - 근로자 */
      if (boardId === 81) {
        this.$router.push({ path: `/project/${projectId}/tab/${boardId}/write/${postId}` });
        return;
      }
      /* 정기 위험성 평가 */
      if (boardId === 82) {
        this.$router.push({ path: `/project/${projectId}/tab/${boardId}/write/${postId}` });
        return;
      }
      /* 수시 위험성 평가 */
      if (boardId === 83) {
        this.$router.push({ path: `/project/${projectId}/tab/${boardId}/write/${postId}` });
        return;
      }
      /* 안전작업허가 - 작업수행부서 */
      if (boardId === 84) {
        this.$router.push({ path: `/project/${projectId}/tab/${boardId}/write/${postId}` });
        return;
      }
      /* 안전작업허가 - 하도급업체 */
      if (boardId === 85) {
        this.$router.push({ path: `/project/${projectId}/tab/${boardId}/write/${postId}` });
        return;
      }
      /* 안전·보건예산 현황 */
      if (boardId === 86) {
        this.$router.push({ path: `/project/${projectId}/approval/${boardId}/write/${postId}` });
        return;
      }
      /* 작업중지보고서 - 기타 */
      if (boardId === 87) {
        this.$router.push({ path: `/project/${projectId}/tab/${boardId}/write/${postId}` });
        return;
      }
      /* 작업중지 조치결과서 - 기타 */
      if (boardId === 88) {
        this.$router.push({ path: `/project/${projectId}/tab/${boardId}/write/${postId}` });
        return;
      }

      // BS
      if (boardId >= 100) {
        this.$router.push({ path: `/project/${projectId}/tab/${boardId}/write/${postId}` });
      }
    },
  },
};
</script>
