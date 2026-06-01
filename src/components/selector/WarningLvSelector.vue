<template>
  <vs-select autocomplete v-model="select" :disabled="readonly" @change="handleChange">
    <vs-select-item  v-for="(data, index) in option" :key="index" :text="data.text" :value="data.value"/>
  </vs-select>
</template>

<script>
export default {
  name: 'WarningLvSelector',
  props:{
    value:String,
    readonly:Boolean,
    option: {
      type: Array,
      default: () => [
        {text:'AE', value:'AE'},
        {text:'A', value:'A'},
        {text:'B', value:'B'},
        {text:'C', value:'C'}
      ]
    }
  },
  watch:{
    value (value) {
      this.select = value
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
