<template>
  <vs-popup id="popupStaffAdd" title="신규작성" :active.sync="popupActiveSync">
    <vs-row>
      <partner-agreement :form="form"/>
    </vs-row>

    <vs-row>
      <vs-col class="flex" vs-justify="center">
        <vs-button class="mr-2" color="secondary" @click="register">등록</vs-button>
        <vs-button type="border" color="secondary" @click="handleCloseSelf">취소</vs-button>
      </vs-col>
    </vs-row>
  </vs-popup>
</template>

<script>
import PartnerAgreement from '@/views/project/popup/template/PartnerAgreement'

export default {
  name: 'PopupPartnerAgreementAdd',
  components: {
    PartnerAgreement
  },
  props: {
    popupActive: Boolean,
    postId: [Number, String]
  },
  watch: {
    popupActive (value) {
      if (value === false) {
        this.selectCompany = {}
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
      }
    },

    popupActiveSync(value) {
      const body = document.querySelector('body');
      if (value) {
        body.style.overflow = 'hidden'
      } else {
        body.style.overflow = 'auto'
      }
    },

    'form.agreementInfo.amount' (value) {

      const typeValue = value / 100000000
      if (typeValue >= 50) {
        this.form.agreementInfo.amountGroup = 50
      } else if (typeValue >= 10) {
        this.form.agreementInfo.amountGroup = 10
      } else if (typeValue >= 5) {
        this.form.agreementInfo.amountGroup = 5
      } else {
        this.form.agreementInfo.amountGroup = 0
      }
    }
  },
  data () {
    return {
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
  computed: {
    popupActiveSync: {
      get () {
        return this.popupActive
      },
      set () {
        this.handleCloseSelf()
      }
    },
    projectInfo () {
      return this.$store.state.project.projectInfo
    }
  },
  mounted () {
    const backButtonRouteGuard = this.$router.beforeEach((to, from, next) => {
      if (this.popupActive) {
        this.handleCloseSelf()
        next(false)
        return
      }
      next(true)
    })
    this.$once('hook:destroyed', () => {
      backButtonRouteGuard()
    })
  },

  created () {
  },
  methods: {
    handleCloseSelf () {
      this.$emit('popupActiveSync', false)
    },

    async register () {
      const projectId = this.$route.params.proj_id
      const boardId = 50 //partner_agreement
      const title = this.projectInfo.field_name

      this.form.summary = {
        agreementInfo: [
          {[this.form.basicInfo.com_name]: this.form.agreementInfo.amount}]
      }
      const content = JSON.stringify(this.form)
      await this.$store.dispatch('board/CREATE_POST', {
        projectId,
        boardId,
        title,
        content
      })

      this.$emit('add')
      this.handleCloseSelf()
    }
  }
}

</script>

<style>
#popupStaffAdd > .vs-popup {
  width: 860px !important;
}

#popupStaffAdd > .vs-popup > .vs-popup--content {
  width: 100%;
  padding: 0;
  margin: 0;
}

#popupStaffAdd > .vs-popup > .vs-popup--content > .vs-row {
  padding: 24px;

}
</style>

<style scoped>
</style>
