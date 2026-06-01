<template>
  <div>
    <complex-write01
      @save="onClickSave"
      @delete="onClickDelete"
      @moveList="onClickMoveList"
    />
  </div>
</template>

<script>
import ComplexWrite01 from "@/views/fields/template/ComplexWrite01.vue";

export default {
  components: {ComplexWrite01},
  computed: {
    fieldId() {
      return this.$route.params.fieldId;
    },
  },
  data() {
    return {
      form: {},
    }
  },
  methods: {
    onClickSave (option) { this.$emit('save', option) },
    onClickDelete (fieldId) { this.$emit('delete', fieldId) },
    onClickMoveList () { this.$emit('moveList') },
  }
}
</script>

<style scoped>

</style>
