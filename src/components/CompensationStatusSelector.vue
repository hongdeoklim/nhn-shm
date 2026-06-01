<template>
  <vs-select v-model="data" autocomplete :disabled="disabled">
    <vs-select-item value="산업재해" text="산업재해"/>
    <vs-select-item value="업무상재해" text="업무상재해"/>
  </vs-select>
</template>

<script>
export default {
  name: 'CompensationStatusSelector',
  props: {
    value: String,
    disabled:Boolean,
  },
  data () {
    return {
      data: this.value
    }
  },
  watch: {
    data () {
      if (this.data !== this.value) {
        this.$emit('input', this.data)
      }
    }
  },
  mounted () {
    if (!this.value) {
      this.data = '산업재해'
      this.$emit('input', this.data)
    }
  }
}
</script>

<style scoped>

</style>
