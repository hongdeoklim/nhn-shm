<template>
  <vs-select v-model="data" autocomplete :disabled="disabled || readonly">
    <vs-select-item value="조치 전" text="조치 전"/>
    <vs-select-item value="조치 중" text="조치 중"/>
    <vs-select-item value="조치 완료" text="조치 완료"/>
    <vs-select-item value="기타" text="기타"/>
  </vs-select>
</template>

<script>
export default {
  name: 'MeasureStateSelector',
  props: {
    value: String,
    disabled: Boolean,
    readonly: Boolean,
  },
  data () {
    return {
      data: this.value
    }
  },
  watch: {
    value () {
      this.data = this.value
    },
    data (/*value*/) {
      this.$emit('input', this.data)
    }
  },
  mounted () {
    if (!this.value) {
      this.data = '조치 전'
      this.$emit('input', this.data)
    }
  }
}
</script>

<style scoped>

</style>
