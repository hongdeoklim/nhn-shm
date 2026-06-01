<template>
  <div>
    <vx-card>
      <vs-row class="mb-8">
        <!-- 계약 정보 -->
        <vs-col class="w-7/12">
          <vs-col class="pr-6 mb-4" style="display: grid; grid-template-columns: minmax(0%,100%) auto; align-items: center;">
            <h5><i class="dot"></i>업체 정보</h5>
          </vs-col>
          <table-list-page
            style="display: inline-block; width: 100%; padding-right: 21px; "
            ref="tablePlanPartnersInfo"
            body-style="none"
            :board-id="50"
            :showNav="false"
            :moveNew="false"
            :moveDetail="false"
            :create="false"
            :download="false"
            :approval="false"
            :nav="nav"
            :heads="heads"
            :getCol="getCol"

            @detail="onClickDetail"
            @load="onLoadListAll"
          />
        </vs-col>

        <!-- 기본정보 -->
        <vs-col class="w-5/12 grid" style="position: relative">
          <partner-agreement :form="form" :com-readonly="true"/>

          <div style="position: absolute; top:-8px; right:0px;">
            <vs-button v-if="form.agreementInfo.company > 0" class="small" color="primary" type="filled" @click.stop="onClickUpdate">수정</vs-button>
            <vs-button v-if="form.agreementInfo.company > 0" class="ml-4 small" color="primary" type="border" @click.stop="onClickDelete">삭제</vs-button>
          </div>
        </vs-col>
      </vs-row>


      <vs-row>
        <!-- 사용자정보 -->
        <vs-col class="w-full">
          <vs-row class="mb-4 flex" vs-align="center">
            <h5 class=""><i class="dot"></i>사용자 정보</h5>
            <vs-button class="ml-auto" color="secondary" type="border" @click="handleClickLoadAll">참여인력 전체</vs-button>
          </vs-row>

          <vs-table
            class=""

            ref="table"
            stripe
            :data="userTable.list"

            color="success"

            pagination
            :total="userTable.total"
            :max-items="userTable.perPage"
            @change-page="changePage"
          >

            <template slot="thead">
              <vs-th><span class="w-full text-center">No.</span></vs-th>
              <vs-th><span class="w-full text-center">업체명</span></vs-th>
              <vs-th><span class="w-full text-center">ID</span></vs-th>
              <vs-th><span class="w-full text-center">휴대폰번호</span></vs-th>
              <vs-th><span class="w-full text-center">이메일</span></vs-th>
              <vs-th><span class="w-full text-center">참여이력</span></vs-th>
            </template>

            <template slot-scope="{data}">
              <vs-tr class="text-center" :data="tr" :key="indextr" v-for="(tr, indextr) in data">

                <vs-td>{{tr.id}}</vs-td>
                <vs-td>{{tr.company ? tr.company.com_name : ''}}</vs-td>
                <vs-td>{{tr.username}}</vs-td>
                <vs-td>{{tr.phone}}</vs-td>
                <vs-td>{{tr.email}}</vs-td>
                <vs-td>{{ (tr.projects) ? tr.projects.length: '0'}}건</vs-td>

              </vs-tr>
            </template>
          </vs-table>
        </vs-col>
      </vs-row>
    </vx-card>

  </div>
</template>

<script>
import PopupSearchCompany from '@/popup/PopupSearchCompany'
import TableListPage from '@/views/list/TableListPage'
import PartnerAgreement from '@/views/project/popup/template/PartnerAgreement'

export default {
  name: '_PlanPartnersInfo',
  components: {
    PartnerAgreement,
    TableListPage,
    PopupSearchCompany},
  props:{
    id:{
      type: Number,
      default:0
    }
  },
  data () {
    return {
      nav: {
        orderTarget: 'created_at',
        orderDirection: 'desc',
        keyword: []
      },
      heads: [
        {name: '업체명'},
        {name: '사업자번호'},
        {name: '대표자'},
        {name: '담당자명'},
        {name: '담당자 연락처'}
      ],

      userTable:{
        list:[],
        page: 1,
        perPage: 10,
        keyword: ''
      },

      form: {
        agreementInfo: {
          company: 0,
          managerName: '',
          managerPhone: '',
          amount: '',
          amountGroup: 0, // 50억이상 10억이상 5억이상 5억미만
          contractDate: '',
          termStartDate: '',
          termEndDate: '',
          contents: ''
        },
        basicInfo: {
          com_name: '',
          com_number: '',
          com_ceo: '',
          com_address: '',
          com_business_class: '', //업태
          com_business_type: '', //업종
          com_email: '',
          com_tel: '',
          com_fax: ''
        },
        fileInfo: {
          businessRegistration: {},
          etc: {}
        }
      }
    }
  },

  computed : {
    joinComTable () {
      return {
        list: this.$store.state.project.projectInfo.company,
        perPage: 5
      }
    },
    projectInfo () {
      return this.$store.state.project.projectInfo
    }
  },
  methods:{

    async handleItemClickDetail (data) {
      if (this.com.id !== data.id) {
        this.com.id = data.id
        this.com.com_number = data.com_number
        this.com.name = data.com_name
        this.com.ceo = data.com_ceo
        this.com.address = data.com_address
        this.com.business_class = data.com_business_class
        this.com.business_type = data.com_business_type
        await this.loadItem()
      } else {
        this.com = {
          id: '',
          name: '',
          com_number:'',
          ceo: '',
          address: '',
          business_class: '',
          business_type:''
        }

        this.userTable.list = []
        this.userTable.total = 0
      }
    },

    async loadMembers () {
      const projectId = this.$route.params.proj_id
      const page = this.userTable.page
      const perPage = this.userTable.perPage
      const company_id = this.form.agreementInfo.company

      this.userTable.list = []
      this.userTable.total = 0
      await this.$store.dispatch('project/LOAD_PROJECT_COMPANY_MEMBER_LIST', {page, perPage, projectId, company_id})

      const memberList = JSON.parse(JSON.stringify(this.$store.state.project.projectCompanyUserList))
      for (const member of memberList) {
        let join = 'N'
        if (member.projects.length > 0) {
          join = 'Y'
        }
        member['select'] = `${join}|${member.id}`
      }
      this.userTable.list = JSON.parse(JSON.stringify(memberList))
      this.userTable.total = this.$store.state.project.projectCompanyUserInfo.total

    },

    changePage (page) {
      this.userTable.page = page
      this.loadItem()
    },

    async handleClickLoadAll () {
      // 참여인력 전체

      const page = 1
      const perPage = 100
      const projectId = this.$route.params.proj_id

      await this.$store.dispatch('project/LOAD_PROJECT_USER', {page, perPage, projectId})
      const memberList = JSON.parse(JSON.stringify(this.$store.state.project.projectUserList))
      this.userTable.list = memberList
    },

    async changeProjectJoin (newData, oldData) {
      if (newData.select !== oldData.select) {
        const projectId = this.$route.params.proj_id
        const user_ids = oldData.id

        if (newData.select.split('|')[0] === 'N') {
          await this.$store.dispatch('project/DELETE_PROJECT_USER', {projectId, user_ids})
        } else if (newData.select.split('|')[0] === 'Y') {
          await this.$store.dispatch('project/ADD_PROJECT_USER', {projectId, user_ids})
        }
      }
    },

    onClickDetail (value) {
      const raw = value.raw
      const data = JSON.parse(raw.post_content)
      this.form = data
      this.form.id = raw.id

      this.loadMembers()
    },

    onLoadListAll (list) {
      if (list.length > 0) {
        list.map((value) => {
          if (`${value.id}` === `${this.id}`) {
            const data = JSON.parse(value.post_content)
            this.form = data
            this.form.id = value.id
            this.loadMembers()
          }
        })
      }
    },

    async onClickDelete () {

      if (confirm('삭제 하시겠습니까?')) {
        const boardId = 50
        const postId = this.form.id
        if (postId <= 0) {
          return
        }
        await this.$store.dispatch('board/DELETE_POST', {boardId, postId})

        await this.$refs.tablePlanPartnersInfo.loadList()
        this.form = {
          agreementInfo: {
            company: 0,
            managerName: '',
            managerPhone: '',
            amount: '',
            amountGroup: 0, // 50억이상 10억이상 5억이상 5억미만
            contractDate: '',
            termStartDate: '',
            termEndDate: '',
            contents: ''
          },
          basicInfo: {
            com_name: '',
            com_number: '',
            com_ceo: '',
            com_address: '',
            com_business_class: '', //업태
            com_business_type: '', //업종
            com_email: '',
            com_tel: '',
            com_fax: ''
          },
          fileInfo: {
            businessRegistration: {},
            etc: {}
          }
        }
        this.userTable.list = []
      }
    },
    async onClickUpdate () {
      const projectId = this.$route.params.proj_id
      const boardId = 50 //partner_agreement
      const title = this.projectInfo.field_name
      const content = JSON.stringify(this.form)
      const postId = this.form.id

      await this.$store.dispatch('board/UPDATE_POST', {
        projectId,
        postId,
        boardId,
        title,
        content
      })
      await this.$refs.tablePlanPartnersInfo.loadList()
      alert('수정되었습니다.')
    },
    getCol (index, value) {
      switch (index) {
        case 0: return this.getContent(value).basicInfo.com_name
        case 1: return this.getContent(value).basicInfo.com_number
        case 2: return this.getContent(value).basicInfo.com_ceo
        case 3: return this.getContent(value).agreementInfo.managerName
        case 4: return this.getContent(value).agreementInfo.managerPhone
      }
      return ''
    },
    getContent (data) {
      if (data.post_content) {
        const content = JSON.parse(data.post_content)
        return content
      }
    },

    comma (str) {
      str = `${str}`
      if (str && str.length > 0) {
        return str.replace(/,/gi, '').replace(/\B(?=(\d{3})+(?!\d))/gi, ',')
      }
    }
  }
}
</script>

<style scoped>
.vs-con-table.stripe .tr-values.active {
  background: rgba(var(--vs-secondary),1) !important;
  color:#fff !important;
}
</style>
