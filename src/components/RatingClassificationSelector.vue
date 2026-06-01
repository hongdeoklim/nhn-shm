<template>
  <vs-select autocomplete v-model="select" :disabled="readonly" @change="handleChange">
    <vs-select-item  v-for="(data, index) in list" :key="index" :text="data.text" :value="data.value"/>
  </vs-select>
</template>

<script>
export default {
  name: 'RatingClassificationSelector',
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
      const list = [
        { text:'기계적 요인', value:'mechanical' },
        { text:'전기적 요인', value:'electrical' },
        { text:'화학 물질적 요인', value:'chemical' },
        { text:'작업 특성적 요인', value:'work_characteristics' },
        { text:'작업 환경적 요인', value:'work_environment' }
      ]
      return list
    }
  },
  data () {
    return {
      select:''
    }
  },

  created () {
    this.select = this.value
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
