<template>
<li class="tbody" :style="isPrint ? {gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr'} : {}">
  <!-- checkbox -->
  <span v-if="!isPrint" class="p-4" style="align-items: start">
    <vs-checkbox v-model="form.is_checked" class="w-full" @change="handleChangeChecked" :disabled="readonly"></vs-checkbox>
  </span>

  <!-- 평가구분 -->
  <span class="p-4" style="align-items: start">
    <span v-if="isPrint">{{ getEvalClass(form.eval_class) }}</span>
    <rating-classification-selector v-else @change="changeText" v-model="form.eval_class" :readonly="readonly"/>
  </span>

  <!-- 유해·위험요인 -->
  <span class="p-4" style="align-items: start">
    <span v-if="isPrint">{{ form.factors }}</span>
    <ml-textarea v-else class="m-0" v-model="form.factors" @change="changeText" :readonly="readonly"/>
  </span>

  <!-- 재해형태 -->
  <span class="p-4" style="align-items: start">
    <span v-if="isPrint">{{ getDisaster(form.disaster) }}</span>
    <disaster-type-selector v-else class="w-full" v-model="form.disaster" @change="changeSelect" :readonly="readonly"/>
  </span>

  <!-- 관련법근거 -->
  <span class="p-4" style="align-items: start">
    <span v-if="isPrint">{{ form.related_law }}</span>
    <ml-textarea v-else class="m-0" v-model="form.related_law" @change="changeText" :readonly="readonly"/>
  </span>

  <!-- 현재 안전보건조치 -->
  <span class="p-4" style="align-items: start">
    <span v-if="isPrint">{{ form.current_action }}</span>
    <ml-textarea v-else class="m-0" v-model="form.current_action" @change="changeText" :readonly="readonly"/>
  </span>

  <!-- 빈도 -->
  <span class="p-4" style="align-items: start">
    <span v-if="isPrint">{{ form.frequency }}</span>
    <number-selector v-else class="w-full" :last="5" v-model="form.frequency" @change="changeSelect" :readonly="readonly"/>
  </span>

  <!-- 강도 -->
  <span class="p-4" style="align-items: start">
    <span v-if="isPrint">{{ form.power }}</span>
    <number-selector v-else class="w-full" :last="4" v-model="form.power" @change="changeSelect" :readonly="readonly"/>
  </span>

  <!-- 위험등급 -->
  <span class="p-4" style="align-items: start">

    <span v-if="isPrint">{{ form.warningLv }}</span>
    <ml-input v-else class="w-full" v-model="form.warningLv" :readonly="true"/>
  </span>

  <!-- No -->
  <span class="p-4" style="align-items: start">
    <span v-if="isPrint">{{ form.no }}</span>
    <ml-input v-else class="w-full" v-model="form.no" :readonly="readonly"/>
  </span>

  <!-- 위험감소대책 -->
  <span class="p-4" style="align-items: start">
    <span v-if="isPrint">{{ form.measures }}</span>
    <ml-textarea v-else class="w-full" v-model="form.measures" :readonly="readonly"/>
  </span>

</li>
</template>

<script>
import WarningLvSelector from '@/components/selector/WarningLvSelector'
import DisasterTypeSelector from '@/components/DisasterTypeSelector'
import MemberSelector from '@/components/selector/MemberSelector'
import AutoCompletionTextField from '@/components/AutoCompletionTextField'
import RatingClassificationSelector from '@/components/RatingClassificationSelector'
import NumberSelector from '@/components/selector/NumberSelector'
export default {
  name: 'RiskAssessmentEvalTableList2',
  components: {
    NumberSelector,
    RatingClassificationSelector,
    AutoCompletionTextField,
    MemberSelector,
    DisasterTypeSelector,
    WarningLvSelector},
  props:{
    value:Object,
    readonly:Boolean,
    useManager:Boolean,
    oneHead:Boolean,
    isPrint:Boolean,
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
        eval_class: '', //평가구분
        frequency: 1, //빈도
        power: 1, // 강도
        warningLv: 1, // 위험등급
        no: '',
        measures: '', // 평가구분
        factors: '', // 위험요인
        disaster: '', // 재해형태
        related_law: '', //관련법
        current_action: '' //현재 안전보건조치
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

      const lv = this.form.frequency * this.form.power
      // if (lv >= 6) {
      //   this.form.warningLv = 'A'
      // } else if (lv >= 3) {
      //   this.form.warningLv = 'B'
      // } else {
      //   this.form.warningLv = 'C'
      // }
      this.form.warningLv = lv
      this.$emit('input', this.form)
    },

    getEvalClass (value) {
      if (value === 'mechanical') return '기계적 요인'
      if (value === 'electrical') return '전기적 요인'
      if (value === 'chemical') return '화학 물질적'
      if (value === 'work_characteristics') return '작업 특성적 요인'
      if (value === 'work_environment') return '작업 환경적 요인'
    },

    getDisaster (value) {
      value = value ? parseInt(value) : 0 ;
      if (value === 1) return '감염'
      if (value === 2) return '감전'
      if (value === 3) return '교통사고'
      if (value === 4) return '깔림'
      if (value === 5) return '끼임'
      if (value === 6) return '낙하'
      if (value === 7) return '넘어짐'
      if (value === 8) return '뒤집힘'
      if (value === 9) return '떨어짐'
      if (value === 10) return '맞음'
      if (value === 11) return '무너짐'
      if (value === 12) return '근골격계질환'
      if (value === 14) return '베임'
      if (value === 15) return '붕괴'
      if (value === 16) return '빠짐'
      if (value === 17) return '(산소)결핍'
      if (value === 18) return '소음노출'
      if (value === 19) return '아차사고'
      if (value === 20) return '이상기압 노출, 접촉'
      if (value === 21) return '익사'
      if (value === 22) return '유해광선 노출'
      if (value === 23) return '절단'
      if (value === 24) return '중독'
      if (value === 25) return '질식'
      if (value === 26) return '질환'
      if (value === 27) return '찔림'
      if (value === 28) return '충돌'
      if (value === 29) return '탈락'
      if (value === 30) return '파열'
      if (value === 31) return '폭발'
      if (value === 32) return '화재'
      if (value === 33) return '화학물질 누출 접촉'
      if (value === 34) return '기타'
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
