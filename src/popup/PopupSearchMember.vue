<template>
  <vs-popup id="popupSearchMember" title="사용자검색" :active.sync="showPopup">
    <vs-row class="text-center" style="border-bottom:1px solid #e0e0e0">
      <vs-col class="w-full flex" style="margin-bottom:-0.75rem; flex-flow: wrap; overflow: hidden" vs-align="center" >
        <vs-col class="w-auto mr-4 mb-3 flex" vs-align="center">
          <span class="mr-3" style="width:50px;">소속</span>
          <ml-input style="width:180px;" v-model="search.company"/>
        </vs-col>
        <vs-col class="w-auto mr-4 mb-3 flex" vs-align="center">
          <span class="mr-3" style="width:50px;">이름</span>
          <ml-input style="width:180px;" v-model="search.name"/>
        </vs-col>
        <vs-button class="ml-auto mb-3 " color="secondary" @click="handleClickSearch">검색</vs-button>
      </vs-col>
    </vs-row>
    <vs-row>
      <vs-col style="max-height:500px; overflow-y:auto;">

        <vs-table stripe
                  ref="table"
                  :sst="true"
                  :max-items="page.perPage"
                  :data="members"
                  noDataText="데이터가 없습니다"
                  @selected="handleItemClickDetail"
        >
          <template slot="thead">
            <vs-th class="w-1/12" style="min-width:100px;" sort-key="title">번호</vs-th>
            <vs-th class="w-1/12" style="min-width:100px;" sort-key="no">소속</vs-th>
            <vs-th class="w-1/12" style="min-width:80px;" sort-key="no">이름</vs-th>
            <vs-th class="w-1/12" style="min-width:80px;" sort-key="author">부서</vs-th>
          </template>

          <template slot-scope="{data}">
            <vs-tr :class="(selectMember.id === member.id) ? 'active' : '' "
                   :data="member" :key="index" v-for="(member, index) in data">

              <vs-td>{{member.id}}</vs-td>
              <vs-td>{{member.department}}</vs-td>
              <vs-td>{{member.name}}</vs-td>
              <vs-td>{{member.company ? member.company.com_name : ''}}</vs-td>

            </vs-tr>
          </template>

        </vs-table>

        <div class="vs-con-table">
          <div class="con-pagination-table vs-table--pagination">
            <k-pagination
              :total="(page.lastPage) ? page.lastPage : 1"
              :value="page.current" @change="handleChangePage"></k-pagination>
          </div>
        </div>

      </vs-col>

      <vs-col class="mt-4 flex" vs-align="center" vs-justify="flex-end">
        <vs-button class="mr-4 " color="#EDEDED" text-color="black" type="filled" @click="handleClickClose">닫기</vs-button>
        <vs-button class="" color="secondary" @click="handleClickSelect">선택</vs-button>
      </vs-col>

    </vs-row>
  </vs-popup>
</template>


<script>

import KPagination from '@/components/kPagination/kPagination'
export default {
  name: 'PopupSearchMember',
  props: {
    value:Boolean,
    enabledJoin:Boolean,
    selectId:Number
  },
  components: {
    KPagination
  },

  watch:{
    value (data) {
      this.showPopup = data
      if (this.oldSelectMember.id) {
        this.selectMember = this.oldSelectMember
      }

      if (this.showPopup) {
        this.loadMember()
      }
    },
    selectId (id) {
      this.oldSelectMemberId = id
      if (this.members) {
        for (const member of this.members) {
          if (member.id === this.oldSelectMemberId) {
            this.oldSelectMember = member
            this.selectMember = member
            break
          }
        }
      }
    },
    showPopup (value) {
      const body = document.querySelector('body');
      if (value) {
        body.style.overflow = 'hidden'
      } else {
        body.style.overflow = 'auto'
      }

      this.$emit('input', value)
      this.selectMember = this.oldSelectMember
    },
  },
  computed :{
    members: {
      get: function () {
        return this.$store.state.member.list
      },
      set: function (value) {
        const info = this.$store.state.member.listInfo
        this.page.current = info.current_page
        this.page.perPage = info.per_page
        this.page.lastPage = info.last_page

        for (const member of this.members) {
          if (member.id === this.oldSelectMemberId) {
            this.oldSelectMember = member
            this.selectMember = member
            break
          }
        }
      }
    },

    workPositionList () {
      return this.$store.state.project.hseInfoWorkPositionList
    }
  },
  data () {
    return {
      showPopup:false,

      oldSelectMemberId:0,
      oldSelectMember:{},
      selectMember:{},
      myMember:[],

      // 페이징
      page:{
        current:1,
        lastPage:1,
        perPage:5
      },

      // 겅색
      search: {
        company:'', // 회사명
        name:'' // 이름
      }
    }
  },

  mounted () {
    const backButtonRouteGuard = this.$router.beforeEach((to, from, next) => {
      if (this.showPopup) {
        this.showPopup = false
        next(false); return
      }
      next(true)
    })
    this.$once('hook:destroyed', () => {
      backButtonRouteGuard()
    })
  },

  created () {
    this.showPopup = this.value
    this.oldSelectMemberId = this.selectId

    this.loadInfoWorkPosition()
  },

  methods:{

    async loadMember () {
      const page = this.page.current
      const perPage = this.page.perPage
      const company = this.search.company
      const name = this.search.name
      const keyword = name
      const searchType = (company && company.length > 0) ? 'and' : ''
      await this.$store.dispatch('member/LOAD_MEMBERS', {page, perPage, company, name, keyword, searchType, projectId: this.$route.params.proj_id})
      this.members = JSON.parse(JSON.stringify(this.$store.state.member.list))
    },

    async loadInfoWorkPosition () {
      await this.$store.dispatch('project/HSE_LOAD_INFO_WORKPOSITION')
      const list = this.$store.state.project.hseInfoWorkPositionList
    },

    handleClickClose () {
      this.$emit('input', false)
      this.$emit('handleClickClose')
    },

    handleClickSearch () {
      this.page.current = 1
      this.loadMember()
    },

    handleChangePage (page) {
      this.page.current = page

      this.loadMember()
    },

    handleItemClickDetail (data) {
      this.selectMember = data
    },

    handleClickSelect () {
      this.$emit('input', false)
      this.$emit('handleClickSelect', this.selectMember)
    },

    async handleChangeWorkPosition (userId, position) {
      const param = {
        userId,
        position
      }
      await this.$store.dispatch('member/MODIFY_MEMBER', param)
        .then((/*response*/) => {
          this.loadMember()
        })
    }
  }
}

</script>


<style>

#popupSearchMember > .vs-popup {
  width:860px !important;
}
#popupSearchMember > .vs-popup > .vs-popup--content {
  width:100%;
  padding:0;
  margin:0;
}
#popupSearchMember > .vs-popup > .vs-popup--content > .vs-row{
  padding:24px;

}

</style>

<style scoped>

.table-layout {
  border: 1px solid #cdcdcd;
}
.table-layout .trow {
  border-bottom: 1px solid #cdcdcd;
}
.table-layout .tcol {
  border-right: 1px solid #cdcdcd;
}
.vs-con-table.stripe .tr-values.active { background: rgb(102,112,203) !important; color:#fff; font-width: bold;}

</style>
