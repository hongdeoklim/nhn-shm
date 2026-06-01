<template>
  <vs-popup id="popupProjectWrite" :title="$t('popup.project.title')" :active="value" :buttonCloseHidden="true">
    <vs-row>

      <vs-col class="w-1/2 pr-2">

        <vs-col class="w-full pb-4 flex" vs-align="center">
          <vs-col class="w-3/12">{{$t('popup.project.column.계약코드')}}</vs-col>
          <vs-col class="w-9/12">
            <ml-input class="w-full" v-model="form.contract_code"/>
          </vs-col>
        </vs-col>

        <vs-col class="w-full pb-4 flex" vs-align="center">
          <vs-col class="w-3/12">기업구분</vs-col>
          <vs-col class="w-9/12">
            <vs-select autocomplete class="w-full" v-model="form.work_type">
              <vs-select-item v-for="item in project_work_type" :key="item.id" :text="item.name" :value="item.id"/>
            </vs-select>
          </vs-col>
        </vs-col>


        <vs-col class="w-full pb-4 flex" vs-align="center">
          <vs-col class="w-3/12">{{$t('popup.project.column.사업금액(원)')}}</vs-col>
          <vs-col class="w-9/12">
            <ml-input class="w-full" v-model="form.work_money_amount" @input="handleChangeMoeyAmount"/>
          </vs-col>
        </vs-col>

        <vs-col class="w-full pb-4 flex" vs-align="center">
          <vs-col class="w-3/12">{{$t('popup.project.column.지역')}}</vs-col>
          <vs-col class="w-9/12">
            <ml-input class="w-full" v-model="form.field_location"/>
          </vs-col>
        </vs-col>

        <vs-col class="w-full pb-4 flex" vs-align="center">
          <vs-col class="w-3/12">{{$t('popup.project.column.안전보건담당자')}}</vs-col>
          <vs-col class="w-9/12">
            <vs-select autocomplete class="w-full" v-model="form.safety_chief">
              <vs-select-item v-for="item in members" :key="item.id" :text="item.name" :value="item.id"/>
            </vs-select>
          </vs-col>
        </vs-col>

      </vs-col>

      <vs-col class="w-1/2 pl-2">
        <vs-col class="w-full pb-4 flex" vs-align="center">
          <vs-col class="w-3/12">부문</vs-col>
          <vs-col class="w-9/12">
            <vs-select autocomplete class="w-full" v-model="form.project_group">
              <vs-select-item v-for="item in project_group" :key="item.id" :text="item.name" :value="item.id"/>
            </vs-select>
          </vs-col>
        </vs-col>

        <vs-col class="w-full pb-4 flex" vs-align="center">
          <vs-col class="w-3/12">{{$t('popup.project.column.현장명')}}</vs-col>
          <vs-col class="w-9/12">
            <ml-input class="w-full" v-model="form.field_name"/>
          </vs-col>
        </vs-col>

        <vs-col class="w-full pb-4 flex" vs-align="center">
          <vs-col class="w-3/12">{{$t('popup.project.column.안전담당부서')}}</vs-col>
          <vs-col class="w-9/12">

            <vs-select autocomplete class="w-full" v-model="form.work_general">
              <vs-select-item v-for="item in companys" :key="item.id" :text="item.com_name" :value="item.id"/>
            </vs-select>
          </vs-col>
        </vs-col>

        <vs-col class="w-full pb-4 flex" vs-align="center">
          <vs-col class="w-3/12">{{$t('popup.project.column.안전보건부서장')}}</vs-col>
          <vs-col class="w-9/12">
            <vs-select autocomplete class="w-full" v-model="form.field_chief">
              <vs-select-item v-for="item in members" :key="item.id" :text="item.name" :value="item.id"/>
            </vs-select>
          </vs-col>
        </vs-col>

        <vs-col class="w-full pb-4 flex" vs-align="center">
          <vs-col class="w-3/12">{{$t('popup.project.column.대상기간')}}</vs-col>
          <vs-col class="w-9/12 flex" vs-align="center">
            <vs-col class="w-4/12">{{$t('popup.project.column.시작일')}}</vs-col>
            <vs-col class="w-8/12">
              <date-selector class="w-full popup-fixed" v-model="form.date_work_start"/>
            </vs-col>
          </vs-col>
        </vs-col>

        <vs-col class="w-full pb-4 flex" vs-align="center">
          <vs-col class="w-3/12"></vs-col>
          <vs-col class="w-9/12 flex" vs-align="center">
            <vs-col class="w-4/12">{{$t('popup.project.column.중간점검일')}}</vs-col>
            <vs-col class="w-8/12">
              <date-selector class="w-full popup-fixed" v-model="form.date_complete_expected"/>
            </vs-col>
          </vs-col>
        </vs-col>

        <vs-col class="w-full pb-4 flex" vs-align="center">
          <vs-col class="w-3/12"></vs-col>
          <vs-col class="w-9/12 flex" vs-align="center">
            <vs-col class="w-4/12">{{$t('popup.project.column.종료일')}}</vs-col>
            <vs-col class="w-8/12">
              <date-selector class="w-full popup-fixed" v-model="form.date_complete"/>
            </vs-col>
          </vs-col>
        </vs-col>

      </vs-col>

    </vs-row>

    <vs-row>
      <vs-col class="mb-4 flex" vs-align="center" vs-justify="flex-end">
        <vs-button class="mr-4 " color="#EDEDED" text-color="black" type="filled" @click="handleCloseSelf">{{$t('popup.project.취소')}}
        </vs-button>
        <vs-button class="" color="secondary" @click="handleClickRegister">{{$t('popup.project.생성')}}</vs-button>
      </vs-col>
    </vs-row>
  </vs-popup>
</template>

<script>
import DateSelector from '@/components/selector/DateSelector'

export default {
  name: 'PopupProjectWrite',
  components: {
    DateSelector
  },
  props: {
    value: Boolean
  },
  computed: {
    showPopupSync: {
      get () {
        return this.value
      },
      set () {
        this.handleCloseSelf()
      }
    },

    projectId () {
      return this.$route.params.proj_id
    },
  },
  data () {
    return {
      showPopup: false,
      members: [],
      companys: [],
      project_group: [],
      project_work_type: [],
      constId: '', // 시공사 (constructor는 예약어로 사용이 불가능하여 별도로 만듬)
      form: {
        contract_code: '', // 계약코드
        project_group: '', // 사업구분
        work_type: '', // 사업구분
        field_name: '', // 현장이름
        field_chief: '', // 안전보건부서장
        safety_chief: '', // 안전보건담당자
        field_location: '', // 지역
        client: '', // 관할부처
        constructor: '', // 시공사
        work_general: '', //안전담당부서
        work_money_amount: '', //사업금액
        date_work_start: '', //시작일
        date_complete_expected: '', //중간점검일
        date_complete: '' //종료일
      }
    }
  },


  mounted () {
    const backButtonRouteGuard = this.$router.beforeEach((to, from, next) => {
      if (this.value) {
        this.handleCloseSelf()
        next(false); return
      }
      next(true)
    })
    this.$once('hook:destroyed', () => {
      backButtonRouteGuard()
    })
  },

  async created () {

    const page = 1
    const perPage = 10000
    const keyword = ''
    await this.$store.dispatch('member/LOAD_MEMBERS', {
      page,
      perPage,
      keyword,
      projectId: this.$route.params.proj_id
    })
    this.members = this.$store.state.member.list

    await this.loadCompany()
    await this.loadProjectGroup()
    await this.loadProjectWorkType()
  },
  methods: {

    formCheck () {
      if (this.form.contract_code.trim().length <= 0) {
        alert('계약코드를 입력해주세요')
        return false
      } else if (this.form.field_name.trim().length <= 0) {
        alert('현장명을 입력해주세요')
        return false
      } else if (this.form.field_chief === '' || Number(this.form.field_chief) === 0) {
        alert('안전보건부서장을 선택해주세요')
        return false
      } else if (this.form.safety_chief === '' || Number(this.form.safety_chief) === 0) {
        alert('안전보건담당자를 선택해주세요')
        return false
      } else if (this.form.field_location.trim().length <= 0) {
        alert('지역을 입력해주세요')
        return false
      } else if (this.form.constructor === '' || Number(this.form.constructor) === 0) {
        alert('시공사를 선택해주세요')
        return false
      } else if (this.form.project_group === '' || Number(this.form.project_group) === 0) {
        alert('사업구분을 선택해주세요')
        return false
      } else if (this.form.work_type === '' || Number(this.form.work_type) === 0) {
        alert('기업구분을 선택해주세요')
        return false
      } else if (this.form.work_general === '' || Number(this.form.work_general) === 0) {
        alert('안전담당부서을 선택해주세요')
        return false
      } else if (this.form.work_money_amount.trim().length <= 0) {
        alert('사업금액을 입력해주세요')
        return false
      } else if (this.form.date_work_start.trim().length <= 0) {
        alert('시작일을 선택해주세요')
        return false
      } else if (this.form.date_complete_expected.trim().length <= 0) {
        alert('중간점검일을 선택해주세요')
        return false
      } else if (new Date(this.form.date_complete_expected) - new Date(this.form.date_work_start) < 0) {
        alert('중간점검일은 시작일보다 빠를 수 없습니다')
        return false
      } else if (this.form.date_complete.trim().length <= 0) {
        alert('종료일을 선택해주세요')
        return false
      } else if (new Date(this.form.date_complete) - new Date(this.form.date_work_start) < 0) {
        alert('종료일은 시작일보다 빠를 수 없습니다')
        return false
      }

      return true
    },

    async registerProject () {
      this.form.date_work_start = new Date(this.form.date_work_start).format('yyyy-MM-dd HH:mm:ss')
      this.form.date_complete_expected = new Date(this.form.date_complete_expected).format('yyyy-MM-dd HH:mm:ss')
      this.form.date_complete = new Date(this.form.date_complete).format('yyyy-MM-dd HH:mm:ss')
      this.form['constructor'] = this.constId
      this.form.work_type = 1
      this.form.work_money_amount = this.form.work_money_amount.replace(/,/gi, '')

      if (this.formCheck()) {
        await this.$store.dispatch('project/CREATE_PROJECT', this.form)
        this.$emit('input', false)
        document.location.reload()
      } else {
        this.form.work_money_amount = this.form.work_money_amount.replace(/,/gi, '').replace(/\B(?=(\d{3})+(?!\d))/gi, ',')
      }

    },

    async loadCompany () {
      const page = 1, perPage = 10, keyword = ''

      const projectId = this.projectId
      await this.$store.dispatch('company/LOAD_COMPANY_LIST', {
        page,
        perPage,
        keyword,
        projectId
      })
      //const info = this.$store.state.company.companyListInfo
      this.companys = this.$store.state.company.companyList
    },

    async loadProjectGroup () {
      const page = 1, perPage = 10, keyword = ''
      await this.$store.dispatch('project/LOAD_PROJECT_GROUP', {
        page,
        perPage,
        keyword
      })
      this.project_group = this.$store.state.project.projectGroup
    },
    async loadProjectWorkType () {
      const page = 1, perPage = 10, keyword = ''
      await this.$store.dispatch('project/LOAD_PROJECT_WORKTYPE', {
        page,
        perPage,
        keyword
      })
      this.project_work_type = this.$store.state.project.projectWorkType
    },

    handleClickRegister () {
      this.registerProject()
    },

    handleCloseSelf () {
      this.form = {
        contract_code: '', // 계약코드
        project_group: '', // 현장명
        work_type: '', // 사업구분
        field_name: '', // 현장이름
        field_chief: '', // 안전보건부서장
        safety_chief: '', // 안전보건담당자
        field_location: '', // 지역
        client: '', // 관할부처
        constructor: '', // 시공사
        work_general: '', //안전담당부서
        work_money_amount: '', //사업금액
        date_work_start: '', //시작일
        date_complete_expected: '', //중간점검일
        date_complete: '' //종료일
      }
      this.$emit('input', false)
    },

    handleChangeMoeyAmount (value) {
      this.form.work_money_amount = value.replace(/,/gi, '').replace(/\B(?=(\d{3})+(?!\d))/gi, ',')
    }
  }
}
</script>

<style>
#popupProjectWrite.con-vs-popup .vs-popup {
  width: 700px !important;
}
</style>
