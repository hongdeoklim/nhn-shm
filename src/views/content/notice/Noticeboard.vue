<template>
  <div>
    <vx-card class="p-6 mb-4">
      <div class="w-full flex" slot="no-body">
        <h5 class="mr-auto flex items-center"><b>공지사항</b></h5>
      </div>
    </vx-card>

    <vx-card>

      <vs-table
        stripe
        ref="table"
        :data="noticeData"
        search

        :sst="true"
        :max-items="itemsPerPage"
        color="success"
        noDataText="데이터가 없습니다"

        v-model="selected"
        @search="handleSearch"
        @selected="handleSelected">
        <template slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
          <vs-select autocomplete label="" v-model="itemsPerPage" class="w-1/12"
                     @change="handleChangeTablePerPage">
            <vs-select-item :key="index" :value="item.value" :text="item.text"
                            v-for="(item,index) in itemsPerPageOptions"/>
          </vs-select>
        </template>

        <template slot="thead">
          <vs-th class="w-1/12" sort-key="index">No.</vs-th>
          <vs-th class="w-2/12" sort-key="author">작성자</vs-th>
          <vs-th sort-key="title">제목</vs-th>
          <vs-th class="th-fix-created_at" sort-key="time">작성일</vs-th>
          <vs-th class="th-fix-management"></vs-th>
        </template>

        <template slot-scope="{data}">
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">

            <vs-td>
              {{tr.id}}
            </vs-td>

            <vs-td v-if="tr.author">
              {{tr.author.username}}
            </vs-td>
            <vs-td v-else>
              비회원
            </vs-td>

            <vs-td>
              {{tr.post_title}}
            </vs-td>

            <vs-td class="td-fix-created_at">
              {{tr.created_at}}
            </vs-td>

            <!-- 관리 -->
            <vs-td class="td-fix-management text-right">
              <vs-button class="" color="primary" type="border"
                         @click.stop @click="(event)=>{ handleItemClickModified(event, tr) }">
                수정
              </vs-button>
              <vs-button class="ml-4" color="#EDEDED" text-color="black" type="filled"
                         @click.stop @click="sendDeleteData(tr)">
                삭제
              </vs-button>
            </vs-td>

          </vs-tr>

          <vs-tr class="table-foot-tr">
            <vs-td colspan="6" >
              <vs-col class="w-full" vs-type="flex" vs-justify="flex-end">
                <vs-button color="secondary" @click="onClickWrite">등록</vs-button>
              </vs-col>
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
      <div class="vs-con-table">
        <div class="con-pagination-table vs-table--pagination">
          <k-pagination
            :total="(lastPage) ? lastPage : 1"
            v-model="currentPage" @change="handleChangePage"></k-pagination>
        </div>
      </div>

    </vx-card>
  </div>

</template>

<script>
import moduleDataList from '@/store/notice-data-list/moduleNoticeList.js'
import VueCookie from 'vue-cookie'
import HttpRequest from '@/util/HttpRequest'
import KPagination from '@/components/kPagination/kPagination'

export default {
  components: {KPagination},
  data () {
    return {
      selected: [],
      itemsPerPageOptions: [
        {text: '10', value: 10},
        {text: '20', value: 20},
        {text: '50', value: 50}
      ],
      isMounted: false,
      activeUserInfo: {}, // 유저정보

      noticeData: [],
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

    if (!this.$store.hasModule('dataList')) {
      this.$store.registerModule('dataList', moduleDataList)
    }

    // 게시물 정보
    const tableCurrentPage = VueCookie.get('table_current_page')
    const tablePerPage = VueCookie.get('table_per_page')
    const tableSearchKeyword = VueCookie.get('table_search_keyword')
    VueCookie.set('table_current_page', '')
    VueCookie.set('table_per_page', '')
    VueCookie.set('table_search_keyword', '')

    if (tableCurrentPage) { this.currentPage = tableCurrentPage }
    if (tablePerPage) { this.itemsPerPage = tablePerPage }
    if (tableSearchKeyword) { this.searchKeyword = tableSearchKeyword }


    // 유저정보
    let userInfo = this.$store.state.auth.userInfo
    if (!userInfo.email || !userInfo.is_activated) {
      const loginResult = await this.$store.dispatch('USER_INFO')
      if (typeof loginResult.error !== 'undefined' && loginResult.error !== null) {
        let msg = this.$constant.ALERT_MSG_UNDEFINED
        msg = `${msg  }\n${  loginResult.error}`
        alert(msg)
      } else {
        userInfo = this.$store.state.auth.userInfo
        this.activeUserInfo = userInfo
      }
    } else {
      this.activeUserInfo = userInfo
    }


    await this.loadData(tableCurrentPage, tableSearchKeyword)
  },
  methods: {
    // 게시물 불러오기
    async loadData (_page, _keyword) {
      const page = (_page) ? _page : 1
      const keyword = (_keyword) ? _keyword : ''
      const perPage = this.itemsPerPage

      await this.$store.dispatch('dataList/LOAD_NOTICE_LIST', {page, perPage, keyword})

      // 게시물 불러오기
      const notice = this.$store.state.dataList.noticeList

      // 페이지네이션 정보
      this.currentPage = notice.current_page
      this.searchKeyword = keyword
      this.lastPage = notice.last_page
      this.itemsPerPage = notice.per_page
      this.totalCount = notice.total
      this.firstPageUrl = notice.first_page_url
      this.lastPageUrl = notice.last_page_url
      this.nextPageUrl = notice.next_page_url
      this.prevPageUrl = notice.prev_page_url

      // 보여지는 게시물 리스트
      this.noticeData = notice.data

      VueCookie.set('table_current_page', this.currentPage)
    },

    // 삭제
    async sendDeleteData (data) {
      // 권한이 없는경우 (본인의 게시글이 아닌경우)
      if (data.user_id !== this.activeUserInfo.id) {
        alert(this.$constant.ALERT_MSG_NOT_CONPETENCE)
        return
      }


      const noticeId = data.id
      const boardId = this.$constant.BOARD_ID_NOTICE
      return new Promise((resolve, reject) => {
        HttpRequest.delete(`/api/v1/board/post/${boardId}/${noticeId}`)
          .then(response => {
            this.$router.go(this.$router.currentRoute) // 본문 갱신
            resolve(response)
          }).catch(err => reject(err))
      })
    },

    onClickWrite () {
      this.$router.push({path: 'notice-write'})
    },

    // 게시물 클릭
    async handleSelected (tr) {
      if (!tr) {
        return
      }

      await this.$store.dispatch('dataList/LOAD_NOTICE_DETAIL', tr.id)

      // 현재 보드 id, 게시물 id 저장
      const boardId = this.$constant.BOARD_ID_NOTICE
      this.saveCookieBoard(boardId, tr.id)

      await this.$router.push({path: 'notice-read'})
    },

    // 검색
    handleSearch (_keyword) {
      const page = this.currentPage
      const keyword = _keyword
      this.loadData(page, keyword)
    },

    // 페이지 클릭
    handleChangePage (page) {
      //this.loadData(page)
    },

    // 게시물과 관련된 쿠키저장
    saveCookieBoard (_board_id, _post_id) {
      const boardId = _board_id
      const postId = _post_id
      const currentPage = this.currentPage
      const perPage = this.itemsPerPage
      const searchKeyword = this.searchKeyword

      VueCookie.set('current_board_id', boardId)
      VueCookie.set('current_post_id', postId)
      VueCookie.set('table_current_page', currentPage)
      VueCookie.set('table_per_page', perPage)
      VueCookie.set('table_search_keyword', searchKeyword)
    },

    //===== [ dev ] =====

    is_number (v) {
      const reg = /^(\s|\d)+$/
      return reg.test(v)
    },

    //===== [ handler ] ======

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
  .th-fix-created_at,
  .td-fix-created_at {
    width: 165px;
  }

  .th-fix-management,
  .td-fix-management {
    width: 214px;
  }

  @media (max-width: 768px) {
    .th-fix-management,
    .td-fix-management {
      display: none;
    }
  }
</style>
