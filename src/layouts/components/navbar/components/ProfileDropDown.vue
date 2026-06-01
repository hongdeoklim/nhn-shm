<template>
  <div id="ProfileDropDown" class="the-navbar__user-meta flex items-center">
    <div class="text-right leading-tight">
      <p class="font-semibold">{{ userInfo.name }}</p>
      <small class="cursor-pointer" @click="logout">로그아웃</small>
    </div>

    <vs-dropdown vs-custom-content vs-trigger-click class="cursor-pointer">
      <div class="con-img ml-3">
        <img
          v-if="userInfo.photoURL"
          key="onlineImg"
          :src="userInfo.photoURL"
          alt="user-img"
          width="40"
          height="40"
          class="rounded-full shadow-md cursor-pointer block"
        />
      </div>

      <vs-dropdown-menu class="vx-navbar-dropdown">
        <ul style="min-width: 9rem">
          <li
            class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
          >
            <feather-icon icon="UserIcon" svgClasses="w-4 h-4" />
            <span class="ml-2">Profile</span>
          </li>

          <li
            class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
          >
            <feather-icon icon="MailIcon" svgClasses="w-4 h-4" />
            <span class="ml-2">Inbox</span>
          </li>

          <li
            class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
          >
            <feather-icon icon="CheckSquareIcon" svgClasses="w-4 h-4" />
            <span class="ml-2">Tasks</span>
          </li>

          <li
            class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
          >
            <feather-icon icon="MessageSquareIcon" svgClasses="w-4 h-4" />
            <span class="ml-2">Chat</span>
          </li>

          <li
            class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
          >
            <feather-icon icon="HeartIcon" svgClasses="w-4 h-4" />
            <span class="ml-2">Wish List</span>
          </li>

          <vs-divider class="m-1" />

          <li
            class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
            @click="logout"
          >
            <feather-icon icon="LogOutIcon" svgClasses="w-4 h-4" />
            <span class="ml-2">Logout</span>
          </li>
        </ul>
      </vs-dropdown-menu>
    </vs-dropdown>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },

  computed: {
    userInfo() {
      return this.$store.state.auth.userInfo;
    },
    memberInfo() {
      return this.$store.state.member.memberInfo;
    },
  },

  created() {
    window.addEventListener("logout", this.logout);
  },
  beforeDestroy() {
    window.removeEventListener("logout", this.logout);
  },
  methods: {
    async logout() {
      // 로그아웃 하기 전에 선택한 사업장 정보를 제거한다
      await this.clearSelectedFieldFromAllProject();
      await this.$store.dispatch("USER_LOGOUT").finally(() => {
        this.$router.push("/login").catch(() => {});
      });
    },
    async clearSelectedFieldFromAllProject() {
      if (!this.memberInfo || !this.memberInfo.projects) {
        return;
      }

      const projectIds = this.memberInfo.projects.map((project) => project.id);
      for (const projectId of projectIds) {
        await this.clearSelectedField(projectId);
      }
    },
    /**
     * 현재 프로젝트에 대해서 기본 값으로 선택하는 사업장 정보를 초기화한다
     */
    async clearSelectedField(projectId) {
      const param = {
        userId: this.memberInfo.id,
        metas: [
          {
            key: `selected_field_${projectId}`,
            value: '""',
          }
        ]
      };
      await this.$store.dispatch('member/MODIFY_MEMBER', param)
        .then((/*response*/) => {
          // 사용자 정보를 업데이트하고, 변경된 사용자 정보를 새로 불러오도록 한다
          this.$store.dispatch("member/LOAD_MEMBER_DETAIL");
        });
    },
  },
};
</script>
