<template>
  <vs-select autocomplete v-model="select" :disabled="readonly" @change="handleChange">
    <vs-select-item  v-for="(data, index) in list" :key="index" :text="data.text" :value="data.value"/>
  </vs-select>
</template>

<script>
export default {
  name: 'CheckTypeASelector',
  props:{
    value:String,
    readonly:Boolean
  },
  watch:{
    value (value) {
      this.select = value
    }
  },
  computed:{
    list () {
      return [
        { text: '기계적 요인', value: '기계적 요인' },
        { text: '전기적 요인', value: '전기적 요인' },
        { text: '화학 물질적 요인', value: '화학 물질적 요인' },
        { text: '생물학적 요인', value: '생물학적 요인' },
        { text: '작업특성 요인', value: '작업특성 요인' },
        { text: '작업환경 요인', value: '작업환경 요인' }
      ]
    }
  },
  data () {
    return {
      select: ''
    }
  },

  created () {
    if (this.value) {
      this.select = this.value
    } else {
      this.select = '기계적 요인'
      this.$emit('input', this.select.toString())
    }
  },

  methods:{
    handleChange () {
      this.$emit('input', this.select.toString())
      this.$emit('change', this.select.toString())
    }
  }
}
</script>

<style scoped>

</style>
