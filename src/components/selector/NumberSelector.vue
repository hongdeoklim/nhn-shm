<template>
  <vs-select autocomplete v-model="select" :disabled="readonly" @change="handleChange">
    <vs-select-item  v-for="(data, index) in list" :key="index" :text="data.text" :value="data.value"/>
  </vs-select>
</template>

<script>
export default {
  name: 'NumberSelector',
  props:{
    value:String,
    readonly:Boolean,
    last: Number
  },
  watch:{
    value (value) {
      this.select = value
    }
  },
  computed:{
    list () {
      const list = []
      for (let i = 1; i <= this.last; i++) {
        list.push({ text:`${i}`, value:i })
      }
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
