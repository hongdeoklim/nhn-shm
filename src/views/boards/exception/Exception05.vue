<template>
  <div>
    <vs-button v-if="!isPrint" color="secondary" type="border" @click="handlePrint" style="float: right" class="mb-4">인쇄</vs-button>
    <print id="print-report" :board="board" :form="form" />
  </div>
</template>

<script>
import Print from "@/views/boards/single-page/284/Print2";

export default {
  name: "Exception05",
  components: {
    Print,
  },
  data() {
    return {
      isPrint: false,
      board: {},
      form: {},
    };
  },

  created() {},

  async mounted() {
    const postId = await this.getPostId();
  },

  methods: {
    async getPostId() {
      let projectId = 1;
      await this.loadListApproval(projectId);

      if (this.listAll.length > 0) {
        const post = this.listAll[0].post;
        this.form = JSON.parse(post.post_content).body;

        return post.id;
      } else {
        return 0;
      }
    },
    //
    // async loadListBoard (projectId) {
    //   const boardId = 284
    //   const page = 1
    //   const perPage = 10000
    //
    //   await this.$store.dispatch('board/LOAD_POST_COMPLETE', {
    //     projectId: projectId > 0 ? projectId : undefined,
    //     boardId,
    //     page,
    //     perPage,
    //   })
    //   this.listAll = [...JSON.parse(JSON.stringify(this.$store.state.board.postListInfo.data))]
    //   console.log("listAll", this.listAll)
    // },

    async loadListApproval(projectId) {
      const boardSlug = "board-284";
      const page = 1;
      const perPage = 10000;
      const dateTarget = [];
      const dateBegin = [];
      const dateEnd = [];
      const keywords = [];

      await this.$store.dispatch("approval/LOAD_POST_COMPLETE", {
        boardSlug,
        projectId,
        page,
        perPage,
        dateTarget,
        dateBegin,
        dateEnd,
        keyword: keywords,
      });
      this.listAll = [...JSON.parse(JSON.stringify(this.$store.state.approval.list))];
      this.board = this.$store.state.approval.document;
    },

    handlePrint() {
      // 프린트
      this.isPrint = true;

      setTimeout(() => {
        const g_oBeforeBody = document.getElementById("print-report").innerHTML;
        // 프린트를 보이는 그대로 나오기위한 셋팅
        window.onbeforeprint = function () {
          document.body.style.backgroundColor = "#fff";
          document.body.innerHTML = `${g_oBeforeBody}`;
        };
        window.print();
        location.reload();
      }, 300);
    },
  },
};
</script>

<style scoped></style>
