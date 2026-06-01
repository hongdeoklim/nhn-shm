<template>
  <div>

    <!--  상단 검색바-->
    <search-nav @handleSearch="handleSearch">
      <search-nav-item-select :label="$t('search.검색조건')" v-model="searchType" :list="searchTypes" />
      <search-nav-item-keyword :label="$t('search.키워드')" v-model="searchKeyword" />
    </search-nav>

    <vs-row class="mb-4">
      <vs-col class="flex" vs-justify="flex-end">
        <vs-button color="secondary" @click="handleClickRegister">{{ $t('button.신규작성') }}</vs-button>
      </vs-col>
    </vs-row>

    <vs-row>
      <vs-col>
        <vs-table stripe
                  ref="table"
                  :sst="true"
                  pagination
                  :max-items="table.perPage"
                  :data="table.list"
                  @selected="handleItemClickDetail"
                  noDataText="데이터가 없습니다"
        >


          <template slot="thead">
            <vs-th><span class="w-full text-center">{{$t('content.community.qna.column.No')}}</span></vs-th>
            <vs-th><span class="w-full text-center">계약업체명</span></vs-th>
            <vs-th><span class="w-full text-center">현장명</span></vs-th>
            <vs-th><span class="w-full text-center">{{$t('content.community.qna.column.작성자')}}</span></vs-th>
            <vs-th><span class="w-full text-center">{{$t('content.community.qna.column.작성일')}}</span></vs-th>
            <vs-th><span class="w-full text-center">{{$t('content.community.qna.column.첨부파일')}}</span></vs-th>
            <vs-th><span class="w-full text-center">{{$t('content.community.qna.column.답변여부')}}</span></vs-th>
          </template>


          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td class="text-center">{{ getNo(indextr) }}</vs-td>
              <vs-td class="text-center">{{ tr.author && tr.author.company ? tr.author.company.com_name : '-' }}</vs-td>
              <vs-td class="text-center">{{ getProjectName(tr.post_content)}}</vs-td>
              <vs-td class="text-center">{{ (tr.author) ? tr.author.name : '' }}</vs-td>
              <vs-td class="text-center">{{ getDate(tr.created_at) }}</vs-td>
              <vs-td class="text-center">
                <a download target="_blank" :href="img.path" v-for="(img, index) in tr.post_attachment" :key="index" @click.stop>
                  <vs-icon icon-pack="feather" icon="icon-file"/>
                </a>
              </vs-td>
              <vs-td class="text-center">
                <span v-if="(tr.children) ? tr.children.length > 0 : false">답변완료</span>
              </vs-td>
            </vs-tr>
          </template>
        </vs-table>
      </vs-col>
    </vs-row>
  </div>
</template>

<script>
import TemplateListNormal from '@/views/project/report/template/TemplateListNormal'
import SearchNav from '@/components/nav/SearchNav'
import SearchNavItemKeyword from '@/components/nav/SearchNavItemKeyword'
import SearchNavItemSelect from '@/components/nav/SearchNavItemSelect'

export default {
  name: 'CommunityQnA',
  components: {
    SearchNavItemSelect,
    SearchNavItemKeyword,
    SearchNav,
    TemplateListNormal
  },
  computed: {
    projectId () {
      return this.$route.params.proj_id
    },
  },
  data () {
    return {
      boardSlug: 'qna',
      boardId: 17,
      viewTypeCode: 'normal',
      perPageOption: '10,20,30',
      projectTitle: '',
      table: {
        list: [],
        perPage: 7,
        keyword: ''
      },

      //pagination
      perPage: 10,
      date: '',
      searchKeyword: '',
      searchTypes: [
        {text:'제목', value:'content$post_title'},
        {text:'작성자', value:'content$writer'},
      ],
      searchType: 'content$post_title',
      currentPage: 1,
      lastPage: 1,
      total: 0,
    }
  },

  created () {
    const paths = this.$route.path.split('/')
    this.rootPath = `/${paths[1]}/${paths[2]}`

    this.loadPostList()
  },

  methods: {
    getNo (index) {
      return this.total - (((this.currentPage - 1) * this.perPage) + index)
    },


    // 게시물 불러오기
    async loadPostList () {
      const projectId = this.projectId
      const boardId = this.boardId
      const page = (this.currentPage) ? this.currentPage : 1
      const perPage = this.perPage
      const keyword = []

      if (this.searchKeyword) keyword.push(`${this.searchType}*%${this.searchKeyword}%`)

      await this.$store.dispatch('board/LOAD_POST_LIST', {
        projectId,
        boardId,
        page,
        perPage,
        keyword,
        orderTarget: 'id',
        orderDirection: 'desc'
      })

      // 게시물 불러오기
      const postListInfo = this.$store.state.board.postListInfo

      // 페이지네이션 정보
      this.currentPage = postListInfo.current_page
      this.lastPage = postListInfo.last_page
      this.perPage = postListInfo.per_page
      this.total = postListInfo.total

      // 보여지는 게시물 리스트
      this.table.list = postListInfo.data

    },

    // 글 상세페이지로 이동
    moveProjectDetail (_postId) {
      const project_id = parseInt(this.$route.params.proj_id)
      if (project_id) {
        this.$router.push({path: `/project/${project_id}/community/qna/${_postId}`})
      } else {
        this.$router.push({path: `/community/qna/${_postId}`})
      }
    },

    getProjectName (post_content) {
      try {
        const data = JSON.parse(post_content)
        return data.project.field_name
      } catch (e) {

      }
      return '-'
    },

    getDate (date) {
      return new Date(date).format('yyyy-MM-dd')
    },

    handleChangePerPage (_data) {
      if (this.perPage !== _data) {
        this.currentPage = 1
        this.perPage = _data
        this.loadPostList()
      }
    },
    handleSearch () {
      this.currentPage = 1
      this.loadPostList()
    },
    handleChangePage (_data) {
      if (this.currentPage !== _data) {
        this.currentPage = _data
        this.loadPostList()
      }
    },
    handleItemClickDetail (_data) {
      this.moveProjectDetail(_data.id)
    },
    handleClickRegister () {
      const project_id = parseInt(this.$route.params.proj_id)
      if (project_id) {
        this.$router.push({path: `/project/${project_id}/community/qna/create`})
      } else {
        this.$router.push({path: '/community/qna/create'})
      }
    }
  }
}
</script>

<style scoped>

</style>
