<template>
  <div>
    <vx-card>
      <div class="vx-row mb-4">
        <div class="vx-col sm:w-full w-full">
          <div class="vx-row ">
            <h5 class="flex vx-col sm:w-2/12" >계약코드</h5>
            <ml-input class="vx-col sm:w-8/12 w-full mb-2" placeholder="계약코드" v-model="form.contract_code"/>
          </div>
          <div class="vx-row ">
            <h5 class="flex vx-col sm:w-2/12" >현장명</h5>
            <ml-input class="vx-col sm:w-8/12 w-full mb-2" placeholder="현장명" v-model="form.field_name"/>
          </div>
          <div class="vx-row ">
            <h5 class="flex vx-col sm:w-2/12" >안전보건부서장</h5>
            <ml-input class="vx-col sm:w-8/12 w-full mb-2" placeholder="안전보건부서장" v-model="form.field_chief"/>
          </div>
          <div class="vx-row ">
            <h5 class="flex vx-col sm:w-2/12" >지역</h5>
            <ml-input class="vx-col sm:w-8/12 w-full mb-2" placeholder="지역" v-model="form.field_location"/>
          </div>
          <div class="vx-row ">
            <h5 class="flex vx-col sm:w-2/12" >관할부처</h5>
            <ml-input class="vx-col sm:w-8/12 w-full mb-2" placeholder="관할부처" v-model="form.client"/>
          </div>
          <div class="vx-row ">
            <h5 class="flex vx-col sm:w-2/12" >기업구분</h5>
            <ml-input class="vx-col sm:w-8/12 w-full mb-2" placeholder="사업구분" v-model="form.work_type"/>
          </div>
          <div class="vx-row ">
            <h5 class="flex vx-col sm:w-2/12" >안전담당부서</h5>
            <ml-input class="vx-col sm:w-8/12 w-full mb-2" placeholder="안전담당부서" v-model="form.work_general"/>
          </div>
          <div class="vx-row ">
            <h5 class="flex vx-col sm:w-2/12" >안전보건담당자</h5>
            <ml-input class="vx-col sm:w-8/12 w-full mb-2" placeholder="안전보건담당자" v-model="form.safety_chief"/>
          </div>
          <div class="vx-row ">
            <h5 class="flex vx-col sm:w-2/12" >사업금액</h5>
            <comma-input class="vx-col sm:w-8/12 w-full mb-2" placeholder="사업금액" v-model="form.work_money_amount"/>
          </div>
          <p class="mb-3">대상기간</p>
          <div class="vx-row ">
            <h5 class="flex vx-col sm:w-2/12" >시작일</h5>
            <div class="vx-col sm:w-3/12 w-full mb-2 flex">
              <date-selector class="mr-4" v-model="form.date_work_start" ></date-selector>
              <vs-button class="small mr-8 py-1 px-2"
                         color="primary"
                         type="border"
                         @click="$refs.calendar1.showCalendar()">
                <feather-icon class="btn-icon" icon="CalendarIcon"/>
              </vs-button>
            </div>
          </div>
          <div class="vx-row ">
            <h5 class="flex vx-col sm:w-2/12" >중간점검일</h5>
            <div class="vx-col sm:w-3/12 w-full mb-2 flex">
              <date-selector class="mr-4" v-model="form.date_complete_expected" ></date-selector>
              <vs-button class="small mr-8 py-1 px-2"
                         color="primary"
                         type="border"
                         @click="$refs.calendar2.showCalendar()">
                <feather-icon class="btn-icon" icon="CalendarIcon"/>
              </vs-button>
            </div>
          </div>
          <div class="vx-row ">
            <h5 class="flex vx-col sm:w-2/12" >종료일</h5>
            <div class="vx-col sm:w-3/12 w-full mb-2 flex">
              <date-selector class="mr-4" v-model="form.date_complete" ></date-selector>
              <vs-button class="small mr-8 py-1 px-2"
                         color="primary"
                         type="border"
                         @click="$refs.calendar3.showCalendar()">
                <feather-icon class="btn-icon" icon="CalendarIcon"/>
              </vs-button>
            </div>
          </div>

        </div>
      </div>

      <vs-row class="w-full mt-8" vs-justify="center">
        <vs-button class="sm:w-2/12 mr-4 large" color="secondary" @click="handleClickRegister">저장</vs-button>
        <vs-button class="sm:w-2/12 large" color="#EDEDED" text-color="black" type="filled" @click="handleCancel">취소</vs-button>
      </vs-row>

    </vx-card>
  </div>
</template>

<script>
import DateSelector from '@/components/selector/DateSelector'

export default {
  name: 'ProjectWrite',
  components: {
    DateSelector
  },
  data () {
    return {
      form : {
        contract_code: '', //계약코드
        field_name: '', // 현장이름
        field_chief: '', // 안전보건부서장
        safety_chief: '', // 안전보건담당자
        field_location: '', // 지역
        client: '', // 관할부처
        work_type: '', //사업구분
        work_general: '', //안전담당부서
        work_money_amount: '', //사업금액
        date_work_start: '', //시작일
        date_complete_expected:'', //중간점검일
        date_complete: '' //종료일
      }
    }
  },
  methods: {

    async registerProject () {
      this.form.date_work_start = new Date(this.form.date_work_start).format('yyyy-MM-dd HH:mm:ss')
      this.form.date_complete_expected = new Date(this.form.date_complete_expected).format('yyyy-MM-dd HH:mm:ss')
      this.form.date_complete = new Date(this.form.date_complete).format('yyyy-MM-dd HH:mm:ss')

      await this.$store.dispatch('project/CREATE_PROJECT', this.form)

      this.$router.back()
    },

    handleClickRegister () {
      this.registerProject()
    },

    handleCancel () {
      this.$router.back()
    }
  }
}
</script>

<style scoped>

</style>
