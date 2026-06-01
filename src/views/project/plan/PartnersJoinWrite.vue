<template>
  <div>
    <vx-card>
      <vs-row>
        <vs-col class="flex ml-auto" style="width:auto;">
          <vs-button class="mr-4" color="secondary" @click="back" type="border" >목록</vs-button>
          <vs-button v-if="parseInt(`${myLv}`) <= 3" class="mr-4" color="secondary" @click="register"> {{ postId ? '수정' : '저장'}}</vs-button>
        </vs-col>
      </vs-row>


      <vs-row class="mb-8">
        <!-- 기본정보 -->
        <vs-col class="w-full grid" style="position: relative">
          <vs-row>
            <vs-col class="mb-4"><h5><i class="dot"></i>요청자 정보(공단)</h5></vs-col>
            <vs-row class="w-full mb-4" style="display: grid; grid-template-columns: 1fr 1fr 1fr; column-gap:2rem; row-gap: 14px;">
              <vs-col class="flex" vs-align="center">
                <label class="w-4/12 title ">현장명</label>
                <span class="w-8/12"><ml-input class="w-full" v-model="form.requesterInfo.projectName" :readonly="true"/></span>
              </vs-col>
              <vs-col class="flex" vs-align="center">
                <label class="w-4/12 title ">소속</label>
                <span class="w-8/12"><ml-input class="w-full" v-model="form.requesterInfo.team_name" :readonly="true"/></span>
              </vs-col>
              <vs-col class="flex" vs-align="center">
                <label class="w-4/12 title ">부서</label>
                <span class="w-8/12"><ml-input class="w-full" v-model="form.requesterInfo.com_name" :readonly="true"/></span>
              </vs-col>
              <vs-col class="flex" vs-align="center">
                <label class="w-4/12 title ">작성자</label>
                <span class="w-8/12"><ml-input class="w-full" v-model="form.requesterInfo.writer" :readonly="true"/></span>
              </vs-col>
              <vs-col class="flex" vs-align="center">
                <label class="w-4/12 title ">연락처</label>
                <span class="w-8/12"><ml-input class="w-full" v-model="form.requesterInfo.phone"/></span>
              </vs-col>
              <vs-col class="flex" vs-align="center">
                <label class="w-4/12 title ">이메일</label>
                <span class="w-8/12"><ml-input class="w-full" v-model="form.requesterInfo.email"/></span>
              </vs-col>
            </vs-row>
          </vs-row>
        </vs-col>

        <!-- 파트너사 정보 -->
        <vs-col class="w-full grid" style="position: relative">
          <vs-row>
            <vs-col class="mb-4"><h5><i class="dot"></i>파트너사 정보</h5></vs-col>
            <vs-row class="w-full mb-4" style="display: grid; grid-template-columns: 1fr 1fr 1fr; column-gap:2rem; row-gap: 14px;">
              <vs-col class="flex" vs-align="center">
                <label class="w-4/12 title ">사업명</label>
                <span class="w-8/12"><ml-input class="w-full" v-model="form.partnerInfo.title" /></span>
              </vs-col>
              <vs-col class="flex" vs-align="center">
                <label class="w-4/12 title ">업체명</label>
                <span class="w-8/12"><ml-input class="w-full" v-model="form.partnerInfo.com_name" /></span>
              </vs-col>
              <vs-col></vs-col>
              <vs-col class="flex" vs-align="center">
                <label class="w-4/12 title ">업체 담당자</label>
                <span class="w-8/12"><ml-input class="w-full" v-model="form.partnerInfo.manager_name" /></span>
              </vs-col>
              <vs-col class="flex" vs-align="center">
                <label class="w-4/12 title ">연락처</label>
                <span class="w-8/12"><ml-input class="w-full" v-model="form.partnerInfo.phone" /></span>
              </vs-col>
              <vs-col class="flex" vs-align="center">
                <label class="w-4/12 title ">이메일</label>
                <span class="w-8/12"><ml-input class="w-full" v-model="form.partnerInfo.email" /></span>
              </vs-col>
            </vs-row>
            <vs-row>
              <vs-col class="flex" vs-align="center" style="display: grid !important; grid-template-columns: 1fr 8fr;">
                <label class="title">내용</label>
                <span>
                  <ml-textarea class="w-full" rows="5" v-model="form.partnerInfo.contents" />
                </span>
              </vs-col>
            </vs-row>
          </vs-row>
        </vs-col>
      </vs-row>

      <!-- 첨부파일 -->
      <vs-row v-if="form && form.fileInfo">
        <vs-col class="my-4"><h5><i class="dot"></i>첨부파일</h5></vs-col>
        <vs-row class="mb-4" style="display: grid; grid-template-columns: 1fr 1fr 1fr; column-gap:2rem; row-gap: 14px;">
          <vs-col class="flex" vs-align="center">
            <label class="w-4/12 title ">사업자등록증</label>
            <span class="w-8/12"><file-uploader class="w-full" v-model="form.fileInfo.businessRegistration"/></span>
          </vs-col>
          <vs-col></vs-col>
          <vs-col></vs-col>
          <vs-col class="flex" vs-align="center">
            <label class="w-4/12 title ">기타 첨부파일</label>
            <span class="w-8/12"><file-uploader class="w-full" v-model="form.fileInfo.etc"/></span>
          </vs-col>
          <vs-col></vs-col>
          <vs-col></vs-col>
        </vs-row>
      </vs-row>
    </vx-card>
  </div>
</template>

<script>
import PopupSearchCompany from '@/popup/PopupSearchCompany'
import TableListPage from '@/views/list/TableListPage'
import PartnerAgreement from '@/views/project/popup/template/PartnerAgreement'
import FileUploader from '@/components/FileUploader'

export default {
  name: 'PartnersJoinWrite',
  components: {
    FileUploader,
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
        requesterInfo: {
          projectName: '',
          com_name: '',
          team_name: '',
          writer: '',
          phone: '',
          email: ''
        },
        partnerInfo: {
          title: '',
          com_name: '',
          manager_name: '',
          phone: '',
          email: '',
          contents: ''
        },
        fileInfo: {
          businessRegistration: {},
          etc: {}
        }
      }
    }
  },

  watch: {
    projectInfo:{
      deep:true,
      immediate:true,
      handler () {
        this.form.requesterInfo.projectName = this.projectInfo.field_name
      },
    },

    userInfo: {
      deep: true,
      immediate: true,
      handler () {
        this.form.requesterInfo.writer = this.userInfo.name

        this.$store.dispatch('company/LOAD_COMPANY', {
          companyId: this.userInfo.company_id
        }).then(value => {
          this.form.requesterInfo.team_name = this.userInfo.department
          this.form.requesterInfo.com_name = value.com_name
        })
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
    },
    userInfo () {
      return this.$store.state.auth.userInfo
    },
    myLv () {
      return this.$store.state.auth.userInfo.position
    },
    postId () {
      return this.$route.params.postId
    }

  },
  mounted () {

    if (this.$route.params.postId) {
      this.loadPartner()
    } else {

    }
  },
  methods:{

    async loadPartner () {
      // 내용불러오기
      const boardId = 52
      const postId = this.$route.params.postId
      await this.$store.dispatch('board/LOAD_POST', {boardId, postId})
      const post = this.$store.state.board.postInfo
      const contents = JSON.parse(post.post_content)
      this.form = contents
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

    back () {
      this.$router.back()
    },

    async register () {
      const projectId = this.$route.params.proj_id
      const boardId = 52
      const title = this.projectInfo.field_name
      const content = JSON.stringify(this.form)

      if (this.$route.params.postId) {
        const postId = this.$route.params.postId
        await this.$store.dispatch('board/UPDATE_POST', {
          projectId,
          boardId,
          postId,
          title,
          content
        }).then(value => {
          this.back()
        })

      } else {
        await this.$store.dispatch('board/CREATE_POST', {
          projectId,
          boardId,
          title,
          content
        }).then(value => {
          this.back()
        })
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
