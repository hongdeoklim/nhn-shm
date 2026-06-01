<template>
  <vs-select autocomplete v-model="select" :disabled="readonly" @change="handleChange">
    <vs-select-item  v-for="(data, index) in list" :key="index" :text="data.text" :value="data.value"/>
  </vs-select>
</template>

<script>
export default {
  name: 'WorkTypeASelector',
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
        { text: '잠수작업', value: '잠수작업' },
        { text: '인공어초 제작 및 시설 작업', value: '인공어초 제작 및 시설 작업' },
        { text: '자연석 시설 작업', value: '자연석 시설 작업' },
        { text: '갯벌작업', value: '갯벌작업' },
        { text: '선박작업(해상작업)', value: '선박작업(해상작업)' },
        { text: '분석작업', value: '분석작업' },
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
      this.select = '잠수작업'
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
