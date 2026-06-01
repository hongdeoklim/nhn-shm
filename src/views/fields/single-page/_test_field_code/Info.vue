<template>
  <div>
    사업장 현황
  </div>
</template>

<script>
export default {
  name: "Info",
  computed: {
    projectId() {
      return this.$route.params.proj_id;
    },
    fieldCode() {
      return this.$route.params.fieldCode;
    },
  },
}
</script>

<style scoped>

</style>
