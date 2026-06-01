<template>
  <vs-select v-model="data" autocomplete :disabled="disabled">
    <vs-select-item value="단속·순찰" text="단속·순찰"/>
    <vs-select-item value="시설관리, 안전관리" text="시설관리, 안전관리"/>
    <vs-select-item value="환경관리" text="환경관리"/>
    <vs-select-item value="자원조사" text="자원조사"/>
    <vs-select-item value="탐방해설" text="탐방해설"/>
    <vs-select-item value="사무" text="사무"/>
    <vs-select-item value="출퇴근" text="출퇴근"/>
    <vs-select-item value="체육활동" text="체육활동"/>
    <vs-select-item value="출장" text="출장"/>
  </vs-select>
</template>

<script>
export default {
  name: 'BusinessClassSelector',
  props: {
    value: String,
    disabled: Boolean,
  },
  data () {
    return {
      data: this.value
    }
  },
  mounted () {
    if (!this.value) {
      this.data = '단속·순찰'
      this.$emit('input', this.data)
    }
  }
}
</script>

<style scoped>

</style>
