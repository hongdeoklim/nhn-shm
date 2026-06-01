<template>
  <vs-select v-model="data" autocomplete :disabled="disabled">
    <vs-select-item value="일반직" text="일반직"/>
    <vs-select-item value="특정직" text="특정직"/>
    <vs-select-item value="운영직" text="운영직"/>
    <vs-select-item value="지원직" text="지원직"/>
    <vs-select-item value="기간제" text="기간제"/>
  </vs-select>
</template>

<script>
export default {
  name: 'OccupationSelector',
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
      this.data = '일반직'
      this.$emit('input', this.data)
    }
  }
}
</script>

<style scoped>

</style>
