<template>
    <div>
      <vx-card class="p-6 mb-4">
        <div class="w-full flex" slot="no-body">
          <h5 class="mr-auto flex items-center"><b>FAQ</b></h5>
        </div>
      </vx-card>

      <vx-card>

        <vs-table
          ref="table"
          :data="faqData"
          search

          pagination
          :sst="true"
          :total="(totalCount) ? totalCount : 1"
          :max-items="itemsPerPage"
          color="success"

          v-model="selected"
          @search="handleSearch"
          @selected="handleSelected"
          @change-page="handleChangePage">
          <template slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
            <vs-select id="tableSelect" autocomplete label="" v-model="itemsPerPage" class="w-1/12"
                       @change="handleChangeTablePerPage">
              <vs-select-item :key="index" :value="item.value" :text="item.text"
                              v-for="(item,index) in itemsPerPageOptions"/>
            </vs-select>
          </template>

          <template slot="thead">
            <vs-th class="w-1/12" sort-key="index">번호</vs-th>
            <vs-th class="w-10/12" sort-key="title">제목</vs-th>
            <vs-th class="w-1/12">조회</vs-th>
          </template>

          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">

              <vs-td>
                {{indextr + 1}}
              </vs-td>

              <vs-td>
                Q {{tr.post_title}}
              </vs-td>

              <vs-td>
                0
<!--                {{tr.view_count}}-->
              </vs-td>


<!--              expand -->
              <template slot="expand">
                <div class="w-full">
                  <div class="flex items-center">
                    <div class="w-1/12"></div>
                    <div class="w-11/12 items-center justify-start th-answer pl-20">
                      A {{tr.answer}}
                    </div>
                  </div>
                </div>
              </template>

            </vs-tr>

            <vs-tr class="table-foot-tr">
              <vs-td colspan="6" >
                <vs-col class="w-full" vs-type="flex" vs-justify="flex-end">
                  <vs-button color="secondary" @click="handleWritePage">등록</vs-button>
                </vs-col>
              </vs-td>
            </vs-tr>
          </template>


        </vs-table>
      </vx-card>
    </div>
</template>

<script>
export default {
  name: 'FAQBoard',
  data () {
    return {
      selected: [],
      itemsPerPageOptions: [
        {text: '10', value: 10},
        {text: '20', value: 20},
        {text: '50', value: 50}
      ],
      faqData: [
        {
          post_title:'xkxkxk', answer:'asdfaaasdf '
        },
        {
          post_title:'xkxkxk', answer:'asdfaaasdf asdfaaasdfasdfaaasdfasdfaaasdfasdfaaasdfasdfaaasdfasdfaaasdfasdfaaasdfasdfaaasdfasdfaaasdfasdfaaasdfasdfaaasdfasdfaaasdfasdfaaasdfasdfaaasdfasdfaaasdfasdfaaasdf sdafsdfasdfaaasdfasdfaaasdfasdfaaasdfasdfaaasdfsdf asdfaaasdfasdfaaasdfasdfaaasdfasdfaaasdfasdfaaasdfasdfaaasdf'
        }
      ],
      currentPage: 1,
      searchKeyword: '',
      lastPage: 1,
      itemsPerPage: 10, // default
      totalCount: 0,
      firstPageUrl: '',
      lastPageUrl: '',
      nextPageUrl: '',
      prevPageUrl: ''
    }
  },

  async created () {


  },
  methods: {
    // 게시물 불러오기
    async loadData (_page, _keyword) {
      const page = (_page) ? _page : 1
      const keyword = (_keyword) ? _keyword : ''
      const perPage = this.itemsPerPage

      // await this.$store.dispatch('dataList/LOAD_NOTICE_LIST', {page, perPage, keyword})
      //
      // // 게시물 불러오기
      // const notice = this.$store.state.dataList.noticeList
      //
      // // 페이지네이션 정보
      // this.currentPage = notice.current_page
      // this.searchKeyword = keyword
      // this.lastPage = notice.last_page
      // this.itemsPerPage = notice.per_page
      // this.totalCount = notice.total
      // this.firstPageUrl = notice.first_page_url
      // this.lastPageUrl = notice.last_page_url
      // this.nextPageUrl = notice.next_page_url
      // this.prevPageUrl = notice.prev_page_url
      //
      // // 보여지는 게시물 리스트
      // this.faqData = notice.data
    },

    //===== [ handler ] ======
    // 게시물 클릭
    async handleSelected (tr) {
      if (!tr) {

      }

      // await this.$store.dispatch('dataList/LOAD_NOTICE_DETAIL', tr.id)
      //
      // // 현재 보드 id, 게시물 id 저장
      // const boardId = this.$constant.BOARD_ID_NOTICE
      // this.saveCookieBoard(boardId, tr.id)
      //
      // await this.$router.push({path: 'notice-read'})
    },

    // 페이지 클릭
    handleChangePage (page) {
      this.loadData(page)
    },

    // 등록 페이지
    handleWritePage () {
      this.$router.push({path: 'faq-write'})
    },

    // 검색
    handleSearch (_keyword) {
      const page = this.currentPage
      const keyword = _keyword
      this.loadData(page, keyword)
    },

    handleItemClickModified (event, tr) {
      this.handleSelected(tr)
    },

    handleChangeTablePerPage (per_page) {
      if (this.is_number(per_page)) {
        this.itemsPerPage = per_page
      }
      this.currentPage = 1
      this.loadData(this.currentPage)
    }
  }
}
</script>

<style scoped>
  .th-answer {
    color: darkorange;
    word-break: break-all;
  }
</style>
