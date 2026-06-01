<template>
  <vs-select v-model="data" autocomplete :disabled="disabled">
    <vs-select-item value="골절" text="골절"/>
    <vs-select-item value="파열" text="파열"/>
    <vs-select-item value="염좌" text="염좌"/>
    <vs-select-item value="열상" text="열상"/>
    <vs-select-item value="타박상" text="타박상"/>
    <vs-select-item value="교상" text="교상"/>
    <vs-select-item value="감염" text="감염"/>
    <vs-select-item value="뇌진탕" text="뇌진탕"/>
    <vs-select-item value="동상" text="동상"/>
    <vs-select-item value="화상" text="화상"/>
    <vs-select-item value="디스크" text="디스크"/>
    <vs-select-item value="자상" text="자상"/>
    <vs-select-item value="외상 후 스트레스" text="외상 후 스트레스"/>
    <vs-select-item value="절단" text="절단"/>
    <vs-select-item value="심장마비" text="심장마비"/>
    <vs-select-item value="사망" text="사망"/>
  </vs-select>
</template>

<script>
export default {
  name: 'ShanghaiClassSelector',
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
      this.data = '골절'
      this.$emit('input', this.data)
    }
  }
}
</script>

<style scoped>

</style>
