<template>
  <print :board="board" :form="form"/>
</template>

<script>
import Print from '@/views/boards/single-page/284/Print'

export default {
  name: 'Exception04',
  components: {
    Print
  },
  data () {
    return {
      board: {},
      form: {},
    }
  },

  created () {

  },

  async mounted () {
    const postId = await this.getPostId();
  },

  methods: {
    async getPostId () {
      let projectId = this.$route.params.proj_id
      await this.loadListApproval(projectId)

      if (this.listAll.length > 0) {
        const post = this.listAll[0].post
        this.form = JSON.parse(post.post_content).body

        return post.id
      } else {
        return 0
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

    async loadListApproval (projectId) {
      const boardSlug = 'board-284'
      const page = 1
      const perPage = 10000
      const dateTarget = []
      const dateBegin = []
      const dateEnd = []
      const keywords = []

      await this.$store.dispatch('approval/LOAD_POST_COMPLETE', {
        boardSlug,
        projectId,
        page,
        perPage,
        dateTarget,
        dateBegin,
        dateEnd,
        keyword: keywords,
      })
      this.listAll = [...JSON.parse(JSON.stringify(this.$store.state.approval.list))]
      this.board = this.$store.state.approval.document;
    },
  }
}
</script>

<style scoped>

</style>
