<template>
<li class="tbody">
  <!--
                  <span class="title">단위공정</span>
                  <span class="title">위험요인</span>
                  <span class="title">재해형태</span>
                  <span class="title">안전보건대책</span>
                  <span class="title">담당자</span>
                  <span class="title">위험등급</span>
  -->
  <span class="p-4"><vs-checkbox v-model="form.is_checked" @change="handleChangeChecked" :disabled="readonly"> </vs-checkbox></span>
  <span class="p-4"><ml-textarea class="m-0" v-model="form.work_unit" @change="changeText" :readonly="readonly"/></span>
  <span class="p-4"><ml-textarea class="m-0" v-model="form.risk_factor" @change="changeText" :readonly="readonly"/></span>
  <span class="p-4" style="display:flex; align-items: flex-start;">
    <disaster-type-selector class="w-full" v-model="form.disaster_type" @change="changeSelect" :readonly="readonly"/>
  </span>
  <span class="p-4" ><ml-textarea class="m-0" v-model="form.safety_measures" @change="changeText" :readonly="readonly"/></span>
  <span v-if="oneHead" class="p-4" style="display:flex; align-items: flex-start;">
    <auto-completion-text-field class="m-0" v-model="form.head" :list="memberAll" :readonly="readonly"></auto-completion-text-field>
  </span>
  <span v-else class="p-4" style="display:grid; align-items: flex-start;">
    <auto-completion-text-field class="w-full" v-model="form.person_in_charge" :list="memberAll" :readonly="readonly" label="정"></auto-completion-text-field>
    <auto-completion-text-field class="w-full m-0" v-model="form.deputy_head" :list="memberAll" :readonly="readonly" label="부"></auto-completion-text-field>
  </span>
  <span class="p-4" style="display:flex; align-items: flex-start;"><warning-lv-selector class="w-full" v-model="form.warningLv" @change="changeSelect" :readonly="readonly" :option="warningLvList"/></span>
</li>
</template>

<script>
import WarningLvSelector from '@/components/selector/WarningLvSelector'
import DisasterTypeSelector from '@/components/DisasterTypeSelector'
import MemberSelector from '@/components/selector/MemberSelector'
import AutoCompletionTextField from '@/components/AutoCompletionTextField'
export default {
  name: 'RiskAssessmentEvalTableList',
  components: {
    AutoCompletionTextField,
    MemberSelector,
    DisasterTypeSelector,
    WarningLvSelector},
  props:{
    value:Object,
    readonly:Boolean,
    useManager:Boolean,
    oneHead:Boolean,
    warningLvList: {
      type: Array,
      default: () => [
        {text:'A', value:'A'},
        {text:'B', value:'B'},
        {text:'C', value:'C'}
      ]
    }
  },
  watch:{
    value (data) {
      this.form = data
    }
  },
  computed: {
    memberAll () {
      const memberAll = []
      for (const member of this.$store.state.project.projectUserList) {
        memberAll.push({text:member.name, value:member.id})
      }
      return memberAll
    }
  },
  data () {
    return {
      form:{
        is_checked:false,
        work_unit:'', // 단위공정
        risk_factor:'', // 위험요인
        disaster_type:'', // 재해형태
        safety_measures:'', // 안전보건대책
        person_in_charge:'', // 담당자:정
        deputy_head:'', // 담당자:부
        head: '' // 담당자
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
    }
  }
}
</script>

<style >
[dir] ul.table li textarea {
  height: 108px;
  resize: none;
}
</style>
