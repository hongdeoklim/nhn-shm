<template>
  <li v-if="isPrint" class="tbody" style="display: block;">
    <div style="display:grid; grid-template-columns: repeat(7, minmax(0, 1fr)); height: 80px; align-items: center;">
      <span>{{ getType(form.type) }}</span>
      <span>{{form.name}}</span>
      <span>{{form.control_num}}</span>
      <span>{{form.model_name}}</span>
      <span>{{form.manufacturer}}</span>
      <span>{{form.inspection_day}}</span>
      <span>{{form.check_day}}</span>
    </div>
    <div>
      <vs-row class="w-full pl-8 pr-8 pt-0 pb-0">
        <vs-row class="w-full border-top flex pt-4 pb-4" style="background-color: #f9f9f9;" vs-align="center">
          <vs-col class="w-2/12 title" style="text-align: center">구분</vs-col>
          <vs-col class="w-10/12 title">
            <vs-row>
              <vs-col class="w-4/12 title" style="text-align: center">안전조치 및 확인사항</vs-col>
              <vs-col class="w-4/12 title" style="text-align: center">점검결과</vs-col>
              <vs-col class="w-4/12 title" style="text-align: center">조치사항</vs-col>
            </vs-row>
          </vs-col>
        </vs-row>
      </vs-row>

      <vs-row class="w-full pl-8 pr-8 pt-0 pb-0" vs-align="center">
        <vs-row class="w-full border-top pt-2 pb-2" vs-align="center">
          <vs-col class="w-2/12 title" style="text-align: center">작업계획서</vs-col>
          <vs-col class="w-10/12 title">
            <vs-row v-for="(data, wi) in form.after.workPlan" :key="wi">
              <vs-col class="w-4/12 px-1"><span>{{data.check_list}}</span></vs-col>
              <vs-col class="w-4/12 px-1"><span>{{data.check_result}}</span></vs-col>
              <vs-col class="w-4/12 px-1"><span>{{data.action}}</span></vs-col>
            </vs-row>
          </vs-col>
        </vs-row>
      </vs-row>

      <vs-row class="w-full pl-8 pr-8 pt-0 pb-0" vs-align="center">
        <vs-row class="w-full border-top pt-2 pb-2" vs-align="center">
          <vs-col class="w-2/12 title" style="text-align: center">운전자격<br/>적정여부</vs-col>
          <vs-col class="w-10/12 title">
            <vs-row v-for="(data, di) in form.after.driver" :key="di">
              <vs-col class="w-4/12 px-1"><span>{{data.check_list}}</span></vs-col>
              <vs-col class="w-4/12 px-1"><span>{{data.check_result}}</span></vs-col>
              <vs-col class="w-4/12 px-1"><span>{{data.action}}</span></vs-col>
            </vs-row>
          </vs-col>
        </vs-row>
      </vs-row>

      <vs-row class="w-full pl-8 pr-8 pt-0 pb-0" vs-align="center">
        <vs-row class="w-full border-top border-bottom pt-2 pb-2" vs-align="center">
          <vs-col class="w-2/12 title" style="text-align: center">안전장치설치<br/>및 사용상태</vs-col>
          <vs-col class="w-10/12 title">
            <vs-row v-for="(data, si) in form.after.safetyDevice" :key="si">
              <vs-col class="w-4/12 px-1"><span>{{data.check_list}}</span></vs-col>
              <vs-col class="w-4/12 px-1"><span>{{data.check_result}}</span></vs-col>
              <vs-col class="w-4/12 px-1"><span>{{data.action}}</span></vs-col>
            </vs-row>
          </vs-col>
        </vs-row>
      </vs-row>
    </div>
  </li>
  <li v-else class="tbody" @click="()=>{handlePlanSelected(value)}">
    <span v-if="!readonly"><vs-checkbox v-model="form.is_checked" @change="handleChangeChecked" :readonly="readonly"> </vs-checkbox></span>
    <span>
      <ml-input class="mb-0" v-model="form.type" @change="changeText" :readonly="readonly"/>
    </span>
    <span><ml-textarea class="mb-0" row="5" v-model="form.name" @change="changeText" :readonly="readonly"/></span>
    <span><ml-textarea class="mb-0" row="5" v-model="form.control_num" @change="changeText" :readonly="readonly"/></span>
    <span><ml-textarea class="mb-0" row="5" v-model="form.model_name" @change="changeText" :readonly="readonly"/></span>
    <span><ml-textarea class="mb-0" row="5" v-model="form.manufacturer" @change="changeText" :readonly="readonly"/></span>
    <span style="display: grid;">
      <date-selector class="w-full mt-2 mb-0" v-model="form.inspection_date" :readonly="readonly"/>
      <ml-input class="w-full mb-0" row="5" v-model="form.inspection_com" @change="changeText" :readonly="readonly"/>
    </span>
    <span style="display: grid;">
      <date-selector class="w-full mt-2 mb-0" v-model="form.check_date" :readonly="readonly"/>
      <ml-input class="w-full mb-0" row="5" v-model="form.check_com" @change="changeText" :readonly="readonly"/>
    </span>

  </li>
</template>

<script>
import DateSelector from '@/components/selector/DateSelector'
export default {
  name: 'SafetyEquipmentPlanTableList',
  components: {DateSelector},
  props:{
    value:Object,
    selectIndex:[Number, String],
    readonly:Boolean,
    isPrint:Boolean
  },
  watch:{
    value (data) {
      this.form = data
    }
  },
  data () {
    return {
      form:{
        is_checked:false,
        name:'',
        size:'',
        quantity:'',
        unit_price:'',
        price:'',
        etc:''
      }
    }
  },
  created () {

    this.form = this.value
  },
  methods:{
    handleChangeChecked () {
      this.$emit('handleChangeChecked', this.form)
    },
    changeText () {
      this.$emit('input', this.form)
    },
    changeSelect () {
      this.$emit('input', this.form)
    },
    handlePlanSelected (item) {
      if (this.readonly) {
        this.$emit('handlePlanSelected', this.selectIndex, item)
      }
    },
    getType(value) {
      if(value === 'type_a') return '굴삭기A';
      if(value === 'type_b') return '굴삭기B';
      if(value === 'type_c') return '굴삭기C';
    }
  }
}
</script>

<style scoped>

</style>
