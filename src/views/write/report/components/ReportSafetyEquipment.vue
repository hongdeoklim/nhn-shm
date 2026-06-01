<template>
  <div>
    <vs-row class="my-4">
      <vs-col><h5><i class="dot"></i>안전장비</h5></vs-col>
    </vs-row>
    <vs-row class="mb-8"
            style="border:1px solid #cdcdcd; display: grid; grid-template-columns: auto 1fr;">
      <vs-col class="p-4 font-bold flex border-right header-bg" style="width:125px;" vs-justify="center" vs-align="center">
        안전장비
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
          <li class="grid-row">
            <span class="header-bg">안전보건인건비</span>
            <span>
              <span class="isPrint" v-if="isPrint">{{ form.safety_and_health_labor_cost.amount }}</span>
              <ml-input v-else class="w-full" v-model="form.safety_and_health_labor_cost.amount" :readonly="readonly" @keyup="calculate" />
            </span>
            <span>
              <span class="isPrint" v-if="isPrint">{{ form.safety_and_health_labor_cost.amount_used }}</span>
              <ml-input v-else class="w-full" v-model="form.safety_and_health_labor_cost.amount_used" :readonly="readonly" @keyup="calculate" />
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
          <li class="grid-row">
            <span class="header-bg">안전보건교육<br>(관리감독자 교육 포함)</span>
            <span>
              <span class="isPrint" v-if="isPrint">{{ form.safety_and_health_education.amount }}</span>
              <ml-input v-else class="w-full" v-model="form.safety_and_health_education.amount" :readonly="readonly" @keyup="calculate" />
            </span>
            <span>
              <span class="isPrint" v-if="isPrint">{{ form.safety_and_health_education.amount_used }}</span>
              <ml-input v-else class="w-full" v-model="form.safety_and_health_education.amount_used" :readonly="readonly" @keyup="calculate" />
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
          <li class="grid-row">
            <span class="header-bg">누계</span>
            <span>
              <span class="isPrint" v-if="isPrint">{{ form.accumulate.amount }}</span>
              <ml-input v-else class="w-full" v-model="form.accumulate.amount" :readonly="true"/>
            </span>
            <span>
              <span class="isPrint" v-if="isPrint">{{ form.accumulate.amount_used }}</span>
              <ml-input v-else class="w-full" v-model="form.accumulate.amount_used" :readonly="true"/>
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
  name: 'ReportSafetyEquipment',
  props: {
    isPrint: Boolean,
    readonly:Boolean,
    value:Object,
    fixed:Object
  },
  watch: {
    value (value) {
      this.form = value
    },
    fixed: {
      deep: true,
      handler (value) {
        this.calculate()
      }
    },
    form: {
      handler (newValue) {
        const rowNames = ['safety_and_health_labor_cost', 'safety_and_health_education', 'accumulate']

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
  created () {
    this.calculate()

    if (!this.form.summary) {
      this.form.summary = {
        reportSafetyEquipment:[]
      }
    }
  },
  data () {
    return {
      // accumulated_amount: 1월 ~ 작성전월 까지 amount 의 합
      // run_rate: (amount_used / amount) * 100 (소수점 2번째 자리까지)
      // form: {
      //   safety_and_health_labor_cost: {amount:'', amount_used:'', accumulated_amount:'', run_rate:''},
      //   safety_and_health_education: {amount:'', amount_used:'', accumulated_amount:'', run_rate:''},
      //   accumulate: {amount:'', amount_used:'', accumulated_amount:'', run_rate:''}
      // }
      form:this.value
    }
  },
  methods: {
    calculate () {

      const list = []
      if (this.form.safety_and_health_labor_cost.amount_used) list.push({'안전보건인건비': this.removeComma(this.form.safety_and_health_labor_cost.amount_used)})
      if (this.form.safety_and_health_education.amount_used) list.push({'안전보건교육(관리감독자 교육 포함)': this.removeComma(this.form.safety_and_health_education.amount_used)})

      if (!this.form.summary) {
        this.form.summary = {
          reportSafetyEquipment:[]
        }
      }
      this.form.summary.reportSafetyEquipment = list


      const rowNames = ['safety_and_health_labor_cost', 'safety_and_health_education']

      let total_amount = 0
      let total_amount_used = 0
      let total_accumulated_amount = 0
      let total_run_rate = 0

      for (const rowName of rowNames) {
        const amount = this.form[rowName]['amount'] ? this.removeComma(this.form[rowName]['amount']) : 0
        const amount_used = this.form[rowName]['amount_used'] ? this.removeComma(this.form[rowName]['amount_used']) : 0
        let accumulated_amount = this.fixed[rowName]['accumulated_amount'] ? this.removeComma(this.fixed[rowName]['accumulated_amount']) : 0
        let run_rate = this.form[rowName]['run_rate'] ? this.removeComma(this.form[rowName]['run_rate']) : 0

        accumulated_amount = Number(accumulated_amount) + Number(amount_used)
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
    &:last-child { border-right:none; }
  }

  .isPrint {
    width: 100%;
    overflow-wrap: break-word;
  }
}
[dir] ul.table > li:last-child{
  border-bottom: none !important;
}
</style>
