<template>
  <div>
    Custom List <br>
    List.vue 를 삭제 하면, <br>
    공통으로 사용하는 목록 페이지를 사용할 수 있으며 <br>
    options.js Search.vue 를 활용 할 수 있게 된다.
  </div>
</template>

<script>
export default {
  name: "List",
  methods: {
    onClickNew() { this.$emit("moveCreate"); },
    onClickDetail(data) {
      const fieldId = data.id
      this.$emit("moveUpdate", fieldId);
    },
  }
}
</script>

<style scoped>

</style>
