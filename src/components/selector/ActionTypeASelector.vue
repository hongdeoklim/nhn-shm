<template>
  <vs-select autocomplete v-model="select" :disabled="readonly" @change="handleChange">
    <vs-select-item  v-for="(data, index) in list" :key="index" :text="data.text" :value="data.value"/>
  </vs-select>
</template>

<script>
export default {
  name: 'ActionTypeASelector',
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
        { text: '적합', value: '적합' },
        { text: '중부적합', value: '중부적합' },
        { text: '경부적합', value: '경부적합' },
        { text: '관찰', value: '관찰' },
        { text: '권고', value: '권고' },
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
      this.select = '적합'
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
