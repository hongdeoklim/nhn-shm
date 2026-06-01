<template>
  <div>
    <vs-row class="my-4">
      <vs-col><h5><i class="dot"></i>안전보건관리비</h5></vs-col>
    </vs-row>
    <vs-row class="mb-8"
            style="border:1px solid #cdcdcd; display: grid; grid-template-columns: auto 1fr;">
      <vs-col class="p-4 font-bold flex border-right header-bg" style="width:125px;" vs-justify="center"
              vs-align="center">
        안전보건관리비
      </vs-col>
      <vs-col>
        <ul class="table table-5" style="border-bottom:none;">
          <li class="header header-bg grid-row">
            <span>항목별</span>
            <span>배정액(단위: 원)</span>
            <span>당월사용금액(단위: 원)</span>
            <span>누계사용금액(단위: 원)</span>
            <span>집행률(단위: %)</span>
          </li>

          <!-- 안전보건인건비 -->
          <li class="grid-row">
            <span class="header-bg">안전보건인건비</span>
            <span>
              <span class="isPrint" v-if="isPrint">{{ form.safety_and_health_labor_cost.amount }}</span>
              <ml-input v-else class="w-full" v-model="form.safety_and_health_labor_cost.amount" :readonly="readonly" @keyup="calculate"/>
            </span>
            <span>
              <span class="isPrint" v-if="isPrint">{{ form.safety_and_health_labor_cost.amount_used }}</span>
              <ml-input v-else class="w-full" v-model="form.safety_and_health_labor_cost.amount_used" :readonly="readonly" @keyup="calculate"/>
            </span>
            <span>
              <span class="isPrint" v-if="isPrint">{{ form.safety_and_health_labor_cost.accumulated_amount }}</span>
              <ml-input v-else class="w-full" v-model="form.safety_and_health_labor_cost.accumulated_amount" :readonly="true"/>
            </span>
            <span>
              <span class="isPrint" v-if="isPrint">{{ form.safety_and_health_labor_cost.run_rate }}</span>
              <ml-input v-else class="w-full" v-model="form.safety_and_health_labor_cost.run_rate" :readonly="true"/>
            </span>
          </li>

          <!-- 안전보건교육 -->
          <li class="grid-row">
            <span class="header-bg">안전보건교육<br>(관리감독자 교육 포함)</span>
            <span>
              <span class="isPrint" v-if="isPrint">{{ form.safety_and_health_education.amount }}</span>
              <ml-input v-else class="w-full" v-model="form.safety_and_health_education.amount" :readonly="readonly" @keyup="calculate"/>
            </span>
            <span>
              <span class="isPrint" v-if="isPrint">{{ form.safety_and_health_education.amount_used }}</span>
              <ml-input v-else class="w-full" v-model="form.safety_and_health_education.amount_used" :readonly="readonly" @keyup="calculate"/>
            </span>
            <span>
              <span class="isPrint" v-if="isPrint">{{ form.safety_and_health_education.accumulated_amount }}</span>
              <ml-input v-else class="w-full" v-model="form.safety_and_health_education.accumulated_amount" :readonly="true"/>
            </span>
            <span>
              <span class="isPrint" v-if="isPrint">{{ form.safety_and_health_education.run_rate }}</span>
              <ml-input v-else class="w-full" v-model="form.safety_and_health_education.run_rate" :readonly="true"/>
            </span>
          </li>

          <!-- 위험성평가 -->
          <li class="grid-row">
            <span class="header-bg">위험성평가</span>
            <span>
              <span class="isPrint" v-if="isPrint">{{ form.risk_assessment.amount }}</span>
              <ml-input v-else class="w-full" v-model="form.risk_assessment.amount" :readonly="readonly" @keyup="calculate"/>
            </span>
            <span>
              <span class="isPrint" v-if="isPrint">{{ form.risk_assessment.amount_used }}</span>
              <ml-input v-else class="w-full" v-model="form.risk_assessment.amount_used" :readonly="readonly" @keyup="calculate"/>
            </span>
            <span>
              <span class="isPrint" v-if="isPrint">{{ form.risk_assessment.accumulated_amount }}</span>
              <ml-input v-else class="w-full" v-model="form.risk_assessment.accumulated_amount" :readonly="true"/>
            </span>
            <span>
              <span class="isPrint" v-if="isPrint">{{ form.risk_assessment.run_rate }}</span>
              <ml-input v-else class="w-full" v-model="form.risk_assessment.run_rate" :readonly="true"/>
            </span>
          </li>

          <!-- 업무상재해보상 -->
          <li class="grid-row">
            <span class="header-bg">업무상재해보상</span>
            <span>
              <span class="isPrint" v-if="isPrint">{{ form.industrial_accident_compensation.amount }}</span>
              <ml-input v-else class="w-full" v-model="form.industrial_accident_compensation.amount" :readonly="readonly" @keyup="calculate"/>
            </span>
            <span>
              <span class="isPrint" v-if="isPrint">{{ form.industrial_accident_compensation.amount_used }}</span>
              <ml-input v-else class="w-full" v-model="form.industrial_accident_compensation.amount_used" :readonly="readonly" @keyup="calculate"/>
            </span>
            <span>
              <span class="isPrint" v-if="isPrint">{{ form.industrial_accident_compensation.accumulated_amount }}</span>
              <ml-input v-else class="w-full" v-model="form.industrial_accident_compensation.accumulated_amount" :readonly="true"/>
            </span>
            <span>
              <span class="isPrint" v-if="isPrint">{{ form.industrial_accident_compensation.run_rate }}</span>
              <ml-input v-else class="w-full" v-model="form.industrial_accident_compensation.run_rate" :readonly="true"/>
            </span>
          </li>

          <!-- 안전보건경영시스템 -->
          <li class="grid-row">
            <span class="header-bg">안전보건경영시스템</span>
            <span>
              <span class="isPrint" v-if="isPrint">{{ form.safety_and_health_management_system.amount }}</span>
              <ml-input v-else class="w-full" v-model="form.safety_and_health_management_system.amount" :readonly="readonly" @keyup="calculate"/>
            </span>
            <span>
              <span class="isPrint" v-if="isPrint">{{ form.safety_and_health_management_system.amount_used }}</span>
              <ml-input v-else class="w-full" v-model="form.safety_and_health_management_system.amount_used" :readonly="readonly" @keyup="calculate"/>
            </span>
            <span>
              <span class="isPrint" v-if="isPrint">{{ form.safety_and_health_management_system.accumulated_amount }}</span>
              <ml-input v-else class="w-full" v-model="form.safety_and_health_management_system.accumulated_amount" :readonly="true"/>
            </span>
            <span>
              <span class="isPrint" v-if="isPrint">{{ form.safety_and_health_management_system.run_rate }}</span>
              <ml-input v-else class="w-full" v-model="form.safety_and_health_management_system.run_rate" :readonly="true"/>
            </span>
          </li>

          <!-- 보건관리 -->
          <li class="grid-row">
            <span class="header-bg">보건관리<br>(보건용품, 특수검진, 접종 등)</span>
            <span>
              <span class="isPrint" v-if="isPrint">{{ form.health_care.amount }}</span>
              <ml-input v-else class="w-full" v-model="form.health_care.amount" :readonly="readonly" @keyup="calculate"/>
            </span>
            <span>
              <span class="isPrint" v-if="isPrint">{{ form.health_care.amount_used }}</span>
              <ml-input v-else class="w-full" v-model="form.health_care.amount_used" :readonly="readonly" @keyup="calculate"/>
            </span>
            <span>
              <span class="isPrint" v-if="isPrint">{{ form.health_care.accumulated_amount }}</span>
              <ml-input v-else class="w-full" v-model="form.health_care.accumulated_amount" :readonly="true"/>
            </span>
            <span>
              <span class="isPrint" v-if="isPrint">{{ form.health_care.run_rate }}</span>
              <ml-input v-else class="w-full" v-model="form.health_care.run_rate" :readonly="true"/>
            </span>
          </li>

          <!-- 안전보건통합관리시스템 -->
          <li class="grid-row">
            <span class="header-bg">안전보건통합관리시스템</span>
            <span>
              <span class="isPrint" v-if="isPrint">{{ form.safety_and_health_integrated_management_system.amount }}</span>
              <ml-input v-else class="w-full" v-model="form.safety_and_health_integrated_management_system.amount" :readonly="readonly" @keyup="calculate"/>
            </span>
            <span>
              <span class="isPrint" v-if="isPrint">{{ form.safety_and_health_integrated_management_system.amount_used }}</span>
              <ml-input v-else class="w-full" v-model="form.safety_and_health_integrated_management_system.amount_used" :readonly="readonly" @keyup="calculate"/>
            </span>
            <span>
              <span class="isPrint" v-if="isPrint">{{ form.safety_and_health_integrated_management_system.accumulated_amount }}</span>
              <ml-input v-else class="w-full" v-model="form.safety_and_health_integrated_management_system.accumulated_amount" :readonly="true"/>
            </span>
            <span>
              <span class="isPrint" v-if="isPrint">{{ form.safety_and_health_integrated_management_system.run_rate }}</span>
              <ml-input v-else class="w-full" v-model="form.safety_and_health_integrated_management_system.run_rate" :readonly="true"/>
            </span>
          </li>

          <!-- 근골격계 예방시설 구축/유지 -->
          <li class="grid-row">
            <span class="header-bg">근골격계 예방시설 구축/유지</span>
            <span>
              <span class="isPrint" v-if="isPrint">{{ form.installation_and_maintenance_of_musculoskeletal_prevention_facilities.amount }}</span>
              <ml-input v-else class="w-full" v-model="form.installation_and_maintenance_of_musculoskeletal_prevention_facilities.amount" :readonly="readonly" @keyup="calculate"/>
            </span>
            <span>
              <span class="isPrint" v-if="isPrint">{{ form.installation_and_maintenance_of_musculoskeletal_prevention_facilities.amount_used }}</span>
              <ml-input v-else class="w-full" v-model="form.installation_and_maintenance_of_musculoskeletal_prevention_facilities.amount_used" :readonly="readonly" @keyup="calculate"/>
            </span>
            <span>
              <span class="isPrint" v-if="isPrint">{{ form.installation_and_maintenance_of_musculoskeletal_prevention_facilities.accumulated_amount }}</span>
              <ml-input v-else class="w-full" v-model="form.installation_and_maintenance_of_musculoskeletal_prevention_facilities.accumulated_amount" :readonly="true"/>
            </span>
            <span>
              <span class="isPrint" v-if="isPrint">{{ form.installation_and_maintenance_of_musculoskeletal_prevention_facilities.run_rate }}</span>
              <ml-input v-else class="w-full" v-model="form.installation_and_maintenance_of_musculoskeletal_prevention_facilities.run_rate" :readonly="true"/>
            </span>
          </li>

          <!-- 근골격계용역 -->
          <li class="grid-row">
            <span class="header-bg">근골격계용역</span>
            <span>
              <span class="isPrint" v-if="isPrint">{{ form.musculoskeletal_service.amount }}</span>
              <ml-input v-else class="w-full" v-model="form.musculoskeletal_service.amount" :readonly="readonly" @keyup="calculate"/>
            </span>
            <span>
              <span class="isPrint" v-if="isPrint">{{ form.musculoskeletal_service.amount_used }}</span>
              <ml-input v-else class="w-full" v-model="form.musculoskeletal_service.amount_used" :readonly="readonly" @keyup="calculate"/>
            </span>
            <span>
              <span class="isPrint" v-if="isPrint">{{ form.musculoskeletal_service.accumulated_amount }}</span>
              <ml-input v-else class="w-full" v-model="form.musculoskeletal_service.accumulated_amount" :readonly="true"/>
            </span>
            <span>
              <span class="isPrint" v-if="isPrint">{{ form.musculoskeletal_service.run_rate }}</span>
              <ml-input v-else class="w-full" v-model="form.musculoskeletal_service.run_rate" :readonly="true"/>
            </span>
          </li>

          <!-- EAP운영 -->
          <li class="grid-row">
            <span class="header-bg">EAP운영</span>
            <span>
              <span class="isPrint" v-if="isPrint">{{ form.eap_operation.amount }}</span>
              <ml-input v-else class="w-full" v-model="form.eap_operation.amount" :readonly="readonly" @keyup="calculate"/>
            </span>
            <span>
              <span class="isPrint" v-if="isPrint">{{ form.eap_operation.amount_used }}</span>
              <ml-input v-else class="w-full" v-model="form.eap_operation.amount_used" :readonly="readonly" @keyup="calculate"/>
            </span>
            <span>
              <span class="isPrint" v-if="isPrint">{{ form.eap_operation.accumulated_amount }}</span>
              <ml-input v-else class="w-full" v-model="form.eap_operation.accumulated_amount" :readonly="true"/>
            </span>
            <span>
              <span class="isPrint" v-if="isPrint">{{ form.eap_operation.run_rate }}</span>
              <ml-input v-else class="w-full" v-model="form.eap_operation.run_rate" :readonly="true"/>
            </span>
          </li>

          <!-- 누계 -->
          <li class="grid-row">
            <span class="header-bg">누계</span>
            <span>
              <span class="isPrint" v-if="isPrint">{{ form.accumulate.amount }}</span>
              <ml-input v-else class="w-full" v-model="form.accumulate.amount" :readonly="true" @keyup="calculate"/>
            </span>
            <span>
              <span class="isPrint" v-if="isPrint">{{ form.accumulate.amount_used }}</span>
              <ml-input v-else class="w-full" v-model="form.accumulate.amount_used" :readonly="true" @keyup="calculate"/>
            </span>
            <span>
              <span class="isPrint" v-if="isPrint">{{ form.accumulate.accumulated_amount }}</span>
              <ml-input v-else class="w-full" v-model="form.accumulate.accumulated_amount" :readonly="true"/>
            </span>
            <span>
              <span class="isPrint" v-if="isPrint">{{ form.accumulate.run_rate }}</span>
              <ml-input v-else class="w-full" v-model="form.accumulate.run_rate" :readonly="true"/>
            </span>
          </li>
        </ul>
      </vs-col>
    </vs-row>
  </div>
</template>

<script>
export default {
  name: 'ReportHealthAndSafetyManagementCost',
  props: {
    isPrint: Boolean,
    readonly: Boolean,
    value: Object,
    fixed: Object
  },
  watch: {
    value (value) {
      this.form = value
    },
    fixed: {
      deep: true,
      handler(value) {
        this.calculate()
      },
    },
    form: {
      handler (newValue) {

        const rowNames = [
          'safety_and_health_labor_cost', 'safety_and_health_education', 'risk_assessment', 'industrial_accident_compensation',
          'safety_and_health_management_system', 'health_care', 'safety_and_health_integrated_management_system', 'installation_and_maintenance_of_musculoskeletal_prevention_facilities',
          'musculoskeletal_service', 'eap_operation', 'accumulate'
        ]

        rowNames.map(rowName => {
          const amount = this.form[rowName]['amount'] ? this.comma(this.form[rowName]['amount']) : ''
          const amount_used = this.form[rowName]['amount_used'] ? this.comma(this.form[rowName]['amount_used']) : ''
          const accumulated_amount = this.form[rowName]['accumulated_amount'] ? this.comma(this.form[rowName]['accumulated_amount']) : 0

          this.$nextTick(() => {
            this.form[rowName]['amount'] = amount
            this.form[rowName]['amount_used'] = amount_used
            this.form[rowName]['accumulated_amount'] = accumulated_amount
          })
        })
      },
      deep: true
    }
  },
  data () {
    return {
      // accumulated_amount: 1월 ~ 작성전월 까지 amount 의 합
      // run_rate: (amount_used / amount) * 100 (소수점 2번째 자리까지)
      // form: {
      //   safety_and_health_labor_cost: {amount:'', amount_used:'', accumulated_amount:'', run_rate:''},
      //   safety_and_health_education: {amount:'', amount_used:'', accumulated_amount:'', run_rate:''},
      //   risk_assessment: {amount:'', amount_used:'', accumulated_amount:'', run_rate:''},
      //   industrial_accident_compensation: {amount:'', amount_used:'', accumulated_amount:'', run_rate:''},
      //   safety_and_health_management_system: {amount:'', amount_used:'', accumulated_amount:'', run_rate:''},
      //   health_care: {amount:'', amount_used:'', accumulated_amount:'', run_rate:''},
      //   safety_and_health_integrated_management_system: {amount:'', amount_used:'', accumulated_amount:'', run_rate:''},
      //   installation_and_maintenance_of_musculoskeletal_prevention_facilities: {amount:'', amount_used:'', accumulated_amount:'', run_rate:''},
      //   musculoskeletal_service: {amount:'', amount_used:'', accumulated_amount:'', run_rate:''},
      //   eap_operation: {amount:'', amount_used:'', accumulated_amount:'', run_rate:''},
      //   accumulate: {amount:'', amount_used:'', accumulated_amount:'', run_rate:''}
      // }
      form: this.value
    }
  },
  created () {
    this.calculate()

    if (!this.form.summary) {
      this.form.summary = {
        reportHealthAndSafetyManagementCost:[]
      }
    }
  },
  methods: {

    onKeyUp () {

    },
    calculate () {

      const list = []

      if (this.form.safety_and_health_labor_cost.amount_used) list.push({"안전보건인건비": this.removeComma(this.form.safety_and_health_labor_cost.amount_used)})
      if (this.form.safety_and_health_education.amount_used) list.push({"안전보건교육": this.removeComma(this.form.safety_and_health_education.amount_used)})
      if (this.form.risk_assessment.amount_used) list.push({"위험성평가": this.removeComma(this.form.risk_assessment.amount_used)})
      if (this.form.industrial_accident_compensation.amount_used) list.push({"업무상재해보상": this.removeComma(this.form.industrial_accident_compensation.amount_used)})
      if (this.form.safety_and_health_management_system.amount_used) list.push({"안전보건경영시스템": this.removeComma(this.form.safety_and_health_management_system.amount_used)})
      if (this.form.health_care.amount_used) list.push({"보건관리": this.removeComma(this.form.health_care.amount_used)})
      if (this.form.safety_and_health_integrated_management_system.amount_used) list.push({"안전보건통합관리시스템": this.removeComma(this.form.safety_and_health_integrated_management_system.amount_used)})
      if (this.form.installation_and_maintenance_of_musculoskeletal_prevention_facilities.amount_used) list.push({"근골격계 예방시설 구축/유지": this.removeComma(this.form.installation_and_maintenance_of_musculoskeletal_prevention_facilities.amount_used)})
      if (this.form.musculoskeletal_service.amount_used) list.push({"근골격계용역": this.removeComma(this.form.musculoskeletal_service.amount_used)})
      if (this.form.eap_operation.amount_used) list.push({"EAP운영": this.removeComma(this.form.eap_operation.amount_used)})

      if (!this.form.summary) {
        this.form.summary = {
          reportHealthAndSafetyManagementCost:[]
        }
      }
      this.form.summary.reportHealthAndSafetyManagementCost = list


      // 전월까지 데이터가 필요한데...
      const rowNames = [
        'safety_and_health_labor_cost', 'safety_and_health_education', 'risk_assessment', 'industrial_accident_compensation',
        'safety_and_health_management_system', 'health_care', 'safety_and_health_integrated_management_system', 'installation_and_maintenance_of_musculoskeletal_prevention_facilities',
        'musculoskeletal_service', 'eap_operation'
      ]

      let total_amount = 0
      let total_amount_used = 0
      let total_accumulated_amount = 0
      let total_run_rate = 0


      for (const rowName of rowNames) {
        const amount = this.form[rowName]['amount'] ? this.removeComma(this.form[rowName]['amount']) : 0
        const amount_used = this.form[rowName]['amount_used'] ? this.removeComma(this.form[rowName]['amount_used']) : 0
        let accumulated_amount = this.fixed[rowName]['accumulated_amount'] ? this.removeComma(this.fixed[rowName]['accumulated_amount']) : 0
        let run_rate = this.form[rowName]['run_rate'] ? this.removeComma(this.form[rowName]['run_rate']) : 0

        accumulated_amount = Number(accumulated_amount) + Number(amount_used) // + 1월부터 전월까지 amount_used의 합
        if (amount > 0) {
          run_rate = Math.floor(amount_used * 10000.0 / amount) / 100
        }

        this.form[rowName]['accumulated_amount'] = accumulated_amount
        this.form[rowName]['run_rate'] = run_rate

        total_amount = Number(`${total_amount}`) + Number(`${amount}`)
        total_amount_used = Number(`${total_amount_used}`) + Number(`${amount_used}`)
        total_accumulated_amount = Number(`${total_accumulated_amount}`) + Number(accumulated_amount)
      }

      if (total_amount > 0) {
        total_run_rate = Math.floor(total_amount_used * 10000.0 / total_amount) / 100
      }
      this.form['accumulate']['amount'] = total_amount
      this.form['accumulate']['amount_used'] = total_amount_used
      this.form['accumulate']['accumulated_amount'] = total_accumulated_amount
      this.form['accumulate']['run_rate'] = total_run_rate

      this.$emit('change', this.form)
    },

    number (val) {
      const reg = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-z]/

      // 한글, 영문 체크
      if (reg.exec(val) !== null) val = val.replace(/[^0-9]/g, '')

      // .... 만 입력하게 될 경우 체크
      if (isNaN(parseFloat(val))) val = ''

      return val
    },

    comma (str) {
      const comma = `${str}`.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      return comma
    },

    removeComma (str) {
      const noneComma = `${str}`.replaceAll(',', '')
      return noneComma
    }

  }
}
</script>

<style lang="scss" scoped>
.header-bg {
  background-color: #F9F9F9
}

.grid-row {
  span {
    border-right: 1px solid #CDCDCD;

    &:last-child {
      border-right: none;
    }
  }

  .isPrint {
    width: 100%;
    overflow-wrap: break-word;
  }
}

[dir] ul.table > li:last-child {
  border-bottom: none !important;
}
</style>
