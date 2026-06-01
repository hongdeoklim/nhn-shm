<template>
  <vs-select autocomplete v-model="select" :disabled="readonly" @change="handleChange">
    <vs-select-item  v-for="(data, index) in disasterList" :key="index" :text="data.text" :value="data.value"/>
  </vs-select>
</template>

<script>
export default {
  name: 'DisasterTypeSelector',
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
    disasterList () {
      const list = this.$store.state.approval.disasterTypeList
      const returnList = []
      for (const item of list) {
        returnList.push({
          text:item.name,
          value:item.id
        })
      }
      return returnList
    }
  },
  data () {
    return {
      select:''
    }
  },

  created () {
    this.select = this.value

    this.$store.dispatch('approval/LOAD_DISASTER_TYPE_LIST', {})
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
