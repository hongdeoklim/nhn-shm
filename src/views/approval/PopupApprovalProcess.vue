<template>
  <vs-popup id="popupApprovalProcess" class="no-drag" title="결재선 지정" :active.sync="showPopupSync" >

    <vs-row class="mb-6">
      <vs-col class="">
        <h5 class="mb-4"><i class="dot"></i>저장된 결재선</h5>
        <vs-row class="border" style="overflow-x:auto;">
          <ul class="table table-no-2" style="min-width:700px;">
            <li>
              <span>No.</span>
              <span>이름</span>
              <span>결재경로</span>
            </li>
            <li class="tbody" v-for="(line, index) in lineList" :key="index"
                @click="()=>{lineClickItem(line.line_elements)}">
              <span>{{ index + 1 }}</span>
              <span>{{ line.name }}</span>
              <span style="display:flex; flex-flow: wrap;">
                <p v-for="(member, mIdx) in getLineElements(line.line_elements)" :key="mIdx">
                  <span class="mx-2"
                        v-if="mIdx > 0">→</span>{{ (member.element_user) ? member.element_user.name : '(이름없음)' }}
                </p>
                <vs-spacer></vs-spacer>
                <a href="javascript:;" style="width:30px;" @click.stop @click="()=>{removeLine(line.id)}">삭제</a>
              </span>
            </li>
            <li class="tbody" style="grid-template-columns: 1fr;">
              <div class="vs-con-table">
                <div class="con-pagination-table vs-table--pagination">
                  <k-pagination :total="page.lastPage" v-model="page.current" @change="handleChangePage"/>
                </div>
              </div>
            </li>
            <li class="tbody">
              <span>
                <vs-button class="mr-4 small" color="secondary" @click="handleSave">저장</vs-button>
              </span>
              <span><ml-input v-model="lineTitle"/></span>
              <span style="display:flex; flex-flow: wrap; ">
                <p v-for="(member, mIdx) in getLineElements(getSelectElements)" :key="mIdx">
                  <span class="mx-2" style="font-size:0.85rem;"
                        v-if="mIdx > 0">→</span>{{ (member.element_user) ? member.element_user.name : '(이름없음)' }}
                </p>
                <vs-spacer></vs-spacer>
                <a v-if="getLineElements(getSelectElements).length > 0" href="javascript:;" style="width:30px;" @click.stop  @click="initLine">리셋</a>
              </span>
            </li>
          </ul>
        </vs-row>
      </vs-col>
    </vs-row>

    <vs-row style="overflow-x: auto;">
      <vs-col style="min-width:450px;">
        <vs-col class="w-1/2 pr-4">
          <!-- 조직도-->
          <vs-row class="mb-4">
            <vs-col class="flex" vs-align="flex-end" style="flex-flow:inherit;">
              <h5 class="mb-2"><i class="dot"></i>조직도</h5>
              <ml-input class="shadow ml-auto" icon-pack="feather" icon="icon-search" icon-after="true"
                        placeholder="이름검색" v-model="keyword" @change="handleSearch"/>
            </vs-col>
          </vs-row>
          <vs-row class="member-list">
            <draggable class="w-full" :list="members" group="people">
              <vs-col
                class="w-full"
                vs-type="flex" vs-align="center"
                v-for="(member, index) in members"
                :key="index">
                <div
                  class="list-item sm:w-full w-full"
                  :class="(selectMember === member)?'active':''"
                  @click="selectMember = member">
                  <vs-list-item classs="active" :title="member.user_name" :subtitle="member.company_name">
                    <vs-avatar slot="avatar" />
                  </vs-list-item>
                </div>
              </vs-col>
            </draggable>
          </vs-row>
        </vs-col>
        <vs-col class="w-1/2">
          <!-- 결재 -->
          <vs-row class="right-body mb-4">
            <vs-col class="btn-list">
              <vs-button class="addbtn p-0 mb-2" type="border" @click="()=>{removeMember('approval')}">&lt;</vs-button>
              <vs-button class="addbtn p-0" type="border" @click="()=>{addMember('approval')}">&gt;</vs-button>
            </vs-col>
            <vs-col class="pl-4 ">
              <vs-row>
                <vs-col class="mb-2">
                  <h5><i class="dot"></i>결재</h5>
                </vs-col>
              </vs-row>
              <vs-row class="border">
                <ul class="table border-bottom table-title-1">
                  <li>
                    <span>결재</span>
                    <span>성명(직급)</span>
                  </li>
                </ul>

                <ul id="approval" class="table table-title-1">
                  <draggable class="w-full" :list="approvalLine" group="people">
                    <li class="tbody"
                        :class="(selectMember === member) ? 'active':''"
                        v-for="(member, index) in approvalLine"
                        :key="index"

                        @click="selectMember = member"
                    >
                      <span>결재{{ index + 1 }}</span>
                      <span>{{ member.user_name }}{{ (member.company_name) ? `(${member.company_name})` : '' }}</span>
                    </li>
                  </draggable>
                </ul>
              </vs-row>
            </vs-col>
          </vs-row>

          <!-- 수신참조 -->
          <vs-row class="right-body mb-4">
            <vs-col class="btn-list">
              <vs-button class="addbtn p-0 mb-2" type="border" @click="()=>{removeMember('reference')}">&lt;</vs-button>
              <vs-button class="addbtn p-0" type="border" @click="()=>{addMember('reference')}">&gt;</vs-button>
            </vs-col>
            <vs-col class="pl-4 ">
              <vs-row>
                <vs-col class="mb-2">
                  <h5><i class="dot"></i>수신참조</h5>
                </vs-col>
              </vs-row>
              <vs-row class="border">
                <ul class="table border-bottom table-title-1">
                  <li>
                    <span>참조</span>
                    <span>성명(직급)</span>
                  </li>
                </ul>

                <ul id="reference" class="table table-title-1">
                  <draggable class="w-full" :list="referenceLine" group="people">
                    <li class="tbody"
                        :class="(selectMember === member) ? 'active':''"
                        v-for="(member, index) in referenceLine"
                        :key="index"
                        @click="selectMember = member"
                    >
                      <span>참조{{ index + 1 }}</span>
                      <span>{{ member.user_name }}{{ (member.company_name) ? `(${member.company_name})` : '' }}</span>
                    </li>
                  </draggable>
                </ul>
              </vs-row>
            </vs-col>
          </vs-row>

          <!-- 회람 -->
          <vs-row class="right-body">
            <vs-col class="btn-list">
              <vs-button class="addbtn p-0 mb-2" type="border" @click="()=>{removeMember('circulation')}">&lt;
              </vs-button>
              <vs-button class="addbtn p-0" type="border" @click="()=>{addMember('circulation')}">&gt;</vs-button>
            </vs-col>
            <vs-col class="pl-4 ">
              <vs-row>
                <vs-col class="mb-2">
                  <h5><i class="dot"></i>회람</h5>
                </vs-col>
              </vs-row>
              <vs-row class="border">
                <ul class="table border-bottom table-title-1">
                  <li>
                    <span>회람</span>
                    <span>성명(직급)</span>
                  </li>
                </ul>

                <ul id="circulation" class="table table-title-1">
                  <draggable class="w-full" :list="circulationLine" group="people">
                    <li class="tbody"
                        :class="(selectMember === member) ? 'active':''"
                        v-for="(member, index) in circulationLine"
                        :key="index"
                        @click="selectMember = member"
                    >
                      <span>회람{{ index + 1 }}</span>
                      <span>{{ member.user_name }}{{ (member.company_name) ? `(${member.company_name})` : '' }}</span>
                    </li>
                  </draggable>
                </ul>
              </vs-row>
            </vs-col>
          </vs-row>
        </vs-col>
      </vs-col>
    </vs-row>


    <div v-if="enabled" class="vx-row">
      <!-- Footer -->
      <div class="mt-8 px-4 w-full">
        <div class="float-right">
          <vs-button class="mr-4" color="secondary" @click="handleNext">적용</vs-button>
          <vs-button color="#EDEDED" text-color="black" type="filled" @click="handleCloseSelf">취소</vs-button>
        </div>
      </div>
    </div>
  </vs-popup>
</template>

<script>
import draggable from 'vuedraggable'
import KPagination from '@/components/kPagination/kPagination'

export default {
  name: 'PopupApprovalProcess',
  components: {
    KPagination,
    draggable
  },
  props: {
    value: Array,
    enabled: Boolean,
    showPopup: Boolean,
    size: String,
  },
  computed: {
    showPopupSync: {
      get () {
        return this.showPopup
      },
      set () {
        this.handleCloseSelf()
      }
    },

    getSelectElements () {
      const sendDataList = []
      for (const member of this.referenceLine) {
        sendDataList.push({
          company_id: member.company_id,
          company_name: member.company_name,
          user_id: member.user_id,
          user_name: member.user_name,
          status_code: 'wait',
          status_id: 1,
          status_name: '대기',
          type_id: 4,
          type_code: 'reference',
          type_name: '참조'
        })
      }
      for (const member of this.circulationLine) {
        sendDataList.push({
          company_id: member.company_id,
          company_name: member.company_name,
          user_id: member.user_id,
          user_name: member.user_name,
          status_code: 'wait',
          status_id: 1,
          status_name: '대기',
          type_id: 6,
          type_code: 'circulation',
          type_name: '회람'
        })
      }
      for (const member of this.approvalLine) {
        sendDataList.push({
          company_id: member.company_id,
          company_name: member.company_name,
          user_id: member.user_id,
          user_name: member.user_name,
          status_code: 'wait',
          status_id: 1,
          status_name: '대기',
          type_id: 3,
          type_code: 'approval',
          type_name: '결재'
        })
      }

      const returnList = this.lineToSaveLine(sendDataList)
      return returnList
    }
  },
  watch: {
    close () {
    },
    async showPopup (showPopup) {
      if (showPopup) {
        await this.loadMembers('')

        this.approvalLine = []
        this.referenceLine = []
        this.circulationLine = []
        if (this.value && this.value.length > 0) {
          for (const member of this.value) {
            if (member.type_code !== 'register') {
              const newMember = {
                company_id: member.company_id,
                company_name: member.company_name,
                type_code: member.type_code,
                type_id: member.type_id,
                type_name: member.type_name,
                user_id: member.user_id,
                user_name: member.user_name,
                status_code: 'wait',
                status_id: '1',
                status_name: '대기'
              }

              this.selectMember = newMember
              this.addMember(member.type_code)
            }
          }
        }
        await this.loadApprovalLines()
      }
    }
  },
  data () {
    return {
      active: false,

      keyword: '', // 조직도 검색어

      // 결재라인
      lineList: [],
      lineTitle: '',

      // API에서 불러온 전체 직원 목록
      totalMembers: [],

      // 검색어 필터링 된 직원목록
      members: [],

      //선택된 직원
      selectMember: {},

      approvalLine: [],
      referenceLine: [],
      circulationLine: [],

      page: {
        lastPage: 1,
        current: 1,
        perPage: 5,
        keyword: ''
      }

    }
  },

  mounted () {
    const backButtonRouteGuard = this.$router.beforeEach((to, from, next) => {
      if (this.showPopup) {
        this.handleCloseSelf()
        next(false); return
      }
      next(true)
    })
    this.$once('hook:destroyed', () => {
      backButtonRouteGuard()
    })
  },

  methods: {

    initData () {
    },

    async initLine () {
      await this.loadMembers('')

      this.approvalLine = []
      this.referenceLine = []
      this.circulationLine = []
    },

    indexOfMember (list, member) {
      for (let i = 0; i < list.length; i++) {
        if (Number(list[i].user_id) === Number(member.user_id)
          || Number(list[i].user_id) === Number(member.id)) {
          return i
        }
      }
      return -1
    },

    async loadApprovalLines () {
      const page = this.page.current
      const perPage = this.page.perPage
      const keyword = this.page.keyword
      await this.$store.dispatch('approval/LOAD_LINE_TEMPLATE', {
        page,
        perPage,
        keyword
      })
      const list = this.$store.state.approval.lineList
      this.lineList = list

      const info = this.$store.state.approval.lineInfo
      this.page.current = info.current_page
      this.page.lastPage = info.last_page
      this.page.perPage = info.per_page
    },

    // 회원목록 불러오기
    async loadMembers (keyword) {
      const page = 1
      const perPage = 10000
      await this.$store.dispatch('member/LOAD_MEMBERS', {page, perPage, keyword, projectId: this.$route.params.proj_id})

      const list = this.$store.state.member.list
      const listInfo = this.$store.state.member.listInfo

      if (list) {

        await this.$store.dispatch('USER_INFO')
        const accessor = this.$store.state.auth.userInfo

        // 페이지네이션 정보
        this.currentPage = listInfo.current_page
        this.itemsPerPage = listInfo.per_page
        this.totalCount = listInfo.total
        this.startNo = (this.itemsPerPage * (this.currentPage - 1)) + 1

        // 보여지는 회원 리스트 (본인제외)
        this.totalMembers = [];
        this.members = []

        if (list) {
          for (const member of list) {
            if (Number(accessor.id) !== Number(member.id)) {
              const temp = {
                company_id: member.company_id,
                company_name: member.company_name,
                user_id: member.id,
                user_name: member.name,
                status_code: 'wait',
                status_id: 1,
                status_name: '대기',
                type_code: 'approval',
                type_id: 3,
                type_name: '결재'
              }
              this.members.push(temp)
              this.totalMembers.push(temp)
            }
          }
        }

        // members 정렬
        this.membersSort()
      }
    },

    addMember (elementType) {
      const member = this.selectMember

      // 결재선에 선택되지 않은 직원만 결재선으로 이동
      if (member.user_id) {

        if (elementType === 'approval') {
          if (this.indexOfMember(this.approvalLine, member) < 0) {
            this.approvalLine.push(member)

            const index = this.indexOfMember(this.members, member)
            if (index >= 0) {
              this.members.splice(index, 1)
            }
          }
        } else if (elementType === 'reference') {
          if (this.indexOfMember(this.referenceLine, member) < 0) {
            this.referenceLine.push(member)

            const index = this.indexOfMember(this.members, member)
            if (index >= 0) {
              this.members.splice(index, 1)
            }
          }
        } else if (elementType === 'circulation') {
          if (this.indexOfMember(this.circulationLine, member)) {
            this.circulationLine.push(member)

            const index = this.indexOfMember(this.members, member)
            if (index >= 0) {
              this.members.splice(index, 1)
            }
          }
        }

      }

      // 결재선에 추가한 뒤, 선택된 직원을 초기화 한다.
      this.selectMember = {}
    },

    removeMember (elementType) {

      if (elementType === 'approval') {
        const member = this.selectMember
        if (member.user_id) {
          this.approvalLine.splice(this.indexOfMember(this.approvalLine, member), 1)
          if (this.indexOfMember(this.members, member) < 0) {
            this.members.push(member)
          }
          this.membersSort()
          // 결재선에서 삭제한 뒤, 선택된 직원을 초기화 한다.
          this.selectMember = {}
        }
      } else if (elementType === 'reference') {
        const member = this.selectMember
        if (member.user_id) {
          this.referenceLine.splice(this.indexOfMember(this.referenceLine, member), 1)
          if (this.indexOfMember(this.members, member) < 0) {
            this.members.push(member)
          }
          this.membersSort()
          // 결재선에서 삭제한 뒤, 선택된 직원을 초기화 한다.
          this.selectMember = {}
        }
      } else if (elementType === 'circulation') {
        const member = this.selectMember
        if (member.user_id) {
          this.circulationLine.splice(this.indexOfMember(this.circulationLine, member), 1)
          if (this.indexOfMember(this.members, member) < 0) {
            this.members.push(member)
          }
          this.membersSort()
          // 결재선에서 삭제한 뒤, 선택된 직원을 초기화 한다.
          this.selectMember = {}
        }
      }
    },

    // 전송시 부모에 데이터 전달
    /*
    *
    * */
    sendApprovalList () {
      const sendDataList = []
      for (const member of this.referenceLine) {
        sendDataList.push({
          company_id: member.company_id,
          company_name: member.company_name,
          user_id: member.user_id,
          user_name: member.user_name,
          status_code: 'wait',
          status_id: 1,
          status_name: '대기',
          type_id: 4,
          type_code: 'reference',
          type_name: '참조'
        })
      }
      for (const member of this.circulationLine) {
        sendDataList.push({
          company_id: member.company_id,
          company_name: member.company_name,
          user_id: member.user_id,
          user_name: member.user_name,
          status_code: 'wait',
          status_id: 1,
          status_name: '대기',
          type_id: 6,
          type_code: 'circulation',
          type_name: '회람'
        })
      }
      for (const member of this.approvalLine) {
        sendDataList.push({
          company_id: member.company_id,
          company_name: member.company_name,
          user_id: member.user_id,
          user_name: member.user_name,
          status_code: 'wait',
          status_id: 1,
          status_name: '대기',
          type_id: 3,
          type_code: 'approval',
          type_name: '결재'
        })
      }

      this.$emit('input', sendDataList)
      this.$emit('sendApprovalList', sendDataList)
    },

    membersSort () {
      this.members.sort((a, b) => {
        return a.user_id - b.user_id
      })
      this.totalMembers.sort((a, b) => {
        return a.user_id - b.user_id
      })
    },

    getLineElements (list) {
      const approvalList = []

      for (const item of list) {
        if (item.element_type && (item.element_type.code === 'approval')) {
          approvalList.push(item)
        }
      }
      return approvalList
    },

    // ApprovalProcessModule 에서 사용하는 line 방식에서 전송용 line 으로 변경
    lineToSaveLine (data) {
      const approvalList = []

      for (const member of data) {
        if (member.type_code !== 'register') {
          approvalList.push({
            id: member.user_id,
            element_user: {name: member.user_name},
            element_type: {code: member.type_code}
          })
        }
      }
      return approvalList
    },


    lineClickItem (data) {
      for (let i = 0; i < this.approvalLine.length; i++) {
        const member = this.approvalLine[i]
        this.selectMember = member
        this.removeMember('approval')
        i = -1
      }

      for (let i = 0; i < this.referenceLine.length; i++) {
        const member = this.referenceLine[i]
        this.selectMember = member
        this.removeMember('reference')
        i = -1
      }

      for (let i = 0; i < this.circulationLine.length; i++) {
        const member = this.circulationLine[i]
        this.selectMember = member
        this.removeMember('circulation')
        i = -1
      }

      for (const lineMember of data) {
        const user_id = lineMember.element_user_id
        const elementType = lineMember.element_type.code
        for (const member of this.members) {
          if (member.user_id === user_id) {
            this.selectMember = member
            this.addMember(elementType)
          }
        }
      }

    },

    async removeLine (templateId) {
      await this.$store.dispatch('approval/DELETE_LINE_TEMPLATE', {templateId})
      await this.loadApprovalLines()
    },

    //===== [ handler ] ======

    handleCloseSelf () {
      this.$emit('closePopup', false)
      this.initData()
    },

    handleChangePage (page) {
      this.page.current = page
      this.loadApprovalLines()
    },

    handleNext () {

      this.sendApprovalList()
      this.handleCloseSelf()
    },

    async handleSave () {

      if (this.lineTitle.trim().length <= 0) {
        alert('결재선 제목을 입력하세요')
        return
      }

      if (this.getSelectElements.length === 0) {
        alert('아래 툴을 사용하여 결재라인을 설정하세요')
        return
      }

      const list = []
      for (const member of this.getSelectElements) {
        list.push({
          id: member.id,
          elementType: member.element_type.code
        })
      }

      const title = this.lineTitle
      const desc = ''
      const approvalLine = JSON.stringify(list)

      await this.$store.dispatch('approval/CREATE_LINE_TEMPLATE', {
        title,
        desc,
        approvalLine
      })
      await this.loadApprovalLines()
    },

    /**
     * 현재 불러와 있는 회원 목록 중에서 검색한다
     */
    handleSearch () {
      this.members = this.totalMembers.filter((member) => member.user_name.includes(this.keyword));
    }
  }
}

</script>


<style lang="scss">
#popupApprovalProcess {
  &.con-vs-popup .vs-popup {
    width: 800px;

    .list {
      overflow-x: hidden;
      overflow-y: auto;
    }
  }

  .list-item {
    display: flex;
    align-items: center;
    cursor: pointer;

    &.active {
      background: rgba(var(--vs-primary), .05) !important;
      box-shadow: 0 0 1px 0 rgba(var(--vs-primary), 1) !important;
    }
  }
}
</style>

<style scoped>
/* 테이블 스타일 */
ul.table {
  width: 100%;
}

ul.table > div > li {
  display: grid;
  text-align: center;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #cdcdcd;
  grid-template-rows: minmax(52px, 100%);
}

ul.table > div > li:last-child {
  border-bottom: none;
}

ul.table > div > li.tbody {
  background-color: #fff;
  cursor: pointer;
}

ul.table > div > li.tbody.active {
  background: rgba(var(--vs-primary), .05) !important;
}

ul.table > div > li.tbody > span {
  font-weight: normal !important;
}

ul.table > div > li > span {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-left: 1px solid #cdcdcd;
  padding: 6px;
  font-weight: 500;
}

ul.table > div > li > span:first-child {
  border-left: none;
}

ul.table.table-no-2 > div > li {
  grid-template-columns: 1fr 2fr 4fr;
}

ul.table.table-title-1 > div > li {
  grid-template-columns: 1fr 2fr;
}

ul.table > div > li > span {
  border-left: none;
}

.vs-row.border {
  border-left: none;
  border-right: none;
}

ul.table.table-no-2 > li {
  grid-template-columns: 1fr 2fr 4fr;
}

ul.table.table-title-1 > li {
  grid-template-columns: 1fr 2fr;
}

ul.table > li > span {
  border-left: none;
}

.member-list {
  flex-flow: column;

  height: 730px;
  max-height: 100vh;
  border: 1px solid #cdcdcd;
  border-radius: 8px;
  font-size: 0.8rem;

  overflow-y: auto;
}

.vs-row.right-body {
  display: grid !important;
  grid-template-columns: auto minmax(0, 100%);
}

.vs-row.right-body #approval,
.vs-row.right-body #reference,
.vs-row.right-body #circulation {
  display: flex !important;
  flex-flow: column;
  overflow-y: auto;
  height: 159px;
}

.vs-row.right-body #approval li:last-child,
.vs-row.right-body #reference li:last-child,
.vs-row.right-body #circulation li:last-child {
  border-bottom: 1px solid #cdcdcd;
}

.vs-row.right-body .btn-list {
  align-self: center;
}

.vs-row.right-body .vs-col {
}

.vs-row.right-body .addbtn {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 30px;
  height: 30px;
  min-width: 30px;
  min-height: 30px;
  max-width: 30px;
  max-height: 30px;
  padding: 0;
}

.no-drag {
  -ms-user-select: none;
  -moz-user-select: -moz-none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  user-select: none;
}
</style>
