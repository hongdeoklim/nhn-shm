<template>
  <div>
    <vs-row v-if="form && form.agreementInfo">
      <vs-col class="mb-4"><h5><i class="dot"></i>계약 정보</h5></vs-col>
      <vs-row class="w-full mb-4" style="display: grid; grid-template-columns: 1fr 1fr 1fr; column-gap:2rem; row-gap: 14px;">
        <vs-col class="flex" vs-align="center">
          <label class="w-4/12 title ">현장명</label>
          <span class="w-8/12"><ml-input class="w-full" v-model="form.agreementInfo.projectName" :readonly="true"/></span>
        </vs-col>
        <vs-col class="flex" vs-align="center">
          <label class="w-4/12 title ">계약코드</label>
          <span class="w-8/12"><ml-input class="w-full" v-model="form.agreementInfo.code"/></span>
        </vs-col>
        <vs-col class="flex" vs-align="center">
          <label class="w-4/12 title ">사업명</label>
          <span class="w-8/12"><ml-input class="w-full" v-model="form.agreementInfo.title"/></span>
        </vs-col>
        <vs-col class="flex" vs-align="center">
          <label class="w-4/12 title ">업체명</label>
          <span class="w-8/12">
            <span v-if="isUpdate"><ml-input class="w-full" :value="form.basicInfo.com_name" :readonly="true"/></span>
            <company-selector v-else v-model="form.agreementInfo.company" @select="onSelectCompany"/>
          </span>
        </vs-col>
        <vs-col class="flex" vs-align="start">
          <label class="w-4/12 title " style="height:38px; display: flex;align-items: center;">계약일</label>
          <span class="w-8/12"><date-selector class="w-full" v-model="form.agreementInfo.contractDate"/></span>
        </vs-col>
        <vs-col class="flex" vs-align="start">
          <label class="w-4/12 title " style="height:38px; display: flex;align-items: center;">계약기간</label>
          <span class="w-8/12">
            <vs-row class="w-full">
              <vs-col class="mb-2 grid" vs-align="center" style="grid-template-columns: auto 1fr; gap:1rem;">
                <label class="title ">시작일</label>
                <span><date-selector class="w-full" v-model="form.agreementInfo.termStartDate"/></span>
              </vs-col>
            </vs-row>
          </span>
        </vs-col>
        <vs-col class="flex" vs-align="center">
          <label class="w-4/12 title ">계약금액</label>
          <span class="w-8/12"><comma-input class="w-full" v-model="form.agreementInfo.amount"/></span>
        </vs-col>
        <vs-col class="flex" vs-align="center">
          <label class="w-4/12 title ">안전관리비</label>
          <span class="w-8/12"><ml-input class="w-full" v-model="form.agreementInfo.amountSafety"/></span>
        </vs-col>
        <vs-col class="flex" vs-align="start">
          <label class="w-4/12 title " style="height:38px; display: flex;align-items: center;"></label>
          <span class="w-8/12">
            <vs-row class="w-full" style="margin-bottom:14px;">
              <vs-col class="grid" vs-align="center" style="grid-template-columns: auto 1fr; gap:1rem;">
                <label class="title ">종료일</label>
                <span><date-selector class="w-full" v-model="form.agreementInfo.termEndDate"/></span>
              </vs-col>
            </vs-row>
          </span>
        </vs-col>
      </vs-row>
      <vs-row>
        <vs-col class="flex" vs-align="start" style="display: grid !important; grid-template-columns: 1fr 8fr">
          <label class="w-full title " style=" height:38px; display: flex;align-items: center;">내용</label>
          <ml-textarea style="max-width: 1000px;" rows="3" v-model="form.agreementInfo.contents" :placeholder="'1. 계약업체 대표번호 : \n'+
'2. 계약업체 FAX : \n'+
'3. 계약업체 홈페이지 :  '"/>
        </vs-col>
      </vs-row>
    </vs-row>

    <vs-row v-if="form && form.basicInfo">
      <vs-col class="mb-4"><h5><i class="dot"></i>기본정보</h5></vs-col>
      <vs-row class="w-full mb-4" style="display: grid; grid-template-columns: 1fr 1fr 1fr; column-gap:2rem; row-gap: 14px;">
        <vs-col class="flex" vs-align="center">
          <label class="w-4/12 title ">업태</label>
          <span class="w-8/12"><ml-input class="w-full" v-model="form.basicInfo.com_business_class" /></span>
        </vs-col>
        <vs-col class="flex" vs-align="center">
          <label class="w-4/12 title ">업종</label>
          <span class="w-8/12"><ml-input class="w-full" v-model="form.basicInfo.com_business_type" /></span>
        </vs-col>
        <vs-col></vs-col>
        <vs-col class="flex" vs-align="center">
          <label class="w-4/12 title ">사업자번호</label>
          <span class="w-8/12"><ml-input class="w-full" v-model="form.basicInfo.com_number" /></span>
        </vs-col>
        <vs-col class="flex" vs-align="center">
          <label class="w-4/12 title ">주소</label>
          <span class="w-8/12"><ml-input class="w-full" v-model="form.basicInfo.com_address" /></span>
        </vs-col>
        <vs-col class="flex" vs-align="center">
          <label class="w-4/12 title ">대표자</label>
          <span class="w-8/12"><ml-input class="w-full" v-model="form.basicInfo.com_ceo" /></span>
        </vs-col>
        <vs-col class="flex" vs-align="center">
          <label class="w-4/12 title ">대표번호</label>
          <span class="w-8/12"><ml-input class="w-full" v-model="form.basicInfo.com_tel"/></span>
        </vs-col>

        <vs-col class="flex" vs-align="center">
          <label class="w-4/12 title ">이메일</label>
          <span class="w-8/12"><ml-input class="w-full" v-model="form.basicInfo.com_email"/></span>
        </vs-col>
        <vs-col class="flex" vs-align="center">
          <label class="w-4/12 title ">FAX</label>
          <span class="w-8/12"><ml-input class="w-full" v-model="form.basicInfo.com_fax"/></span>
        </vs-col>
        <vs-col class="flex" vs-align="center">
          <label class="w-4/12 title ">본사 담당자</label>
          <span class="w-8/12"><ml-input class="w-full" v-model="form.basicInfo.adminName"/></span>
        </vs-col>
        <vs-col class="flex" vs-align="center">
          <label class="w-4/12 title ">연락처</label>
          <span class="w-8/12"><ml-input class="w-full" v-model="form.basicInfo.adminPhone"/></span>
        </vs-col>
        <vs-col class="flex" vs-align="center">
          <label class="w-4/12 title ">이메일</label>
          <span class="w-8/12"><ml-input class="w-full" v-model="form.basicInfo.adminEmail"/></span>
        </vs-col>
        <vs-col class="flex" vs-align="center">
          <label class="w-4/12 title ">현장 담당자</label>
          <span class="w-8/12"><ml-input class="w-full" v-model="form.basicInfo.managerName"/></span>
        </vs-col>
        <vs-col class="flex" vs-align="center">
          <label class="w-4/12 title ">연락처</label>
          <span class="w-8/12"><ml-input class="w-full" v-model="form.basicInfo.managerPhone"/></span>
        </vs-col>
        <vs-col class="flex" vs-align="center">
          <label class="w-4/12 title ">이메일</label>
          <span class="w-8/12"><ml-input class="w-full" v-model="form.basicInfo.managerEmail"/></span>
        </vs-col>
      </vs-row>
    </vs-row>

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
  </div>
</template>

<script>
import DateSelector from '@/components/selector/DateSelector'
import FileUploader from '@/components/FileUploader'
import CompanySelector from '@/components/selector/CompanySelector'
export default {
  name: 'PartnerAgreement',
  components: {
    CompanySelector,
    FileUploader,
    DateSelector
  },
  props: {
    form:{},
    comReadonly: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    projectInfo () {
      return this.$store.state.project.projectInfo
    },
    isUpdate () {
      return !!this.$route.params.id
    }
  },
  watch: {
    projectInfo () {
      this.form.agreementInfo.projectName = this.projectInfo.field_name
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
      selectCompany: {},
    }
  },
  methods: {

    onSelectCompany (value) {
      this.selectCompany = value

      this.form.basicInfo.com_name = this.selectCompany.com_name
      this.form.basicInfo.com_number = this.selectCompany.com_number
      this.form.basicInfo.com_ceo = this.selectCompany.com_ceo
      this.form.basicInfo.com_address = this.selectCompany.com_address
      this.form.basicInfo.com_business_class = this.selectCompany.com_business_class
      this.form.basicInfo.com_business_type = this.selectCompany.com_business_type
    }
  }
}
</script>

<style scoped>

</style>
