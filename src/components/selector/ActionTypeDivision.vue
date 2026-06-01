<template>
  <vs-select autocomplete v-model="select" :disabled="readonly" @change="handleChange">
    <vs-select-item  v-for="(data, index) in list" :key="index" :text="data.text" :value="data.value"/>
  </vs-select>
</template>

<script>
export default {
  name: 'ActionTypeDivision',
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
        { text: '전담', value: '전담' },
        { text: '겸임', value: '겸임' },
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
      this.select = '전담'
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
